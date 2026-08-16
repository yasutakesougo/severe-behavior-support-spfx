/**
 * SharePoint REST List Items create-body construction.
 * Does not perform HTTP. TITLE-NONE: Title is omitted. DERIVED keys are omitted.
 */

import type { ProcedureRecord } from "../../../domain/procedure-record";
import { encodePhysicalRow } from "./conversion";
import { FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS } from "./derived-envelope";
import { PROCEDURE_RECORD_PHYSICAL_COLUMNS } from "./physical-columns";

export type RestBodyBuildResult =
  | Readonly<{ ok: true; fields: Readonly<Record<string, unknown>> }>
  | Readonly<{ ok: false; reason: "CONVERSION_FAILED" }>;

function assertNoForbiddenKeys(fields: Readonly<Record<string, unknown>>): void {
  for (const key of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      throw new Error(`forbidden SharePoint item field: ${key}`);
    }
  }
}

export function buildCreateItemFields(record: ProcedureRecord): RestBodyBuildResult {
  const encoded = encodePhysicalRow(record);
  if (!encoded.ok) {
    return { ok: false, reason: "CONVERSION_FAILED" };
  }

  const fields: Record<string, unknown> = {
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordId]: encoded.row.prRecordId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.idempotencyKey]: encoded.row.prIdempotencyKey,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.payloadFingerprint]: encoded.row.prPayloadFingerprint,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.organizationId]: encoded.row.prOrganizationId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.siteId]: encoded.row.prSiteId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.userId]: encoded.row.prUserId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.procedureId]: encoded.row.prProcedureId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.procedureVersion]: encoded.row.prProcedureVersion,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.approvalState]: encoded.row.prApprovalState,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.localDate]: encoded.row.prLocalDate,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.planId]: encoded.row.prPlanId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.planVersion]: encoded.row.prPlanVersion,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.result]: encoded.row.prResult,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.performedAt]: encoded.row.prPerformedAt,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordedAt]: encoded.row.prRecordedAt,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordedBy]: encoded.row.prRecordedBy,
  };

  assertNoForbiddenKeys(fields);
  return { ok: true, fields };
}
