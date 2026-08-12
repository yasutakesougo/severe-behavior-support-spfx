import type { ShellReviewDueStatePresentation } from "./review-due-types";

/** Synthetic review status & due-state fixture for responsible-person review only. */
export const DEMO_UX_REVIEW_DUE_FIXTURE: ShellReviewDueStatePresentation = {
  heading: "見直し状況",
  summaryPrompt:
    "責任者が見直し対象と期限状態の見え方を確認するための合成一覧です。分析グラフは主目的にしません。",
  attentionSummary: {
    awaitingConfirmationCountLabel: "確認待ち 2件（合成表示）",
    dueSoonCountLabel: "期限接近 2件（合成表示）",
  },
  attentionItems: [
    {
      id: "review-a",
      personLabel: "Aさん",
      subjectLabel: "支援計画の見直し",
      reviewStatusLabel: "確認待ち",
      dueStateLabel: "期限接近",
      reasonLabel: "見直し期限が近いため、担当確認が必要な合成サンプルです。",
    },
    {
      id: "review-b",
      personLabel: "Bさん",
      subjectLabel: "支援計画の見直し",
      reviewStatusLabel: "確認待ち",
      dueStateLabel: "期限接近",
      reasonLabel: "見直し期限まで残りわずかとして表示する合成サンプルです。",
    },
    {
      id: "review-c",
      personLabel: "Cさん",
      subjectLabel: "新しい計画の確認",
      reviewStatusLabel: "確認待ち",
      dueStateLabel: "確認対象",
      reasonLabel: "新しい計画があるため、責任者レビュー用に表示する合成サンプルです。",
    },
  ],
  businessFacts: {
    reviewScopeLabel: "見直し状況・期限状態（合成表示）",
    responsibleRoleLabel: "責任者レビュー（合成表示）",
  },
  systemState: {
    saveStateLabel: "表示サンプル（live保存なし）",
    dataSourceLabel: "synthetic fixture only",
  },
};

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
