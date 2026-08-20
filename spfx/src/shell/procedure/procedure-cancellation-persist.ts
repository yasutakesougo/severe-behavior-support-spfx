/**
 * CANCEL-SLICE-D — staff cancel persist wiring.
 * Default port is in-memory Slice C fake; liveWriteAuthorized remains false.
 */

import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCancellation,
  resubmitFrozenProcedureRecordCancellation,
  type ProcedureRecord,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSubmitRequest,
  type ProcedureRecordCorrection,
  type ProcedureRecordLifecycleEvent,
  type StaffProcedureRecordCancellationSaveInput,
  type StaffProcedureRecordCancellationSaveResult,
  type LookupResult,
  type AuthorizationContext,
} from "../../sbs-domain/cancellation-persist.bundle";
import type { ProcedureCancellationDraft } from "./procedure-cancellation-draft";

export const STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT =
  createInMemoryProcedureRecordCancellationPersistencePort();

export function buildStaffProcedureRecordCancellationSaveInput(args: {
  originalRecord: ProcedureRecord;
  draft: ProcedureCancellationDraft;
  boundRecordIds: readonly string[];
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[];
  corrections?: readonly ProcedureRecordCorrection[];
  authorization: LookupResult<AuthorizationContext>;
  recordedAtIso: string;
}): StaffProcedureRecordCancellationSaveInput {
  return {
    targetRecordId: args.originalRecord.RecordId,
    originalRecord: args.originalRecord,
    reason: args.draft.reason,
    boundRecordIds: args.boundRecordIds,
    lifecycleEvents: args.lifecycleEvents,
    corrections: args.corrections ?? [],
    authorization: args.authorization,
    recordedAtIso: args.recordedAtIso,
  };
}

export async function persistStaffProcedureRecordCancellationFromForm(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort = STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  return persistStaffProcedureRecordCancellation(input, port);
}

export async function confirmStaffProcedureRecordCancellationOutcome(
  request: ProcedureRecordCancellationSubmitRequest,
  port: ProcedureRecordCancellationPersistencePort = STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  return resubmitFrozenProcedureRecordCancellation(request, port);
}

export { nowAsiaTokyoIsoDateTime, persistStaffProcedureRecordCancellation };
export type {
  ProcedureRecordCancellationPersistencePort,
  ProcedureRecordCancellationSubmitRequest,
  StaffProcedureRecordCancellationSaveInput,
  StaffProcedureRecordCancellationSaveResult,
  ProcedureRecordLifecycleEvent,
  ProcedureRecord,
};
