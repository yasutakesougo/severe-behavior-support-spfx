import { FIELD_WORKFLOW_CURRENT_USER_A } from "../procedure/procedure-fixture";
import {
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
} from "../procedure/procedure-record-draft";
import type { ProcedureRecordFormSaveSnapshot } from "../procedure/procedure-types";
import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  overlayForUserSessionSaveState,
} from "./users-session-save-overlay";
import { resolveUsersListRestoreTarget } from "./users-list-restore";
import {
  discardAllUserSessionDrafts,
  forgetUserSessionDraft,
  isResumeWorthySnapshot,
  rememberUserSessionDraft,
  resolveProcedureRecordResume,
  snapshotForUser,
} from "./users-session-draft-resume";

const CONTEXT_A = FIELD_WORKFLOW_CURRENT_USER_A.context;

function snapshot(partial: {
  saveState: ProcedureRecordFormSaveSnapshot["saveState"];
  result?: ProcedureRecordFormSaveSnapshot["draft"]["result"];
  note?: string;
  userId?: string;
  occurrenceId?: string;
}): ProcedureRecordFormSaveSnapshot {
  return {
    saveState: partial.saveState,
    draft: {
      result: partial.result,
      performedAtLocal: "2026-08-13T14:05",
      note: partial.note ?? "",
    },
    context: {
      ...CONTEXT_A,
      userId: partial.userId ?? CONTEXT_A.userId,
      occurrenceId: partial.occurrenceId ?? CONTEXT_A.occurrenceId,
    },
  };
}

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 6 per-user draft resume", () => {
  it("authorizes draft resume only and keeps later units / live write closed", () => {
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.id).toBe("FIELD-STAFF-MULTI-USER-UX-POLISH-1");
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sessionSaveStateCardOverlayAuthorized).toBe(
      true,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listScrollRestoreAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.compactTabletUsersAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.savingPauseRemovalAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveSavedCompletionOnCardsAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.deployAuthorized).toBe(false);
  });

  it("does not resume an empty unsaved form, and does resume user-entered unsaved values", () => {
    const empty = snapshot({ saveState: "unsaved" });
    expect(isResumeWorthySnapshot(empty)).toBe(false);
    expect(rememberUserSessionDraft({}, "user-a", empty)).toEqual({});
    const entered = snapshot({
      saveState: "unsaved",
      result: "PERFORMED_AS_PLANNED",
      note: "途中",
    });
    const stored = rememberUserSessionDraft({}, "user-a", entered);
    expect(snapshotForUser(stored, "user-a")).toEqual(entered);
    expect(
      resolveProcedureRecordResume({
        authorized: true,
        snapshot: entered,
        currentContext: CONTEXT_A,
      }),
    ).toEqual({
      resumed: true,
      draft: entered.draft,
      saveState: "unsaved",
    });
  });

  it("resumes save_failed and save_outcome_unknown without collapsing 5-state", () => {
    const failed = snapshot({
      saveState: "save_failed",
      result: "NOT_PERFORMED",
      note: "保持",
    });
    const unknown = snapshot({
      saveState: "save_outcome_unknown",
      result: "PERFORMED_WITH_ADAPTATION",
    });
    expect(
      resolveProcedureRecordResume({
        authorized: true,
        snapshot: failed,
        currentContext: CONTEXT_A,
      }).saveState,
    ).toBe("save_failed");
    expect(
      resolveProcedureRecordResume({
        authorized: true,
        snapshot: unknown,
        currentContext: CONTEXT_A,
      }).saveState,
    ).toBe("save_outcome_unknown");
    expect(overlayForUserSessionSaveState("save_failed")).toEqual({
      visible: true,
      state: "save_failed",
      label: "保存失敗",
    });
    expect(overlayForUserSessionSaveState("save_outcome_unknown")).toEqual({
      visible: true,
      state: "save_outcome_unknown",
      label: "保存結果不明",
    });
    expect(canRetryProcedureRecordSave("save_outcome_unknown")).toBe(false);
    expect(overlayForUserSessionSaveState("saved").visible).toBe(false);
  });

  it("resumes saved as saved instead of converting the form back to unsaved", () => {
    const saved = snapshot({ saveState: "saved", result: "PERFORMED_AS_PLANNED" });
    const resume = resolveProcedureRecordResume({
      authorized: true,
      snapshot: saved,
      currentContext: CONTEXT_A,
    });
    expect(resume).toEqual({
      resumed: true,
      draft: saved.draft,
      saveState: "saved",
    });
    expect(canRetryProcedureRecordSave(resume.saveState)).toBe(false);
  });

  it("does not restore another user's draft or a mismatched binding context", () => {
    const forA = snapshot({ saveState: "unsaved", result: "PERFORMED_AS_PLANNED" });
    const stored = rememberUserSessionDraft({}, "user-a", forA);
    expect(snapshotForUser(stored, "user-c")).toBeUndefined();
    expect(
      rememberUserSessionDraft({}, "user-a", snapshot({ saveState: "unsaved", userId: "user-c" })),
    ).toEqual({});
    expect(
      resolveProcedureRecordResume({
        authorized: true,
        snapshot: snapshot({
          saveState: "unsaved",
          result: "NOT_PERFORMED",
          occurrenceId: "occ-other",
        }),
        currentContext: CONTEXT_A,
      }).resumed,
    ).toBe(false);
    expect(
      resolveProcedureRecordResume({
        authorized: false,
        snapshot: forA,
        currentContext: CONTEXT_A,
      }),
    ).toEqual({
      resumed: false,
      draft: createEmptyProcedureRecordDraft(),
      saveState: "unsaved",
    });
  });

  it("forgets one user and discards the whole session map without changing Unit 4 restore", () => {
    const forA = snapshot({ saveState: "save_failed", result: "NOT_PERFORMED" });
    const stored = rememberUserSessionDraft({}, "user-a", forA);
    expect(forgetUserSessionDraft(stored, "user-a")).toEqual({});
    expect(discardAllUserSessionDrafts()).toEqual({});
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: true,
        originUserId: "user-a",
        visibleUserIds: ["user-a"],
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ kind: "detail-button", userId: "user-a" });
  });
});
