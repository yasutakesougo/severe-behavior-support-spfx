/**
 * FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1 — original binding builder.
 * Fail-closed when binding fields are missing.
 */

import type { ProcedureRecordCorrectionOriginalBinding } from "../../sbs-domain/correction-persist.bundle";
import type { ProcedureRecord } from "../../sbs-domain/kiosk-read-model.bundle";
import type { ProcedureBindingContext } from "./procedure-types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Builds authoritative original binding from kiosk bound record + procedure context.
 * Returns undefined when any required field is absent (save wiring must not activate).
 */
export function buildProcedureCorrectionOriginalBinding(
  context: ProcedureBindingContext | undefined,
  boundRecord: ProcedureRecord | undefined,
): ProcedureRecordCorrectionOriginalBinding | undefined {
  if (!context || !boundRecord) {
    return undefined;
  }

  if (
    !isNonEmptyString(boundRecord.RecordId) ||
    !isNonEmptyString(boundRecord.OrganizationId) ||
    !isNonEmptyString(boundRecord.SiteId) ||
    !isNonEmptyString(boundRecord.UserId) ||
    !isNonEmptyString(boundRecord.recordedAt) ||
    !isNonEmptyString(boundRecord.recordedBy) ||
    !isNonEmptyString(boundRecord.LocalDate) ||
    !isNonEmptyString(context.planId) ||
    !Number.isInteger(context.planVersion) ||
    context.planVersion < 1 ||
    !isNonEmptyString(context.procedureId) ||
    !isNonEmptyString(context.procedureVersion) ||
    boundRecord.Procedure?.ApprovalState !== "APPROVED" ||
    !isNonEmptyString(boundRecord.Procedure?.ProcedureId) ||
    !isNonEmptyString(boundRecord.Procedure?.ProcedureVersion)
  ) {
    return undefined;
  }

  return {
    originalRecordId: boundRecord.RecordId,
    OrganizationId: boundRecord.OrganizationId,
    SiteId: boundRecord.SiteId,
    UserId: boundRecord.UserId,
    Procedure: {
      ProcedureId: context.procedureId,
      ProcedureVersion: context.procedureVersion,
      ApprovalState: "APPROVED",
    },
    planId: context.planId,
    planVersion: context.planVersion,
    originalRecordedAt: boundRecord.recordedAt,
    originalRecordedBy: boundRecord.recordedBy,
    originalLocalDate: boundRecord.LocalDate,
  };
}
