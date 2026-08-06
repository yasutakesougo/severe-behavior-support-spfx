import {
  isRecord,
  isValidIsoDateTime,
  isReasonCode,
  isNonEmptyString,
} from "./validation";

/**
 * SupportPlan status canonical enum and runtime array
 */
export const SUPPORT_PLAN_STATUSES = [
  "Draft",
  "PendingReview",
  "Returned",
  "Active",
  "Closed",
] as const;

export type SupportPlanStatus = (typeof SUPPORT_PLAN_STATUSES)[number];

/**
 * Schema identity for SupportPlan contract (DEC-1 Accepted, Issue #42).
 * Not identical to SharePoint list/column names, TypeScript type names, or repo names.
 */
export const SUPPORT_PLAN_SCHEMA_ID =
  "severe-behavior-support.support-plan.plan" as const;
export const SUPPORT_PLAN_SCHEMA_VERSION = "1.0.0" as const;

/**
 * Schema identity for SupportPlanVersion contract (DEC-1 Accepted, Issue #42).
 */
export const SUPPORT_PLAN_VERSION_SCHEMA_ID =
  "severe-behavior-support.support-plan.plan-version" as const;
export const SUPPORT_PLAN_VERSION_SCHEMA_VERSION = "1.0.0" as const;

/**
 * Base Identity & Immutable Header fields for SupportPlan.
 * Plan identity field is `PlanId` (PascalCase). SupportPlanVersion uses `planId`.
 * Unification is deferred to a future MAJOR candidate (Issue #42).
 */
export type SupportPlanBase = Readonly<{
  PlanId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  currentVersion: number;
  createdBy: string;
  createdAt: string;
  version: number;
  reviewDueDate?: string;
}>;

/**
 * Audit trail sub-types for strict all-or-nothing group invariants
 */
type SubmissionHistory = Readonly<{
  submittedBy: string;
  submittedAt: string;
}>;

type ReturnHistory = Readonly<{
  returnedBy: string;
  returnedAt: string;
  returnReasonCode: string;
  returnReasonText?: string;
}>;

type ApprovalHistory = Readonly<{
  approvedBy: string;
  approvedAt: string;
  effectiveFrom: string;
}>;

type CloseHistory = Readonly<{
  effectiveTo: string;
  closedBy: string;
  closedAt: string;
  closeReasonCode: string;
  closeReasonText?: string;
}>;

/**
 * Discriminated union for SupportPlan states with state-specific required metadata
 */
export type SupportPlanState =
  | (SupportPlanBase &
      Readonly<{
        status: "Draft";
        submittedBy?: never;
        submittedAt?: never;
        returnedBy?: never;
        returnedAt?: never;
        returnReasonCode?: never;
        returnReasonText?: never;
        approvedBy?: never;
        approvedAt?: never;
        effectiveFrom?: never;
        effectiveTo?: never;
        closedBy?: never;
        closedAt?: never;
        closeReasonCode?: never;
        closeReasonText?: never;
      }>)
  | (SupportPlanBase &
      SubmissionHistory &
      Readonly<{
        status: "PendingReview";
        returnedBy?: never;
        returnedAt?: never;
        returnReasonCode?: never;
        returnReasonText?: never;
        approvedBy?: never;
        approvedAt?: never;
        effectiveFrom?: never;
        effectiveTo?: never;
        closedBy?: never;
        closedAt?: never;
        closeReasonCode?: never;
        closeReasonText?: never;
      }>)
  | (SupportPlanBase &
      SubmissionHistory &
      ReturnHistory &
      Readonly<{
        status: "Returned";
        approvedBy?: never;
        approvedAt?: never;
        effectiveFrom?: never;
        effectiveTo?: never;
        closedBy?: never;
        closedAt?: never;
        closeReasonCode?: never;
        closeReasonText?: never;
      }>)
  | (SupportPlanBase &
      SubmissionHistory &
      (
        | Readonly<{
            returnedBy?: never;
            returnedAt?: never;
            returnReasonCode?: never;
            returnReasonText?: never;
          }>
        | ReturnHistory
      ) &
      ApprovalHistory &
      Readonly<{
        status: "Active";
        effectiveTo?: string;
        closedBy?: never;
        closedAt?: never;
        closeReasonCode?: never;
        closeReasonText?: never;
      }>)
  | (SupportPlanBase &
      SubmissionHistory &
      ApprovalHistory &
      (
        | Readonly<{
            returnedBy?: never;
            returnedAt?: never;
            returnReasonCode?: never;
            returnReasonText?: never;
          }>
        | ReturnHistory
      ) &
      CloseHistory &
      Readonly<{
        status: "Closed";
      }>);

/**
 * SupportPlan Record Contract
 */
export type SupportPlan = SupportPlanState;

/**
 * SupportPlanVersion Content Contract.
 * Plan identity field is `planId` (camelCase), distinct from SupportPlan.`PlanId`.
 */
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

/**
 * DTO envelope for SupportPlan.
 * dtoVersion equals schemaVersion (DEC-1).
 */
export type SupportPlanDto = Readonly<{
  schemaId: typeof SUPPORT_PLAN_SCHEMA_ID;
  schemaVersion: typeof SUPPORT_PLAN_SCHEMA_VERSION;
  dtoVersion: typeof SUPPORT_PLAN_SCHEMA_VERSION;
  data: SupportPlan;
}>;

/**
 * DTO envelope for SupportPlanVersion.
 * dtoVersion equals schemaVersion (DEC-1).
 */
export type SupportPlanVersionDto = Readonly<{
  schemaId: typeof SUPPORT_PLAN_VERSION_SCHEMA_ID;
  schemaVersion: typeof SUPPORT_PLAN_VERSION_SCHEMA_VERSION;
  dtoVersion: typeof SUPPORT_PLAN_VERSION_SCHEMA_VERSION;
  data: SupportPlanVersion;
}>;

export const toSupportPlanDto = (data: SupportPlan): SupportPlanDto => ({
  schemaId: SUPPORT_PLAN_SCHEMA_ID,
  schemaVersion: SUPPORT_PLAN_SCHEMA_VERSION,
  dtoVersion: SUPPORT_PLAN_SCHEMA_VERSION,
  data,
});

export const toSupportPlanVersionDto = (
  data: SupportPlanVersion,
): SupportPlanVersionDto => ({
  schemaId: SUPPORT_PLAN_VERSION_SCHEMA_ID,
  schemaVersion: SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
  dtoVersion: SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
  data,
});

// ==========================================
// Runtime Validators
// ==========================================

export function validateSupportPlan(value: unknown): value is SupportPlan {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.PlanId !== "string" ||
    value.PlanId.trim() === "" ||
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.currentVersion !== "number" ||
    !Number.isInteger(value.currentVersion) ||
    value.currentVersion < 1 ||
    typeof value.createdBy !== "string" ||
    value.createdBy.trim() === "" ||
    !isValidIsoDateTime(value.createdAt) ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    return false;
  }

  if (value.reviewDueDate !== undefined && !isValidIsoDateTime(value.reviewDueDate)) {
    return false;
  }

  const status = value.status;
  if (!SUPPORT_PLAN_STATUSES.includes(status as SupportPlanStatus)) {
    return false;
  }


  // Submission history group invariant (all or nothing)
  const hasSubBy = value.submittedBy !== undefined;
  const hasSubAt = value.submittedAt !== undefined;
  if (hasSubBy !== hasSubAt) {
    return false;
  }
  if (hasSubBy) {
    if (!isNonEmptyString(value.submittedBy) || !isValidIsoDateTime(value.submittedAt)) {
      return false;
    }
  }

  // Return history group invariant (all or nothing for returnedBy, returnedAt, returnReasonCode)
  const hasRetBy = value.returnedBy !== undefined;
  const hasRetAt = value.returnedAt !== undefined;
  const hasRetCode = value.returnReasonCode !== undefined;
  const hasRetText = value.returnReasonText !== undefined;

  if (hasRetText && !(hasRetBy && hasRetAt && hasRetCode)) {
    return false;
  }
  if (hasRetBy || hasRetAt || hasRetCode) {
    if (!(hasRetBy && hasRetAt && hasRetCode)) {
      return false;
    }
    if (
      !isNonEmptyString(value.returnedBy) ||
      !isValidIsoDateTime(value.returnedAt) ||
      !isReasonCode(value.returnReasonCode)
    ) {
      return false;
    }
    if (hasRetText && !isNonEmptyString(value.returnReasonText)) {
      return false;
    }
  }

  // State-specific invariant enforcement
  if (status === "Draft") {
    if (
      hasSubBy ||
      hasRetBy ||
      value.approvedBy !== undefined ||
      value.approvedAt !== undefined ||
      value.effectiveFrom !== undefined ||
      value.effectiveTo !== undefined ||
      value.closedBy !== undefined ||
      value.closedAt !== undefined ||
      value.closeReasonCode !== undefined ||
      value.closeReasonText !== undefined
    ) {
      return false;
    }
  } else if (status === "PendingReview") {
    if (!hasSubBy) {
      return false;
    }
    if (
      hasRetBy ||
      value.approvedBy !== undefined ||
      value.approvedAt !== undefined ||
      value.effectiveFrom !== undefined ||
      value.effectiveTo !== undefined ||
      value.closedBy !== undefined ||
      value.closedAt !== undefined ||
      value.closeReasonCode !== undefined ||
      value.closeReasonText !== undefined
    ) {
      return false;
    }
  } else if (status === "Returned") {
    if (!hasSubBy || !hasRetBy) {
      return false;
    }
    if (
      value.approvedBy !== undefined ||
      value.approvedAt !== undefined ||
      value.effectiveFrom !== undefined ||
      value.effectiveTo !== undefined ||
      value.closedBy !== undefined ||
      value.closedAt !== undefined ||
      value.closeReasonCode !== undefined ||
      value.closeReasonText !== undefined
    ) {
      return false;
    }
  } else if (status === "Active") {
    if (!hasSubBy) {
      return false;
    }
    if (
      !isNonEmptyString(value.approvedBy) ||
      !isValidIsoDateTime(value.approvedAt) ||
      !isValidIsoDateTime(value.effectiveFrom)
    ) {
      return false;
    }
    if (value.effectiveTo !== undefined && !isValidIsoDateTime(value.effectiveTo)) {
      return false;
    }
    if (
      value.effectiveTo !== undefined &&
      new Date(value.effectiveTo as string).getTime() < new Date(value.effectiveFrom as string).getTime()
    ) {
      return false;
    }
    if (
      value.closedBy !== undefined ||
      value.closedAt !== undefined ||
      value.closeReasonCode !== undefined ||
      value.closeReasonText !== undefined
    ) {
      return false;
    }
  } else if (status === "Closed") {
    if (!hasSubBy) {
      return false;
    }
    if (
      !isNonEmptyString(value.approvedBy) ||
      !isValidIsoDateTime(value.approvedAt) ||
      !isValidIsoDateTime(value.effectiveFrom) ||
      !isValidIsoDateTime(value.effectiveTo) ||
      !isNonEmptyString(value.closedBy) ||
      !isValidIsoDateTime(value.closedAt) ||
      !isReasonCode(value.closeReasonCode)
    ) {
      return false;
    }
    if (value.closeReasonText !== undefined && !isNonEmptyString(value.closeReasonText)) {
      return false;
    }
    if (new Date(value.effectiveTo as string).getTime() < new Date(value.effectiveFrom as string).getTime()) {
      return false;
    }
  }

  return true;
}

export function validateSupportPlanVersion(value: unknown): value is SupportPlanVersion {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.planId !== "string" ||
    value.planId.trim() === "" ||
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1 ||
    !Array.isArray(value.goals) ||
    !Array.isArray(value.supportMethods) ||
    !Array.isArray(value.precautions) ||
    !Array.isArray(value.reviewCriteria) ||
    typeof value.versionCreatedBy !== "string" ||
    value.versionCreatedBy.trim() === "" ||
    !isValidIsoDateTime(value.versionCreatedAt)
  ) {
    return false;
  }

  const isStringArray = (arr: unknown[]) =>
    arr.every((item) => typeof item === "string" && item.trim() !== "");

  if (
    !isStringArray(value.goals) ||
    !isStringArray(value.supportMethods) ||
    !isStringArray(value.precautions) ||
    !isStringArray(value.reviewCriteria)
  ) {
    return false;
  }

  return true;
}

/**
 * Validates SupportPlan DTO envelope: schemaId/version/dtoVersion must match
 * the canonical constants, and data must satisfy SupportPlan invariants.
 */
export function validateSupportPlanDto(value: unknown): value is SupportPlanDto {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaId !== SUPPORT_PLAN_SCHEMA_ID ||
    value.schemaVersion !== SUPPORT_PLAN_SCHEMA_VERSION ||
    value.dtoVersion !== SUPPORT_PLAN_SCHEMA_VERSION
  ) {
    return false;
  }

  return validateSupportPlan(value.data);
}

/**
 * Validates SupportPlanVersion DTO envelope against canonical schema constants.
 */
export function validateSupportPlanVersionDto(
  value: unknown,
): value is SupportPlanVersionDto {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.schemaId !== SUPPORT_PLAN_VERSION_SCHEMA_ID ||
    value.schemaVersion !== SUPPORT_PLAN_VERSION_SCHEMA_VERSION ||
    value.dtoVersion !== SUPPORT_PLAN_VERSION_SCHEMA_VERSION
  ) {
    return false;
  }

  return validateSupportPlanVersion(value.data);
}
