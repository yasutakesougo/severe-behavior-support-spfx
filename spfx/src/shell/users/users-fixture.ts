import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
} from "../ux/status-labels";
import type { ShellUsersPresentation } from "./users-types";

/** Synthetic users list fixture for responsible-person review density checks. */
export const DEMO_UX_USERS_FIXTURE: ShellUsersPresentation = {
  summaryLabel: "全8名（合成データ）",
  /** DEMO-UX-11: fixture field retained; UsersList renders consolidated hint constant. */
  filterHint:
    "状態で絞り込みできます（合成データ内）。業務検索には未接続。概要の要確認/未記録/期限接近と同じ定義です。",
  rows: [
    {
      id: "user-a",
      personLabel: "Aさん",
      statusBadges: [
        { id: "unrecorded", label: SHELL_STATUS_LABEL_UNRECORDED },
        { id: "needs_review", label: SHELL_STATUS_LABEL_NEEDS_REVIEW },
      ],
      planSummary: "支援計画 2026/07/01–09/30",
      attentionNote: "支援記録が未入力",
      lastRecordLabel: "最終記録: 8/10 10:15",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-b",
      personLabel: "Bさん",
      statusBadges: [{ id: "deadline_near", label: SHELL_STATUS_LABEL_DUE_SOON }],
      planSummary: "支援計画 2026/06/01–08/31",
      attentionNote: "見直しまで7日",
      lastRecordLabel: "最終記録: 8/11 09:20",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-c",
      personLabel: "Cさん",
      statusBadges: [{ id: "needs_review", label: SHELL_STATUS_LABEL_NEEDS_REVIEW }],
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
        { id: "unrecorded", label: SHELL_STATUS_LABEL_UNRECORDED },
        { id: "deadline_near", label: SHELL_STATUS_LABEL_DUE_SOON },
      ],
      planSummary: "支援計画 2026/04/01–08/15",
      attentionNote: "本日の記録が未入力",
      lastRecordLabel: "最終記録: 8/08 11:30",
      detailActionLabel: "詳細を見る",
    },
    {
      id: "user-f",
      personLabel: "Fさん",
      statusBadges: [{ id: "needs_review", label: SHELL_STATUS_LABEL_NEEDS_REVIEW }],
      planSummary: "支援計画 2026/07/15–09/30",
      attentionNote: "支援内容の確認が必要",
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
      statusBadges: [{ id: "deadline_near", label: SHELL_STATUS_LABEL_DUE_SOON }],
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
  /** DEMO-UX-8 authorizes synthetic client-side filter on this surface. */
  filterExecutionAuthorized: true as const,
} as const;
