import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const script = path.resolve("scripts/ci/check-spfx-release-gate0.mjs");
const solutionId = "4342db47-21a3-4c48-aed1-ef615f55c404";

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(entries: Record<string, string>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(entries)) {
    const nameBytes = Buffer.from(name);
    const data = Buffer.from(text);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    localParts.push(local, nameBytes, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, nameBytes);
    offset += local.length + nameBytes.length + data.length;
  }
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(Object.keys(entries).length, 8);
  eocd.writeUInt16LE(Object.keys(entries).length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, ...centralParts, eocd]);
}

function appManifest(
  options: {
    permissions?: Array<{ resource: string; scope: string }>;
    skip?: boolean;
    isolated?: boolean;
  } = {},
) {
  const permissions = options.permissions ?? [];
  const permissionXml = permissions.length
    ? `<WebApiPermissionRequests>${permissions
        .map(
          ({ resource, scope }) =>
            `<WebApiPermissionRequest ResourceId="${resource}" Scope="${scope}"/>`,
        )
        .join("")}</WebApiPermissionRequests>`
    : "";
  return `<?xml version="1.0" encoding="utf-8"?><App Name="fixture-client-side-solution" ProductID="${solutionId}" Version="1.0.0.0" SkipFeatureDeployment="${options.skip ?? true}" IsDomainIsolated="${options.isolated ?? false}">${permissionXml}</App>`;
}

function featureManifest(
  overrides: Partial<{ id: string; title: string; version: string }> = {},
) {
  const id = overrides.id ?? "34cf0c0f-1829-48f8-b907-4cb4a2722634";
  const title = overrides.title ?? "Fixture Feature";
  const version = overrides.version ?? "1.0.0.0";
  return `<Feature Id="${id}" Title="${title}" Version="${version}"></Feature>`;
}

function sppkg(
  options: {
    permissions?: Array<{ resource: string; scope: string }>;
    feature?: string | null;
  } = {},
) {
  const entries: Record<string, string> = { "AppManifest.xml": appManifest(options) };
  if (options.feature !== null) {
    entries["feature_34cf0c0f-1829-48f8-b907-4cb4a2722634.xml"] =
      options.feature ?? featureManifest();
  }
  return zip(entries);
}

function validConfig(overrides: Record<string, unknown> = {}) {
  return {
    solution: {
      name: "fixture-client-side-solution",
      id: solutionId,
      version: "1.0.0.0",
      skipFeatureDeployment: true,
      isDomainIsolated: false,
      features: [
        {
          id: "34cf0c0f-1829-48f8-b907-4cb4a2722634",
          title: "Fixture Feature",
          version: "1.0.0.0",
        },
      ],
      ...overrides,
    },
    paths: { zippedPackage: "solution/fixture.sppkg" },
  };
}

function fixture(config: unknown, packageBytes: Buffer | null = sppkg()) {
  const root = mkdtempSync(path.join(tmpdir(), "spfx-gate0-"));
  const configPath = path.join(root, "spfx", "config", "package-solution.json");
  const packagePath = path.join(root, "artifact.sppkg");
  mkdirSync(path.dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  if (packageBytes !== null) writeFileSync(packagePath, packageBytes);
  return { root, configPath, packagePath };
}

function run(config: unknown, packageBytes: Buffer | null = sppkg()) {
  const { root, configPath, packagePath } = fixture(config, packageBytes);
  return spawnSync(process.execPath, [script, "--config", configPath, "--sppkg", packagePath], {
    cwd: root,
    encoding: "utf8",
  });
}

test("passes source plus packaged GATE 0 subset and records SHA-256", () => {
  const result = run(validConfig());
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.decision, "PASS_AUTOMATED_SUBSET");
  assert.equal(report.inspectionMode, "SOURCE_AND_SPPKG");
  assert.equal(report.package.manifest.solution.skipFeatureDeployment, true);
  assert.match(report.package.sha256, /^[0-9a-f]{64}$/);
});

test("directly inspects a commercial-style sppkg without source config", () => {
  const root = mkdtempSync(path.join(tmpdir(), "spfx-gate0-commercial-"));
  const packagePath = path.join(root, "vendor.sppkg");
  writeFileSync(
    packagePath,
    sppkg({ permissions: [{ resource: "Microsoft Graph", scope: "Sites.Read.All" }] }),
  );
  const result = spawnSync(process.execPath, [script, "--sppkg", packagePath], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.inspectionMode, "SPPKG_DIRECT");
  assert.equal(report.config, null);
  assert.equal(report.package.manifest.solution.webApiPermissionRequests[0].scope, "Sites.Read.All");
  assert.ok(report.warnings.some((value: string) => value.includes("least-privilege review")));
});

test("blocks when explicit deployment flags are missing from source config", () => {
  const config = validConfig();
  delete (config.solution as Record<string, unknown>).skipFeatureDeployment;
  delete (config.solution as Record<string, unknown>).isDomainIsolated;
  const result = run(config);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.ok(report.blockers.includes("solution.skipFeatureDeployment must be explicit boolean"));
  assert.ok(report.blockers.includes("solution.isDomainIsolated must be explicit boolean"));
});

test("blocks malformed or duplicate source API permission requests", () => {
  const result = run(
    validConfig({
      webApiPermissionRequests: [
        { resource: "Microsoft Graph", scope: "User.Read" },
        { resource: "Microsoft Graph", scope: "User.Read" },
        { resource: "Microsoft Graph", scope: "" },
      ],
    }),
  );
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.ok(report.blockers.some((value: string) => value.includes("duplicate API permission request")));
  assert.ok(report.blockers.some((value: string) => value.includes("non-empty resource and scope")));
});

test("blocks invalid feature fields instead of recording nulls", () => {
  const result = run(
    validConfig({ features: [{ id: "", title: "Fixture Feature", version: "1.0.0.0" }] }),
  );
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.ok(report.blockers.includes("solution.features[0].id must be a non-empty string"));
});

test("blocks malformed packaged feature metadata", () => {
  const root = mkdtempSync(path.join(tmpdir(), "spfx-gate0-feature-"));
  const packagePath = path.join(root, "vendor.sppkg");
  writeFileSync(packagePath, sppkg({ feature: '<Feature Id="x" Title="" Version="1.0.0.0" />' }));
  const result = spawnSync(process.execPath, [script, "--sppkg", packagePath], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.ok(report.blockers.some((value: string) => value.includes(".title must be a non-empty string")));
});

test("blocks when package artifact is missing because provenance cannot be established", () => {
  const result = run(validConfig(), null);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.ok(report.blockers.some((value: string) => value.includes("SPFx package not found")));
  assert.equal(report.package, null);
});

test("writes machine-readable evidence when --out is supplied", () => {
  const { root, configPath, packagePath } = fixture(validConfig());
  const outPath = path.join(root, "evidence", "gate0.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  execFileSync(
    process.execPath,
    [script, "--config", configPath, "--sppkg", packagePath, "--out", outPath],
    { cwd: root, encoding: "utf8" },
  );
  const written = JSON.parse(readFileSync(outPath, "utf8"));
  assert.equal(written.schemaVersion, "spfx-release-gate0-evidence@1.1.0");
});
