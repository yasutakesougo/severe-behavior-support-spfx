/**
 * Transport host seam for SharePoint REST List Items（TC-1-A）.
 *
 * Preferred host when available: SPFx SPHttpClient.
 * GO-SLICE-1: no @microsoft/sp-* install — this module defines the seam only.
 * Live tenant I/O is FORBIDDEN in this slice.
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
 * Abstract transport. Implementations must not be added with live HTTP in GO-SLICE-1.
 * Synthetic tests use in-memory store / doubles only.
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
 * Marker documenting the future SPFx host binding.
 * Not an import of @microsoft/sp-http（FORBIDDEN / not installed）.
 */
export type SpfxSpHttpClientHostSeam = Readonly<{
  kind: "spfx-sphttpclient-when-available";
  /**
   * When SPFx packages exist under a later authorized Decision,
   * bind SPHttpClient here. GO-SLICE-1 does not provide a live binder.
   */
  bindWhenAvailable: false;
}>;

export const SPFX_SPHTTPCLIENT_HOST_SEAM: SpfxSpHttpClientHostSeam = {
  kind: "spfx-sphttpclient-when-available",
  bindWhenAvailable: false,
};
