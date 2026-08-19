import {
  FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE,
  FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE,
  inspectScaleContextSafety,
} from "./field-staff-phase8-multi-user-scale-evidence";

describe("FIELD-STAFF-PHASE8-MULTI-USER-SCALE-EVIDENCE-1", () => {
  it("keeps the slice synthetic and mutation boundaries closed", () => {
    expect(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.presentationOnly).toBe(true);
    expect(
      FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.synthetic18UserScenarioAuthorized,
    ).toBe(true);
    expect(
      FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.saveStateSemanticsChangeAuthorized,
    ).toBe(false);
    expect(
      FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.correctionPersistenceAuthorized,
    ).toBe(false);
    expect(
      FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.cancellationSupersedeAuthorized,
    ).toBe(false);
    expect(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.abcExpansionAuthorized).toBe(false);
    expect(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.schemaChangeAuthorized).toBe(false);
    expect(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE.liveTenantIoAuthorized).toBe(false);
  });

  it("provides 18 distinct synthetic user contexts", () => {
    expect(inspectScaleContextSafety(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE)).toEqual({
      rowCount: 18,
      uniqueUserIds: true,
      uniquePersonLabels: true,
      rowsHaveRequiredContext: true,
    });
  });

  it("preserves the existing eight-user rows and appends scale-only rows", () => {
    expect(
      FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE.rows.slice(0, 8).map((row) => row.id),
    ).toEqual(["user-a", "user-b", "user-c", "user-d", "user-e", "user-f", "user-g", "user-h"]);
    expect(FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE.rows.slice(8).map((row) => row.id)).toEqual([
      "scale-user-09",
      "scale-user-10",
      "scale-user-11",
      "scale-user-12",
      "scale-user-13",
      "scale-user-14",
      "scale-user-15",
      "scale-user-16",
      "scale-user-17",
      "scale-user-18",
    ]);
  });
});
