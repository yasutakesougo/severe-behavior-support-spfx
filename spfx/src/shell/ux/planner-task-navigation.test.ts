import {
  DEFAULT_PLANNER_PROCESS_SECTION_ID,
  PLANNER_DEFAULT_CYCLE,
  PLANNER_DEFAULT_TASK_DESTINATION,
  PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT,
  PLANNER_FORBIDDEN_DESTINATIONS,
  PLANNER_HOME_DESTINATION,
  PLANNER_PROCESS_SECTION_CYCLE_MAP,
  PLANNER_SYNTHETIC_RECORD_IDS,
  PLANNER_TASK_GLOBAL_ITEMS,
  applyPlannerSessionEvent,
  contextHintForPlannerDestination,
  initialPlannerTaskViewState,
  isLawfulPlannerPersonPlanContext,
  locationHeadingForPlannerDestination,
  plannerCycleFromProcessSection,
  plannerRecordCreateCtaAuthorized,
  primaryActionDestinationForPlannerCycle,
  resolvePlannerGlobalDestination,
  shellAdapterForPlannerDestination,
} from "./planner-task-navigation";

describe("SBS-PLANNER-TOP-LEVEL-IA-V1 task navigation", () => {
  it("AC-PL-TL-1: locks Global labels and exact order", () => {
    expect(PLANNER_TASK_GLOBAL_ITEMS.map((item) => item.label)).toEqual(["今の工程", "探す"]);
  });

  it("AC-PL-TL-2: 今の工程 → D-HOME only", () => {
    expect(resolvePlannerGlobalDestination("GLOBAL-CURRENT-CYCLE")).toBe("D-HOME");
  });

  it("AC-PL-TL-3: 探す → D-FIND-PERSON only; not D-FIND-RECORD", () => {
    expect(resolvePlannerGlobalDestination("GLOBAL-FIND-PERSON")).toBe("D-FIND-PERSON");
    expect(PLANNER_TASK_GLOBAL_ITEMS.map((item) => item.sufficientDestination)).not.toContain(
      "D-FIND-RECORD",
    );
  });

  it("AC-PL-TL-4/5: first paint D-HOME Distinct", () => {
    const initial = initialPlannerTaskViewState();
    expect(initial.destination).toBe("D-HOME");
    expect(PLANNER_DEFAULT_TASK_DESTINATION).toBe("D-HOME");
    expect(PLANNER_HOME_DESTINATION).toBe("D-HOME");
    expect(initial.destination).not.toBe("D-ASSESS");
    expect(initial.destination).not.toBe("D-PLAN");
    expect(initial.destination).not.toBe("D-MONITOR");
    expect(initial.destination).not.toBe("D-REVIEW");
    expect(initial.destination).not.toBe("D-NEXT");
  });

  it("AC-PL-TL-6: unknown cycle Primary Action fail-closed / stay D-HOME", () => {
    expect(PLANNER_DEFAULT_CYCLE).toBe("unknown");
    expect(primaryActionDestinationForPlannerCycle("unknown")).toBeUndefined();
    const next = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "PRIMARY_ACTION",
    });
    expect(next.destination).toBe("D-HOME");
  });

  it("AC-PL-TL-7: known cycles ①②④⑤⑥ map uniquely", () => {
    expect(primaryActionDestinationForPlannerCycle("①")).toBe("D-ASSESS");
    expect(primaryActionDestinationForPlannerCycle("②")).toBe("D-PLAN");
    expect(primaryActionDestinationForPlannerCycle("④")).toBe("D-MONITOR");
    expect(primaryActionDestinationForPlannerCycle("⑤")).toBe("D-REVIEW");
    expect(primaryActionDestinationForPlannerCycle("⑥")).toBe("D-NEXT");
  });

  it("AC-PL-TL-8: cycle=③ → D-FIND-RECORD; selected → D-RECORD-READ", () => {
    expect(primaryActionDestinationForPlannerCycle("③")).toBe("D-FIND-RECORD");
    let state = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_CYCLE",
      cycle: "③",
    });
    state = applyPlannerSessionEvent(state, { type: "PRIMARY_ACTION" });
    expect(state.destination).toBe("D-FIND-RECORD");
    state = applyPlannerSessionEvent(state, {
      type: "SELECT_RECORD",
      recordId: PLANNER_SYNTHETIC_RECORD_IDS[0],
    });
    expect(state.destination).toBe("D-RECORD-READ");
    expect(state.selectedRecordId).toBe(PLANNER_SYNTHETIC_RECORD_IDS[0]);
  });

  it("AC-PL-TL-9: no PLANNER D-RECORD-WRITE; no create CTA", () => {
    expect(PLANNER_FORBIDDEN_DESTINATIONS).toContain("D-RECORD-WRITE");
    expect(plannerRecordCreateCtaAuthorized).toBe(false);
  });

  it("AC-PL-TL-10: C6 headings unique per Scope §5", () => {
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
    const values = headings.map((id) => locationHeadingForPlannerDestination(id));
    expect(values).toEqual([
      "今の工程",
      "アセスメント",
      "支援計画",
      "モニタリング",
      "見直し",
      "次版準備",
      "利用者を探す",
      "記録を探す",
      "記録を見る",
    ]);
    expect(new Set(values).size).toBe(values.length);
  });

  it("SET_CYCLE stays on D-HOME and does not invent Global rows", () => {
    const next = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_CYCLE",
      cycle: "②",
    });
    expect(next.currentCycle).toBe("②");
    expect(next.destination).toBe("D-HOME");
    expect(next.activeGlobalId).toBe("GLOBAL-CURRENT-CYCLE");
    expect(contextHintForPlannerDestination("D-HOME", "②")).toContain("②");
  });

  it("BACK from D-FIND-RECORD returns to D-HOME when arrived via PA", () => {
    let state = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_CYCLE",
      cycle: "③",
    });
    state = applyPlannerSessionEvent(state, { type: "PRIMARY_ACTION" });
    state = applyPlannerSessionEvent(state, { type: "BACK" });
    expect(state.destination).toBe("D-HOME");
  });

  it("shell adapters are transport only", () => {
    expect(shellAdapterForPlannerDestination("D-HOME")).toBe("overview");
    expect(shellAdapterForPlannerDestination("D-FIND-PERSON")).toBe("users");
    expect(shellAdapterForPlannerDestination("D-RECORD-READ")).toBe("records");
    expect(shellAdapterForPlannerDestination("D-PLAN")).toBe("overview");
    expect(shellAdapterForPlannerDestination("D-MONITOR")).toBe("overview");
    expect(shellAdapterForPlannerDestination("D-PLAN", { hasLawfulContext: true })).toBe("users");
    expect(shellAdapterForPlannerDestination("D-MONITOR", { hasLawfulContext: true })).toBe(
      "users",
    );
  });

  it("PL-HTA correction: no context keeps unknown cycle and disabled Primary Action", () => {
    const initial = initialPlannerTaskViewState();
    expect(isLawfulPlannerPersonPlanContext(initial.personPlanContext)).toBe(false);
    expect(initial.currentCycle).toBe("unknown");
    expect(primaryActionDestinationForPlannerCycle(initial.currentCycle)).toBeUndefined();
    const advanced = applyPlannerSessionEvent(initial, { type: "PRIMARY_ACTION" });
    expect(advanced.destination).toBe("D-HOME");
  });

  it("PL-HTA correction: 探す remains D-FIND-PERSON and no new Destinations", () => {
    expect(resolvePlannerGlobalDestination("GLOBAL-FIND-PERSON")).toBe("D-FIND-PERSON");
    expect(resolvePlannerGlobalDestination("GLOBAL-FIND-PERSON")).not.toBe("D-PLAN");
    expect(resolvePlannerGlobalDestination("GLOBAL-FIND-PERSON")).not.toBe("D-FIND-RECORD");
    const afterFind = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "GLOBAL",
      globalId: "GLOBAL-FIND-PERSON",
    });
    expect(afterFind.destination).toBe("D-FIND-PERSON");
    expect(Object.keys(PLANNER_PROCESS_SECTION_CYCLE_MAP).sort()).toEqual(
      [
        "planner-process-monitoring-heading",
        "planner-process-next-version-heading",
        "planner-process-plan-heading",
        "planner-process-records-heading",
        "planner-process-review-heading",
        "planner-process-support-heading",
      ].sort(),
    );
  });

  it("PL-HTA correction: §5.4 PV section map is unique and does not send 計画 to D-ASSESS", () => {
    expect(DEFAULT_PLANNER_PROCESS_SECTION_ID).toBe("planner-process-plan-heading");
    expect(plannerCycleFromProcessSection("planner-process-plan-heading", true)).toBe("②");
    expect(primaryActionDestinationForPlannerCycle("②")).toBe("D-PLAN");
    expect(plannerCycleFromProcessSection("planner-process-support-heading", true)).toBe("unknown");
    expect(plannerCycleFromProcessSection("planner-process-records-heading", true)).toBe("③");
    expect(plannerCycleFromProcessSection("planner-process-monitoring-heading", true)).toBe("④");
    expect(plannerCycleFromProcessSection("planner-process-review-heading", true)).toBe("⑤");
    expect(plannerCycleFromProcessSection("planner-process-next-version-heading", true)).toBe("⑥");
    expect(plannerCycleFromProcessSection("planner-process-plan-heading", false)).toBe("unknown");
  });

  it("PL-HTA correction: lawful existing-plan context then ended returns unknown", () => {
    let state = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_PERSON_PLAN_CONTEXT",
      context: PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT,
    });
    expect(isLawfulPlannerPersonPlanContext(state.personPlanContext)).toBe(true);
    expect(state.currentCycle).toBe("②");
    expect(state.destination).toBe("D-HOME");
    state = applyPlannerSessionEvent(state, { type: "PRIMARY_ACTION" });
    expect(state.destination).toBe("D-PLAN");
    state = applyPlannerSessionEvent(state, {
      type: "SET_PROCESS_SECTION",
      sectionId: "planner-process-monitoring-heading",
    });
    expect(state.currentCycle).toBe("④");
    expect(state.destination).toBe("D-PLAN");
    state = applyPlannerSessionEvent(state, { type: "SET_PERSON_PLAN_CONTEXT" });
    expect(isLawfulPlannerPersonPlanContext(state.personPlanContext)).toBe(false);
    expect(state.currentCycle).toBe("unknown");
    expect(state.destination).toBe("D-HOME");
    expect(primaryActionDestinationForPlannerCycle(state.currentCycle)).toBeUndefined();
  });

  it("PL-HTA correction: synthetic-detail identity is not lawful context", () => {
    const next = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_PERSON_PLAN_CONTEXT",
      context: { userId: "user-b", planId: "synthetic-plan-001" },
    });
    expect(isLawfulPlannerPersonPlanContext(next.personPlanContext)).toBe(false);
    expect(next.currentCycle).toBe("unknown");
  });

  it("PL-HTA correction: process section without context does not invent a cycle", () => {
    const next = applyPlannerSessionEvent(initialPlannerTaskViewState(), {
      type: "SET_PROCESS_SECTION",
      sectionId: "planner-process-monitoring-heading",
    });
    expect(next.currentCycle).toBe("unknown");
    expect(next.destination).toBe("D-HOME");
  });
});
