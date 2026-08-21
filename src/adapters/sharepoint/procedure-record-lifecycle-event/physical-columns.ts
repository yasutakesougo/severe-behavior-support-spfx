/**
 * ProcedureRecordLifecycleEvent physical mapping.
 * CANCEL-SLICE-E-PHYSICAL-NAMING-SELECTION-1:
 * LN-1 + LE-MAP-NAMES-LIFE-1 + TP-1 + PG-3.
 *
 * This module defines physical names only. It does not provision SharePoint,
 * authorize LIVE WRITE, activate Production Binding, or deploy anything.
 */

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME =
  "SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS" as const;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID =
  "41274293-18d0-4f57-8a45-4f063522bcc7" as const;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION = "1.0.0" as const;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES = ["SUPERSEDE", "CANCEL"] as const;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS = {
  schemaVersion: "lifeSchemaVersion",
  lifecycleEventId: "lifeLifecycleEventId",
  lifecycleIdempotencyKey: "lifeLifecycleIdempotencyKey",
  lifecyclePayloadFingerprint: "lifeLifecyclePayloadFingerprint",
  eventType: "lifeEventType",
  targetRecordId: "lifeTargetRecordId",
  replacementRecordId: "lifeReplacementRecordId",
  recordedAt: "lifeRecordedAt",
  recordedBy: "lifeRecordedBy",
  reason: "lifeReason",
} as const;

export type ProcedureRecordLifecycleEventPhysicalColumn =
  (typeof PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS)[keyof typeof PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS];

export type ProcedureRecordLifecycleEventPhysicalRow = Readonly<{
  ListItemId?: number;
  lifeSchemaVersion: string;
  lifeLifecycleEventId: string;
  lifeLifecycleIdempotencyKey: string;
  lifeLifecyclePayloadFingerprint: string;
  lifeEventType: string;
  lifeTargetRecordId: string;
  lifeReplacementRecordId?: string | null;
  lifeRecordedAt: string;
  lifeRecordedBy: string;
  lifeReason?: string | null;
  Title?: string | null;
}>;
