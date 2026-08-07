import type { Role } from "../contracts";
import {
  HANDOFF_STATUS_ALLOWED_TRANSITIONS,
  transitionHandoffStatus,
} from "./handoff-transition";
import type { HandoffStatus } from "./finding-audit";

export type HandoffTransitionRolePolicyResult =
  | Readonly<{
      ok: true;
      requiredRoles: readonly Role[];
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION" | "POLICY_MISSING";
    }>;

const PLANNER_AND_SERVICE_MANAGER = [
  "PLANNER",
  "SERVICE_MANAGER",
] as const satisfies readonly Role[];

const SERVICE_MANAGER_ONLY = [
  "SERVICE_MANAGER",
] as const satisfies readonly Role[];

export const HANDOFF_TRANSITION_ROLE_POLICY = [
  ["not_required", "pending", PLANNER_AND_SERVICE_MANAGER],
  ["pending", "not_required", PLANNER_AND_SERVICE_MANAGER],
  ["pending", "included", PLANNER_AND_SERVICE_MANAGER],
  ["included", "pending", PLANNER_AND_SERVICE_MANAGER],
  ["included", "acknowledged", PLANNER_AND_SERVICE_MANAGER],
  ["acknowledged", "included", PLANNER_AND_SERVICE_MANAGER],
  ["acknowledged", "closed", SERVICE_MANAGER_ONLY],
] as const satisfies ReadonlyArray<
  readonly [HandoffStatus, HandoffStatus, readonly Role[]]
>;

/**
 * Return the required application roles for an accepted Handoff edge.
 *
 * The function does not authenticate a user or evaluate organization/site
 * context. Callers compose the returned roles with the canonical
 * `evaluateAccess` contract.
 *
 * Fail-closed: malformed or denied edges return the transition error, and an
 * allowlist/policy drift returns POLICY_MISSING.
 */
export function getHandoffTransitionRequiredRoles(
  currentStatus: unknown,
  targetStatus: unknown
): HandoffTransitionRolePolicyResult {
  const transition = transitionHandoffStatus(currentStatus, targetStatus);
  if (!transition.ok) {
    return transition;
  }

  const policy = HANDOFF_TRANSITION_ROLE_POLICY.find(
    ([from, to]) => from === currentStatus && to === targetStatus
  );

  if (!policy) {
    return { ok: false, code: "POLICY_MISSING" };
  }

  return { ok: true, requiredRoles: policy[2] };
}

/**
 * Drift helper used by contract tests.
 */
export function hasRolePolicyForEveryAllowedHandoffEdge(): boolean {
  return HANDOFF_STATUS_ALLOWED_TRANSITIONS.every(([from, to]) =>
    HANDOFF_TRANSITION_ROLE_POLICY.some(
      ([policyFrom, policyTo]) => policyFrom === from && policyTo === to
    )
  );
}
