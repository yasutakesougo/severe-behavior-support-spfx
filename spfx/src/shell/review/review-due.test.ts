import { buildAttentionSummaryFromItems } from "../ux/kpi-review-count";
import { FIELD_WORKFLOW_PROCEDURE_FIXTURE } from "../procedure";
import {
  DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE,
  DEMO_REVIEW_DUE_PRESENTATION_NOTE,
  reviewDueCopyIsFailClosed,
} from "./review-due-copy";
import {
  DEMO_UX_6_SLICE,
  DEMO_UX_REVIEW_DUE_FIXTURE,
  VP5_REVIEW_SLICE,
} from "./review-due-fixture";

describe("DEMO-UX-6 review status & due-state presentation", () => {
  it("contains review attention items with status and due-state labels", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.heading).toBe("見直し状況");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems).toHaveLength(3);
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[0].reviewStatusLabel).toBe("要確認");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[0].dueStateLabel).toBe("期限接近");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[2].reviewStatusLabel).toBe("要確認");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems[2].dueStateLabel).toBeUndefined();
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel).toContain(
      "要確認",
    );
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.dueSoonCountLabel).toContain("期限接近");
    expect(
      DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel,
    ).not.toContain("確認待ち");
    // DEMO-UX-10 Family A: summary derived from attentionItems (3 / 2)
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary).toEqual(
      buildAttentionSummaryFromItems(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems),
    );
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel).toContain(
      "3件",
    );
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.dueSoonCountLabel).toContain("2件");
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

describe("DADS-UX-5 review due presentation contracts", () => {
  it("keeps attention empty copy as zero-result (INV-17; not all-clear)", () => {
    expect(DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE).toContain(
      "表示する確認対象はありません（合成データ）",
    );
    expect(DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE).toContain(
      "業務上の見直し対象が無いことを示すものではありません",
    );
  });

  it("keeps Family A status vocabulary anchors for INV-11/12 regression", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems).toHaveLength(3);
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel).toContain(
      "要確認",
    );
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.dueSoonCountLabel).toContain("期限接近");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });
});

describe("VP-5 Review presentation boundary", () => {
  it("locks the slice to presentation-only review evidence", () => {
    expect(VP5_REVIEW_SLICE.id).toBe("VP-5-REVIEW");
    expect(VP5_REVIEW_SLICE.target).toBe("review");
    expect(VP5_REVIEW_SLICE.presentationOnly).toBe(true);
    expect(VP5_REVIEW_SLICE.visualPolishAuthorized).toBe(true);
    expect(VP5_REVIEW_SLICE.reviewPresentationBoundaryMetadataAuthorized).toBe(true);
    expect(VP5_REVIEW_SLICE.reviewDueStatePresentationAuthorized).toBe(true);
    expect(VP5_REVIEW_SLICE.historicalUnresolvedPresentationAuthorized).toBe(true);
    expect(VP5_REVIEW_SLICE.regressionTestsAuthorized).toBe(true);
  });

  it("keeps outcome, mutation, vocabulary, navigation, and external boundaries closed", () => {
    expect(VP5_REVIEW_SLICE.reviewAutoJudgeAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.reviewOutcomeSemanticsChangeAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.completeReviewMutationAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.statusVocabularyChangeAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.navigationSemanticsChangeAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.domainContractsMutationAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.permissionMutationAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.syntheticBoundaryChangeAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.visualAcceptanceAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.deployAuthorized).toBe(false);
    expect(VP5_REVIEW_SLICE.externalMutationAuthorized).toBe(false);
  });

  it("retains both historical resolved and unresolved material fixtures", () => {
    const materials = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials;

    expect(materials.map(({ historicalLookupStatus }) => historicalLookupStatus)).toEqual([
      "RESOLVED",
      "FETCH_FAILED",
    ]);
    expect(materials.map(({ planVersion }) => planVersion)).toEqual([2, 2]);
    expect(materials.map(({ id }) => id)).toEqual(["proc-rec-v2-001", "proc-rec-unresolved-001"]);
  });
});
