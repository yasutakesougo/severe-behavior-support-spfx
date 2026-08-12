/**
 * DASHBOARD-UX-1 — presentation-only overview vocabulary.
 * Synthetic fixture shapes only — not live domain or adapter outcomes.
 */

export type OverviewKpiCategory =
  | "today_targets"
  | "needs_review"
  | "unrecorded"
  | "deadline_near";

export type OverviewKpiCard = Readonly<{
  id: OverviewKpiCategory;
  label: string;
  count: number;
  /** Textual status hint — never color-only. */
  statusHint: string;
}>;

export type OverviewActionItem = Readonly<{
  id: string;
  personLabel: string;
  reason: string;
  actionLabel: string;
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
