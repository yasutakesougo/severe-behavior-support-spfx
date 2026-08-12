import { evaluateAuthorizationAccess } from "./decisions";
import type {
  AccessDecision,
  AuthorizationContext,
  AuthorizationPrincipal,
  DeploymentContext,
  LookupResult,
  Role,
  SiteMembership,
} from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isMembershipShape = (value: unknown): value is SiteMembership => {
  if (!isRecord(value)) return false;
  if (typeof value.SiteId !== "string" || value.SiteId.trim().length === 0) return false;
  if (!Array.isArray(value.Roles)) return false;
  // Role enum validity is enforced later by evaluateAuthorizationAccess / evaluateAccess.
  return value.Roles.every((role) => typeof role === "string");
};

const propagateLookupFailure = <T>(
  result: Exclude<LookupResult<unknown>, { status: "FOUND" }>,
): LookupResult<T> => {
  if (result.status === "EMPTY") return { status: "EMPTY" };
  if (result.status === "UNKNOWN") return { status: "UNKNOWN", reason: result.reason };
  return { status: "FETCH_FAILED", code: result.code };
};

/**
 * #21-B — compose provider results into AuthorizationContext.
 *
 * Never infers SelectedSiteId from membership array order or sole membership.
 * Never infers roles from display name, email, URL, or SharePoint path.
 * Inactive / disabled accounts are represented only as LookupResult failures
 * on the principal input (no AccountStatus vocabulary).
 */
export const composeAuthorizationContext = (input: {
  principal: LookupResult<AuthorizationPrincipal>;
  memberships: LookupResult<readonly SiteMembership[]>;
  selectedSiteId: string | null;
}): LookupResult<AuthorizationContext> => {
  if (input.principal.status !== "FOUND") {
    return propagateLookupFailure(input.principal);
  }
  if (input.memberships.status !== "FOUND") {
    return propagateLookupFailure(input.memberships);
  }

  const principalRaw: unknown = input.principal.value;
  if (!isRecord(principalRaw)) return { status: "UNKNOWN", reason: "INDETERMINATE" };
  if (!isNonEmptyString(principalRaw.Subject)) return { status: "EMPTY" };
  if (!isNonEmptyString(principalRaw.UserId) || !isNonEmptyString(principalRaw.OrganizationId)) {
    return { status: "UNKNOWN", reason: "INDETERMINATE" };
  }

  const membershipsRaw: unknown = input.memberships.value;
  if (!Array.isArray(membershipsRaw)) {
    return { status: "UNKNOWN", reason: "INDETERMINATE" };
  }
  if (!membershipsRaw.every(isMembershipShape)) {
    return { status: "UNKNOWN", reason: "INDETERMINATE" };
  }

  if (input.selectedSiteId !== null && typeof input.selectedSiteId !== "string") {
    return { status: "UNKNOWN", reason: "INDETERMINATE" };
  }

  // Explicit selection only — never Memberships[0] / array-order inference.
  const selectedSiteId = input.selectedSiteId;

  return {
    status: "FOUND",
    value: {
      Subject: principalRaw.Subject,
      UserId: principalRaw.UserId,
      OrganizationId: principalRaw.OrganizationId,
      SiteContext: {
        Memberships: membershipsRaw.map((item) => ({
          SiteId: item.SiteId,
          Roles: [...item.Roles],
        })),
        SelectedSiteId: selectedSiteId,
      },
    },
  };
};

/**
 * #21-B orchestration helper.
 * Composes AuthorizationContext, then reuses evaluateAuthorizationAccess
 * without re-implementing access decision rules.
 */
export const evaluateResolvedAuthorizationAccess = (input: {
  principal: LookupResult<AuthorizationPrincipal>;
  memberships: LookupResult<readonly SiteMembership[]>;
  selectedSiteId: string | null;
  requiredRoles: readonly Role[];
  context?: DeploymentContext;
}): AccessDecision => {
  const authorization = composeAuthorizationContext({
    principal: input.principal,
    memberships: input.memberships,
    selectedSiteId: input.selectedSiteId,
  });
  return evaluateAuthorizationAccess({
    authorization,
    requiredRoles: input.requiredRoles,
    context: input.context,
  });
};
