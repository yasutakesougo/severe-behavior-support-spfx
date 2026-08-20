/**
 * CANCEL-SLICE-D — cancellation draft + save / confirm guards.
 */

import type { ShellSaveState } from "../ux/save-state";
import { createProcedureRecordSaveInFlightGuard } from "./procedure-record-draft";

export type ProcedureCancellationDraft = Readonly<{
  reason: string;
  /** Explicit confirm separate from reason (tablet confirm step). */
  confirmed: boolean;
}>;

export function createEmptyCancellationDraft(): ProcedureCancellationDraft {
  return {
    reason: "",
    confirmed: false,
  };
}

export function isCancellationDraftReadyToSave(draft: ProcedureCancellationDraft): boolean {
  return draft.reason.trim().length > 0 && draft.confirmed;
}

export function canRetryCancellationSave(saveState: ShellSaveState): boolean {
  if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
    return false;
  }
  return true;
}

/** save_outcome_unknown may offer 「結果を確認」 (exact frozen resubmit), not a new-identity retry. */
export function canConfirmCancellationOutcome(saveState: ShellSaveState): boolean {
  return saveState === "save_outcome_unknown";
}

export function retainCancellationDraftAfterSaveFailed(
  draft: ProcedureCancellationDraft,
): ProcedureCancellationDraft {
  return {
    reason: draft.reason,
    confirmed: draft.confirmed,
  };
}

export { createProcedureRecordSaveInFlightGuard };
