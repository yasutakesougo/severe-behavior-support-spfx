/**
 * Staff ProcedureRecordCancellation persist wiring.
 * Default port is in-memory fake append-only; liveWriteAuthorized remains false.
 */

import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCancellation,
  type ProcedureRecordCancellationPersistencePort,
  type StaffProcedureRecordCancellationSaveInput,
  type StaffProcedureRecordCancellationSaveResult,
} from "../../sbs-domain/cancellation-persist.bundle";
import type { ProcedureCancellationPresentation } from "./procedure-cancellation";

export const STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT =
  createInMemoryProcedureRecordCancellationPersistencePort();

export function buildStaffProcedureRecordCancellationSaveInput(args: {
  presentation: ProcedureCancellationPresentation;
  reason: string;
  cancelledBy: string;
  recordedAtIso?: string;
  nowIso: string;
}): StaffProcedureRecordCancellationSaveInput {
  const semanticsInput = {
    operation: "CANCEL",
    targetRecordId: args.presentation.recordId,
    originalRecord: args.presentation.boundRecord,
    reason: args.reason,
    boundRecordIds: [args.presentation.recordId],
    lifecycleEvents: [],
    corrections: [],
    authorization: {
      status: "FOUND",
      value: {
        Subject: args.cancelledBy,
        UserId: args.cancelledBy,
        OrganizationId: args.presentation.organizationId,
        SiteContext: {
          Memberships: [
            {
              SiteId: args.presentation.siteId,
              Roles: ["SERVICE_MANAGER"],
            },
          ],
          SelectedSiteId: args.presentation.siteId,
        },
      },
    },
  };

  return {
    semanticsInput,
    recordedAtIso: args.recordedAtIso,
    nowIso: args.nowIso,
  };
}

export async function persistStaffProcedureRecordCancellationFromForm(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort = STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
): Promise<StaffProcedureRecordCancellationSaveResult> {
  return persistStaffProcedureRecordCancellation(input, port);
}

export { nowAsiaTokyoIsoDateTime, persistStaffProcedureRecordCancellation };
export type {
  ProcedureRecordCancellationPersistencePort,
  StaffProcedureRecordCancellationSaveInput,
  StaffProcedureRecordCancellationSaveResult,
};
