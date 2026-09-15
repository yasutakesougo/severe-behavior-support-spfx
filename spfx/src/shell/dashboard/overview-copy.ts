/**
 * DASHBOARD-UX-1 — fail-closed presentation copy.
 */

import type { OverviewKpiCard, ShellOverviewPresentation } from "./overview-types";

/**
 * Retained for fail-closed copy checks.
 * DEMO-UX-11: not rendered on Overview (global DemoBanner covers synthetic/no-live).
 */
export const DASHBOARD_OVERVIEW_PRESENTATION_NOTE =
  "この画面は合成データによる表示確認用です。業務データには接続されていません。";

export const DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE = "表示専用のため操作は無効です。";

export const DASHBOARD_OVERVIEW_ACTION_NAV_NOTE =
  "合成表示の画面間移動のみ可能です。保存や業務データへの接続はありません。";

/**
 * Retained for fail-closed / import compatibility.
 * DEMO-UX-11: not rendered; Family R note carries unique KPI correspondence meaning.
 */
export const DASHBOARD_OVERVIEW_KPI_NOTE =
  "件数は合成データです。絞り込み遷移は接続されていません。";

const TODAY_SUPPORT_BOARD_DISCLAIMER_GENERIC =
  "この「今日の支援」は合成の日次ボードです。利用者一覧の対象者集合とは別です。業務データには接続されていません。";

/**
 * POLISH-1 Unit 1: Overview day-board is a separate synthetic context from Users roster.
 * Person labels come from runtime items (first-seen order). Do not hardcode Aさん.
 */
export function formatTodaySupportBoardDisclaimer(personLabels: readonly string[]): string {
  const unique: string[] = [];
  for (const label of personLabels) {
    if (label.length === 0) {
      continue;
    }
    if (unique.indexOf(label) < 0) {
      unique.push(label);
    }
  }
  if (unique.length === 0) {
    return TODAY_SUPPORT_BOARD_DISCLAIMER_GENERIC;
  }
  return `この「今日の支援」は合成の日次ボードです（表示中の予定は ${unique.join("・")}）。利用者一覧の対象者集合とは別です。業務データには接続されていません。`;
}

/** Fail-closed copy must not claim usable business UI or live connection. */
export function overviewCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "認証済み",
    "authorized",
    "live sharepoint",
    "完成済み",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}

export const TODAY_TARGETS_UNAVAILABLE_STATUS_HINT = "確認できません";
export const TODAY_TARGETS_RESOLVED_STATUS_HINT = "本日の支援対象";

/**
 * S-POP / ISR1-P1-2 — today_targets from distinct TodaySupportItem.userId ∩ roster.
 * MODE_UNAVAILABLE when items are missing; count is type filler only (not population).
 */
export function resolveTodayTargetsKpiCard(
  todaySupportItems: readonly { userId: string }[] | undefined,
  rosterUserIds: readonly string[],
): OverviewKpiCard {
  if (todaySupportItems === undefined) {
    return {
      id: "today_targets",
      label: "今日の対象",
      count: 0,
      statusHint: TODAY_TARGETS_UNAVAILABLE_STATUS_HINT,
    };
  }
  const roster = new Set(rosterUserIds);
  const distinct = new Set<string>();
  for (const item of todaySupportItems) {
    if (roster.has(item.userId)) {
      distinct.add(item.userId);
    }
  }
  return {
    id: "today_targets",
    label: "今日の対象",
    count: distinct.size,
    statusHint: TODAY_TARGETS_RESOLVED_STATUS_HINT,
  };
}

export function isTodayTargetsUnavailableCard(card: OverviewKpiCard): boolean {
  return card.id === "today_targets" && card.statusHint === TODAY_TARGETS_UNAVAILABLE_STATUS_HINT;
}

/**
 * Product Overview wiring: today_targets is derived from the items actually
 * passed to Overview, not from a fixture-hardcoded population.
 */
export function applyTodayTargetsKpiToPresentation(
  presentation: ShellOverviewPresentation,
  todaySupportItems: readonly { userId: string }[] | undefined,
  rosterUserIds: readonly string[],
): ShellOverviewPresentation {
  const todayTargetsCard = resolveTodayTargetsKpiCard(todaySupportItems, rosterUserIds);
  return {
    ...presentation,
    kpiCards: presentation.kpiCards.map((card) =>
      card.id === "today_targets" ? todayTargetsCard : card,
    ),
  };
}
