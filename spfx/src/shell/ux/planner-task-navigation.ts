export type PlannerCyclePosition = "①" | "②" | "③" | "④" | "⑤" | "⑥" | "unknown";

export type PlannerTaskDestinationId =
  | "D-HOME"
  | "D-ASSESS"
  | "D-PLAN"
  | "D-MONITOR"
  | "D-REVIEW"
  | "D-NEXT"
  | "D-FIND-PERSON"
  | "D-FIND-RECORD"
  | "D-RECORD-READ";

export type PlannerTaskGlobalId = "GLOBAL-CURRENT" | "GLOBAL-FIND-PERSON";

export type PlannerTaskGlobalItem = Readonly<{
  globalId: PlannerTaskGlobalId;
  label: string;
  destination: PlannerTaskDestinationId;
}>;

export const PLANNER_TASK_GLOBAL_ITEMS: readonly PlannerTaskGlobalItem[] = [
  {
    globalId: "GLOBAL-CURRENT",
    label: "今の工程",
    destination: "D-HOME",
  },
  {
    globalId: "GLOBAL-FIND-PERSON",
    label: "探す",
    destination: "D-FIND-PERSON",
  },
] as const;

export const PLANNER_HOME_DESTINATION: PlannerTaskDestinationId = "D-HOME";

export const PLANNER_DEFAULT_TASK_DESTINATION = PLANNER_HOME_DESTINATION;

const KNOWN_CYCLES: readonly PlannerCyclePosition[] = ["①", "②", "③", "④", "⑤", "⑥"];

export const parsePlannerCyclePosition = (
  value: string | null | undefined,
): PlannerCyclePosition => {
  if (value && KNOWN_CYCLES.includes(value as PlannerCyclePosition)) {
    return value as PlannerCyclePosition;
  }
  return "unknown";
};

export const plannerTaskGlobalItem = (
  globalId: PlannerTaskGlobalId,
): PlannerTaskGlobalItem => {
  const item = PLANNER_TASK_GLOBAL_ITEMS.find((candidate) => candidate.globalId === globalId);
  if (!item) {
    throw new Error("Unknown PLANNER task global: " + globalId);
  }
  return item;
};

export const resolvePlannerGlobalDestination = (
  globalId: PlannerTaskGlobalId,
): PlannerTaskDestinationId => plannerTaskGlobalItem(globalId).destination;

export const plannerPrimaryActionDestination = (
  cycle: PlannerCyclePosition,
): PlannerTaskDestinationId => {
  switch (cycle) {
    case "①":
      return "D-ASSESS";
    case "②":
      return "D-PLAN";
    case "③":
      return "D-FIND-RECORD";
    case "④":
      return "D-MONITOR";
    case "⑤":
      return "D-REVIEW";
    case "⑥":
      return "D-NEXT";
    case "unknown":
      return "D-HOME";
    default: {
      const exhaustive: never = cycle;
      throw new Error("Unhandled PLANNER cycle: " + exhaustive);
    }
  }
};

export const locationHeadingForPlannerDestination = (
  destination: PlannerTaskDestinationId,
): string => {
  switch (destination) {
    case "D-HOME":
      return "今の工程";
    case "D-ASSESS":
      return "アセスメント";
    case "D-PLAN":
      return "支援計画";
    case "D-MONITOR":
      return "モニタリング";
    case "D-REVIEW":
      return "見直し";
    case "D-NEXT":
      return "次版準備";
    case "D-FIND-PERSON":
      return "利用者を探す";
    case "D-FIND-RECORD":
      return "記録を探す";
    case "D-RECORD-READ":
      return "記録を見る";
    default: {
      const exhaustive: never = destination;
      throw new Error("Unhandled PLANNER destination: " + exhaustive);
    }
  }
};

export const plannerPrimaryActionLabel = (
  cycle: PlannerCyclePosition,
): string => {
  if (cycle === "unknown") {
    return "現在工程を確認";
  }
  return locationHeadingForPlannerDestination(plannerPrimaryActionDestination(cycle)) + "へ進む";
};

export type PlannerTaskViewState = Readonly<{
  activeGlobalId: PlannerTaskGlobalId;
  destination: PlannerTaskDestinationId;
  currentCycle: PlannerCyclePosition;
  previousDestination?: PlannerTaskDestinationId;
  selectedRecordId?: string;
}>;

export const initialPlannerTaskViewState = (
  currentCycle: PlannerCyclePosition = "unknown",
): PlannerTaskViewState => ({
  activeGlobalId: "GLOBAL-CURRENT",
  destination: PLANNER_DEFAULT_TASK_DESTINATION,
  currentCycle,
});

export const applyPlannerGlobalSelection = (
  state: PlannerTaskViewState,
  globalId: PlannerTaskGlobalId,
): PlannerTaskViewState => ({
  ...state,
  activeGlobalId: globalId,
  destination: resolvePlannerGlobalDestination(globalId),
  previousDestination: undefined,
  selectedRecordId: undefined,
});

export const applyPlannerHomePrimaryAction = (
  state: PlannerTaskViewState,
): PlannerTaskViewState => {
  if (state.destination !== "D-HOME") {
    return state;
  }
  const destination = plannerPrimaryActionDestination(state.currentCycle);
  if (destination === "D-HOME") {
    return state;
  }
  return {
    ...state,
    destination,
    previousDestination: "D-HOME",
    selectedRecordId: undefined,
  };
};

export const selectPlannerRecord = (
  state: PlannerTaskViewState,
  recordId: string,
): PlannerTaskViewState => {
  if (state.destination !== "D-FIND-RECORD") {
    return state;
  }
  return {
    ...state,
    destination: "D-RECORD-READ",
    previousDestination: "D-FIND-RECORD",
    selectedRecordId: recordId,
  };
};

export const applyPlannerBack = (
  state: PlannerTaskViewState,
): PlannerTaskViewState => {
  if (state.destination === "D-RECORD-READ") {
    return {
      ...state,
      destination: "D-FIND-RECORD",
      previousDestination: "D-HOME",
      selectedRecordId: undefined,
    };
  }
  if (state.destination === "D-FIND-RECORD" && state.previousDestination === "D-HOME") {
    return {
      ...state,
      destination: "D-HOME",
      previousDestination: undefined,
      selectedRecordId: undefined,
    };
  }
  return state;
};
