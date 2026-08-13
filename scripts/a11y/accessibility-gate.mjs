#!/usr/bin/env node
/**
 * DADS-06 Accessibility Gate — static source checks (no new npm dependencies).
 * Blocking failures exit non-zero. known_gap findings must remain detectable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const relExists = (relativePath) => fs.existsSync(path.join(repoRoot, relativePath));

const listFilesRecursive = (relativeDir, extensions) => {
  const abs = path.join(repoRoot, relativeDir);
  if (!fs.existsSync(abs)) {
    return [];
  }
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (extensions.some((ext) => entry.name.endsWith(ext))) {
        out.push(path.relative(repoRoot, full).split(path.sep).join("/"));
      }
    }
  };
  walk(abs);
  return out;
};

/**
 * @typedef {{ id: string, severity: 'blocking'|'advisory'|'known_gap', ok: boolean, detail: string }} GateFinding
 */

/** @returns {{ ok: boolean, findings: GateFinding[], summary: string }} */
export function runAccessibilityGate() {
  /** @type {GateFinding[]} */
  const findings = [];

  const push = (finding) => {
    findings.push(finding);
  };

  // --- A11Y-KB-01 / A11Y-PRIM-01 / A11Y-AN-01: SingleSelectListbox ---
  const listboxPath = "spfx/src/shell/primitives/SingleSelectListbox.tsx";
  if (!relExists(listboxPath)) {
    push({
      id: "A11Y-KB-01",
      severity: "blocking",
      ok: false,
      detail: `${listboxPath} missing`,
    });
  } else {
    const src = read(listboxPath);
    const keyCases = ["ArrowDown", "ArrowUp", "Home", "End", "Enter"].every((k) =>
      new RegExp(`case\\s+["']${k}["']`).test(src),
    );
    const spaceCase = /case\s+["'] ["']/.test(src) || /case\s+["']\\s["']/.test(src);
    const keys = keyCases && spaceCase;
    push({
      id: "A11Y-KB-01",
      severity: "blocking",
      ok: keys,
      detail: keys
        ? "SingleSelectListbox keyboard handlers present"
        : "SingleSelectListbox missing required keyboard handlers",
    });
    const hasListbox = /role=["']listbox["']/.test(src);
    const hasOption = /role=["']option["']/.test(src);
    // Same-element or nearby host must not be <button role="option"> (INV-10 hybrid).
    // Window is wide enough for real option attribute blocks (~350+ chars).
    const buttonOptionHybrid =
      /<button\b[^>]*\brole=["']option["']/i.test(src) ||
      /<button\b[\s\S]{0,800}?\brole=["']option["']/i.test(src) ||
      /role=["']option["'][\s\S]{0,200}?<button\b/i.test(src);
    const listboxOk = hasListbox && hasOption && !buttonOptionHybrid;
    push({
      id: "A11Y-PRIM-01",
      severity: "blocking",
      ok: listboxOk,
      detail: listboxOk
        ? "listbox/option semantics without button+option hybrid"
        : "listbox/option hybrid or missing roles",
    });
    const ariaLabelProp = /ariaLabel\s*:/.test(src) && /aria-label=\{ariaLabel\}/.test(src);
    push({
      id: "A11Y-AN-01",
      severity: "blocking",
      ok: ariaLabelProp,
      detail: ariaLabelProp
        ? "SingleSelectListbox requires ariaLabel → aria-label"
        : "SingleSelectListbox accessible name prop missing",
    });
  }

  // --- A11Y-PRIM-01 / A11Y-AN-01: SectionLabelStrip ---
  const stripPath = "spfx/src/shell/primitives/SectionLabelStrip.tsx";
  if (relExists(stripPath)) {
    const src = read(stripPath);
    const notTabs =
      !src.includes("tablist") &&
      !src.includes('role="tab"') &&
      !src.includes("role='tab'") &&
      src.includes("<span");
    const named = /ariaLabel\s*:/.test(src) && /aria-label=\{ariaLabel\}/.test(src);
    push({
      id: "A11Y-PRIM-01-strip",
      severity: "blocking",
      ok: notTabs && named,
      detail:
        notTabs && named
          ? "SectionLabelStrip is static labels with aria-label (not tabs)"
          : "SectionLabelStrip tab semantics or missing name",
    });
  } else {
    push({
      id: "A11Y-PRIM-01-strip",
      severity: "blocking",
      ok: false,
      detail: `${stripPath} missing`,
    });
  }

  // --- A11Y-LIVE-01: EmptyNotice ---
  const emptyPath = "spfx/src/shell/primitives/EmptyNotice.tsx";
  if (relExists(emptyPath)) {
    const src = read(emptyPath);
    const liveOk =
      /announce\s*\?\s*["']status["']/.test(src) &&
      /aria-live=\{announce\s*\?\s*["']polite["']/.test(src);
    push({
      id: "A11Y-LIVE-01",
      severity: "blocking",
      ok: liveOk,
      detail: liveOk
        ? "EmptyNotice announce → role=status + aria-live=polite"
        : "EmptyNotice live/status announcement contract broken",
    });
  } else {
    push({
      id: "A11Y-LIVE-01",
      severity: "blocking",
      ok: false,
      detail: `${emptyPath} missing`,
    });
  }

  // --- A11Y-SC-01: StatusBadge ---
  const badgePath = "spfx/src/shell/primitives/StatusBadge.tsx";
  if (relExists(badgePath)) {
    const src = read(badgePath);
    const labelRequired = /label\s*:\s*string/.test(src) && /\{label\}/.test(src);
    push({
      id: "A11Y-SC-01",
      severity: "blocking",
      ok: labelRequired,
      detail: labelRequired
        ? "StatusBadge requires label text (not color-only)"
        : "StatusBadge label meaning channel missing",
    });
  } else {
    push({
      id: "A11Y-SC-01",
      severity: "blocking",
      ok: false,
      detail: `${badgePath} missing`,
    });
  }

  // --- A11Y-DESC-01: StatusPanel KEEP ---
  const panelPath = "spfx/src/shell/ux/StatusPanel.tsx";
  if (relExists(panelPath)) {
    const src = read(panelPath);
    const rolesOk =
      src.includes('role="alert"') &&
      src.includes('role="status"') &&
      src.includes('aria-live="polite"');
    push({
      id: "A11Y-DESC-01",
      severity: "blocking",
      ok: rolesOk,
      detail: rolesOk
        ? "StatusPanel fail-closed alert/status roles present"
        : "StatusPanel alert/status contract missing",
    });
  } else {
    push({
      id: "A11Y-DESC-01",
      severity: "blocking",
      ok: false,
      detail: `${panelPath} missing`,
    });
  }

  // --- A11Y-FL-01: DailyRecords labels ---
  const recordsPath = "spfx/src/shell/records/DailyRecords.tsx";
  if (relExists(recordsPath)) {
    const src = read(recordsPath);
    const labelBlocks = (src.match(/<label[\s>]/g) || []).length;
    const inputs = (src.match(/<input\b/g) || []).length;
    const ok = inputs === 0 || labelBlocks >= inputs;
    push({
      id: "A11Y-FL-01",
      severity: "blocking",
      ok,
      detail: ok
        ? `DailyRecords label wrappers cover inputs (labels=${labelBlocks}, inputs=${inputs})`
        : `DailyRecords inputs without enough label wrappers (labels=${labelBlocks}, inputs=${inputs})`,
    });
  } else {
    push({
      id: "A11Y-FL-01",
      severity: "blocking",
      ok: false,
      detail: `${recordsPath} missing`,
    });
  }

  // --- A11Y-DIS-01: UserDetail disabled + aria-disabled ---
  const detailPath = "spfx/src/shell/users/UserDetail.tsx";
  if (relExists(detailPath)) {
    const src = read(detailPath);
    // Match attribute `disabled=` but not `aria-disabled=`.
    const disabledButtons = (src.match(/(?<![\w-])disabled=\{/g) || []).length;
    const ariaDisabled = (src.match(/aria-disabled=/g) || []).length;
    const ok = disabledButtons === 0 || ariaDisabled >= disabledButtons;
    push({
      id: "A11Y-DIS-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "UserDetail disabled actions pair with aria-disabled"
        : "UserDetail disabled without matching aria-disabled",
    });
  } else {
    push({
      id: "A11Y-DIS-01",
      severity: "blocking",
      ok: false,
      detail: `${detailPath} missing`,
    });
  }

  // --- A11Y-HD-01: INV-19 host heading pollution (blocking after DADS-UX-1) ---
  const scaffoldPath = "spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx";
  if (relExists(scaffoldPath)) {
    const src = read(scaffoldPath);
    const hostHeadingPollution =
      /<h[1-6]\b[^>]*className=\{styles\.bodyTitle\}/.test(src) ||
      (/<h[1-6]\b/.test(src) && src.includes("ShellReadyTitle"));
    const hostStatusCopy =
      /data-shell-ux=["']shell-host-status["']/.test(src) &&
      /className=\{styles\.bodyTitle\}/.test(src) &&
      !hostHeadingPollution;
    push({
      id: "A11Y-HD-01",
      severity: "blocking",
      ok: hostStatusCopy,
      detail: hostStatusCopy
        ? "INV-19 resolved: ScaffoldShell host bodyTitle is non-heading (shell-host-status)"
        : "INV-19 regression: ScaffoldShell host chrome must not use heading elements for bodyTitle",
    });
  } else {
    push({
      id: "A11Y-HD-01",
      severity: "blocking",
      ok: false,
      detail: `${scaffoldPath} missing — INV-19 host heading check cannot run`,
    });
  }

  // --- A11Y-FV-01: focus tokens + selector mix advisory ---
  const semanticPath = "spfx/src/shell/tokens/semantic.ts";
  const scssFiles = listFilesRecursive("spfx/src/shell", [".scss"]);
  let focusRules = 0;
  let focusVisibleRules = 0;
  for (const file of scssFiles) {
    const css = read(file);
    focusRules += (css.match(/(?<![a-z-]):focus\b(?!-)/g) || []).length;
    focusVisibleRules += (css.match(/:focus-visible\b/g) || []).length;
  }
  const tokensOk =
    relExists(semanticPath) && /SBS_FOCUS|focusRing|outlineWidth/.test(read(semanticPath));
  push({
    id: "A11Y-FV-01",
    severity: "advisory",
    ok: tokensOk,
    detail: tokensOk
      ? `Focus tokens present; shell SCSS :focus≈${focusRules}, :focus-visible≈${focusVisibleRules} (mass migration OUT)`
      : "Focus tokens missing",
  });

  // --- A11Y-MAN-01 deferred advisory marker ---
  push({
    id: "A11Y-MAN-01",
    severity: "advisory",
    ok: true,
    detail: "Deferred: full keyboard traversal covered by existing browser smokes / manual review",
  });

  const blockingFailed = findings.filter((f) => f.severity === "blocking" && !f.ok);
  const knownGapFailed = findings.filter((f) => f.severity === "known_gap" && !f.ok);
  const ok = blockingFailed.length === 0 && knownGapFailed.length === 0;
  const knownGapCount = findings.filter((f) => f.severity === "known_gap").length;
  const summary = ok
    ? `Accessibility Gate PASS (${findings.length} checks; blocking failures=0` +
      (knownGapCount > 0 ? `; known_gap detectable` : ``) +
      `)`
    : `Accessibility Gate FAIL (blocking=${blockingFailed.length}, known_gap_undetectable=${knownGapFailed.length})`;

  return { ok, findings, summary };
}

export function formatGateReport(result) {
  const lines = [result.summary, ""];
  for (const f of result.findings) {
    const mark = f.ok ? "PASS" : "FAIL";
    lines.push(`[${mark}] ${f.id} (${f.severity}): ${f.detail}`);
  }
  return lines.join("\n");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const result = runAccessibilityGate();
  console.log(formatGateReport(result));
  process.exit(result.ok ? 0 : 1);
}
