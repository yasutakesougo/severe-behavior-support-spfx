/**
 * DEMO-UX-4 — presentation-only support plan vocabulary.
 * Synthetic fixture shapes only — not live domain, adapter, or mutation outcomes.
 */

export type SupportPlanGoal = Readonly<{
  id: string;
  label: string;
  body: string;
}>;

export type SupportPlanActionItem = Readonly<{
  id: string;
  categoryLabel: string;
  body: string;
}>;

export type SupportPlanReviewStatus = Readonly<{
  reviewDueLabel: string;
  reviewStatusLabel: string;
  attentionNote: string;
}>;

export type SupportPlanBusinessFacts = Readonly<{
  createdByLabel: string;
  qualificationLabel: string;
  createdAtLabel: string;
}>;

export type SupportPlanSystemState = Readonly<{
  saveStateLabel: string;
  lastUpdatedLabel: string;
}>;

export type ShellSupportPlanPresentation = Readonly<{
  userId: string;
  personLabel: string;
  planTitle: string;
  planPeriodLabel: string;
  summary: string;
  goals: readonly SupportPlanGoal[];
  actionItems: readonly SupportPlanActionItem[];
  reviewStatus: SupportPlanReviewStatus;
  businessFacts: SupportPlanBusinessFacts;
  systemState: SupportPlanSystemState;
}>;
