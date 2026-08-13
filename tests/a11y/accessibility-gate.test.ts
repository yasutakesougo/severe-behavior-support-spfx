import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const gateScript = path.join(repoRoot, "scripts/a11y/accessibility-gate.mjs");

function runGateProcess(): { status: number | null; stdout: string } {
  const result = spawnSync(process.execPath, [gateScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout ?? "" };
}

test("DADS-06 accessibility gate exits 0 on current shell baseline", () => {
  const { status, stdout } = runGateProcess();
  assert.equal(status, 0, stdout);
  assert.match(stdout, /Accessibility Gate PASS/);
});

test("DADS-06 INV-19 remains detectable as known_gap", () => {
  const { status, stdout } = runGateProcess();
  assert.equal(status, 0, stdout);
  assert.match(stdout, /\[PASS\] A11Y-HD-01 \(known_gap\).*INV-19/);
});

test("DADS-06 blocking primitive checks are present", () => {
  const { status, stdout } = runGateProcess();
  assert.equal(status, 0, stdout);
  for (const id of [
    "A11Y-KB-01",
    "A11Y-LIVE-01",
    "A11Y-SC-01",
    "A11Y-PRIM-01",
    "A11Y-PRIM-01-strip",
    "A11Y-FL-01",
    "A11Y-DIS-01",
    "A11Y-DESC-01",
  ]) {
    assert.match(stdout, new RegExp(`\\[PASS\\] ${id}\\b`), stdout);
  }
});
