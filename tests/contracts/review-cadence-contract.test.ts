import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateReviewDueRelativeToAsOf, validateReviewCadence } from "../../src/domain";

const acceptedReviewCadence = {
  unit: "month" as const,
  interval: 3 as const,
  precision: "approximate" as const,
};

describe("Review cadence contract (GOV-RULE-06)", () => {
  it("accepts the Accepted ReviewCadence triple", () => {
    assert.deepEqual(validateReviewCadence(acceptedReviewCadence), {
      ok: true,
      reviewCadence: acceptedReviewCadence,
    });
  });

  it("rejects missing unit", () => {
    assert.deepEqual(
      validateReviewCadence({
        interval: 3,
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing interval", () => {
    assert.deepEqual(
      validateReviewCadence({
        unit: "month",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing precision", () => {
    assert.deepEqual(
      validateReviewCadence({
        unit: "month",
        interval: 3,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect unit", () => {
    assert.deepEqual(
      validateReviewCadence({
        unit: "day",
        interval: 3,
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect interval", () => {
    assert.deepEqual(
      validateReviewCadence({
        unit: "month",
        interval: 90,
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect precision", () => {
    assert.deepEqual(
      validateReviewCadence({
        unit: "month",
        interval: 3,
        precision: "exact",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed and non-record input fail-closed", () => {
    assert.deepEqual(validateReviewCadence(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewCadence(undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewCadence("month"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects unknown keys fail-closed", () => {
    assert.deepEqual(
      validateReviewCadence({
        ...acceptedReviewCadence,
        duration_days: 90,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("leaves evaluateReviewDueRelativeToAsOf behavior unchanged", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-10T00:00:00.000Z"),
      "BEFORE_DUE",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-20T12:00:00.000Z"),
      "DUE",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-21T00:00:00.000Z"),
      "OVERDUE",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("not-a-date", "2026-06-20T00:00:00.000Z"),
      "MALFORMED_INPUT",
    );
  });
});
