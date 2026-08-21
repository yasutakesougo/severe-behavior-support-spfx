/**
 * ProcedureRecordLifecycleEvent <-> locked SharePoint physical row mapping.
 * No identity minting and no lifecycle semantics live here.
 */

import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION as LOGICAL_SCHEMA_VERSION,
  validateProcedureRecordLifecycleEvent,
  type ProcedureRecordLifecycleEvent,
} from "../../../domain/kiosk-contract";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
  type ProcedureRecordLifecycleEventPhysicalRow,
} from "./physical-columns";

export type LifecycleEventPhysicalWriteBuildResult =
  | Readonly<{ ok: true; row: ProcedureRecordLifecycleEventPhysicalRow }>
  | Readonly<{ ok: false; reason: "INVALID_EVENT" | "FIELD_TOO_LONG" }>;

export type LifecycleEventPhysicalReadResult =
  | Readonly<{ ok: true; event: ProcedureRecordLifecycleEvent }>
  | Readonly<{ ok: false; reason: "MALFORMED_PHYSICAL" }>;

const TEXT_MAX_LENGTH = 255;

function fitsText(value: string): boolean {
  return value.length <= TEXT_MAX_LENGTH;
}

function readRequiredText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 && fitsText(value) ? value : null;
}

function readOptionalText(
  value: unknown,
): Readonly<{ ok: true; value: string | undefined }> | Readonly<{ ok: false }> {
  if (value === undefined || value === null) {
    return { ok: true, value: undefined };
  }
  if (typeof value !== "string" || !fitsText(value)) {
    return { ok: false };
  }
  return { ok: true, value };
}

function allPhysicalTextFits(event: ProcedureRecordLifecycleEvent): boolean {
  const values = [
    event.schemaVersion,
    event.LifecycleEventId,
    event.LifecycleIdempotencyKey,
    event.LifecyclePayloadFingerprint,
    event.eventType,
    event.targetRecordId,
    event.recordedAt,
    event.recordedBy,
  ];
  if (event.replacementRecordId !== undefined) {
    values.push(event.replacementRecordId);
  }
  if (event.reason !== undefined) {
    values.push(event.reason);
  }
  return values.every(fitsText);
}

export function encodeProcedureRecordLifecycleEventPhysicalRow(
  event: ProcedureRecordLifecycleEvent,
): LifecycleEventPhysicalWriteBuildResult {
  if (!validateProcedureRecordLifecycleEvent(event)) {
    return { ok: false, reason: "INVALID_EVENT" };
  }
  if (!allPhysicalTextFits(event)) {
    return { ok: false, reason: "FIELD_TOO_LONG" };
  }

  const row: {
    lifeSchemaVersion: string;
    lifeLifecycleEventId: string;
    lifeLifecycleIdempotencyKey: string;
    lifeLifecyclePayloadFingerprint: string;
    lifeEventType: string;
    lifeTargetRecordId: string;
    lifeReplacementRecordId?: string;
    lifeRecordedAt: string;
    lifeRecordedBy: string;
    lifeReason?: string;
  } = {
    lifeSchemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
    lifeLifecycleEventId: event.LifecycleEventId,
    lifeLifecycleIdempotencyKey: event.LifecycleIdempotencyKey,
    lifeLifecyclePayloadFingerprint: event.LifecyclePayloadFingerprint,
    lifeEventType: event.eventType,
    lifeTargetRecordId: event.targetRecordId,
    lifeRecordedAt: event.recordedAt,
    lifeRecordedBy: event.recordedBy,
  };

  if (event.replacementRecordId !== undefined) {
    row.lifeReplacementRecordId = event.replacementRecordId;
  }
  if (event.reason !== undefined) {
    row.lifeReason = event.reason;
  }

  return { ok: true, row };
}

export function decodeProcedureRecordLifecycleEventPhysicalRow(
  row: ProcedureRecordLifecycleEventPhysicalRow,
): LifecycleEventPhysicalReadResult {
  const schemaVersion = readRequiredText(row.lifeSchemaVersion);
  const lifecycleEventId = readRequiredText(row.lifeLifecycleEventId);
  const lifecycleIdempotencyKey = readRequiredText(row.lifeLifecycleIdempotencyKey);
  const lifecyclePayloadFingerprint = readRequiredText(row.lifeLifecyclePayloadFingerprint);
  const eventType = readRequiredText(row.lifeEventType);
  const targetRecordId = readRequiredText(row.lifeTargetRecordId);
  const recordedAt = readRequiredText(row.lifeRecordedAt);
  const recordedBy = readRequiredText(row.lifeRecordedBy);
  const replacementRecordId = readOptionalText(row.lifeReplacementRecordId);
  const reason = readOptionalText(row.lifeReason);

  if (
    schemaVersion !== LOGICAL_SCHEMA_VERSION ||
    lifecycleEventId === null ||
    lifecycleIdempotencyKey === null ||
    lifecyclePayloadFingerprint === null ||
    (eventType !== "SUPERSEDE" && eventType !== "CANCEL") ||
    targetRecordId === null ||
    recordedAt === null ||
    recordedBy === null ||
    !replacementRecordId.ok ||
    !reason.ok
  ) {
    return { ok: false, reason: "MALFORMED_PHYSICAL" };
  }

  const candidate: {
    schemaVersion: typeof LOGICAL_SCHEMA_VERSION;
    LifecycleEventId: string;
    LifecycleIdempotencyKey: string;
    LifecyclePayloadFingerprint: string;
    eventType: "SUPERSEDE" | "CANCEL";
    targetRecordId: string;
    replacementRecordId?: string;
    recordedAt: string;
    recordedBy: string;
    reason?: string;
  } = {
    schemaVersion: LOGICAL_SCHEMA_VERSION,
    LifecycleEventId: lifecycleEventId,
    LifecycleIdempotencyKey: lifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: lifecyclePayloadFingerprint,
    eventType,
    targetRecordId,
    recordedAt,
    recordedBy,
  };

  if (replacementRecordId.value !== undefined) {
    candidate.replacementRecordId = replacementRecordId.value;
  }
  if (reason.value !== undefined) {
    candidate.reason = reason.value;
  }

  if (!validateProcedureRecordLifecycleEvent(candidate)) {
    return { ok: false, reason: "MALFORMED_PHYSICAL" };
  }

  return { ok: true, event: candidate };
}
