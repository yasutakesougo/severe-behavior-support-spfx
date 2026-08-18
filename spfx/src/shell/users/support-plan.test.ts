import {
  DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE,
  DEMO_SUPPORT_PLAN_PRESENTATION_NOTE,
  SUPPORT_PLAN_ACTIVE_STATUS_LABEL,
  SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE,
  SUPPORT_PLAN_REVIEW_MATERIALS_CTA,
  supportPlanCopyAvoidsFinalApprovalMeaning,
  supportPlanCopyIsFailClosed,
} from "./support-plan-copy";
import {
  DEMO_UX_4_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  PLANNING_PC_DEMO_1_SLICE,
} from "./support-plan-fixture";
import { supportPlanBlockOrderForRole } from "../ux/presentation-role";

describe("DEMO-UX-4 support plan presentation boundary", () => {
  it("uses synthetic plan content for responsible-person review", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.userId).toBe("user-a");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.personLabel).toBe("Aさん");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.goals).toHaveLength(2);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.actionItems).toHaveLength(3);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.actionItems.map((item) => item.categoryLabel)).toEqual([
      "環境調整",
      "コミュニケーション",
      "行動発生時",
    ]);
  });

  it("keeps review status textual and separates business facts from system state", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel).toContain("要確認");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel).not.toContain("確認待ち");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.businessFacts.qualificationLabel).toContain("実践研修");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.planLifecycleLabel).toContain("現行版");
    expect(DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE).toContain("承認・変更権限は追加しません");
  });

  it("keeps presentation copy fail-closed", () => {
    expect(supportPlanCopyIsFailClosed(DEMO_SUPPORT_PLAN_PRESENTATION_NOTE)).toBe(true);
    expect(DEMO_SUPPORT_PLAN_PRESENTATION_NOTE).toContain("業務データには接続されていません");
    expect(supportPlanCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("does not authorize live I/O, plan mutation, or live plan navigation", () => {
    expect(DEMO_UX_4_SLICE.id).toBe("DEMO-UX-4");
    expect(DEMO_UX_4_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_4_SLICE.syntheticSupportPlanNavigationAuthorized).toBe(true);
    expect(DEMO_UX_4_SLICE.liveSupportPlanNavigationAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.authJudgmentAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.liveUsersDataAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.planMutationAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.recordMutationAuthorized).toBe(false);
    expect(DEMO_UX_4_SLICE.evaluationMutationAuthorized).toBe(false);
  });
});

describe("DADS-UX-6 support plan presentation contracts", () => {
  it("keeps SupportPlan business/status anchors for INV-08 regression", () => {
    // Mirrored by A11Y-HD-07 / A11Y-SP-01 — IA and vocabulary unchanged.
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.goals.length).toBeGreaterThan(0);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.actionItems.length).toBeGreaterThan(0);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel).toContain("要確認");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });
});

describe("PLANNING-PC-DEMO-1 support plan graph", () => {
  it("shows Active as 適用中 and keeps Schema 1.0.0 identity join", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusCode).toBe("Active");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusLabel).toBe(SUPPORT_PLAN_ACTIVE_STATUS_LABEL);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusLabel).toBe("適用中");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion).toBe(3);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.planId).toBe("synthetic-plan-001");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.planLifecycleLabel).toContain("適用中");
  });

  it("does not present approvedBy as institutional final approval", () => {
    expect(
      supportPlanCopyAvoidsFinalApprovalMeaning(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusLabel),
    ).toBe(true);
    expect(
      supportPlanCopyAvoidsFinalApprovalMeaning(DEMO_UX_SUPPORT_PLAN_FIXTURE.planLifecycleLabel),
    ).toBe(true);
    expect(
      supportPlanCopyAvoidsFinalApprovalMeaning(
        DEMO_UX_SUPPORT_PLAN_FIXTURE.businessFacts.appliedFromLabel,
      ),
    ).toBe(true);
    expect(supportPlanCopyAvoidsFinalApprovalMeaning(SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE)).toBe(
      true,
    );
    expect(SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE).toContain("適用開始");
  });

  it("joins current procedures and keeps historical ProcedureRecord on v2", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures).toHaveLength(1);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures[0]?.procedureId).toBe(
      "synthetic-procedure-p3",
    );
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures[0]?.planVersion).toBe(3);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.recentProcedureRecords[0]?.planVersion).toBe(2);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.recentProcedureRecords[0]?.id).toBe("proc-rec-v2-001");
  });

  it("lists past versions as read-only and keeps mutation unauthorized", () => {
    const past = DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.filter((entry) => !entry.isCurrent);
    expect(past.length).toBe(2);
    expect(past.every((entry) => entry.lifecycleLabel.indexOf("読み取り専用") >= 0)).toBe(true);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.some((entry) => entry.isCurrent)).toBe(true);
    expect(PLANNING_PC_DEMO_1_SLICE.planMutationAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_MATERIALS_CTA).toContain("見直し材料");
  });

  it("keeps FIELD_STAFF DEMO-UX-4 block order and adds planner graph blocks", () => {
    expect(supportPlanBlockOrderForRole("FIELD_STAFF")).toEqual([
      "summary",
      "goals",
      "actions",
      "review",
      "mutation",
    ]);
    expect(supportPlanBlockOrderForRole("PLANNER")).toContain("procedures");
    expect(supportPlanBlockOrderForRole("PLANNER")).toContain("records");
    expect(supportPlanBlockOrderForRole("PLANNER")).toContain("versions");
  });

  it("does not authorize schema change, live write, or review-due origin", () => {
    expect(PLANNING_PC_DEMO_1_SLICE.id).toBe("PLANNING-PC-DEMO-1");
    expect(PLANNING_PC_DEMO_1_SLICE.presentationOnly).toBe(true);
    expect(PLANNING_PC_DEMO_1_SLICE.syntheticPlanningPcNavigationAuthorized).toBe(true);
    expect(PLANNING_PC_DEMO_1_SLICE.schemaChangeAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.approvedByRenameAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.reviewDueOriginAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.observationPlanVersionContractAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.liveWriteAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.deployAuthorized).toBe(false);
    expect(PLANNING_PC_DEMO_1_SLICE.liveTenantIoAuthorized).toBe(false);
  });
});
