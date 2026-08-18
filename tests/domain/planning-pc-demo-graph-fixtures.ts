import type { LocalDate } from "../../src/contracts/types";
import type {
  ProcedureRecord,
  SupportPlan,
  SupportPlanVersion,
  SupportPlanVersionProcedureBinding,
} from "../../src/domain";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";
import { createSyntheticActivePlan } from "./support-plan-fixtures";
import { createSyntheticSupportPlanVersionProcedureBinding } from "./support-plan-version-procedure-binding-fixtures";

/**
 * PLANNING-PC-DEMO-1 domain graph — same identities as the shell fixture.
 * Schema 1.0.0 reuse only. Does not change validators.
 */

export const PLANNING_PC_DEMO_ORG_ID = "synthetic-org-001";
export const PLANNING_PC_DEMO_SITE_ID = "SITE-ISG";
export const PLANNING_PC_DEMO_USER_ID = "user-a";
export const PLANNING_PC_DEMO_PLAN_ID = "synthetic-plan-001";
export const PLANNING_PC_DEMO_CURRENT_VERSION = 3;

export const PLANNING_PC_DEMO_PROCEDURE_P2_ID = "synthetic-procedure-p2";
export const PLANNING_PC_DEMO_PROCEDURE_P2_VERSION = "synthetic-procedure-p2-v1";
export const PLANNING_PC_DEMO_PROCEDURE_P3_ID = "synthetic-procedure-p3";
export const PLANNING_PC_DEMO_PROCEDURE_P3_VERSION = "synthetic-procedure-p3-v1";

const DEMO_SCOPE = {
  OrganizationId: PLANNING_PC_DEMO_ORG_ID,
  SiteId: PLANNING_PC_DEMO_SITE_ID,
  UserId: PLANNING_PC_DEMO_USER_ID,
} as const;

type PlanningPcDemoActivePlan = Extract<SupportPlan, { status: "Active" }>;

export function createPlanningPcDemoActivePlan(
  overrides?: Partial<PlanningPcDemoActivePlan>,
): SupportPlan {
  return createSyntheticActivePlan({
    ...DEMO_SCOPE,
    PlanId: PLANNING_PC_DEMO_PLAN_ID,
    currentVersion: PLANNING_PC_DEMO_CURRENT_VERSION,
    version: PLANNING_PC_DEMO_CURRENT_VERSION,
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    createdAt: "2026-07-01T00:00:00.000Z",
    submittedAt: "2026-06-20T00:00:00.000Z",
    approvedAt: "2026-06-25T00:00:00.000Z",
    reviewDueDate: "2026-09-23T00:00:00.000Z",
    ...overrides,
  });
}

export function createPlanningPcDemoPlanVersion(
  version: 1 | 2 | 3,
  overrides?: Partial<SupportPlanVersion>,
): SupportPlanVersion {
  const createdAtByVersion: Record<1 | 2 | 3, string> = {
    1: "2026-02-01T00:00:00.000Z",
    2: "2026-05-01T00:00:00.000Z",
    3: "2026-07-01T00:00:00.000Z",
  };
  const methodsByVersion: Record<1 | 2 | 3, readonly string[]> = {
    1: ["synthetic v1 method"],
    2: ["synthetic v2 method — photo card then wait"],
    3: ["写真カードで次の活動を示す", "本人の反応を待ってから促す"],
  };
  const precautionsByVersion: Record<1 | 2 | 3, readonly string[]> = {
    1: ["synthetic v1 precaution"],
    2: ["synthetic v2 precaution — no sudden voice"],
    3: ["突然大きな声で急かす", "身体を引っ張る"],
  };
  return {
    planId: PLANNING_PC_DEMO_PLAN_ID,
    ...DEMO_SCOPE,
    version,
    goals: [`synthetic planning-pc goal v${version}`],
    supportMethods: methodsByVersion[version],
    precautions: precautionsByVersion[version],
    reviewCriteria: [`synthetic planning-pc review criterion v${version}`],
    versionCreatedBy: "synthetic-staff-001",
    versionCreatedAt: createdAtByVersion[version],
    ...overrides,
  };
}

export function createPlanningPcDemoV3Binding(): SupportPlanVersionProcedureBinding {
  return createSyntheticSupportPlanVersionProcedureBinding({
    ...DEMO_SCOPE,
    planId: PLANNING_PC_DEMO_PLAN_ID,
    planVersion: 3,
    Procedure: {
      ProcedureId: PLANNING_PC_DEMO_PROCEDURE_P3_ID,
      ProcedureVersion: PLANNING_PC_DEMO_PROCEDURE_P3_VERSION,
      ApprovalState: "APPROVED",
    },
  });
}

export function createPlanningPcDemoV2Binding(): SupportPlanVersionProcedureBinding {
  return createSyntheticSupportPlanVersionProcedureBinding({
    ...DEMO_SCOPE,
    planId: PLANNING_PC_DEMO_PLAN_ID,
    planVersion: 2,
    Procedure: {
      ProcedureId: PLANNING_PC_DEMO_PROCEDURE_P2_ID,
      ProcedureVersion: PLANNING_PC_DEMO_PROCEDURE_P2_VERSION,
      ApprovalState: "APPROVED",
    },
  });
}

export function createPlanningPcDemoHistoricalProcedureRecord(
  overrides?: Partial<ProcedureRecord>,
): ProcedureRecord {
  return createSyntheticProcedureRecord({
    ...DEMO_SCOPE,
    RecordId: "synthetic-proc-rec-v2-001",
    planId: PLANNING_PC_DEMO_PLAN_ID,
    planVersion: 2,
    Procedure: {
      ProcedureId: PLANNING_PC_DEMO_PROCEDURE_P2_ID,
      ProcedureVersion: PLANNING_PC_DEMO_PROCEDURE_P2_VERSION,
      ApprovalState: "APPROVED",
    },
    result: "PERFORMED_WITH_ADAPTATION",
    LocalDate: "2026-08-12" as LocalDate,
    ...overrides,
  });
}
