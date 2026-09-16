import {
  FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  FIELD_STAFF_HOME_DESTINATION,
  FIELD_STAFF_TASK_GLOBAL_ITEMS,
  applyFieldStaffSessionEvent,
  contextHintForFieldStaffGlobal,
  fieldStaffDayBoardClearVisible,
  initialFieldStaffTaskViewState,
  locationHeadingForFieldStaffDestination,
  resolveFieldStaffGlobalDestination,
  resolveFieldStaffTaskSelection,
  shellAdapterForFieldStaffDestination,
} from "./field-staff-task-navigation";

const missingContext = {
  hasSupportObject: false,
  hasOccurrenceContext: false,
} as const;

const fullContext = {
  hasSupportObject: true,
  hasOccurrenceContext: true,
} as const;

describe("CORR-1F FIELD_STAFF task navigation", () => {
  it("AC-1F-1: locks Global labels and exact order", () => {
    expect(FIELD_STAFF_TASK_GLOBAL_ITEMS.map((item) => item.label)).toEqual([
      "今日",
      "手順",
      "記録する",
      "未記録",
      "探す",
    ]);
  });

  it("AC-1F-2: maps each Global item to exactly one D-* destination when context is sufficient", () => {
    expect(
      FIELD_STAFF_TASK_GLOBAL_ITEMS.map((item) =>
        resolveFieldStaffGlobalDestination(item.globalId, fullContext),
      ),
    ).toEqual(["D-TODAY", "D-PROCEDURE", "D-RECORD-WRITE", "D-UNRECORDED", "D-FIND-PERSON"]);
    expect(new Set(FIELD_STAFF_TASK_GLOBAL_ITEMS.map((item) => item.globalId)).size).toBe(
      FIELD_STAFF_TASK_GLOBAL_ITEMS.length,
    );
  });

  it("AC-1F-3: falls back 手順 without object to D-TODAY acquisition", () => {
    expect(resolveFieldStaffGlobalDestination("GLOBAL-PROCEDURE", missingContext)).toBe("D-TODAY");
    expect(resolveFieldStaffTaskSelection("GLOBAL-PROCEDURE", missingContext)).toMatchObject({
      destination: "D-TODAY",
      shellDestination: "overview",
      usedFallback: true,
    });
    expect(contextHintForFieldStaffGlobal("GLOBAL-PROCEDURE", missingContext)).toContain(
      "今日の支援",
    );
  });

  it("AC-1F-4: falls back 記録する without occurrence to D-UNRECORDED", () => {
    expect(resolveFieldStaffGlobalDestination("GLOBAL-RECORD-WRITE", missingContext)).toBe(
      "D-UNRECORDED",
    );
    expect(resolveFieldStaffTaskSelection("GLOBAL-RECORD-WRITE", missingContext)).toMatchObject({
      destination: "D-UNRECORDED",
      shellDestination: "users",
      usedFallback: true,
    });
  });

  it("AC-1F-5: keeps Global 探す person-only and excludes D-FIND-RECORD", () => {
    expect(resolveFieldStaffGlobalDestination("GLOBAL-FIND-PERSON", missingContext)).toBe(
      "D-FIND-PERSON",
    );
    expect(FIELD_STAFF_TASK_GLOBAL_ITEMS.map((item) => item.sufficientDestination)).not.toContain(
      "D-FIND-RECORD",
    );
  });

  it("AC-1F-6/7: defaults first paint to D-TODAY and aliases D-HOME", () => {
    expect(FIELD_STAFF_DEFAULT_TASK_DESTINATION).toBe("D-TODAY");
    expect(FIELD_STAFF_HOME_DESTINATION).toBe("D-TODAY");
    expect(locationHeadingForFieldStaffDestination("D-TODAY")).toBe("今日の支援");
    expect(resolveFieldStaffTaskSelection("GLOBAL-TODAY", missingContext).destination).toBe(
      "D-TODAY",
    );
  });

  it("uses overview adapter only for D-TODAY and users adapter for other destinations", () => {
    expect(shellAdapterForFieldStaffDestination("D-TODAY")).toBe("overview");
    expect(shellAdapterForFieldStaffDestination("D-UNRECORDED")).toBe("users");
    expect(shellAdapterForFieldStaffDestination("D-FIND-PERSON")).toBe("users");
    expect(shellAdapterForFieldStaffDestination("D-PERSON")).toBe("users");
    expect(shellAdapterForFieldStaffDestination("D-PROCEDURE")).toBe("users");
    expect(shellAdapterForFieldStaffDestination("D-RECORD-WRITE")).toBe("users");
  });
});

describe("CORR-1G FIELD_STAFF session uniqueness", () => {
  it("AC-1G-9/10: unique C6 headings and D-HOME alias", () => {
    expect(locationHeadingForFieldStaffDestination("D-TODAY")).toBe("今日の支援");
    expect(locationHeadingForFieldStaffDestination("D-PROCEDURE")).toBe("手順");
    expect(locationHeadingForFieldStaffDestination("D-RECORD-WRITE")).toBe("記録する");
    expect(locationHeadingForFieldStaffDestination("D-UNRECORDED")).toBe("未記録");
    expect(locationHeadingForFieldStaffDestination("D-FIND-PERSON")).toBe("探す");
    expect(locationHeadingForFieldStaffDestination("D-PERSON")).toBe("この人の支援コンテキスト");
    expect(FIELD_STAFF_HOME_DESTINATION).toBe("D-TODAY");
  });

  it("AC-1G-13: first paint is D-TODAY with object false", () => {
    const initial = initialFieldStaffTaskViewState();
    expect(initial.destination).toBe("D-TODAY");
    expect(initial.sessionContext).toEqual({
      hasSupportObject: false,
      hasOccurrenceContext: false,
    });
  });

  it("AC-1G-1: D-TODAY SELECT_OCCURRENCE acquires object and lands D-PROCEDURE", () => {
    const next = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-1",
    });
    expect(next.sessionContext.hasSupportObject).toBe(true);
    expect(next.sessionContext.hasOccurrenceContext).toBe(false);
    expect(next.destination).toBe("D-PROCEDURE");
    expect(next.chosenOccurrenceId).toBe("occ-1");
  });

  it("AC-1G-2/20: SELECT_OCCURRENCE on other destinations does not acquire", () => {
    const fromFind = applyFieldStaffSessionEvent(
      { ...initialFieldStaffTaskViewState(), destination: "D-FIND-PERSON" },
      { type: "SELECT_OCCURRENCE", occurrenceId: "occ-1" },
    );
    expect(fromFind.sessionContext.hasSupportObject).toBe(false);
    expect(fromFind.destination).toBe("D-FIND-PERSON");
  });

  it("AC-1G-5/19: D-UNRECORDED SELECT_OCCURRENCE acquires object+occurrence and D-RECORD-WRITE", () => {
    const onUnrecorded = {
      ...initialFieldStaffTaskViewState(),
      destination: "D-UNRECORDED" as const,
      activeGlobalId: "GLOBAL-UNRECORDED" as const,
    };
    const next = applyFieldStaffSessionEvent(onUnrecorded, {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-2",
    });
    expect(next.sessionContext).toEqual({
      hasSupportObject: true,
      hasOccurrenceContext: true,
    });
    expect(next.destination).toBe("D-RECORD-WRITE");
  });

  it("AC-1G-3: PERSON_OPEN with day’s occurrence stays D-PERSON and object true", () => {
    const next = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "PERSON_OPEN",
      userId: "u1",
      hasCurrentDayOccurrence: true,
    });
    expect(next.destination).toBe("D-PERSON");
    expect(next.sessionContext.hasSupportObject).toBe(true);
    expect(next.sessionContext.hasOccurrenceContext).toBe(false);
  });

  it("AC-1G-4: PERSON_OPEN without day’s occurrence RELEASES and stays D-PERSON", () => {
    const sticky = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-1",
    });
    const next = applyFieldStaffSessionEvent(sticky, {
      type: "PERSON_OPEN",
      userId: "u2",
      hasCurrentDayOccurrence: false,
    });
    expect(next.destination).toBe("D-PERSON");
    expect(next.sessionContext).toEqual({
      hasSupportObject: false,
      hasOccurrenceContext: false,
    });
  });

  it("AC-1G-6: PROCEDURE_COMPLETE requires object and lands D-RECORD-WRITE", () => {
    expect(
      applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), { type: "PROCEDURE_COMPLETE" })
        .sessionContext.hasOccurrenceContext,
    ).toBe(false);
    const withObject = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-1",
    });
    const next = applyFieldStaffSessionEvent(withObject, { type: "PROCEDURE_COMPLETE" });
    expect(next.destination).toBe("D-RECORD-WRITE");
    expect(next.sessionContext.hasOccurrenceContext).toBe(true);
    expect(next.sessionContext.hasSupportObject).toBe(true);
  });

  it("P1-3: replacing D-TODAY object does not carry old occurrence context", () => {
    const objectA = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-a",
    });
    const recordedA = applyFieldStaffSessionEvent(objectA, { type: "PROCEDURE_COMPLETE" });
    expect(recordedA.sessionContext.hasOccurrenceContext).toBe(true);
    const today = applyFieldStaffSessionEvent(recordedA, {
      type: "GLOBAL",
      globalId: "GLOBAL-TODAY",
    });
    const objectB = applyFieldStaffSessionEvent(today, {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-b",
    });
    expect(objectB.chosenOccurrenceId).toBe("occ-b");
    expect(objectB.sessionContext).toEqual({
      hasSupportObject: true,
      hasOccurrenceContext: false,
    });
    expect(objectB.destination).toBe("D-PROCEDURE");
  });

  it("P1-3: PERSON_OPEN replacement does not carry old occurrence context", () => {
    const objectA = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-a",
    });
    const recordedA = applyFieldStaffSessionEvent(objectA, { type: "PROCEDURE_COMPLETE" });
    const personB = applyFieldStaffSessionEvent(recordedA, {
      type: "PERSON_OPEN",
      userId: "u-b",
      hasCurrentDayOccurrence: true,
      occurrenceId: "occ-b",
    });
    expect(personB.destination).toBe("D-PERSON");
    expect(personB.chosenOccurrenceId).toBe("occ-b");
    expect(personB.sessionContext).toEqual({
      hasSupportObject: true,
      hasOccurrenceContext: false,
    });
  });

  it("AC-1G-7/8: Global fallbacks and sufficient paths", () => {
    const missing = initialFieldStaffTaskViewState().sessionContext;
    const full = { hasSupportObject: true, hasOccurrenceContext: true };
    expect(resolveFieldStaffGlobalDestination("GLOBAL-PROCEDURE", missing)).toBe("D-TODAY");
    expect(resolveFieldStaffGlobalDestination("GLOBAL-RECORD-WRITE", missing)).toBe("D-UNRECORDED");
    expect(resolveFieldStaffGlobalDestination("GLOBAL-PROCEDURE", full)).toBe("D-PROCEDURE");
    expect(resolveFieldStaffGlobalDestination("GLOBAL-RECORD-WRITE", full)).toBe("D-RECORD-WRITE");
  });

  it("AC-1G-11/12: C4 PA is no-op when object false; shares D-PROCEDURE when true", () => {
    const blocked = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "PERSON_C4_PROCEDURE",
    });
    expect(blocked.destination).toBe("D-TODAY");
    const withObject = applyFieldStaffSessionEvent(
      applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
        type: "PERSON_OPEN",
        userId: "u1",
        hasCurrentDayOccurrence: true,
      }),
      { type: "PERSON_C4_PROCEDURE" },
    );
    expect(withObject.destination).toBe("D-PROCEDURE");
  });

  it("AC-1G-18: Global 今日 does not release sticky object", () => {
    const acquired = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-1",
    });
    const today = applyFieldStaffSessionEvent(acquired, {
      type: "GLOBAL",
      globalId: "GLOBAL-TODAY",
    });
    expect(today.destination).toBe("D-TODAY");
    expect(today.sessionContext.hasSupportObject).toBe(true);
    expect(today.chosenOccurrenceId).toBe("occ-1");
  });

  it("AC-1G-21: D-UNRECORDED clear releases occurrence only", () => {
    const recorded = applyFieldStaffSessionEvent(
      {
        ...initialFieldStaffTaskViewState(),
        destination: "D-UNRECORDED",
        activeGlobalId: "GLOBAL-UNRECORDED",
      },
      { type: "SELECT_OCCURRENCE", occurrenceId: "occ-9" },
    );
    const onUnrecorded = applyFieldStaffSessionEvent(recorded, {
      type: "GLOBAL",
      globalId: "GLOBAL-UNRECORDED",
    });
    expect(onUnrecorded.destination).toBe("D-UNRECORDED");
    const cleared = applyFieldStaffSessionEvent(onUnrecorded, { type: "CLEAR_CHOSEN_OCCURRENCE" });
    expect(cleared.destination).toBe("D-UNRECORDED");
    expect(cleared.sessionContext.hasSupportObject).toBe(true);
    expect(cleared.sessionContext.hasOccurrenceContext).toBe(false);
    expect(cleared.chosenOccurrenceId).toBeUndefined();
  });

  it("AC-1G-22: D-TODAY clear RELEASES object and coupled occurrence", () => {
    const acquired = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "SELECT_OCCURRENCE",
      occurrenceId: "occ-1",
    });
    const onToday = applyFieldStaffSessionEvent(acquired, {
      type: "GLOBAL",
      globalId: "GLOBAL-TODAY",
    });
    const cleared = applyFieldStaffSessionEvent(onToday, { type: "CLEAR_CHOSEN_OCCURRENCE" });
    expect(cleared.destination).toBe("D-TODAY");
    expect(cleared.sessionContext).toEqual({
      hasSupportObject: false,
      hasOccurrenceContext: false,
    });
  });

  it("PERSON_BACK RELEASES to D-FIND-PERSON", () => {
    const open = applyFieldStaffSessionEvent(initialFieldStaffTaskViewState(), {
      type: "PERSON_OPEN",
      userId: "u1",
      hasCurrentDayOccurrence: true,
    });
    const back = applyFieldStaffSessionEvent(open, { type: "PERSON_BACK" });
    expect(back.destination).toBe("D-FIND-PERSON");
    expect(back.sessionContext.hasSupportObject).toBe(false);
  });

  it("shows clear control only on D-TODAY / D-UNRECORDED with a chosen occurrence", () => {
    expect(fieldStaffDayBoardClearVisible("D-TODAY", "occ-1")).toBe(true);
    expect(fieldStaffDayBoardClearVisible("D-UNRECORDED", "occ-1")).toBe(true);
    expect(fieldStaffDayBoardClearVisible("D-PROCEDURE", "occ-1")).toBe(false);
    expect(fieldStaffDayBoardClearVisible("D-TODAY", undefined)).toBe(false);
  });
});
