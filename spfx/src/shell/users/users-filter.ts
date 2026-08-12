/**
 * DEMO-UX-8 — synthetic client-side users list status filter.
 * Presentation-only. No live directory / SharePoint / business-rule calculation.
 */

import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
} from "../ux/status-labels";
import type { UserListRow, UserListStatusCategory } from "./users-types";

export const USERS_FILTER_CHIP_ALL = "すべて" as const;
export const USERS_FILTER_CHIP_NEEDS_REVIEW = SHELL_STATUS_LABEL_NEEDS_REVIEW;
export const USERS_FILTER_CHIP_UNRECORDED = SHELL_STATUS_LABEL_UNRECORDED;
export const USERS_FILTER_CHIP_DUE_SOON = SHELL_STATUS_LABEL_DUE_SOON;

export const USERS_FILTER_CHIP_LABELS = [
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_NEEDS_REVIEW,
  USERS_FILTER_CHIP_UNRECORDED,
  USERS_FILTER_CHIP_DUE_SOON,
] as const;

export type UsersFilterChipLabel = (typeof USERS_FILTER_CHIP_LABELS)[number];

export type UsersFilterMatchKey = Exclude<UserListStatusCategory, "normal">;

const CHIP_TO_MATCH_KEY: Readonly<Record<UsersFilterChipLabel, UsersFilterMatchKey | undefined>> = {
  [USERS_FILTER_CHIP_ALL]: undefined,
  [USERS_FILTER_CHIP_NEEDS_REVIEW]: "needs_review",
  [USERS_FILTER_CHIP_UNRECORDED]: "unrecorded",
  [USERS_FILTER_CHIP_DUE_SOON]: "deadline_near",
};

export function isUsersFilterChipLabel(value: string): value is UsersFilterChipLabel {
  return (USERS_FILTER_CHIP_LABELS as readonly string[]).indexOf(value) >= 0;
}

export function matchKeyForUsersFilterChip(
  chip: UsersFilterChipLabel,
): UsersFilterMatchKey | undefined {
  return CHIP_TO_MATCH_KEY[chip];
}

/** ANY badge.id equals selected key. `すべて` returns all rows. */
export function filterUserRowsByStatusChip(
  rows: readonly UserListRow[],
  chip: UsersFilterChipLabel,
): readonly UserListRow[] {
  const matchKey = matchKeyForUsersFilterChip(chip);
  if (matchKey === undefined) {
    return rows;
  }
  return rows.filter((row) => row.statusBadges.some((badge) => badge.id === matchKey));
}

export function formatUsersFilterSummaryLabel(
  visibleCount: number,
  chip: UsersFilterChipLabel,
  totalCount: number,
): string {
  if (chip === USERS_FILTER_CHIP_ALL) {
    return `全${totalCount}名（合成データ）`;
  }
  if (visibleCount === 0) {
    return `0名（${chip}・合成データ内で該当なし）`;
  }
  return `${visibleCount}名（${chip}・合成データ）`;
}

export const DEMO_UX_8_SLICE = {
  id: "DEMO-UX-8",
  presentationOnly: true as const,
  filterExecutionAuthorized: true as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  saveMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  multiSelectFilterAuthorized: false as const,
  detailPreviewExpansionAuthorized: false as const,
  recordFlowRedesignAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  failClosedSemanticsChangeAuthorized: false as const,
  unselectedStateRelaxationAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
} as const;
