/**
 * FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1 — correction draft + save guards.
 */

import {
  asiaTokyoDateTimeLocalToIso,
  isCorrectionPerformedAtSameLocalDate,
} from "../../sbs-domain/correction-persist.bundle";
import type { ShellSaveState } from "../ux/save-state";
import type { ProcedureRecordResultValue } from "./procedure-types";
import { createProcedureRecordSaveInFlightGuard } from "./procedure-record-draft";

export type ProcedureCorrectionDraft = Readonly<{
  result: ProcedureRecordResultValue | undefined;
  performedAtLocal: string;
  reason: string;
}>;

const ASIA_TOKYO = "Asia/Tokyo";

/** Presentation-local datetime-local from ISO instant (Asia/Tokyo wall clock). */
export function asiaTokyoIsoToDateTimeLocal(iso: string): string | undefined {
  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) {
    return undefined;
  }
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: ASIA_TOKYO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: ASIA_TOKYO,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
  return `${datePart}T${timePart}`;
}

export function createCorrectionDraftFromRecord(input: {
  result: ProcedureRecordResultValue;
  performedAt: string;
}): ProcedureCorrectionDraft {
  return {
    result: input.result,
    performedAtLocal: asiaTokyoIsoToDateTimeLocal(input.performedAt) ?? "",
    reason: "",
  };
}

export function isCorrectionDraftReadyToSave(
  draft: ProcedureCorrectionDraft,
  originalLocalDate: string,
): boolean {
  if (draft.result === undefined) {
    return false;
  }
  if (draft.performedAtLocal.trim().length === 0) {
    return false;
  }
  if (draft.reason.trim().length === 0) {
    return false;
  }
  if (asiaTokyoDateTimeLocalToIso(draft.performedAtLocal) === null) {
    return false;
  }
  return isCorrectionPerformedAtSameLocalDate(draft.performedAtLocal, originalLocalDate);
}

export function canRetryCorrectionSave(saveState: ShellSaveState): boolean {
  if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
    return false;
  }
  return true;
}

export function retainCorrectionDraftAfterSaveFailed(
  draft: ProcedureCorrectionDraft,
): ProcedureCorrectionDraft {
  return {
    result: draft.result,
    performedAtLocal: draft.performedAtLocal,
    reason: draft.reason,
  };
}

export { createProcedureRecordSaveInFlightGuard };
