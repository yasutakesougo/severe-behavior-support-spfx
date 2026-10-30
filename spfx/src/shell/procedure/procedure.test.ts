import { DEMO_UX_USER_DETAIL_FIXTURE } from "../users";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { CurrentProcedure } from "./CurrentProcedure";
import { AppShellChrome } from "../ux/AppShellChrome";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../ux/fixture";
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
  canInvokeProcedureRecordStart,
  FIELD_STAFF_PHASE8_CORRECTION_1_SLICE,
  getKioskSyntheticTodaySupportItems,
  isProcedureRecordStartAllowed,
  presentProcedureCorrection,
  FIELD_STAFF_ABC_PRESENTATION_1_SLICE,
  presentAbcObservation,
  FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE,
  buildProcedureCorrectionOriginalBinding,
  isCorrectionDraftReadyToSave,
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
    expect(current.canStartProcedureRecord).toBe(true);
    expect(isProcedureRecordStartAllowed(current)).toBe(true);
  });

  it("keeps result vocabulary factual (non-failure copy)", () => {
    for (const result of PROCEDURE_RECORD_RESULT_VALUES) {
      expect(procedureResultCopyIsNonFailure(result)).toBe(true);
      expect(labelForProcedureRecordResult(result).length).toBeGreaterThan(0);
    }
  });
});

describe("FIELD-STAFF-ABC-PRESENTATION-1 read-only boundary", () => {
  it("presents ABC context without authorizing observation or lifecycle writes", () => {
    expect(FIELD_STAFF_ABC_PRESENTATION_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_ABC_PRESENTATION_1_SLICE.readOnly).toBe(true);
    expect(FIELD_STAFF_ABC_PRESENTATION_1_SLICE.observationSaveAuthorized).toBe(false);
    expect(FIELD_STAFF_ABC_PRESENTATION_1_SLICE.lifecycleChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_ABC_PRESENTATION_1_SLICE.sharePointWriteAuthorized).toBe(false);
    const presentation = presentAbcObservation(
      FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId["user-a"].context,
    );
    expect(presentation?.context.userId).toBe("user-a");
    expect(presentation?.context.planVersion).toBe(3);
    expect(presentation?.antecedent.length).toBeGreaterThan(0);
    expect(presentation?.behavior.length).toBeGreaterThan(0);
    expect(presentation?.aftermath.length).toBeGreaterThan(0);
  });

  it("fails closed without a procedure binding context", () => {
    expect(presentAbcObservation(undefined)).toBeUndefined();
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

  it("VP-F: CREATE input stays without OccurrenceId", () => {
    const input = buildStaffProcedureRecordCreateInput({
      context: { ...context, occurrenceId: "synthetic-occurrence-must-not-bind" },
      draft: {
        result: "PERFORMED_AS_PLANNED",
        performedAtLocal: "2026-08-13T14:05",
        note: "",
      },
      recordedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
      nowIso: "2026-08-13T14:10:00+09:00",
    });
    expect("OccurrenceId" in input).toBe(false);
    expect("occurrenceId" in input).toBe(false);
  });
});

describe("Kiosk Today Support synthetic fixture (read-model only)", () => {
  it("projects unique OccurrenceIds and staff-facing statuses", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const occurrenceIds = items.map((item) => item.occurrenceId);
    expect(items.length).toBe(5);
    expect(new Set(occurrenceIds).size).toBe(5);
    expect(occurrenceIds[0].length).toBe(64);
    expect(items.map((item) => item.effectiveStatus)).toEqual([
      "未実施",
      "記録済み",
      "取消済み",
      "未実施",
      "確認が必要",
    ]);
  });

  it("keeps repeated ProcedureIds as distinct occurrences", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const lunch = items.filter((item) => item.procedure.ProcedureId === "proc-lunch");
    expect(lunch).toHaveLength(2);
    expect(lunch[0].occurrenceId).not.toBe(lunch[1].occurrenceId);
    expect(lunch.map((item) => item.effectiveStatus)).toEqual(["記録済み", "未実施"]);
  });

  it("keeps observation on the recorded occurrence only", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み");
    expect(recorded?.observation?.condition).toBe("落ち着いていた");
    expect(items.filter((item) => item.observation)).toHaveLength(1);
  });

  it("authorizes record CTA only for 未実施 and fail-closes other states", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const unrecorded = items.filter((item) => item.effectiveStatus === "未実施");
    const recorded = items.find((item) => item.effectiveStatus === "記録済み");
    const cancelled = items.find((item) => item.effectiveStatus === "取消済み");
    const conflict = items.find((item) => item.effectiveStatus === "確認が必要");

    expect(unrecorded.length).toBeGreaterThan(0);
    expect(unrecorded.every((item) => item.canStartProcedureRecord)).toBe(true);
    expect(unrecorded.every((item) => isProcedureRecordStartAllowed(item))).toBe(true);
    expect(recorded?.canStartProcedureRecord).toBe(false);
    expect(cancelled?.canStartProcedureRecord).toBe(false);
    expect(conflict?.canStartProcedureRecord).toBe(false);
    expect(
      items
        .filter((item) => item.effectiveStatus !== "未実施")
        .every((item) => !item.canStartProcedureRecord),
    ).toBe(true);
  });

  it("blocks ProcedureRecordForm open at the handler even if invoked unexpectedly", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み");
    const cancelled = items.find((item) => item.effectiveStatus === "取消済み");
    const conflict = items.find((item) => item.effectiveStatus === "確認が必要");
    const unrecorded = items.find((item) => item.effectiveStatus === "未実施");

    const openAttempt = (
      item: NonNullable<typeof recorded>,
      extra?: { interactionPaused?: boolean; currentProcedureOpen?: boolean },
    ): boolean =>
      canInvokeProcedureRecordStart({
        interactionPaused: extra?.interactionPaused ?? false,
        currentProcedureOpen: extra?.currentProcedureOpen ?? true,
        selectedUserDetailId: "user-a",
        presentation: { canStartProcedureRecord: item.canStartProcedureRecord },
      });

    expect(openAttempt(unrecorded!)).toBe(true);
    expect(openAttempt(recorded!)).toBe(false);
    expect(openAttempt(cancelled!)).toBe(false);
    expect(openAttempt(conflict!)).toBe(false);
    expect(openAttempt(unrecorded!, { interactionPaused: true })).toBe(false);
    expect(openAttempt(unrecorded!, { currentProcedureOpen: false })).toBe(false);
    expect(
      canInvokeProcedureRecordStart({
        interactionPaused: false,
        currentProcedureOpen: true,
        selectedUserDetailId: "user-a",
        presentation: undefined,
      }),
    ).toBe(false);
  });

  it("exposes synthetic correction only for statuses with one bound record", () => {
    expect(FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.correctionEntryAuthorized).toBe(true);
    expect(FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.saveSemanticsChangeAuthorized).toBe(false);
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み");
    const cancelled = items.find((item) => item.effectiveStatus === "取消済み");
    const conflict = items.find((item) => item.effectiveStatus === "確認が必要");
    const makeContext = (
      item: NonNullable<typeof recorded>,
    ): {
      userId: string;
      personLabel: string;
      organizationId: string;
      siteId: string;
      planId: string;
      planVersion: number;
      procedureId: string;
      procedureVersion: string;
      planPeriodLabel: string;
      occurrenceId: string;
    } => ({
      userId: item.userId,
      personLabel: item.personLabel,
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      planId: item.planId,
      planVersion: item.planVersion,
      procedureId: item.procedure.ProcedureId,
      procedureVersion: item.procedure.ProcedureVersion,
      planPeriodLabel: "合成期間",
      occurrenceId: item.occurrenceId,
    });

    const recordedCorrection = presentProcedureCorrection(recorded, makeContext(recorded!));
    const cancelledCorrection = presentProcedureCorrection(cancelled, makeContext(cancelled!));
    const conflictCorrection = presentProcedureCorrection(conflict, makeContext(conflict!));

    expect(recordedCorrection?.recordId).toBe(recorded?.boundRecord?.RecordId);
    expect(recordedCorrection?.occurrenceStatus).toBe("記録済み");
    expect(cancelledCorrection?.recordId).toBe(cancelled?.boundRecord?.RecordId);
    expect(cancelledCorrection?.occurrenceStatus).toBe("取消済み");
    expect(conflictCorrection).toBeUndefined();
  });
});

describe("FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1", () => {
  it("authorizes fake-port save wiring only", () => {
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.id).toBe(
      "FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1",
    );
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.correctionSaveWiringAuthorized).toBe(true);
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.correctionPersistAuthorized).toBe(true);
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.liveWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.sharePointWriteAuthorized).toBe(false);
  });

  it("gates binding availability fail-closed", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み")!;
    const context = {
      userId: recorded.userId,
      personLabel: recorded.personLabel,
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      planId: recorded.planId,
      planVersion: recorded.planVersion,
      procedureId: recorded.procedure.ProcedureId,
      procedureVersion: recorded.procedure.ProcedureVersion,
      planPeriodLabel: "合成期間",
      occurrenceId: recorded.occurrenceId,
    };
    expect(
      buildProcedureCorrectionOriginalBinding(context, recorded.boundRecord, recorded),
    ).toBeDefined();
    expect(
      buildProcedureCorrectionOriginalBinding(context, recorded.boundRecord, undefined),
    ).toBeUndefined();
    expect(buildProcedureCorrectionOriginalBinding(context, recorded.boundRecord)).toBeUndefined();
    expect(buildProcedureCorrectionOriginalBinding(context, undefined, recorded)).toBeUndefined();
    expect(
      isCorrectionDraftReadyToSave(
        {
          result: "PERFORMED_AS_PLANNED",
          performedAtLocal: "2026-08-17T21:05",
          reason: "test",
        },
        "2026-08-17",
      ),
    ).toBe(true);
  });
});

describe("SBS-U6-A Procedure presentation guard & fail-closed resolution", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    document.body.removeChild(container);
  });

  it("fail-closes record start eligibility when lookupStatus is UNRESOLVED", () => {
    expect(
      isProcedureRecordStartAllowed({
        canStartProcedureRecord: true,
        lookupStatus: "UNRESOLVED",
      }),
    ).toBe(false);

    expect(
      canInvokeProcedureRecordStart({
        interactionPaused: false,
        currentProcedureOpen: true,
        selectedUserDetailId: "user-a",
        presentation: {
          canStartProcedureRecord: true,
          lookupStatus: "UNRESOLVED",
        },
      }),
    ).toBe(false);
  });

  it("renders safe unresolved guard and omits procedure body/CTAs while preserving back button", () => {
    const onBackMock = jest.fn();
    const unresolvedPresentation = {
      heading: "現在の支援手順",
      summaryPrompt: "選択された支援計画の手順本文は未配線です（A2正本Resolver未接続）。",
      lookupStatus: "UNRESOLVED" as const,
      unresolvedReason:
        "選択された支援計画（第1版）の手順詳細は現在未配線です。誤表示防止のため手順本文は表示されません。",
      canStartProcedureRecord: false,
      occurrenceStatus: "未実施" as const,
      context: {
        organizationId: "synthetic-org-001",
        siteId: "SITE-ISG",
        userId: "user-a",
        personLabel: "Aさん",
        procedureId: "proc-lunch",
        procedureVersion: "v1",
        planId: "plan-001",
        planVersion: 1,
        planPeriodLabel: "未配線（A2未接続）",
        occurrenceId: "occ-test-001",
      },
      projection: undefined,
    };

    act(() => {
      ReactDOM.render(
        React.createElement(CurrentProcedure, {
          presentation: unresolvedPresentation,
          backLabel: "← 今日の支援",
          onBackToUserDetail: onBackMock,
          onRecordProcedureRequest: jest.fn(),
          onCorrectionRequest: jest.fn(),
          onCancellationRequest: jest.fn(),
          onAbcObservationRequest: jest.fn(),
        }) as React.ReactElement,
        container,
      );
    });

    const text = container.textContent ?? "";
    expect(text).toContain("手順本文の確認");
    expect(text).toContain(
      "選択された支援計画（第1版）の手順詳細は現在未配線です。誤表示防止のため手順本文は表示されません。",
    );

    // Procedure body projection must NOT be displayed
    expect(text).not.toContain("場面");
    expect(text).not.toContain("活動の切り替え場面");
    expect(text).not.toContain("避ける支援");
    expect(text).not.toContain("留意点");

    // Record / correction CTAs must NOT be displayed
    expect(text).not.toContain("この手順を記録");
    expect(text).not.toContain("記録の訂正");

    // Back button must be rendered and functional
    const backBtn = container.querySelector("button");
    expect(backBtn).not.toBeNull();
    expect(backBtn?.textContent).toContain("← 今日の支援");
    act(() => {
      backBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it("non-regression: renders full procedure body and CTAs when presentation is RESOLVED", () => {
    const resolvedPresentation = FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId["user-a"];
    expect(resolvedPresentation).toBeDefined();

    act(() => {
      ReactDOM.render(
        React.createElement(CurrentProcedure, {
          presentation: resolvedPresentation,
          backLabel: "← 利用者詳細",
          onBackToUserDetail: jest.fn(),
          onRecordProcedureRequest: jest.fn(),
        }) as React.ReactElement,
        container,
      );
    });

    const text = container.textContent ?? "";
    expect(text).toContain("場面");
    expect(text).toContain("活動の切り替え場面（食堂→作業）");
    expect(text).toContain("写真カードで次の活動を示す");
    expect(text).toContain("突然大きな声で急かす");
    expect(text).toContain("この手順を記録");
  });

  it("fail-closes presentProcedureCorrection on metadata mismatch or tampered record id", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み")!;
    const makeContext = (
      overrides: Partial<{
        userId: string;
        personLabel: string;
        organizationId: string;
        siteId: string;
        planId: string;
        planVersion: number;
        procedureId: string;
        procedureVersion: string;
        planPeriodLabel: string;
        occurrenceId: string;
      }> = {},
    ): {
      userId: string;
      personLabel: string;
      organizationId: string;
      siteId: string;
      planId: string;
      planVersion: number;
      procedureId: string;
      procedureVersion: string;
      planPeriodLabel: string;
      occurrenceId: string;
    } => ({
      userId: recorded.userId,
      personLabel: recorded.personLabel,
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      planId: recorded.planId,
      planVersion: recorded.planVersion,
      procedureId: recorded.procedure.ProcedureId,
      procedureVersion: recorded.procedure.ProcedureVersion,
      planPeriodLabel: "合成期間",
      occurrenceId: recorded.occurrenceId,
      ...overrides,
    });

    // Valid case
    expect(presentProcedureCorrection(recorded, makeContext())).toBeDefined();

    // Context metadata mismatches
    expect(
      presentProcedureCorrection(recorded, makeContext({ userId: "other-user" })),
    ).toBeUndefined();
    expect(
      presentProcedureCorrection(recorded, makeContext({ planId: "other-plan" })),
    ).toBeUndefined();
    expect(presentProcedureCorrection(recorded, makeContext({ planVersion: 99 }))).toBeUndefined();
    expect(
      presentProcedureCorrection(recorded, makeContext({ procedureId: "other-proc" })),
    ).toBeUndefined();
    expect(
      presentProcedureCorrection(recorded, makeContext({ procedureVersion: "v99" })),
    ).toBeUndefined();
    expect(
      presentProcedureCorrection(recorded, makeContext({ organizationId: "other-org" })),
    ).toBeUndefined();
    expect(
      presentProcedureCorrection(recorded, makeContext({ siteId: "other-site" })),
    ).toBeUndefined();

    // Tampered effectiveRecordId on rawResolverResult
    const tamperedRecorded = {
      ...recorded,
      rawResolverResult: {
        ...recorded.rawResolverResult,
        effectiveRecordId: "tampered-record-id-000000000000000000000000000000000000000000000",
      } as typeof recorded.rawResolverResult,
    };
    expect(presentProcedureCorrection(tamperedRecorded, makeContext())).toBeUndefined();
  });

  it("renders safe unresolved guard in AppShellChrome when occurrence is missing (Fixup 1)", () => {
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-PROCEDURE",
          fieldStaffChosenOccurrenceId: "non-existent-occurrence-999",
        }) as React.ReactElement,
        container,
      );
    });

    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("UNRESOLVED");

    const text = container.textContent ?? "";
    expect(text).toContain("手順本文の確認");
    expect(text).toContain(
      "指定された支援手順（occurrence）が見つかりません。安全のため手順詳細は表示されません。",
    );
    expect(text).not.toContain("活動の切り替え場面");
    expect(text).toContain("← 今日の支援");

    // Must NOT fall through to UserDetail
    const userDetail = container.querySelector('[data-field-workflow="user-detail"]');
    expect(userDetail).toBeNull();
  });

  it("shields D-RECORD-WRITE direct restoration and prevents ProcedureRecordForm open (Fixup 2)", async () => {
    const items = getKioskSyntheticTodaySupportItems();
    const unrecorded = items.find((item) => item.effectiveStatus === "未実施")!;
    expect(unrecorded).toBeDefined();

    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-RECORD-WRITE",
          fieldStaffChosenOccurrenceId: unrecorded.occurrenceId,
        }) as React.ReactElement,
        container,
      );
    });

    // Await coordinator resolution microtasks
    for (let r = 0; r < 10; r++) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    // Record form must NOT be rendered
    const form = container.querySelector('[data-field-workflow="procedure-record-form"]');
    expect(form).toBeNull();

    // CurrentProcedure must be rendered in RESOLVED state via Canonical Resolver
    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("RESOLVED");

    const text = container.textContent ?? "";
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
    expect(text).toContain("次の活動内容を絵カードやスケジュール表で事前に提示する。");
    expect(text).not.toContain("この手順を記録");
    expect(container.querySelector('[data-field-workflow="record-procedure-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="procedure-correction"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="procedure-cancellation"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="abc-observation"]')).toBeNull();
  });

  it("shields downstream correction and cancellation for unresolved occurrence flow (Fixup 2 & 3)", async () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み")!;

    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-PROCEDURE",
          fieldStaffChosenOccurrenceId: recorded.occurrenceId,
        }) as React.ReactElement,
        container,
      );
    });

    // Await coordinator resolution microtasks
    for (let r = 0; r < 10; r++) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    // Downstream correction and cancellation screens must NOT be open
    expect(container.querySelector('[data-field-workflow="procedure-correction"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="procedure-cancellation"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="abc-observation"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-procedure-cta"]')).toBeNull();

    // Must be in RESOLVED state via Canonical Resolver
    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("RESOLVED");
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
    expect(container.textContent).toContain(
      "次の活動内容を絵カードやスケジュール表で事前に提示する。",
    );
    expect(container.textContent).not.toContain("活動の切り替え場面");
  });
  it("renders independent unresolved screen for missing occurrence when user-a is absent (Fix 1)", () => {
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          userDetailPresentation: {
            ...DEMO_UX_USER_DETAIL_FIXTURE,
            userId: "user-custom",
            personLabel: "カスタム利用者",
          },
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-PROCEDURE",
          fieldStaffChosenOccurrenceId: "missing-occurrence-999",
        }) as React.ReactElement,
        container,
      );
    });

    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("UNRESOLVED");
    expect(currentProc?.getAttribute("data-field-workflow-user")).toBe("");
    expect(container.textContent).toContain("指定された支援手順（occurrence）が見つかりません。");
    expect(container.textContent).toContain("対象者未特定");
    expect(container.querySelector('[data-field-workflow="record-procedure-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-correction-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-cancellation-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="abc-observation-cta"]')).toBeNull();

    const backBtn = container.querySelector('[data-field-workflow="current-procedure-back"]');
    expect(backBtn).not.toBeNull();
    expect(backBtn?.textContent).toBe("← 今日の支援");
  });

  it("does not borrow previously selected user identity when navigating to missing occurrence (Fix 1)", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const otherItem = items.find((item) => item.userId === "user-b") ?? items[1];

    // First render with a different occurrence / user
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-PROCEDURE",
          fieldStaffChosenOccurrenceId: otherItem.occurrenceId,
        }) as React.ReactElement,
        container,
      );
    });

    // Now re-render with a missing occurrence ID
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-PROCEDURE",
          fieldStaffChosenOccurrenceId: "missing-occurrence-888",
        }) as React.ReactElement,
        container,
      );
    });

    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("UNRESOLVED");
    // Identity must NOT be borrowed from the previous user
    expect(currentProc?.getAttribute("data-field-workflow-user")).toBe("");
    expect(container.textContent).toContain("対象者未特定");
    expect(container.textContent).toContain("指定された支援手順（occurrence）が見つかりません。");
  });

  it("preserves D-RECORD-WRITE flow without falling back to unintended projection", () => {
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          onFieldStaffSessionEvent: jest.fn(),
          fieldStaffTaskDestination: "D-RECORD-WRITE",
          fieldStaffChosenOccurrenceId: "missing-occurrence-777",
        }) as React.ReactElement,
        container,
      );
    });

    expect(container.querySelector('[data-field-workflow="procedure-record-form"]')).toBeNull();
    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc?.getAttribute("data-field-workflow-lookup-status")).toBe("UNRESOLVED");
  });

  it("preserves existing synthetic v3 procedure presentation via UserDetail without claiming A2 canonical resolved (Minor)", () => {
    act(() => {
      ReactDOM.render(
        React.createElement(AppShellChrome, {
          demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
          siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
          saveState: "saved",
          viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
          correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
          errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
          userDisplayName: "Synthetic Field Staff",
          presentationRole: "FIELD_STAFF",
          selectedDestination: "users",
        }) as React.ReactElement,
        container,
      );
    });

    const userDetailBtn = container.querySelector(
      'button[data-demo-ux="users-detail-button"]',
    ) as HTMLButtonElement | null;
    expect(userDetailBtn).not.toBeNull();
    act(() => {
      userDetailBtn!.click();
    });

    const reqBtn = container.querySelector(
      'button[data-field-workflow="open-current-procedure"]',
    ) as HTMLButtonElement | null;
    expect(reqBtn).not.toBeNull();
    act(() => {
      reqBtn!.click();
    });

    const currentProc = container.querySelector('[data-field-workflow="current-procedure"]');
    expect(currentProc).not.toBeNull();
    expect(currentProc!.getAttribute("data-field-workflow-lookup-status")).not.toBe("RESOLVED");
    expect(currentProc!.getAttribute("data-field-workflow-lookup-status")).toBe("SYNTHETIC_V3");
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
    expect(container.textContent).toContain("支援の流れ");
    expect(container.textContent).toContain("活動の切り替え場面");
    expect(container.querySelector('[data-field-workflow="record-procedure-cta"]')).not.toBeNull();
  });
});
