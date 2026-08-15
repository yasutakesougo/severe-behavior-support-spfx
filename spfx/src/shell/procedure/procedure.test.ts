import {
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
  FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
  FIELD_WORKFLOW_UI_SLICE,
  VP4_WORKFLOW_SLICE,
  PROCEDURE_RECORD_RESULT_VALUES,
  applySyntheticProcedureRecordSave,
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
  isProcedureRecordDraftReadyToSave,
  labelForProcedureRecordResult,
  procedureResultCopyIsNonFailure,
  projectionUsesRecordPlanVersion,
  resolveProcedureReviewProjection,
} from "./index";

describe("FIELD-WORKFLOW UI (#356) presentation boundary", () => {
  it("authorizes only synthetic procedure workflow / save", () => {
    expect(FIELD_WORKFLOW_UI_SLICE.id).toBe("FIELD-WORKFLOW-UI");
    expect(FIELD_WORKFLOW_UI_SLICE.issue).toBe("#356");
    expect(FIELD_WORKFLOW_UI_SLICE.presentationOnly).toBe(true);
    expect(FIELD_WORKFLOW_UI_SLICE.syntheticProcedureWorkflowAuthorized).toBe(true);
    expect(FIELD_WORKFLOW_UI_SLICE.syntheticProcedureRecordSaveAuthorized).toBe(true);
    expect(FIELD_WORKFLOW_UI_SLICE.sharePointRestAuthorized).toBe(false);
    expect(FIELD_WORKFLOW_UI_SLICE.productionWriteAuthorized).toBe(false);
    expect(FIELD_WORKFLOW_UI_SLICE.deployAuthorized).toBe(false);
  });

  it("exposes A2 current procedure flow for user-a with binding context", () => {
    const current = FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId["user-a"];
    expect(current.projection.sceneLabel.length).toBeGreaterThan(0);
    expect(current.projection.performLabels.length).toBeGreaterThan(0);
    expect(current.projection.avoidLabels.length).toBeGreaterThan(0);
    expect(current.projection.noteLabel.length).toBeGreaterThan(0);
    expect(current.context.planVersion).toBe(3);
    expect(current.context.procedureId).toBe("synthetic-procedure-p3");
  });

  it("keeps result vocabulary factual (non-failure copy)", () => {
    for (const result of PROCEDURE_RECORD_RESULT_VALUES) {
      expect(procedureResultCopyIsNonFailure(result)).toBe(true);
      expect(labelForProcedureRecordResult(result).length).toBeGreaterThan(0);
    }
  });
});

describe("VP-4 Workflow presentation boundary", () => {
  it("authorizes only Workflow visual polish and metadata", () => {
    expect(VP4_WORKFLOW_SLICE.id).toBe("VP-4-WORKFLOW");
    expect(VP4_WORKFLOW_SLICE.presentationOnly).toBe(true);
    expect(VP4_WORKFLOW_SLICE.target).toBe("current-procedure-and-procedure-record-form");
    expect(VP4_WORKFLOW_SLICE.visualPolishAuthorized).toBe(true);
    expect(VP4_WORKFLOW_SLICE.workflowMetadataAuthorized).toBe(true);
    expect(VP4_WORKFLOW_SLICE.reviewReferenceOnly).toBe(true);
    expect(VP4_WORKFLOW_SLICE.reviewOutcomeRedesignAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.navigationSemanticsChangeAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.domainContractsMutationAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.permissionMutationAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.syntheticBoundaryChangeAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(VP4_WORKFLOW_SLICE.deployAuthorized).toBe(false);
  });
});

describe("FIELD-WORKFLOW UI FW-05 historical projection", () => {
  it("keeps v2 material on planVersion 2 (not Active v3)", () => {
    const projection = resolveProcedureReviewProjection(FIELD_WORKFLOW_REVIEW_MATERIAL_V2);
    expect(projection.status).toBe("RESOLVED");
    if (projection.status === "RESOLVED") {
      expect(projection.planVersion).toBe(2);
      expect(
        projectionUsesRecordPlanVersion(FIELD_WORKFLOW_REVIEW_MATERIAL_V2, projection.planVersion),
      ).toBe(true);
      expect(projection.supportMethods[0]).toContain("v2");
      expect(projection.supportMethods[0]).not.toContain("v3");
    }
  });

  it("fail-closes unresolved historical lookup without Active fallback", () => {
    const projection = resolveProcedureReviewProjection(FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED);
    expect(projection.status).toBe("UNRESOLVED");
    if (projection.status === "UNRESOLVED") {
      expect(projection.reason).toBe("FETCH_FAILED");
      expect(projection.planVersion).toBe(2);
    }
  });
});

describe("FIELD-WORKFLOW UI FW-09 synthetic save", () => {
  const context = FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId["user-a"].context;

  it("requires result before save", () => {
    const empty = createEmptyProcedureRecordDraft();
    expect(isProcedureRecordDraftReadyToSave(empty)).toBe(false);
    expect(
      isProcedureRecordDraftReadyToSave({
        ...empty,
        result: "PERFORMED_AS_PLANNED",
      }),
    ).toBe(true);
  });

  it("retains draft on save_failed and allows retry", () => {
    const draft = {
      result: "PERFORMED_WITH_ADAPTATION" as const,
      performedAtLocal: "2026-08-13T14:05",
      note: "keep-me",
    };
    const result = applySyntheticProcedureRecordSave({
      context,
      draft,
      outcome: "save_failed",
    });
    expect(result.saveState).toBe("save_failed");
    expect(result.draft.note).toBe("keep-me");
    expect(result.draft.result).toBe("PERFORMED_WITH_ADAPTATION");
    expect(result.context.planVersion).toBe(context.planVersion);
    expect(canRetryProcedureRecordSave(result.saveState)).toBe(true);
  });

  it("blocks immediate retry on save_outcome_unknown", () => {
    const draft = {
      result: "NOT_PERFORMED" as const,
      performedAtLocal: "2026-08-13T14:05",
      note: "unknown-path",
    };
    const result = applySyntheticProcedureRecordSave({
      context,
      draft,
      outcome: "save_outcome_unknown",
    });
    expect(result.saveState).toBe("save_outcome_unknown");
    expect(result.draft.note).toBe("unknown-path");
    expect(canRetryProcedureRecordSave(result.saveState)).toBe(false);
  });

  it("does not rebind saved context to a different plan version", () => {
    const result = applySyntheticProcedureRecordSave({
      context,
      draft: {
        result: "PERFORMED_AS_PLANNED",
        performedAtLocal: "2026-08-13T14:05",
        note: "",
      },
      outcome: "saved",
    });
    expect(result.context.planId).toBe(context.planId);
    expect(result.context.planVersion).toBe(context.planVersion);
    expect(result.context.procedureId).toBe(context.procedureId);
  });
});
