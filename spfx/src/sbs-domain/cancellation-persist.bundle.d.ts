/**
 * Typings for the esbuild bundle of src/domain/procedure-record-cancellation-staff-save.ts.
 * Canonical cancel persist remains src/domain. SPFx isolated rootDir uses this bridge.
 * LIVE WRITE remains HOLD. No SharePoint I/O.
 */

export type Role =
  | "SUPPORTER"
  | "PLANNER"
  | "SERVICE_MANAGER"
  | "SITE_ADMIN"
  | "ORG_ADMIN"
  | "SYSTEM_ADMIN"
  | "VIEWER";

export type SiteMembership = Readonly<{
  SiteId: string;
  Roles: readonly Role[];
}>;

export type SiteContext = Readonly<{
  Memberships: readonly SiteMembership[];
  SelectedSiteId: string | null;
}>;

export type AuthorizationContext = Readonly<{
  Subject: string;
  UserId: string;
  OrganizationId: string;
  SiteContext: SiteContext;
}>;

export type LookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "EMPTY" }>
  | Readonly<{
      status: "UNKNOWN";
      reason: "NOT_AUTHENTICATED" | "NOT_AUTHORIZED" | "INDETERMINATE";
    }>
  | Readonly<{ status: "FETCH_FAILED"; code: string }>;

export type ProcedureRecordCancellationSaveOutcome =
  "saved" | "save_failed" | "save_outcome_unknown";

export type ProcedureRecordLifecycleEvent = Readonly<{
  schemaVersion: "1.0.0";
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
  eventType: "SUPERSEDE" | "CANCEL";
  targetRecordId: string;
  replacementRecordId?: string;
  recordedAt: string;
  recordedBy: string;
  reason?: string;
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

export type ProcedureRecordCorrection = Readonly<{
  CorrectionId: string;
  IdempotencyKey: string;
  originalRecordId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  Procedure: ProcedureRecord["Procedure"];
  planId: string;
  planVersion: number;
  originalRecordedAt: string;
  originalRecordedBy: string;
  originalLocalDate: string;
  result: ProcedureRecord["result"];
  performedAt: string;
  reason: string;
  correctedAt: string;
  correctedBy: string;
}>;

export type ProcedureRecordCancellationSubmitRequest = Readonly<{
  semanticsInput: unknown;
  recordedAtIso: string;
}>;

export interface ProcedureRecordCancellationPersistencePort {
  readonly liveWriteAuthorized: false;
  submitCancellation(request: ProcedureRecordCancellationSubmitRequest): Promise<{
    saveState: ProcedureRecordCancellationSaveOutcome;
    event: ProcedureRecordLifecycleEvent | null;
    appendCalled: boolean;
  }>;
  listCancellations(targetRecordId: string): Promise<{
    targetRecordId: string;
    events: readonly ProcedureRecordLifecycleEvent[];
  }>;
}

export type StaffProcedureRecordCancellationSaveInput = Readonly<{
  targetRecordId: string;
  originalRecord: ProcedureRecord;
  reason: string;
  boundRecordIds: readonly string[];
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[];
  corrections: readonly ProcedureRecordCorrection[];
  authorization: LookupResult<AuthorizationContext>;
  recordedAtIso: string;
}>;

export type StaffProcedureRecordCancellationSaveResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  event: ProcedureRecordLifecycleEvent | null;
  appendCalled: boolean;
  request: ProcedureRecordCancellationSubmitRequest;
}>;

export function createInMemoryProcedureRecordCancellationPersistencePort(
  options?: Readonly<{
    appendMode?: "created" | "definite_failure" | "indeterminate" | "created_without_readback";
  }>,
): ProcedureRecordCancellationPersistencePort & {
  readonly storage: {
    appendCalls: number;
    appendMode: string;
  };
};

export function nowAsiaTokyoIsoDateTime(): string | null;

export function buildProcedureRecordCancellationSubmitRequest(
  input: StaffProcedureRecordCancellationSaveInput,
): ProcedureRecordCancellationSubmitRequest;

export function persistStaffProcedureRecordCancellation(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult>;

export function resubmitFrozenProcedureRecordCancellation(
  request: ProcedureRecordCancellationSubmitRequest,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult>;
