import type {
  ApprovedProcedureReference,
  AccessDecision,
  AuthenticatedIdentity,
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

export interface ApprovedProcedureProvider {
  findApprovedProcedure(
    context: DeploymentContext,
    reference: Pick<ApprovedProcedureReference, "ProcedureId" | "ProcedureVersion">,
  ): Promise<LookupResult<ApprovedProcedureReference>>;
}

export interface ExecutionRecordProvider {
  findByIdempotencyKey(
    context: DeploymentContext,
    idempotencyKey: string,
  ): Promise<LookupResult<ExecutionRecord>>;
  save(record: ExecutionRecord): Promise<WriteResult>;
}
