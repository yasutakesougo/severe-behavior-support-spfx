import type {
  ApprovedProcedureReference,
  AuthenticatedIdentity,
  DeploymentContext,
  ExecutionRecord,
  LocalDate,
} from "../../src/contracts";

export const syntheticContext: DeploymentContext = {
  OrganizationId: "synthetic-organization-001",
  SiteId: "synthetic-site-001",
  TimeZone: "Asia/Tokyo",
};

export const syntheticIdentity: AuthenticatedIdentity = {
  Subject: "synthetic-subject-001",
  OrganizationId: syntheticContext.OrganizationId,
  SiteId: syntheticContext.SiteId,
  Roles: ["SUPPORTER"],
};

export const syntheticProcedure: ApprovedProcedureReference = {
  ProcedureId: "synthetic-procedure-001",
  ProcedureVersion: "synthetic-version-001",
  ApprovalState: "APPROVED",
};

export const syntheticRecord: ExecutionRecord = {
  OrganizationId: syntheticContext.OrganizationId,
  SiteId: syntheticContext.SiteId,
  TimeZone: "Asia/Tokyo",
  RecordId: "synthetic-record-001",
  IdempotencyKey: "synthetic-idempotency-001",
  Procedure: syntheticProcedure,
  LocalDate: "2099-01-01" as LocalDate,
  PayloadFingerprint: "synthetic-payload-fingerprint-001",
};
