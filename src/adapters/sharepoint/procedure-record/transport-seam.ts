/**
 * Transport host seam for ProcedureRecord SharePoint REST.
 *
 * Concrete SPHttpClient binder lives in the isolated SPFx boundary:
 *   spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts
 *
 * Root `src/` must not import `@microsoft/sp-*`.
 * Live tenant I/O and item create remain separately gated / FORBIDDEN.
 */

import type { ObservedListIdentity, ObservedPhysicalField } from "./physical-schema";

export type ProcedureRecordTransportFailure = "FORBIDDEN" | "TRANSPORT_ERROR";

export type ProcedureRecordSchemaReadResult =
  | Readonly<{
      ok: true;
      list: ObservedListIdentity;
      fields: readonly ObservedPhysicalField[];
    }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

export type ProcedureRecordItemReadResult =
  | Readonly<{ ok: true; rows: readonly Readonly<Record<string, unknown>>[] }>
  | Readonly<{ ok: false; failure: ProcedureRecordTransportFailure }>;

/**
 * Read-only live transport. Item create is intentionally absent.
 */
export interface ProcedureRecordLiveListTransport {
  getSchema(): Promise<ProcedureRecordSchemaReadResult>;
  findByRecordId(recordId: string): Promise<ProcedureRecordItemReadResult>;
  findByIdempotencyKey(idempotencyKey: string): Promise<ProcedureRecordItemReadResult>;
}

export type SpfxSpHttpClientHostSeam = Readonly<{
  kind: "spfx-sphttpclient-when-available";
  bindWhenAvailable: true;
  binderModule: "spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts";
  spHttpPackage: "@microsoft/sp-http@1.23.2";
  liveTenantIoAuthorized: false;
  liveWriteAuthorized: false;
}>;

export const SPFX_SPHTTPCLIENT_HOST_SEAM: SpfxSpHttpClientHostSeam = {
  kind: "spfx-sphttpclient-when-available",
  bindWhenAvailable: true,
  binderModule: "spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts",
  spHttpPackage: "@microsoft/sp-http@1.23.2",
  liveTenantIoAuthorized: false,
  liveWriteAuthorized: false,
};
