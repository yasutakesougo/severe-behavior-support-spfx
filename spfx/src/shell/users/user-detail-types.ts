/**
 * DEMO-UX-3 — presentation-only user detail vocabulary.
 * Synthetic fixture shapes only — not live domain, adapter, or authorization outcomes.
 */

export type UserDetailSupportItem = Readonly<{
  id: string;
  label: string;
  body: string;
}>;

export type UserDetailRecentRecord = Readonly<{
  id: string;
  occurredAtLabel: string;
  recordTypeLabel: string;
}>;

export type UserDetailBusinessFacts = Readonly<{
  createdByLabel: string;
  qualificationLabel: string;
  createdAtLabel: string;
}>;

export type UserDetailSystemState = Readonly<{
  saveStateLabel: string;
  lastUpdatedLabel: string;
}>;

export type ShellUserDetailPresentation = Readonly<{
  userId: string;
  personLabel: string;
  planLabel: string;
  planPeriodLabel: string;
  /** Presentation-only current vs historical distinction. Not a lifecycle mutation. */
  planLifecycleLabel: string;
  currentSupport: readonly UserDetailSupportItem[];
  recentRecords: readonly UserDetailRecentRecord[];
  evaluationSummary: string;
  historySummary: string;
  businessFacts: UserDetailBusinessFacts;
  systemState: UserDetailSystemState;
}>;
