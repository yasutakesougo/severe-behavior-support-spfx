/**
 * FIELD-WORKFLOW UI (#356) — ProcedureRecord draft + synthetic save transitions (FW-09).
 */

import type { ShellSaveState } from "../ux/save-state";
import type {
  ProcedureBindingContext,
  ProcedureRecordDraft,
  ProcedureRecordResultValue,
  SyntheticProcedureSaveOutcome,
} from "./procedure-types";

export function createEmptyProcedureRecordDraft(
  performedAtLocal?: string,
): ProcedureRecordDraft {
  return {
    result: undefined,
    performedAtLocal: performedAtLocal ?? defaultTokyoPerformedAtLocal(),
    note: "",
  };
}

/** Presentation-local datetime-local string (Tokyo wall clock approximation for demo). */
export function defaultTokyoPerformedAtLocal(): string {
  return "2026-08-13T14:05";
}

export function isProcedureRecordDraftReadyToSave(draft: ProcedureRecordDraft): boolean {
  return draft.result !== undefined && draft.performedAtLocal.trim().length > 0;
}

export function canRetryProcedureRecordSave(saveState: ShellSaveState): boolean {
  if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
    return false;
  }
  return true;
}

export function nextSaveStateForSyntheticOutcome(
  outcome: SyntheticProcedureSaveOutcome,
): ShellSaveState {
  return outcome;
}

export function retainDraftAfterSaveFailed(
  draft: ProcedureRecordDraft,
): ProcedureRecordDraft {
  return {
    result: draft.result,
    performedAtLocal: draft.performedAtLocal,
    note: draft.note,
  };
}

export type ProcedureRecordSaveRequest = Readonly<{
  context: ProcedureBindingContext;
  draft: ProcedureRecordDraft;
  outcome: SyntheticProcedureSaveOutcome;
}>;

export type ProcedureRecordSaveResult = Readonly<{
  saveState: ShellSaveState;
  draft: ProcedureRecordDraft;
  /** Frozen binding echoed back — must match request context (no rebind to Active). */
  context: ProcedureBindingContext;
  result: ProcedureRecordResultValue | undefined;
}>;

/**
 * Synthetic save path. Never writes SharePoint.
 * save_failed retains draft; save_outcome_unknown keeps draft and blocks immediate retry via canRetry.
 */
export function applySyntheticProcedureRecordSave(
  request: ProcedureRecordSaveRequest,
): ProcedureRecordSaveResult {
  const saveState = nextSaveStateForSyntheticOutcome(request.outcome);
  const draft =
    saveState === "save_failed" || saveState === "save_outcome_unknown" || saveState === "saved"
      ? retainDraftAfterSaveFailed(request.draft)
      : request.draft;

  return {
    saveState,
    draft,
    context: request.context,
    result: request.draft.result,
  };
}
