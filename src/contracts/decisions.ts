import { validateDeploymentContext, validateExecutionRecord } from "./validation";
import {
  type AccessDecision,
  type AuthenticatedIdentity,
  type DeploymentContext,
  type ExecutionRecord,
  type LookupResult,
  type Role,
  type SubmissionDecision,
} from "./types";

const roles: readonly Role[] = ["SUPPORTER", "SUPERVISOR", "REVIEWER", "ADMIN"];

const isRole = (value: unknown): value is Role => roles.includes(value as Role);

export const evaluateAccess = (input: {
  context: DeploymentContext;
  identity: LookupResult<AuthenticatedIdentity>;
  requiredRoles: readonly Role[];
}): AccessDecision => {
  if (!validateDeploymentContext(input.context).ok) return { decision: "DENY", reason: "INVALID_CONTEXT" };

  if (input.identity.status === "EMPTY") return { decision: "DENY", reason: "AUTH_EMPTY" };
  if (input.identity.status === "UNKNOWN") return { decision: "DENY", reason: "AUTH_UNKNOWN" };
  if (input.identity.status === "FETCH_FAILED") return { decision: "DENY", reason: "AUTH_FETCH_FAILED" };

  const identity = input.identity.value;
  if (
    identity.Subject.trim().length === 0 ||
    identity.OrganizationId.trim().length === 0 ||
    identity.SiteId.trim().length === 0
  ) {
    return { decision: "DENY", reason: "INVALID_IDENTITY" };
  }
  if (identity.OrganizationId !== input.context.OrganizationId) {
    return { decision: "DENY", reason: "ORGANIZATION_MISMATCH" };
  }
  if (identity.SiteId !== input.context.SiteId) return { decision: "DENY", reason: "SITE_MISMATCH" };
  if (input.requiredRoles.length === 0) return { decision: "DENY", reason: "NO_REQUIRED_ROLE" };
  if (!identity.Roles.every(isRole)) return { decision: "DENY", reason: "UNKNOWN_ROLE" };
  if (!input.requiredRoles.some((role) => identity.Roles.includes(role))) {
    return { decision: "DENY", reason: "ROLE_NOT_ALLOWED" };
  }
  return { decision: "ALLOW", reason: "ROLE_ALLOWED" };
};

export const classifyExecutionSubmission = (
  existing: LookupResult<ExecutionRecord>,
  incoming: ExecutionRecord,
): SubmissionDecision => {
  const incomingValidation = validateExecutionRecord(incoming);
  if (!incomingValidation.ok) return { decision: "REJECT_INVALID_RECORD" };

  if (existing.status === "EMPTY") return { decision: "ACCEPT_NEW" };
  if (existing.status === "UNKNOWN") return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "UNKNOWN" };
  if (existing.status === "FETCH_FAILED") {
    return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "FETCH_FAILED" };
  }

  const current = existing.value;
  const sameRecordId = current.RecordId === incoming.RecordId;
  const sameIdempotencyKey = current.IdempotencyKey === incoming.IdempotencyKey;
  const samePayload = current.PayloadFingerprint === incoming.PayloadFingerprint;
  if (sameRecordId && sameIdempotencyKey && samePayload) {
    return { decision: "DUPLICATE_REPLAY", RecordId: current.RecordId };
  }
  if (sameRecordId) {
    return { decision: "REJECT_DUPLICATE_CONFLICT", RecordId: current.RecordId, reason: "RECORD_ID_REUSED" };
  }
  if (sameIdempotencyKey) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: current.RecordId,
      reason: samePayload ? "IDEMPOTENCY_KEY_REUSED" : "PAYLOAD_MISMATCH",
    };
  }
  return { decision: "REJECT_DUPLICATE_CONFLICT", RecordId: current.RecordId, reason: "RECORD_ID_REUSED" };
};
