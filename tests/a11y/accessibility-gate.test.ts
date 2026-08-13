import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const gateScript = path.join(repoRoot, "scripts/a11y/accessibility-gate.mjs");
const scaffoldPath = path.join(
  repoRoot,
  "spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx",
);

function runGateProcess(): { status: number | null; stdout: string } {
  const result = spawnSync(process.execPath, [gateScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout ?? "" };
}

test("DADS-06/UX-1 accessibility gate exits 0 on current shell baseline", () => {
  const { status, stdout } = runGateProcess();
  assert.equal(status, 0, stdout);
  assert.match(stdout, /Accessibility Gate PASS/);
});

test("DADS-UX-1 INV-19 host heading is resolved and A11Y-HD-01 is blocking PASS", () => {
  const { status, stdout } = runGateProcess();
  assert.equal(status, 0, stdout);
  assert.match(stdout, /\[PASS\] A11Y-HD-01 \(blocking\).*INV-19 resolved/);

  const scaffold = fs.readFileSync(scaffoldPath, "utf8");
  assert.match(scaffold, /data-shell-ux=["']shell-host-status["']/);
  assert.doesNotMatch(scaffold, /<h[1-6]\b[^>]*className=\{styles\.bodyTitle\}/);
  assert.doesNotMatch(scaffold, /<h[1-6]\b[\s\S]*ShellReadyTitle/);
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
    "A11Y-HD-01",
    "A11Y-HD-02",
    "A11Y-HD-03",
    "A11Y-HD-04",
    "A11Y-HD-05",
    "A11Y-OV-01",
    "A11Y-US-01",
    "A11Y-UD-01",
    "A11Y-RC-01",
    "A11Y-INV-07",
    "A11Y-INV-10",
    "A11Y-INV-17",
    "A11Y-INV-17-RC",
    "A11Y-DIS-02",
  ]) {
    assert.match(stdout, new RegExp(`\\[PASS\\] ${id}\\b`), stdout);
  }
});
