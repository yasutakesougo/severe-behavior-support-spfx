import type { SiteMembershipProvider } from "./ports";
import type { AuthorizationPrincipal, LookupResult, SiteMembership } from "./types";

export type InMemorySiteMembershipRecord = Readonly<{
  principalKey: string;
  memberships: LookupResult<readonly SiteMembership[]>;
}>;

const principalKeyOf = (principal: AuthorizationPrincipal): string =>
  `${principal.OrganizationId}\u0000${principal.UserId}\u0000${principal.Subject}`;

/**
 * Synthetic in-memory SiteMembershipProvider double for #21-B.
 * No Graph / Entra / SharePoint I/O.
 */
export class InMemorySiteMembershipProvider implements SiteMembershipProvider {
  private readonly records: ReadonlyMap<string, LookupResult<readonly SiteMembership[]>>;

  constructor(records: readonly InMemorySiteMembershipRecord[]) {
    const map = new Map<string, LookupResult<readonly SiteMembership[]>>();
    for (const record of records) {
      map.set(record.principalKey, record.memberships);
    }
    this.records = map;
  }

  static keyFor(principal: AuthorizationPrincipal): string {
    return principalKeyOf(principal);
  }

  async resolveMemberships(
    principal: AuthorizationPrincipal,
  ): Promise<LookupResult<readonly SiteMembership[]>> {
    const found = this.records.get(principalKeyOf(principal));
    if (found === undefined) return { status: "EMPTY" };
    return found;
  }
}
