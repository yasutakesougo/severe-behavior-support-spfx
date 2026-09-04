import type { ManagementHomeInput } from "./management-home-read-model";

const basePlan = {
  PlanId: "synthetic-plan-001",
  OrganizationId: "synthetic-org-001",
  SiteId: "SITE-ISG",
  UserId: "user-a",
  currentVersion: 3,
  createdBy: "synthetic-planning-pc",
  createdAt: "2026-07-01T09:00:00+09:00",
  version: 1,
  status: "Active" as const,
  submittedBy: "synthetic-planning-pc",
  submittedAt: "2026-07-01T09:00:00+09:00",
  approvedBy: "synthetic-planning-pc",
  approvedAt: "2026-07-01T09:00:00+09:00",
  effectiveFrom: "2026-07-01T09:00:00+09:00",
  reviewDueDate: "2026-09-23T23:59:59+09:00",
};

const monitoringRecords = [
  {
    RecordId: "mh-record-1",
    Procedure: {
      ProcedureId: "mh-procedure-1",
      ProcedureVersion: "1",
      ApprovalState: "APPROVED" as const,
    },
    result: "PERFORMED_AS_PLANNED" as const,
    performedAt: "2026-08-12T10:00:00+09:00",
    recordedAt: "2026-08-12T10:05:00+09:00",
    planId: basePlan.PlanId,
    planVersion: 3,
  },
  {
    RecordId: "mh-record-2",
    Procedure: {
      ProcedureId: "mh-procedure-1",
      ProcedureVersion: "1",
      ApprovalState: "APPROVED" as const,
    },
    result: "PERFORMED_WITH_ADAPTATION" as const,
    performedAt: "2026-08-20T10:00:00+09:00",
    recordedAt: "2026-08-20T10:04:00+09:00",
    planId: basePlan.PlanId,
    planVersion: 3,
  },
];

const monitoring = {
  OrganizationId: basePlan.OrganizationId,
  SiteId: basePlan.SiteId,
  UserId: basePlan.UserId,
  planId: basePlan.PlanId,
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  recordCount: monitoringRecords.length,
  records: monitoringRecords,
};

const reviewOutcome = {
  OutcomeId: "management-home-outcome-001",
  OrganizationId: basePlan.OrganizationId,
  SiteId: basePlan.SiteId,
  UserId: basePlan.UserId,
  planId: basePlan.PlanId,
  planVersion: 3,
  periodStart: monitoring.periodStart,
  periodEnd: monitoring.periodEnd,
  sourceRecordIds: monitoringRecords.map((record) => record.RecordId),
  decision: "CHANGE_REQUIRED" as const,
  reviewedAt: "2026-09-01T10:00:00+09:00",
  reviewedBy: "計画担当A",
};

const revisionIntent = {
  RevisionIntentId: "58bc31615858b42f419adb9cd50696acd69763af642a0dcb4fa9f2231a96d101",
  OrganizationId: basePlan.OrganizationId,
  SiteId: basePlan.SiteId,
  UserId: basePlan.UserId,
  planId: basePlan.PlanId,
  sourcePlanVersion: 3,
  sourceReviewOutcomeId: reviewOutcome.OutcomeId,
  createdAt: "2026-09-03T12:00:00+09:00",
  createdBy: "planning-pc-synthetic-staff",
  status: "CONSUMED" as const,
};

const draft = {
  RevisionIntentId: revisionIntent.RevisionIntentId,
  candidate: {
    planId: basePlan.PlanId,
    OrganizationId: basePlan.OrganizationId,
    SiteId: basePlan.SiteId,
    UserId: basePlan.UserId,
    version: 4,
    goals: ["安心できる活動の流れ"],
    supportMethods: ["写真カードで次の活動を示す"],
    precautions: ["急かさない"],
    reviewCriteria: ["見直し期限: 2026/12/23"],
    versionCreatedBy: "planning-pc-synthetic-staff",
    versionCreatedAt: "2026-09-03T12:00:00+09:00",
  },
  reviewBinding: {
    OrganizationId: basePlan.OrganizationId,
    SiteId: basePlan.SiteId,
    UserId: basePlan.UserId,
    planId: basePlan.PlanId,
    planVersion: 4,
    reviewedPlanVersion: 3,
    sourceOutcomeId: reviewOutcome.OutcomeId,
    boundAt: "2026-09-03T12:00:00+09:00",
    boundBy: "planning-pc-synthetic-staff",
  },
};

export const MANAGEMENT_HOME_RESOLVED_FIXTURE: ManagementHomeInput = {
  personLabel: "Aさん",
  plan: basePlan,
  monitoring: { status: "RESOLVED", value: monitoring },
  reviewOutcome: { status: "RESOLVED", value: reviewOutcome },
  decisionReason: {
    status: "RESOLVED",
    value: {
      OutcomeId: reviewOutcome.OutcomeId,
      reason: "活動切替前の予告方法を見直す必要がある",
    },
  },
  revisionIntent: { status: "RESOLVED", value: revisionIntent },
  draft: { status: "RESOLVED", value: draft },
  activationReceipt: { status: "RESOLVED", value: null },
  reviewDueLabel: { status: "RESOLVED", value: "2026/09/23" },
};

export const MANAGEMENT_HOME_CONFIRMED_NONE_FIXTURE: ManagementHomeInput = {
  ...MANAGEMENT_HOME_RESOLVED_FIXTURE,
  monitoring: {
    status: "RESOLVED",
    value: { ...monitoring, recordCount: 0, records: [] },
  },
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
      candidate: { ...draft.candidate, UserId: "user-mismatch" },
    },
  },
};
