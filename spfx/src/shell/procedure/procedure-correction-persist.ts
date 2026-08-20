/**
 * Staff ProcedureRecordCorrection persist wiring
 * (FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1).
 * Default port is in-memory fake append-only; liveWriteAuthorized remains false.
 */

import {
  createInMemoryProcedureRecordCorrectionPersistencePort,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCorrection,
  type FieldStaffCorrectionAuthContext,
  type ProcedureRecordCorrectionOriginalBinding,
  type ProcedureRecordCorrectionPersistencePort,
  type StaffProcedureRecordCorrectionSaveInput,
  type StaffProcedureRecordCorrectionSaveResult,
} from "../../sbs-domain/correction-persist.bundle";
import type { ProcedureCorrectionDraft } from "./procedure-correction-draft";

export const STAFF_PROCEDURE_RECORD_CORRECTION_IN_MEMORY_PORT =
  createInMemoryProcedureRecordCorrectionPersistencePort();

export function buildStaffProcedureRecordCorrectionSaveInput(args: {
  originalBinding: ProcedureRecordCorrectionOriginalBinding;
  draft: ProcedureCorrectionDraft;
  correctedBy: string;
  correctedAtIso?: string;
  nowIso: string;
  auth?: FieldStaffCorrectionAuthContext;
}): StaffProcedureRecordCorrectionSaveInput {
  return {
    originalBinding: args.originalBinding,
    result: args.draft.result,
    performedAtLocal: args.draft.performedAtLocal,
    reason: args.draft.reason,
    correctedBy: args.correctedBy,
    correctedAtIso: args.correctedAtIso,
    nowIso: args.nowIso,
    auth: args.auth,
  };
}

export async function persistStaffProcedureRecordCorrectionFromForm(
  input: StaffProcedureRecordCorrectionSaveInput,
  port: ProcedureRecordCorrectionPersistencePort = STAFF_PROCEDURE_RECORD_CORRECTION_IN_MEMORY_PORT,
): Promise<StaffProcedureRecordCorrectionSaveResult> {
  return persistStaffProcedureRecordCorrection(input, port);
}

export { nowAsiaTokyoIsoDateTime, persistStaffProcedureRecordCorrection };
export type {
  FieldStaffCorrectionAuthContext,
  ProcedureRecordCorrectionPersistencePort,
  StaffProcedureRecordCorrectionSaveInput,
  StaffProcedureRecordCorrectionSaveResult,
};
