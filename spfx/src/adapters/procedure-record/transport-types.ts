/**
 * Transport result types for ProcedureRecord LOOKUP-B SPHttpClient binder.
 * Kept local to the SPFx boundary so this package does not import root sources.
 */

export type ProcedureRecordTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordObservedField = Readonly<{
  InternalName: string;
  StaticName?: string;
  Title?: string;
  TypeAsString?: string;
  Required?: boolean;
  EnforceUniqueValues?: boolean;
  Indexed?: boolean;
  Choices?: readonly string[];
  FillInChoice?: boolean;
  DefaultValue?: string;
  MaxLength?: number;
}>;

export type ProcedureRecordObservedList = Readonly<{
  Id: string;
  Title: string;
  ItemCount: number;
}>;

export type ProcedureRecordSchemaReadResult =
  | Readonly<{
      ok: true;
      list: ProcedureRecordObservedList;
      fields: readonly ProcedureRecordObservedField[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

export type ProcedureRecordItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

export interface ProcedureRecordLiveListTransport {
  readonly targetListGuid: string;
  getSchema(): Promise<ProcedureRecordSchemaReadResult>;
  findByRecordId(recordId: string): Promise<ProcedureRecordItemReadResult>;
  findByIdempotencyKey(idempotencyKey: string): Promise<ProcedureRecordItemReadResult>;
}
