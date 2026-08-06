import type { SupportPlan, SupportPlanVersion } from "../../src/domain";

export const SYNTHETIC_PLAN_ORG_ID = "synthetic-org-001";
export const SYNTHETIC_PLAN_SITE_ID = "synthetic-site-001";
export const SYNTHETIC_PLAN_USER_ID = "synthetic-user-001";
export const SYNTHETIC_PLAN_ID = "synthetic-plan-001";

/**
 * PLAN-FX-001: 正常なDraft
 */
export function createSyntheticDraftPlan(
  overrides?: Partial<SupportPlan>
): SupportPlan {
  return {
    PlanId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    status: "Draft",
    currentVersion: 1,
    createdBy: "synthetic-staff-001",
    createdAt: "2026-08-06T10:00:00.000Z",
    version: 1,
    ...overrides,
  } as SupportPlan;
}

/**
 * PLAN-FX-002: 正常なPendingReview
 */
export function createSyntheticPendingReviewPlan(
  overrides?: Partial<SupportPlan>
): SupportPlan {
  return {
    PlanId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    status: "PendingReview",
    currentVersion: 1,
    createdBy: "synthetic-staff-001",
    createdAt: "2026-08-06T10:00:00.000Z",
    submittedBy: "synthetic-staff-001",
    submittedAt: "2026-08-06T11:00:00.000Z",
    version: 1,
    ...overrides,
  } as SupportPlan;
}

/**
 * PLAN-FX-003: 正常なReturned
 */
export function createSyntheticReturnedPlan(
  overrides?: Partial<SupportPlan>
): SupportPlan {
  return {
    PlanId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    status: "Returned",
    currentVersion: 1,
    createdBy: "synthetic-staff-001",
    createdAt: "2026-08-06T10:00:00.000Z",
    submittedBy: "synthetic-staff-001",
    submittedAt: "2026-08-06T11:00:00.000Z",
    returnedBy: "synthetic-manager-001",
    returnedAt: "2026-08-06T12:00:00.000Z",
    returnReasonCode: "SYNTHETIC_REASON_REVISE_GOALS",
    returnReasonText: "synthetic return text detail",
    version: 1,
    ...overrides,
  } as SupportPlan;
}

/**
 * PLAN-FX-004: 正常なActive
 */
export function createSyntheticActivePlan(
  overrides?: Partial<SupportPlan>
): SupportPlan {
  return {
    PlanId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    status: "Active",
    currentVersion: 1,
    createdBy: "synthetic-staff-001",
    createdAt: "2026-08-06T10:00:00.000Z",
    submittedBy: "synthetic-staff-001",
    submittedAt: "2026-08-06T11:00:00.000Z",
    approvedBy: "synthetic-manager-001",
    approvedAt: "2026-08-06T13:00:00.000Z",
    effectiveFrom: "2026-08-06T14:00:00.000Z",
    version: 1,
    ...overrides,
  } as SupportPlan;
}

/**
 * PLAN-FX-005: 正常なClosed
 */
export function createSyntheticClosedPlan(
  overrides?: Partial<SupportPlan>
): SupportPlan {
  return {
    PlanId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    status: "Closed",
    currentVersion: 1,
    createdBy: "synthetic-staff-001",
    createdAt: "2026-08-06T10:00:00.000Z",
    submittedBy: "synthetic-staff-001",
    submittedAt: "2026-08-06T11:00:00.000Z",
    approvedBy: "synthetic-manager-001",
    approvedAt: "2026-08-06T13:00:00.000Z",
    effectiveFrom: "2026-08-06T14:00:00.000Z",
    effectiveTo: "2026-09-06T14:00:00.000Z",
    closedBy: "synthetic-admin-001",
    closedAt: "2026-09-06T15:00:00.000Z",
    closeReasonCode: "SYNTHETIC_REASON_PLAN_EXPIRED",
    closeReasonText: "synthetic close text detail",
    version: 1,
    ...overrides,
  } as SupportPlan;
}

/**
 * PLAN-VERSION-FX-001: 正常なversion 1
 */
export function createSyntheticPlanVersion1(
  overrides?: Partial<SupportPlanVersion>
): SupportPlanVersion {
  return {
    planId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    version: 1,
    goals: ["synthetic goal 1", "synthetic goal 2"],
    supportMethods: ["synthetic method 1"],
    precautions: ["synthetic precaution 1"],
    reviewCriteria: ["synthetic review criterion 1"],
    versionCreatedBy: "synthetic-staff-001",
    versionCreatedAt: "2026-08-06T10:00:00.000Z",
    ...overrides,
  };
}

/**
 * PLAN-VERSION-FX-002: 同じplanIdのversion 2
 */
export function createSyntheticPlanVersion2(
  overrides?: Partial<SupportPlanVersion>
): SupportPlanVersion {
  return {
    planId: SYNTHETIC_PLAN_ID,
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    version: 2,
    goals: ["synthetic revised goal 1"],
    supportMethods: ["synthetic revised method 1"],
    precautions: ["synthetic revised precaution 1"],
    reviewCriteria: ["synthetic revised review criterion 1"],
    versionCreatedBy: "synthetic-staff-001",
    versionCreatedAt: "2026-08-07T10:00:00.000Z",
    ...overrides,
  };
}
