/**
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 2 — session-local save-state overlay.
 * Presentation-only projection of existing ShellSaveState onto Users cards.
 * Does not change 5-state semantics, unrecorded badges, or persist outcomes.
 */

import { SHELL_SAVE_STATE_LABELS, type ShellSaveState } from "../ux/save-state";

export const FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE = {
  id: "FIELD-STAFF-MULTI-USER-UX-POLISH-1",
  presentationOnly: true as const,
  parameterizedDetailCopyAuthorized: true as const,
  sessionSaveStateCardOverlayAuthorized: true as const,
  nextActionableOccurrenceAuthorized: true as const,
  nextUnrecordedUserAuthorized: false as const,
  listScrollRestoreAuthorized: false as const,
  compactTabletUsersAuthorized: false as const,
  perUserDraftResumeAuthorized: false as const,
  liveSavedCompletionOnCardsAuthorized: false as const,
  syntheticRecordedForTodayAuthorized: false as const,
  unrecordedBadgeMutationAuthorized: false as const,
  kpiFamilyRRecountAuthorized: false as const,
  eightUserDetailCatalogAuthorized: false as const,
  procedureFixtureExpansionAuthorized: false as const,
  listToRecordFastPathAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  savingPauseRemovalAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

/** Card overlay subset — never includes `saved` (no persistence-success wording). */
export const USERS_SESSION_SAVE_OVERLAY_STATES = [
  "unsaved",
  "saving",
  "save_failed",
  "save_outcome_unknown",
] as const;

export type UsersSessionSaveOverlayState = (typeof USERS_SESSION_SAVE_OVERLAY_STATES)[number];

export type UsersSessionSaveOverlayHidden = Readonly<{
  visible: false;
}>;

export type UsersSessionSaveOverlayVisible = Readonly<{
  visible: true;
  state: UsersSessionSaveOverlayState;
  label: string;
}>;

export type UsersSessionSaveOverlay =
  UsersSessionSaveOverlayHidden | UsersSessionSaveOverlayVisible;

export type UsersSessionSaveStateByUserId = Readonly<Record<string, ShellSaveState>>;

/**
 * Project session save-state onto a Users card.
 * `saved` hides the overlay instead of showing 保存済み / 記録済み.
 * Missing and `unsaved` show 未保存. `save_outcome_unknown` stays independent.
 */
export function overlayForUserSessionSaveState(
  saveState: ShellSaveState | undefined,
): UsersSessionSaveOverlay {
  if (saveState === "saved") {
    return { visible: false };
  }
  if (saveState === "saving") {
    return {
      visible: true,
      state: "saving",
      label: SHELL_SAVE_STATE_LABELS.saving,
    };
  }
  if (saveState === "save_failed") {
    return {
      visible: true,
      state: "save_failed",
      label: SHELL_SAVE_STATE_LABELS.save_failed,
    };
  }
  if (saveState === "save_outcome_unknown") {
    return {
      visible: true,
      state: "save_outcome_unknown",
      label: SHELL_SAVE_STATE_LABELS.save_outcome_unknown,
    };
  }
  return {
    visible: true,
    state: "unsaved",
    label: SHELL_SAVE_STATE_LABELS.unsaved,
  };
}

export function overlayForUserId(
  userId: string,
  byUserId: UsersSessionSaveStateByUserId | undefined,
): UsersSessionSaveOverlay {
  return overlayForUserSessionSaveState(byUserId?.[userId]);
}

export function rememberUserSessionSaveState(
  prev: UsersSessionSaveStateByUserId,
  userId: string | undefined,
  state: ShellSaveState,
): UsersSessionSaveStateByUserId {
  if (!userId) {
    return prev;
  }
  if (prev[userId] === state) {
    return prev;
  }
  return { ...prev, [userId]: state };
}

export function ariaLabelForUsersSessionSaveOverlay(
  personLabel: string,
  overlay: UsersSessionSaveOverlay,
): string | undefined {
  if (!overlay.visible) {
    return undefined;
  }
  return `${personLabel}のセッション内保存状態: ${overlay.label}`;
}
