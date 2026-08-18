import { FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE } from "./users-session-save-overlay";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import {
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_DUE_SOON,
  USERS_FILTER_CHIP_LABELS,
  USERS_FILTER_CHIP_NEEDS_REVIEW,
  USERS_FILTER_CHIP_UNRECORDED,
  filterUserRowsByStatusChip,
} from "./users-filter";
import { resolveUsersListRestoreTarget, shouldRetainUsersListRestore } from "./users-list-restore";
import {
  USERS_LIST_COMPACT_CLASS,
  USERS_LIST_COMPACT_DENSITY,
  USERS_LIST_COMPACT_TABLET_MAX_WIDTH_PX,
  USERS_LIST_TOUCH_TARGET_MIN_HEIGHT,
  presentUsersListCompact,
} from "./users-list-compact";

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 5 compact tablet density", () => {
  it("authorizes compact tablet density only and keeps later units / live write closed", () => {
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.id).toBe("FIELD-STAFF-MULTI-USER-UX-POLISH-1");
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.parameterizedDetailCopyAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sessionSaveStateCardOverlayAuthorized).toBe(
      true,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextActionableOccurrenceAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listScrollRestoreAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.compactTabletUsersAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.eightUserDetailCatalogAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.procedureFixtureExpansionAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.deployAuthorized).toBe(false);
  });

  it("applies compact class and data attr only when authorized", () => {
    expect(presentUsersListCompact(false)).toEqual({
      authorized: false,
      dataAttr: "false",
      classNameModifier: undefined,
    });
    expect(presentUsersListCompact(true)).toEqual({
      authorized: true,
      dataAttr: "true",
      classNameModifier: USERS_LIST_COMPACT_CLASS,
    });
    expect(
      presentUsersListCompact(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.compactTabletUsersAuthorized)
        .dataAttr,
    ).toBe("true");
  });

  it("keeps tablet compact as a 768px single-column density change with 44px targets", () => {
    expect(USERS_LIST_COMPACT_TABLET_MAX_WIDTH_PX).toBe(768);
    expect(USERS_LIST_COMPACT_DENSITY.tabletMaxWidthPx).toBe(768);
    expect(USERS_LIST_COMPACT_DENSITY.keepSingleColumn).toBe(true);
    expect(USERS_LIST_COMPACT_DENSITY.keepDesktopThreeColumn).toBe(true);
    expect(USERS_LIST_COMPACT_DENSITY.touchTargetMinHeight).toBe(
      USERS_LIST_TOUCH_TARGET_MIN_HEIGHT,
    );
    expect(USERS_LIST_TOUCH_TARGET_MIN_HEIGHT).toBe("2.75rem");
    expect(USERS_LIST_COMPACT_DENSITY.listGap).toBe("0.75rem");
    expect(USERS_LIST_COMPACT_DENSITY.rowPaddingBlock).toBe("0.5rem");
    expect(USERS_LIST_COMPACT_DENSITY.metaFontSize).toBe("0.75rem");
  });

  it("does not change filter chip meaning or 未記録 membership", () => {
    expect(USERS_FILTER_CHIP_LABELS).toEqual([
      USERS_FILTER_CHIP_ALL,
      USERS_FILTER_CHIP_NEEDS_REVIEW,
      USERS_FILTER_CHIP_UNRECORDED,
      USERS_FILTER_CHIP_DUE_SOON,
    ]);
    expect(
      filterUserRowsByStatusChip(DEMO_UX_USERS_FIXTURE.rows, USERS_FILTER_CHIP_UNRECORDED).map(
        (row) => row.id,
      ),
    ).toEqual(["user-a", "user-e"]);
    expect(DEMO_UX_USERS_FIXTURE.rows).toHaveLength(8);
  });

  it("does not change Unit 4 restore origin selection", () => {
    expect(shouldRetainUsersListRestore("users")).toBe(true);
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: true,
        originUserId: "user-a",
        visibleUserIds: ["user-a", "user-e"],
        detailEnabledUserIds: ["user-a", "user-c"],
      }),
    ).toEqual({ kind: "detail-button", userId: "user-a" });
    expect(
      resolveUsersListRestoreTarget({
        authorized: true,
        restoreRequested: true,
        originUserId: "user-e",
        visibleUserIds: ["user-a", "user-e"],
        detailEnabledUserIds: ["user-a", "user-c"],
      }),
    ).toEqual({ kind: "heading" });
  });
});
