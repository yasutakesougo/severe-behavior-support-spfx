import type { ShellPrimaryNavigationId } from "./primary-navigation";

export type FieldStaffTaskDestinationId =
  | "D-TODAY"
  | "D-PROCEDURE"
  | "D-RECORD-WRITE"
  | "D-UNRECORDED"
  | "D-FIND-PERSON";

export type FieldStaffTaskNavigationItem = Readonly<{
  id: FieldStaffTaskDestinationId;
  label: string;
  shellDestination: ShellPrimaryNavigationId;
  requiresPersonContext: boolean;
  contextHint: string;
}>;

/**
 * SBS-ROLE-TASK-FIRST-IA-IMPL-SLICE-1.
 * Product-facing FIELD_STAFF navigation. The legacy shell destination is an
 * implementation adapter only; product Destination identity remains the D-* id.
 */
export const FIELD_STAFF_TASK_NAV_ITEMS: readonly FieldStaffTaskNavigationItem[] = [
  {
    id: "D-TODAY",
    label: "今日",
    shellDestination: "overview",
    requiresPersonContext: false,
    contextHint: "今日の支援対象と、次に行うことを確認します。",
  },
  {
    id: "D-PROCEDURE",
    label: "手順",
    shellDestination: "users",
    requiresPersonContext: true,
    contextHint: "対象の利用者を選ぶと、現在の手順を確認できます。",
  },
  {
    id: "D-RECORD-WRITE",
    label: "記録する",
    shellDestination: "users",
    requiresPersonContext: true,
    contextHint: "対象の利用者を選び、手順から記録へ進みます。",
  },
  {
    id: "D-UNRECORDED",
    label: "未記録",
    shellDestination: "users",
    requiresPersonContext: false,
    contextHint: "利用者一覧の「未記録」で対象を絞り込み、記録へ戻れます。",
  },
  {
    id: "D-FIND-PERSON",
    label: "探す",
    shellDestination: "users",
    requiresPersonContext: false,
    contextHint: "利用者一覧から対象の利用者を探します。",
  },
] as const;

export const FIELD_STAFF_DEFAULT_TASK_DESTINATION: FieldStaffTaskDestinationId = "D-TODAY";

export const fieldStaffTaskNavigationItem = (
  destination: FieldStaffTaskDestinationId,
): FieldStaffTaskNavigationItem => {
  const item = FIELD_STAFF_TASK_NAV_ITEMS.find(
    (candidate) => candidate.id === destination,
  );
  if (!item) {
    throw new Error(`Unknown FIELD_STAFF task destination: ${destination}`);
  }
  return item;
};

export type FieldStaffTaskEntry = Readonly<{
  destination: FieldStaffTaskDestinationId;
  shellDestination: ShellPrimaryNavigationId;
  contextRequired: boolean;
}>;

/**
 * Missing context never redirects to another product Destination. The shell
 * adapter may display the existing users surface to acquire the required person,
 * while the D-* Destination identity remains unchanged.
 */
export const resolveFieldStaffTaskEntry = (
  destination: FieldStaffTaskDestinationId,
  hasPersonContext: boolean,
): FieldStaffTaskEntry => {
  const item = fieldStaffTaskNavigationItem(destination);
  return {
    destination,
    shellDestination: item.shellDestination,
    contextRequired: item.requiresPersonContext && !hasPersonContext,
  };
};
