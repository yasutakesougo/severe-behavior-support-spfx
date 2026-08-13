/**
 * DEMO-UX-11 — presentation-only DEMO note consolidation (RPF-004).
 * Reduces duplicate synthetic/no-live banners; does not weaken fail-closed or mutation boundaries.
 */

export const DEMO_UX_11_SLICE = {
  id: "DEMO-UX-11",
  presentationOnly: true as const,
  demoNoteConsolidationAuthorized: true as const,
  /** Screen-level「合成・業務データ未接続」帯 on ready business surfaces. */
  screenLevelSyntheticBandAuthorized: false as const,
  globalDemoBannerRemovalAuthorized: false as const,
  mutationBoundaryRemovalAuthorized: false as const,
  familyMetricNoteRemovalAuthorized: false as const,
  failClosedSemanticsChangeAuthorized: false as const,
  unselectedStateRelaxationAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  saveMutationAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  saveBadgeEmphasisChangeAuthorized: false as const,
} as const;

/** Consolidated Users filter hint (replaces separate FILTER_NOTE display). */
export const DEMO_USERS_FILTER_HINT_CONSOLIDATED =
  "状態で絞り込みできます（合成データ内）。業務検索には未接続。概要の要確認/未記録/期限接近と同じ定義です。";
