import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
} from "../ux/status-labels";
import type { ShellOverviewPresentation } from "./overview-types";

/** Synthetic overview fixture aligned with dashboard-design-v1 DESIGN-4 prototype. */
export const DASHBOARD_UX_OVERVIEW_FIXTURE: ShellOverviewPresentation = {
  kpiCards: [
    { id: "today_targets", label: "今日の対象", count: 12, statusHint: "本日の支援対象" },
    {
      id: "needs_review",
      label: SHELL_STATUS_LABEL_NEEDS_REVIEW,
      count: 3,
      statusHint: "確認が必要",
    },
    {
      id: "unrecorded",
      label: SHELL_STATUS_LABEL_UNRECORDED,
      count: 2,
      statusHint: "記録未入力",
    },
    {
      id: "deadline_near",
      label: SHELL_STATUS_LABEL_DUE_SOON,
      count: 2,
      statusHint: "見直し期限が近い",
    },
  ],
  actionItems: [
    {
      id: "action-a",
      personLabel: "Aさん",
      reason: "支援記録が未入力",
      actionLabel: "記録する",
      navigation: { kind: "records" },
    },
    {
      id: "action-b",
      personLabel: "Bさん",
      reason: "支援計画の見直しまで7日",
      actionLabel: "確認する",
      navigation: { kind: "review_due" },
    },
    {
      id: "action-c",
      personLabel: "Cさん",
      reason: "新しい計画があります",
      actionLabel: "見る",
      navigation: { kind: "user_detail", userId: "user-c" },
    },
  ],
  recentRecords: [
    {
      id: "recent-a",
      personLabel: "Aさん",
      timeLabel: "14:32",
      recordType: "支援記録",
    },
    {
      id: "recent-d",
      personLabel: "Dさん",
      timeLabel: "13:05",
      recordType: "支援記録",
    },
  ],
};

export const DASHBOARD_UX_SLICE = {
  id: "DASHBOARD-UX-1",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveOverviewDataAuthorized: false as const,
  kpiNavigationAuthorized: false as const,
  actionExecutionAuthorized: false as const,
} as const;
