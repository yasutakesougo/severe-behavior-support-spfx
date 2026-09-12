/**
 * DEMO-UX-4 + PLANNING-PC-DEMO-1 — fail-closed presentation copy.
 * D1=B: Active = 適用中. D2=B: do not present approvedBy as 制度上の最終承認.
 */

export const DEMO_SUPPORT_PLAN_PRESENTATION_NOTE =
  "この画面は合成データによる支援計画の表示確認用です。業務データには接続されていません。";

export const DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE =
  "作成・編集・保存は接続されていません。表示専用です。";

export const DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE =
  "計画の確認専用です。作成・編集・保存操作はありません。承認・変更権限は追加しません。";

export const SUPPORT_PLAN_ACTIVE_STATUS_LABEL = "適用中";

export const SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE =
  "適用開始の記録です。制度上の決裁者としては表示しません。";

export const SUPPORT_PLAN_REVIEW_MATERIALS_CTA = "見直し材料を確認する";

export const SUPPORT_PLAN_REVIEW_MATERIALS_NOTE =
  "見直し材料の確認です。期限の起算・接近判定はこの画面では行いません。";

export const SUPPORT_PLAN_PAST_VERSION_READONLY_NOTE =
  "過去版は読み取り専用です。現行版として編集できません。";

export const SUPPORT_PLAN_HISTORICAL_RECORD_NOTE =
  "記録は実施時点の計画版に固定されています。最新版への付け替えはしません。";

export const SUPPORT_PLAN_CURRENT_PROCEDURES_HEADING = "現在の支援手順";

export const SUPPORT_PLAN_RECENT_RECORDS_HEADING = "最近の支援手順記録";

export const SUPPORT_PLAN_VERSIONS_HEADING = "過去の版";

export const SUPPORT_PLAN_VERSION_COMPARE_HEADING = "現在版と過去版の比較";

export const SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE =
  "計画は上書きせず、版を重ねます。現場記録は実施時点の計画版に残ります。";

export const SUPPORT_PLAN_NEXT_VERSION_HEADING = "次の版の考え方";

/** Pre-V1 planning-PC navigation retained unchanged for ADMIN_AUDIT. */
export const PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION = [
  { id: "demo-ux-plan-review-heading", label: "見直し状況" },
  { id: "planning-pc-plan-procedures-heading", label: SUPPORT_PLAN_CURRENT_PROCEDURES_HEADING },
  { id: "planning-pc-plan-records-heading", label: SUPPORT_PLAN_RECENT_RECORDS_HEADING },
  { id: "planning-pc-plan-versions-heading", label: SUPPORT_PLAN_VERSIONS_HEADING },
  { id: "review-new-version-next-heading", label: SUPPORT_PLAN_NEXT_VERSION_HEADING },
] as const;

/** PROCESS-VISIBILITY-UI-V1 — PLANNER-only in-page process navigation. */
export const PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION = [
  { id: "planner-process-plan-heading", label: "① 計画" },
  { id: "planner-process-support-heading", label: "② 支援" },
  { id: "planner-process-records-heading", label: "③ 記録" },
  { id: "planner-process-monitoring-heading", label: "④ モニタリング" },
  { id: "planner-process-review-heading", label: "⑤ 見直し" },
  { id: "planner-process-next-version-heading", label: "⑥ 次版準備" },
] as const;

export const PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION_HINT =
  "選択中はページ内の表示位置です。工程の完了・進捗を表しません。";

export const SUPPORT_PLAN_NEXT_VERSION_NOTE =
  "次回の変更は新しい版を作ります。現行の適用中版は残します。作成・保存は接続されていません。";

export const SUPPORT_PLAN_NEXT_VERSION_CTA = "次の版を作る（表示専用）";

export const SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA = "次の版の考え方を見る";

export const SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE =
  "観察の不足だけでは、この計画を無効にしません。";

export const SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE =
  "見直し期限の超過だけでは、この計画を無効にしません。";

/** NEXT-VERSION-COPY-SIMPLIFICATION-1 Proposal A — draft block short labels. */
export const SUPPORT_PLAN_DRAFT_ACTIVE_LABEL = "適用中";
export const SUPPORT_PLAN_DRAFT_DRAFT_LABEL = "下書き";

/** NEXT-VERSION-COPY-SIMPLIFICATION-2 — after-apply ⑥ primary only. */
export const SUPPORT_PLAN_AFTER_APPLY_NEXT_CHANGE_NOTE = "次に変更するときは、新しい版を作ります。";
export const SUPPORT_PLAN_AFTER_APPLY_CURRENT_REMAINS_NOTE = "現在の版はそのまま残ります。";
export const SUPPORT_PLAN_AFTER_APPLY_HISTORY_PREFIX = "過去版";
export const SUPPORT_PLAN_ACTIVATION_INFO_HEADING = "適用情報";

export const SUPPORT_PLAN_FORBIDDEN_STATUS_TOKENS = ["最終承認者", "承認済み"] as const;

/** Fail-closed copy must not claim usable business UI or live connection. */
export function supportPlanCopyIsFailClosed(text: string): boolean {
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

/** D1/D2 presentation: status copy must not read as institutional final approval. */
export function supportPlanCopyAvoidsFinalApprovalMeaning(text: string): boolean {
  return SUPPORT_PLAN_FORBIDDEN_STATUS_TOKENS.every((token) => text.indexOf(token) < 0);
}

/** C6 / S-DRAFT pixel-exact runtime label. N+1 authority = draft.candidate.version only. */
export function formatNextDraftUnappliedLabel(draftCandidateVersion: number): string {
  return `次版下書き v${draftCandidateVersion}（未適用）`;
}

