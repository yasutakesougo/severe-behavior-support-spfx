import type { ShellOverviewPresentation } from "./overview-types";

/** Synthetic overview fixture aligned with dashboard-design-v1 DESIGN-4 prototype. */
export const DASHBOARD_UX_OVERVIEW_FIXTURE: ShellOverviewPresentation = {
  kpiCards: [
    { id: "today_targets", label: "今日の対象", count: 12, statusHint: "本日の支援対象" },
    { id: "needs_review", label: "要確認", count: 3, statusHint: "確認が必要" },
    { id: "unrecorded", label: "未記録", count: 2, statusHint: "記録未入力" },
    { id: "deadline_near", label: "期限間近", count: 2, statusHint: "見直し期限が近い" },
  ],
  actionItems: [
    {
      id: "action-a",
      personLabel: "Aさん",
      reason: "支援記録が未入力",
      actionLabel: "記録する",
    },
    {
      id: "action-b",
      personLabel: "Bさん",
      reason: "支援計画の見直しまで7日",
      actionLabel: "確認する",
    },
    {
      id: "action-c",
      personLabel: "Cさん",
      reason: "新しい計画があります",
      actionLabel: "見る",
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
