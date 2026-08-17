import {
  ASIA_TOKYO_TIME_ZONE,
  type ApprovedProcedureReference,
  type LocalDate,
} from "../contracts/types";
import { sha256Hex } from "./sha256";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

/**
 * -----------------------------------------------------------------------------
 * 1. ScheduleItem@1.0.0
 * Logical schema: severe-behavior-support.schedule-item.item
 * -----------------------------------------------------------------------------
 */
export const SCHEDULE_ITEM_SCHEMA_ID = "severe-behavior-support.schedule-item.item" as const;
export const SCHEDULE_ITEM_SCHEMA_VERSION = "1.0.0" as const;

export type ScheduleItem = Readonly<{
  schemaVersion: typeof SCHEDULE_ITEM_SCHEMA_VERSION;
  ScheduleItemId: string;
  OrganizationId: string;
  SiteId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  scheduledTime: string;
  activityLabel: string;
  catalogOrder: number;
}>;

export function validateScheduleItem(value: unknown): value is ScheduleItem {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaVersion !== SCHEDULE_ITEM_SCHEMA_VERSION ||
    !isNonEmptyString(value.ScheduleItemId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isRecord(value.Procedure) ||
    !isNonEmptyString(value.Procedure.ProcedureId) ||
    !isNonEmptyString(value.Procedure.ProcedureVersion) ||
    value.Procedure.ApprovalState !== "APPROVED" ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isNonEmptyString(value.scheduledTime) ||
    !isNonEmptyString(value.activityLabel) ||
    typeof value.catalogOrder !== "number" ||
    !Number.isInteger(value.catalogOrder)
  ) {
    return false;
  }

  return true;
}

/**
 * -----------------------------------------------------------------------------
 * 2. ScheduledOccurrence@1.0.0
 * Logical schema: severe-behavior-support.scheduled-occurrence.occurrence
 * -----------------------------------------------------------------------------
 */
export const SCHEDULED_OCCURRENCE_SCHEMA_ID =
  "severe-behavior-support.scheduled-occurrence.occurrence" as const;
export const SCHEDULED_OCCURRENCE_SCHEMA_VERSION = "1.0.0" as const;

export type ScheduledOccurrence = Readonly<{
  schemaVersion: typeof SCHEDULED_OCCURRENCE_SCHEMA_VERSION;
  OccurrenceId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  LocalDate: LocalDate;
  TimeZone: typeof ASIA_TOKYO_TIME_ZONE;
  ScheduleItemId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
}>;

export type ScheduledOccurrenceMintInput = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  LocalDate: LocalDate;
  ScheduleItemId: string;
}>;

export const KIOSK_IDENTITY_SEPARATOR = "\u001f";

/**
 * Mint OccurrenceId deterministically from canonical material (Design §2.4).
 * Material: OrganizationId \u001f SiteId \u001f UserId \u001f LocalDate \u001f ScheduleItemId
 */
export function mintOccurrenceId(input: ScheduledOccurrenceMintInput): string {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.LocalDate,
    input.ScheduleItemId,
  ].join(KIOSK_IDENTITY_SEPARATOR);

  return sha256Hex(`scheduled-occurrence.occurrence-id${KIOSK_IDENTITY_SEPARATOR}${material}`);
}

export function validateScheduledOccurrence(value: unknown): value is ScheduledOccurrence {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaVersion !== SCHEDULED_OCCURRENCE_SCHEMA_VERSION ||
    !isNonEmptyString(value.OccurrenceId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    typeof value.LocalDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.LocalDate) ||
    value.TimeZone !== ASIA_TOKYO_TIME_ZONE ||
    !isNonEmptyString(value.ScheduleItemId) ||
    !isRecord(value.Procedure) ||
    !isNonEmptyString(value.Procedure.ProcedureId) ||
    !isNonEmptyString(value.Procedure.ProcedureVersion) ||
    value.Procedure.ApprovalState !== "APPROVED" ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1
  ) {
    return false;
  }

  return true;
}

/**
 * -----------------------------------------------------------------------------
 * 3. ProcedureRecordOccurrenceBinding@1.0.0
 * Logical schema: severe-behavior-support.procedure-record-occurrence-binding.binding
 * -----------------------------------------------------------------------------
 */
export const PROCEDURE_RECORD_OCCURRENCE_BINDING_SCHEMA_ID =
  "severe-behavior-support.procedure-record-occurrence-binding.binding" as const;
export const PROCEDURE_RECORD_OCCURRENCE_BINDING_SCHEMA_VERSION = "1.0.0" as const;

export type ProcedureRecordOccurrenceBinding = Readonly<{
  schemaVersion: typeof PROCEDURE_RECORD_OCCURRENCE_BINDING_SCHEMA_VERSION;
  OccurrenceId: string;
  RecordId: string;
}>;

export function validateProcedureRecordOccurrenceBinding(
  value: unknown,
): value is ProcedureRecordOccurrenceBinding {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === PROCEDURE_RECORD_OCCURRENCE_BINDING_SCHEMA_VERSION &&
    isNonEmptyString(value.OccurrenceId) &&
    isNonEmptyString(value.RecordId)
  );
}

/**
 * -----------------------------------------------------------------------------
 * 4. ProcedureObservation@1.0.0
 * Logical schema: severe-behavior-support.procedure-observation.observation
 * -----------------------------------------------------------------------------
 */
export const PROCEDURE_OBSERVATION_SCHEMA_ID =
  "severe-behavior-support.procedure-observation.observation" as const;
export const PROCEDURE_OBSERVATION_SCHEMA_VERSION = "1.0.0" as const;

/** Exact recovered Legacy vocabulary chips */
export const OBS_MOOD_CHIPS = [
  "落ち着いていた",
  "不安そう",
  "拒否あり",
  "興奮あり",
  "切り替え困難",
] as const;

export const OBS_ACTION_CHIPS = [
  "見守り",
  "声かけ",
  "環境調整",
  "活動変更",
  "距離を取る",
  "クールダウン",
] as const;

export const OBS_RESULT_CHIPS = ["改善した", "変化なし", "悪化した", "途中で落ち着いた"] as const;

export type ObsMoodChip = (typeof OBS_MOOD_CHIPS)[number];
export type ObsActionChip = (typeof OBS_ACTION_CHIPS)[number];
export type ObsResultChip = (typeof OBS_RESULT_CHIPS)[number];

export type ProcedureObservation = Readonly<{
  schemaVersion: typeof PROCEDURE_OBSERVATION_SCHEMA_VERSION;
  RecordId: string;
  OccurrenceId?: string;
  condition?: ObsMoodChip;
  response?: ObsActionChip;
  change?: ObsResultChip;
  memo?: string;
}>;

export function validateProcedureObservation(value: unknown): value is ProcedureObservation {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaVersion !== PROCEDURE_OBSERVATION_SCHEMA_VERSION ||
    !isNonEmptyString(value.RecordId)
  ) {
    return false;
  }

  if (value.OccurrenceId !== undefined && !isNonEmptyString(value.OccurrenceId)) {
    return false;
  }

  if (
    value.condition !== undefined &&
    !(OBS_MOOD_CHIPS as readonly string[]).includes(value.condition as string)
  ) {
    return false;
  }

  if (
    value.response !== undefined &&
    !(OBS_ACTION_CHIPS as readonly string[]).includes(value.response as string)
  ) {
    return false;
  }

  if (
    value.change !== undefined &&
    !(OBS_RESULT_CHIPS as readonly string[]).includes(value.change as string)
  ) {
    return false;
  }

  if (value.memo !== undefined && typeof value.memo !== "string") {
    return false;
  }

  // Must have at least ONE known value if observation object exists
  const hasCondition = isNonEmptyString(value.condition);
  const hasResponse = isNonEmptyString(value.response);
  const hasChange = isNonEmptyString(value.change);
  const hasMemo = isNonEmptyString(value.memo);

  return hasCondition || hasResponse || hasChange || hasMemo;
}

/**
 * -----------------------------------------------------------------------------
 * 5. ProcedureRecordLifecycleEvent@1.0.0
 * Logical schema: severe-behavior-support.procedure-record.lifecycle-event
 * -----------------------------------------------------------------------------
 */
export const PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_ID =
  "severe-behavior-support.procedure-record.lifecycle-event" as const;
export const PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION = "1.0.0" as const;

export type LifecycleEventType = "SUPERSEDE" | "CANCEL";

export type ProcedureRecordLifecycleEvent = Readonly<{
  schemaVersion: typeof PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION;
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
  eventType: LifecycleEventType;
  targetRecordId: string;
  replacementRecordId?: string;
  recordedAt: string;
  recordedBy: string;
  reason?: string;
}>;

export type LifecycleEventMintInput = Readonly<{
  eventType: LifecycleEventType;
  targetRecordId: string;
  replacementRecordId?: string;
  recordedAt: string;
  recordedBy: string;
  reason?: string;
}>;

export function mintLifecycleEventIdentity(input: LifecycleEventMintInput): Readonly<{
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
}> {
  const material = [
    input.eventType,
    input.targetRecordId,
    input.replacementRecordId ?? "",
    input.recordedAt,
    input.recordedBy,
    input.reason ?? "",
  ].join(KIOSK_IDENTITY_SEPARATOR);

  return {
    LifecycleEventId: sha256Hex(
      `procedure-record.lifecycle-event-id${KIOSK_IDENTITY_SEPARATOR}${material}`,
    ),
    LifecycleIdempotencyKey: sha256Hex(
      `procedure-record.lifecycle-idempotency-key${KIOSK_IDENTITY_SEPARATOR}${material}`,
    ),
    LifecyclePayloadFingerprint: sha256Hex(
      `procedure-record.lifecycle-payload-fingerprint${KIOSK_IDENTITY_SEPARATOR}${material}`,
    ),
  };
}

export function validateProcedureRecordLifecycleEvent(
  value: unknown,
): value is ProcedureRecordLifecycleEvent {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaVersion !== PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION ||
    !isNonEmptyString(value.LifecycleEventId) ||
    !isNonEmptyString(value.LifecycleIdempotencyKey) ||
    !isNonEmptyString(value.LifecyclePayloadFingerprint) ||
    (value.eventType !== "SUPERSEDE" && value.eventType !== "CANCEL") ||
    !isNonEmptyString(value.targetRecordId) ||
    !isValidIsoDateTime(value.recordedAt) ||
    !isNonEmptyString(value.recordedBy)
  ) {
    return false;
  }

  if (value.reason !== undefined && typeof value.reason !== "string") {
    return false;
  }

  if (value.eventType === "SUPERSEDE") {
    if (
      !isNonEmptyString(value.replacementRecordId) ||
      value.targetRecordId === value.replacementRecordId
    ) {
      return false; // SUPERSEDE requires distinct replacementRecordId
    }
  } else if (value.eventType === "CANCEL") {
    if (value.replacementRecordId !== undefined) {
      return false; // CANCEL must NOT have replacementRecordId
    }
  }

  return true;
}

/**
 * -----------------------------------------------------------------------------
 * 6. Effective Record Resolver (Fail-closed D3 / R1-R7)
 * -----------------------------------------------------------------------------
 */
export type OccurrenceResolverResult =
  | Readonly<{ status: "UNRECORDED" }>
  | Readonly<{ status: "RECORDED"; effectiveRecordId: string }>
  | Readonly<{ status: "CANCELLED"; targetRecordId: string }>
  | Readonly<{ status: "CONFLICT"; reason: string }>
  | Readonly<{ status: "INVALID"; reason: string }>;

export function resolveEffectiveOccurrenceState(
  boundRecordIds: readonly string[],
  events: readonly ProcedureRecordLifecycleEvent[],
): OccurrenceResolverResult {
  if (boundRecordIds.length === 0) {
    return { status: "UNRECORDED" };
  }

  // Validate events
  for (const ev of events) {
    if (!validateProcedureRecordLifecycleEvent(ev)) {
      return { status: "INVALID", reason: "Invalid lifecycle event shape" };
    }
  }

  // Group events by targetRecordId
  const supersedes = new Map<string, string[]>();
  const cancels = new Set<string>();

  for (const ev of events) {
    if (ev.eventType === "SUPERSEDE" && ev.replacementRecordId) {
      const existing = supersedes.get(ev.targetRecordId) ?? [];
      existing.push(ev.replacementRecordId);
      supersedes.get(ev.targetRecordId);
      supersedes.set(ev.targetRecordId, existing);
    } else if (ev.eventType === "CANCEL") {
      cancels.add(ev.targetRecordId);
    }
  }

  // R5 Check: Multiple independent SUPERSEDE events for the same targetRecordId -> CONFLICT
  for (const [targetId, replacements] of supersedes.entries()) {
    if (replacements.length > 1) {
      return {
        status: "CONFLICT",
        reason: `R5 CONFLICT: Multiple SUPERSEDE events for targetRecordId=${targetId}`,
      };
    }
  }

  // Walk chains for each bound record
  const effectiveRecordIds = new Set<string>();

  for (const startId of boundRecordIds) {
    let currentId = startId;
    const visited = new Set<string>();

    while (supersedes.has(currentId)) {
      if (visited.has(currentId)) {
        return {
          status: "INVALID",
          reason: `R6 INVALID: Cycle detected at RecordId=${currentId}`,
        };
      }
      visited.add(currentId);
      const replacements = supersedes.get(currentId)!;
      currentId = replacements[0];
    }

    if (cancels.has(currentId)) {
      // Record chain ends in cancellation
      continue;
    }

    effectiveRecordIds.add(currentId);
  }

  if (effectiveRecordIds.size === 0) {
    // All bound chains were cancelled
    return { status: "CANCELLED", targetRecordId: boundRecordIds[0] };
  }

  if (effectiveRecordIds.size > 1) {
    return {
      status: "CONFLICT",
      reason: "R5 CONFLICT: Multiple active effective records for single occurrence",
    };
  }

  const [effectiveRecordId] = Array.from(effectiveRecordIds);
  return { status: "RECORDED", effectiveRecordId };
}
