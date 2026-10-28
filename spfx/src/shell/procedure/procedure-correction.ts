import { labelForProcedureRecordResult } from "./procedure-copy";
import type { ProcedureBindingContext } from "./procedure-types";
import type { ProcedureRecordResultValue } from "./procedure-types";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import { formatStaffBusinessDateTime } from "../ux/staff-date-time-presentation";

export const FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE = {
  id: "FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1",
  correctionSaveWiringAuthorized: true as const,
  correctionPersistAuthorized: true as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  cancellationAuthorized: false as const,
  lifecycleMutationAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export const FIELD_STAFF_PHASE8_CORRECTION_1_SLICE = {
  id: "FIELD-STAFF-PHASE8-CORRECTION-1",
  presentationOnly: true as const,
  correctionEntryAuthorized: true as const,
  currentRecordReuseAuthorized: true as const,
  saveSemanticsChangeAuthorized: false as const,
  cancellationAuthorized: false as const,
  abcExpansionAuthorized: false as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export type ProcedureCorrectionPresentation = Readonly<{
  personLabel: string;
  occurrenceStatus: string;
  activityLabel: string;
  scheduledTime: string;
  recordId: string;
  result: ProcedureRecordResultValue;
  resultLabel: string;
  performedAt: string;
  performedAtLabel: string;
  recordedAt: string;
  recordedAtLabel: string;
  recordedBy: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  occurrenceId: string;
}>;

export function presentProcedureCorrection(
  item: TodaySupportItem | undefined,
  context: ProcedureBindingContext | undefined,
): ProcedureCorrectionPresentation | undefined {
  if (
    !FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.correctionEntryAuthorized ||
    !item ||
    !context ||
    !item.boundRecord ||
    item.rawResolverResult.status === "CONFLICT" ||
    item.rawResolverResult.status === "INVALID"
  ) {
    return undefined;
  }

  // U6-A: Differentiate RECORDED vs CANCELLED record id resolution
  if (item.rawResolverResult.status === "RECORDED") {
    if (item.rawResolverResult.effectiveRecordId !== item.boundRecord.RecordId) {
      return undefined;
    }
  } else if (item.rawResolverResult.status === "CANCELLED") {
    if (item.rawResolverResult.targetRecordId !== item.boundRecord.RecordId) {
      return undefined;
    }
  } else {
    return undefined;
  }

  // U6-A: Rigorous multi-field boundary and metadata cross-check
  if (
    item.userId !== context.userId ||
    item.userId !== item.boundRecord.UserId ||
    item.planId !== context.planId ||
    item.planId !== item.boundRecord.planId ||
    item.planVersion !== context.planVersion ||
    item.planVersion !== item.boundRecord.planVersion ||
    item.procedure.ProcedureId !== context.procedureId ||
    item.procedure.ProcedureId !== item.boundRecord.Procedure?.ProcedureId ||
    item.procedure.ProcedureVersion !== context.procedureVersion ||
    item.procedure.ProcedureVersion !== item.boundRecord.Procedure?.ProcedureVersion ||
    context.organizationId !== item.boundRecord.OrganizationId ||
    context.siteId !== item.boundRecord.SiteId ||
    item.localDate !== item.boundRecord.LocalDate
  ) {
    return undefined;
  }

  return {
    personLabel: context.personLabel,
    occurrenceStatus: item.effectiveStatus,
    activityLabel: item.activityLabel,
    scheduledTime: item.scheduledTime,
    recordId: item.boundRecord.RecordId,
    result: item.boundRecord.result,
    resultLabel: labelForProcedureRecordResult(item.boundRecord.result),
    performedAt: item.boundRecord.performedAt,
    performedAtLabel: formatStaffBusinessDateTime(item.boundRecord.performedAt),
    recordedAt: item.boundRecord.recordedAt,
    recordedAtLabel: formatStaffBusinessDateTime(item.boundRecord.recordedAt),
    recordedBy: item.boundRecord.recordedBy,
    planId: context.planId,
    planVersion: context.planVersion,
    procedureId: context.procedureId,
    procedureVersion: context.procedureVersion,
    occurrenceId: item.occurrenceId,
  };
}
