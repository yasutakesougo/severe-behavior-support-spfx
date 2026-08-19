import {
  FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE,
  isUsersRosterDisclosureExpanded,
  toggleUsersRosterDisclosure,
  usersRosterDisclosureId,
} from "./users-roster-disclosure";

describe("FIELD-STAFF-PHASE8-ROSTER-CONTEXT-PRESERVING-DISCLOSURE-1", () => {
  it("keeps the correction tablet-only and all mutation boundaries closed", () => {
    expect(FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.presentationOnly).toBe(
      true,
    );
    expect(FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.tabletOnly).toBe(true);
    expect(
      FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.desktopLayoutChangeAuthorized,
    ).toBe(false);
    expect(
      FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.saveStateSemanticsChangeAuthorized,
    ).toBe(false);
    expect(
      FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.schemaChangeAuthorized,
    ).toBe(false);
    expect(
      FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE.liveTenantIoAuthorized,
    ).toBe(false);
  });

  it("keys disclosure state by userId without sharing another user's state", () => {
    const initial = {};
    const userAExpanded = toggleUsersRosterDisclosure(initial, "user-a");
    const userBExpanded = toggleUsersRosterDisclosure(userAExpanded, "user-b");

    expect(usersRosterDisclosureId("user-a")).toBe("users-roster-secondary-user-a");
    expect(isUsersRosterDisclosureExpanded(userAExpanded, "user-a")).toBe(true);
    expect(isUsersRosterDisclosureExpanded(userAExpanded, "user-b")).toBe(false);
    expect(isUsersRosterDisclosureExpanded(userBExpanded, "user-a")).toBe(true);
    expect(isUsersRosterDisclosureExpanded(userBExpanded, "user-b")).toBe(true);
    expect(toggleUsersRosterDisclosure(userBExpanded, "user-a")).toEqual({
      "user-a": false,
      "user-b": true,
    });
  });
});
