import type { ShellPrimaryNavigationId } from "./primary-navigation";

export type FieldStaffTaskDestinationId =
  "D-TODAY" | "D-PROCEDURE" | "D-RECORD-WRITE" | "D-UNRECORDED" | "D-FIND-PERSON" | "D-PERSON";

export type FieldStaffTaskGlobalId =
  | "GLOBAL-TODAY"
  | "GLOBAL-PROCEDURE"
  | "GLOBAL-RECORD-WRITE"
  | "GLOBAL-UNRECORDED"
  | "GLOBAL-FIND-PERSON";

export type FieldStaffSessionContext = Readonly<{
  hasSupportObject: boolean;
  hasOccurrenceContext: boolean;
}>;

export type FieldStaffTaskGlobalItem = Readonly<{
  globalId: FieldStaffTaskGlobalId;
  label: string;
  sufficientDestination: FieldStaffTaskDestinationId;
  contextHint: string;
  acquisitionHint: string;
}>;

/**
 * CORR-1F FIELD_STAFF Task-First Global items. Product Destination identity is
 * always a D-* id; legacy shell destinations are adapter transport only.
 */
export const FIELD_STAFF_TASK_GLOBAL_ITEMS: readonly FieldStaffTaskGlobalItem[] = [
  {
    globalId: "GLOBAL-TODAY",
    label: "今日",
    sufficientDestination: "D-TODAY",
    contextHint: "今日の支援対象と、次に行うことを確認します。",
    acquisitionHint: "今日の支援対象と、次に行うことを確認します。",
  },
  {
    globalId: "GLOBAL-PROCEDURE",
    label: "手順",
    sufficientDestination: "D-PROCEDURE",
    contextHint: "対象の利用者を選ぶと、現在の手順を確認できます。",
    acquisitionHint: "支援対象を選ぶため、今日の支援へ戻ります。",
  },
  {
    globalId: "GLOBAL-RECORD-WRITE",
    label: "記録する",
    sufficientDestination: "D-RECORD-WRITE",
    contextHint: "対象の利用者を選び、手順から記録へ進みます。",
    acquisitionHint: "記録対象を選ぶため、未記録一覧へ進みます。",
  },
  {
    globalId: "GLOBAL-UNRECORDED",
    label: "未記録",
    sufficientDestination: "D-UNRECORDED",
    contextHint: "利用者一覧の「未記録」で対象を絞り込み、記録へ戻れます。",
    acquisitionHint: "利用者一覧の「未記録」で対象を絞り込み、記録へ戻れます。",
  },
  {
    globalId: "GLOBAL-FIND-PERSON",
    label: "探す",
    sufficientDestination: "D-FIND-PERSON",
    contextHint: "利用者一覧から対象の利用者を探します。",
    acquisitionHint: "利用者一覧から対象の利用者を探します。",
  },
] as const;

export const FIELD_STAFF_HOME_DESTINATION: FieldStaffTaskDestinationId = "D-TODAY";

export const FIELD_STAFF_DEFAULT_TASK_DESTINATION = FIELD_STAFF_HOME_DESTINATION;

export const fieldStaffTaskGlobalItem = (
  globalId: FieldStaffTaskGlobalId,
): FieldStaffTaskGlobalItem => {
  const item = FIELD_STAFF_TASK_GLOBAL_ITEMS.find((candidate) => candidate.globalId === globalId);
  if (!item) {
    throw new Error(`Unknown FIELD_STAFF task global: ${globalId}`);
  }
  return item;
};

export const resolveFieldStaffGlobalDestination = (
  globalId: FieldStaffTaskGlobalId,
  context: FieldStaffSessionContext,
): FieldStaffTaskDestinationId => {
  switch (globalId) {
    case "GLOBAL-TODAY":
      return "D-TODAY";
    case "GLOBAL-PROCEDURE":
      return context.hasSupportObject ? "D-PROCEDURE" : "D-TODAY";
    case "GLOBAL-RECORD-WRITE":
      return context.hasOccurrenceContext ? "D-RECORD-WRITE" : "D-UNRECORDED";
    case "GLOBAL-UNRECORDED":
      return "D-UNRECORDED";
    case "GLOBAL-FIND-PERSON":
      return "D-FIND-PERSON";
    default: {
      const exhaustive: never = globalId;
      throw new Error(`Unhandled FIELD_STAFF global: ${exhaustive}`);
    }
  }
};

export const shellAdapterForFieldStaffDestination = (
  destination: FieldStaffTaskDestinationId,
): ShellPrimaryNavigationId => {
  if (destination === "D-TODAY") {
    return "overview";
  }
  return "users";
};

export const locationHeadingForFieldStaffDestination = (
  destination: FieldStaffTaskDestinationId,
): string => {
  switch (destination) {
    case "D-TODAY":
      return "今日の支援";
    case "D-PROCEDURE":
      return "手順";
    case "D-RECORD-WRITE":
      return "記録する";
    case "D-UNRECORDED":
      return "未記録";
    case "D-FIND-PERSON":
      return "探す";
    case "D-PERSON":
      return "この人の支援コンテキスト";
    default: {
      const exhaustive: never = destination;
      throw new Error(`Unhandled FIELD_STAFF destination: ${exhaustive}`);
    }
  }
};

export const contextHintForFieldStaffGlobal = (
  globalId: FieldStaffTaskGlobalId,
  context: FieldStaffSessionContext,
): string => {
  const item = fieldStaffTaskGlobalItem(globalId);
  const resolved = resolveFieldStaffGlobalDestination(globalId, context);
  if (resolved !== item.sufficientDestination) {
    return item.acquisitionHint;
  }
  return item.contextHint;
};

export type FieldStaffTaskResolution = Readonly<{
  globalId: FieldStaffTaskGlobalId;
  destination: FieldStaffTaskDestinationId;
  shellDestination: ShellPrimaryNavigationId;
  usedFallback: boolean;
}>;

export const resolveFieldStaffTaskSelection = (
  globalId: FieldStaffTaskGlobalId,
  context: FieldStaffSessionContext,
): FieldStaffTaskResolution => {
  const item = fieldStaffTaskGlobalItem(globalId);
  const destination = resolveFieldStaffGlobalDestination(globalId, context);
  return {
    globalId,
    destination,
    shellDestination: shellAdapterForFieldStaffDestination(destination),
    usedFallback: destination !== item.sufficientDestination,
  };
};

export const FIELD_STAFF_EMPTY_SESSION_CONTEXT: FieldStaffSessionContext = {
  hasSupportObject: false,
  hasOccurrenceContext: false,
};

export type FieldStaffTaskViewState = Readonly<{
  activeGlobalId: FieldStaffTaskGlobalId;
  destination: FieldStaffTaskDestinationId;
  sessionContext: FieldStaffSessionContext;
  chosenOccurrenceId?: string;
}>;

export type FieldStaffSessionEvent =
  | Readonly<{ type: "GLOBAL"; globalId: FieldStaffTaskGlobalId }>
  | Readonly<{ type: "SELECT_OCCURRENCE"; occurrenceId: string }>
  | Readonly<{ type: "CLEAR_CHOSEN_OCCURRENCE" }>
  | Readonly<{
      type: "PERSON_OPEN";
      userId: string;
      hasCurrentDayOccurrence: boolean;
    }>
  | Readonly<{ type: "PERSON_BACK" }>
  | Readonly<{ type: "PROCEDURE_COMPLETE" }>
  | Readonly<{ type: "PERSON_C4_PROCEDURE" }>;

const withFlags = (
  state: FieldStaffTaskViewState,
  patch: Partial<FieldStaffTaskViewState> & {
    sessionContext: FieldStaffSessionContext;
    destination: FieldStaffTaskDestinationId;
  },
): FieldStaffTaskViewState => {
  const sessionContext = patch.sessionContext.hasOccurrenceContext
    ? { ...patch.sessionContext, hasSupportObject: true }
    : patch.sessionContext;
  return {
    ...state,
    ...patch,
    sessionContext,
  };
};

export const initialFieldStaffTaskViewState = (): FieldStaffTaskViewState => ({
  activeGlobalId: "GLOBAL-TODAY",
  destination: FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  sessionContext: FIELD_STAFF_EMPTY_SESSION_CONTEXT,
});

/**
 * Unique FIELD_STAFF session-context transitions (CORR-1G). Unlisted events
 * must not be applied by callers (H-6).
 */
export const applyFieldStaffSessionEvent = (
  state: FieldStaffTaskViewState,
  event: FieldStaffSessionEvent,
): FieldStaffTaskViewState => {
  switch (event.type) {
    case "GLOBAL": {
      const resolution = resolveFieldStaffTaskSelection(event.globalId, state.sessionContext);
      return {
        ...state,
        activeGlobalId: event.globalId,
        destination: resolution.destination,
      };
    }
    case "SELECT_OCCURRENCE": {
      if (state.destination === "D-TODAY") {
        return withFlags(state, {
          destination: "D-PROCEDURE",
          activeGlobalId: "GLOBAL-PROCEDURE",
          chosenOccurrenceId: event.occurrenceId,
          sessionContext: {
            hasSupportObject: true,
            hasOccurrenceContext: state.sessionContext.hasOccurrenceContext,
          },
        });
      }
      if (state.destination === "D-UNRECORDED") {
        return withFlags(state, {
          destination: "D-RECORD-WRITE",
          activeGlobalId: "GLOBAL-RECORD-WRITE",
          chosenOccurrenceId: event.occurrenceId,
          sessionContext: {
            hasSupportObject: true,
            hasOccurrenceContext: true,
          },
        });
      }
      return state;
    }
    case "CLEAR_CHOSEN_OCCURRENCE": {
      if (!state.chosenOccurrenceId) {
        return state;
      }
      if (state.destination === "D-TODAY") {
        return {
          ...state,
          chosenOccurrenceId: undefined,
          sessionContext: FIELD_STAFF_EMPTY_SESSION_CONTEXT,
        };
      }
      if (state.destination === "D-UNRECORDED") {
        return {
          ...state,
          chosenOccurrenceId: undefined,
          sessionContext: {
            hasSupportObject: state.sessionContext.hasSupportObject,
            hasOccurrenceContext: false,
          },
        };
      }
      return state;
    }
    case "PERSON_OPEN": {
      if (event.hasCurrentDayOccurrence) {
        return withFlags(state, {
          destination: "D-PERSON",
          activeGlobalId: "GLOBAL-FIND-PERSON",
          sessionContext: {
            hasSupportObject: true,
            hasOccurrenceContext: state.sessionContext.hasOccurrenceContext,
          },
        });
      }
      return {
        ...state,
        destination: "D-PERSON",
        activeGlobalId: "GLOBAL-FIND-PERSON",
        chosenOccurrenceId: undefined,
        sessionContext: FIELD_STAFF_EMPTY_SESSION_CONTEXT,
      };
    }
    case "PERSON_BACK": {
      return {
        ...state,
        destination: "D-FIND-PERSON",
        activeGlobalId: "GLOBAL-FIND-PERSON",
        chosenOccurrenceId: undefined,
        sessionContext: FIELD_STAFF_EMPTY_SESSION_CONTEXT,
      };
    }
    case "PROCEDURE_COMPLETE": {
      if (!state.sessionContext.hasSupportObject) {
        return state;
      }
      return withFlags(state, {
        destination: "D-RECORD-WRITE",
        activeGlobalId: "GLOBAL-RECORD-WRITE",
        sessionContext: {
          hasSupportObject: true,
          hasOccurrenceContext: true,
        },
      });
    }
    case "PERSON_C4_PROCEDURE": {
      if (!state.sessionContext.hasSupportObject) {
        return state;
      }
      return {
        ...state,
        destination: "D-PROCEDURE",
        activeGlobalId: "GLOBAL-PROCEDURE",
      };
    }
    default: {
      const exhaustive: never = event;
      throw new Error(`Unhandled FIELD_STAFF session event: ${JSON.stringify(exhaustive)}`);
    }
  }
};

export const fieldStaffDayBoardClearVisible = (
  destination: FieldStaffTaskDestinationId,
  chosenOccurrenceId: string | undefined,
): boolean =>
  Boolean(chosenOccurrenceId) && (destination === "D-TODAY" || destination === "D-UNRECORDED");
