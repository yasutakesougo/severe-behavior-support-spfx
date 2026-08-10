import { isRecord, isValidIsoDateTime, isReasonCode, isNonEmptyString } from "./validation";

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
export const SUPPORT_PLAN_SCHEMA_ID = "severe-behavior-support.support-plan.plan" as const;
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

export const toSupportPlanVersionDto = (data: SupportPlanVersion): SupportPlanVersionDto => ({
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
      new Date(value.effectiveTo as string).getTime() <
        new Date(value.effectiveFrom as string).getTime()
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
    if (
      new Date(value.effectiveTo as string).getTime() <
      new Date(value.effectiveFrom as string).getTime()
    ) {
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
export function validateSupportPlanVersionDto(value: unknown): value is SupportPlanVersionDto {
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

// ==========================================
// Status Transition (Issue #24 / PR-I)
// Technical contract: docs/architecture/support-plan-status-transition.md
// Decision: Accepted comment 5211039927
// ==========================================

/**
 * Allowed SupportPlanStatus edges for status transition (Issue #24 / PR-I).
 * Technical contract: docs/architecture/support-plan-status-transition.md
 */
export const SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS = [
  ["Draft", "PendingReview"],
  ["PendingReview", "Returned"],
  ["Returned", "Draft"],
  ["PendingReview", "Active"],
  ["Active", "Closed"],
] as const satisfies ReadonlyArray<readonly [SupportPlanStatus, SupportPlanStatus]>;

export type SupportPlanStatusTransitionResult =
  | Readonly<{
      ok: true;
      status: SupportPlanStatus;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION";
    }>;

export function isSupportPlanStatus(value: unknown): value is SupportPlanStatus {
  return typeof value === "string" && SUPPORT_PLAN_STATUSES.includes(value as SupportPlanStatus);
}

/**
 * Transition SupportPlanStatus along the approved graph only.
 * Fail-closed: no exceptions. Roles / persistence / uniqueness are out of scope.
 */
export function transitionSupportPlanStatus(
  currentStatus: unknown,
  targetStatus: unknown,
): SupportPlanStatusTransitionResult {
  if (!isSupportPlanStatus(currentStatus) || !isSupportPlanStatus(targetStatus)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const allowed = SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS.some(
    ([from, to]) => from === currentStatus && to === targetStatus,
  );

  if (!allowed) {
    return { ok: false, code: "INVALID_TRANSITION" };
  }

  return { ok: true, status: targetStatus };
}

// ==========================================
// Active plan uniqueness (Issue #24)
// Technical contract: docs/architecture/active-plan-uniqueness.md
// Decision: Accepted comment 5212085136
// ==========================================

export type ActivePlanUniquenessResult = "UNIQUE" | "CONFLICT" | "MALFORMED_INPUT";

type ActiveDayInterval = Readonly<{
  fromDay: string;
  toDay: string | null;
}>;

type UniquenessGroupKey = string;

const TOKYO_TIME_ZONE = "Asia/Tokyo";

/**
 * Convert an Issue #26 ISO DateTime bound to an Asia/Tokyo calendar day (YYYY-MM-DD).
 * Returns null when the value is not a usable DateTime.
 */
export function toAsiaTokyoCalendarDay(isoDateTime: unknown): string | null {
  if (!isValidIsoDateTime(isoDateTime)) {
    return null;
  }

  const instant = new Date(isoDateTime);
  if (Number.isNaN(instant.getTime())) {
    return null;
  }

  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);

  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : null;
}

function uniquenessGroupKey(
  organizationId: string,
  siteId: string,
  userId: string,
): UniquenessGroupKey {
  return `${organizationId}\u0000${siteId}\u0000${userId}`;
}

function closedCalendarIntervalsOverlap(
  left: ActiveDayInterval,
  right: ActiveDayInterval,
): boolean {
  const leftEndsOnOrAfterRightStart = left.toDay === null || left.toDay >= right.fromDay;
  const rightEndsOnOrAfterLeftStart = right.toDay === null || right.toDay >= left.fromDay;
  return leftEndsOnOrAfterRightStart && rightEndsOnOrAfterLeftStart;
}

function groupHasActiveConflict(intervals: readonly ActiveDayInterval[]): boolean {
  for (let i = 0; i < intervals.length; i += 1) {
    for (let j = i + 1; j < intervals.length; j += 1) {
      if (closedCalendarIntervalsOverlap(intervals[i], intervals[j])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Evaluate Active plan uniqueness for a SupportPlan collection.
 *
 * - Groups by OrganizationId + SiteId + UserId
 * - Active-only calendar-day closed intervals in Asia/Tokyo
 * - Aggregates as MALFORMED_INPUT > CONFLICT > UNIQUE
 *
 * Persistence, authorization, status transition, observation windows,
 * review due dates, and RuleSetVersion selection are out of scope.
 */
export function evaluateActivePlanUniqueness(
  plans: readonly SupportPlan[],
): ActivePlanUniquenessResult {
  return evaluateActivePlanUniquenessUnknown(plans);
}

/**
 * Runtime fail-closed entry for unknown array payloads used by contract tests.
 */
export function evaluateActivePlanUniquenessUnknown(plans: unknown): ActivePlanUniquenessResult {
  if (!Array.isArray(plans)) {
    return "MALFORMED_INPUT";
  }

  const activeByGroup = new Map<UniquenessGroupKey, ActiveDayInterval[]>();

  for (const plan of plans) {
    if (!isRecord(plan)) {
      return "MALFORMED_INPUT";
    }

    if (
      !isNonEmptyString(plan.PlanId) ||
      !isNonEmptyString(plan.OrganizationId) ||
      !isNonEmptyString(plan.SiteId) ||
      !isNonEmptyString(plan.UserId)
    ) {
      return "MALFORMED_INPUT";
    }

    if (!isSupportPlanStatus(plan.status)) {
      return "MALFORMED_INPUT";
    }

    if (plan.status !== "Active") {
      continue;
    }

    const fromDay = toAsiaTokyoCalendarDay(plan.effectiveFrom);
    if (fromDay === null) {
      return "MALFORMED_INPUT";
    }

    let toDay: string | null = null;
    if (plan.effectiveTo !== undefined) {
      toDay = toAsiaTokyoCalendarDay(plan.effectiveTo);
      if (toDay === null) {
        return "MALFORMED_INPUT";
      }
      if (fromDay > toDay) {
        return "MALFORMED_INPUT";
      }
    }

    const key = uniquenessGroupKey(plan.OrganizationId, plan.SiteId, plan.UserId);
    const intervals = activeByGroup.get(key);
    const next: ActiveDayInterval = { fromDay, toDay };
    if (intervals) {
      intervals.push(next);
    } else {
      activeByGroup.set(key, [next]);
    }
  }

  for (const intervals of activeByGroup.values()) {
    if (groupHasActiveConflict(intervals)) {
      return "CONFLICT";
    }
  }

  return "UNIQUE";
}

// ==========================================
// Observation period logical schema (Decision-OP-3)
// Technical contract: docs/architecture/observation-period-schema-contract.md
// Decision-OP-3: Accepted / LOCKED / Option A
// ==========================================

export type SupportPlanObservationPeriodLogical = Readonly<{
  observationPeriodFrom: string;
  observationPeriodTo: string;
}>;

export type ValidateSupportPlanObservationPeriodLogicalResult =
  | Readonly<{
      ok: true;
      observationPeriod: SupportPlanObservationPeriodLogical;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const SUPPORT_PLAN_OBSERVATION_PERIOD_LOGICAL_KEYS = new Set([
  "observationPeriodFrom",
  "observationPeriodTo",
]);

/**
 * Validate SupportPlan observation period logical fields (Decision-OP-3 Option A).
 *
 * - observationPeriodFrom / observationPeriodTo are REQUIRED
 * - Both must be valid ISO DateTime strings
 * - Open-ended observationPeriodTo is NOT ADOPTED
 * - Fail-closed on malformed or incomplete input
 *
 * validateSupportPlan wiring, SharePoint columns, and membership semantics are out of scope.
 */
export function validateSupportPlanObservationPeriodLogical(
  input: unknown,
): ValidateSupportPlanObservationPeriodLogicalResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => SUPPORT_PLAN_OBSERVATION_PERIOD_LOGICAL_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    !("observationPeriodFrom" in input) ||
    !("observationPeriodTo" in input) ||
    !isValidIsoDateTime(input.observationPeriodFrom) ||
    !isValidIsoDateTime(input.observationPeriodTo)
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    observationPeriod: {
      observationPeriodFrom: input.observationPeriodFrom,
      observationPeriodTo: input.observationPeriodTo,
    },
  };
}

/**
 * Expose validated logical fields as membership function inputs.
 * Does not change evaluateObservationPeriodMembership semantics.
 */
export function toObservationPeriodMembershipInputs(
  observationPeriod: SupportPlanObservationPeriodLogical,
): Readonly<{ periodFrom: string; periodTo: string }> {
  return {
    periodFrom: observationPeriod.observationPeriodFrom,
    periodTo: observationPeriod.observationPeriodTo,
  };
}

// ==========================================
// Observation period membership (Issue #24)
// Technical contract: docs/architecture/observation-period.md
// Decision-OP-1: Accepted comment 5212897564
// Decision-OP-2: Accepted comment 5212898450
// ==========================================

export type ObservationPeriodMembershipResult = "IN_PERIOD" | "OUTSIDE_PERIOD" | "MALFORMED_INPUT";

/**
 * Evaluate whether caller-supplied `asOf` falls inside the observation period.
 *
 * - Inputs are ISO DateTime bounds converted via shared Asia/Tokyo calendar days
 * - Closed interval [fromDay, toDay]; `periodTo` is required
 * - Fail-closed: invalid bounds → MALFORMED_INPUT
 *
 * SupportPlan field adds, institutional day counts, Observation persistence,
 * review due dates, and RuleSetVersion selection are out of scope.
 */
export function evaluateObservationPeriodMembership(
  periodFrom: unknown,
  periodTo: unknown,
  asOf: unknown,
): ObservationPeriodMembershipResult {
  const fromDay = toAsiaTokyoCalendarDay(periodFrom);
  const toDay = toAsiaTokyoCalendarDay(periodTo);
  const asOfDay = toAsiaTokyoCalendarDay(asOf);

  if (fromDay === null || toDay === null || asOfDay === null) {
    return "MALFORMED_INPUT";
  }

  if (fromDay > toDay) {
    return "MALFORMED_INPUT";
  }

  if (fromDay <= asOfDay && asOfDay <= toDay) {
    return "IN_PERIOD";
  }

  return "OUTSIDE_PERIOD";
}

// ==========================================
// Review due relative to asOf (Issue #24)
// Technical contract: docs/architecture/review-due.md
// Decision-RD-1: Accepted comment 5213210051
// Decision-RD-2: Accepted comment 5213213260
// ==========================================

export type ReviewDueRelativeResult = "BEFORE_DUE" | "DUE" | "OVERDUE" | "MALFORMED_INPUT";

/**
 * Evaluate caller-supplied reviewDueDate relative to asOf on Asia/Tokyo calendar days.
 *
 * - BEFORE_DUE: asOfDay < dueDay
 * - DUE: asOfDay === dueDay
 * - OVERDUE: asOfDay > dueDay
 * - Fail-closed: invalid inputs → MALFORMED_INPUT
 *
 * Due-date calculation, institutional approaching-day policy (Decision-RD-3),
 * RuleSetVersion selection, persistence, and UI are out of scope.
 */
export function evaluateReviewDueRelativeToAsOf(
  reviewDueDate: unknown,
  asOf: unknown,
): ReviewDueRelativeResult {
  const dueDay = toAsiaTokyoCalendarDay(reviewDueDate);
  const asOfDay = toAsiaTokyoCalendarDay(asOf);

  if (dueDay === null || asOfDay === null) {
    return "MALFORMED_INPUT";
  }

  if (asOfDay < dueDay) {
    return "BEFORE_DUE";
  }

  if (asOfDay === dueDay) {
    return "DUE";
  }

  return "OVERDUE";
}
