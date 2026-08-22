/**
 * CANCEL-SLICE-D — FIELD_STAFF cancellation presentation metadata + entry gate.
 * Does not mutate consumed correction slice cancellationAuthorized flags.
 */

import { labelForProcedureRecordResult } from "./procedure-copy";
import type { ProcedureBindingContext } from "./procedure-types";
import type { ProcedureRecordResultValue } from "./procedure-types";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import { formatStaffBusinessDateTime } from "../ux/staff-date-time-presentation";

export const FIELD_STAFF_CANCELLATION_UI_SLICE = {
  id: "FIELD-STAFF-CANCELLATION-UI-SLICE-D",
  cancellationPresentationAuthorized: true as const,
  cancellationPersistAuthorized: true as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
  saveSemanticsChangeAuthorized: false as const,
} as const;

export type ProcedureCancellationPresentation = Readonly<{
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
  organizationId: string;
  siteId: string;
  userId: string;
  boundRecordIds: readonly string[];
}>;

/**
 * Presentation-side entry gate only. Slice A remains final eligibility authority.
 * UI may hide early; never treat CTA visibility as authorization.
 */
export function presentProcedureCancellation(
  item: TodaySupportItem | undefined,
  context: ProcedureBindingContext | undefined,
): ProcedureCancellationPresentation | undefined {
  if (
    !FIELD_STAFF_CANCELLATION_UI_SLICE.cancellationPresentationAuthorized ||
    !item ||
    !context ||
    !item.boundRecord ||
    item.rawResolverResult.status === "CONFLICT" ||
    item.rawResolverResult.status === "INVALID" ||
    item.effectiveStatus !== "記録済み" ||
    item.rawResolverResult.status !== "RECORDED" ||
    item.rawResolverResult.effectiveRecordId !== item.boundRecord.RecordId
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
    organizationId: item.boundRecord.OrganizationId,
    siteId: item.boundRecord.SiteId,
    userId: item.boundRecord.UserId,
    boundRecordIds: [item.boundRecord.RecordId],
  };
}
