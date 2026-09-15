import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
} from "../ux/status-labels";
import { countRowsWithBadgeId } from "../ux/kpi-review-count";
import { DEMO_UX_USERS_FIXTURE } from "../users/users-fixture";
import type { ShellOverviewPresentation } from "./overview-types";
import { resolveTodayTargetsKpiCard } from "./overview-copy";

const rosterRows = DEMO_UX_USERS_FIXTURE.rows;
const rosterUserIds = rosterRows.map((row) => row.id);
// Fixture is not population authority for today_targets (S-POP). Overview
// derives MODE_RESOLVED / MODE_UNAVAILABLE from actual todaySupportItems.
const todayTargetsCard = resolveTodayTargetsKpiCard(undefined, rosterUserIds);
const rosterNeedsReviewCount = countRowsWithBadgeId(rosterRows, "needs_review");
const rosterUnrecordedCount = countRowsWithBadgeId(rosterRows, "unrecorded");
const rosterDeadlineNearCount = countRowsWithBadgeId(rosterRows, "deadline_near");

/**
 * Synthetic overview fixture.
 * DEMO-UX-10: 要確認/未記録/期限接近 counts are Family R (same definition as Users filter).
 * today_targets remains an independent overview card (not in RPF-006 correspondence).
 */
export const DASHBOARD_UX_OVERVIEW_FIXTURE: ShellOverviewPresentation = {
  kpiCards: [
    todayTargetsCard,
    {
      id: "needs_review",
      label: SHELL_STATUS_LABEL_NEEDS_REVIEW,
      count: rosterNeedsReviewCount,
      statusHint: "確認が必要（利用者一覧と同じ定義・名）",
    },
    {
      id: "unrecorded",
      label: SHELL_STATUS_LABEL_UNRECORDED,
      count: rosterUnrecordedCount,
      statusHint: "記録未入力（利用者一覧と同じ定義・名）",
    },
    {
      id: "deadline_near",
      label: SHELL_STATUS_LABEL_DUE_SOON,
      count: rosterDeadlineNearCount,
      statusHint: "見直し期限が近い（利用者一覧と同じ定義・名）",
    },
  ],
  actionItems: [
    {
      id: "action-a",
      personLabel: "Aさん",
      reason: "支援記録が未入力",
      actionLabel: "記録する",
      navigation: { kind: "records" },
    },
    {
      id: "action-b",
      personLabel: "Bさん",
      reason: "支援計画の見直しまで7日",
      actionLabel: "確認する",
      navigation: { kind: "review_due" },
    },
    {
      id: "action-c",
      personLabel: "Cさん",
      reason: "支援計画の確認が必要",
      actionLabel: "見る",
      navigation: { kind: "user_detail", userId: "user-c" },
    },
  ],
  recentRecords: [
    {
      id: "recent-a",
      personLabel: "Aさん",
      timeLabel: "14:32",
      recordType: "支援記録",
    },
    {
      id: "recent-d",
      personLabel: "Dさん",
      timeLabel: "13:05",
      recordType: "支援記録",
    },
  ],
};

export const DASHBOARD_UX_SLICE = {
  id: "DASHBOARD-UX-1",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveOverviewDataAuthorized: false as const,
  kpiNavigationAuthorized: false as const,
  actionExecutionAuthorized: false as const,
} as const;

/**
 * VISUAL-POLISH-2 — Overview presentation-only boundary.
 *
 * The slice may adapt Overview presentation, but it does not authorize live
 * data, business semantics, navigation changes, or external writes.
 */
export const VISUAL_POLISH_2_OVERVIEW_SLICE = {
  id: "VISUAL-POLISH-2",
  target: "Overview",
  presentationOnly: true as const,
  statusVocabularyChangeAuthorized: false as const,
  saveStateChangeAuthorized: false as const,
  navigationSemanticsChangeAuthorized: false as const,
  liveOverviewDataAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;
