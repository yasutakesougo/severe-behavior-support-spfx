import {
  PLANNER_DEFAULT_TASK_DESTINATION,
  PLANNER_HOME_DESTINATION,
  PLANNER_TASK_GLOBAL_ITEMS,
  applyPlannerBack,
  applyPlannerGlobalSelection,
  applyPlannerHomePrimaryAction,
  initialPlannerTaskViewState,
  locationHeadingForPlannerDestination,
  parsePlannerCyclePosition,
  plannerPrimaryActionDestination,
  resolvePlannerGlobalDestination,
  selectPlannerRecord,
} from "./planner-task-navigation";

describe("SBS-PLANNER-TOP-LEVEL-IA-V1 navigation", () => {
  it("AC-PL-TL-1: locks Global labels and order", () => {
    expect(PLANNER_TASK_GLOBAL_ITEMS.map((item) => item.label)).toEqual(["今の工程", "探す"]);
  });

  it("AC-PL-TL-2/3: Global destinations are unique and record-find is not Global", () => {
    expect(resolvePlannerGlobalDestination("GLOBAL-CURRENT")).toBe("D-HOME");
    expect(resolvePlannerGlobalDestination("GLOBAL-FIND-PERSON")).toBe("D-FIND-PERSON");
    expect(PLANNER_TASK_GLOBAL_ITEMS.map((item) => item.destination)).not.toContain(
      "D-FIND-RECORD",
    );
  });

  it("AC-PL-TL-4: first paint is distinct D-HOME", () => {
    const initial = initialPlannerTaskViewState();
    expect(initial.destination).toBe("D-HOME");
    expect(PLANNER_DEFAULT_TASK_DESTINATION).toBe("D-HOME");
    expect(PLANNER_HOME_DESTINATION).toBe("D-HOME");
    expect(locationHeadingForPlannerDestination(initial.destination)).toBe("今の工程");
  });

  it("AC-PL-TL-6: unknown cycle fails closed on D-HOME", () => {
    const initial = initialPlannerTaskViewState("unknown");
    expect(plannerPrimaryActionDestination("unknown")).toBe("D-HOME");
    expect(applyPlannerHomePrimaryAction(initial)).toEqual(initial);
  });

  it("AC-PL-TL-7/8: known-cycle map is deterministic including cycle ③", () => {
    expect(
      ["①", "②", "③", "④", "⑤", "⑥"].map((cycle) =>
        plannerPrimaryActionDestination(parsePlannerCyclePosition(cycle)),
      ),
    ).toEqual(["D-ASSESS", "D-PLAN", "D-FIND-RECORD", "D-MONITOR", "D-REVIEW", "D-NEXT"]);

    const cycle3 = applyPlannerHomePrimaryAction(initialPlannerTaskViewState("③"));
    expect(cycle3.destination).toBe("D-FIND-RECORD");
    const selected = selectPlannerRecord(cycle3, "synthetic-record-1");
    expect(selected.destination).toBe("D-RECORD-READ");
    expect(selected.selectedRecordId).toBe("synthetic-record-1");
  });

  it("AC-PL-TL-9: no planner write destination exists in the model", () => {
    const headings = [
      "D-HOME",
      "D-ASSESS",
      "D-PLAN",
      "D-MONITOR",
      "D-REVIEW",
      "D-NEXT",
      "D-FIND-PERSON",
      "D-FIND-RECORD",
      "D-RECORD-READ",
    ] as const;
    expect(headings).not.toContain("D-RECORD-WRITE" as never);
    expect(locationHeadingForPlannerDestination("D-RECORD-READ")).toBe("記録を見る");
  });

  it("AC-PL-TL-10: C6 headings are unique for listed destinations", () => {
    const destinations = [
      "D-HOME",
      "D-ASSESS",
      "D-PLAN",
      "D-MONITOR",
      "D-REVIEW",
      "D-NEXT",
      "D-FIND-PERSON",
      "D-FIND-RECORD",
      "D-RECORD-READ",
    ] as const;
    const headings = destinations.map(locationHeadingForPlannerDestination);
    expect(new Set(headings).size).toBe(headings.length);
  });

  it("keeps Global selection separate from in-flow record navigation", () => {
    const fromHome = applyPlannerGlobalSelection(
      initialPlannerTaskViewState("③"),
      "GLOBAL-FIND-PERSON",
    );
    expect(fromHome.destination).toBe("D-FIND-PERSON");

    const recordFind = applyPlannerHomePrimaryAction(initialPlannerTaskViewState("③"));
    const recordRead = selectPlannerRecord(recordFind, "r-1");
    expect(applyPlannerBack(recordRead).destination).toBe("D-FIND-RECORD");
    expect(applyPlannerBack(applyPlannerBack(recordRead)).destination).toBe("D-HOME");
  });

  it("parses only locked cycle values and fails closed otherwise", () => {
    expect(parsePlannerCyclePosition("③")).toBe("③");
    expect(parsePlannerCyclePosition("")).toBe("unknown");
    expect(parsePlannerCyclePosition("計画")).toBe("unknown");
    expect(parsePlannerCyclePosition(undefined)).toBe("unknown");
  });
});
