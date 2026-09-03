import {
  DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE,
  DEMO_SUPPORT_PLAN_PRESENTATION_NOTE,
  PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION,
  PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION_HINT,
  PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION,
  SUPPORT_PLAN_ACTIVE_STATUS_LABEL,
  SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE,
  SUPPORT_PLAN_REVIEW_MATERIALS_CTA,
  SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA,
  SUPPORT_PLAN_NEXT_VERSION_CTA,
  SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE,
  SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE,
  supportPlanCopyAvoidsFinalApprovalMeaning,
  supportPlanCopyIsFailClosed,
} from "./support-plan-copy";
import {
  DEMO_UX_4_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  PLANNING_PC_DEMO_1_SLICE,
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
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
  it("keeps person, current status, and review cue on separate channels", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.personLabel).toBe("Aさん");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.planTitle).toBe("支援計画");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusLabel).toBe("適用中");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel).toContain("要確認");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.personLabel).not.toBe(
      DEMO_UX_SUPPORT_PLAN_FIXTURE.planTitle,
    );
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.statusLabel).not.toBe(
      DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel,
    );
  });

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
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.recentProcedureRecords[0]?.id).toBe(
      "synthetic-proc-rec-v2-001",
    );
  });

  it("lists past versions as read-only and keeps mutation unauthorized", () => {
    const past = DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.filter((entry) => !entry.isCurrent);
    expect(past.length).toBe(2);
    expect(past.every((entry) => entry.lifecycleLabel.indexOf("読み取り専用") >= 0)).toBe(true);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.some((entry) => entry.isCurrent)).toBe(true);
    expect(PLANNING_PC_DEMO_1_SLICE.planMutationAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_MATERIALS_CTA).toContain("見直し材料");
  });

  it("keeps FIELD_STAFF order and gives PLANNER the locked process order", () => {
    expect(supportPlanBlockOrderForRole("FIELD_STAFF")).toEqual([
      "summary",
      "goals",
      "actions",
      "review",
      "mutation",
    ]);
    expect(supportPlanBlockOrderForRole("PLANNER")).toEqual([
      "summary",
      "goals",
      "actions",
      "procedures",
      "records",
      "review",
      "nextVersion",
      "versions",
      "mutation",
    ]);
    expect(supportPlanBlockOrderForRole("FIELD_STAFF")).not.toContain("nextVersion");
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

  it("defines six PLANNER process navigation targets without progress semantics", () => {
    expect(PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION).toEqual([
      { id: "planner-process-plan-heading", label: "① 計画" },
      { id: "planner-process-support-heading", label: "② 支援" },
      { id: "planner-process-records-heading", label: "③ 記録" },
      { id: "planner-process-monitoring-heading", label: "④ モニタリング" },
      { id: "planner-process-review-heading", label: "⑤ 見直し" },
      { id: "planner-process-next-version-heading", label: "⑥ 次版準備" },
    ]);
    expect(PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION_HINT).toContain("ページ内");
    expect(PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION_HINT).toContain("進捗を表しません");
  });

  it("keeps the pre-V1 planning-PC navigation available unchanged for ADMIN_AUDIT", () => {
    expect(PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION).toEqual([
      { id: "demo-ux-plan-review-heading", label: "見直し状況" },
      { id: "planning-pc-plan-procedures-heading", label: "現在の支援手順" },
      { id: "planning-pc-plan-records-heading", label: "最近の支援手順記録" },
      { id: "planning-pc-plan-versions-heading", label: "過去の版" },
      { id: "review-new-version-next-heading", label: "次の版の考え方" },
    ]);
  });
});

describe("SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1", () => {
  it("compares past v2 methods with current v3 without retargeting records", () => {
    const current = DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.find((entry) => entry.version === 3);
    const pastV2 = DEMO_UX_SUPPORT_PLAN_FIXTURE.versions.find((entry) => entry.version === 2);
    expect(current?.isCurrent).toBe(true);
    expect(pastV2?.isCurrent).toBe(false);
    expect(pastV2?.supportMethods).toEqual(["synthetic v2 method — photo card then wait"]);
    expect(current?.supportMethods).toEqual(
      DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures[0]?.performLabels,
    );
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.recentProcedureRecords[0]?.planVersion).toBe(2);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.conceptualNextVersion).toBe(4);
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.conceptualNextVersion).toBeGreaterThan(
      DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
    );
  });

  it("presents next-version concept without persistence or final-approval meaning", () => {
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id).toBe(
      "SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1",
    );
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.presentationOnly).toBe(true);
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.syntheticNextVersionConceptAuthorized).toBe(
      true,
    );
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.planMutationAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.schemaChangeAuthorized).toBe(false);
    expect(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.liveWriteAuthorized).toBe(false);
    expect(SUPPORT_PLAN_NEXT_VERSION_CTA).toContain("表示専用");
    expect(SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA).toContain("次の版");
    expect(SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE).toContain("無効にしません");
    expect(SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE).toContain("無効にしません");
    expect(supportPlanCopyAvoidsFinalApprovalMeaning(SUPPORT_PLAN_NEXT_VERSION_CTA)).toBe(true);
  });
});
