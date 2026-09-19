/**
 * SBS-PLANNER-TOP-LEVEL-IA-V1 — PLANNER Task-First Global + Distinct D-HOME.
 * Exact Scope §3 only. Product Destination identity is always a D-* id.
 * SHELL-UX-7 adapter ids are never normative Destination identity.
 */
import type { ShellPrimaryNavigationId } from "./primary-navigation";

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

export type PlannerTaskGlobalId = "GLOBAL-CURRENT-CYCLE" | "GLOBAL-FIND-PERSON";

export type PlannerTaskGlobalItem = Readonly<{
  globalId: PlannerTaskGlobalId;
  label: string;
  sufficientDestination: PlannerTaskDestinationId;
  contextHint: string;
}>;

/**
 * Locked PL-TL-A Global items. Order is normative.
 */
export const PLANNER_TASK_GLOBAL_ITEMS: readonly PlannerTaskGlobalItem[] = [
  {
    globalId: "GLOBAL-CURRENT-CYCLE",
    label: "今の工程",
    sufficientDestination: "D-HOME",
    contextHint: "今どの工程にいるかと、次の一手を確認します。",
  },
  {
    globalId: "GLOBAL-FIND-PERSON",
    label: "探す",
    sufficientDestination: "D-FIND-PERSON",
    contextHint: "利用者を探します。記録探しは Global ではありません。",
  },
] as const;

export const PLANNER_HOME_DESTINATION: PlannerTaskDestinationId = "D-HOME";

export const PLANNER_DEFAULT_TASK_DESTINATION = PLANNER_HOME_DESTINATION;

export const PLANNER_DEFAULT_CYCLE: PlannerCyclePosition = "unknown";

/** Demo exclusive lawful person/plan identity. Not a new store. */
export type PlannerPersonPlanContext = Readonly<{
  userId: string;
  planId: string;
}>;

export const PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT: PlannerPersonPlanContext = {
  userId: "user-a",
  planId: "synthetic-plan-001",
};

export const DEFAULT_PLANNER_PROCESS_SECTION_ID = "planner-process-plan-heading";

/**
 * PROCESS-VISIBILITY in-flow section → Task-First cycle.
 * Glyph identity PV「① 計画」= cycle ① D-ASSESS is rejected.
 */
export const PLANNER_PROCESS_SECTION_CYCLE_MAP: Readonly<Record<string, PlannerCyclePosition>> = {
  "planner-process-plan-heading": "②",
  "planner-process-support-heading": "unknown",
  "planner-process-records-heading": "③",
  "planner-process-monitoring-heading": "④",
  "planner-process-review-heading": "⑤",
  "planner-process-next-version-heading": "⑥",
};

export const isLawfulPlannerPersonPlanContext = (
  context: PlannerPersonPlanContext | undefined,
): context is PlannerPersonPlanContext =>
  context?.userId === PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT.userId &&
  context.planId === PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT.planId;

export const plannerCycleFromProcessSection = (
  sectionId: string | undefined,
  hasLawfulContext: boolean,
): PlannerCyclePosition => {
  if (!hasLawfulContext || !sectionId) {
    return "unknown";
  }
  return PLANNER_PROCESS_SECTION_CYCLE_MAP[sectionId] ?? "unknown";
};

/** Synthetic record ids for D-FIND-RECORD → D-RECORD-READ proof (no LIVE list). */
export const PLANNER_SYNTHETIC_RECORD_IDS = ["synthetic-record-1"] as const;

export const plannerTaskGlobalItem = (globalId: PlannerTaskGlobalId): PlannerTaskGlobalItem => {
  const item = PLANNER_TASK_GLOBAL_ITEMS.find((candidate) => candidate.globalId === globalId);
  if (!item) {
    throw new Error(`Unknown PLANNER task global: ${globalId}`);
  }
  return item;
};

export const resolvePlannerGlobalDestination = (
  globalId: PlannerTaskGlobalId,
): PlannerTaskDestinationId => {
  switch (globalId) {
    case "GLOBAL-CURRENT-CYCLE":
      return "D-HOME";
    case "GLOBAL-FIND-PERSON":
      return "D-FIND-PERSON";
    default: {
      const exhaustive: never = globalId;
      throw new Error(`Unhandled PLANNER global: ${exhaustive}`);
    }
  }
};

/**
 * Locked Primary Action map (PL-TL-D + parent rows). Unknown = fail-closed.
 */
export const primaryActionDestinationForPlannerCycle = (
  cycle: PlannerCyclePosition,
): PlannerTaskDestinationId | undefined => {
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
      return undefined;
    default: {
      const exhaustive: never = cycle;
      throw new Error(`Unhandled PLANNER cycle: ${exhaustive}`);
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
      throw new Error(`Unhandled PLANNER destination: ${exhaustive}`);
    }
  }
};

export const contextHintForPlannerDestination = (
  destination: PlannerTaskDestinationId,
  cycle: PlannerCyclePosition,
): string => {
  switch (destination) {
    case "D-HOME":
      return cycle === "unknown"
        ? "現在の工程がまだ分かりません。次の一手には進みません。"
        : `現在地は ${cycle} です。次の一手へ進めます。`;
    case "D-FIND-RECORD":
      return "記録を選ぶと内容を確認できます。新規作成はありません。";
    case "D-RECORD-READ":
      return "記録を読む専用です。作成・書き込みはできません。";
    case "D-FIND-PERSON":
      return "利用者を探します。";
    default:
      return `${locationHeadingForPlannerDestination(destination)} の仕事です。`;
  }
};

/**
 * Adapter transport only. Never normative D-* identity.
 * Exact Scope: Task Destinations prove identity in Task-First layer;
 * overview is a harmless host adapter for orientation surfaces.
 */
export const shellAdapterForPlannerDestination = (
  destination: PlannerTaskDestinationId,
  options?: Readonly<{ hasLawfulContext?: boolean }>,
): ShellPrimaryNavigationId => {
  if (destination === "D-FIND-PERSON" || destination === "D-FIND-RECORD") {
    return "users";
  }
  if (destination === "D-RECORD-READ") {
    return "records";
  }
  if (
    options?.hasLawfulContext === true &&
    (destination === "D-PLAN" || destination === "D-MONITOR")
  ) {
    return "users";
  }
  return "overview";
};

export type PlannerTaskViewState = Readonly<{
  activeGlobalId: PlannerTaskGlobalId;
  destination: PlannerTaskDestinationId;
  currentCycle: PlannerCyclePosition;
  selectedRecordId?: string;
  previousDestination?: PlannerTaskDestinationId;
  personPlanContext?: PlannerPersonPlanContext;
  activeProcessSectionId?: string;
}>;

export type PlannerSessionEvent =
  | Readonly<{ type: "GLOBAL"; globalId: PlannerTaskGlobalId }>
  | Readonly<{ type: "SET_CYCLE"; cycle: PlannerCyclePosition }>
  | Readonly<{ type: "PRIMARY_ACTION" }>
  | Readonly<{ type: "SELECT_RECORD"; recordId: string }>
  | Readonly<{ type: "BACK" }>
  | Readonly<{ type: "SET_PERSON_PLAN_CONTEXT"; context?: PlannerPersonPlanContext }>
  | Readonly<{ type: "SET_PROCESS_SECTION"; sectionId: string }>;

export const initialPlannerTaskViewState = (
  initialCycle: PlannerCyclePosition = PLANNER_DEFAULT_CYCLE,
): PlannerTaskViewState => ({
  activeGlobalId: "GLOBAL-CURRENT-CYCLE",
  destination: PLANNER_DEFAULT_TASK_DESTINATION,
  currentCycle: initialCycle,
});

export const applyPlannerSessionEvent = (
  state: PlannerTaskViewState,
  event: PlannerSessionEvent,
): PlannerTaskViewState => {
  switch (event.type) {
    case "GLOBAL": {
      const destination = resolvePlannerGlobalDestination(event.globalId);
      return {
        ...state,
        activeGlobalId: event.globalId,
        destination,
        selectedRecordId: undefined,
        previousDestination: undefined,
      };
    }
    case "SET_CYCLE": {
      return {
        ...state,
        currentCycle: event.cycle,
        // Cycle change does not invent a Global row; stay on D-HOME orientation.
        activeGlobalId: "GLOBAL-CURRENT-CYCLE",
        destination: "D-HOME",
        selectedRecordId: undefined,
        previousDestination: undefined,
      };
    }
    case "PRIMARY_ACTION": {
      if (state.destination !== "D-HOME") {
        return state;
      }
      const next = primaryActionDestinationForPlannerCycle(state.currentCycle);
      if (!next) {
        return state;
      }
      return {
        ...state,
        destination: next,
        previousDestination: "D-HOME",
        selectedRecordId: undefined,
        activeGlobalId: next === "D-FIND-PERSON" ? "GLOBAL-FIND-PERSON" : "GLOBAL-CURRENT-CYCLE",
      };
    }
    case "SELECT_RECORD": {
      if (state.destination !== "D-FIND-RECORD") {
        return state;
      }
      return {
        ...state,
        destination: "D-RECORD-READ",
        selectedRecordId: event.recordId,
        previousDestination: "D-FIND-RECORD",
      };
    }
    case "BACK": {
      if (state.previousDestination) {
        return {
          ...state,
          destination: state.previousDestination,
          previousDestination: undefined,
          selectedRecordId: undefined,
          activeGlobalId:
            state.previousDestination === "D-FIND-PERSON"
              ? "GLOBAL-FIND-PERSON"
              : "GLOBAL-CURRENT-CYCLE",
        };
      }
      return {
        ...state,
        destination: "D-HOME",
        activeGlobalId: "GLOBAL-CURRENT-CYCLE",
        selectedRecordId: undefined,
      };
    }
    case "SET_PERSON_PLAN_CONTEXT": {
      if (isLawfulPlannerPersonPlanContext(event.context)) {
        return {
          ...state,
          personPlanContext: event.context,
          activeProcessSectionId: DEFAULT_PLANNER_PROCESS_SECTION_ID,
          currentCycle: plannerCycleFromProcessSection(DEFAULT_PLANNER_PROCESS_SECTION_ID, true),
        };
      }
      const impersonating = state.destination === "D-PLAN" || state.destination === "D-MONITOR";
      return {
        ...state,
        personPlanContext: undefined,
        activeProcessSectionId: undefined,
        currentCycle: "unknown",
        destination: impersonating ? "D-HOME" : state.destination,
        activeGlobalId: impersonating ? "GLOBAL-CURRENT-CYCLE" : state.activeGlobalId,
        previousDestination: impersonating ? undefined : state.previousDestination,
      };
    }
    case "SET_PROCESS_SECTION": {
      if (!isLawfulPlannerPersonPlanContext(state.personPlanContext)) {
        return state;
      }
      return {
        ...state,
        activeProcessSectionId: event.sectionId,
        currentCycle: plannerCycleFromProcessSection(event.sectionId, true),
      };
    }
    default: {
      const exhaustive: never = event;
      throw new Error(`Unhandled PLANNER session event: ${JSON.stringify(exhaustive)}`);
    }
  }
};

/** PLANNER must never expose D-RECORD-WRITE or record-create CTA. */
export const PLANNER_FORBIDDEN_DESTINATIONS = ["D-RECORD-WRITE"] as const;

export const plannerRecordCreateCtaAuthorized = false as const;
