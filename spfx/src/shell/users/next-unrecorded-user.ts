/**
 * FIELD-STAFF-NEXT-UNRECORDED-USER-1 — next fixture-unrecorded Users row.
 * Presentation navigation assist only. Does not mutate badges, KPI, save 5-state, or persist.
 */

import type { UserListRow } from "./users-types";

export const FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE = {
  id: "FIELD-STAFF-NEXT-UNRECORDED-USER-1",
  presentationOnly: true as const,
  nextUnrecordedUserAuthorized: true as const,
  listToRecordFastPathAuthorized: false as const,
  liveSavedCompletionOnCardsAuthorized: false as const,
  syntheticRecordedForTodayAuthorized: false as const,
  unrecordedBadgeMutationAuthorized: false as const,
  kpiFamilyRRecountAuthorized: false as const,
  eightUserDetailCatalogAuthorized: false as const,
  procedureFixtureExpansionAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  savingPauseRemovalAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

const NEXT_UNRECORDED_REASON_ID = "field-staff-next-unrecorded-user-reason";

export const FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON =
  "この表示範囲に、次の未記録の利用者はいません。" as const;

export const FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX = "次の未記録の利用者" as const;

export type NextUnrecordedUser = Readonly<{
  userId: string;
  personLabel: string;
}>;

export type NextUnrecordedUserAction = "user_detail" | "list_focus";

export type NextUnrecordedUserCtaPresentation = Readonly<{
  visible: true;
  enabled: boolean;
  label: string;
  reason?: string;
  reasonId: string;
  action: NextUnrecordedUserAction;
  nextUserId?: string;
}>;

export function isUnrecordedUserRow(row: UserListRow): boolean {
  return row.statusBadges.some((badge) => badge.id === "unrecorded");
}

/**
 * First unrecorded fixture row AFTER the cursor in the supplied visible order.
 * Unknown / missing cursor fails closed. No wrap. Does not re-sort or mutate badges.
 */
export function selectNextUnrecordedUser(
  visibleRows: readonly UserListRow[],
  currentUserId: string | undefined,
): NextUnrecordedUser | undefined {
  if (!currentUserId) {
    return undefined;
  }
  const cursorIndex = visibleRows.findIndex((row) => row.id === currentUserId);
  if (cursorIndex < 0) {
    return undefined;
  }
  for (let index = cursorIndex + 1; index < visibleRows.length; index += 1) {
    const candidate = visibleRows[index];
    if (!candidate || !isUnrecordedUserRow(candidate)) {
      continue;
    }
    return { userId: candidate.id, personLabel: candidate.personLabel };
  }
  return undefined;
}

export function labelForNextUnrecordedUserCta(next: NextUnrecordedUser): string {
  return `${FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX}: ${next.personLabel}`;
}

export function resolveNextUnrecordedUserAction(
  nextUserId: string,
  detailEnabledUserIds: readonly string[],
): NextUnrecordedUserAction {
  if (detailEnabledUserIds.indexOf(nextUserId) >= 0) {
    return "user_detail";
  }
  return "list_focus";
}

export function presentNextUnrecordedUserCta(input: {
  authorized: boolean;
  currentUserId: string | undefined;
  visibleRows: readonly UserListRow[];
  detailEnabledUserIds: readonly string[];
}): NextUnrecordedUserCtaPresentation | Readonly<{ visible: false }> {
  if (!input.authorized || !input.currentUserId) {
    return { visible: false };
  }
  const next = selectNextUnrecordedUser(input.visibleRows, input.currentUserId);
  if (!next) {
    return {
      visible: true,
      enabled: false,
      label: FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX,
      reason: FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON,
      reasonId: NEXT_UNRECORDED_REASON_ID,
      action: "list_focus",
    };
  }
  return {
    visible: true,
    enabled: true,
    label: labelForNextUnrecordedUserCta(next),
    reasonId: NEXT_UNRECORDED_REASON_ID,
    action: resolveNextUnrecordedUserAction(next.userId, input.detailEnabledUserIds),
    nextUserId: next.userId,
  };
}
