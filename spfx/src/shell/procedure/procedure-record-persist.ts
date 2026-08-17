/**
 * Staff ProcedureRecord persist wiring (KIOSK-SPFX-PERSISTENCE-1).
 * Calls persistStaffProcedureRecord → persistProcedureRecord (bundled domain).
 * Default port is LIVE WRITE HOLD (no SharePoint mutation).
 */

import {
  createLiveWriteHoldProcedureRecordPersistencePort,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecord,
  type ProcedureRecordPersistencePort,
  type StaffProcedureRecordCreateInput,
  type StaffProcedureRecordSaveResult,
} from "../../sbs-domain/staff-persist.bundle";
import type { ProcedureBindingContext, ProcedureRecordDraft } from "./procedure-types";

export const STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT =
  createLiveWriteHoldProcedureRecordPersistencePort();

export function buildStaffProcedureRecordCreateInput(args: {
  context: ProcedureBindingContext;
  draft: ProcedureRecordDraft;
  recordedBy: string;
  recordedAtIso?: string;
  nowIso: string;
}): StaffProcedureRecordCreateInput {
  return {
    OrganizationId: args.context.organizationId,
    SiteId: args.context.siteId,
    UserId: args.context.userId,
    recordedBy: args.recordedBy,
    planId: args.context.planId,
    planVersion: args.context.planVersion,
    ProcedureId: args.context.procedureId,
    ProcedureVersion: args.context.procedureVersion,
    result: args.draft.result,
    performedAtLocal: args.draft.performedAtLocal,
    recordedAtIso: args.recordedAtIso,
    nowIso: args.nowIso,
  };
}

export async function persistStaffProcedureRecordFromForm(
  input: StaffProcedureRecordCreateInput,
  port: ProcedureRecordPersistencePort = STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT,
): Promise<StaffProcedureRecordSaveResult> {
  return persistStaffProcedureRecord(input, port);
}

export { nowAsiaTokyoIsoDateTime, persistStaffProcedureRecord };
export type { ProcedureRecordPersistencePort, StaffProcedureRecordCreateInput };
