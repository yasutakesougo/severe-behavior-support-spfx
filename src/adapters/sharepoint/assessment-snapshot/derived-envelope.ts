/**
 * ENV-001〜003 DERIVED envelope constants.
 * Must never be emitted as SharePoint item fields.
 */

import {
  ASSESSMENT_SNAPSHOT_DTO_VERSION,
  ASSESSMENT_SNAPSHOT_SCHEMA_ID,
  ASSESSMENT_SNAPSHOT_SCHEMA_VERSION,
} from "./physical-columns";

export type AssessmentSnapshotDerivedEnvelope = Readonly<{
  schemaId: typeof ASSESSMENT_SNAPSHOT_SCHEMA_ID;
  schemaVersion: typeof ASSESSMENT_SNAPSHOT_SCHEMA_VERSION;
  dtoVersion: typeof ASSESSMENT_SNAPSHOT_DTO_VERSION;
}>;

export function getAssessmentSnapshotDerivedEnvelope(): AssessmentSnapshotDerivedEnvelope {
  return {
    schemaId: ASSESSMENT_SNAPSHOT_SCHEMA_ID,
    schemaVersion: ASSESSMENT_SNAPSHOT_SCHEMA_VERSION,
    dtoVersion: ASSESSMENT_SNAPSHOT_DTO_VERSION,
  };
}

/** Keys that must never appear on REST item field payloads. */
export const FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS = [
  "schemaId",
  "schemaVersion",
  "dtoVersion",
  "findingIds",
] as const;
