import type { ApprovedProcedureReference, LocalDate } from "../../src/contracts/types";
import type { ScheduleItem, ScheduledOccurrence } from "../../src/domain/kiosk-contract";
import type { SupportPlanVersion } from "../../src/domain/support-plan";
import type { SupportPlanVersionProcedureBinding } from "../../src/domain/support-plan-version-procedure-binding";
import type {
  CanonicalProcedureCatalogEntry,
  CanonicalProcedureResolutionQuery,
} from "../../src/domain/canonical-procedure-resolver";

export const FIXTURE_ORG_ID = "synthetic-org-isogo-01";
export const FIXTURE_SITE_ID = "synthetic-site-isogo-main";
export const FIXTURE_USER_ID_A = "synthetic-user-001";
export const FIXTURE_USER_ID_B = "synthetic-user-002";

export const FIXTURE_PLAN_ID_A = "synthetic-plan-user-a";
export const FIXTURE_PLAN_VERSION_2 = 2;
export const FIXTURE_PLAN_VERSION_3 = 3;

export const FIXTURE_PROCEDURE_REF_LUNCH_V3: ApprovedProcedureReference = {
  ProcedureId: "synthetic-proc-lunch-01",
  ProcedureVersion: "synthetic-proc-version-3",
  ApprovalState: "APPROVED",
};

export const FIXTURE_PROCEDURE_REF_LUNCH_V2: ApprovedProcedureReference = {
  ProcedureId: "synthetic-proc-lunch-01",
  ProcedureVersion: "synthetic-proc-version-2",
  ApprovalState: "APPROVED",
};

export const FIXTURE_PROCEDURE_REF_REST_V3: ApprovedProcedureReference = {
  ProcedureId: "synthetic-proc-rest-01",
  ProcedureVersion: "synthetic-proc-version-3",
  ApprovalState: "APPROVED",
};

export const FIXTURE_PLAN_VERSION_A_V3: SupportPlanVersion = {
  planId: FIXTURE_PLAN_ID_A,
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  version: FIXTURE_PLAN_VERSION_3,
  goals: ["落ち着いて昼食をとることができる", "午後の活動に無理なく移行する"],
  supportMethods: [
    "手順1: 視覚カードで昼食の準備を伝える",
    "手順2: 静かな個別ブースへ誘導する",
    "手順3: 食事中の声かけは最小限にとどめる",
  ],
  precautions: [
    "留意1: 背後から急に肩や身体に触れない",
    "留意2: 否定的な制止語（「ダメ」「やめて」）を使わない",
  ],
  reviewCriteria: ["着席後5分以内に自発的に摂食を開始できるか"],
  versionCreatedBy: "synthetic-planner-001",
  versionCreatedAt: "2026-10-01T09:00:00Z",
};

export const FIXTURE_PLAN_VERSION_A_V2: SupportPlanVersion = {
  planId: FIXTURE_PLAN_ID_A,
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  version: FIXTURE_PLAN_VERSION_2,
  goals: ["集団場面で食事をとる練習をする"],
  supportMethods: ["旧手順1: 声かけで誘導する", "旧手順2: 見守りを実施する"],
  precautions: ["旧留意: 離席時は静かに促す"],
  reviewCriteria: ["30分以内に完食できるか"],
  versionCreatedBy: "synthetic-planner-001",
  versionCreatedAt: "2026-04-01T09:00:00Z",
};

export const FIXTURE_BINDING_LUNCH_V3: SupportPlanVersionProcedureBinding = {
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
  Procedure: FIXTURE_PROCEDURE_REF_LUNCH_V3,
};

export const FIXTURE_BINDING_REST_V3: SupportPlanVersionProcedureBinding = {
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
  Procedure: FIXTURE_PROCEDURE_REF_REST_V3,
};

export const FIXTURE_BINDING_LUNCH_V2: SupportPlanVersionProcedureBinding = {
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_2,
  Procedure: FIXTURE_PROCEDURE_REF_LUNCH_V2,
};

export const FIXTURE_SCHEDULE_ITEM_LUNCH: ScheduleItem = {
  schemaVersion: "1.0.0",
  ScheduleItemId: "synthetic-sch-lunch-001",
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  Procedure: FIXTURE_PROCEDURE_REF_LUNCH_V3,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
  scheduledTime: "12:00",
  activityLabel: "昼食準備",
  catalogOrder: 1,
};

export const FIXTURE_OCCURRENCE_LUNCH: ScheduledOccurrence = {
  schemaVersion: "1.0.0",
  OccurrenceId: "synthetic-occ-lunch-001",
  OrganizationId: FIXTURE_ORG_ID,
  SiteId: FIXTURE_SITE_ID,
  UserId: FIXTURE_USER_ID_A,
  LocalDate: "2026-10-29" as LocalDate,
  TimeZone: "Asia/Tokyo",
  ScheduleItemId: "synthetic-sch-lunch-001",
  Procedure: FIXTURE_PROCEDURE_REF_LUNCH_V3,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
};

export const FIXTURE_CATALOG_ENTRY_LUNCH_V3: CanonicalProcedureCatalogEntry = {
  organizationId: FIXTURE_ORG_ID,
  siteId: FIXTURE_SITE_ID,
  userId: FIXTURE_USER_ID_A,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
  procedureId: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureId,
  procedureVersion: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureVersion,
  approvalState: "APPROVED",
  sceneLabel: "昼食準備（12:00）",
  performLabels: [
    "手順1: 視覚カードで昼食の準備を伝える",
    "手順2: 静かな個別ブースへ誘導する",
    "手順3: 食事中の声かけは最小限にとどめる",
  ],
  avoidLabels: [
    "留意1: 背後から急に肩や身体に触れない",
    "留意2: 否定的な制止語（「ダメ」「やめて」）を使わない",
  ],
  noteLabel: "着席後5分以内に自発的に摂食を開始できるか",
  planPeriodLabel: "第3版 承認手順",
  scheduleItemId: "synthetic-sch-lunch-001",
};

export const FIXTURE_QUERY_LUNCH_V3_VALID: CanonicalProcedureResolutionQuery = {
  organizationId: FIXTURE_ORG_ID,
  siteId: FIXTURE_SITE_ID,
  userId: FIXTURE_USER_ID_A,
  planId: FIXTURE_PLAN_ID_A,
  planVersion: FIXTURE_PLAN_VERSION_3,
  procedureId: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureId,
  procedureVersion: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureVersion,
  scheduleItemId: "synthetic-sch-lunch-001",
  occurrenceId: "synthetic-occ-lunch-001",
};
