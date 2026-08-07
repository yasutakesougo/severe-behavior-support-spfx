import {
  isNonEmptyString,
  isValidIsoDateTime,
} from "./validation";
import {
  validateHandoffState,
  type HandoffState,
  type HandoffStatus,
} from "./finding-audit";
import { transitionHandoffStatus } from "./handoff-transition";

export type HandoffStateMutationInput = Readonly<{
  currentState: unknown;
  targetStatus: unknown;
  occurredAt: unknown;
  actorId: unknown;
  meetingId?: unknown;
}>;

export type HandoffStateMutationResult =
  | Readonly<{ ok: true; state: HandoffState }>
  | Readonly<{
      ok: false;
      code:
        | "MALFORMED_INPUT"
        | "INVALID_TRANSITION"
        | "MEETING_ID_REQUIRED"
        | "UNEXPECTED_MEETING_ID"
        | "TIMESTAMP_REGRESSION";
    }>;

function isBefore(left: string, right: string): boolean {
  return new Date(left).getTime() < new Date(right).getTime();
}

/**
 * Build the next valid HandoffState for an already-authorized transition.
 *
 * Roles, authentication, persistence and audit-event emission are out of scope.
 * Technical contract: docs/architecture/handoff-state-mutation.md
 */
export function mutateHandoffState(
  input: HandoffStateMutationInput
): HandoffStateMutationResult {
  if (
    !validateHandoffState(input.currentState) ||
    !isValidIsoDateTime(input.occurredAt) ||
    !isNonEmptyString(input.actorId)
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const transition = transitionHandoffStatus(
    input.currentState.status,
    input.targetStatus
  );
  if (!transition.ok) {
    return transition;
  }

  const current = input.currentState;
  const target = transition.status as HandoffStatus;
  const occurredAt = input.occurredAt;
  const actorId = input.actorId;

  if (current.status === "pending" && target === "included") {
    if (!isNonEmptyString(input.meetingId)) {
      return { ok: false, code: "MEETING_ID_REQUIRED" };
    }
    if (isBefore(occurredAt, current.requestedAt)) {
      return { ok: false, code: "TIMESTAMP_REGRESSION" };
    }
    return {
      ok: true,
      state: {
        status: "included",
        requestedAt: current.requestedAt,
        requestedBy: current.requestedBy,
        meetingId: input.meetingId,
        includedAt: occurredAt,
        includedBy: actorId,
      },
    };
  }

  if (input.meetingId !== undefined) {
    return { ok: false, code: "UNEXPECTED_MEETING_ID" };
  }

  if (current.status === "not_required" && target === "pending") {
    return {
      ok: true,
      state: {
        status: "pending",
        requestedAt: occurredAt,
        requestedBy: actorId,
      },
    };
  }

  if (current.status === "pending" && target === "not_required") {
    return { ok: true, state: { status: "not_required" } };
  }

  if (current.status === "included" && target === "pending") {
    return {
      ok: true,
      state: {
        status: "pending",
        requestedAt: current.requestedAt,
        requestedBy: current.requestedBy,
      },
    };
  }

  if (current.status === "included" && target === "acknowledged") {
    if (isBefore(occurredAt, current.includedAt)) {
      return { ok: false, code: "TIMESTAMP_REGRESSION" };
    }
    return {
      ok: true,
      state: {
        ...current,
        status: "acknowledged",
        acknowledgedAt: occurredAt,
        acknowledgedBy: actorId,
      },
    };
  }

  if (current.status === "acknowledged" && target === "included") {
    return {
      ok: true,
      state: {
        status: "included",
        requestedAt: current.requestedAt,
        requestedBy: current.requestedBy,
        meetingId: current.meetingId,
        includedAt: current.includedAt,
        includedBy: current.includedBy,
      },
    };
  }

  if (current.status === "acknowledged" && target === "closed") {
    if (isBefore(occurredAt, current.acknowledgedAt)) {
      return { ok: false, code: "TIMESTAMP_REGRESSION" };
    }
    return {
      ok: true,
      state: {
        ...current,
        status: "closed",
        closedAt: occurredAt,
        closedBy: actorId,
      },
    };
  }

  return { ok: false, code: "INVALID_TRANSITION" };
}
