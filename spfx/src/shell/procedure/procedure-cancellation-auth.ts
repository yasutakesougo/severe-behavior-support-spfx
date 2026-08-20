/**
 * CANCEL-SLICE-D — named synthetic AuthorizationContext fixture.
 * FIELD_STAFF remains presentation context only.
 * Real Entra / live AuthorizationContextResolver expansion is OUT.
 */

import type { AuthorizationContext, LookupResult, Role } from "../../sbs-domain/cancellation-persist.bundle";

export const FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION = {
  id: "FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION",
  subject: "synthetic-cancellation-subject-001",
  userId: "synthetic-user-001",
  defaultRoles: ["SERVICE_MANAGER"] as const satisfies readonly Role[],
} as const;

export type BuildCancellationSyntheticAuthorizationInput = Readonly<{
  organizationId: string;
  siteId: string;
  roles?: readonly Role[];
  subject?: string;
  userId?: string;
}>;

/**
 * Builds LookupResult<AuthorizationContext> for Slice A semanticsInput.authorization.
 * Fail closed (returns undefined) when org/site inputs are missing/blank.
 */
export function buildFieldStaffCancellationSyntheticAuthorization(
  input: BuildCancellationSyntheticAuthorizationInput,
): LookupResult<AuthorizationContext> | undefined {
  const organizationId = input.organizationId.trim();
  const siteId = input.siteId.trim();
  if (organizationId.length === 0 || siteId.length === 0) {
    return undefined;
  }

  const roles = input.roles ?? FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION.defaultRoles;
  if (roles.length === 0) {
    return undefined;
  }

  return {
    status: "FOUND",
    value: {
      Subject: input.subject ?? FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION.subject,
      UserId: input.userId ?? FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION.userId,
      OrganizationId: organizationId,
      SiteContext: {
        Memberships: [{ SiteId: siteId, Roles: [...roles] }],
        SelectedSiteId: siteId,
      },
    },
  };
}
