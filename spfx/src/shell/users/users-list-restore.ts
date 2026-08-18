/**
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 4 — Users list scroll/filter/focus restore.
 * Session-local presentation state only. Does not persist, mutate 未記録, or resume drafts.
 */

import {
  isUsersFilterChipLabel,
  USERS_FILTER_CHIP_ALL,
  type UsersFilterChipLabel,
} from "./users-filter";

export const USERS_LIST_RESTORE_DEFAULT_CHIP: UsersFilterChipLabel = USERS_FILTER_CHIP_ALL;

export type UsersListRestoreFocusKind = "detail-button" | "heading";

export type UsersListRestoreTarget = Readonly<{
  kind: UsersListRestoreFocusKind;
  userId?: string;
}>;

export type UsersListRestoreState = Readonly<{
  filterChip: UsersFilterChipLabel;
  originUserId: string | undefined;
}>;

export const USERS_LIST_RESTORE_DISCARDED: UsersListRestoreState = {
  filterChip: USERS_LIST_RESTORE_DEFAULT_CHIP,
  originUserId: undefined,
};

export function rememberUsersFilterChip(
  chip: UsersFilterChipLabel | string | undefined,
): UsersFilterChipLabel {
  if (typeof chip === "string" && isUsersFilterChipLabel(chip)) {
    return chip;
  }
  return USERS_LIST_RESTORE_DEFAULT_CHIP;
}

export function rememberUsersFocusOrigin(userId: string | undefined): string | undefined {
  if (!userId) {
    return undefined;
  }
  return userId;
}

export function discardUsersListRestore(): UsersListRestoreState {
  return USERS_LIST_RESTORE_DISCARDED;
}

export function shouldRetainUsersListRestore(destination: string | undefined): boolean {
  return destination === "users";
}

/**
 * Explicit Users-list return only. Never selects another user by index or 未記録 order.
 */
export function resolveUsersListRestoreTarget(input: {
  authorized: boolean;
  restoreRequested: boolean;
  originUserId: string | undefined;
  visibleUserIds: readonly string[];
  detailEnabledUserIds: readonly string[];
}): UsersListRestoreTarget {
  if (!input.authorized || !input.restoreRequested) {
    return { kind: "heading" };
  }
  const originUserId = rememberUsersFocusOrigin(input.originUserId);
  if (!originUserId) {
    return { kind: "heading" };
  }
  if (input.visibleUserIds.indexOf(originUserId) < 0) {
    return { kind: "heading" };
  }
  if (input.detailEnabledUserIds.indexOf(originUserId) >= 0) {
    return { kind: "detail-button", userId: originUserId };
  }
  return { kind: "heading" };
}
