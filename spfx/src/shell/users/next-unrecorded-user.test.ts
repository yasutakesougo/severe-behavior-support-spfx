import { getKioskSyntheticTodaySupportItems } from "../procedure/kiosk-today-support-fixture";
import { selectNextActionableOccurrence } from "../procedure/next-actionable-occurrence";
import { countRowsWithBadgeId } from "../ux/kpi-review-count";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import { USERS_FILTER_CHIP_UNRECORDED, filterUserRowsByStatusChip } from "./users-filter";
import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  overlayForUserSessionSaveState,
} from "./users-session-save-overlay";
import {
  FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE,
  FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX,
  FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON,
  isUnrecordedUserRow,
  labelForNextUnrecordedUserCta,
  presentNextUnrecordedUserCta,
  resolveNextUnrecordedUserAction,
  selectNextUnrecordedUser,
} from "./next-unrecorded-user";

const PERSISTENCE_OR_COMPLETION_WORDING = [
  "記録済み",
  "保存済み",
  "本日記録した",
  "完了",
  "永続化",
  "登録済み",
  "送信済み",
] as const;

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

describe("FIELD-STAFF-NEXT-UNRECORDED-USER-1 next unrecorded user", () => {
  const rows = DEMO_UX_USERS_FIXTURE.rows;

  it("authorizes next-unrecorded presentation only and keeps remaining flags / live write closed", () => {
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.id).toBe("FIELD-STAFF-NEXT-UNRECORDED-USER-1");
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.presentationOnly).toBe(true);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.nextUnrecordedUserAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(true);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.listToRecordFastPathAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.liveSavedCompletionOnCardsAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.savingPauseRemovalAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.eightUserDetailCatalogAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.deployAuthorized).toBe(false);
  });

  it("selects user-e after user-a and does not wrap", () => {
    expect(rows.map((row) => row.id)).toEqual([
      "user-a",
      "user-b",
      "user-c",
      "user-d",
      "user-e",
      "user-f",
      "user-g",
      "user-h",
    ]);
    expect(isUnrecordedUserRow(rows[0]!)).toBe(true);
    expect(isUnrecordedUserRow(rows[4]!)).toBe(true);
    expect(selectNextUnrecordedUser(rows, "user-a")).toEqual({
      userId: "user-e",
      personLabel: "Eさん",
    });
    expect(selectNextUnrecordedUser(rows, "user-e")).toBeUndefined();
    expect(selectNextUnrecordedUser(rows, "user-h")).toBeUndefined();
  });

  it("fails closed for missing / unknown origin and for filtered-out next row", () => {
    expect(selectNextUnrecordedUser(rows, undefined)).toBeUndefined();
    expect(selectNextUnrecordedUser(rows, "")).toBeUndefined();
    expect(selectNextUnrecordedUser(rows, "user-missing")).toBeUndefined();
    const unrecordedOnly = filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_UNRECORDED);
    expect(unrecordedOnly.map((row) => row.id)).toEqual(["user-a", "user-e"]);
    expect(selectNextUnrecordedUser(unrecordedOnly, "user-a")).toEqual({
      userId: "user-e",
      personLabel: "Eさん",
    });
    const withoutE = rows.filter((row) => row.id !== "user-e");
    expect(selectNextUnrecordedUser(withoutE, "user-a")).toBeUndefined();
  });

  it("does not mutate unrecorded badges or Family R KPI counts", () => {
    const beforeBadges = rows.map((row) => row.statusBadges.map((badge) => badge.id));
    const beforeUnrecorded = countRowsWithBadgeId(rows, "unrecorded");
    selectNextUnrecordedUser(rows, "user-a");
    presentNextUnrecordedUserCta({
      authorized: true,
      currentUserId: "user-a",
      visibleRows: rows,
      detailEnabledUserIds: ["user-a", "user-c"],
    });
    expect(rows.map((row) => row.statusBadges.map((badge) => badge.id))).toEqual(beforeBadges);
    expect(countRowsWithBadgeId(rows, "unrecorded")).toBe(beforeUnrecorded);
    expect(beforeUnrecorded).toBe(2);
  });

  it("does not change save 5-state overlay mapping", () => {
    expect(overlayForUserSessionSaveState("saved")).toEqual({ visible: false });
    expect(overlayForUserSessionSaveState("unsaved").visible).toBe(true);
  });

  it("keeps Unit 3 same-user next-occurrence selection unchanged", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const first = items[0];
    expect(first?.userId).toBe("user-a");
    const nextOccurrence = selectNextActionableOccurrence(items, first?.occurrenceId);
    expect(nextOccurrence?.userId).toBe("user-a");
    expect(nextOccurrence?.userId).toBe(first?.userId);
  });

  it("hides the CTA without origin or authorization, and fail-closes when no next row", () => {
    expect(
      presentNextUnrecordedUserCta({
        authorized: false,
        currentUserId: "user-a",
        visibleRows: rows,
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ visible: false });
    expect(
      presentNextUnrecordedUserCta({
        authorized: true,
        currentUserId: undefined,
        visibleRows: rows,
        detailEnabledUserIds: ["user-a"],
      }),
    ).toEqual({ visible: false });
    const none = presentNextUnrecordedUserCta({
      authorized: true,
      currentUserId: "user-e",
      visibleRows: rows,
      detailEnabledUserIds: ["user-a"],
    });
    expect(none).toEqual({
      visible: true,
      enabled: false,
      label: FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX,
      reason: FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON,
      reasonId: "field-staff-next-unrecorded-user-reason",
      action: "list_focus",
    });
  });

  it("uses list focus when next user has no detail fixture, not a record fast-path", () => {
    const cta = presentNextUnrecordedUserCta({
      authorized: true,
      currentUserId: "user-a",
      visibleRows: rows,
      detailEnabledUserIds: ["user-a", "user-c"],
    });
    expect(cta).toEqual({
      visible: true,
      enabled: true,
      label: "次の未記録の利用者: Eさん",
      reasonId: "field-staff-next-unrecorded-user-reason",
      action: "list_focus",
      nextUserId: "user-e",
    });
    expect(resolveNextUnrecordedUserAction("user-a", ["user-a", "user-c"])).toBe("user_detail");
    expect(labelForNextUnrecordedUserCta({ userId: "user-e", personLabel: "Eさん" })).toBe(
      "次の未記録の利用者: Eさん",
    );
  });

  it("does not claim persistence success or completion in CTA copy", () => {
    const cta = presentNextUnrecordedUserCta({
      authorized: true,
      currentUserId: "user-a",
      visibleRows: rows,
      detailEnabledUserIds: ["user-a", "user-c"],
    });
    const text = cta.visible ? `${cta.label}${cta.reason ?? ""}` : "";
    for (const wording of PERSISTENCE_OR_COMPLETION_WORDING) {
      expect(text).not.toContain(wording);
    }
    expect(FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON).not.toContain("記録済み");
  });
});
