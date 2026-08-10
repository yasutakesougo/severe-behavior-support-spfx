/**
 * AssessmentSnapshots physical column Internal Names（Accepted / OBSERVED）.
 * MAP-AS-009 findingIds = EXPLICITLY OUT（no column）.
 * ENV-001〜003 = DERIVED（no per-item columns）.
 */

export const ASSESSMENT_SNAPSHOT_LIST = "AssessmentSnapshots" as const;

/** ENV-001〜003 DERIVED constants（DTO/adapter；not SharePoint item fields）. */
export const ASSESSMENT_SNAPSHOT_SCHEMA_ID =
  "severe-behavior-support.assessment-snapshot.snapshot" as const;
export const ASSESSMENT_SNAPSHOT_SCHEMA_VERSION = "1.0.0" as const;
export const ASSESSMENT_SNAPSHOT_DTO_VERSION = "1.0.0" as const;

export const ASSESSMENT_SNAPSHOT_PHYSICAL_COLUMNS = [
  "snapshotId",
  "recordStatus",
  "result",
  "reasonCodes",
  "ruleSetVersion",
  "periodStart",
  "periodEnd",
  "inputFingerprint",
  "supersedesSnapshotId",
] as const;

export type AssessmentSnapshotPhysicalColumn =
  (typeof ASSESSMENT_SNAPSHOT_PHYSICAL_COLUMNS)[number];

/**
 * Physical row shape for synthetic store / REST field mapping.
 * supersedesSnapshotId:
 *   undefined = key omitted from create body / not present on row
 *   null = explicit clear on update（CO-1-A）
 *   string = present Text value
 */
export type AssessmentSnapshotPhysicalRow = Readonly<{
  ListItemId?: number;
  snapshotId: string;
  recordStatus: string;
  result: string;
  reasonCodes: string;
  ruleSetVersion: string;
  periodStart: string;
  periodEnd: string;
  inputFingerprint: string;
  supersedesSnapshotId?: string | null;
}>;
