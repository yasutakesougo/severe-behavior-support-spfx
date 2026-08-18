import { countRowsWithBadgeId } from "../ux/kpi-review-count";
import { FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE } from "./next-unrecorded-user";
import {
  FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE,
  SYNTHETIC_RECORDED_FOR_TODAY_LABEL,
  ariaLabelForSyntheticRecordedForToday,
  isFixtureUnrecordedUserId,
  presentSyntheticRecordedForToday,
} from "./synthetic-recorded-for-today";
import { USERS_FILTER_CHIP_UNRECORDED, filterUserRowsByStatusChip } from "./users-filter";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  overlayForUserId,
  overlayForUserSessionSaveState,
} from "./users-session-save-overlay";

const PERSISTENCE_SUCCESS_WORDING = ["保存済み", "記録済み", "完了"] as const;

describe("FIELD-STAFF-COMPLETION-ON-CARDS-1 M2 synthetic recorded-for-today", () => {
  const rows = DEMO_UX_USERS_FIXTURE.rows;

  it("authorizes M2 presentation only and keeps remaining flags / live write closed", () => {
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.id).toBe("FIELD-STAFF-COMPLETION-ON-CARDS-1");
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.syntheticRecordedForTodayAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.syntheticRecordedForTodayAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(true);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.syntheticRecordedForTodayAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveSavedCompletionOnCardsAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.eightUserDetailCatalogAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.procedureFixtureExpansionAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listToRecordFastPathAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.savingPauseRemovalAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.deployAuthorized).toBe(false);
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.liveSavedCompletionOnCardsAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
  });

  it("hides M2 for static unrecorded fixture rows user-a and user-e", () => {
    expect(isFixtureUnrecordedUserId("user-a")).toBe(true);
    expect(isFixtureUnrecordedUserId("user-e")).toBe(true);
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-a" })).toEqual({
      visible: false,
    });
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-e" })).toEqual({
      visible: false,
    });
  });

  it("shows M2 for recorded fixture rows such as user-b without rewriting badges", () => {
    const recordedIds = rows
      .filter((row) => !row.statusBadges.some((badge) => badge.id === "unrecorded"))
      .map((row) => row.id);
    expect(recordedIds).toEqual(["user-b", "user-c", "user-d", "user-f", "user-g", "user-h"]);
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" })).toEqual({
      visible: true,
      label: SYNTHETIC_RECORDED_FOR_TODAY_LABEL,
    });
    for (const userId of recordedIds) {
      const presentation = presentSyntheticRecordedForToday({ authorized: true, userId });
      expect(presentation.visible).toBe(true);
      if (presentation.visible) {
        expect(presentation.label).toBe("本日記録した（合成データ）");
        expect(presentation.label).toContain("本日記録した");
        expect(presentation.label).toContain("合成データ");
      }
    }
  });

  it("does not mutate unrecorded badges or Family R KPI counts", () => {
    const badgesBefore = rows.map((row) => row.statusBadges);
    presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" });
    presentSyntheticRecordedForToday({ authorized: true, userId: "user-a" });
    expect(rows.map((row) => row.statusBadges)).toEqual(badgesBefore);
    expect(rows[0]?.statusBadges).toBe(badgesBefore[0]);
    expect(
      filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_UNRECORDED).map((row) => row.id),
    ).toEqual(["user-a", "user-e"]);
    expect(countRowsWithBadgeId(rows, "needs_review")).toBe(3);
    expect(countRowsWithBadgeId(rows, "unrecorded")).toBe(2);
    expect(countRowsWithBadgeId(rows, "deadline_near")).toBe(3);
  });

  it("does not convert session save-state into M2 and does not update after saved", () => {
    const beforeA = presentSyntheticRecordedForToday({ authorized: true, userId: "user-a" });
    const beforeB = presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" });
    overlayForUserSessionSaveState("saved");
    overlayForUserId("user-a", { "user-a": "saved" });
    overlayForUserId("user-b", { "user-b": "saved" });
    overlayForUserId("user-b", { "user-b": "saving" });
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-a" })).toEqual(
      beforeA,
    );
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" })).toEqual(
      beforeB,
    );
    expect(beforeA.visible).toBe(false);
    expect(beforeB.visible).toBe(true);
  });

  it("does not read unknown ids or unauthorized calls as recorded-for-today", () => {
    expect(presentSyntheticRecordedForToday({ authorized: false, userId: "user-b" })).toEqual({
      visible: false,
    });
    expect(presentSyntheticRecordedForToday({ authorized: true, userId: "user-missing" })).toEqual({
      visible: false,
    });
    expect(isFixtureUnrecordedUserId("user-missing")).toBe(false);
  });

  it("uses synthetic recorded-for-today copy instead of persistence-success wording", () => {
    const visible = presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" });
    expect(visible.visible).toBe(true);
    if (visible.visible) {
      for (const forbidden of PERSISTENCE_SUCCESS_WORDING) {
        expect(visible.label).not.toContain(forbidden);
      }
    }
  });

  it("names the M2 chip for assistive tech as synthetic recorded-for-today", () => {
    const visible = presentSyntheticRecordedForToday({ authorized: true, userId: "user-b" });
    const hidden = presentSyntheticRecordedForToday({ authorized: true, userId: "user-a" });
    expect(ariaLabelForSyntheticRecordedForToday("Bさん", visible)).toBe(
      "Bさんの合成データ: 本日記録した",
    );
    expect(ariaLabelForSyntheticRecordedForToday("Aさん", hidden)).toBeUndefined();
    const aria = ariaLabelForSyntheticRecordedForToday("Bさん", visible);
    expect(aria).toContain("本日記録した");
    expect(aria).toContain("合成データ");
    for (const forbidden of PERSISTENCE_SUCCESS_WORDING) {
      expect(aria).not.toContain(forbidden);
    }
  });
});
