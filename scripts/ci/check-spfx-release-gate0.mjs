#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { inflateRawSync } from "node:zlib";

const DEFAULT_CONFIG = "spfx/config/package-solution.json";
const BROAD_SCOPE_PATTERNS = [/\.All$/i, /FullControl/i, /ReadWrite\.All$/i];

function parseArgs(argv) {
  const args = { config: DEFAULT_CONFIG, configExplicit: false, sppkg: null, out: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--config") {
      args.config = argv[++index] ?? "";
      args.configExplicit = true;
      continue;
    }
    if (token === "--sppkg") {
      args.sppkg = argv[++index] ?? "";
      continue;
    }
    if (token === "--out") {
      args.out = argv[++index] ?? "";
      continue;
    }
    if (token === "--help") {
      console.log(
        "Usage: node scripts/ci/check-spfx-release-gate0.mjs [--config path] [--sppkg path] [--out path]",
      );
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  if (!args.config) throw new Error("--config requires a path");
  if (args.sppkg === "") throw new Error("--sppkg requires a path");
  if (args.out === "") throw new Error("--out requires a path");
  return args;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function unique(values) {
  return [...new Set(values)];
}

function decodeXml(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function xmlAttribute(xml, name) {
  const match = xml.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
  return match ? decodeXml(match[1]) : null;
}

function normalizePermissionEntries(entries, blockers, warnings) {
  const permissions = [];
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    if (!isRecord(entry) || !isNonEmptyString(entry.resource) || !isNonEmptyString(entry.scope)) {
      blockers.push(`webApiPermissionRequests[${index}] must contain non-empty resource and scope`);
      continue;
    }
    const resource = entry.resource.trim();
    const scope = entry.scope.trim();
    const key = `${resource}\u001f${scope}`;
    if (seen.has(key)) {
      blockers.push(`duplicate API permission request: ${resource} / ${scope}`);
      continue;
    }
    seen.add(key);
    const broad = BROAD_SCOPE_PATTERNS.some((pattern) => pattern.test(scope));
    if (broad) {
      warnings.push(`broad API permission requires least-privilege review: ${resource} / ${scope}`);
    }
    permissions.push({ resource, scope, broad });
  }
  return permissions;
}

function normalizePermissionRequests(solution, blockers, warnings) {
  const raw = solution.webApiPermissionRequests;
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    blockers.push("webApiPermissionRequests must be an array when present");
    return [];
  }
  return normalizePermissionEntries(raw, blockers, warnings);
}

function inspectFeatures(raw, blockers) {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    blockers.push("solution.features must be an array when present");
    return [];
  }
  return raw.map((feature, index) => {
    if (!isRecord(feature)) {
      blockers.push(`solution.features[${index}] must be an object`);
      return { index, id: null, title: null, version: null };
    }
    const normalized = {
      index,
      id: isNonEmptyString(feature.id) ? feature.id.trim() : null,
      title: isNonEmptyString(feature.title) ? feature.title.trim() : null,
      version: isNonEmptyString(feature.version) ? feature.version.trim() : null,
    };
    for (const field of ["id", "title", "version"]) {
      if (normalized[field] === null) {
        blockers.push(`solution.features[${index}].${field} must be a non-empty string`);
      }
    }
    return normalized;
  });
}

function inspectConfig(config, configPath) {
  const blockers = [];
  const warnings = [];
  if (!isRecord(config)) {
    return {
      blockers: ["package-solution.json root must be an object"],
      warnings,
      inspection: null,
    };
  }
  if (!isRecord(config.solution)) {
    return {
      blockers: ["package-solution.json solution must be an object"],
      warnings,
      inspection: null,
    };
  }
  const solution = config.solution;
  for (const field of ["name", "id", "version"]) {
    if (!isNonEmptyString(solution[field]))
      blockers.push(`solution.${field} must be a non-empty string`);
  }
  if (typeof solution.skipFeatureDeployment !== "boolean") {
    blockers.push("solution.skipFeatureDeployment must be explicit boolean");
  }
  if (typeof solution.isDomainIsolated !== "boolean") {
    blockers.push("solution.isDomainIsolated must be explicit boolean");
  }
  const features = inspectFeatures(solution.features, blockers);
  if (solution.skipFeatureDeployment === true && features.length > 0) {
    warnings.push(
      "skipFeatureDeployment=true with Feature Framework entries requires explicit deployment compatibility review",
    );
  }
  const permissions = normalizePermissionRequests(solution, blockers, warnings);
  const zippedPackage =
    isRecord(config.paths) && isNonEmptyString(config.paths.zippedPackage)
      ? config.paths.zippedPackage.trim()
      : null;
  if (zippedPackage === null) blockers.push("paths.zippedPackage must be a non-empty string");
  return {
    blockers,
    warnings,
    inspection: {
      source: "package-solution.json",
      configPath,
      solution: {
        name: isNonEmptyString(solution.name) ? solution.name.trim() : null,
        id: isNonEmptyString(solution.id) ? solution.id.trim() : null,
        version: isNonEmptyString(solution.version) ? solution.version.trim() : null,
        skipFeatureDeployment:
          typeof solution.skipFeatureDeployment === "boolean"
            ? solution.skipFeatureDeployment
            : null,
        isDomainIsolated:
          typeof solution.isDomainIsolated === "boolean" ? solution.isDomainIsolated : null,
        featureCount: features.length,
        features,
        webApiPermissionRequests: permissions,
      },
      zippedPackage,
    },
  };
}

function findEndOfCentralDirectory(buffer) {
  const minimum = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  return -1;
}

function readZipEntries(buffer) {
  const eocd = findEndOfCentralDirectory(buffer);
  if (eocd < 0) throw new Error("invalid ZIP: end-of-central-directory not found");
  const entryCount = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();
  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("invalid ZIP: central-directory entry not found");
    }
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`invalid ZIP: local header missing for ${name}`);
    }
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
    let data;
    if (method === 0) data = compressed;
    else if (method === 8) data = inflateRawSync(compressed);
    else throw new Error(`unsupported ZIP compression method ${method} for ${name}`);
    entries.set(name, data);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function parseSppkgManifest(entries, blockers, warnings) {
  const appManifest = entries.get("AppManifest.xml");
  if (!appManifest) {
    blockers.push("SPFx package missing AppManifest.xml");
    return null;
  }
  const xml = appManifest.toString("utf8");
  const appTag = xml.match(/<App\b([^>]*)>/i)?.[1] ?? "";
  const name = xmlAttribute(appTag, "Name");
  const id = xmlAttribute(appTag, "ProductID");
  const version = xmlAttribute(appTag, "Version");
  const skipText = xmlAttribute(appTag, "SkipFeatureDeployment");
  const isolatedText = xmlAttribute(appTag, "IsDomainIsolated");
  for (const [field, value] of [
    ["name", name],
    ["id", id],
    ["version", version],
  ]) {
    if (!isNonEmptyString(value)) blockers.push(`sppkg AppManifest.${field} must be present`);
  }
  const parseBoolean = (value, field) => {
    if (value === "true") return true;
    if (value === "false") return false;
    blockers.push(`sppkg AppManifest.${field} must be explicit boolean`);
    return null;
  };
  const skipFeatureDeployment = parseBoolean(skipText, "SkipFeatureDeployment");
  const isDomainIsolated = parseBoolean(isolatedText, "IsDomainIsolated");
  const rawPermissions = [...xml.matchAll(/<WebApiPermissionRequest\b([^>]*)\/?\s*>/gi)].map(
    (match) => ({
      resource: xmlAttribute(match[1], "ResourceId"),
      scope: xmlAttribute(match[1], "Scope"),
    }),
  );
  const permissions = normalizePermissionEntries(rawPermissions, blockers, warnings);
  const featureFiles = [...entries.keys()].filter((file) =>
    /^feature_[0-9a-f-]+\.xml$/i.test(file),
  );
  const features = featureFiles.map((file, index) => {
    const featureXml = entries.get(file).toString("utf8");
    const featureTag = featureXml.match(/<Feature\b([^>]*)>/i)?.[1] ?? "";
    const feature = {
      index,
      id: xmlAttribute(featureTag, "Id"),
      title: xmlAttribute(featureTag, "Title"),
      version: xmlAttribute(featureTag, "Version"),
    };
    for (const field of ["id", "title", "version"]) {
      if (!isNonEmptyString(feature[field])) {
        blockers.push(`sppkg ${file}.${field} must be a non-empty string`);
      }
    }
    return feature;
  });
  if (skipFeatureDeployment === true && features.length > 0) {
    warnings.push(
      "skipFeatureDeployment=true with packaged Feature Framework entries requires explicit deployment compatibility review",
    );
  }
  return {
    source: "sppkg",
    solution: {
      name,
      id,
      version,
      skipFeatureDeployment,
      isDomainIsolated,
      featureCount: features.length,
      features,
      webApiPermissionRequests: permissions,
    },
  };
}

function resolveDefaultPackagePath(root, configPath, zippedPackage) {
  if (!zippedPackage) return null;
  const absoluteConfig = path.isAbsolute(configPath)
    ? path.normalize(configPath)
    : path.resolve(root, configPath);
  const spfxDir = path.dirname(path.dirname(absoluteConfig));
  return path.join(spfxDir, "sharepoint", zippedPackage);
}

function compareConfigAndPackage(config, packaged, blockers) {
  if (!config || !packaged) return;
  for (const field of ["name", "id", "version", "skipFeatureDeployment", "isDomainIsolated"]) {
    if (config.solution[field] !== packaged.solution[field])
      blockers.push(`source/package mismatch for solution.${field}`);
  }
  const permissionKey = (entry) => `${entry.resource}\u001f${entry.scope}`;
  const fromConfig = config.solution.webApiPermissionRequests.map(permissionKey).sort();
  const fromPackage = packaged.solution.webApiPermissionRequests.map(permissionKey).sort();
  if (JSON.stringify(fromConfig) !== JSON.stringify(fromPackage)) {
    blockers.push("source/package mismatch for webApiPermissionRequests");
  }
}

async function inspectPackage(packagePath, blockers, warnings) {
  try {
    const fileStat = await stat(packagePath);
    if (!fileStat.isFile()) {
      blockers.push(`SPFx package is not a file: ${packagePath}`);
      return null;
    }
    const data = await readFile(packagePath);
    let packagedManifest = null;
    try {
      packagedManifest = parseSppkgManifest(readZipEntries(data), blockers, warnings);
    } catch (error) {
      blockers.push(
        `SPFx package cannot be inspected: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return {
      path: packagePath,
      bytes: fileStat.size,
      sha256: createHash("sha256").update(data).digest("hex"),
      manifest: packagedManifest,
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      blockers.push(`SPFx package not found: ${packagePath}`);
      return null;
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  const packageOnly = Boolean(args.sppkg && !args.configExplicit);
  let configResult = { blockers: [], warnings: [], inspection: null };
  if (!packageOnly) {
    const configPath = path.resolve(root, args.config);
    try {
      const config = JSON.parse(await readFile(configPath, "utf8"));
      configResult = inspectConfig(config, args.config);
    } catch (error) {
      const reason = error instanceof SyntaxError ? "invalid JSON" : "unreadable";
      configResult.blockers.push(`package-solution.json ${reason}: ${configPath}`);
    }
  }
  const blockers = [...configResult.blockers];
  const warnings = [...configResult.warnings];
  const defaultPackagePath = resolveDefaultPackagePath(
    root,
    args.config,
    configResult.inspection?.zippedPackage ?? null,
  );
  const packagePath = args.sppkg ? path.resolve(root, args.sppkg) : defaultPackagePath;
  let packageEvidence = null;
  if (packagePath === null) blockers.push("SPFx package path cannot be resolved");
  else packageEvidence = await inspectPackage(packagePath, blockers, warnings);
  compareConfigAndPackage(configResult.inspection, packageEvidence?.manifest ?? null, blockers);
  const report = {
    schemaVersion: "spfx-release-gate0-evidence@1.1.0",
    gate: "GATE_0_PACKAGE_INSPECTION",
    inspectionMode: packageOnly ? "SPPKG_DIRECT" : "SOURCE_AND_SPPKG",
    automatedScope: [
      "package-solution-json-shape-when-source-available",
      "sppkg-appmanifest",
      "skipFeatureDeployment",
      "webApiPermissionRequests",
      "isDomainIsolated",
      "features",
      "solution-version",
      "sppkg-sha256-provenance",
      "source-package-consistency-when-source-available",
    ],
    explicitlyNotChecked: [
      "tenant-wide-existing-api-grants",
      "admin-consent-state",
      "live-tenant-access",
      "runtime-network-destinations",
      "production-binding",
      "deployment",
    ],
    decision: blockers.length === 0 ? "PASS_AUTOMATED_SUBSET" : "BLOCKED",
    blockers: unique(blockers),
    warnings: unique(warnings),
    config: configResult.inspection,
    package: packageEvidence,
  };
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (args.out) await writeFile(path.resolve(root, args.out), serialized, "utf8");
  process.stdout.write(serialized);
  if (report.decision === "BLOCKED") process.exitCode = 1;
}

main().catch((error) => {
  console.error(
    `SPFx GATE 0 inspection failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
