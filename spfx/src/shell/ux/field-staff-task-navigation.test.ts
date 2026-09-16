import {
  FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  FIELD_STAFF_TASK_NAV_ITEMS,
  resolveFieldStaffTaskEntry,
} from "./field-staff-task-navigation";

describe("SBS-ROLE-TASK-FIRST-IA FIELD_STAFF navigation", () => {
  it("locks the Global order and one product Destination per item", () => {
    expect(FIELD_STAFF_TASK_NAV_ITEMS.map((item) => [item.label, item.id])).toEqual([
      ["今日", "D-TODAY"],
      ["手順", "D-PROCEDURE"],
      ["記録する", "D-RECORD-WRITE"],
      ["未記録", "D-UNRECORDED"],
      ["探す", "D-FIND-PERSON"],
    ]);
    expect(new Set(FIELD_STAFF_TASK_NAV_ITEMS.map((item) => item.id)).size).toBe(
      FIELD_STAFF_TASK_NAV_ITEMS.length,
    );
    expect(FIELD_STAFF_DEFAULT_TASK_DESTINATION).toBe("D-TODAY");
  });

  it("keeps product Destination identity when required context is missing", () => {
    for (const item of FIELD_STAFF_TASK_NAV_ITEMS) {
      const entry = resolveFieldStaffTaskEntry(item.id, false);
      expect(entry.destination).toBe(item.id);
      expect(entry.shellDestination).toBe(item.shellDestination);
    }
    expect(resolveFieldStaffTaskEntry("D-PROCEDURE", false)).toEqual({
      destination: "D-PROCEDURE",
      shellDestination: "users",
      contextRequired: true,
    });
    expect(resolveFieldStaffTaskEntry("D-RECORD-WRITE", false)).toEqual({
      destination: "D-RECORD-WRITE",
      shellDestination: "users",
      contextRequired: true,
    });
  });

  it("keeps Global search person-only and leaves record search out of Global", () => {
    const findItems = FIELD_STAFF_TASK_NAV_ITEMS.filter((item) => item.label === "探す");
    expect(findItems).toHaveLength(1);
    expect(findItems[0]?.id).toBe("D-FIND-PERSON");
    expect(FIELD_STAFF_TASK_NAV_ITEMS.map((item) => String(item.id))).not.toContain("D-FIND-RECORD");
  });
});
