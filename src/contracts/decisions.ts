import { validateDeploymentContext, validateExecutionRecord } from "./validation";
import {
  AUTHORIZED_SITE_IDS,
  ASIA_TOKYO_TIME_ZONE,
  type AccessDecision,
  type AuthenticatedIdentity,
  type AuthorizationContext,
  type AuthorizedSiteId,
  type DeploymentContext,
  type ExecutionRecord,
  type ExecutionRecordLookupResults,
  type LookupResult,
  type Role,
  type SiteContext,
  type SiteMembership,
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
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const isAuthorizedSiteId = (value: unknown): value is AuthorizedSiteId =>
  typeof value === "string" && (AUTHORIZED_SITE_IDS as readonly string[]).includes(value);

const isSiteMembershipShape = (value: unknown): value is SiteMembership => {
  if (!isRecord(value)) return false;
  if (!isAuthorizedSiteId(value.SiteId)) return false;
  if (!Array.isArray(value.Roles)) return false;
  // Role enum validity is enforced by evaluateAccess (UNKNOWN_ROLE); do not remap.
  return value.Roles.every((role) => typeof role === "string");
};

const isSiteContext = (value: unknown): value is SiteContext => {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.Memberships)) return false;
  if (!value.Memberships.every(isSiteMembershipShape)) return false;
  if (value.SelectedSiteId !== null && typeof value.SelectedSiteId !== "string") return false;
  return true;
};

const isAuthorizationContext = (value: unknown): value is AuthorizationContext => {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.Subject)) return false;
  if (!isNonEmptyString(value.UserId)) return false;
  if (!isNonEmptyString(value.OrganizationId)) return false;
  if (!isSiteContext(value.SiteContext)) return false;
  return true;
};

export const evaluateAccess = (input: {
  context: DeploymentContext;
  identity: LookupResult<AuthenticatedIdentity>;
  requiredRoles: readonly Role[];
}): AccessDecision => {
  if (!validateDeploymentContext(input.context).ok)
    return { decision: "DENY", reason: "INVALID_CONTEXT" };

  if (input.identity.status === "EMPTY") return { decision: "DENY", reason: "AUTH_EMPTY" };
  if (input.identity.status === "UNKNOWN") return { decision: "DENY", reason: "AUTH_UNKNOWN" };
  if (input.identity.status === "FETCH_FAILED")
    return { decision: "DENY", reason: "AUTH_FETCH_FAILED" };

  const identity: unknown = input.identity.value;
  if (!isRecord(identity)) return { decision: "DENY", reason: "INVALID_IDENTITY" };

  const identityRoles = identity.Roles;
  if (
    !isNonEmptyString(identity.Subject) ||
    !isNonEmptyString(identity.OrganizationId) ||
    !isNonEmptyString(identity.SiteId) ||
    !Array.isArray(identityRoles)
  ) {
    return { decision: "DENY", reason: "INVALID_IDENTITY" };
  }
  if (identity.OrganizationId !== input.context.OrganizationId) {
    return { decision: "DENY", reason: "ORGANIZATION_MISMATCH" };
  }
  if (identity.SiteId !== input.context.SiteId)
    return { decision: "DENY", reason: "SITE_MISMATCH" };
  if (!Array.isArray(input.requiredRoles) || input.requiredRoles.length === 0) {
    return { decision: "DENY", reason: "NO_REQUIRED_ROLE" };
  }
  if (!identityRoles.every(isRole) || !input.requiredRoles.every(isRole)) {
    return { decision: "DENY", reason: "UNKNOWN_ROLE" };
  }
  if (!input.requiredRoles.some((role) => identityRoles.includes(role))) {
    return { decision: "DENY", reason: "ROLE_NOT_ALLOWED" };
  }
  return { decision: "ALLOW", reason: "ROLE_ALLOWED" };
};

/**
 * #21-A Authorization / SiteContext pure contract.
 * Resolves an authorized current site from explicit selection + memberships,
 * then reuses evaluateAccess for role / org / site fail-closed checks.
 *
 * Never infers SelectedSiteId from membership array order or sole membership.
 * Never infers roles from display name, email, URL, or SharePoint path.
 */
export const evaluateAuthorizationAccess = (input: {
  authorization: LookupResult<AuthorizationContext>;
  requiredRoles: readonly Role[];
  context?: DeploymentContext;
}): AccessDecision => {
  if (input.authorization.status === "EMPTY") return { decision: "DENY", reason: "AUTH_EMPTY" };
  if (input.authorization.status === "UNKNOWN") return { decision: "DENY", reason: "AUTH_UNKNOWN" };
  if (input.authorization.status === "FETCH_FAILED")
    return { decision: "DENY", reason: "AUTH_FETCH_FAILED" };

  const raw: unknown = input.authorization.value;
  if (!isAuthorizationContext(raw)) {
    if (!isRecord(raw)) return { decision: "DENY", reason: "INVALID_IDENTITY" };
    if (!isNonEmptyString(raw.Subject)) return { decision: "DENY", reason: "INVALID_IDENTITY" };
    if (!isNonEmptyString(raw.UserId) || !isNonEmptyString(raw.OrganizationId)) {
      return { decision: "DENY", reason: "INVALID_IDENTITY" };
    }
    return { decision: "DENY", reason: "INVALID_CONTEXT" };
  }

  const authorization = raw;
  const selectedSiteId = authorization.SiteContext.SelectedSiteId;
  if (selectedSiteId === null || selectedSiteId.trim().length === 0) {
    return { decision: "DENY", reason: "SITE_SELECTION_REQUIRED" };
  }
  if (!isAuthorizedSiteId(selectedSiteId)) {
    return { decision: "DENY", reason: "INVALID_CONTEXT" };
  }

  // Explicit membership match only — never Memberships[0] / array-order inference.
  const membership = authorization.SiteContext.Memberships.find(
    (item) => item.SiteId === selectedSiteId,
  );
  if (membership === undefined) {
    return { decision: "DENY", reason: "SITE_NOT_IN_MEMBERSHIP" };
  }

  const deploymentContext: DeploymentContext = input.context ?? {
    OrganizationId: authorization.OrganizationId,
    SiteId: selectedSiteId,
    TimeZone: ASIA_TOKYO_TIME_ZONE,
  };

  const identity: AuthenticatedIdentity = {
    Subject: authorization.Subject,
    OrganizationId: authorization.OrganizationId,
    SiteId: selectedSiteId,
    Roles: membership.Roles,
  };

  return evaluateAccess({
    context: deploymentContext,
    identity: { status: "FOUND", value: identity },
    requiredRoles: input.requiredRoles,
  });
};

const sameProcedure = (
  left: ExecutionRecord["Procedure"],
  right: ExecutionRecord["Procedure"],
): boolean =>
  left.ProcedureId === right.ProcedureId &&
  left.ProcedureVersion === right.ProcedureVersion &&
  left.ApprovalState === right.ApprovalState;

const sameExecutionRecord = (left: ExecutionRecord, right: ExecutionRecord): boolean =>
  left.OrganizationId === right.OrganizationId &&
  left.SiteId === right.SiteId &&
  left.UserId === right.UserId &&
  left.TimeZone === right.TimeZone &&
  left.RecordId === right.RecordId &&
  left.IdempotencyKey === right.IdempotencyKey &&
  sameProcedure(left.Procedure, right.Procedure) &&
  left.LocalDate === right.LocalDate &&
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
  if (
    (recordLookup.status === "FOUND" && !validateExecutionRecord(recordLookup.value).ok) ||
    (idempotencyLookup.status === "FOUND" && !validateExecutionRecord(idempotencyLookup.value).ok)
  ) {
    return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "INVALID_LOOKUP_RESULT" };
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

  if (recordLookup.status !== "FOUND" || idempotencyLookup.status !== "FOUND") {
    return { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "UNKNOWN" };
  }

  const byRecordId = recordLookup.value;
  const byIdempotencyKey = idempotencyLookup.value;

  if (!sameExecutionRecord(byRecordId, byIdempotencyKey)) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: "LOOKUP_RESULTS_DIVERGED",
    };
  }

  const sameRecordId = byRecordId.RecordId === incoming.RecordId;
  const sameIdempotencyKey = byRecordId.IdempotencyKey === incoming.IdempotencyKey;
  const samePayload = byRecordId.PayloadFingerprint === incoming.PayloadFingerprint;

  if (sameExecutionRecord(byRecordId, incoming)) {
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
  if (sameRecordId && sameIdempotencyKey && samePayload) {
    return {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: byRecordId.RecordId,
      reason: "RECORD_CONTEXT_MISMATCH",
    };
  }

  return {
    decision: "REJECT_DUPLICATE_CONFLICT",
    RecordId: byRecordId.RecordId,
    reason: "LOOKUP_RESULTS_DIVERGED",
  };
};
