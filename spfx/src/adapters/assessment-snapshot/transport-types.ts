/**
 * Transport result types aligned with root
 * `AssessmentSnapshotListTransport`（GO-SLICE-1 seam）.
 *
 * Kept local to the SPFx boundary so this package does not import root TS 5.9 sources.
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
  | Readonly<{
      ok: false;
      failure: "NOT_FOUND" | AssessmentSnapshotTransportFailure;
    }>;

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
