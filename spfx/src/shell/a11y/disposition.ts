/**
 * DADS-06 — Accessibility Gate disposition / rule catalog.
 * Detects and regresses a11y contracts; does not authorize screen migration or INV-19 fix.
 */

export const SBS_A11Y_RULE_SEVERITIES = ["blocking", "advisory", "known_gap"] as const;

export type SbsA11yRuleSeverity = (typeof SBS_A11Y_RULE_SEVERITIES)[number];

export const SBS_A11Y_RULE_COVERAGE = ["covered", "detect_only", "deferred"] as const;

export type SbsA11yRuleCoverage = (typeof SBS_A11Y_RULE_COVERAGE)[number];

export const SBS_A11Y_GATE_SLICE = {
  id: "DADS-06",
  kind: "accessibility-gate" as const,
  screenMigrationAuthorized: false as const,
  inv19HeadingFixAuthorized: true as const,
  domainContractsMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
  /** No axe-core / new npm dependency in this slice. */
  newRuntimeDependencyAuthorized: false as const,
} as const;

export type SbsA11yRule = Readonly<{
  id: string;
  focus:
    | "keyboard"
    | "focus-visible"
    | "heading"
    | "accessible-name"
    | "form-label"
    | "description-error"
    | "status-not-color-only"
    | "disabled"
    | "live-status"
    | "primitive-semantics";
  severity: SbsA11yRuleSeverity;
  coverage: SbsA11yRuleCoverage;
  inventoryRefs: readonly string[];
  summary: string;
}>;

/**
 * Catalog of gate rules. `known_gap` must remain detectable until a later authorized fix.
 * `deferred` is documented not-covered (manual / browser smoke / later slice).
 */
export const SBS_A11Y_RULE_CATALOG: readonly SbsA11yRule[] = [
  {
    id: "A11Y-KB-01",
    focus: "keyboard",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-10"],
    summary: "SingleSelectListbox implements Arrow/Home/End/Enter/Space selection keys",
  },
  {
    id: "A11Y-FV-01",
    focus: "focus-visible",
    severity: "advisory",
    coverage: "detect_only",
    inventoryRefs: ["INV-20"],
    summary:
      "Focus tokens exist; :focus vs :focus-visible mix is reported (no mass selector rewrite)",
  },
  {
    id: "A11Y-HD-01",
    focus: "heading",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-19"],
    summary:
      "Scaffold host bodyTitle must remain non-heading (DADS-UX-1 INV-19 resolved; regression blocking)",
  },
  {
    id: "A11Y-AN-01",
    focus: "accessible-name",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-07", "INV-10"],
    summary: "SectionLabelStrip and SingleSelectListbox require ariaLabel props",
  },
  {
    id: "A11Y-FL-01",
    focus: "form-label",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-21"],
    summary: "DailyRecords text inputs remain wrapped by <label> (targeted regression)",
  },
  {
    id: "A11Y-DESC-01",
    focus: "description-error",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-15", "INV-16"],
    summary: "Fail-closed StatusPanel keeps alert/status roles (KEEP; no rewrite)",
  },
  {
    id: "A11Y-SC-01",
    focus: "status-not-color-only",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-12", "INV-13"],
    summary: "StatusBadge meaning channel is required label text",
  },
  {
    id: "A11Y-DIS-01",
    focus: "disabled",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-21"],
    summary: "UserDetail disabled actions expose aria-disabled with disabled",
  },
  {
    id: "A11Y-LIVE-01",
    focus: "live-status",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-17"],
    summary: "EmptyNotice announce maps to role=status + aria-live=polite",
  },
  {
    id: "A11Y-PRIM-01",
    focus: "primitive-semantics",
    severity: "blocking",
    coverage: "covered",
    inventoryRefs: ["INV-07", "INV-10"],
    summary:
      "SectionLabelStrip is not tablist; SingleSelect uses listbox/option (not button+option)",
  },
  {
    id: "A11Y-MAN-01",
    focus: "keyboard",
    severity: "advisory",
    coverage: "deferred",
    inventoryRefs: ["INV-20", "INV-21"],
    summary:
      "Full interactive keyboard traversal remains browser-smoke / manual (not automated here)",
  },
] as const;
