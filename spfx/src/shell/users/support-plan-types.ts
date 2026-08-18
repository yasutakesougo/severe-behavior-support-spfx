/**
 * DEMO-UX-4 + PLANNING-PC-DEMO-1 — presentation-only support plan vocabulary.
 * Synthetic fixture shapes only — not live domain, adapter, or mutation outcomes.
 * Schema 1.0.0 field names are mirrored; this file does not import src/domain.
 */

import type { ShellProcedureReviewMaterial } from "../procedure/procedure-types";

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
  /** Application activation metadata. Not 制度上の最終承認. */
  appliedFromLabel: string;
}>;

export type SupportPlanSystemState = Readonly<{
  saveStateLabel: string;
  lastUpdatedLabel: string;
}>;

export type SupportPlanVersionEntry = Readonly<{
  version: number;
  createdAtLabel: string;
  lifecycleLabel: string;
  isCurrent: boolean;
  summary: string;
  supportMethods: readonly string[];
  precautions: readonly string[];
}>;

export type SupportPlanCurrentProcedureSummary = Readonly<{
  procedureId: string;
  procedureVersion: string;
  planVersion: number;
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
}>;

export type ShellSupportPlanPresentation = Readonly<{
  userId: string;
  personLabel: string;
  planTitle: string;
  planPeriodLabel: string;
  /** Presentation-only current vs historical distinction. Not a lifecycle mutation. */
  planLifecycleLabel: string;
  planId: string;
  currentVersion: number;
  /** Schema 1.0.0 status. Display uses statusLabel (適用中), not 承認済み. */
  statusCode: "Active";
  statusLabel: string;
  summary: string;
  goals: readonly SupportPlanGoal[];
  actionItems: readonly SupportPlanActionItem[];
  reviewStatus: SupportPlanReviewStatus;
  businessFacts: SupportPlanBusinessFacts;
  systemState: SupportPlanSystemState;
  versions: readonly SupportPlanVersionEntry[];
  currentProcedures: readonly SupportPlanCurrentProcedureSummary[];
  recentProcedureRecords: readonly ShellProcedureReviewMaterial[];
  /** Presentation-only. Not a persisted Draft / next SupportPlanVersion. */
  conceptualNextVersion: number;
}>;
