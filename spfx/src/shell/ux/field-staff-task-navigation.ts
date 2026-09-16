import type { ShellPrimaryNavigationId } from "./primary-navigation";

export type FieldStaffTaskDestinationId =
  "D-TODAY" | "D-PROCEDURE" | "D-RECORD-WRITE" | "D-UNRECORDED" | "D-FIND-PERSON";

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
  if (destination === "D-TODAY") {
    return "今日の支援";
  }
  return "業務ナビゲーション";
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
