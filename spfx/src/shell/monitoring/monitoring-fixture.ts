import {
  buildMonitoringReadModel,
  type MonitoringBuildResult,
  type MonitoringQuery,
  type ProcedureRecord,
} from "./monitoring-read-model";

const ORG_ID = "synthetic-org-001";
const SITE_ID = "SITE-ISG";
const USER_ID = "user-a";
const PLAN_ID = "synthetic-plan-001";

function localDateFor(performedAt: string): ProcedureRecord["LocalDate"] {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(performedAt)) as ProcedureRecord["LocalDate"];
}

function syntheticRecord(args: {
  id: string;
  performedAt: string;
  result?: ProcedureRecord["result"];
  organizationId?: string;
  siteId?: string;
  userId?: string;
  planId?: string;
  planVersion?: number;
}): ProcedureRecord {
  return {
    OrganizationId: args.organizationId ?? ORG_ID,
    SiteId: args.siteId ?? SITE_ID,
    UserId: args.userId ?? USER_ID,
    TimeZone: "Asia/Tokyo",
    RecordId: args.id,
    IdempotencyKey: `synthetic-idempotency-${args.id}`,
    PayloadFingerprint: `synthetic-fingerprint-${args.id}`,
    Procedure: {
      ProcedureId: args.planVersion === 3 ? "synthetic-procedure-p3" : "synthetic-procedure-p2",
      ProcedureVersion:
        args.planVersion === 3 ? "synthetic-procedure-p3-v1" : "synthetic-procedure-p2-v1",
      ApprovalState: "APPROVED",
    },
    LocalDate: localDateFor(args.performedAt),
    planId: args.planId ?? PLAN_ID,
    planVersion: args.planVersion ?? 2,
    result: args.result ?? "PERFORMED_AS_PLANNED",
    performedAt: args.performedAt,
    recordedAt: new Date(new Date(args.performedAt).getTime() + 30 * 60 * 1000).toISOString(),
    recordedBy: "synthetic-staff-001",
  };
}

/**
 * Deliberately mixed synthetic evidence set.
 * v2 / target identity has exactly three in-period records.
 */
export const MONITORING_LINK_SLICE_A_RECORDS: readonly ProcedureRecord[] = [
  syntheticRecord({
    id: "synthetic-monitoring-v2-003",
    performedAt: "2026-08-20T10:00:00+09:00",
    result: "NOT_PERFORMED",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-v2-001",
    performedAt: "2026-08-05T09:00:00+09:00",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-v2-002",
    performedAt: "2026-08-12T14:05:00+09:00",
    result: "PERFORMED_WITH_ADAPTATION",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-other-user",
    performedAt: "2026-08-13T09:00:00+09:00",
    userId: "user-b",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-other-plan",
    performedAt: "2026-08-14T09:00:00+09:00",
    planId: "synthetic-plan-other",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-v3-001",
    performedAt: "2026-08-21T09:30:00+09:00",
    planVersion: 3,
  }),
  syntheticRecord({
    id: "synthetic-monitoring-outside-period",
    performedAt: "2026-07-31T23:00:00+09:00",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-other-org",
    performedAt: "2026-08-16T09:00:00+09:00",
    organizationId: "synthetic-org-other",
  }),
  syntheticRecord({
    id: "synthetic-monitoring-other-site",
    performedAt: "2026-08-17T09:00:00+09:00",
    siteId: "SITE-OTHER",
  }),
];

export function monitoringQueryForVersion(planVersion: number): MonitoringQuery {
  return {
    OrganizationId: ORG_ID,
    SiteId: SITE_ID,
    UserId: USER_ID,
    planId: PLAN_ID,
    planVersion,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
  };
}

export function buildDemoMonitoringForVersion(planVersion: number): MonitoringBuildResult {
  return buildMonitoringReadModel(
    monitoringQueryForVersion(planVersion),
    MONITORING_LINK_SLICE_A_RECORDS,
  );
}

export const MONITORING_LINK_SLICE_A = {
  id: "MONITORING-LINK-SLICE-A",
  presentationOnly: true as const,
  syntheticProcedureRecordInputAuthorized: true as const,
  deterministicMonitoringProjectionAuthorized: true as const,
  humanReviewInputOnly: true as const,
  automaticEvaluationAuthorized: false as const,
  automaticReviewDecisionAuthorized: false as const,
  planMutationAuthorized: false as const,
  recordMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  deployAuthorized: false as const,
} as const;
