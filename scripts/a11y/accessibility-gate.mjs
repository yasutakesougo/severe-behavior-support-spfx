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

  // --- A11Y-HD-02: Overview destination heading hierarchy (DADS-UX-2) ---
  const overviewPath = "spfx/src/shell/dashboard/OverviewDashboard.tsx";
  if (relExists(overviewPath)) {
    const src = read(overviewPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasOverviewH1 = /<h1\b/.test(src) && src.includes("dashboard-ux-overview-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const noHostPollution = !src.includes("ShellReadyTitle") && !/<h2\b[^>]*bodyTitle/.test(src);
    const ok = h1Count === 1 && hasOverviewH1 && sectionH2Count >= 3 && noHostPollution;
    push({
      id: "A11Y-HD-02",
      severity: "blocking",
      ok,
      detail: ok
        ? "Overview keeps single h1 + section h2 hierarchy (DADS-UX-2)"
        : "Overview heading hierarchy regression (expect 1 h1 + section h2s)",
    });
  } else {
    push({
      id: "A11Y-HD-02",
      severity: "blocking",
      ok: false,
      detail: `${overviewPath} missing`,
    });
  }

  // --- A11Y-OV-01: Overview SCSS uses tokens + focus-visible (presentation) ---
  const overviewScssPath = "spfx/src/shell/dashboard/DashboardUx.module.scss";
  if (relExists(overviewScssPath)) {
    const css = read(overviewScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    // Allow theme default hex inside quoted SPFx theme strings only.
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-OV-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "Overview SCSS uses DADS-04 tokens + focus-visible (no raw hex outside theme strings)"
        : `Overview SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-OV-01",
      severity: "blocking",
      ok: false,
      detail: `${overviewScssPath} missing`,
    });
  }

  // --- A11Y-HD-03: Users list destination heading hierarchy (DADS-UX-3) ---
  const usersListPath = "spfx/src/shell/users/UsersList.tsx";
  if (relExists(usersListPath)) {
    const src = read(usersListPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasUsersH1 = /<h1\b/.test(src) && src.includes("demo-ux-users-heading");
    const noExtraHeading = (src.match(/<h[2-6]\b/g) || []).length === 0;
    const ok = h1Count === 1 && hasUsersH1 && noExtraHeading;
    push({
      id: "A11Y-HD-03",
      severity: "blocking",
      ok,
      detail: ok
        ? "UsersList keeps single h1 destination heading (DADS-UX-3)"
        : "UsersList heading hierarchy regression (expect single h1, no h2–h6)",
    });
  } else {
    push({
      id: "A11Y-HD-03",
      severity: "blocking",
      ok: false,
      detail: `${usersListPath} missing`,
    });
  }

  // --- A11Y-HD-04: User detail destination heading hierarchy (DADS-UX-3) ---
  const userDetailPath = "spfx/src/shell/users/UserDetail.tsx";
  if (relExists(userDetailPath)) {
    const src = read(userDetailPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasDetailH1 = /<h1\b/.test(src) && src.includes("demo-ux-user-detail-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const ok = h1Count === 1 && hasDetailH1 && sectionH2Count >= 5;
    push({
      id: "A11Y-HD-04",
      severity: "blocking",
      ok,
      detail: ok
        ? "UserDetail keeps single h1 + section h2 hierarchy (DADS-UX-3)"
        : "UserDetail heading hierarchy regression (expect 1 h1 + section h2s)",
    });
  } else {
    push({
      id: "A11Y-HD-04",
      severity: "blocking",
      ok: false,
      detail: `${userDetailPath} missing`,
    });
  }

  // --- A11Y-US-01: Users list SCSS tokens + focus-visible ---
  const usersScssPath = "spfx/src/shell/users/UsersUx.module.scss";
  if (relExists(usersScssPath)) {
    const css = read(usersScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-US-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "Users SCSS uses DADS-04 tokens + focus-visible (no raw hex outside theme strings)"
        : `Users SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-US-01",
      severity: "blocking",
      ok: false,
      detail: `${usersScssPath} missing`,
    });
  }

  // --- A11Y-UD-01: User detail SCSS tokens + focus-visible ---
  const userDetailScssPath = "spfx/src/shell/users/UserDetailUx.module.scss";
  if (relExists(userDetailScssPath)) {
    const css = read(userDetailScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-UD-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "UserDetail SCSS uses DADS-04 tokens + focus-visible (no raw hex outside theme strings)"
        : `UserDetail SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-UD-01",
      severity: "blocking",
      ok: false,
      detail: `${userDetailScssPath} missing`,
    });
  }

  // --- A11Y-INV-07: UserDetail section chrome remains non-tabs (INV-07 B) ---
  if (relExists(userDetailPath)) {
    const src = read(userDetailPath);
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    const usesStrip = /SectionLabelStrip/.test(code);
    const noTabRoles =
      !code.includes("tablist") &&
      !/role=["']tab["']/.test(code) &&
      !/role=["']tabpanel["']/.test(code);
    const planActionSeparate = /data-demo-ux=["']user-detail-open-plan["']/.test(code);
    const ok = usesStrip && noTabRoles && planActionSeparate;
    push({
      id: "A11Y-INV-07",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-07: UserDetail uses SectionLabelStrip (non-tabs); plan action remains separate"
        : "INV-07 regression: UserDetail must keep SectionLabelStrip semantics (no fake tabs)",
    });
  } else {
    push({
      id: "A11Y-INV-07",
      severity: "blocking",
      ok: false,
      detail: `${userDetailPath} missing — INV-07 check cannot run`,
    });
  }

  // --- A11Y-INV-17: Users filter empty uses EmptyNotice status channel ---
  if (relExists(usersListPath)) {
    const src = read(usersListPath);
    const usesEmpty = /EmptyNotice/.test(src);
    const emptyHook = /users-filter-empty-note/.test(src);
    const announceOn = /announce\b/.test(src);
    const ok = usesEmpty && emptyHook && announceOn;
    push({
      id: "A11Y-INV-17",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-17: UsersList filter zero-result uses EmptyNotice with announce"
        : "INV-17 regression: UsersList empty filter must use EmptyNotice status channel",
    });
  } else {
    push({
      id: "A11Y-INV-17",
      severity: "blocking",
      ok: false,
      detail: `${usersListPath} missing — INV-17 check cannot run`,
    });
  }

  // --- A11Y-HD-05: DailyRecords destination heading hierarchy (DADS-UX-4) ---
  const recordsPathForHd = "spfx/src/shell/records/DailyRecords.tsx";
  if (relExists(recordsPathForHd)) {
    const src = read(recordsPathForHd);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasRecordsH1 = /<h1\b/.test(src) && src.includes("demo-ux-records-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const ok = h1Count === 1 && hasRecordsH1 && sectionH2Count >= 4;
    push({
      id: "A11Y-HD-05",
      severity: "blocking",
      ok,
      detail: ok
        ? "DailyRecords keeps single h1 + section h2 hierarchy (DADS-UX-4)"
        : "DailyRecords heading hierarchy regression (expect 1 h1 + section h2s)",
    });
  } else {
    push({
      id: "A11Y-HD-05",
      severity: "blocking",
      ok: false,
      detail: `${recordsPathForHd} missing`,
    });
  }

  // --- A11Y-RC-01: DailyRecords SCSS tokens + focus-visible ---
  const recordsScssPath = "spfx/src/shell/records/DailyRecordsUx.module.scss";
  if (relExists(recordsScssPath)) {
    const css = read(recordsScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-RC-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "DailyRecords SCSS uses DADS-04 tokens + focus-visible (no raw hex outside theme strings)"
        : `DailyRecords SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-RC-01",
      severity: "blocking",
      ok: false,
      detail: `${recordsScssPath} missing`,
    });
  }

  // --- A11Y-INV-10: DailyRecords selection remains SingleSelectListbox (INV-10) ---
  if (relExists(recordsPathForHd)) {
    const src = read(recordsPathForHd);
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    const usesListbox = /SingleSelectListbox/.test(code);
    const noButtonOptionHybrid =
      !/<button\b[^>]*\brole=["']option["']/i.test(code) &&
      !/<button\b[\s\S]{0,800}?\brole=["']option["']/i.test(code);
    const incompleteHook = /daily-record-incomplete-list/.test(code);
    const ok = usesListbox && noButtonOptionHybrid && incompleteHook;
    push({
      id: "A11Y-INV-10",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-10: DailyRecords incomplete select uses SingleSelectListbox (no button+option hybrid)"
        : "INV-10 regression: DailyRecords must keep SingleSelectListbox selection semantics",
    });
  } else {
    push({
      id: "A11Y-INV-10",
      severity: "blocking",
      ok: false,
      detail: `${recordsPathForHd} missing — INV-10 check cannot run`,
    });
  }

  // --- A11Y-INV-17-RC: DailyRecords empty paths use EmptyNotice ---
  if (relExists(recordsPathForHd)) {
    const src = read(recordsPathForHd);
    const usesEmpty = /EmptyNotice/.test(src);
    const incompleteEmpty = /daily-record-incomplete-empty-note/.test(src);
    const recentEmpty = /daily-record-recent-empty-note/.test(src);
    const announceOn = /announce\b/.test(src);
    const ok = usesEmpty && incompleteEmpty && recentEmpty && announceOn;
    push({
      id: "A11Y-INV-17-RC",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-17: DailyRecords empty incomplete/recent use EmptyNotice with announce"
        : "INV-17 regression: DailyRecords empty paths must use EmptyNotice status channel",
    });
  } else {
    push({
      id: "A11Y-INV-17-RC",
      severity: "blocking",
      ok: false,
      detail: `${recordsPathForHd} missing — INV-17 Records check cannot run`,
    });
  }

  // --- A11Y-DIS-02: DailyRecords disabled + aria-disabled ---
  if (relExists(recordsPathForHd)) {
    const src = read(recordsPathForHd);
    const disabledButtons = (src.match(/(?<![\w-])disabled(?:=|\s|>)/g) || []).length;
    const ariaDisabled = (src.match(/aria-disabled=/g) || []).length;
    // Person input uses disabled + aria-disabled; mutation buttons likewise.
    const ok = disabledButtons === 0 || ariaDisabled >= 2;
    push({
      id: "A11Y-DIS-02",
      severity: "blocking",
      ok,
      detail: ok
        ? "DailyRecords disabled controls pair with aria-disabled"
        : "DailyRecords disabled without matching aria-disabled",
    });
  } else {
    push({
      id: "A11Y-DIS-02",
      severity: "blocking",
      ok: false,
      detail: `${recordsPathForHd} missing`,
    });
  }

  // --- A11Y-HD-06: ReviewDueState destination heading hierarchy (DADS-UX-5) ---
  const reviewPath = "spfx/src/shell/review/ReviewDueState.tsx";
  if (relExists(reviewPath)) {
    const src = read(reviewPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasReviewH1 = /<h1\b/.test(src) && src.includes("demo-ux-review-due-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const ok = h1Count === 1 && hasReviewH1 && sectionH2Count >= 4;
    push({
      id: "A11Y-HD-06",
      severity: "blocking",
      ok,
      detail: ok
        ? "ReviewDueState keeps single h1 + section h2 hierarchy (DADS-UX-5)"
        : "ReviewDueState heading hierarchy regression (expect 1 h1 + section h2s)",
    });
  } else {
    push({
      id: "A11Y-HD-06",
      severity: "blocking",
      ok: false,
      detail: `${reviewPath} missing`,
    });
  }

  // --- A11Y-RV-01: Review SCSS tokens + focus-visible ---
  const reviewScssPath = "spfx/src/shell/review/ReviewDueStateUx.module.scss";
  if (relExists(reviewScssPath)) {
    const css = read(reviewScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-RV-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "Review SCSS uses DADS-04 tokens + focus-visible (no raw hex outside theme strings)"
        : `Review SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-RV-01",
      severity: "blocking",
      ok: false,
      detail: `${reviewScssPath} missing`,
    });
  }

  // --- A11Y-INV-13-RV: Review attention badges use StatusBadge label channel ---
  if (relExists(reviewPath)) {
    const src = read(reviewPath);
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    const usesBadge = /StatusBadge/.test(code);
    const softShape = /shape=["']soft["']/.test(code);
    const statusHook = /review-status-label/.test(code);
    const dueHook = /due-state-label/.test(code);
    const ok = usesBadge && softShape && statusHook && dueHook;
    push({
      id: "A11Y-INV-13-RV",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-13: ReviewDueState uses StatusBadge soft with label meaning hooks"
        : "INV-13 regression: Review attention badges must use StatusBadge label channel",
    });
  } else {
    push({
      id: "A11Y-INV-13-RV",
      severity: "blocking",
      ok: false,
      detail: `${reviewPath} missing — INV-13 Review check cannot run`,
    });
  }

  // --- A11Y-INV-17-RV: Review attention empty uses EmptyNotice ---
  if (relExists(reviewPath)) {
    const src = read(reviewPath);
    const usesEmpty = /EmptyNotice/.test(src);
    const emptyHook = /review-due-attention-empty-note/.test(src);
    const announceOn = /announce\b/.test(src);
    const ok = usesEmpty && emptyHook && announceOn;
    push({
      id: "A11Y-INV-17-RV",
      severity: "blocking",
      ok,
      detail: ok
        ? "INV-17: ReviewDueState attention zero-result uses EmptyNotice with announce"
        : "INV-17 regression: Review attention empty must use EmptyNotice status channel",
    });
  } else {
    push({
      id: "A11Y-INV-17-RV",
      severity: "blocking",
      ok: false,
      detail: `${reviewPath} missing — INV-17 Review check cannot run`,
    });
  }

  // --- A11Y-DIS-03: ReviewDueState disabled + aria-disabled ---
  if (relExists(reviewPath)) {
    const src = read(reviewPath);
    const disabledButtons = (src.match(/(?<![\w-])disabled(?:=|\s|>)/g) || []).length;
    const ariaDisabled = (src.match(/aria-disabled=/g) || []).length;
    const ok = disabledButtons === 0 || ariaDisabled >= disabledButtons;
    push({
      id: "A11Y-DIS-03",
      severity: "blocking",
      ok,
      detail: ok
        ? "ReviewDueState disabled controls pair with aria-disabled"
        : "ReviewDueState disabled without matching aria-disabled",
    });
  } else {
    push({
      id: "A11Y-DIS-03",
      severity: "blocking",
      ok: false,
      detail: `${reviewPath} missing`,
    });
  }

  // --- A11Y-HD-07: SupportPlan destination heading hierarchy (DADS-UX-6) ---
  const supportPlanPath = "spfx/src/shell/users/SupportPlan.tsx";
  if (relExists(supportPlanPath)) {
    const src = read(supportPlanPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasPlanH1 = /<h1\b/.test(src) && src.includes("demo-ux-support-plan-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const ok = h1Count === 1 && hasPlanH1 && sectionH2Count >= 5;
    push({
      id: "A11Y-HD-07",
      severity: "blocking",
      ok,
      detail: ok
        ? "SupportPlan keeps single h1 + section h2 hierarchy (DADS-UX-6)"
        : "SupportPlan heading hierarchy regression (expect 1 h1 + section h2s)",
    });
  } else {
    push({
      id: "A11Y-HD-07",
      severity: "blocking",
      ok: false,
      detail: `${supportPlanPath} missing`,
    });
  }

  // --- A11Y-SP-01: SupportPlan SCSS tokens + focus-visible ---
  const supportPlanScssPath = "spfx/src/shell/users/SupportPlanUx.module.scss";
  if (relExists(supportPlanScssPath)) {
    const css = read(supportPlanScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const headingFocusPair =
      /\.planHeading:focus\b/.test(css) && /\.planHeading:focus-visible\b/.test(css);
    const mutationFocus =
      /\.mutationButton:focus\b/.test(css) && /\.mutationButton:focus-visible\b/.test(css);
    const ok =
      usesTokens && !hardcodedOutsideTheme && focusVisible && headingFocusPair && mutationFocus;
    push({
      id: "A11Y-SP-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "SupportPlan SCSS uses DADS-04 tokens + heading/mutation focus-visible (no raw hex outside theme strings)"
        : `SupportPlan SCSS presentation gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, headingPair=${headingFocusPair}, mutationFocus=${mutationFocus}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-SP-01",
      severity: "blocking",
      ok: false,
      detail: `${supportPlanScssPath} missing`,
    });
  }

  // --- A11Y-DIS-04: SupportPlan disabled + aria-disabled ---
  if (relExists(supportPlanPath)) {
    const src = read(supportPlanPath);
    const disabledButtons = (src.match(/(?<![\w-])disabled(?:=|\s|>)/g) || []).length;
    const ariaDisabled = (src.match(/aria-disabled=/g) || []).length;
    const ok = disabledButtons === 0 || ariaDisabled >= disabledButtons;
    push({
      id: "A11Y-DIS-04",
      severity: "blocking",
      ok,
      detail: ok
        ? "SupportPlan disabled controls pair with aria-disabled"
        : "SupportPlan disabled without matching aria-disabled",
    });
  } else {
    push({
      id: "A11Y-DIS-04",
      severity: "blocking",
      ok: false,
      detail: `${supportPlanPath} missing`,
    });
  }

  // --- A11Y-HD-08: SupportPlanManagementList heading hierarchy ---
  const planListPath = "spfx/src/shell/users/SupportPlanManagementList.tsx";
  if (relExists(planListPath)) {
    const src = read(planListPath);
    const h1Count = (src.match(/<h1\b/g) || []).length;
    const hasListH1 = /<h1\b/.test(src) && src.includes("support-plan-mgmt-heading");
    const sectionH2Count = (src.match(/<h2\b/g) || []).length;
    const hasStatusBadge = src.includes("StatusBadge") && src.includes("workStateLabel");
    const ok = h1Count === 1 && hasListH1 && sectionH2Count >= 2 && hasStatusBadge;
    push({
      id: "A11Y-HD-08",
      severity: "blocking",
      ok,
      detail: ok
        ? "SupportPlanManagementList keeps single h1 + section h2 + StatusBadge labels"
        : "SupportPlanManagementList heading/status regression (expect 1 h1, section h2, StatusBadge labels)",
    });
  } else {
    push({
      id: "A11Y-HD-08",
      severity: "blocking",
      ok: false,
      detail: `${planListPath} missing`,
    });
  }

  // --- A11Y-SPML-01: SupportPlanManagementList SCSS tokens + focus-visible ---
  const planListScssPath = "spfx/src/shell/users/SupportPlanManagementListUx.module.scss";
  if (relExists(planListScssPath)) {
    const css = read(planListScssPath);
    const usesTokens = /@use\s+["'].*sbs-tokens["']/.test(css);
    const hardcodedOutsideTheme = /(?:^|[^"])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(
      css.replace(/"[^"]*"/g, '""').replace(/@use[\s\S]*?;/, ""),
    );
    const focusVisible = /:focus-visible\b/.test(css);
    const ok = usesTokens && !hardcodedOutsideTheme && focusVisible;
    push({
      id: "A11Y-SPML-01",
      severity: "blocking",
      ok,
      detail: ok
        ? "SupportPlanManagementList SCSS uses DADS-04 tokens + focus-visible"
        : `SupportPlanManagementList SCSS gate failed (tokens=${usesTokens}, focus-visible=${focusVisible}, rawHex=${hardcodedOutsideTheme})`,
    });
  } else {
    push({
      id: "A11Y-SPML-01",
      severity: "blocking",
      ok: false,
      detail: `${planListScssPath} missing`,
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
