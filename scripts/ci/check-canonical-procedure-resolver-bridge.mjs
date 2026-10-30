#!/usr/bin/env node
/**
 * Canonical Procedure Resolver bridge drift guard (A2 / W2-A).
 * Regenerates .bundle.js via locked esbuild command and checks .bundle.d.ts export surface.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const esbuildBin = require.resolve("esbuild/bin/esbuild");

const ENTRY = "src/domain/canonical-procedure-resolver-spfx-entry.ts";
const OUT_JS = "spfx/src/sbs-domain/canonical-procedure-resolver.bundle.js";
const OUT_DTS = "spfx/src/sbs-domain/canonical-procedure-resolver.bundle.d.ts";

const ALLOWED_DTS_EXPORTS = new Set([
  "CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID",
  "CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION",
  "LocalDate",
  "ApprovedProcedureReference",
  "ScheduleItem",
  "ScheduledOccurrence",
  "SupportPlanVersion",
  "SupportPlanVersionProcedureBinding",
  "CanonicalProcedureProjection",
  "CanonicalProcedureResolutionQuery",
  "CanonicalProcedureCatalogEntry",
  "CanonicalProcedureUnresolvedReasonCode",
  "CanonicalProcedureResolutionOutcome",
  "validateCanonicalProcedureResolutionQuery",
  "validateCanonicalProcedureCatalogEntry",
  "buildCanonicalProcedureCatalogEntry",
  "resolveCanonicalProcedure",
  "resolveCanonicalProcedureFromEntities",
]);

const tmp = mkdtempSync(path.join(tmpdir(), "canonical-resolver-bridge-"));
const tmpOut = path.join(tmp, "canonical-procedure-resolver.bundle.js");

try {
  execFileSync(
    esbuildBin,
    [
      path.join(root, ENTRY),
      "--bundle",
      "--format=cjs",
      "--target=es2015",
      "--platform=neutral",
      `--outfile=${tmpOut}`,
      "--log-level=error",
    ],
    { cwd: root, stdio: "pipe" },
  );

  const committed = readFileSync(path.join(root, OUT_JS));
  const regenerated = readFileSync(tmpOut);
  if (!committed.equals(regenerated)) {
    console.error(
      `Bridge drift: ${OUT_JS} does not match regeneration from ${ENTRY}.\n` +
        `Re-run the locked esbuild command and commit canonical bytes.`,
    );
    process.exitCode = 1;
  } else {
    console.log(`OK: ${OUT_JS} matches regeneration`);
  }

  const dts = readFileSync(path.join(root, OUT_DTS), "utf8");
  const exportNames = new Set();
  for (const match of dts.matchAll(/^export (?:declare )?(?:async )?function ([A-Za-z0-9_]+)/gm)) {
    exportNames.add(match[1]);
  }
  for (const match of dts.matchAll(/^export (?:declare )?const ([A-Za-z0-9_]+)/gm)) {
    exportNames.add(match[1]);
  }
  for (const match of dts.matchAll(/^export type ([A-Za-z0-9_]+)/gm)) {
    exportNames.add(match[1]);
  }
  for (const match of dts.matchAll(/^export interface ([A-Za-z0-9_]+)/gm)) {
    exportNames.add(match[1]);
  }

  const unexpected = [...exportNames].filter((name) => !ALLOWED_DTS_EXPORTS.has(name)).sort();
  const missing = [...ALLOWED_DTS_EXPORTS].filter((name) => !exportNames.has(name)).sort();
  if (unexpected.length > 0 || missing.length > 0) {
    console.error(`Bridge .d.ts export surface mismatch for ${OUT_DTS}`);
    if (unexpected.length) console.error(`  unexpected: ${unexpected.join(", ")}`);
    if (missing.length) console.error(`  missing: ${missing.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${OUT_DTS} export surface equals allowlist`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
