import type {
  ApprovedProcedureReference,
  AccessDecision,
  AuthenticatedIdentity,
  AuthorizationContext,
  AuthorizationPrincipal,
  DeploymentContext,
  ExecutionRecord,
  LookupResult,
  Role,
  SiteMembership,
  WriteResult,
} from "./types";

export interface AuthenticationProvider {
  authenticate(context: DeploymentContext): Promise<LookupResult<AuthenticatedIdentity>>;
}

export interface RoleProvider {
  resolveRoles(context: DeploymentContext, subject: string): Promise<LookupResult<readonly Role[]>>;
}

export interface AccessPolicy {
  evaluate(input: {
    context: DeploymentContext;
    identity: LookupResult<AuthenticatedIdentity>;
    requiredRoles: readonly Role[];
  }): AccessDecision;
}

/** #21-A pure authorization port — no Graph / Entra / SharePoint I/O. */
export interface AuthorizationAccessPolicy {
  evaluate(input: {
    authorization: LookupResult<AuthorizationContext>;
    requiredRoles: readonly Role[];
    context?: DeploymentContext;
  }): AccessDecision;
}

/**
 * #21-B multi-site membership port.
 * Must not force-fit single-site AuthenticatedIdentity alone.
 * No Graph / Entra / SharePoint I/O in the port contract.
 */
export interface SiteMembershipProvider {
  resolveMemberships(
    principal: AuthorizationPrincipal,
  ): Promise<LookupResult<readonly SiteMembership[]>>;
}

/** #21-B pure composer port — provider results → AuthorizationContext. */
export interface AuthorizationContextResolver {
  resolve(input: {
    principal: LookupResult<AuthorizationPrincipal>;
    memberships: LookupResult<readonly SiteMembership[]>;
    selectedSiteId: string | null;
  }): LookupResult<AuthorizationContext>;
}

export interface ApprovedProcedureProvider {
  findApprovedProcedure(
    context: DeploymentContext,
    reference: Pick<ApprovedProcedureReference, "ProcedureId" | "ProcedureVersion">,
  ): Promise<LookupResult<ApprovedProcedureReference>>;
}

export interface ExecutionRecordProvider {
  findByRecordId(
    context: DeploymentContext,
    recordId: string,
  ): Promise<LookupResult<ExecutionRecord>>;
  findByIdempotencyKey(
    context: DeploymentContext,
    idempotencyKey: string,
  ): Promise<LookupResult<ExecutionRecord>>;
  save(record: ExecutionRecord): Promise<WriteResult>;
}
