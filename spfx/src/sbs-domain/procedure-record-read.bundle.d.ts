/**
 * Narrow SPFx read-only bridge for ProcedureRecord.
 * This declaration surface intentionally has no create, createItem,
 * live-write authorization, or mutable persistence port.
 */

export type ProcedureRecordTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordSchemaReadResult =
  | Readonly<{
      ok: true;
      list: Readonly<{ Id: string; Title: string; ItemCount: number }>;
      fields: readonly Readonly<Record<string, unknown>>[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

export type ProcedureRecordItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

export type ProcedureRecordReadTransport = Readonly<{
  targetListGuid: string;
  getSchema?(): Promise<ProcedureRecordSchemaReadResult>;
  findByRecordId(recordId: string): Promise<ProcedureRecordItemReadResult>;
  findByIdempotencyKey?(idempotencyKey: string): Promise<ProcedureRecordItemReadResult>;
}>;

export type ProcedureRecordListBinding = Readonly<{
  organizationId: string;
  siteId: string;
  listGuid: string;
}>;

export type ProcedureRecord = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  TimeZone: "Asia/Tokyo";
  RecordId: string;
  IdempotencyKey: string;
  PayloadFingerprint: string;
  Procedure: Readonly<{
    ProcedureId: string;
    ProcedureVersion: string;
    ApprovalState: "APPROVED";
  }>;
  LocalDate: string;
  planId: string;
  planVersion: number;
  result: "PERFORMED_AS_PLANNED" | "PERFORMED_WITH_ADAPTATION" | "NOT_PERFORMED";
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

export type LookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "EMPTY" }>
  | Readonly<{ status: "UNKNOWN"; reason: string }>
  | Readonly<{ status: "FETCH_FAILED"; code: string }>;

export type ReadOnlyProcedureRecordLookup = Readonly<{
  binding: ProcedureRecordListBinding;
  findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>>;
}>;

export function bindProcedureRecordList(input: {
  organizationId: string;
  siteId: string;
  listGuid: string;
}): ProcedureRecordListBinding | null;

export function createReadOnlyProcedureRecordLookup(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordReadTransport,
): ReadOnlyProcedureRecordLookup;
