import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewDecisionReason } from "../../sbs-domain/monitoring-period-review-decision-reason.bundle";
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { ActiveSupportPlan } from "../../sbs-domain/support-plan-activation.bundle";
import type {
  RevisionIntent,
  SupportPlanRevisionDraftCandidate,
} from "../../sbs-domain/support-plan-revision.bundle";
import {
  buildManagementHomeReadModel,
  type ManagementHomeInput,
  type ManagementHomeSource,
} from "./management-home-read-model";

export const SBS_MGMT_HOME_C_SLICE = {
  id: "SBS-MGMT-HOME-C",
  presentationOnly: true as const,
  liveWriteAuthorized: false as const,
  productionBindingAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  newWorkflowAuthorized: false as const,
  aiRecommendationAuthorized: false as const,
} as const;

const resolved = <T>(value: T | null): ManagementHomeSource<T> => ({
  status: "RESOLVED",
  value,
});

const unavailable = <T>(reason: string): ManagementHomeSource<T> => ({
  status: "UNAVAILABLE",
  reason,
});

const CURRENT_PLAN: ActiveSupportPlan = {
  PlanId: "synthetic-plan-001",
  OrganizationId: "synthetic-org-001",
  SiteId: "SITE-ISG",
  UserId: "user-a",
  currentVersion: 3,
  createdBy: "synthetic-planning-pc",
  createdAt: "2026-07-01T09:00:00+09:00",
  version: 1,
  reviewDueDate: "2026-09-23T23:59:59+09:00",
  status: "Active",
  submittedBy: "synthetic-planning-pc",
  submittedAt: "2026-07-01T09:00:00+09:00",
  approvedBy: "synthetic-planning-pc",
  approvedAt: "2026-07-01T09:00:00+09:00",
  effectiveFrom: "2026-07-01T09:00:00+09:00",
};

const MONITORING: MonitoringReadModel = {
  OrganizationId: CURRENT_PLAN.OrganizationId,
  SiteId: CURRENT_PLAN.SiteId,
  UserId: CURRENT_PLAN.UserId,
  planId: CURRENT_PLAN.PlanId,
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  recordCount: 2,
  records: [
    {
      RecordId: "mh-record-1",
      Procedure: {
        ProcedureId: "mh-procedure-1",
        ProcedureVersion: "1",
        ApprovalState: "APPROVED",
      },
      result: "PERFORMED_AS_PLANNED",
      performedAt: "2026-08-12T10:00:00+09:00",
      recordedAt: "2026-08-12T10:05:00+09:00",
      planId: CURRENT_PLAN.PlanId,
      planVersion: 3,
    },
    {
      RecordId: "mh-record-2",
      Procedure: {
        ProcedureId: "mh-procedure-1",
        ProcedureVersion: "1",
        ApprovalState: "APPROVED",
      },
      result: "PERFORMED_WITH_ADAPTATION",
      performedAt: "2026-08-20T10:00:00+09:00",
      recordedAt: "2026-08-20T10:04:00+09:00",
      planId: CURRENT_PLAN.PlanId,
      planVersion: 3,
    },
  ],
};

const OUTCOME: MonitoringPeriodReviewOutcome = {
  OutcomeId: "management-home-outcome-001",
  OrganizationId: CURRENT_PLAN.OrganizationId,
  SiteId: CURRENT_PLAN.SiteId,
  UserId: CURRENT_PLAN.UserId,
  planId: CURRENT_PLAN.PlanId,
  planVersion: 3,
  periodStart: MONITORING.periodStart,
  periodEnd: MONITORING.periodEnd,
  sourceRecordIds: MONITORING.records.map((record) => record.RecordId),
  decision: "CHANGE_REQUIRED",
  reviewedAt: "2026-09-01T10:00:00+09:00",
  reviewedBy: "synthetic-reviewer",
};

const DECISION_REASON: MonitoringPeriodReviewDecisionReason = {
  OutcomeId: OUTCOME.OutcomeId,
  reason: "活動切替前の予告方法を見直す必要がある",
};

/**
 * Deterministic RevisionIntentId for the exact synthetic identity above.
 * Material follows support-plan.revision-intent-id.v1 with U+001F separators.
 */
const REVISION_INTENT_ID = "58bc31615858b42f419adb9cd50696acd69763af642a0dcb4fa9f2231a96d101";

const REVISION_INTENT: RevisionIntent = {
  RevisionIntentId: REVISION_INTENT_ID,
  OrganizationId: CURRENT_PLAN.OrganizationId,
  SiteId: CURRENT_PLAN.SiteId,
  UserId: CURRENT_PLAN.UserId,
  planId: CURRENT_PLAN.PlanId,
  sourcePlanVersion: 3,
  sourceReviewOutcomeId: OUTCOME.OutcomeId,
  createdAt: "2026-09-03T12:00:00+09:00",
  createdBy: "planning-pc-synthetic-staff",
  status: "CONSUMED",
};

const DRAFT: SupportPlanRevisionDraftCandidate = {
  RevisionIntentId: REVISION_INTENT_ID,
  candidate: {
    planId: CURRENT_PLAN.PlanId,
    OrganizationId: CURRENT_PLAN.OrganizationId,
    SiteId: CURRENT_PLAN.SiteId,
    UserId: CURRENT_PLAN.UserId,
    version: 4,
    goals: ["安心できる活動の流れ"],
    supportMethods: ["写真カードで次の活動を示す"],
    precautions: ["急かさない"],
    reviewCriteria: ["見直し期限: 2026/12/23"],
    versionCreatedBy: "planning-pc-synthetic-staff",
    versionCreatedAt: "2026-09-03T12:00:00+09:00",
  },
  reviewBinding: {
    OrganizationId: CURRENT_PLAN.OrganizationId,
    SiteId: CURRENT_PLAN.SiteId,
    UserId: CURRENT_PLAN.UserId,
    planId: CURRENT_PLAN.PlanId,
    planVersion: 4,
    reviewedPlanVersion: 3,
    sourceOutcomeId: OUTCOME.OutcomeId,
    boundAt: "2026-09-03T12:00:00+09:00",
    boundBy: "planning-pc-synthetic-staff",
  },
};

export const MANAGEMENT_HOME_FULLY_RESOLVED_INPUT: ManagementHomeInput = {
  personLabel: "Aさん",
  currentPlan: CURRENT_PLAN,
  monitoring: resolved(MONITORING),
  review: resolved({ outcome: OUTCOME, decisionReason: DECISION_REASON }),
  revisionIntent: resolved(REVISION_INTENT),
  draft: resolved(DRAFT),
  activationReceipt: resolved(null),
  reviewDue: resolved({ label: "2026/09/23" }),
};

export const MANAGEMENT_HOME_CONFIRMED_NONE_INPUT: ManagementHomeInput = {
  personLabel: "Aさん",
  currentPlan: CURRENT_PLAN,
  monitoring: resolved({ ...MONITORING, recordCount: 0, records: [] }),
  review: resolved(null),
  revisionIntent: resolved(null),
  draft: resolved(null),
  activationReceipt: resolved(null),
  reviewDue: resolved({ label: "2026/09/23" }),
};

export const MANAGEMENT_HOME_UNAVAILABLE_INPUT: ManagementHomeInput = {
  ...MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
  monitoring: unavailable("MONITORING_SOURCE_UNAVAILABLE"),
};

export const MANAGEMENT_HOME_MISMATCH_INPUT: ManagementHomeInput = {
  ...MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
  draft: resolved({
    ...DRAFT,
    candidate: {
      ...DRAFT.candidate,
      UserId: "user-mismatch",
    },
  }),
};

export const MANAGEMENT_HOME_FULLY_RESOLVED_MODEL = buildManagementHomeReadModel(
  MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
);
export const MANAGEMENT_HOME_CONFIRMED_NONE_MODEL = buildManagementHomeReadModel(
  MANAGEMENT_HOME_CONFIRMED_NONE_INPUT,
);
export const MANAGEMENT_HOME_UNAVAILABLE_MODEL = buildManagementHomeReadModel(
  MANAGEMENT_HOME_UNAVAILABLE_INPUT,
);
export const MANAGEMENT_HOME_MISMATCH_MODEL = buildManagementHomeReadModel(
  MANAGEMENT_HOME_MISMATCH_INPUT,
);
