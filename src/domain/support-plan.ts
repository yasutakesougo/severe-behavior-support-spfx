import { isRecord, isValidIsoDateTime, isReasonCode } from "./abc-observation";

/**
 * SupportPlan status canonical enum
 */
export type SupportPlanStatus =
  | "Draft"
  | "PendingReview"
  | "Returned"
  | "Active"
  | "Closed";

/**
 * Base Identity & Immutable Header fields for SupportPlan
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
      Readonly<{
        status: "PendingReview";
        submittedBy: string;
        submittedAt: string;
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
      Readonly<{
        status: "Returned";
        submittedBy: string;
        submittedAt: string;
        returnedBy: string;
        returnedAt: string;
        returnReasonCode: string;
        returnReasonText?: string;
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
      Readonly<{
        status: "Active";
        submittedBy?: string;
        submittedAt?: string;
        returnedBy?: string;
        returnedAt?: string;
        returnReasonCode?: string;
        returnReasonText?: string;
        approvedBy: string;
        approvedAt: string;
        effectiveFrom: string;
        effectiveTo?: string;
        closedBy?: never;
        closedAt?: never;
        closeReasonCode?: never;
        closeReasonText?: never;
      }>)
  | (SupportPlanBase &
      Readonly<{
        status: "Closed";
        submittedBy?: string;
        submittedAt?: string;
        returnedBy?: string;
        returnedAt?: string;
        returnReasonCode?: string;
        returnReasonText?: string;
        approvedBy: string;
        approvedAt: string;
        effectiveFrom: string;
        effectiveTo: string;
        closedBy: string;
        closedAt: string;
        closeReasonCode: string;
        closeReasonText?: string;
      }>);

/**
 * SupportPlan Record Contract
 */
export type SupportPlan = SupportPlanState;

/**
 * SupportPlanVersion Content Contract
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
  if (!["Draft", "PendingReview", "Returned", "Active", "Closed"].includes(status as string)) {
    return false;
  }

  // Validate optional audit trails if present
  if (value.submittedBy !== undefined && (typeof value.submittedBy !== "string" || value.submittedBy.trim() === "")) {
    return false;
  }
  if (value.submittedAt !== undefined && !isValidIsoDateTime(value.submittedAt)) {
    return false;
  }
  if (value.returnedBy !== undefined && (typeof value.returnedBy !== "string" || value.returnedBy.trim() === "")) {
    return false;
  }
  if (value.returnedAt !== undefined && !isValidIsoDateTime(value.returnedAt)) {
    return false;
  }
  if (value.returnReasonCode !== undefined && !isReasonCode(value.returnReasonCode)) {
    return false;
  }
  if (value.returnReasonText !== undefined && typeof value.returnReasonText !== "string") {
    return false;
  }

  // State-specific invariant enforcement
  if (status === "Draft") {
    if (
      value.submittedBy !== undefined ||
      value.submittedAt !== undefined ||
      value.returnedBy !== undefined ||
      value.returnedAt !== undefined ||
      value.returnReasonCode !== undefined ||
      value.returnReasonText !== undefined ||
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
    if (
      typeof value.submittedBy !== "string" ||
      value.submittedBy.trim() === "" ||
      !isValidIsoDateTime(value.submittedAt)
    ) {
      return false;
    }
    if (
      value.returnedBy !== undefined ||
      value.returnedAt !== undefined ||
      value.returnReasonCode !== undefined ||
      value.returnReasonText !== undefined ||
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
    if (
      typeof value.submittedBy !== "string" ||
      value.submittedBy.trim() === "" ||
      !isValidIsoDateTime(value.submittedAt) ||
      typeof value.returnedBy !== "string" ||
      value.returnedBy.trim() === "" ||
      !isValidIsoDateTime(value.returnedAt) ||
      !isReasonCode(value.returnReasonCode)
    ) {
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
    if (
      typeof value.approvedBy !== "string" ||
      value.approvedBy.trim() === "" ||
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
    if (
      typeof value.approvedBy !== "string" ||
      value.approvedBy.trim() === "" ||
      !isValidIsoDateTime(value.approvedAt) ||
      !isValidIsoDateTime(value.effectiveFrom) ||
      !isValidIsoDateTime(value.effectiveTo) ||
      typeof value.closedBy !== "string" ||
      value.closedBy.trim() === "" ||
      !isValidIsoDateTime(value.closedAt) ||
      !isReasonCode(value.closeReasonCode)
    ) {
      return false;
    }
    if (new Date(value.effectiveTo as string).getTime() < new Date(value.effectiveFrom as string).getTime()) {
      return false;
    }
    if (value.closeReasonText !== undefined && typeof value.closeReasonText !== "string") {
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
