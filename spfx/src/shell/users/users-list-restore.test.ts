import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  overlayForUserSessionSaveState,
} from "./users-session-save-overlay";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import {
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_UNRECORDED,
  filterUserRowsByStatusChip,
} from "./users-filter";
import {
  discardUsersListRestore,
  rememberUsersFilterChip,
  rememberUsersFocusOrigin,
  resolveUsersListRestoreTarget,
  shouldRetainUsersListRestore,
  USERS_LIST_RESTORE_DEFAULT_CHIP,
} from "./users-list-restore";

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 4 users list restore", () => {
  it("authorizes list restore only and keeps density / draft / next-user / live write closed", () => {
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listScrollRestoreAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.compactTabletUsersAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
  });

  it("remembers the presentation filter chip and discards to すべて", () => {
    expect(rememberUsersFilterChip(USERS_FILTER_CHIP_UNRECORDED)).toBe(
      USERS_FILTER_CHIP_UNRECORDED,
    );
    expect(rememberUsersFilterChip("not-a-chip")).toBe(USERS_LIST_RESTORE_DEFAULT_CHIP);
    expect(rememberUsersFilterChip(undefined)).toBe(USERS_FILTER_CHIP_ALL);
    expect(discardUsersListRestore()).toEqual({
      filterChip: USERS_FILTER_CHIP_ALL,
      originUserId: undefined,
    });
  });

  it("retains restore state only while destination is users", () => {
    expect(shouldRetainUsersListRestore("users")).toBe(true);
    expect(shouldRetainUsersListRestore("overview")).toBe(false);
    expect(shouldRetainUsersListRestore("records")).toBe(false);
    expect(shouldRetainUsersListRestore(undefined)).toBe(false);
  });

  it("identifies focus origin by userId, not array index or next 未記録 user", () => {
    expect(rememberUsersFocusOrigin("user-a")).toBe("user-a");
    expect(rememberUsersFocusOrigin("")).toBeUndefined();
    const unrecorded = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_UNRECORDED,
    );
    expect(unrecorded.map((row) => row.id)).toEqual(["user-a", "user-e"]);
    const target = resolveUsersListRestoreTarget({
      authorized: true,
      restoreRequested: true,
      originUserId: "user-a",
      visibleUserIds: unrecorded.map((row) => row.id),
      detailEnabledUserIds: ["user-a", "user-c"],
    });
    expect(target).toEqual({ kind: "detail-button", userId: "user-a" });
    expect(target.userId).not.toBe("user-e");
    expect(target.userId).not.toBe(unrecorded[1]?.id);
  });

  it("falls back to heading when origin is missing or filtered out, without changing chip membership", () => {
    const unrecordedIds = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_UNRECORDED,
    ).map((row) => row.id);
    expect(unrecordedIds).toEqual(["user-a", "user-e"]);
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: true,
        originUserId: "user-c",
        visibleUserIds: unrecordedIds,
        detailEnabledUserIds: ["user-a", "user-c"],
      }),
    ).toEqual({ kind: "heading" });
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: true,
        originUserId: "user-missing",
        visibleUserIds: DEMO_UX_USERS_FIXTURE.rows.map((row) => row.id),
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ kind: "heading" });
    expect(
      DEMO_UX_USERS_FIXTURE.rows.some((row) =>
        row.statusBadges.some((badge) => badge.id === "unrecorded"),
      ),
    ).toBe(true);
  });

  it("falls back to heading when origin is visible but the detail control is disabled", () => {
    const disabledOrigin = resolveUsersListRestoreTarget({
      authorized: true,
      restoreRequested: true,
      originUserId: "user-e",
      visibleUserIds: ["user-a", "user-e"],
      detailEnabledUserIds: ["user-a", "user-c"],
    });
    expect(disabledOrigin).toEqual({ kind: "heading" });
    expect(disabledOrigin.userId).toBeUndefined();
  });

  it("does not restore origin focus unless an explicit Users return is requested", () => {
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: false,
        originUserId: "user-a",
        visibleUserIds: ["user-a"],
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ kind: "heading" });
    expect(
      resolveUsersListRestoreTarget({
        authorized: false,
        restoreRequested: true,
        originUserId: "user-a",
        visibleUserIds: ["user-a"],
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ kind: "heading" });
  });

  it("keeps Unit 2 overlay independent from restore state", () => {
    expect(overlayForUserSessionSaveState("unsaved").visible).toBe(true);
    expect(overlayForUserSessionSaveState("saved")).toEqual({ visible: false });
    expect(overlayForUserSessionSaveState("save_failed")).toEqual({
      visible: true,
      state: "save_failed",
      label: "保存失敗",
    });
  });
});
