import {
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
  FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
  FIELD_WORKFLOW_UI_SLICE,
  VP4_WORKFLOW_SLICE,
  PROCEDURE_RECORD_RESULT_VALUES,
  buildStaffProcedureRecordCreateInput,
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
  createProcedureRecordSaveInFlightGuard,
  isProcedureRecordDraftReadyToSave,
  labelForProcedureRecordResult,
  persistStaffProcedureRecordFromForm,
  procedureResultCopyIsNonFailure,
  projectionUsesRecordPlanVersion,
  resolveProcedureReviewProjection,
  getKioskSyntheticTodaySupportItems,
} from "./index";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

describe("FIELD-WORKFLOW UI (#356) presentation boundary", () => {
  it("authorizes persist save and forbids synthetic success / live write", () => {
    expect(FIELD_WORKFLOW_UI_SLICE.id).toBe("FIELD-WORKFLOW-UI");
    expect(FIELD_WORKFLOW_UI_SLICE.issue).toBe("#356");
    expect(FIELD_WORKFLOW_UI_SLICE.syntheticProcedureWorkflowAuthorized).toBe(true);
    expect(FIELD_WORKFLOW_UI_SLICE.syntheticProcedureRecordSaveAuthorized).toBe(false);
    expect(FIELD_WORKFLOW_UI_SLICE.procedureRecordPersistAuthorized).toBe(true);
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

describe("FIELD-WORKFLOW UI persist save (KIOSK-SPFX-PERSISTENCE-1)", () => {
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

  it("PERSIST-05: staff save uses persistProcedureRecord, not synthetic success", async () => {
    const draft = {
      result: "PERFORMED_WITH_ADAPTATION" as const,
      performedAtLocal: "2026-08-13T14:05",
      note: "keep-me",
    };
    const result = await persistStaffProcedureRecordFromForm(
      buildStaffProcedureRecordCreateInput({
        context,
        draft,
        recordedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-13T14:10:00+09:00",
      }),
    );
    expect(result.persistCalled).toBe(true);
    expect(result.saveState).not.toBe("saved");
    expect(result.saveState).toBe("save_failed");
    expect(canRetryProcedureRecordSave(result.saveState)).toBe(true);
  });

  it("PERSIST-06: in-flight guard rejects a second begin", () => {
    const guard = createProcedureRecordSaveInFlightGuard();
    expect(guard.tryBegin()).toBe(true);
    expect(guard.tryBegin()).toBe(false);
    expect(guard.isInFlight()).toBe(true);
    guard.end();
    expect(guard.tryBegin()).toBe(true);
  });

  it("PERSIST-08: missing recordedBy is fail-closed", async () => {
    const result = await persistStaffProcedureRecordFromForm(
      buildStaffProcedureRecordCreateInput({
        context,
        draft: {
          result: "NOT_PERFORMED",
          performedAtLocal: "2026-08-13T14:05",
          note: "",
        },
        recordedBy: "",
        nowIso: "2026-08-13T14:10:00+09:00",
      }),
    );
    expect(result.persistCalled).toBe(false);
    expect(result.saveState).toBe("save_failed");
  });

  it("does not rebind saved context to a different plan version", async () => {
    const result = await persistStaffProcedureRecordFromForm(
      buildStaffProcedureRecordCreateInput({
        context,
        draft: {
          result: "PERFORMED_AS_PLANNED",
          performedAtLocal: "2026-08-13T14:05",
          note: "",
        },
        recordedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-13T14:10:00+09:00",
      }),
    );
    expect(result.persistCalled).toBe(true);
    expect(context.planVersion).toBe(3);
    expect(context.planId).toBe("synthetic-plan-001");
  });
});

describe("Kiosk Today Support synthetic fixture (read-model only)", () => {
  it("projects unique OccurrenceIds and staff-facing statuses", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const occurrenceIds = items.map((item) => item.occurrenceId);
    expect(items.length).toBe(4);
    expect(new Set(occurrenceIds).size).toBe(4);
    expect(occurrenceIds[0].length).toBe(64);
    expect(items.map((item) => item.effectiveStatus)).toEqual([
      "未実施",
      "記録済み",
      "取消済み",
      "未実施",
    ]);
  });
});
