import { isNonEmptyString, isValidIsoDateTime } from "./validation";
import {
  validateAuditEvent,
  type AuditEvent,
  type HandoffStatus,
} from "./finding-audit";
import { transitionHandoffStatus } from "./handoff-transition";

export const HANDOFF_STATUS_CHANGED_ACTION_CODE =
  "HANDOFF_STATUS_CHANGED" as const;

export type HandoffAuditEventCandidateInput = Readonly<{
  auditEventId: unknown;
  OrganizationId: unknown;
  SiteId: unknown;
  actorStaffId: unknown;
  targetRecordId: unknown;
  currentStatus: unknown;
  targetStatus: unknown;
  occurredAt: unknown;
  correlationId: unknown;
  appVersion?: unknown;
  ruleSetVersion?: unknown;
}>;

export type HandoffAuditEventCandidateResult =
  | Readonly<{ ok: true; event: AuditEvent }>
  | Readonly<{
      ok: false;
      code:
        | "MALFORMED_INPUT"
        | "INVALID_TRANSITION"
        | "AUDIT_EVENT_INVALID";
    }>;

function statusToken(status: HandoffStatus): string {
  return status.toUpperCase();
}

export function toHandoffTransitionReasonCode(
  currentStatus: HandoffStatus,
  targetStatus: HandoffStatus,
): string {
  return `HANDOFF_${statusToken(currentStatus)}_TO_${statusToken(targetStatus)}`;
}

/**
 * Build a successful AuditEvent candidate for an already-authorized and
 * successfully applied Handoff state change.
 *
 * Persistence, audit write retries, retention, and SharePoint are out of scope.
 */
export function buildHandoffStatusChangedAuditEventCandidate(
  input: HandoffAuditEventCandidateInput,
): HandoffAuditEventCandidateResult {
  if (
    !isNonEmptyString(input.auditEventId) ||
    !isNonEmptyString(input.OrganizationId) ||
    !isNonEmptyString(input.SiteId) ||
    !isNonEmptyString(input.actorStaffId) ||
    !isNonEmptyString(input.targetRecordId) ||
    !isValidIsoDateTime(input.occurredAt) ||
    !isNonEmptyString(input.correlationId) ||
    (input.appVersion !== undefined && !isNonEmptyString(input.appVersion)) ||
    (input.ruleSetVersion !== undefined &&
      !isNonEmptyString(input.ruleSetVersion))
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const transition = transitionHandoffStatus(
    input.currentStatus,
    input.targetStatus,
  );
  if (!transition.ok) {
    return transition;
  }

  const event: AuditEvent = {
    auditEventId: input.auditEventId,
    OrganizationId: input.OrganizationId,
    SiteId: input.SiteId,
    actorStaffId: input.actorStaffId,
    actionCode: HANDOFF_STATUS_CHANGED_ACTION_CODE,
    targetType: "HandoffState",
    targetRecordId: input.targetRecordId,
    result: "success",
    occurredAt: input.occurredAt,
    correlationId: input.correlationId,
    reasonCode: toHandoffTransitionReasonCode(
      input.currentStatus as HandoffStatus,
      transition.status,
    ),
    ...(input.appVersion !== undefined
      ? { appVersion: input.appVersion }
      : {}),
    ...(input.ruleSetVersion !== undefined
      ? { ruleSetVersion: input.ruleSetVersion }
      : {}),
  };

  if (!validateAuditEvent(event)) {
    return { ok: false, code: "AUDIT_EVENT_INVALID" };
  }

  return { ok: true, event };
}
