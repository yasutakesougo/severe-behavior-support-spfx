/**
 * Typings for the esbuild bundle of
 * src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts.
 * Allowed export surface only. Do not hand-edit to expand surface.
 * LIVE WRITE / Production Binding remain unauthorized by this bridge alone.
 */

export type ProcedureRecordLifecycleEventListBinding = Readonly<{
  siteIdentity: string;
  listGuid: string;
}>;

export function bindProcedureRecordLifecycleEventList(input: {
  siteIdentity: string;
  listGuid: string;
}): ProcedureRecordLifecycleEventListBinding | null;

export function isUsableProcedureRecordLifecycleEventListBinding(
  binding: ProcedureRecordLifecycleEventListBinding,
): boolean;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID: "41274293-18d0-4f57-8a45-4f063522bcc7";

export type ProcedureRecordLifecycleEventPhysicalRow = Readonly<Record<string, unknown>>;

export type ProcedureRecordLifecycleEventTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordLifecycleEventItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventItemCreateResult =
  | Readonly<{ ok: true; listItemId: number }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventSchemaReadResult =
  | Readonly<{
      ok: true;
      list: Readonly<{ Id: string; Title: string; ItemCount: number }>;
      fields: readonly Readonly<Record<string, unknown>>[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export interface ProcedureRecordLifecycleEventListTransport {
  readonly targetSiteIdentity: string;
  readonly targetListGuid: string;
  readonly liveTenantIoAuthorized: false;
  getSchema(): Promise<ProcedureRecordLifecycleEventSchemaReadResult>;
  findByLifecycleEventId(
    lifecycleEventId: string,
  ): Promise<ProcedureRecordLifecycleEventItemReadResult>;
  findByLifecycleIdempotencyKey(
    lifecycleIdempotencyKey: string,
  ): Promise<ProcedureRecordLifecycleEventItemReadResult>;
  listByTargetRecordId(
    targetRecordId: string,
  ): Promise<ProcedureRecordLifecycleEventItemReadResult>;
  createItem(
    fields: Readonly<Record<string, unknown>>,
  ): Promise<ProcedureRecordLifecycleEventItemCreateResult>;
}

export type LookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "EMPTY" }>
  | Readonly<{
      status: "UNKNOWN";
      reason: "NOT_AUTHENTICATED" | "NOT_AUTHORIZED" | "INDETERMINATE";
    }>
  | Readonly<{ status: "FETCH_FAILED"; code: string }>;

export type ProcedureRecordCancellationAppendAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export type ProcedureRecordCancellationSharePointStoragePort = {
  binding: ProcedureRecordLifecycleEventListBinding;
  liveWriteAuthorized: false;
  findByLifecycleEventId(lifecycleEventId: string): Promise<LookupResult<unknown>>;
  findByLifecycleIdempotencyKey(lifecycleIdempotencyKey: string): Promise<LookupResult<unknown>>;
  append(event: unknown): Promise<ProcedureRecordCancellationAppendAttempt>;
  listByTargetRecordId(targetRecordId: string): Promise<readonly unknown[]>;
  verifyPhysicalSchema(): Promise<unknown>;
};

export function createProcedureRecordCancellationSharePointStoragePort(
  binding: ProcedureRecordLifecycleEventListBinding,
  transport: ProcedureRecordLifecycleEventListTransport,
): ProcedureRecordCancellationSharePointStoragePort;
