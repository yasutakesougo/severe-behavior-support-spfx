import {
  DEMO_UX_3_SLICE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
} from "./user-detail-fixture";

describe("DEMO-UX-3 user detail presentation boundary", () => {
  it("keeps the synthetic detail ordered around current support", () => {
    expect(DEMO_UX_USER_DETAIL_FIXTURE.userId).toBe("user-a");
    expect(DEMO_UX_USER_DETAIL_FIXTURE.personLabel).toBe("Aさん");
    expect(DEMO_UX_USER_DETAIL_FIXTURE.currentSupport.map((item) => item.label)).toEqual([
      "環境調整",
      "コミュニケーション",
      "行動発生時",
    ]);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.recentRecords).toHaveLength(2);
  });

  it("provides DEMO-UX-7 Cさん detail without live identifiers", () => {
    expect(DEMO_UX_USER_DETAIL_C_FIXTURE.userId).toBe("user-c");
    expect(DEMO_UX_USER_DETAIL_C_FIXTURE.personLabel).toBe("Cさん");
    expect(DEMO_UX_USER_DETAIL_C_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });

  it("separates business facts from system state", () => {
    expect(DEMO_UX_USER_DETAIL_FIXTURE.businessFacts.qualificationLabel).toContain("合成表示");
    expect(DEMO_UX_USER_DETAIL_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });

  it("authorizes only synthetic local detail navigation", () => {
    expect(DEMO_UX_3_SLICE.id).toBe("DEMO-UX-3");
    expect(DEMO_UX_3_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_3_SLICE.syntheticUserDetailNavigationAuthorized).toBe(true);
    expect(DEMO_UX_3_SLICE.liveUserDetailNavigationAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.authJudgmentAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.liveUsersDataAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.planMutationAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.recordMutationAuthorized).toBe(false);
    expect(DEMO_UX_3_SLICE.evaluationMutationAuthorized).toBe(false);
  });
});

describe("DADS-UX-3 user detail presentation contracts", () => {
  it("keeps business section meaning anchors for INV-07 regression", () => {
    // Mirrored by A11Y-INV-07 / A11Y-HD-04 — section order / IA unchanged.
    expect(DEMO_UX_USER_DETAIL_FIXTURE.currentSupport.length).toBeGreaterThan(0);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.recentRecords.length).toBeGreaterThan(0);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.evaluationSummary.length).toBeGreaterThan(0);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.historySummary.length).toBeGreaterThan(0);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.planLifecycleLabel).toContain("現行版");
    expect(DEMO_UX_USER_DETAIL_FIXTURE.historySummary).toContain("過去版");
    expect(DEMO_UX_USER_DETAIL_FIXTURE.businessFacts.createdByLabel.length).toBeGreaterThan(0);
    expect(DEMO_UX_USER_DETAIL_FIXTURE.systemState.saveStateLabel.length).toBeGreaterThan(0);
  });
});
