/**
 * SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — presentation-only list vocabulary.
 * Family P is not Family R (users 要確認/未記録/期限接近) or Family A (review attention).
 * Not live domain, adapter, mutation, or Schema status expansion.
 */

export const SUPPORT_PLAN_MANAGEMENT_WORK_STATES = [
  "active",
  "review_window",
  "observation_check",
  "procedure_updating",
  "uncreated",
] as const;

export type SupportPlanManagementWorkState = (typeof SUPPORT_PLAN_MANAGEMENT_WORK_STATES)[number];

export const SUPPORT_PLAN_MANAGEMENT_ATTENTION_KINDS = [
  "none",
  "needs_action",
  "review_window",
  "observation_wait",
] as const;

export type SupportPlanManagementAttentionKind =
  (typeof SUPPORT_PLAN_MANAGEMENT_ATTENTION_KINDS)[number];

export const SUPPORT_PLAN_MANAGEMENT_ACTION_KINDS = ["detail", "create"] as const;

export type SupportPlanManagementActionKind = (typeof SUPPORT_PLAN_MANAGEMENT_ACTION_KINDS)[number];

export type SupportPlanManagementRow = Readonly<{
  userId: string;
  personLabel: string;
  workState: SupportPlanManagementWorkState;
  workStateLabel: string;
  currentVersionLabel: string;
  lastObservationLabel: string;
  reviewWindowLabel: string;
  attentionKind: SupportPlanManagementAttentionKind;
  attentionLabel: string;
  actionKind: SupportPlanManagementActionKind;
  actionLabel: string;
}>;

export type ShellSupportPlanManagementListPresentation = Readonly<{
  heading: string;
  rows: readonly SupportPlanManagementRow[];
}>;

export type SupportPlanManagementListNext =
  | Readonly<{ kind: "existing-plan"; userId: string }>
  | Readonly<{ kind: "synthetic-detail"; userId: string }>
  | Readonly<{ kind: "create"; userId: string }>;
