#!/usr/bin/env node
/**
 * B2 lifecycle-cancellation-storage bridge drift guard.
 * Regenerates .js via the locked esbuild command and checks .d.ts export surface.
 * Does not invent a declaration emitter; .d.ts is allowlist-checked as the production artifact.
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

const ENTRY = "src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts";
const OUT_JS = "spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.js";
const OUT_DTS = "spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.d.ts";

const ALLOWED_DTS_EXPORTS = new Set([
  "ProcedureRecordLifecycleEventListBinding",
  "bindProcedureRecordLifecycleEventList",
  "isUsableProcedureRecordLifecycleEventListBinding",
  "PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID",
  "ProcedureRecordLifecycleEventPhysicalRow",
  "ProcedureRecordLifecycleEventTransportFailure",
  "ProcedureRecordLifecycleEventItemReadResult",
  "ProcedureRecordLifecycleEventItemCreateResult",
  "ProcedureRecordLifecycleEventSchemaReadResult",
  "ProcedureRecordLifecycleEventListTransport",
  "LookupResult",
  "ProcedureRecordCancellationAppendAttempt",
  "ProcedureRecordCancellationSharePointStoragePort",
  "createProcedureRecordCancellationSharePointStoragePort",
]);

const tmp = mkdtempSync(path.join(tmpdir(), "b2-lifecycle-bridge-"));
const tmpOut = path.join(tmp, "lifecycle-cancellation-storage.bundle.js");

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

  const compositionPath = path.join(
    root,
    "spfx/src/adapters/procedure-record-lifecycle-event/test-only-harness-composition.ts",
  );
  const webPartSources = [
    "spfx/src/webparts/lifecycleCreateTestHarness/LifecycleCreateTestHarnessWebPart.ts",
    "spfx/src/webparts/lifecycleCreateTestHarness/components/LifecycleCreateTestHarness.tsx",
  ].map((rel) => path.join(root, rel));

  for (const filePath of [compositionPath, ...webPartSources]) {
    const source = readFileSync(filePath, "utf8");
    if (
      source.includes("test-only-human-go-receipt-issuer") ||
      source.includes("issueLifecycleTestOnlyTrustedReceiptProvenance")
    ) {
      console.error(`Mint path leak: ${path.relative(root, filePath)} imports Human GO issuer`);
      process.exitCode = 1;
    }
  }
  if (!process.exitCode) {
    console.log("OK: harness composition/web part do not import Human GO issuer");
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
