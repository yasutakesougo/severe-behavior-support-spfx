export type HumanReviewMaterialResult =
  | "PERFORMED_AS_PLANNED"
  | "PERFORMED_WITH_ADAPTATION"
  | "NOT_PERFORMED";

export type HumanReviewMaterialRecord = Readonly<{
  RecordId: string;
  ProcedureId: string;
  ProcedureVersion: string;
  result: HumanReviewMaterialResult;
  performedAt: string;
  recordedAt: string;
}>;

export type HumanReviewMaterials = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  records: readonly HumanReviewMaterialRecord[];
  humanInterpretationRequired: true;
}>;

export type HumanReviewMaterialsBuildResult =
  | Readonly<{ status: "RESOLVED"; value: HumanReviewMaterials }>
  | Readonly<{ status: "MALFORMED_INPUT" }>
  | Readonly<{ status: "CONTEXT_MISMATCH" }>;

const BASE = {
  OrganizationId: "synthetic-org-001",
  SiteId: "SITE-ISG",
  UserId: "user-a",
  planId: "synthetic-plan-001",
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  humanInterpretationRequired: true as const,
};

const V2_RECORDS: readonly HumanReviewMaterialRecord[] = [
  {
    RecordId: "synthetic-monitoring-v2-001",
    ProcedureId: "synthetic-procedure-p2",
    ProcedureVersion: "synthetic-procedure-p2-v1",
    result: "PERFORMED_AS_PLANNED",
    performedAt: "2026-08-05T09:00:00+09:00",
    recordedAt: "2026-08-05T00:30:00.000Z",
  },
  {
    RecordId: "synthetic-monitoring-v2-002",
    ProcedureId: "synthetic-procedure-p2",
    ProcedureVersion: "synthetic-procedure-p2-v1",
    result: "PERFORMED_WITH_ADAPTATION",
    performedAt: "2026-08-12T14:05:00+09:00",
    recordedAt: "2026-08-12T05:35:00.000Z",
  },
  {
    RecordId: "synthetic-monitoring-v2-003",
    ProcedureId: "synthetic-procedure-p2",
    ProcedureVersion: "synthetic-procedure-p2-v1",
    result: "NOT_PERFORMED",
    performedAt: "2026-08-20T10:00:00+09:00",
    recordedAt: "2026-08-20T01:30:00.000Z",
  },
];

const V3_RECORDS: readonly HumanReviewMaterialRecord[] = [
  {
    RecordId: "synthetic-monitoring-v3-001",
    ProcedureId: "synthetic-procedure-p3",
    ProcedureVersion: "synthetic-procedure-p3-v1",
    result: "PERFORMED_AS_PLANNED",
    performedAt: "2026-08-21T09:30:00+09:00",
    recordedAt: "2026-08-21T01:00:00.000Z",
  },
];

export function humanReviewResultForSyntheticVersion(
  planVersion: number,
): HumanReviewMaterialsBuildResult {
  if (planVersion === 1) {
    return {
      status: "RESOLVED",
      value: { ...BASE, planVersion: 1, recordCount: 0, records: [] },
    };
  }
  if (planVersion === 2) {
    return {
      status: "RESOLVED",
      value: {
        ...BASE,
        planVersion: 2,
        recordCount: V2_RECORDS.length,
        records: V2_RECORDS,
      },
    };
  }
  if (planVersion === 3) {
    return {
      status: "RESOLVED",
      value: {
        ...BASE,
        planVersion: 3,
        recordCount: V3_RECORDS.length,
        records: V3_RECORDS,
      },
    };
  }
  return { status: "MALFORMED_INPUT" };
}

export const HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE: HumanReviewMaterialsBuildResult =
  {
    status: "CONTEXT_MISMATCH",
  };

export const HUMAN_REVIEW_MALFORMED_FIXTURE: HumanReviewMaterialsBuildResult = {
  status: "MALFORMED_INPUT",
};
