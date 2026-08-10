import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateObservationPeriodMembership,
  toObservationPeriodMembershipInputs,
  validateSupportPlanObservationPeriodLogical,
} from "../../src/domain";

const validFrom = "2026-04-10T00:00:00.000Z";
const validTo = "2026-04-20T00:00:00.000Z";
const validAsOf = "2026-04-15T00:00:00.000Z";

describe("SupportPlan observation period logical schema contract (Decision-OP-3)", () => {
  it("accepts both observationPeriodFrom and observationPeriodTo as valid ISO DateTime", () => {
    const result = validateSupportPlanObservationPeriodLogical({
      observationPeriodFrom: validFrom,
      observationPeriodTo: validTo,
    });

    assert.deepEqual(result, {
      ok: true,
      observationPeriod: {
        observationPeriodFrom: validFrom,
        observationPeriodTo: validTo,
      },
    });
  });

  it("rejects missing observationPeriodFrom", () => {
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodTo: validTo,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing observationPeriodTo (open-ended period NOT ADOPTED)", () => {
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodFrom: validFrom,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects invalid DateTime values fail-closed", () => {
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodFrom: "not-a-date",
        observationPeriodTo: validTo,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodFrom: validFrom,
        observationPeriodTo: "2026-13-40T00:00:00.000Z",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodFrom: "",
        observationPeriodTo: validTo,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects non-record input and unknown keys", () => {
    assert.deepEqual(validateSupportPlanObservationPeriodLogical(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      validateSupportPlanObservationPeriodLogical({
        observationPeriodFrom: validFrom,
        observationPeriodTo: validTo,
        extra: "forbidden",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("maps valid logical record to membership-compatible inputs without changing membership behavior", () => {
    const validated = validateSupportPlanObservationPeriodLogical({
      observationPeriodFrom: validFrom,
      observationPeriodTo: validTo,
    });
    assert.equal(validated.ok, true);
    if (!validated.ok) {
      return;
    }

    const inputs = toObservationPeriodMembershipInputs(validated.observationPeriod);
    assert.deepEqual(inputs, {
      periodFrom: validFrom,
      periodTo: validTo,
    });
    assert.equal(
      evaluateObservationPeriodMembership(inputs.periodFrom, inputs.periodTo, validAsOf),
      "IN_PERIOD",
    );
  });
});
