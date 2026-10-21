import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { evaluatePilotScss } from "../../scripts/a11y/accessibility-gate.mjs";

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
    "A11Y-RV-01",
    "A11Y-INV-07",
    "A11Y-INV-10",
    "A11Y-INV-13-RV",
    "A11Y-INV-17",
    "A11Y-INV-17-RC",
    "A11Y-INV-17-RV",
    "A11Y-DIS-02",
    "A11Y-DIS-03",
    "A11Y-DIS-04",
    "A11Y-HD-06",
    "A11Y-HD-07",
    "A11Y-SP-01",
    "A11Y-HD-08",
    "A11Y-SPML-01",
    "A11Y-PILOT-01",
  ]) {
    assert.match(stdout, new RegExp(`\\[PASS\\] ${id}\\b`), stdout);
  }
  assert.match(stdout, /\[PASS\] A11Y-PILOT-01 \(blocking\)/, stdout);
});

test("A11Y-PILOT-01 detects missing tokens and raw hex without mutating source", () => {
  const good =
    '@use "../../../shell/tokens/sbs-tokens" as tokens;\n' +
    ".pilot { color: tokens.$color-text-primary; }\n";
  const missingTokens = ".pilot { color: tokens.$color-text-primary; }\n";
  const rawHex = '@use "../../../shell/tokens/sbs-tokens" as tokens;\n.pilot { color: #123456; }\n';

  assert.equal(evaluatePilotScss(good).ok, true);
  assert.equal(evaluatePilotScss(missingTokens).ok, false);
  assert.equal(evaluatePilotScss(rawHex).ok, false);

  const importLine = '@use "../../../shell/tokens/sbs-tokens" as sbs;\n';
  type PilotCase = Readonly<{
    id: string;
    snippet: string;
    usesTokens: boolean;
    hardcodedOutsideTheme: boolean;
    ok: boolean;
    omitImport?: boolean;
  }>;
  const cases: readonly PilotCase[] = [
    {
      id: "G",
      snippet: ".pilot { color: sbs.$color-text-primary; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "H3",
      snippet: ".pilot { color: #fff; }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "H4",
      snippet: ".pilot { color: #ffff; }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "H6",
      snippet: ".pilot { color: #ffffff; }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "H8",
      snippet: ".pilot { color: #ffffffff; }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "HM",
      snippet: ".pilot { background: linear-gradient(#fff, #ffffffff); }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "HW",
      snippet: ".pilot { color: var(--fallback, #ffff); }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "I5",
      snippet: ".pilot { color: #12345; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "I7",
      snippet: ".pilot { color: #1234567; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "I9",
      snippet: ".pilot { color: #123456789; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "CB",
      snippet: ".pilot { color: sbs.$color-text-primary; /* #fff */ }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "CL",
      snippet: ".pilot { color: sbs.$color-text-primary; } // #ffff",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "SI",
      snippet: "#abcd { color: sbs.$color-text-primary; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "SQ",
      snippet: 'a[href="#abc"] { color: sbs.$color-text-primary; }',
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "QS",
      snippet: ".pilot { content: '#ffff'; }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "QD",
      snippet: '.pilot { content: "#fff"; }',
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "UB",
      snippet: ".pilot { background-image: url(#abcd); }",
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "UQ",
      snippet: '.pilot { background-image: url("#ffffffff"); }',
      usesTokens: true,
      hardcodedOutsideTheme: false,
      ok: true,
    },
    {
      id: "UM",
      snippet: ".pilot { background: url(#abcd) #fff; }",
      usesTokens: true,
      hardcodedOutsideTheme: true,
      ok: false,
    },
    {
      id: "M",
      snippet: ".pilot { color: #fff; }",
      usesTokens: false,
      hardcodedOutsideTheme: true,
      ok: false,
      omitImport: true,
    },
    {
      id: "MN",
      snippet: ".pilot { color: inherit; }",
      usesTokens: false,
      hardcodedOutsideTheme: false,
      ok: false,
      omitImport: true,
    },
  ];

  for (const item of cases) {
    const css = item.omitImport ? item.snippet : `${importLine}${item.snippet}`;
    assert.deepEqual(
      evaluatePilotScss(css),
      {
        ok: item.ok,
        usesTokens: item.usesTokens,
        hardcodedOutsideTheme: item.hardcodedOutsideTheme,
      },
      item.id,
    );
  }
});
