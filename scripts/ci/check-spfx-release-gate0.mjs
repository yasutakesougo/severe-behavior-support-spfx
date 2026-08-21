#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_CONFIG = "spfx/config/package-solution.json";
const BROAD_SCOPE_PATTERNS = [/\.All$/i, /FullControl/i, /ReadWrite\.All$/i];

function parseArgs(argv) {
  const args = {
    config: DEFAULT_CONFIG,
    sppkg: null,
    out: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--config") {
      args.config = argv[++index] ?? "";
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

function normalizePermissionRequests(solution, blockers, warnings) {
  const raw = solution.webApiPermissionRequests;
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    blockers.push("webApiPermissionRequests must be an array when present");
    return [];
  }

  const permissions = [];
  const seen = new Set();

  for (const [index, entry] of raw.entries()) {
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

function inspectConfig(config, configPath) {
  const blockers = [];
  const warnings = [];

  if (!isRecord(config)) {
    return { blockers: ["package-solution.json root must be an object"], warnings, inspection: null };
  }
  if (!isRecord(config.solution)) {
    return { blockers: ["package-solution.json solution must be an object"], warnings, inspection: null };
  }

  const solution = config.solution;
  for (const field of ["name", "id", "version"]) {
    if (!isNonEmptyString(solution[field])) {
      blockers.push(`solution.${field} must be a non-empty string`);
    }
  }
  if (typeof solution.skipFeatureDeployment !== "boolean") {
    blockers.push("solution.skipFeatureDeployment must be explicit boolean");
  }
  if (typeof solution.isDomainIsolated !== "boolean") {
    blockers.push("solution.isDomainIsolated must be explicit boolean");
  }

  let features = [];
  if (solution.features !== undefined) {
    if (!Array.isArray(solution.features)) {
      blockers.push("solution.features must be an array when present");
    } else {
      features = solution.features.map((feature, index) => {
        if (!isRecord(feature)) {
          blockers.push(`solution.features[${index}] must be an object`);
          return { index, id: null, title: null, version: null };
        }
        return {
          index,
          id: isNonEmptyString(feature.id) ? feature.id.trim() : null,
          title: isNonEmptyString(feature.title) ? feature.title.trim() : null,
          version: isNonEmptyString(feature.version) ? feature.version.trim() : null,
        };
      });
    }
  }

  if (solution.skipFeatureDeployment === true && features.length > 0) {
    warnings.push(
      "skipFeatureDeployment=true with Feature Framework entries requires explicit deployment compatibility review",
    );
  }

  const permissions = normalizePermissionRequests(solution, blockers, warnings);

  const zippedPackage = isRecord(config.paths) && isNonEmptyString(config.paths.zippedPackage)
    ? config.paths.zippedPackage.trim()
    : null;
  if (zippedPackage === null) {
    blockers.push("paths.zippedPackage must be a non-empty string");
  }

  return {
    blockers,
    warnings,
    inspection: {
      configPath,
      solution: {
        name: isNonEmptyString(solution.name) ? solution.name.trim() : null,
        id: isNonEmptyString(solution.id) ? solution.id.trim() : null,
        version: isNonEmptyString(solution.version) ? solution.version.trim() : null,
        skipFeatureDeployment:
          typeof solution.skipFeatureDeployment === "boolean" ? solution.skipFeatureDeployment : null,
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

function resolveDefaultPackagePath(root, configPath, zippedPackage) {
  if (!zippedPackage) return null;
  const normalizedConfig = path.normalize(configPath);
  const configDir = path.dirname(normalizedConfig);
  const spfxDir = path.dirname(configDir);
  return path.join(root, spfxDir, "sharepoint", zippedPackage);
}

async function sha256File(filePath) {
  const data = await readFile(filePath);
  return createHash("sha256").update(data).digest("hex");
}

async function inspectPackage(packagePath) {
  try {
    const fileStat = await stat(packagePath);
    if (!fileStat.isFile()) {
      return { blocker: `SPFx package is not a file: ${packagePath}`, evidence: null };
    }
    return {
      blocker: null,
      evidence: {
        path: packagePath,
        bytes: fileStat.size,
        sha256: await sha256File(packagePath),
      },
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { blocker: `SPFx package not found: ${packagePath}`, evidence: null };
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  const configPath = path.resolve(root, args.config);

  let config;
  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    const reason = error instanceof SyntaxError ? "invalid JSON" : "unreadable";
    console.error(`SPFx GATE 0 BLOCKED: package-solution.json ${reason}: ${configPath}`);
    process.exit(1);
  }

  const configResult = inspectConfig(config, args.config);
  const blockers = [...configResult.blockers];
  const warnings = [...configResult.warnings];

  const defaultPackagePath = resolveDefaultPackagePath(
    root,
    args.config,
    configResult.inspection?.zippedPackage ?? null,
  );
  const packagePath = args.sppkg ? path.resolve(root, args.sppkg) : defaultPackagePath;

  let packageEvidence = null;
  if (packagePath === null) {
    blockers.push("SPFx package path cannot be resolved");
  } else {
    const packageResult = await inspectPackage(packagePath);
    if (packageResult.blocker) blockers.push(packageResult.blocker);
    packageEvidence = packageResult.evidence;
  }

  const report = {
    schemaVersion: "spfx-release-gate0-evidence@1.0.0",
    gate: "GATE_0_PACKAGE_INSPECTION",
    automatedScope: [
      "package-solution-json-shape",
      "skipFeatureDeployment",
      "webApiPermissionRequests",
      "isDomainIsolated",
      "features",
      "solution-version",
      "sppkg-sha256-provenance",
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
  if (args.out) {
    await writeFile(path.resolve(root, args.out), serialized, "utf8");
  }
  process.stdout.write(serialized);

  if (report.decision === "BLOCKED") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`SPFx GATE 0 inspection failed unexpectedly: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
