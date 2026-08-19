/** Tablet-only secondary roster metadata disclosure. Presentation state is keyed by userId. */
export const FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE = {
  id: "FIELD-STAFF-PHASE8-ROSTER-CONTEXT-PRESERVING-DISCLOSURE-1",
  presentationOnly: true as const,
  tabletOnly: true as const,
  userIdKeyedStateAuthorized: true as const,
  desktopLayoutChangeAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  correctionPersistenceAuthorized: false as const,
  cancellationSupersedeAuthorized: false as const,
  abcExpansionAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export type UsersRosterDisclosureState = Readonly<Record<string, boolean>>;

export function usersRosterDisclosureId(userId: string): string {
  return `users-roster-secondary-${userId}`;
}

export function isUsersRosterDisclosureExpanded(
  state: UsersRosterDisclosureState,
  userId: string,
): boolean {
  return state[userId] === true;
}

export function toggleUsersRosterDisclosure(
  state: UsersRosterDisclosureState,
  userId: string,
): UsersRosterDisclosureState {
  return { ...state, [userId]: !isUsersRosterDisclosureExpanded(state, userId) };
}
