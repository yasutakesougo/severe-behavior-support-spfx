import {
  HANDOFF_STATUSES,
  type HandoffStatus,
} from "./finding-audit";

export const HANDOFF_STATUS_ALLOWED_TRANSITIONS = [
  ["not_required", "pending"],
  ["pending", "not_required"],
  ["pending", "included"],
  ["included", "pending"],
  ["included", "acknowledged"],
  ["acknowledged", "included"],
  ["acknowledged", "closed"],
] as const satisfies ReadonlyArray<readonly [HandoffStatus, HandoffStatus]>;

export type HandoffStatusTransitionResult =
  | Readonly<{
      ok: true;
      status: HandoffStatus;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION";
    }>;

export function isHandoffStatus(value: unknown): value is HandoffStatus {
  return (
    typeof value === "string" &&
    HANDOFF_STATUSES.includes(value as HandoffStatus)
  );
}

/**
 * Transition HandoffStatus along the approved graph only.
 *
 * Technical contract: docs/architecture/handoff-status-transition.md
 *
 * Fail-closed: no exceptions. Roles, HandoffState mutation, persistence,
 * audit emission, SharePoint, and UI behavior are out of scope.
 */
export function transitionHandoffStatus(
  currentStatus: unknown,
  targetStatus: unknown
): HandoffStatusTransitionResult {
  if (!isHandoffStatus(currentStatus) || !isHandoffStatus(targetStatus)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const allowed = HANDOFF_STATUS_ALLOWED_TRANSITIONS.some(
    ([from, to]) => from === currentStatus && to === targetStatus
  );

  if (!allowed) {
    return { ok: false, code: "INVALID_TRANSITION" };
  }

  return { ok: true, status: targetStatus };
}
