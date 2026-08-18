/**
 * FIELD-STAFF-COMPLETION-ON-CARDS-1 — M2 synthetic recorded-for-today.
 * Presentation-only projection of DEMO_UX_USERS_FIXTURE onto Users cards.
 * Independent of session save-state, LIVE WRITE, and ProcedureRecord persistence.
 * Does not mutate unrecorded badges or Family R KPI.
 */

import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";

export const FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE = {
  id: "FIELD-STAFF-COMPLETION-ON-CARDS-1",
  presentationOnly: true as const,
  syntheticRecordedForTodayAuthorized: true as const,
  liveSavedCompletionOnCardsAuthorized: false as const,
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

/** Visible copy: SSOT core 「本日記録した」 plus synthetic disclosure. */
export const SYNTHETIC_RECORDED_FOR_TODAY_LABEL = "本日記録した（合成データ）" as const;

export type SyntheticRecordedForTodayHidden = Readonly<{
  visible: false;
}>;

export type SyntheticRecordedForTodayVisible = Readonly<{
  visible: true;
  label: typeof SYNTHETIC_RECORDED_FOR_TODAY_LABEL;
}>;

export type SyntheticRecordedForTodayPresentation =
  SyntheticRecordedForTodayHidden | SyntheticRecordedForTodayVisible;

function fixtureRowById(userId: string): (typeof DEMO_UX_USERS_FIXTURE.rows)[number] | undefined {
  return DEMO_UX_USERS_FIXTURE.rows.find((row) => row.id === userId);
}

export function isFixtureUnrecordedUserId(userId: string): boolean {
  const row = fixtureRowById(userId);
  if (!row) {
    return false;
  }
  return row.statusBadges.some((badge) => badge.id === "unrecorded");
}

/**
 * Static fixture projection. Does not read session save-state, live persist, or row mutations.
 * user-a / user-e stay hidden because their fixture badges remain unrecorded.
 */
export function presentSyntheticRecordedForToday(input: {
  authorized: boolean;
  userId: string;
}): SyntheticRecordedForTodayPresentation {
  if (!input.authorized) {
    return { visible: false };
  }
  const row = fixtureRowById(input.userId);
  if (!row) {
    return { visible: false };
  }
  if (row.statusBadges.some((badge) => badge.id === "unrecorded")) {
    return { visible: false };
  }
  return {
    visible: true,
    label: SYNTHETIC_RECORDED_FOR_TODAY_LABEL,
  };
}

export function ariaLabelForSyntheticRecordedForToday(
  personLabel: string,
  presentation: SyntheticRecordedForTodayPresentation,
): string | undefined {
  if (!presentation.visible) {
    return undefined;
  }
  return `${personLabel}の合成データ: 本日記録した`;
}
