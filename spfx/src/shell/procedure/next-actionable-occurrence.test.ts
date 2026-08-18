import {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  overlayForUserSessionSaveState,
} from "../users/users-session-save-overlay";
import { SHELL_SAVE_STATES, type ShellSaveState } from "../ux/save-state";
import { SAVING_INTERACTION_PAUSE_NOTE } from "../ux/saving-progress-observability";
import { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { FIELD_WORKFLOW_PROCEDURE_FIXTURE } from "./procedure-fixture";
import {
  FIELD_WORKFLOW_NEXT_OCCURRENCE_UNKNOWN_REASON,
  FIELD_WORKFLOW_NEXT_OCCURRENCE_UNSAVED_REASON,
  FIELD_WORKFLOW_RETURN_TO_TODAY_SUPPORT_LABEL,
  isNextActionableOccurrenceNavigationEnabled,
  labelForNextActionableOccurrenceCta,
  presentNextActionableOccurrenceCta,
  resolveNextActionableOccurrenceNavigation,
  selectNextActionableOccurrence,
} from "./next-actionable-occurrence";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

const PERSISTENCE_OR_COMPLETION_WORDING = [
  "記録済み",
  "保存済み",
  "本日記録した",
  "完了",
  "永続化",
  "登録済み",
  "5 / 17",
  "2 / 5",
  "x / 17",
] as const;

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 3 next actionable occurrence", () => {
  let items: ReturnType<typeof getKioskSyntheticTodaySupportItems>;

  beforeAll(() => {
    items = getKioskSyntheticTodaySupportItems();
  });

  const row = (index: number): (typeof items)[number] => {
    const found = items[index];
    if (!found) {
      throw new Error(`missing synthetic occurrence at ${index}`);
    }
    return found;
  };

  it("authorizes occurrence navigation only and keeps user-level next / live write closed", () => {
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextActionableOccurrenceAuthorized).toBe(true);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextUnrecordedUserAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.procedureFixtureExpansionAuthorized).toBe(
      false,
    );
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listToRecordFastPathAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.sharePointWriteAuthorized).toBe(false);
  });

  it("selects sch-004-repeated after sch-001 and skips recorded / cancelled rows", () => {
    expect(items).toHaveLength(5);
    expect(row(0)?.scheduleItemId).toBe("sch-001");
    expect(row(0)?.effectiveStatus).toBe("未実施");
    expect(row(1)?.effectiveStatus).toBe("記録済み");
    expect(row(2)?.effectiveStatus).toBe("取消済み");
    expect(row(3)?.scheduleItemId).toBe("sch-004-repeated");
    expect(row(3)?.effectiveStatus).toBe("未実施");
    expect(selectNextActionableOccurrence(items, row(0)?.occurrenceId)).toEqual({
      occurrenceId: row(3)?.occurrenceId,
      userId: "user-a",
      scheduledTime: "17:00",
      activityLabel: "夕食前片付け・整理",
    });
  });

  it("returns none after sch-004-repeated without wrapping to sch-001", () => {
    expect(row(4)?.effectiveStatus).toBe("確認が必要");
    expect(selectNextActionableOccurrence(items, row(3)?.occurrenceId)).toBeUndefined();
    const navigation = resolveNextActionableOccurrenceNavigation(items, row(3)?.occurrenceId);
    expect(navigation).toEqual({ kind: "today_support_day_board" });
  });

  it("does not skip an actionable 未実施 occurrence", () => {
    const next = selectNextActionableOccurrence(items, row(0)?.occurrenceId);
    expect(next?.occurrenceId).toBe(row(3)?.occurrenceId);
    expect(next?.occurrenceId).not.toBe(row(4)?.occurrenceId);
  });

  it("skips recorded, cancelled, and conflict rows because they are not CREATE-actionable", () => {
    expect(selectNextActionableOccurrence(items, row(1)?.occurrenceId)?.occurrenceId).toBe(
      row(3)?.occurrenceId,
    );
    expect(selectNextActionableOccurrence(items, row(2)?.occurrenceId)?.occurrenceId).toBe(
      row(3)?.occurrenceId,
    );
    expect(selectNextActionableOccurrence(items, row(4)?.occurrenceId)).toBeUndefined();
  });

  it("fails closed for an unknown or missing cursor", () => {
    expect(selectNextActionableOccurrence(items, undefined)).toBeUndefined();
    expect(selectNextActionableOccurrence(items, "")).toBeUndefined();
    expect(selectNextActionableOccurrence(items, "not-an-occurrence-id")).toBeUndefined();
  });

  it("does not jump to another user even when a later 未実施 exists", () => {
    const foreign = {
      occurrenceId: "foreign-occurrence-must-not-be-selected",
      userId: "user-e",
      scheduledTime: "18:30",
      activityLabel: "別利用者の予定",
      canStartProcedureRecord: true,
      effectiveStatus: "未実施",
    } as const;
    const mixed = [...items, foreign];
    expect(selectNextActionableOccurrence(mixed, row(0)?.occurrenceId)?.userId).toBe("user-a");
    expect(selectNextActionableOccurrence(mixed, row(0)?.occurrenceId)?.occurrenceId).toBe(
      row(3)?.occurrenceId,
    );
    expect(selectNextActionableOccurrence(mixed, row(3)?.occurrenceId)).toBeUndefined();
  });

  it("does not use Unit 2 overlay or save-state as occurrence completion", () => {
    const overlay = overlayForUserSessionSaveState("saved");
    expect(overlay.visible).toBe(false);
    const afterFailedSave = selectNextActionableOccurrence(items, row(0)?.occurrenceId);
    expect(afterFailedSave?.occurrenceId).toBe(row(3)?.occurrenceId);
    expect(items[0]?.effectiveStatus).toBe("未実施");
    expect(items[0]?.canStartProcedureRecord).toBe(true);
  });

  it("keeps identity as OccurrenceId and does not invent Users-path occurrence context", () => {
    expect(row(0)?.occurrenceId).toHaveLength(64);
    expect(FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId["user-a"]?.context.occurrenceId).toBe(
      undefined,
    );
    expect(
      presentNextActionableOccurrenceCta({
        authorized: true,
        occurrenceId: undefined,
        saveState: "save_failed",
        items,
      }),
    ).toEqual({ visible: false });
  });

  it("labels the next-occurrence CTA with time and activity, not 次へ alone", () => {
    const next = selectNextActionableOccurrence(items, row(0)?.occurrenceId);
    expect(next).toBeDefined();
    if (!next) {
      return;
    }
    const label = labelForNextActionableOccurrenceCta(next);
    expect(label).toBe("次の支援手順: 17:00 夕食前片付け・整理");
    expect(label).not.toBe("次へ");
    for (const forbidden of PERSISTENCE_OR_COMPLETION_WORDING) {
      expect(label).not.toContain(forbidden);
    }
  });

  it("enables navigation assist only for saved and save_failed", () => {
    const enabled: Record<ShellSaveState, boolean> = {
      unsaved: false,
      saving: false,
      saved: true,
      save_failed: true,
      save_outcome_unknown: false,
    };
    for (const state of SHELL_SAVE_STATES) {
      expect(isNextActionableOccurrenceNavigationEnabled(state)).toBe(enabled[state]);
    }
  });

  it("presents occurrence-context CTA with save-state availability and visible disabled reasons", () => {
    const unsaved = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(0)?.occurrenceId,
      saveState: "unsaved",
      items,
    });
    expect(unsaved.visible).toBe(true);
    if (unsaved.visible) {
      expect(unsaved.enabled).toBe(false);
      expect(unsaved.label).toBe("次の支援手順: 17:00 夕食前片付け・整理");
      expect(unsaved.reason).toBe(FIELD_WORKFLOW_NEXT_OCCURRENCE_UNSAVED_REASON);
      expect(unsaved.action).toBe("current_procedure");
      expect(unsaved.nextOccurrenceId).toBe(row(3)?.occurrenceId);
    }

    const saving = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(0)?.occurrenceId,
      saveState: "saving",
      items,
    });
    expect(saving.visible).toBe(true);
    if (saving.visible) {
      expect(saving.enabled).toBe(false);
      expect(saving.reason).toBe(SAVING_INTERACTION_PAUSE_NOTE);
    }

    const saved = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(0)?.occurrenceId,
      saveState: "saved",
      items,
    });
    expect(saved.visible).toBe(true);
    if (saved.visible) {
      expect(saved.enabled).toBe(true);
      expect(saved.reason).toBeUndefined();
      expect(saved.action).toBe("current_procedure");
      for (const forbidden of PERSISTENCE_OR_COMPLETION_WORDING) {
        expect(saved.label).not.toContain(forbidden);
      }
    }

    const failed = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(0)?.occurrenceId,
      saveState: "save_failed",
      items,
    });
    expect(failed.visible).toBe(true);
    if (failed.visible) {
      expect(failed.enabled).toBe(true);
      expect(failed.action).toBe("current_procedure");
    }

    const unknown = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(0)?.occurrenceId,
      saveState: "save_outcome_unknown",
      items,
    });
    expect(unknown.visible).toBe(true);
    if (unknown.visible) {
      expect(unknown.enabled).toBe(false);
      expect(unknown.reason).toBe(FIELD_WORKFLOW_NEXT_OCCURRENCE_UNKNOWN_REASON);
    }
  });

  it("resolves next occurrence to Current Procedure and end-of-day to the day board", () => {
    const fromFirst = resolveNextActionableOccurrenceNavigation(items, row(0)?.occurrenceId);
    expect(fromFirst.kind).toBe("current_procedure");
    if (fromFirst.kind === "current_procedure") {
      expect(fromFirst.occurrence.occurrenceId).toBe(row(3)?.occurrenceId);
    }
    const endOfDay = presentNextActionableOccurrenceCta({
      authorized: true,
      occurrenceId: row(3)?.occurrenceId,
      saveState: "save_failed",
      items,
    });
    expect(endOfDay.visible).toBe(true);
    if (endOfDay.visible) {
      expect(endOfDay.action).toBe("today_support_day_board");
      expect(endOfDay.label).toBe(FIELD_WORKFLOW_RETURN_TO_TODAY_SUPPORT_LABEL);
      expect(endOfDay.nextOccurrenceId).toBeUndefined();
    }
  });
});
