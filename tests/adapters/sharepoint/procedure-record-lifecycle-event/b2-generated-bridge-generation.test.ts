import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

const require = createRequire(import.meta.url);
const repoRoot = process.cwd();

function findNamedFile(root: string, name: string): string | undefined {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const candidate = path.join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = findNamedFile(candidate, name);
      if (nested !== undefined) return nested;
    } else if (entry.isFile() && entry.name === name) {
      return candidate;
    }
  }
  return undefined;
}

function emitArtifact(label: string, content: string): void {
  const encoded = Buffer.from(content, "utf8").toString("base64");
  process.stdout.write(`${label}_BEGIN\n`);
  for (let offset = 0; offset < encoded.length; offset += 8000) {
    process.stdout.write(`${encoded.slice(offset, offset + 8000)}\n`);
  }
  process.stdout.write(`${label}_END\n`);
}

describe("B2 generated bridge production paths", () => {
  it("produces canonical JS and declaration artifacts with repository toolchain", () => {
    const work = mkdtempSync(path.join(tmpdir(), "b2-bridge-generation-"));
    try {
      const esbuild = require.resolve("esbuild/bin/esbuild");
      const lifecycleEntry = path.join(
        repoRoot,
        "src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts",
      );
      const lifecycleJs = path.join(work, "lifecycle-cancellation-storage.bundle.js");
      execFileSync(
        esbuild,
        [
          lifecycleEntry,
          "--bundle",
          "--format=cjs",
          "--target=es2015",
          "--platform=neutral",
          `--outfile=${lifecycleJs}`,
          "--log-level=error",
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const cancellationEntry = path.join(
        repoRoot,
        "src/domain/procedure-record-cancellation-staff-save.ts",
      );
      const cancellationJs = path.join(work, "cancellation-persist.bundle.js");
      execFileSync(
        esbuild,
        [
          cancellationEntry,
          "--bundle",
          "--format=cjs",
          "--target=es2015",
          "--platform=neutral",
          `--outfile=${cancellationJs}`,
          "--log-level=error",
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const declarations = path.join(work, "declarations");
      execFileSync(
        process.execPath,
        [
          require.resolve("typescript/bin/tsc"),
          "--declaration",
          "--emitDeclarationOnly",
          "--target",
          "ES2022",
          "--module",
          "ESNext",
          "--moduleResolution",
          "Bundler",
          "--strict",
          "--skipLibCheck",
          "--outDir",
          declarations,
          lifecycleEntry,
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );
      const lifecycleDts = findNamedFile(declarations, "spfx-test-harness-entry.d.ts");
      assert.ok(lifecycleDts, "declaration output must contain the canonical entry declaration");

      const lifecycleJsText = readFileSync(lifecycleJs, "utf8");
      const lifecycleDtsText = readFileSync(lifecycleDts, "utf8");
      const cancellationJsText = readFileSync(cancellationJs, "utf8");

      assert.match(lifecycleJsText, /createProcedureRecordCancellationSharePointStoragePort/);
      assert.match(lifecycleJsText, /bindProcedureRecordLifecycleEventList/);
      assert.match(lifecycleDtsText, /B2ProcedureRecordCancellationStoragePort/);
      assert.match(cancellationJsText, /createProcedureRecordCancellationPersistencePort/);

      emitArtifact("B2_LIFECYCLE_JS_BASE64", lifecycleJsText);
      emitArtifact("B2_LIFECYCLE_DTS_BASE64", lifecycleDtsText);
      emitArtifact("B2_CANCELLATION_JS_BASE64", cancellationJsText);
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  });
});
