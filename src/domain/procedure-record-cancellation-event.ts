/**
 * CANCEL-SLICE-B: lifecycle event creation from approved cancellation semantics.
 *
 * Creates a CANCEL ProcedureRecordLifecycleEvent only. No persistence port,
 * UI, SharePoint adapter, LIVE WRITE, or Production Binding authority.
 */
import {
  mintLifecycleEventIdentity,
  validateProcedureRecordLifecycleEvent,
  type ProcedureRecordLifecycleEvent,
} from "./kiosk-contract";
import {
  assembleProcedureRecordCancellationSemantics,
  PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED,
  type ProcedureRecordCancellationSemanticResult,
} from "./procedure-record-cancellation";
import { isRecord, isValidIsoDateTime } from "./validation";

export const PROCEDURE_RECORD_CANCELLATION_EVENT_VERSION = "1.0.0" as const;

/** Slice B still does not authorize persistence or LIVE WRITE. */
export const PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED = false as const;

export type AssembleProcedureRecordCancellationLifecycleEventInput = Readonly<{
  /** Same authoritative input as CANCEL-SLICE-A semantic assembly. */
  semanticsInput: unknown;
  /**
   * Frozen recordedAt for deterministic LifecycleEvent identity.
   * Same-logical retry MUST reuse this value.
   * Callers MUST NOT invent a new timestamp after an uncertain persistence outcome.
   */
  recordedAtIso: string;
}>;

export type ProcedureRecordCancellationLifecycleEventInvalidReason =
  | Extract<ProcedureRecordCancellationSemanticResult, { status: "INVALID" }>["reason"]
  | "INVALID_RECORDED_AT"
  | "EVENT_VALIDATION_FAILED"
  | "LIVE_WRITE_FORBIDDEN"
  | "PERSISTENCE_NOT_AUTHORIZED"
  | "INVALID_SHAPE";

export type AssembleProcedureRecordCancellationLifecycleEventResult =
  | Readonly<{
      status: "CREATED";
      event: ProcedureRecordLifecycleEvent;
      semantics: Extract<ProcedureRecordCancellationSemanticResult, { status: "VALID" }>;
      submissionFingerprint: string;
    }>
  | Readonly<{
      status: "INVALID";
      reason: ProcedureRecordCancellationLifecycleEventInvalidReason;
    }>;

export type ProcedureRecordCancellationLifecycleEventReplayResult =
  | Readonly<{ status: "NEW" }>
  | Readonly<{
      status: "REPLAY";
      LifecycleEventId: string;
      LifecycleIdempotencyKey: string;
      LifecyclePayloadFingerprint: string;
    }>
  | Readonly<{
      status: "REPLAY_CONFLICT";
      previousLifecycleEventId: string;
      currentLifecycleEventId: string;
    }>;

function invalid(
  reason: ProcedureRecordCancellationLifecycleEventInvalidReason,
): Extract<AssembleProcedureRecordCancellationLifecycleEventResult, { status: "INVALID" }> {
  return { status: "INVALID", reason };
}

/**
 * Assemble a CANCEL lifecycle event from Slice A semantics + frozen recordedAt.
 * Pure: no I/O. Does not append to storage and does not authorize LIVE WRITE.
 */
export function assembleProcedureRecordCancellationLifecycleEvent(
  input: unknown,
): AssembleProcedureRecordCancellationLifecycleEventResult {
  if (!isRecord(input)) return invalid("INVALID_SHAPE");
  if (!("semanticsInput" in input) || !("recordedAtIso" in input)) {
    return invalid("INVALID_SHAPE");
  }
  if (Object.keys(input).some((key) => key !== "semanticsInput" && key !== "recordedAtIso")) {
    return invalid("INVALID_SHAPE");
  }

  // Slice B never elevates LIVE WRITE / persistence gates.
  if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
    return invalid("LIVE_WRITE_FORBIDDEN");
  }
  if (PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED !== false) {
    return invalid("PERSISTENCE_NOT_AUTHORIZED");
  }

  const recordedAtIso = input.recordedAtIso;
  if (typeof recordedAtIso !== "string" || !isValidIsoDateTime(recordedAtIso)) {
    return invalid("INVALID_RECORDED_AT");
  }

  const semantics = assembleProcedureRecordCancellationSemantics(input.semanticsInput);
  if (semantics.status !== "VALID") {
    return invalid(semantics.reason);
  }

  const recordedBy = semantics.frozenContext.actorUserId;
  const identity = mintLifecycleEventIdentity({
    eventType: "CANCEL",
    targetRecordId: semantics.targetRecordId,
    recordedAt: recordedAtIso,
    recordedBy,
    reason: semantics.reason,
  });

  const event: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    LifecycleEventId: identity.LifecycleEventId,
    LifecycleIdempotencyKey: identity.LifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: identity.LifecyclePayloadFingerprint,
    eventType: "CANCEL",
    targetRecordId: semantics.targetRecordId,
    recordedAt: recordedAtIso,
    recordedBy,
    reason: semantics.reason,
  };

  if (!validateProcedureRecordLifecycleEvent(event)) {
    return invalid("EVENT_VALIDATION_FAILED");
  }
  if (event.replacementRecordId !== undefined) {
    return invalid("EVENT_VALIDATION_FAILED");
  }

  return {
    status: "CREATED",
    event,
    semantics,
    submissionFingerprint: semantics.submissionFingerprint,
  };
}

/**
 * Same-logical retry: identical lifecycle identity trio ⇒ REPLAY.
 * Different LifecycleEventId for the same target cancel attempt ⇒ REPLAY_CONFLICT.
 */
export function classifyProcedureRecordCancellationLifecycleEventReplay(
  previous: ProcedureRecordLifecycleEvent,
  current: ProcedureRecordLifecycleEvent,
): ProcedureRecordCancellationLifecycleEventReplayResult {
  if (
    previous.LifecycleEventId === current.LifecycleEventId &&
    previous.LifecycleIdempotencyKey === current.LifecycleIdempotencyKey &&
    previous.LifecyclePayloadFingerprint === current.LifecyclePayloadFingerprint
  ) {
    return {
      status: "REPLAY",
      LifecycleEventId: current.LifecycleEventId,
      LifecycleIdempotencyKey: current.LifecycleIdempotencyKey,
      LifecyclePayloadFingerprint: current.LifecyclePayloadFingerprint,
    };
  }

  if (
    previous.eventType === "CANCEL" &&
    current.eventType === "CANCEL" &&
    previous.targetRecordId === current.targetRecordId &&
    previous.LifecycleEventId !== current.LifecycleEventId
  ) {
    return {
      status: "REPLAY_CONFLICT",
      previousLifecycleEventId: previous.LifecycleEventId,
      currentLifecycleEventId: current.LifecycleEventId,
    };
  }

  return { status: "NEW" };
}
