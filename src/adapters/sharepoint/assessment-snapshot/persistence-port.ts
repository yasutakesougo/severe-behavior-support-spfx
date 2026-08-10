/**
 * AssessmentSnapshot persistence port (PB-1 / SC-1 / FR-1).
 * Vocabulary from Decision-AS-APP-SAVE-1 + Decision-AS-SP-ADAPTER-1.
 * No SharePoint / PnP / Graph dependency.
 */

import type { AssessmentSnapshot } from "../../../domain/assessment-snapshot";

export const ASSESSMENT_SNAPSHOT_SAVE_INTENTS = [
  "draft",
  "finalize",
  "correct-as-new-version",
] as const;

export type AssessmentSnapshotSaveIntent = (typeof ASSESSMENT_SNAPSHOT_SAVE_INTENTS)[number];

/** SC-1 save candidate. */
export type AssessmentSnapshotSaveRequest = Readonly<{
  snapshot: AssessmentSnapshot;
  intent: AssessmentSnapshotSaveIntent;
}>;

export const ASSESSMENT_SNAPSHOT_FAILURE_CODES = [
  "VALIDATION_FAILED",
  "PERSISTENCE_UNAVAILABLE",
  "OVERWRITE_FORBIDDEN",
  "MALFORMED_INTENT",
] as const;

export type AssessmentSnapshotFailureCode = (typeof ASSESSMENT_SNAPSHOT_FAILURE_CODES)[number];

/** FR-1 discriminated fail-closed result. */
export type AssessmentSnapshotSaveResult =
  | Readonly<{ ok: true; kind: "SAVED"; listItemId: number }>
  | Readonly<{ ok: false; code: AssessmentSnapshotFailureCode }>;

export type AssessmentSnapshotLookupResult =
  | Readonly<{ kind: "FOUND"; snapshot: AssessmentSnapshot; listItemId: number }>
  | Readonly<{ kind: "NOT_FOUND" }>
  | Readonly<{ kind: "PERSISTENCE_UNAVAILABLE" }>
  | Readonly<{ kind: "MALFORMED_PHYSICAL" }>;

/**
 * Logical AssessmentSnapshot persistence port.
 * Application sees SC-1 / FR-1 only（PB-1）.
 */
export interface AssessmentSnapshotPersistencePort {
  save(request: AssessmentSnapshotSaveRequest): Promise<AssessmentSnapshotSaveResult>;
  findBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotLookupResult>;
}
