/**
 * SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — fail-closed presentation copy.
 * D1=B / D2=B: do not present 承認済み as statutory final approval.
 * D5=B: 約3か月見直し is a review-support criterion, not 90-day expiry.
 */

export const SUPPORT_PLAN_MANAGEMENT_HEADING = "支援計画" as const;

export const SUPPORT_PLAN_MANAGEMENT_KPI_HEADING = "計画の状況" as const;

export const SUPPORT_PLAN_MANAGEMENT_TODAY_HEADING = "今日やること" as const;

export const SUPPORT_PLAN_MANAGEMENT_LIST_HEADING = "支援計画の一覧" as const;

export const DEMO_KPI_FAMILY_P_NOTE =
  "要確認・見直し時期・観察待ちはこの画面の支援計画一覧と同じ母集団です（合成・件）。利用者一覧の要確認/未記録/期限接近とは対象が異なります。";

export const SUPPORT_PLAN_MANAGEMENT_WORK_STATE_LABELS = {
  active: "適用中",
  review_window: "見直し時期",
  observation_check: "観察確認",
  procedure_updating: "手順更新中",
  uncreated: "未作成",
} as const;

export const SUPPORT_PLAN_MANAGEMENT_KPI_LABELS = {
  needs_action: "要確認",
  review_window: "見直し時期",
  observation_wait: "観察待ち",
} as const;

export const SUPPORT_PLAN_MANAGEMENT_DETAIL_ACTION_LABEL = "詳細を見る" as const;

export const SUPPORT_PLAN_MANAGEMENT_CREATE_ACTION_LABEL = "新規作成" as const;

export const SUPPORT_PLAN_MANAGEMENT_VERSION_NONE_LABEL = "Version: なし" as const;

export const SUPPORT_PLAN_MANAGEMENT_OBSERVATION_NONE_LABEL = "最終観察日: なし" as const;

export const SUPPORT_PLAN_MANAGEMENT_REVIEW_NONE_LABEL = "見直し目安: なし" as const;

export const SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL = "← 支援計画" as const;

export const SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_HEADING = "支援計画（合成詳細）" as const;

export const SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_NOTE =
  "詳細の完成はこの画面の対象外です。表示専用です。業務データには接続されていません。";

export const SUPPORT_PLAN_MANAGEMENT_CREATE_HEADING = "新規作成（表示専用）" as const;

export const SUPPORT_PLAN_MANAGEMENT_CREATE_NOTE =
  "作成・編集・保存は接続されていません。表示専用です。業務データには接続されていません。";

export const SUPPORT_PLAN_MANAGEMENT_CREATE_DISABLED_LABEL = "作成する" as const;

export const SUPPORT_PLAN_MANAGEMENT_EMPTY_NOTE = "表示できる支援計画はありません（合成）";

export const SUPPORT_PLAN_MANAGEMENT_TODAY_EMPTY_NOTE = "今日やることはありません（合成）";

export const SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_STATUS_TOKENS = ["最終承認者", "承認済み"] as const;

export const SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_EXPIRY_TOKENS = ["90日", "失効"] as const;

export function formatSupportPlanManagementVersionLabel(version: number | undefined): string {
  if (version === undefined) {
    return SUPPORT_PLAN_MANAGEMENT_VERSION_NONE_LABEL;
  }
  return `Version: v${version}`;
}

export function formatSupportPlanManagementObservationLabel(dateLabel: string | undefined): string {
  if (!dateLabel) {
    return SUPPORT_PLAN_MANAGEMENT_OBSERVATION_NONE_LABEL;
  }
  return `最終観察日: ${dateLabel}`;
}

export function formatSupportPlanManagementReviewWindowLabel(
  monthLabel: string | undefined,
): string {
  if (!monthLabel) {
    return SUPPORT_PLAN_MANAGEMENT_REVIEW_NONE_LABEL;
  }
  return `見直し目安: ${monthLabel}`;
}

export function formatFamilyPCountLabel(statusLabel: string, count: number): string {
  return `${statusLabel} ${count}件（合成表示）`;
}

export function supportPlanManagementCopyAvoidsFinalApprovalMeaning(text: string): boolean {
  return SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_STATUS_TOKENS.every((token) => text.indexOf(token) < 0);
}

export function supportPlanManagementCopyAvoidsExpiryMeaning(text: string): boolean {
  return SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_EXPIRY_TOKENS.every((token) => text.indexOf(token) < 0);
}

export function supportPlanManagementCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "認証済み",
    "authorized",
    "live sharepoint",
    "完成済み",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}
