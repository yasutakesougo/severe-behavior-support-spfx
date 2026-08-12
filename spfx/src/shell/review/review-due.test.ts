import { DEMO_REVIEW_DUE_PRESENTATION_NOTE, reviewDueCopyIsFailClosed } from "./review-due-copy";
import { DEMO_UX_6_SLICE, DEMO_UX_REVIEW_DUE_FIXTURE } from "./review-due-fixture";

describe("DEMO-UX-6 review status & due-state presentation", () => {
  it("contains review attention items with status and due-state labels", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.heading).toBe("見直し状況");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems).toHaveLength(3);
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[0].reviewStatusLabel).toBe("確認待ち");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[0].dueStateLabel).toBe("期限接近");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel).toContain(
      "確認待ち",
    );
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.dueSoonCountLabel).toContain("期限接近");
  });

  it("separates business facts from system state", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.businessFacts.reviewScopeLabel).toContain("合成表示");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });

  it("keeps fail-closed copy", () => {
    expect(reviewDueCopyIsFailClosed(DEMO_REVIEW_DUE_PRESENTATION_NOTE)).toBe(true);
    expect(reviewDueCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("keeps live data, calculation, and write flags off", () => {
    expect(DEMO_UX_6_SLICE.id).toBe("DEMO-UX-6");
    expect(DEMO_UX_6_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_6_SLICE.liveReviewStatusReadAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.liveDueStateCalculationAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.liveReviewDataAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.reviewMutationAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.evaluationMutationAuthorized).toBe(false);
    expect(DEMO_UX_6_SLICE.govRuleDecisionAuthorized).toBe(false);
  });
});
