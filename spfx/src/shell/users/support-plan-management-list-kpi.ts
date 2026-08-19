import type {
  SupportPlanManagementAttentionKind,
  SupportPlanManagementRow,
} from "./support-plan-management-list-types";
import {
  formatFamilyPCountLabel,
  SUPPORT_PLAN_MANAGEMENT_KPI_LABELS,
} from "./support-plan-management-list-copy";

export type FamilyPCounts = Readonly<{
  needs_action: number;
  review_window: number;
  observation_wait: number;
}>;

export type FamilyPCountLabels = Readonly<{
  needsActionLabel: string;
  reviewWindowLabel: string;
  observationWaitLabel: string;
}>;

/** Deterministic Family P counts. Do not hardcode dashboard numbers. */
export function countFamilyPByAttentionKind(
  rows: readonly SupportPlanManagementRow[],
  kind: Exclude<SupportPlanManagementAttentionKind, "none">,
): number {
  return rows.filter((row) => row.attentionKind === kind).length;
}

export function buildFamilyPCounts(rows: readonly SupportPlanManagementRow[]): FamilyPCounts {
  return {
    needs_action: countFamilyPByAttentionKind(rows, "needs_action"),
    review_window: countFamilyPByAttentionKind(rows, "review_window"),
    observation_wait: countFamilyPByAttentionKind(rows, "observation_wait"),
  };
}

export function buildFamilyPCountLabels(rows: readonly SupportPlanManagementRow[]): FamilyPCountLabels {
  const counts = buildFamilyPCounts(rows);
  return {
    needsActionLabel: formatFamilyPCountLabel(
      SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.needs_action,
      counts.needs_action,
    ),
    reviewWindowLabel: formatFamilyPCountLabel(
      SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.review_window,
      counts.review_window,
    ),
    observationWaitLabel: formatFamilyPCountLabel(
      SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.observation_wait,
      counts.observation_wait,
    ),
  };
}

export function selectTodayActionRows(
  rows: readonly SupportPlanManagementRow[],
): readonly SupportPlanManagementRow[] {
  return rows.filter((row) => row.attentionKind !== "none");
}

export function rowForUserId(
  rows: readonly SupportPlanManagementRow[],
  userId: string,
): SupportPlanManagementRow | undefined {
  return rows.find((row) => row.userId === userId);
}
