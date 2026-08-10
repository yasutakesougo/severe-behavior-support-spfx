import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateReviewDueRelativeToAsOf,
  validateReviewAnchorPolicy,
  validateReviewCadence,
  validateReviewMonitoringGuidancePolicy,
  validateReviewNoticePolicy,
} from "../../src/domain";

const acceptedReviewMonitoringGuidancePolicy = {
  kind: "informational_cadence_guide" as const,
  guideText: "3か月に1回程度" as const,
  purpose: "display_and_notify_as_guide" as const,
  institutionalReviewCadence: "maintained" as const,
  overdueState: "not_adopted" as const,
  overdueWarning: "not_adopted" as const,
  overdueBusinessRestriction: "not_adopted" as const,
  fixedNinetyDays: "not_adopted" as const,
  hardDueOverdue: "not_adopted" as const,
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

const acceptedReviewNoticePolicy = {
  kind: "calendar_month" as const,
  trigger: "enter_target_review_month" as const,
  purpose: "notify_staff_review_period" as const,
  precision: "approximate" as const,
};

describe("Review monitoring guidance contract (Decision-RD-3)", () => {
  it("accepts the Accepted ReviewMonitoringGuidancePolicy literals", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy(acceptedReviewMonitoringGuidancePolicy),
      {
        ok: true,
        reviewMonitoringGuidancePolicy: acceptedReviewMonitoringGuidancePolicy,
      },
    );
  });

  it("rejects missing kind", () => {
    const { kind: _kind, ...rest } = acceptedReviewMonitoringGuidancePolicy;
    assert.deepEqual(validateReviewMonitoringGuidancePolicy(rest), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects missing guideText", () => {
    const { guideText: _guideText, ...rest } = acceptedReviewMonitoringGuidancePolicy;
    assert.deepEqual(validateReviewMonitoringGuidancePolicy(rest), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects incorrect kind", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
        kind: "hard_due_engine",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects incorrect guideText", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
        guideText: "90日に1回",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects overdueState adopted", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
        overdueState: "adopted",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects fixedNinetyDays adopted", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
        fixedNinetyDays: "adopted",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects hardDueOverdue adopted", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
        hardDueOverdue: "adopted",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed and non-record input fail-closed", () => {
    assert.deepEqual(validateReviewMonitoringGuidancePolicy(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewMonitoringGuidancePolicy(undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateReviewMonitoringGuidancePolicy("informational_cadence_guide"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects unknown keys fail-closed", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy({
        ...acceptedReviewMonitoringGuidancePolicy,
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

  it("leaves ReviewNoticePolicy validation unchanged", () => {
    assert.deepEqual(validateReviewNoticePolicy(acceptedReviewNoticePolicy), {
      ok: true,
      reviewNoticePolicy: acceptedReviewNoticePolicy,
    });
  });
});
