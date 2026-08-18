import { shouldClearNextVersionConceptHighlight } from "./next-version-highlight";

describe("ADMIN-DEMO-UX-POLISH-1 next-version highlight lifetime", () => {
  it("clears highlight when destination leaves users regardless of review origin", () => {
    expect(
      shouldClearNextVersionConceptHighlight({
        destination: "overview",
        freshSupportPlanEntry: false,
      }),
    ).toBe(true);
    expect(
      shouldClearNextVersionConceptHighlight({
        destination: "records",
        freshSupportPlanEntry: false,
      }),
    ).toBe(true);
  });

  it("clears highlight on a fresh SupportPlan entry even while destination stays users", () => {
    expect(
      shouldClearNextVersionConceptHighlight({
        destination: "users",
        freshSupportPlanEntry: true,
      }),
    ).toBe(true);
  });

  it("keeps highlight while remaining on users without a fresh SupportPlan entry", () => {
    expect(
      shouldClearNextVersionConceptHighlight({
        destination: "users",
        freshSupportPlanEntry: false,
      }),
    ).toBe(false);
  });
});
