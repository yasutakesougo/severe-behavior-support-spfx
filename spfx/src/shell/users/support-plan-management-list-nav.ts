import type {
  SupportPlanManagementListNext,
  SupportPlanManagementRow,
} from "./support-plan-management-list-types";

export function resolveSupportPlanManagementListNext(
  row: SupportPlanManagementRow,
  existingPlanUserId: string,
): SupportPlanManagementListNext {
  if (row.actionKind === "create") {
    return { kind: "create", userId: row.userId };
  }
  if (row.userId === existingPlanUserId) {
    return { kind: "existing-plan", userId: row.userId };
  }
  return { kind: "synthetic-detail", userId: row.userId };
}
