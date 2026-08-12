/**
 * DEMO-UX-2 — presentation-only users list vocabulary.
 * Synthetic fixture shapes only — not live domain or adapter outcomes.
 */

export type UserListStatusCategory =
  | "needs_review"
  | "unrecorded"
  | "deadline_near"
  | "normal";

export type UserListStatusBadge = Readonly<{
  id: UserListStatusCategory;
  label: string;
}>;

export type UserListRow = Readonly<{
  id: string;
  personLabel: string;
  statusBadges: readonly UserListStatusBadge[];
  planSummary: string;
  attentionNote: string;
  lastRecordLabel: string;
  detailActionLabel: string;
}>;

export type ShellUsersPresentation = Readonly<{
  summaryLabel: string;
  filterHint: string;
  rows: readonly UserListRow[];
}>;
