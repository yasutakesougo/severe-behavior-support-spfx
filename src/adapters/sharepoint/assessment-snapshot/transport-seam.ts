/**
 * Transport host seam for SharePoint REST List Items（TC-1-A / TR-1-A）.
 *
 * Preferred host: SPFx SPHttpClient.
 * Concrete binder lives in the isolated SPFx boundary:
 *   spfx/src/adapters/assessment-snapshot/sphttpclient-list-transport.ts
 *
 * Root `src/` must not import `@microsoft/sp-*`.
 * Live tenant I/O remains separately gated / FORBIDDEN without a live GO.
 */

export type AssessmentSnapshotTransportFailure =
  "PERSISTENCE_UNAVAILABLE" | "FORBIDDEN" | "TRANSPORT_ERROR";

export type AssessmentSnapshotTransportWriteResult =
  | Readonly<{ ok: true; listItemId: number }>
  | Readonly<{ ok: false; failure: AssessmentSnapshotTransportFailure }>;

export type AssessmentSnapshotTransportReadResult =
  | Readonly<{
      ok: true;
      listItemId: number;
      fields: Readonly<Record<string, unknown>>;
    }>
  | Readonly<{ ok: false; failure: "NOT_FOUND" | AssessmentSnapshotTransportFailure }>;

/**
 * Abstract transport. Synthetic GO-SLICE-1 repository does not use HTTP.
 * Concrete SPHttpClient binder is implemented under `spfx/`.
 */
export interface AssessmentSnapshotListTransport {
  createItem(
    fields: Readonly<Record<string, unknown>>,
  ): Promise<AssessmentSnapshotTransportWriteResult>;
  updateItem(
    listItemId: number,
    fields: Readonly<Record<string, unknown>>,
  ): Promise<AssessmentSnapshotTransportWriteResult>;
  getBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotTransportReadResult>;
}

/**
 * Host seam marker for the SPFx SPHttpClient binder boundary.
 */
export type SpfxSpHttpClientHostSeam = Readonly<{
  kind: "spfx-sphttpclient-when-available";
  /**
   * Concrete binder module exists under the isolated SPFx package.
   * This does not authorize live tenant calls.
   */
  bindWhenAvailable: true;
  binderModule: "spfx/src/adapters/assessment-snapshot/sphttpclient-list-transport.ts";
  spHttpPackage: "@microsoft/sp-http@1.23.2";
  liveTenantIoAuthorized: false;
}>;

export const SPFX_SPHTTPCLIENT_HOST_SEAM: SpfxSpHttpClientHostSeam = {
  kind: "spfx-sphttpclient-when-available",
  bindWhenAvailable: true,
  binderModule: "spfx/src/adapters/assessment-snapshot/sphttpclient-list-transport.ts",
  spHttpPackage: "@microsoft/sp-http@1.23.2",
  liveTenantIoAuthorized: false,
};
