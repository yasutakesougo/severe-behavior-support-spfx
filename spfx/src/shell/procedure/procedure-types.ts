/**
 * FIELD-WORKFLOW UI (#356) — presentation vocabulary aligned to A/B contracts.
 * Synthetic fixtures only — not live SharePoint / adapter / auth outcomes.
 */

import type { ShellSaveState } from "../ux/save-state";

/** B-PKG-1 result vocabulary — factual, not staff success/failure. */
export const PROCEDURE_RECORD_RESULT_VALUES = [
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED",
] as const;

export type ProcedureRecordResultValue = (typeof PROCEDURE_RECORD_RESULT_VALUES)[number];

export type ProcedureBindingContext = Readonly<{
  userId: string;
  personLabel: string;
  organizationId: string;
  siteId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  planPeriodLabel: string;
}>;

/** A2 presentation projection — 場面→実施→避ける→補足 (body outside contracts). */
export type CurrentProcedureProjection = Readonly<{
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
  noteLabel: string;
}>;

export type ShellCurrentProcedurePresentation = Readonly<{
  context: ProcedureBindingContext;
  projection: CurrentProcedureProjection;
  heading: string;
  summaryPrompt: string;
}>;

export type ProcedureRecordDraft = Readonly<{
  result: ProcedureRecordResultValue | undefined;
  performedAtLocal: string;
  note: string;
}>;

export type SyntheticProcedureSaveOutcome = "saved" | "save_failed" | "save_outcome_unknown";

export type HistoricalLookupStatus =
  "RESOLVED" | "EMPTY" | "UNKNOWN" | "FETCH_FAILED" | "VERSION_MISMATCH" | "PLAN_MISMATCH";

export type ShellProcedureReviewMaterial = Readonly<{
  id: string;
  personLabel: string;
  result: ProcedureRecordResultValue;
  performedAtLabel: string;
  recordedAtLabel: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  /** FW-05: historical projection status — never Active fallback. */
  historicalLookupStatus: HistoricalLookupStatus;
  /** Present only when historicalLookupStatus === RESOLVED. */
  projectedSupportMethods?: readonly string[];
  projectedPrecautions?: readonly string[];
}>;

export type ShellProcedureWorkflowPresentation = Readonly<{
  /** userId → current Active procedure for field confirmation (FW-01). */
  currentByUserId: Readonly<Record<string, ShellCurrentProcedurePresentation>>;
  /** Review materials (FW-07) — may include historical v2 while Active is v3. */
  reviewMaterials: readonly ShellProcedureReviewMaterial[];
  /** Synthetic save outcome controls for demo/smoke (not live I/O). */
  defaultSaveOutcome: SyntheticProcedureSaveOutcome;
}>;

export type ProcedureRecordFormSaveSnapshot = Readonly<{
  saveState: ShellSaveState;
  draft: ProcedureRecordDraft;
  context: ProcedureBindingContext;
}>;
