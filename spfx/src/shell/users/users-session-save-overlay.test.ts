import { SHELL_SAVE_STATE_LABELS, SHELL_SAVE_STATES } from "../ux/save-state";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import { USERS_FILTER_CHIP_UNRECORDED, filterUserRowsByStatusChip } from "./users-filter";
import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  USERS_SESSION_SAVE_OVERLAY_STATES,
  ariaLabelForUsersSessionSaveOverlay,
  overlayForUserId,
  overlayForUserSessionSaveState,
  rememberUserSessionSaveState,
} from "./users-session-save-overlay";

const PERSISTENCE_SUCCESS_WORDING = [
  "記録済み",
  "保存済み",
  "本日記録した",
  "完了",
  "登録済み",
  "送信済み",
] as const;

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 2 session save overlay", () => {
  it("authorizes card overlay only and keeps later units / live write closed", () => {
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.id).toBe("FIELD-STAFF-MULTI-USER-UX-POLISH-1");
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sessionSaveStateCardOverlayAuthorized).toBe(
      true,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveSavedCompletionOnCardsAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listScrollRestoreAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.compactTabletUsersAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.deployAuthorized).toBe(false);
  });

  it("maps default / untouched and unsaved to 未保存", () => {
    const missing = overlayForUserSessionSaveState(undefined);
    const unsaved = overlayForUserSessionSaveState("unsaved");
    expect(missing).toEqual({ visible: true, state: "unsaved", label: "未保存" });
    expect(unsaved).toEqual({ visible: true, state: "unsaved", label: "未保存" });
    expect(SHELL_SAVE_STATE_LABELS.unsaved).toBe("未保存");
  });

  it("maps saving to 保存中", () => {
    expect(overlayForUserSessionSaveState("saving")).toEqual({
      visible: true,
      state: "saving",
      label: "保存中",
    });
  });

  it("maps definite failure to 保存失敗", () => {
    expect(overlayForUserSessionSaveState("save_failed")).toEqual({
      visible: true,
      state: "save_failed",
      label: "保存失敗",
    });
  });

  it("maps save_outcome_unknown to 保存結果不明 and does not treat unknown as success", () => {
    const overlay = overlayForUserSessionSaveState("save_outcome_unknown");
    expect(overlay).toEqual({
      visible: true,
      state: "save_outcome_unknown",
      label: "保存結果不明",
    });
    expect(overlay.visible).toBe(true);
    if (overlay.visible) {
      expect(overlay.label).not.toBe(SHELL_SAVE_STATE_LABELS.saved);
      expect(overlay.label).not.toBe(SHELL_SAVE_STATE_LABELS.save_failed);
      expect(overlay.state).not.toBe("unsaved");
    }
    const saved = overlayForUserSessionSaveState("saved");
    expect(saved.visible).toBe(false);
    expect(overlay.visible).not.toBe(saved.visible);
  });

  it("hides overlay for saved instead of introducing persistence-success wording", () => {
    const overlay = overlayForUserSessionSaveState("saved");
    expect(overlay.visible).toBe(false);
    expect(USERS_SESSION_SAVE_OVERLAY_STATES).not.toContain("saved");
    for (const state of USERS_SESSION_SAVE_OVERLAY_STATES) {
      const visible = overlayForUserSessionSaveState(state);
      expect(visible.visible).toBe(true);
      if (visible.visible) {
        for (const forbidden of PERSISTENCE_SUCCESS_WORDING) {
          expect(visible.label).not.toContain(forbidden);
        }
      }
    }
  });

  it("does not apply a chrome-level saved fixture to untouched users", () => {
    const overlay = overlayForUserId("user-a", undefined);
    expect(overlay).toEqual({ visible: true, state: "unsaved", label: "未保存" });
    expect(overlayForUserId("user-a", {})).toEqual(overlay);
  });

  it("resolves per-user session state without changing existing 5-state vocabulary", () => {
    expect(SHELL_SAVE_STATES).toEqual([
      "unsaved",
      "saving",
      "saved",
      "save_failed",
      "save_outcome_unknown",
    ]);
    expect(SHELL_SAVE_STATE_LABELS.saved).toBe("保存済み");
    const byUserId = rememberUserSessionSaveState({}, "user-a", "save_failed");
    expect(overlayForUserId("user-a", byUserId)).toEqual({
      visible: true,
      state: "save_failed",
      label: "保存失敗",
    });
    expect(overlayForUserId("user-b", byUserId)).toEqual({
      visible: true,
      state: "unsaved",
      label: "未保存",
    });
    expect(rememberUserSessionSaveState(byUserId, undefined, "saving")).toBe(byUserId);
  });

  it("keeps existing 未記録 semantics and fixture-derived person labels unchanged", () => {
    const rows = DEMO_UX_USERS_FIXTURE.rows;
    const badgesBefore = rows.map((row) => row.statusBadges);
    overlayForUserSessionSaveState("saving");
    overlayForUserId("user-a", { "user-a": "save_failed" });
    expect(rows[0]?.statusBadges).toBe(badgesBefore[0]);
    expect(rows.map((row) => row.statusBadges)).toEqual(badgesBefore);
    expect(
      filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_UNRECORDED).map((row) => row.id),
    ).toEqual(["user-a", "user-e"]);
    expect(rows.map((row) => row.personLabel)).toEqual([
      "Aさん",
      "Bさん",
      "Cさん",
      "Dさん",
      "Eさん",
      "Fさん",
      "Gさん",
      "Hさん",
    ]);
  });

  it("names the overlay for assistive tech without using 未記録", () => {
    const overlay = overlayForUserSessionSaveState("save_failed");
    const label = ariaLabelForUsersSessionSaveOverlay("Aさん", overlay);
    expect(label).toBe("Aさんのセッション内保存状態: 保存失敗");
    expect(label).not.toContain("未記録");
    expect(ariaLabelForUsersSessionSaveOverlay("Aさん", { visible: false })).toBeUndefined();
  });
});
