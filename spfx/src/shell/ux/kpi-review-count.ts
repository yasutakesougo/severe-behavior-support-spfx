/**
 * DEMO-UX-10 — presentation-only KPI / review count correspondence helpers.
 * Family R = roster status badge counts (Users). Family A = review attention items.
 * No live calculation, GOV-RULE, or business-rule inference.
 */

import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
} from "./status-labels";

export type RosterStatusBadgeId = "needs_review" | "unrecorded" | "deadline_near";

export type AttentionCountItem = Readonly<{
  reviewStatusLabel: string;
  dueStateLabel?: string;
}>;

/** Overview / Users: roster badge counts share this definition (synthetic). */
export const DEMO_KPI_FAMILY_R_NOTE =
  "要確認・未記録・期限接近は利用者一覧の状態バッジ件数と同じ定義です（合成・名）。見直し画面の件数とは母集団が異なります。";

/** Review: summary counts share the attention list population (synthetic). */
export const DEMO_KPI_FAMILY_A_NOTE =
  "要約件数はこの画面の確認対象一覧と同じ母集団です（合成・件）。利用者一覧の要確認/期限接近件数とは対象者が異なります。";

/** Users filter: short Family R correspondence (does not claim Review equivalence). */
export const DEMO_KPI_FAMILY_R_USERS_NOTE =
  "件数は利用者一覧の状態バッジ件数（合成・名）。概要の要確認/未記録/期限接近と同じ定義です。見直し画面とは母集団が異なります。";

export function countRowsWithBadgeId(
  rows: readonly Readonly<{ statusBadges: readonly Readonly<{ id: string }>[] }>[],
  badgeId: RosterStatusBadgeId,
): number {
  return rows.filter((row) => row.statusBadges.some((badge) => badge.id === badgeId)).length;
}

export function countAttentionByReviewStatus(
  items: readonly AttentionCountItem[],
  reviewStatusLabel: string,
): number {
  return items.filter((item) => item.reviewStatusLabel === reviewStatusLabel).length;
}

export function countAttentionByDueState(
  items: readonly AttentionCountItem[],
  dueStateLabel: string,
): number {
  return items.filter((item) => item.dueStateLabel === dueStateLabel).length;
}

export function formatAttentionSummaryCountLabel(statusLabel: string, count: number): string {
  return `${statusLabel} ${count}件（合成表示）`;
}

export function buildAttentionSummaryFromItems(items: readonly AttentionCountItem[]): Readonly<{
  awaitingConfirmationCountLabel: string;
  dueSoonCountLabel: string;
}> {
  const awaiting = countAttentionByReviewStatus(items, SHELL_STATUS_LABEL_NEEDS_REVIEW);
  const dueSoon = countAttentionByDueState(items, SHELL_STATUS_LABEL_DUE_SOON);
  return {
    awaitingConfirmationCountLabel: formatAttentionSummaryCountLabel(
      SHELL_STATUS_LABEL_NEEDS_REVIEW,
      awaiting,
    ),
    dueSoonCountLabel: formatAttentionSummaryCountLabel(SHELL_STATUS_LABEL_DUE_SOON, dueSoon),
  };
}

export const DEMO_UX_10_SLICE = {
  id: "DEMO-UX-10",
  presentationOnly: true as const,
  kpiReviewCountCorrespondenceAuthorized: true as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  saveMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  govRuleDecisionAuthorized: false as const,
  usersFixtureRewriteAuthorized: false as const,
  reviewAttentionCastRewriteAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  failClosedSemanticsChangeAuthorized: false as const,
  unselectedStateRelaxationAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
} as const;
