import {
  findVp2StaffVisibleForbiddenTokens,
  isOpaqueStaffActorId,
  staffVisibleTextAvoidsVp2ForbiddenTokens,
  VP2_STAFF_VISIBLE_FORBIDDEN_TOKENS,
} from "./vp2-staff-visible-copy";
import {
  FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CANCELLATION_REFRESH_NOTE,
  FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_PRESENTATION_NOTE,
} from "./procedure-copy";

describe("VP-2 staff-visible copy helpers", () => {
  it("treats fixture-style staff-* values as opaque actor ids", () => {
    expect(isOpaqueStaffActorId("staff-1")).toBe(true);
    expect(isOpaqueStaffActorId("staff-2")).toBe(true);
    expect(isOpaqueStaffActorId("山田太郎")).toBe(false);
    expect(isOpaqueStaffActorId("")).toBe(true);
  });

  it("flags forbidden technical tokens", () => {
    expect(findVp2StaffVisibleForbiddenTokens("live SharePoint WRITE")).toEqual(
      expect.arrayContaining(["SharePoint", "WRITE"]),
    );
    expect(staffVisibleTextAvoidsVp2ForbiddenTokens("訂正はデモ内での確認用です。")).toBe(true);
    expect(VP2_STAFF_VISIBLE_FORBIDDEN_TOKENS.length).toBeGreaterThan(5);
  });

  it("keeps staff-facing procedure notes free of forbidden tokens", () => {
    const notes = [
      FIELD_WORKFLOW_PRESENTATION_NOTE,
      FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
      FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
      FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
      FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE,
      FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE,
      FIELD_WORKFLOW_CANCELLATION_REFRESH_NOTE,
    ];
    for (const note of notes) {
      expect(findVp2StaffVisibleForbiddenTokens(note)).toEqual([]);
    }
  });
});
