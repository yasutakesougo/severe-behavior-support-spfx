import { SHELL_STATUS_LABEL_DUE_SOON, SHELL_STATUS_LABEL_NEEDS_REVIEW } from "../ux/status-labels";
import { buildAttentionSummaryFromItems } from "../ux/kpi-review-count";
import { presentReviewDueSemanticBasis } from "./review-due-semantics";
import type {
  ShellReviewDueAttentionItem,
  ShellReviewDueStatePresentation,
} from "./review-due-types";

/**
 * Synthetic review attention items (Family A population).
 * DEMO-UX-10: do not rewrite cast to force equivalence with Users roster.
 */
const DEMO_UX_REVIEW_ATTENTION_ITEMS: readonly ShellReviewDueAttentionItem[] = [
  {
    id: "review-a",
    personLabel: "Aさん",
    subjectLabel: "支援計画の見直し",
    reviewStatusLabel: SHELL_STATUS_LABEL_NEEDS_REVIEW,
    dueStateLabel: SHELL_STATUS_LABEL_DUE_SOON,
    reasonLabel: "見直し期限が近いため、担当確認が必要な合成サンプルです。",
  },
  {
    id: "review-b",
    personLabel: "Bさん",
    subjectLabel: "支援計画の見直し",
    reviewStatusLabel: SHELL_STATUS_LABEL_NEEDS_REVIEW,
    dueStateLabel: SHELL_STATUS_LABEL_DUE_SOON,
    reasonLabel: "見直し期限まで残りわずかとして表示する合成サンプルです。",
  },
  {
    id: "review-c",
    personLabel: "Cさん",
    subjectLabel: "新しい計画の確認",
    reviewStatusLabel: SHELL_STATUS_LABEL_NEEDS_REVIEW,
    reasonLabel: "新しい計画があるため、責任者レビュー用に表示する合成サンプルです。",
  },
];

function buildReviewDueFixture(firstReview: boolean): ShellReviewDueStatePresentation {
  return {
    heading: "見直し状況",
    summaryPrompt:
      "責任者が見直し対象と期限状態の見え方を確認するための合成一覧です。分析グラフは主目的にしません。",
    semanticBasis: presentReviewDueSemanticBasis(firstReview),
    attentionSummary: buildAttentionSummaryFromItems(DEMO_UX_REVIEW_ATTENTION_ITEMS),
    attentionItems: DEMO_UX_REVIEW_ATTENTION_ITEMS,
    businessFacts: {
      reviewScopeLabel: "見直し状況・期限状態（合成表示）",
      responsibleRoleLabel: "責任者レビュー（合成表示）",
    },
    systemState: {
      saveStateLabel: "表示サンプル（live保存なし）",
      dataSourceLabel: "synthetic fixture only",
    },
  };
}

/** Synthetic review status & due-state fixture for responsible-person review only. */
export const DEMO_UX_REVIEW_DUE_FIXTURE: ShellReviewDueStatePresentation = buildReviewDueFixture(true);

/** Synthetic subsequent-review fixture for smoke/unit evidence of D5 anchor branch. */
export const DEMO_UX_REVIEW_DUE_SUBSEQUENT_FIXTURE: ShellReviewDueStatePresentation =
  buildReviewDueFixture(false);

export const DEMO_UX_6_SLICE = {
  id: "DEMO-UX-6",
  presentationOnly: true as const,
  syntheticReviewDuePresentationAuthorized: true as const,
  liveReviewStatusReadAuthorized: false as const,
  liveDueStateCalculationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveReviewDataAuthorized: false as const,
  reviewMutationAuthorized: false as const,
  evaluationMutationAuthorized: false as const,
  govRuleDecisionAuthorized: false as const,
} as const;

/** VP-5 Review — presentation-only polish for the review evidence boundary. */
export const VP5_REVIEW_SLICE = {
  id: "VP-5-REVIEW",
  target: "review" as const,
  presentationOnly: true as const,
  visualPolishAuthorized: true as const,
  reviewPresentationBoundaryMetadataAuthorized: true as const,
  reviewDueStatePresentationAuthorized: true as const,
  historicalUnresolvedPresentationAuthorized: true as const,
  regressionTestsAuthorized: true as const,
  reviewAutoJudgeAuthorized: false as const,
  reviewOutcomeSemanticsChangeAuthorized: false as const,
  completeReviewMutationAuthorized: false as const,
  statusVocabularyChangeAuthorized: false as const,
  navigationSemanticsChangeAuthorized: false as const,
  domainContractsMutationAuthorized: false as const,
  permissionMutationAuthorized: false as const,
  syntheticBoundaryChangeAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  visualAcceptanceAuthorized: false as const,
  deployAuthorized: false as const,
  externalMutationAuthorized: false as const,
} as const;
