import {
  DEMO_SUPPORT_PLAN_PRESENTATION_NOTE,
  supportPlanCopyIsFailClosed,
} from "./support-plan-copy";
import { DEMO_UX_4_SLICE, DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";

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
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.reviewStatus.reviewStatusLabel).toContain("確認待ち");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.businessFacts.qualificationLabel).toContain("実践研修");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
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
