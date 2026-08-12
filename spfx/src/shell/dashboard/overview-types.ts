/**
 * DASHBOARD-UX-1 — presentation-only overview vocabulary.
 * Synthetic fixture shapes only — not live domain or adapter outcomes.
 */

export type OverviewKpiCategory = "today_targets" | "needs_review" | "unrecorded" | "deadline_near";

export type OverviewKpiCard = Readonly<{
  id: OverviewKpiCategory;
  label: string;
  count: number;
  /** Textual status hint — never color-only. */
  statusHint: string;
}>;

/**
 * DEMO-UX-7 presentation-only navigation from Overview today-actions.
 * Synthetic local routing only — not save / SharePoint / live business execution.
 */
export type OverviewActionNavigationTarget =
  | Readonly<{ kind: "records" }>
  | Readonly<{ kind: "review_due" }>
  | Readonly<{ kind: "user_detail"; userId: string }>;

export type OverviewActionItem = Readonly<{
  id: string;
  personLabel: string;
  reason: string;
  actionLabel: string;
  navigation?: OverviewActionNavigationTarget;
}>;

export type OverviewRecentRecord = Readonly<{
  id: string;
  personLabel: string;
  timeLabel: string;
  recordType: string;
}>;

export type ShellOverviewPresentation = Readonly<{
  kpiCards: readonly OverviewKpiCard[];
  actionItems: readonly OverviewActionItem[];
  recentRecords: readonly OverviewRecentRecord[];
}>;
