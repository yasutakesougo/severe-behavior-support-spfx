/**
 * DEMO-UX-7 — canonical synthetic status labels.
 * Presentation labels only — not live business judgment semantics.
 */

export const SHELL_STATUS_LABEL_NEEDS_REVIEW = "要確認" as const;
export const SHELL_STATUS_LABEL_DUE_SOON = "期限接近" as const;
export const SHELL_STATUS_LABEL_UNRECORDED = "未記録" as const;

/** Retired as primary badge / KPI / filter / summary labels. */
export const SHELL_STATUS_LABELS_DEPRECATED_PRIMARY = ["確認待ち", "確認対象", "期限間近"] as const;

export const DEMO_UX_7_SLICE = {
  id: "DEMO-UX-7",
  presentationOnly: true as const,
  terminologyCanonAuthorized: true as const,
  todayActionNavigationAuthorized: true as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  saveMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  filterExecutionAuthorized: false as const,
  recordFlowRedesignAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  failClosedSemanticsChangeAuthorized: false as const,
  unselectedStateRelaxationAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
} as const;

export function isDeprecatedPrimaryStatusLabel(label: string): boolean {
  return (SHELL_STATUS_LABELS_DEPRECATED_PRIMARY as readonly string[]).indexOf(label) >= 0;
}
