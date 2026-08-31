import type { MonitoringPeriodReviewDecision } from "../../sbs-domain/monitoring-period-review-outcome.bundle";

export const REVIEW_OUTCOME_CAPTURE_COPY = {
  undecided: "見直し結果: 未判断",
  noChange: "デモ上の見直し結果: 変更なし",
  changeRequired: "デモ上の見直し結果: 変更が必要",
  revisionPending: "次の計画版はまだ作成されていません",
  nonProduction: "本番には保存されていません",
  duplicate: "この計画版・対象期間のデモ結果はすでに記録されています。",
  error: "見直し結果を安全に記録できません。入力内容を確認してください。",
  actionNoChange: "変更なし",
  actionChangeRequired: "変更が必要",
  noteLabel: "見直しの補足メモ（任意）",
  noteHelper: "見直し結果に添える短い補足です。次の計画内容ではありません。",
  noteLimitError: "補足メモは255文字以内で入力してください。",
} as const;

export function labelForReviewDecision(decision: MonitoringPeriodReviewDecision): string {
  return decision === "NO_CHANGE"
    ? REVIEW_OUTCOME_CAPTURE_COPY.noChange
    : REVIEW_OUTCOME_CAPTURE_COPY.changeRequired;
}
