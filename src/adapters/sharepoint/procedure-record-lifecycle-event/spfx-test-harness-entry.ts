/**
 * B2 isolated test-only SPFx bridge entry for the existing Slice E adapter.
 *
 * This file contains no lifecycle semantics and no transport implementation.
 * It only exposes the minimum structural surface needed by the isolated B2
 * harness so SPFx can consume canonical root implementation through an esbuild
 * bridge. Keep exported signatures self-contained so declaration generation is
 * reproducible without leaking root-relative imports into the SPFx rootDir.
 */

import { createProcedureRecordCancellationSharePointStoragePort as createCanonicalStoragePort } from "./cancellation-storage-port";
import { bindProcedureRecordLifecycleEventList as bindCanonicalList } from "./list-binding";
import type { ProcedureRecordLifecycleEventListTransport as CanonicalTransport } from "./transport-seam";

export type B2ProcedureRecordLifecycleEvent = Readonly<{
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

export type B2LifecycleLookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "EMPTY" }>
  | Readonly<{
      status: "UNKNOWN";
      reason: "NOT_AUTHENTICATED" | "NOT_AUTHORIZED" | "INDETERMINATE";
    }>
  | Readonly<{ status: "FETCH_FAILED"; code: string }>;

export type B2LifecycleAppendAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export type B2ProcedureRecordLifecycleEventListBinding = Readonly<{
  siteIdentity: string;
  listGuid: string;
}>;

export type B2ProcedureRecordLifecycleEventObservedField = Readonly<{
  InternalName: string;
  StaticName?: string;
  TypeAsString?: string;
  Required?: boolean;
  EnforceUniqueValues?: boolean;
  Indexed?: boolean;
  Choices?: readonly string[];
  FillInChoice?: boolean;
  MaxLength?: number;
  Hidden?: boolean;
}>;

export type B2ProcedureRecordLifecycleEventObservedList = Readonly<{
  Id: string;
  Title: string;
  ItemCount: number;
}>;

export type B2ProcedureRecordLifecycleEventSchemaReadResult =
  | Readonly<{
      ok: true;
      list: B2ProcedureRecordLifecycleEventObservedList;
      fields: readonly B2ProcedureRecordLifecycleEventObservedField[];
    }>
  | Readonly<{ ok: false; failure: "FORBIDDEN" | "TRANSPORT_ERROR" }>;

export type B2ProcedureRecordLifecycleEventItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: "FORBIDDEN" | "TRANSPORT_ERROR" }>;

export type B2ProcedureRecordLifecycleEventItemCreateResult =
  | Readonly<{ ok: true; listItemId: number }>
  | Readonly<{ ok: false; failure: "FORBIDDEN" | "TRANSPORT_ERROR" }>;

export interface B2ProcedureRecordLifecycleEventListTransport {
  readonly targetSiteIdentity: string;
  readonly targetListGuid: string;
  readonly liveTenantIoAuthorized: false;
  getSchema(): Promise<B2ProcedureRecordLifecycleEventSchemaReadResult>;
  findByLifecycleEventId(
    lifecycleEventId: string,
  ): Promise<B2ProcedureRecordLifecycleEventItemReadResult>;
  findByLifecycleIdempotencyKey(
    lifecycleIdempotencyKey: string,
  ): Promise<B2ProcedureRecordLifecycleEventItemReadResult>;
  listByTargetRecordId(
    targetRecordId: string,
  ): Promise<B2ProcedureRecordLifecycleEventItemReadResult>;
  createItem(
    fields: Readonly<Record<string, unknown>>,
  ): Promise<B2ProcedureRecordLifecycleEventItemCreateResult>;
}

export type B2ProcedureRecordLifecycleEventSchemaVerification =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reasons: readonly string[] }>;

export interface B2ProcedureRecordCancellationStoragePort {
  readonly binding: B2ProcedureRecordLifecycleEventListBinding;
  readonly liveWriteAuthorized: false;
  findByLifecycleEventId(
    lifecycleEventId: string,
  ): Promise<B2LifecycleLookupResult<B2ProcedureRecordLifecycleEvent>>;
  findByLifecycleIdempotencyKey(
    lifecycleIdempotencyKey: string,
  ): Promise<B2LifecycleLookupResult<B2ProcedureRecordLifecycleEvent>>;
  append(event: B2ProcedureRecordLifecycleEvent): Promise<B2LifecycleAppendAttempt>;
  listByTargetRecordId(targetRecordId: string): Promise<readonly B2ProcedureRecordLifecycleEvent[]>;
  verifyPhysicalSchema(): Promise<B2ProcedureRecordLifecycleEventSchemaVerification>;
}

export function bindProcedureRecordLifecycleEventList(input: {
  siteIdentity: string;
  listGuid: string;
}): B2ProcedureRecordLifecycleEventListBinding | null {
  const binding = bindCanonicalList(input);
  if (binding === null) {
    return null;
  }
  return {
    siteIdentity: binding.siteIdentity,
    listGuid: binding.listGuid,
  };
}

export function createProcedureRecordCancellationSharePointStoragePort(
  binding: B2ProcedureRecordLifecycleEventListBinding,
  transport: B2ProcedureRecordLifecycleEventListTransport,
): B2ProcedureRecordCancellationStoragePort {
  return createCanonicalStoragePort(
    binding,
    transport as CanonicalTransport,
  ) as unknown as B2ProcedureRecordCancellationStoragePort;
}
