/**
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 3 — next actionable ScheduledOccurrence.
 * Navigation assist only. Does not mutate occurrence status, bindings, KPI, or persist.
 */

import { SAVING_INTERACTION_PAUSE_NOTE } from "../ux/saving-progress-observability";
import type { ShellSaveState } from "../ux/save-state";

export type NextActionableOccurrenceItem = Readonly<{
  occurrenceId: string;
  userId: string;
  scheduledTime: string;
  activityLabel: string;
  canStartProcedureRecord: boolean;
  effectiveStatus?: string;
}>;

export type NextActionableOccurrence = Readonly<{
  occurrenceId: string;
  userId: string;
  scheduledTime: string;
  activityLabel: string;
}>;

export type NextActionableOccurrenceNavigation =
  | Readonly<{ kind: "current_procedure"; occurrence: NextActionableOccurrence }>
  | Readonly<{ kind: "today_support_day_board" }>;

export type NextActionableOccurrenceCtaPresentation = Readonly<{
  visible: true;
  enabled: boolean;
  label: string;
  reason?: string;
  reasonId: string;
  action: NextActionableOccurrenceNavigation["kind"];
  nextOccurrenceId?: string;
}>;

const NEXT_OCCURRENCE_REASON_ID = "field-workflow-next-occurrence-reason";

export const FIELD_WORKFLOW_NEXT_OCCURRENCE_UNSAVED_REASON =
  "未保存のため、次の支援手順へは進めません。" as const;

export const FIELD_WORKFLOW_NEXT_OCCURRENCE_UNKNOWN_REASON =
  "保存結果が確認できていないため、次の支援手順へは進めません。" as const;

export const FIELD_WORKFLOW_RETURN_TO_TODAY_SUPPORT_LABEL = "本日の支援予定へ戻る" as const;

export function isCreateActionableOccurrence(item: NextActionableOccurrenceItem): boolean {
  if (!item.canStartProcedureRecord) {
    return false;
  }
  if (item.effectiveStatus !== undefined && item.effectiveStatus !== "未実施") {
    return false;
  }
  return true;
}

/**
 * First CREATE-actionable occurrence AFTER the cursor in the supplied order.
 * Unknown cursor fails closed. No wrap. Same UserId only. Does not re-sort.
 */
export function selectNextActionableOccurrence(
  items: readonly NextActionableOccurrenceItem[],
  currentOccurrenceId: string | undefined,
): NextActionableOccurrence | undefined {
  if (!currentOccurrenceId) {
    return undefined;
  }
  const cursorIndex = items.findIndex((item) => item.occurrenceId === currentOccurrenceId);
  if (cursorIndex < 0) {
    return undefined;
  }
  const currentUserId = items[cursorIndex]?.userId;
  if (!currentUserId) {
    return undefined;
  }
  for (let index = cursorIndex + 1; index < items.length; index += 1) {
    const candidate = items[index];
    if (!candidate || candidate.userId !== currentUserId) {
      continue;
    }
    if (!isCreateActionableOccurrence(candidate)) {
      continue;
    }
    return {
      occurrenceId: candidate.occurrenceId,
      userId: candidate.userId,
      scheduledTime: candidate.scheduledTime,
      activityLabel: candidate.activityLabel,
    };
  }
  return undefined;
}

export function resolveNextActionableOccurrenceNavigation(
  items: readonly NextActionableOccurrenceItem[],
  currentOccurrenceId: string | undefined,
): NextActionableOccurrenceNavigation {
  const next = selectNextActionableOccurrence(items, currentOccurrenceId);
  if (!next) {
    return { kind: "today_support_day_board" };
  }
  return { kind: "current_procedure", occurrence: next };
}

export function labelForNextActionableOccurrenceCta(occurrence: NextActionableOccurrence): string {
  return `次の支援手順: ${occurrence.scheduledTime} ${occurrence.activityLabel}`;
}

export function isNextActionableOccurrenceNavigationEnabled(saveState: ShellSaveState): boolean {
  return saveState === "saved" || saveState === "save_failed";
}

export function reasonForNextActionableOccurrenceDisabled(
  saveState: ShellSaveState,
): string | undefined {
  if (saveState === "unsaved") {
    return FIELD_WORKFLOW_NEXT_OCCURRENCE_UNSAVED_REASON;
  }
  if (saveState === "saving") {
    return SAVING_INTERACTION_PAUSE_NOTE;
  }
  if (saveState === "save_outcome_unknown") {
    return FIELD_WORKFLOW_NEXT_OCCURRENCE_UNKNOWN_REASON;
  }
  return undefined;
}

export function presentNextActionableOccurrenceCta(input: {
  authorized: boolean;
  occurrenceId: string | undefined;
  saveState: ShellSaveState;
  items: readonly NextActionableOccurrenceItem[];
}): NextActionableOccurrenceCtaPresentation | Readonly<{ visible: false }> {
  if (!input.authorized || !input.occurrenceId) {
    return { visible: false };
  }
  const navigation = resolveNextActionableOccurrenceNavigation(input.items, input.occurrenceId);
  const enabled = isNextActionableOccurrenceNavigationEnabled(input.saveState);
  const reason = enabled ? undefined : reasonForNextActionableOccurrenceDisabled(input.saveState);
  if (navigation.kind === "current_procedure") {
    return {
      visible: true,
      enabled,
      label: labelForNextActionableOccurrenceCta(navigation.occurrence),
      reason,
      reasonId: NEXT_OCCURRENCE_REASON_ID,
      action: "current_procedure",
      nextOccurrenceId: navigation.occurrence.occurrenceId,
    };
  }
  return {
    visible: true,
    enabled,
    label: FIELD_WORKFLOW_RETURN_TO_TODAY_SUPPORT_LABEL,
    reason,
    reasonId: NEXT_OCCURRENCE_REASON_ID,
    action: "today_support_day_board",
  };
}
