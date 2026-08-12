import type {
  ApprovedProcedureReference,
  AccessDecision,
  AuthenticatedIdentity,
  AuthorizationContext,
  DeploymentContext,
  ExecutionRecord,
  LookupResult,
  Role,
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
