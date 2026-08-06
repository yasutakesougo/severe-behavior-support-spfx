export const CONTRACT_VERSION = "contracts-v1" as const;
export const ASIA_TOKYO_TIME_ZONE = "Asia/Tokyo" as const;

export type LocalDate = string & { readonly __brand: "LocalDate" };

export type Role =
  | "SUPPORTER"
  | "PLANNER"
  | "SERVICE_MANAGER"
  | "SITE_ADMIN"
  | "ORG_ADMIN"
  | "SYSTEM_ADMIN"
  | "VIEWER";

export type DeploymentContext = Readonly<{
  OrganizationId: string;
  SiteId: string;
  TimeZone: typeof ASIA_TOKYO_TIME_ZONE;
}>;

export type AuthenticatedIdentity = Readonly<{
  Subject: string;
  OrganizationId: string;
  SiteId: string;
  Roles: readonly Role[];
}>;

export type ApprovedProcedureReference = Readonly<{
  ProcedureId: string;
  ProcedureVersion: string;
  ApprovalState: "APPROVED";
}>;

export type ExecutionRecord = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  TimeZone: typeof ASIA_TOKYO_TIME_ZONE;
  RecordId: string;
  IdempotencyKey: string;
  Procedure: ApprovedProcedureReference;
  LocalDate: LocalDate;
  PayloadFingerprint: string;
}>;

export type LookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "EMPTY" }>
  | Readonly<{ status: "UNKNOWN"; reason: "NOT_AUTHENTICATED" | "NOT_AUTHORIZED" | "INDETERMINATE" }>
  | Readonly<{ status: "FETCH_FAILED"; code: string }>;

export type ExecutionRecordLookupResults = Readonly<{
  byRecordId: LookupResult<ExecutionRecord>;
  byIdempotencyKey: LookupResult<ExecutionRecord>;
}>;

export type ValidationError = Readonly<{
  code:
    | "REQUIRED"
    | "TYPE"
    | "EMPTY"
    | "FORMAT"
    | "VALUE"
    | "APPROVAL_STATE";
  path: string;
}>;

export type ValidationResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; errors: readonly ValidationError[] }>;

export type AccessDecision =
  | Readonly<{ decision: "ALLOW"; reason: "ROLE_ALLOWED" }>
  | Readonly<{
      decision: "DENY";
      reason:
        | "INVALID_CONTEXT"
        | "AUTH_EMPTY"
        | "AUTH_UNKNOWN"
        | "AUTH_FETCH_FAILED"
        | "INVALID_IDENTITY"
        | "ORGANIZATION_MISMATCH"
        | "SITE_MISMATCH"
        | "NO_REQUIRED_ROLE"
        | "UNKNOWN_ROLE"
        | "ROLE_NOT_ALLOWED";
    }>;

export type SubmissionDecision =
  | Readonly<{ decision: "ACCEPT_NEW" }>
  | Readonly<{ decision: "DUPLICATE_REPLAY"; RecordId: string }>
  | Readonly<{ decision: "REJECT_INVALID_RECORD" }>
  | Readonly<{
      decision: "REJECT_DUPLICATE_CONFLICT";
      RecordId: string;
      reason:
        | "RECORD_ID_REUSED"
        | "IDEMPOTENCY_KEY_REUSED"
        | "PAYLOAD_MISMATCH"
        | "RECORD_CONTEXT_MISMATCH"
        | "LOOKUP_RESULTS_DIVERGED";
    }>
  | Readonly<{ decision: "REJECT_LOOKUP_UNAVAILABLE"; reason: "UNKNOWN" | "FETCH_FAILED" }>;

export type WriteResult =
  | Readonly<{ status: "CREATED"; RecordId: string }>
  | Readonly<{ status: "DUPLICATE_REPLAY"; RecordId: string }>
  | Readonly<{ status: "REJECTED"; reason: "CONFLICT" | "NOT_AUTHORIZED" | "UNKNOWN" | "FETCH_FAILED" }>;
