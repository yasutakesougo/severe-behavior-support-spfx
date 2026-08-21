import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const script = path.resolve("scripts/ci/check-spfx-release-gate0.mjs");

function fixture(config: unknown, packageBytes: string | null = "fixture-sppkg") {
  const root = mkdtempSync(path.join(tmpdir(), "spfx-gate0-"));
  const configPath = path.join(root, "spfx", "config", "package-solution.json");
  const packagePath = path.join(root, "artifact.sppkg");
  mkdirSync(path.dirname(configPath), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  if (packageBytes !== null) {
    writeFileSync(packagePath, packageBytes, "utf8");
  }
  return { root, configPath, packagePath };
}

function validConfig(overrides: Record<string, unknown> = {}) {
  return {
    solution: {
      name: "fixture-client-side-solution",
      id: "4342db47-21a3-4c48-aed1-ef615f55c404",
      version: "1.0.0.0",
      skipFeatureDeployment: true,
      isDomainIsolated: false,
      features: [],
      ...overrides,
    },
    paths: {
      zippedPackage: "solution/fixture.sppkg",
    },
  };
}

function run(config: unknown, packageBytes: string | null = "fixture-sppkg") {
  const { root, configPath, packagePath } = fixture(config, packageBytes);
  const result = spawnSync(
    process.execPath,
    [script, "--config", configPath, "--sppkg", packagePath],
    { cwd: root, encoding: "utf8" },
  );
  return result;
}

test("passes deterministic GATE 0 subset and records package SHA-256", () => {
  const result = run(validConfig());
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.decision, "PASS_AUTOMATED_SUBSET");
  assert.equal(report.config.solution.skipFeatureDeployment, true);
  assert.equal(report.config.solution.isDomainIsolated, false);
  assert.match(report.package.sha256, /^[0-9a-f]{64}$/);
  assert.ok(report.explicitlyNotChecked.includes("live-tenant-access"));
});

test("blocks when explicit deployment flags are missing", () => {
  const config = validConfig();
  delete (config.solution as Record<string, unknown>).skipFeatureDeployment;
  delete (config.solution as Record<string, unknown>).isDomainIsolated;
  const result = run(config);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.decision, "BLOCKED");
  assert.ok(report.blockers.includes("solution.skipFeatureDeployment must be explicit boolean"));
  assert.ok(report.blockers.includes("solution.isDomainIsolated must be explicit boolean"));
});

test("blocks malformed or duplicate API permission requests", () => {
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
  assert.equal(report.decision, "BLOCKED");
  assert.ok(
    report.blockers.some((value: string) => value.includes("duplicate API permission request")),
  );
  assert.ok(
    report.blockers.some((value: string) => value.includes("must contain non-empty resource and scope")),
  );
});

test("warns on broad API scopes without silently granting GATE 2", () => {
  const result = run(
    validConfig({
      webApiPermissionRequests: [{ resource: "Microsoft Graph", scope: "Sites.Read.All" }],
    }),
  );
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.decision, "PASS_AUTOMATED_SUBSET");
  assert.equal(report.config.solution.webApiPermissionRequests[0].broad, true);
  assert.ok(report.warnings.some((value: string) => value.includes("least-privilege review")));
  assert.ok(report.explicitlyNotChecked.includes("tenant-wide-existing-api-grants"));
});

test("blocks when package artifact is missing because provenance cannot be established", () => {
  const result = run(validConfig(), null);
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout);
  assert.equal(report.decision, "BLOCKED");
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
  const written = JSON.parse(
    execFileSync(process.execPath, ["-e", `process.stdout.write(require('fs').readFileSync(${JSON.stringify(outPath)}, 'utf8'))`], {
      encoding: "utf8",
    }),
  );
  assert.equal(written.schemaVersion, "spfx-release-gate0-evidence@1.0.0");
});
