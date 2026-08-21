/**
 * Root transport seam for the locked ProcedureRecordLifecycleEvent list.
 *
 * Concrete SPFx LIVE transport is intentionally absent in Slice E.
 * `liveTenantIoAuthorized: false` constrains this seam to synthetic/test-only
 * transports until a separate LIVE WRITE / Production Binding unit exists.
 */

import type {
  ObservedLifecycleEventListIdentity,
  ObservedLifecycleEventPhysicalField,
} from "./physical-schema";

export type ProcedureRecordLifecycleEventTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordLifecycleEventSchemaReadResult =
  | Readonly<{
      ok: true;
      list: ObservedLifecycleEventListIdentity;
      fields: readonly ObservedLifecycleEventPhysicalField[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventItemCreateResult =
  | Readonly<{ ok: true; listItemId: number }>
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
