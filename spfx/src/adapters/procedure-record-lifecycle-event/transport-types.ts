/**
 * Transport result types for the GATE-3 ProcedureRecordLifecycleEvent
 * SPHttpClient binder. Kept local to the SPFx boundary so this package does
 * not import root sources. Structurally matches the consumed Slice E seam.
 */

export type ProcedureRecordLifecycleEventTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordLifecycleEventObservedField = Readonly<{
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

export type ProcedureRecordLifecycleEventObservedList = Readonly<{
  Id: string;
  Title: string;
  ItemCount: number;
}>;

export type ProcedureRecordLifecycleEventSchemaReadResult =
  | Readonly<{
      ok: true;
      list: ProcedureRecordLifecycleEventObservedList;
      fields: readonly ProcedureRecordLifecycleEventObservedField[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

export type ProcedureRecordLifecycleEventItemCreateResult =
  | Readonly<{ ok: true; listItemId: number }>
  | Readonly<{ ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }>;

/**
 * Concrete SPFx transport surface for the consumed Slice E seam.
 * `liveTenantIoAuthorized` remains false: GATE-3 Implementation Start
 * authorizes code only, not tenant CREATE.
 */
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
