import { buildAttentionSummaryFromItems } from "../ux/kpi-review-count";
import {
  associateReviewObservations,
  FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE,
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
} from "../procedure";
import {
  DEMO_REVIEW_DUE_ADMIN_READ_NOTE,
  DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE,
  DEMO_REVIEW_DUE_PRESENTATION_NOTE,
  reviewDueCopyIsFailClosed,
} from "./review-due-copy";
import {
  DEMO_UX_6_SLICE,
  DEMO_UX_REVIEW_DUE_FIXTURE,
  DEMO_UX_REVIEW_DUE_SUBSEQUENT_FIXTURE,
  VP5_REVIEW_SLICE,
} from "./review-due-fixture";
import {
  presentReviewDueSemanticBasis,
  SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE,
} from "./review-due-semantics";

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
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.originLabel).toContain("有効開始日");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.dueLabel).toContain("caller-supplied");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.approachingLabel).toContain("暦月");
  });

  it("separates business facts from system state", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.businessFacts.reviewScopeLabel).toContain("合成表示");
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });

  it("keeps fail-closed copy", () => {
    expect(reviewDueCopyIsFailClosed(DEMO_REVIEW_DUE_PRESENTATION_NOTE)).toBe(true);
    expect(reviewDueCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
    expect(DEMO_REVIEW_DUE_ADMIN_READ_NOTE).toContain("承認権限は追加しません");
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
  it("keeps D5 semantic basis separate from hard due and D6", () => {
    const firstReviewBasis = presentReviewDueSemanticBasis(true);
    const subsequentReviewBasis = presentReviewDueSemanticBasis(false);

    expect(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.id).toBe("SP-LC-3-REVIEW-DUE-ORIGIN-1");
    expect(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.fixedNinetyDaysAuthorized).toBe(false);
    expect(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.hardOverdueAuthorized).toBe(false);
    expect(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.observationAssociationAuthorized).toBe(false);
    expect(firstReviewBasis.originLabel).toBe("初回基準日: 支援計画の有効開始日");
    expect(subsequentReviewBasis.originLabel).toBe("継続基準日: 前回見直し日");
    expect(firstReviewBasis.dueLabel).toBe(
      "reviewDueDate は caller-supplied の基準日です。固定90日や自動失効には変換しません。",
    );
    expect(firstReviewBasis.approachingLabel).toBe(
      "通知開始は見直し対象の暦月に入った時点です。30日前などの日数固定窓は使いません。",
    );
    expect(firstReviewBasis.approachingLabel).toContain("見直し対象の暦月");
    expect(firstReviewBasis.approachingLabel).toContain("使いません");
    expect(firstReviewBasis.approachingLabel).not.toContain("30日前です");
  });

  it("renders both first-review and subsequent-review anchor fixtures without changing due semantics", () => {
    expect(DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.originLabel).toBe(
      "初回基準日: 支援計画の有効開始日",
    );
    expect(DEMO_UX_REVIEW_DUE_SUBSEQUENT_FIXTURE.semanticBasis.originLabel).toBe(
      "継続基準日: 前回見直し日",
    );
    expect(DEMO_UX_REVIEW_DUE_SUBSEQUENT_FIXTURE.semanticBasis.dueLabel).toBe(
      DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.dueLabel,
    );
    expect(DEMO_UX_REVIEW_DUE_SUBSEQUENT_FIXTURE.semanticBasis.approachingLabel).toBe(
      DEMO_UX_REVIEW_DUE_FIXTURE.semanticBasis.approachingLabel,
    );
  });

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
    expect(materials.map(({ id }) => id)).toEqual([
      "synthetic-proc-rec-v2-001",
      "proc-rec-unresolved-001",
    ]);
  });

  it("associates only exact historical ProcedureRecord context", () => {
    const material = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0];
    const association = associateReviewObservations(
      material,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );

    expect(association).toEqual({
      status: "ASSOCIATED",
      procedureRecordId: "synthetic-proc-rec-v2-001",
      planId: "synthetic-plan-001",
      planVersion: 2,
      observations: [
        {
          observationRecordId: "synthetic-observation-v2-001",
          observedAt: "2026-08-12T04:00:00.000Z",
          observedBy: "synthetic-staff-001",
        },
        {
          observationRecordId: "synthetic-observation-v2-002",
          observedAt: "2026-08-12T05:00:00.000Z",
          observedBy: "synthetic-staff-002",
        },
      ],
    });
  });

  it("associates successful-empty when resolved historical material has empty evidence", () => {
    const material = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0];
    const association = associateReviewObservations(material, []);

    expect(association).toEqual({
      status: "ASSOCIATED",
      procedureRecordId: "synthetic-proc-rec-v2-001",
      planId: "synthetic-plan-001",
      planVersion: 2,
      observations: [],
    });
  });

  it("keeps successful-empty copy distinct from unresolved association copy", () => {
    expect(FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE).toContain("関連付けは完了");
    expect(FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE).not.toContain("未解決");
    expect(FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE).not.toContain(
      "観察記録の関連付けは未解決です",
    );
  });

  it("fails closed for unresolved or mismatched historical context", () => {
    const [resolved, unresolved] = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials;
    const unresolvedAssociation = associateReviewObservations(
      unresolved,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );
    const mismatchAssociation = associateReviewObservations(resolved, [
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[0],
        procedureRecordId: "different-record",
      },
    ]);

    expect(unresolvedAssociation.status).toBe("UNRESOLVED");
    if (unresolvedAssociation.status === "UNRESOLVED") {
      expect(unresolvedAssociation.reason).toBe("HISTORICAL_LOOKUP_UNRESOLVED");
    }
    expect(mismatchAssociation.status).toBe("UNRESOLVED");
    if (mismatchAssociation.status === "UNRESOLVED") {
      expect(mismatchAssociation.reason).toBe("NO_EXACT_CONTEXT_MATCH");
    }
    expect(mismatchAssociation.observations).toEqual([]);
  });

  it.each(["UNKNOWN", "VERSION_MISMATCH", "PLAN_MISMATCH", "EMPTY", "FETCH_FAILED"] as const)(
    "fails closed for historical lookup status %s",
    (historicalLookupStatus) => {
      const material = {
        ...FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0],
        historicalLookupStatus,
      };
      const association = associateReviewObservations(
        material,
        FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
      );

      expect(association).toMatchObject({
        status: "UNRESOLVED",
        reason: "HISTORICAL_LOOKUP_UNRESOLVED",
        observations: [],
      });
    },
  );

  it("fails closed when plan identity or version does not match", () => {
    const material = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0];
    const mismatchedPlanEvidence = [
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[0],
        planId: "different-plan",
      },
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[1],
        planVersion: 3,
      },
    ];

    const association = associateReviewObservations(material, mismatchedPlanEvidence);

    expect(association).toMatchObject({
      status: "UNRESOLVED",
      reason: "NO_EXACT_CONTEXT_MATCH",
      observations: [],
    });
  });

  it("uses observation RecordId only as an equal-timestamp technical tie-breaker", () => {
    const material = FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0];
    const equalTimestampEvidence = [
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[0],
        observationRecordId: "observation-z",
        observedAt: "2026-08-12T06:00:00.000Z",
      },
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[1],
        observationRecordId: "observation-a",
        observedAt: "2026-08-12T06:00:00.000Z",
      },
    ];

    const association = associateReviewObservations(material, equalTimestampEvidence);

    expect(association.status).toBe("ASSOCIATED");
    if (association.status === "ASSOCIATED") {
      expect(
        association.observations.map(({ observationRecordId }) => observationRecordId),
      ).toEqual(["observation-a", "observation-z"]);
    }
  });

  it("does not mutate caller evidence and does not derive compliance", () => {
    const evidence = [...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE];
    const snapshot = [...evidence];
    const association = associateReviewObservations(
      FIELD_WORKFLOW_PROCEDURE_FIXTURE.reviewMaterials[0],
      evidence,
    );

    expect(evidence).toEqual(snapshot);
    expect(association.status).toBe("ASSOCIATED");
    expect(association).not.toHaveProperty("compliance");
    expect(association).not.toHaveProperty("overdue");
    expect(association).not.toHaveProperty("invalidated");
  });
});
