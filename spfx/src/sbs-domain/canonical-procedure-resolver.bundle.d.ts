/**
 * Allowlist declaration surface for Canonical Procedure Resolver bundle (A2 / W2-A).
 * Generated and guarded against drift via scripts/ci/check-canonical-procedure-resolver-bridge.mjs.
 */

export declare const CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID: "severe-behavior-support.procedure.canonical-resolver";
export declare const CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION: "1.0.0";

/** 正本 contracts/types 由来 */
export type LocalDate = string & { readonly __brand: "LocalDate" };

export type ApprovedProcedureReference = Readonly<{
  ProcedureId: string;
  ProcedureVersion: string;
  ApprovalState: "APPROVED";
}>;

/** 正本 domain/kiosk-contract 由来 */
export type ScheduleItem = Readonly<{
  schemaVersion: "1.0.0";
  ScheduleItemId: string;
  OrganizationId: string;
  SiteId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  scheduledTime: string;
  activityLabel: string;
  catalogOrder: number;
}>;

export type ScheduledOccurrence = Readonly<{
  schemaVersion: "1.0.0";
  OccurrenceId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  LocalDate: LocalDate;
  TimeZone: "Asia/Tokyo";
  ScheduleItemId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
}>;

/** 正本 domain/support-plan 由来 */
export type SupportPlanVersion = Readonly<{
  planId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  version: number;
  goals: readonly string[];
  supportMethods: readonly string[];
  precautions: readonly string[];
  reviewCriteria: readonly string[];
  versionCreatedBy: string;
  versionCreatedAt: string;
}>;

/** 正本 domain/support-plan-version-procedure-binding 由来 */
export type SupportPlanVersionProcedureBinding = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  Procedure: ApprovedProcedureReference;
}>;

/** 正本 domain/canonical-procedure-resolver 由来 */
export type CanonicalProcedureProjection = Readonly<{
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
  noteLabel: string;
}>;

export type CanonicalProcedureResolutionQuery = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  scheduleItemId?: string;
  occurrenceId?: string;
}>;

export type CanonicalProcedureCatalogEntry = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  approvalState: "APPROVED";
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
  noteLabel: string;
  planPeriodLabel: string;
  scheduleItemId?: string;
}>;

export type CanonicalProcedureUnresolvedReasonCode =
  | "INPUT_INVALID"
  | "USER_OR_SITE_MISMATCH"
  | "PLAN_VERSION_MISMATCH"
  | "PROCEDURE_VERSION_MISMATCH"
  | "NOT_APPROVED"
  | "BINDING_PLAN_MISMATCH"
  | "SCHEDULE_OCCURRENCE_MISMATCH"
  | "AMBIGUOUS_DUPLICATE_ENTRY"
  | "AMBIGUOUS_PROCEDURE_MAPPING"
  | "CATALOG_ENTRY_NOT_FOUND";

export type CanonicalProcedureResolutionOutcome =
  | Readonly<{
      status: "RESOLVED";
      projection: CanonicalProcedureProjection;
      planPeriodLabel: string;
      canStartProcedureRecord: false;
      context: Readonly<{
        organizationId: string;
        siteId: string;
        userId: string;
        planId: string;
        planVersion: number;
        procedureId: string;
        procedureVersion: string;
        occurrenceId?: string;
        scheduleItemId?: string;
      }>;
    }>
  | Readonly<{
      status: "UNRESOLVED";
      reasonCode: CanonicalProcedureUnresolvedReasonCode;
      unresolvedReason: string;
      canStartProcedureRecord: false;
      context?: Readonly<{
        organizationId?: string;
        siteId?: string;
        userId?: string;
        planId?: string;
        planVersion?: number;
        procedureId?: string;
        procedureVersion?: string;
        occurrenceId?: string;
        scheduleItemId?: string;
      }>;
    }>;

export declare function validateCanonicalProcedureResolutionQuery(
  value: unknown,
): value is CanonicalProcedureResolutionQuery;

export declare function validateCanonicalProcedureCatalogEntry(
  value: unknown,
): value is CanonicalProcedureCatalogEntry;

export declare function buildCanonicalProcedureCatalogEntry(input: {
  planVersion: SupportPlanVersion;
  binding: SupportPlanVersionProcedureBinding;
  scheduleItem?: ScheduleItem;
  planPeriodLabel?: string;
  sceneLabel?: string;
  noteLabel?: string;
}): CanonicalProcedureCatalogEntry | undefined;

export declare function resolveCanonicalProcedure(
  query: CanonicalProcedureResolutionQuery,
  catalog: readonly CanonicalProcedureCatalogEntry[],
): CanonicalProcedureResolutionOutcome;

export declare function resolveCanonicalProcedureFromEntities(input: {
  query: CanonicalProcedureResolutionQuery;
  planVersions: readonly SupportPlanVersion[];
  bindings: readonly SupportPlanVersionProcedureBinding[];
  scheduleItems?: readonly ScheduleItem[];
  occurrences?: readonly ScheduledOccurrence[];
}): CanonicalProcedureResolutionOutcome;
