/**
 * ProcedureRecord physical mapping (Decision-PROCEDURE-RECORD-MAPPING-1 / PR-MAP-NAMES-1).
 * Display Name is not lookup identity. Concrete List GUID is runtime config only.
 */

export const PROCEDURE_RECORD_LIST_DISPLAY_NAME = "支援手順実施記録" as const;

export const PROCEDURE_RECORD_SCHEMA_ID =
  "severe-behavior-support.procedure-record.record" as const;
export const PROCEDURE_RECORD_SCHEMA_VERSION = "1.0.0" as const;
export const PROCEDURE_RECORD_DTO_VERSION = "1.0.0" as const;
export const PROCEDURE_RECORD_TIME_ZONE = "Asia/Tokyo" as const;

export const PROCEDURE_RECORD_PHYSICAL_COLUMNS = {
  recordId: "prRecordId",
  idempotencyKey: "prIdempotencyKey",
  payloadFingerprint: "prPayloadFingerprint",
  organizationId: "prOrganizationId",
  siteId: "prSiteId",
  userId: "prUserId",
  procedureId: "prProcedureId",
  procedureVersion: "prProcedureVersion",
  approvalState: "prApprovalState",
  localDate: "prLocalDate",
  planId: "prPlanId",
  planVersion: "prPlanVersion",
  result: "prResult",
  performedAt: "prPerformedAt",
  recordedAt: "prRecordedAt",
  recordedBy: "prRecordedBy",
} as const;

export type ProcedureRecordPhysicalColumn =
  (typeof PROCEDURE_RECORD_PHYSICAL_COLUMNS)[keyof typeof PROCEDURE_RECORD_PHYSICAL_COLUMNS];

/**
 * Physical row shape for synthetic store / REST field mapping.
 * Title is TITLE-NONE: not identity; adapter does not write it; not read as contract.
 */
export type ProcedureRecordPhysicalRow = Readonly<{
  ListItemId?: number;
  prRecordId: string;
  prIdempotencyKey: string;
  prPayloadFingerprint: string;
  prOrganizationId: string;
  prSiteId: string;
  prUserId: string;
  prProcedureId: string;
  prProcedureVersion: string;
  prApprovalState: string;
  prLocalDate: string;
  prPlanId: string;
  prPlanVersion: string;
  prResult: string;
  prPerformedAt: string;
  prRecordedAt: string;
  prRecordedBy: string;
  Title?: string;
  schemaId?: string;
  schemaVersion?: string;
  dtoVersion?: string;
  TimeZone?: string;
}>;
