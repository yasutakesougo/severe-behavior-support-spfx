/**
 * Typings for the esbuild bundle of src/domain/monitoring-read-model-spfx-entry.ts.
 * Canonical read-model remains src/domain/monitoring-read-model.ts.
 * This bundle is READ-ONLY: no persistence / review judgment / plan mutation /
 * live-write port / SharePoint mutation.
 */

export type ApprovedProcedureReference = Readonly<{
  ProcedureId: string;
  ProcedureVersion: string;
  ApprovalState: "APPROVED";
}>;

export type ProcedureRecord = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  TimeZone: "Asia/Tokyo";
  RecordId: string;
  IdempotencyKey: string;
  PayloadFingerprint: string;
  Procedure: ApprovedProcedureReference;
  LocalDate: string;
  planId: string;
  planVersion: number;
  result: "PERFORMED_AS_PLANNED" | "PERFORMED_WITH_ADAPTATION" | "NOT_PERFORMED";
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

export type MonitoringQuery = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
}>;

export type MonitoringRecordItem = Readonly<{
  RecordId: string;
  Procedure: ApprovedProcedureReference;
  result: ProcedureRecord["result"];
  performedAt: string;
  recordedAt: string;
  planId: string;
  planVersion: number;
}>;

export type MonitoringReadModel = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  records: readonly MonitoringRecordItem[];
}>;

export type MonitoringBuildResult =
  | Readonly<{ status: "RESOLVED"; value: MonitoringReadModel }>
  | Readonly<{ status: "MALFORMED_INPUT" }>;

export function buildMonitoringReadModel(
  queryInput: unknown,
  recordsInput: unknown,
): MonitoringBuildResult;
