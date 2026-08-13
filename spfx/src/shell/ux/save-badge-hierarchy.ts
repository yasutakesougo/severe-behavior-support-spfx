/**
 * DEMO-UX-12 — presentation-only save badge emphasis hierarchy (RPF-005).
 * QUIET on ready (saved/unsaved); EMPHASIZED for saving / fail / unknown.
 * Does not judge save outcomes or enable live I/O.
 */

export const DEMO_UX_12_SLICE = {
  id: "DEMO-UX-12",
  presentationOnly: true as const,
  saveBadgeHierarchyAuthorized: true as const,
  /** Visual/description hierarchy only — not outcome semantics. */
  saveStateSemanticsChangeAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
  saveProgressUiAuthorized: false as const, // RPF-007 → DEMO-UX-14
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  saveMutationAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  detailPreviewExpansionAuthorized: false as const, // DUX7-P2-1 OUT
} as const;

export type ShellSaveStateEmphasis = "quiet" | "emphasized";
