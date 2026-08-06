import { validateDeploymentContext, validateExecutionRecord } from "./validation";
import {
  type AccessDecision,
  type AuthenticatedIdentity,
  type DeploymentContext,
  type ExecutionRecord,
  type ExecutionRecordLookupResults,
  type LookupResult,
  type Role,
  type SubmissionDecision,
} from "./types";

const roles: readonly Role[] = [
  "SUPPORTER",
  "PLANNER",
  "SERVICE_MANAGER",
  "SITE_ADMIN",
  "ORG_ADMIN",
  "SYSTEM_ADMIN",
  "VIEWER",
];

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
  if (!identity.Roles.every(isRole) || !input.requiredRoles.every(isRole)) {
    return { decision: "DENY", reason: "UNKNOWN_ROLE" };
  }
  if (!input.requiredRoles.some((role) => identity.Roles.includes(role))) {
    return { decision: "DENY", reason: "ROLE_NOT_ALLOWED" };
  }
  return { decision: "ALLOW", reason: "ROLE_ALLOWED" };
};

const sameStoredRecord = (left: ExecutionRecord, right: ExecutionRecord): boolean =>
  left.OrganizationId === right.OrganizationId &&
  left.SiteId === right.SiteId &&
  left.UserId === right.UserId &&
  left.RecordId === right.RecordId &&
  left.IdempotencyKey === right.IdempotencyKey &&
  left.PayloadFingerprint === right.PayloadFingerprint;

export const classifyExecutionSubmission = (
  lookups: ExecutionRecordLookupResults,
  incoming: ExecutionRecord,
): SubmissionDecision => {
  const incomingValidation = validateExecutionRecord(incoming);
  if (!incomingValidation.ok) return { decision: "REJECT_INVALID_RECORD" };

  const recordLookup = lookups.byRecordId;
  const idempotencyLookup = lookups.byIdempotencyKey;

  if (recordLookup.status === "FETCH_FAILED" || idempotencyLookup.status === "FETCH_FAILED") {
    return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "FETCH_FAILED" };
  }
  if (recordLookup.status === "UNKNOWN" || idempotencyLookup.status === "UNKNOWN") {
    return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "UNKNOWN" };
  }

  if (recordLookup.status === "EMPTY" && idempotencyLookup.status === "EMPTY") {
    return { decision: "ACCEPT_NEW" };
  }

  if (recordLookup.status === "FOUND" && idempotencyLookup.status === "EMPTY") {
    if (recordLookup.value.RecordId !== incoming.RecordId) {
      return {
        decision: "REJECT_DUPLICATE_CONFLICT",
        RecordId: recordLookup.value.RecordId,
        reason: "LOOKUP_RESULTS_DIVERGED",
      };
    }
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: recordLookup.value.RecordId,
      reason: "RECORD_ID_REUSED",
    };
  }

  if (recordLookup.status === "EMPTY" && idempotencyLookup.status === "FOUND") {
    if (idempotencyLookup.value.IdempotencyKey !== incoming.IdempotencyKey) {
      return {
        decision: "REJECT_DUPLICATE_CONFLICT",
        RecordId: idempotencyLookup.value.RecordId,
        reason: "LOOKUP_RESULTS_DIVERGED",
      };
    }
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: idempotencyLookup.value.RecordId,
      reason:
        idempotencyLookup.value.PayloadFingerprint === incoming.PayloadFingerprint
          ? "IDEMPOTENCY_KEY_REUSED"
          : "PAYLOAD_MISMATCH",
    };
  }

  const byRecordId = recordLookup.value;
  const byIdempotencyKey = idempotencyLookup.value;

  if (!sameStoredRecord(byRecordId, byIdempotencyKey)) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: "LOOKUP_RESULTS_DIVERGED",
    };
  }

  const sameRecordId = byRecordId.RecordId === incoming.RecordId;
  const sameIdempotencyKey = byRecordId.IdempotencyKey === incoming.IdempotencyKey;
  const samePayload = byRecordId.PayloadFingerprint === incoming.PayloadFingerprint;

  if (sameRecordId && sameIdempotencyKey && samePayload) {
    return { decision: "DUPLICATE_REPLAY", RecordId: byRecordId.RecordId };
  }
  if (sameRecordId && !sameIdempotencyKey) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: "RECORD_ID_REUSED",
    };
  }
  if (sameIdempotencyKey && !sameRecordId) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: samePayload ? "IDEMPOTENCY_KEY_REUSED" : "PAYLOAD_MISMATCH",
    };
  }
  if (sameRecordId && sameIdempotencyKey && !samePayload) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: "PAYLOAD_MISMATCH",
    };
  }

  return {
    decision: "REJECT_DUPLICATE_CONFLICT",
    RecordId: byRecordId.RecordId,
    reason: "LOOKUP_RESULTS_DIVERGED",
  };
};
