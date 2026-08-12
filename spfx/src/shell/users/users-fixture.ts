import type { ShellUsersPresentation } from "./users-types";

/** Synthetic users list fixture for responsible-person review density checks. */
export const DEMO_UX_USERS_FIXTURE: ShellUsersPresentation = {
  summaryLabel: "全8名（合成データ）",
  filterHint: "状態で絞り込み（表示専用）",
  rows: [
    {
      id: "user-a",
      personLabel: "Aさん",
      statusBadges: [
        { id: "unrecorded", label: "未記録" },
        { id: "needs_review", label: "要確認" },
      ],
      planSummary: "支援計画 2026/07/01–09/30",
      attentionNote: "支援記録が未入力",
      lastRecordLabel: "最終記録: 8/10 10:15",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-b",
      personLabel: "Bさん",
      statusBadges: [{ id: "deadline_near", label: "期限間近" }],
      planSummary: "支援計画 2026/06/01–08/31",
      attentionNote: "見直しまで7日",
      lastRecordLabel: "最終記録: 8/11 09:20",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-c",
      personLabel: "Cさん",
      statusBadges: [{ id: "needs_review", label: "要確認" }],
      planSummary: "支援計画 2026/08/01–10/31",
      attentionNote: "新しい計画があります",
      lastRecordLabel: "最終記録: 8/09 16:40",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-d",
      personLabel: "Dさん",
      statusBadges: [{ id: "normal", label: "通常" }],
      planSummary: "支援計画 2026/05/01–07/31",
      attentionNote: "特記事項なし",
      lastRecordLabel: "最終記録: 8/11 13:05",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-e",
      personLabel: "Eさん",
      statusBadges: [
        { id: "unrecorded", label: "未記録" },
        { id: "deadline_near", label: "期限間近" },
      ],
      planSummary: "支援計画 2026/04/01–08/15",
      attentionNote: "本日の記録が未入力",
      lastRecordLabel: "最終記録: 8/08 11:30",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-f",
      personLabel: "Fさん",
      statusBadges: [{ id: "needs_review", label: "要確認" }],
      planSummary: "支援計画 2026/07/15–09/30",
      attentionNote: "支援内容の確認待ち",
      lastRecordLabel: "最終記録: 8/07 15:00",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-g",
      personLabel: "Gさん",
      statusBadges: [{ id: "normal", label: "通常" }],
      planSummary: "支援計画 2026/06/15–09/15",
      attentionNote: "特記事項なし",
      lastRecordLabel: "最終記録: 8/10 08:45",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-h",
      personLabel: "Hさん",
      statusBadges: [{ id: "deadline_near", label: "期限間近" }],
      planSummary: "支援計画 2026/03/01–08/20",
      attentionNote: "見直し期限が近い",
      lastRecordLabel: "最終記録: 8/06 14:10",
      detailActionLabel: "詳細を見る",
    },
  ],
};

export const DEMO_UX_SLICE = {
  id: "DEMO-UX-2",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveUsersDataAuthorized: false as const,
  userDetailNavigationAuthorized: false as const,
  filterExecutionAuthorized: false as const,
} as const;
