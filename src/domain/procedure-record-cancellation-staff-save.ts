/**
 * Staff UI → CANCEL lifecycle submit mapping (CANCEL-SLICE-D).
 * Builds Slice A semanticsInput and calls Slice C submitCancellation.
 * No SharePoint I/O. No LIVE WRITE elevation.
 */

import type { AuthorizationContext, LookupResult } from "../contracts";
import type { ProcedureRecordLifecycleEvent } from "./kiosk-contract";
import type { ProcedureRecordCorrection } from "./procedure-record-correction";
import type { ProcedureRecord } from "./procedure-record";
import { nowAsiaTokyoIsoDateTime } from "./procedure-record-staff-save";
import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  createProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSaveOutcome,
  type ProcedureRecordCancellationSubmitRequest,
} from "./procedure-record-cancellation-persistence";

export type StaffProcedureRecordCancellationSaveInput = Readonly<{
  targetRecordId: string;
  originalRecord: ProcedureRecord;
  reason: string;
  boundRecordIds: readonly string[];
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[];
  corrections: readonly ProcedureRecordCorrection[];
  authorization: LookupResult<AuthorizationContext>;
  /** Frozen from the first attempt of this logical payload; retry must reuse it. */
  recordedAtIso: string;
}>;

export type StaffProcedureRecordCancellationSaveResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  event: ProcedureRecordLifecycleEvent | null;
  appendCalled: boolean;
  request: ProcedureRecordCancellationSubmitRequest;
}>;

export function buildProcedureRecordCancellationSubmitRequest(
  input: StaffProcedureRecordCancellationSaveInput,
): ProcedureRecordCancellationSubmitRequest {
  return {
    semanticsInput: {
      operation: "CANCEL",
      targetRecordId: input.targetRecordId,
      originalRecord: input.originalRecord,
      reason: input.reason.trim(),
      boundRecordIds: input.boundRecordIds,
      lifecycleEvents: input.lifecycleEvents,
      corrections: input.corrections,
      authorization: input.authorization,
    },
    recordedAtIso: input.recordedAtIso,
  };
}

export async function persistStaffProcedureRecordCancellation(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  const request = buildProcedureRecordCancellationSubmitRequest(input);
  const result = await port.submitCancellation(request);
  return {
    saveState: result.saveState,
    event: result.event,
    appendCalled: result.appendCalled,
    request,
  };
}

/**
 * Exact same frozen request re-submit for save_outcome_unknown 「結果を確認」.
 * Must not mint a new timestamp or identity.
 */
export async function resubmitFrozenProcedureRecordCancellation(
  request: ProcedureRecordCancellationSubmitRequest,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  const result = await port.submitCancellation(request);
  return {
    saveState: result.saveState,
    event: result.event,
    appendCalled: result.appendCalled,
    request,
  };
}

export {
  createInMemoryProcedureRecordCancellationPersistencePort,
  createProcedureRecordCancellationPersistencePort,
  nowAsiaTokyoIsoDateTime,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSaveOutcome,
  type ProcedureRecordCancellationSubmitRequest,
};
