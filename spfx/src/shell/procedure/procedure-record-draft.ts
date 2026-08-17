/**
 * FIELD-WORKFLOW UI (#356) — ProcedureRecord draft + persist save transitions.
 * Synthetic success is not part of the staff save path (KIOSK-SPFX-PERSISTENCE-1).
 */

import type { ShellSaveState } from "../ux/save-state";
import type { ProcedureRecordDraft } from "./procedure-types";

export function createEmptyProcedureRecordDraft(performedAtLocal?: string): ProcedureRecordDraft {
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

export function retainDraftAfterSaveFailed(draft: ProcedureRecordDraft): ProcedureRecordDraft {
  return {
    result: draft.result,
    performedAtLocal: draft.performedAtLocal,
    note: draft.note,
  };
}

export type ProcedureRecordSaveInFlightGuard = Readonly<{
  tryBegin: () => boolean;
  end: () => void;
  isInFlight: () => boolean;
}>;

/** UI-side duplicate-click guard. Persistence idempotency remains on persistProcedureRecord. */
export function createProcedureRecordSaveInFlightGuard(): ProcedureRecordSaveInFlightGuard {
  let inFlight = false;
  return {
    tryBegin: (): boolean => {
      if (inFlight) {
        return false;
      }
      inFlight = true;
      return true;
    },
    end: (): void => {
      inFlight = false;
    },
    isInFlight: (): boolean => inFlight,
  };
}
