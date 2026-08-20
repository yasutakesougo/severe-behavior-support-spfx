/**
 * Staff UI → ProcedureRecordCancellation submit mapping.
 * Reuses cancellation semantics + persistence port. No SharePoint I/O.
 */

import { nowAsiaTokyoIsoDateTime } from "./procedure-record-staff-save";
import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSaveOutcome,
} from "./procedure-record-cancellation-persistence";
import type { ProcedureRecordLifecycleEvent } from "./kiosk-contract";
import { isNonEmptyString, isValidIsoDateTime } from "./validation";

export type StaffProcedureRecordCancellationSaveInput = Readonly<{
  semanticsInput: unknown;
  /** Frozen from the first attempt of this payload; retry must reuse it. */
  recordedAtIso?: string;
  nowIso: string;
}>;

export type StaffProcedureRecordCancellationSaveResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  event: ProcedureRecordLifecycleEvent | null;
  appendCalled: boolean;
}>;

export async function persistStaffProcedureRecordCancellation(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  const recordedAt = isNonEmptyString(input.recordedAtIso) ? input.recordedAtIso : input.nowIso;
  if (!isValidIsoDateTime(recordedAt)) {
    return { saveState: "save_failed", event: null, appendCalled: false };
  }

  const result = await port.submitCancellation({
    semanticsInput: input.semanticsInput,
    recordedAtIso: recordedAt,
  });

  return {
    saveState: result.saveState,
    event: result.event,
    appendCalled: result.appendCalled,
  };
}

export {
  createInMemoryProcedureRecordCancellationPersistencePort,
  nowAsiaTokyoIsoDateTime,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSaveOutcome,
};
