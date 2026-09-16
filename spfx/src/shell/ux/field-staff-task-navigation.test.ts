import {
  FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  FIELD_STAFF_HOME_DESTINATION,
  FIELD_STAFF_TASK_GLOBAL_ITEMS,
  contextHintForFieldStaffGlobal,
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
    expect(
      resolveFieldStaffTaskSelection("GLOBAL-PROCEDURE", missingContext),
    ).toMatchObject({
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
    expect(
      resolveFieldStaffTaskSelection("GLOBAL-RECORD-WRITE", missingContext),
    ).toMatchObject({
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
    expect(
      resolveFieldStaffTaskSelection("GLOBAL-TODAY", missingContext).destination,
    ).toBe("D-TODAY");
  });

  it("uses overview adapter only for D-TODAY and users adapter for other destinations", () => {
    expect(shellAdapterForFieldStaffDestination("D-TODAY")).toBe("overview");
    expect(shellAdapterForFieldStaffDestination("D-UNRECORDED")).toBe("users");
    expect(shellAdapterForFieldStaffDestination("D-FIND-PERSON")).toBe("users");
  });
});
