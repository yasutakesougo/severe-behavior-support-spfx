import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateActivePlanUniqueness,
  toAsiaTokyoCalendarDay,
} from "../../src/domain";
import { createSyntheticActivePlan } from "./support-plan-fixtures";

describe("evaluateActivePlanUniqueness domain unit", () => {
  it("open-ended Active after a closed Active on a later Tokyo day stays CONFLICT", () => {
    const earlier = createSyntheticActivePlan({
      PlanId: "synthetic-plan-earlier",
      effectiveFrom: "2026-01-01T00:00:00.000Z",
      effectiveTo: "2026-01-15T12:00:00.000Z",
    });
    const openEnded = createSyntheticActivePlan({
      PlanId: "synthetic-plan-open",
      effectiveFrom: "2026-01-10T00:00:00.000Z",
    });

    assert.equal(evaluateActivePlanUniqueness([earlier, openEnded]), "CONFLICT");
  });

  it("rejects Active without effectiveFrom as MALFORMED_INPUT", () => {
    const broken = {
      ...createSyntheticActivePlan({ PlanId: "synthetic-plan-no-from" }),
    } as Record<string, unknown>;
    delete broken.effectiveFrom;

    assert.equal(
      evaluateActivePlanUniqueness([broken as never]),
      "MALFORMED_INPUT",
    );
  });

  it("formats Tokyo calendar days as YYYY-MM-DD", () => {
    assert.equal(toAsiaTokyoCalendarDay("2026-12-31T15:00:00.000Z"), "2027-01-01");
    assert.equal(toAsiaTokyoCalendarDay("not-iso"), null);
  });
});
