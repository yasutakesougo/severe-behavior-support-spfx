import { labelForProcedureRecordResult } from "./procedure-copy";
import type { ProcedureBindingContext } from "./procedure-types";
import type {
  OccurrenceResolverResult,
  ProcedureRecord,
  TodaySupportItem,
} from "../../sbs-domain/kiosk-read-model.bundle";

export const FIELD_STAFF_CANCELLATION_UI_SAVE_WIRING_1_SLICE = {
  id: "FIELD-STAFF-CANCELLATION-UI-SAVE-WIRING-SLICE-1",
  cancellationSaveWiringAuthorized: true as const,
  cancellationPersistAuthorized: true as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export type ProcedureCancellationPresentation = Readonly<{
  personLabel: string;
  occurrenceStatus: "記録済み";
  activityLabel: string;
  scheduledTime: string;
  recordId: string;
  resultLabel: string;
  occurrenceId: string;
  organizationId: string;
  siteId: string;
  userId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  boundRecord: ProcedureRecord;
}>;

export function reasonWhyCancellationHidden(
  resolver: OccurrenceResolverResult | undefined,
): string | undefined {
  if (!resolver) {
    return undefined;
  }
  if (resolver.status === "UNRECORDED") {
    return "未実施のため、この記録は取り消せません。";
  }
  if (resolver.status === "CANCELLED") {
    return "すでに取消済みのため、再度取り消しはできません。";
  }
  if (resolver.status === "CONFLICT" || resolver.status === "INVALID") {
    return "確認が必要な状態のため、この記録は取り消せません。";
  }
  return undefined;
}

function isRecordedTargetBound(item: TodaySupportItem): item is TodaySupportItem & {
  rawResolverResult: Readonly<{ status: "RECORDED"; effectiveRecordId: string }>;
  effectiveStatus: "記録済み";
  boundRecord: ProcedureRecord;
} {
  if (item.rawResolverResult.status !== "RECORDED") {
    return false;
  }
  if (item.effectiveStatus !== "記録済み") {
    return false;
  }
  if (!item.boundRecord) {
    return false;
  }
  return item.boundRecord.RecordId === item.rawResolverResult.effectiveRecordId;
}

export function presentProcedureCancellation(
  item: TodaySupportItem | undefined,
  context: ProcedureBindingContext | undefined,
): ProcedureCancellationPresentation | undefined {
  if (
    !FIELD_STAFF_CANCELLATION_UI_SAVE_WIRING_1_SLICE.cancellationSaveWiringAuthorized ||
    !item ||
    !context ||
    !isRecordedTargetBound(item)
  ) {
    return undefined;
  }

  return {
    personLabel: context.personLabel,
    occurrenceStatus: "記録済み",
    activityLabel: item.activityLabel,
    scheduledTime: item.scheduledTime,
    recordId: item.boundRecord.RecordId,
    resultLabel: labelForProcedureRecordResult(item.boundRecord.result),
    occurrenceId: item.occurrenceId,
    organizationId: item.boundRecord.OrganizationId,
    siteId: item.boundRecord.SiteId,
    userId: item.boundRecord.UserId,
    planId: context.planId,
    planVersion: context.planVersion,
    procedureId: context.procedureId,
    procedureVersion: context.procedureVersion,
    boundRecord: item.boundRecord,
  };
}
