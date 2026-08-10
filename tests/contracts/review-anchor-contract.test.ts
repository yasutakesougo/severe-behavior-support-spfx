import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateReviewDueRelativeToAsOf,
  validateReviewAnchorPolicy,
  validateReviewCadence,
} from "../../src/domain";

const acceptedReviewAnchorPolicy = {
  first: "support_plan_effective_from" as const,
  subsequent: "previous_review_date" as const,
};

const acceptedReviewCadence = {
  unit: "month" as const,
  interval: 3 as const,
  precision: "approximate" as const,
};

describe("Review anchor contract (GOV-RULE-05)", () => {
  it("accepts the Accepted ReviewAnchorPolicy pair", () => {
    assert.deepEqual(validateReviewAnchorPolicy(acceptedReviewAnchorPolicy), {
      ok: true,
      reviewAnchorPolicy: acceptedReviewAnchorPolicy,
    });
  });

  it("rejects missing first", () => {
    assert.deepEqual(
      validateReviewAnchorPolicy({
        subsequent: "previous_review_date",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing subsequent", () => {
    assert.deepEqual(
      validateReviewAnchorPolicy({
        first: "support_plan_effective_from",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect first", () => {
    assert.deepEqual(
      validateReviewAnchorPolicy({
        first: "plan_created_at",
        subsequent: "previous_review_date",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect subsequent", () => {
    assert.deepEqual(
      validateReviewAnchorPolicy({
        first: "support_plan_effective_from",
        subsequent: "last_review_due_date",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed and non-record input fail-closed", () => {
    assert.deepEqual(validateReviewAnchorPolicy(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewAnchorPolicy(undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewAnchorPolicy("support_plan_effective_from"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects unknown keys fail-closed", () => {
    assert.deepEqual(
      validateReviewAnchorPolicy({
        ...acceptedReviewAnchorPolicy,
        previousReviewDateField: "ReviewDate",
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

  it("leaves ReviewCadence validation unchanged", () => {
    assert.deepEqual(validateReviewCadence(acceptedReviewCadence), {
      ok: true,
      reviewCadence: acceptedReviewCadence,
    });
  });
});
