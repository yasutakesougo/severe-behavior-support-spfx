import type { ManagementHomeInput } from "./management-home-read-model";

const basePlan = {
  PlanId: "plan-a",
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  currentVersion: 4,
  createdBy: "synthetic-planner",
  createdAt: "2026-06-01T00:00:00.000Z",
  version: 7,
  status: "Active" as const,
  submittedBy: "synthetic-planner",
  submittedAt: "2026-06-01T01:00:00.000Z",
  approvedBy: "synthetic-approver",
  approvedAt: "2026-06-01T02:00:00.000Z",
  effectiveFrom: "2026-06-02T00:00:00.000Z",
  reviewDueDate: "2026-09-30T00:00:00.000Z",
};

const reviewOutcome = {
  OutcomeId: "outcome-a",
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  planId: "plan-a",
  planVersion: 4,
  periodStart: "2026-08-01T00:00:00.000Z",
  periodEnd: "2026-08-31T23:59:59.000Z",
  sourceRecordIds: ["record-1"],
  decision: "CHANGE_REQUIRED" as const,
  reviewedAt: "2026-09-01T01:00:00.000Z",
  reviewedBy: "synthetic-reviewer",
};

const revisionIntent = {
  RevisionIntentId: "intent-a",
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  planId: "plan-a",
  sourcePlanVersion: 4,
  sourceReviewOutcomeId: "outcome-a",
  createdAt: "2026-09-01T02:00:00.000Z",
  createdBy: "synthetic-planner",
  status: "CONSUMED" as const,
};

const draft = {
  RevisionIntentId: "intent-a",
  candidate: {
    planId: "plan-a",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-a",
    version: 5,
    goals: ["目標A"],
    supportMethods: ["支援方法A"],
    precautions: ["留意事項A"],
    reviewCriteria: ["確認基準A"],
    versionCreatedBy: "synthetic-planner",
    versionCreatedAt: "2026-09-01T03:00:00.000Z",
  },
  reviewBinding: {
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-a",
    planId: "plan-a",
    planVersion: 5,
    reviewedPlanVersion: 4,
    sourceOutcomeId: "outcome-a",
    boundAt: "2026-09-01T03:00:00.000Z",
    boundBy: "synthetic-planner",
  },
};

export const MANAGEMENT_HOME_RESOLVED_FIXTURE: ManagementHomeInput = {
  personLabel: "Aさん",
  plan: basePlan,
  monitoring: {
    status: "RESOLVED",
    value: {
      OrganizationId: "org-a",
      SiteId: "site-a",
      UserId: "user-a",
      planId: "plan-a",
      planVersion: 4,
      periodStart: "2026-08-01T00:00:00.000Z",
      periodEnd: "2026-08-31T23:59:59.000Z",
      recordCount: 1,
      records: [],
    },
  },
  reviewOutcome: { status: "RESOLVED", value: reviewOutcome },
  decisionReason: {
    status: "RESOLVED",
    value: { OutcomeId: "outcome-a", reason: "見直しで変更が必要と判断" },
  },
  revisionIntent: { status: "RESOLVED", value: revisionIntent },
  draft: { status: "RESOLVED", value: draft },
  activationReceipt: { status: "RESOLVED", value: null },
  reviewDueLabel: { status: "RESOLVED", value: "2026年9月" },
};

export const MANAGEMENT_HOME_CONFIRMED_NONE_FIXTURE: ManagementHomeInput = {
  ...MANAGEMENT_HOME_RESOLVED_FIXTURE,
  reviewOutcome: { status: "RESOLVED", value: null },
  decisionReason: { status: "RESOLVED", value: null },
  revisionIntent: { status: "RESOLVED", value: null },
  draft: { status: "RESOLVED", value: null },
};

export const MANAGEMENT_HOME_UNAVAILABLE_FIXTURE: ManagementHomeInput = {
  ...MANAGEMENT_HOME_RESOLVED_FIXTURE,
  monitoring: { status: "UNAVAILABLE", reason: "synthetic source unavailable" },
  reviewOutcome: { status: "UNAVAILABLE", reason: "synthetic source unavailable" },
  decisionReason: { status: "UNAVAILABLE", reason: "synthetic source unavailable" },
  revisionIntent: { status: "UNAVAILABLE", reason: "synthetic source unavailable" },
  draft: { status: "UNAVAILABLE", reason: "synthetic source unavailable" },
};

export const MANAGEMENT_HOME_MISMATCH_FIXTURE: ManagementHomeInput = {
  ...MANAGEMENT_HOME_RESOLVED_FIXTURE,
  draft: {
    status: "RESOLVED",
    value: {
      ...draft,
      candidate: { ...draft.candidate, UserId: "user-b" },
    },
  },
};
