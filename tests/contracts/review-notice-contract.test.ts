import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateReviewDueRelativeToAsOf,
  validateReviewAnchorPolicy,
  validateReviewCadence,
  validateReviewNoticePolicy,
} from "../../src/domain";

const acceptedReviewNoticePolicy = {
  kind: "calendar_month" as const,
  trigger: "enter_target_review_month" as const,
  purpose: "notify_staff_review_period" as const,
  precision: "approximate" as const,
};

const acceptedReviewCadence = {
  unit: "month" as const,
  interval: 3 as const,
  precision: "approximate" as const,
};

const acceptedReviewAnchorPolicy = {
  first: "support_plan_effective_from" as const,
  subsequent: "previous_review_date" as const,
};

describe("Review notice contract (GOV-RULE-07)", () => {
  it("accepts the Accepted ReviewNoticePolicy quadruple", () => {
    assert.deepEqual(validateReviewNoticePolicy(acceptedReviewNoticePolicy), {
      ok: true,
      reviewNoticePolicy: acceptedReviewNoticePolicy,
    });
  });

  it("rejects missing kind", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        trigger: "enter_target_review_month",
        purpose: "notify_staff_review_period",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing trigger", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        purpose: "notify_staff_review_period",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing purpose", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        trigger: "enter_target_review_month",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects missing precision", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        trigger: "enter_target_review_month",
        purpose: "notify_staff_review_period",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect kind", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "day_count",
        trigger: "enter_target_review_month",
        purpose: "notify_staff_review_period",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect trigger", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        trigger: "thirty_days_before",
        purpose: "notify_staff_review_period",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect purpose", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        trigger: "enter_target_review_month",
        purpose: "mark_overdue",
        precision: "approximate",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect precision", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        kind: "calendar_month",
        trigger: "enter_target_review_month",
        purpose: "notify_staff_review_period",
        precision: "exact",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed and non-record input fail-closed", () => {
    assert.deepEqual(validateReviewNoticePolicy(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewNoticePolicy(undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewNoticePolicy("calendar_month"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects unknown keys fail-closed", () => {
    assert.deepEqual(
      validateReviewNoticePolicy({
        ...acceptedReviewNoticePolicy,
        daysBefore: 30,
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

  it("leaves ReviewAnchorPolicy validation unchanged", () => {
    assert.deepEqual(validateReviewAnchorPolicy(acceptedReviewAnchorPolicy), {
      ok: true,
      reviewAnchorPolicy: acceptedReviewAnchorPolicy,
    });
  });
});
