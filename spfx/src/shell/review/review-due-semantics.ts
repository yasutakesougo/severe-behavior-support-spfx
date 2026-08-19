export const SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE = {
  id: "SP-LC-3-REVIEW-DUE-ORIGIN-1",
  presentationOnly: true as const,
  reviewAnchorAuthorized: true as const,
  callerSuppliedDueAuthorized: true as const,
  approachingWindowAuthorized: true as const,
  fixedNinetyDaysAuthorized: false as const,
  hardOverdueAuthorized: false as const,
  observationAssociationAuthorized: false as const,
} as const;

export type ReviewDueSemanticBasis = Readonly<{
  originLabel: string;
  dueLabel: string;
  approachingLabel: string;
}>;

export function presentReviewDueSemanticBasis(firstReview: boolean): ReviewDueSemanticBasis {
  return {
    originLabel: firstReview
      ? "初回基準日: 支援計画の有効開始日"
      : "継続基準日: 前回見直し日",
    dueLabel:
      "reviewDueDate は caller-supplied の基準日です。固定90日や自動失効には変換しません。",
    approachingLabel:
      "通知開始は見直し対象の暦月に入った時点です。30日前などの日数固定窓は使いません。",
  };
}
