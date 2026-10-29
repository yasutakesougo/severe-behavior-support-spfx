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

export type ProcedureCorrectionOccurrenceSource = Readonly<{
  occurrenceId: string;
  localDate: string;
  rawResolverResult: {
    status: string;
    effectiveRecordId?: string;
    targetRecordId?: string;
  };
}>;

/**
 * Builds authoritative original binding from kiosk bound record + procedure context.
 * Returns undefined when any required field or occurrence verification source is absent (save wiring must not activate).
 */
export function buildProcedureCorrectionOriginalBinding(
  context: ProcedureBindingContext | undefined,
  boundRecord: ProcedureRecord | undefined,
  occurrenceSource?: ProcedureCorrectionOccurrenceSource,
): ProcedureRecordCorrectionOriginalBinding | undefined {
  if (!context || !boundRecord || !occurrenceSource) {
    return undefined;
  }

  // U6-A Fix 2: Independent occurrence verification source required
  if (
    !isNonEmptyString(context.occurrenceId) ||
    occurrenceSource.occurrenceId !== context.occurrenceId ||
    occurrenceSource.localDate !== boundRecord.LocalDate
  ) {
    return undefined;
  }

  if (occurrenceSource.rawResolverResult.status === "RECORDED") {
    if (occurrenceSource.rawResolverResult.effectiveRecordId !== boundRecord.RecordId) {
      return undefined;
    }
  } else if (occurrenceSource.rawResolverResult.status === "CANCELLED") {
    if (occurrenceSource.rawResolverResult.targetRecordId !== boundRecord.RecordId) {
      return undefined;
    }
  } else {
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
    !isNonEmptyString(boundRecord.Procedure?.ProcedureVersion) ||
    context.userId !== boundRecord.UserId ||
    context.organizationId !== boundRecord.OrganizationId ||
    context.siteId !== boundRecord.SiteId ||
    context.planId !== boundRecord.planId ||
    context.planVersion !== boundRecord.planVersion ||
    context.procedureId !== boundRecord.Procedure.ProcedureId ||
    context.procedureVersion !== boundRecord.Procedure.ProcedureVersion
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
