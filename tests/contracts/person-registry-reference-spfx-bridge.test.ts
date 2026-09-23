import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { format } from "prettier";

describe("person-registry reference SPFx bridge", () => {
  it("exposes only the canonical type contract", () => {
    const repoRoot = process.cwd();
    const entry = readFileSync(
      path.join(
        repoRoot,
        "src/integration/person-registry/person-registry-reference-spfx-entry.ts",
      ),
      "utf8",
    );
    const entryExports = entry
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("export "));
    assert.deepEqual(entryExports, [
      'export type { LegacyPersonMappingKey, ReverseLegacyResolution } from "./person-registry-reference";',
    ]);

    const declaration = readFileSync(
      path.join(repoRoot, "spfx/src/sbs-domain/person-registry-reference.bundle.d.ts"),
      "utf8",
    );
    const declarationExports = [...declaration.matchAll(/export type ([A-Za-z0-9_]+)/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(declarationExports, ["LegacyPersonMappingKey", "ReverseLegacyResolution"]);
    assert.doesNotMatch(declaration, /PersonRegistryReadPort|PERSON_REFERENCE_SCHEMA/);
  });

  it("regenerates the checked-in bundle byte-for-byte", async () => {
    const repoRoot = process.cwd();
    const require = createRequire(import.meta.url);
    const esbuildBin = require.resolve("esbuild/bin/esbuild");
    const tempDir = mkdtempSync(path.join(tmpdir(), "person-registry-reference-bridge-"));
    const generatedPath = path.join(tempDir, "person-registry-reference.bundle.js");

    try {
      execFileSync(
        esbuildBin,
        [
          "src/integration/person-registry/person-registry-reference-spfx-entry.ts",
          "--bundle",
          "--format=cjs",
          "--target=es2015",
          "--platform=neutral",
          `--outfile=${generatedPath}`,
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const generated = Buffer.from(
        await format(readFileSync(generatedPath, "utf8"), {
          parser: "babel",
          printWidth: 100,
        }),
      );
      const committed = readFileSync(
        path.join(repoRoot, "spfx/src/sbs-domain/person-registry-reference.bundle.js"),
      );
      assert.deepEqual(
        committed,
        generated,
        "checked-in person-registry bridge must equal canonical esbuild + Prettier regeneration",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("keeps canonical and SPFx declaration shapes mutually assignable", () => {
    const repoRoot = process.cwd();
    const tempDir = mkdtempSync(path.join(tmpdir(), "person-registry-reference-types-"));
    const compatibilityPath = path.join(tempDir, "compatibility.ts");
    const canonicalModule = JSON.stringify(
      path.join(repoRoot, "src/integration/person-registry/person-registry-reference"),
    );
    const spfxModule = JSON.stringify(
      path.join(repoRoot, "spfx/src/sbs-domain/person-registry-reference.bundle"),
    );

    try {
      writeFileSync(
        compatibilityPath,
        `import type { LegacyPersonMappingKey as CanonicalKey, ReverseLegacyResolution as CanonicalResolution } from ${canonicalModule};
import type { LegacyPersonMappingKey as SpfxKey, ReverseLegacyResolution as SpfxResolution } from ${spfxModule};

const canonicalKey: CanonicalKey = {} as SpfxKey;
const spfxKey: SpfxKey = {} as CanonicalKey;
const canonicalResolution: CanonicalResolution = {} as SpfxResolution;
const spfxResolution: SpfxResolution = {} as CanonicalResolution;
void canonicalKey;
void spfxKey;
void canonicalResolution;
void spfxResolution;
`,
      );

      execFileSync(
        path.join(repoRoot, "node_modules/.bin/tsc"),
        [
          "--noEmit",
          "--strict",
          "--skipLibCheck",
          "--target",
          "ES2022",
          "--module",
          "ESNext",
          "--moduleResolution",
          "node",
          compatibilityPath,
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
