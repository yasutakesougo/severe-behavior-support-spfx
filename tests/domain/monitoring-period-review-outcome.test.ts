import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mintMonitoringPeriodReviewOutcomeId,
  type MonitoringPeriodReviewOutcome,
  validateMonitoringPeriodReviewOutcome,
} from "../../src/domain/monitoring-period-review-outcome";

function createOutcome(
  overrides: Partial<MonitoringPeriodReviewOutcome> = {},
): MonitoringPeriodReviewOutcome {
  const input = {
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: "synthetic-user-001",
    planId: "synthetic-plan-001",
    planVersion: 2,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    sourceRecordIds: ["synthetic-record-001", "synthetic-record-002"] as readonly string[],
    decision: "NO_CHANGE" as const,
    reviewedAt: "2026-08-31T18:00:00+09:00",
    reviewedBy: "synthetic-staff-001",
  };
  return {
    OutcomeId: mintMonitoringPeriodReviewOutcomeId(input),
    ...input,
    ...overrides,
  };
}

describe("MonitoringPeriodReviewOutcome domain", () => {
  it("accepts NO_CHANGE and CHANGE_REQUIRED as first-class decisions", () => {
    assert.equal(validateMonitoringPeriodReviewOutcome(createOutcome()), true);
    assert.equal(
      validateMonitoringPeriodReviewOutcome(createOutcome({ decision: "CHANGE_REQUIRED" })),
      true,
    );
  });

  it("allows a zero-record review while rejecting duplicate source RecordIds", () => {
    assert.equal(validateMonitoringPeriodReviewOutcome(createOutcome({ sourceRecordIds: [] })), true);
    assert.equal(
      validateMonitoringPeriodReviewOutcome(
        createOutcome({ sourceRecordIds: ["synthetic-record-001", "synthetic-record-001"] }),
      ),
      false,
    );
  });

  it("fails closed on malformed identity, version, period, timestamp, actor, or decision", () => {
    const valid = createOutcome();
    assert.equal(validateMonitoringPeriodReviewOutcome({ ...valid, OrganizationId: "" }), false);
    assert.equal(validateMonitoringPeriodReviewOutcome({ ...valid, planVersion: 0 }), false);
    assert.equal(
      validateMonitoringPeriodReviewOutcome({
        ...valid,
        periodEnd: "2026-07-31T23:59:59+09:00",
      }),
      false,
    );
    assert.equal(validateMonitoringPeriodReviewOutcome({ ...valid, reviewedAt: "not-a-time" }), false);
    assert.equal(validateMonitoringPeriodReviewOutcome({ ...valid, reviewedBy: "" }), false);
    assert.equal(
      validateMonitoringPeriodReviewOutcome({ ...valid, decision: "PENDING" }),
      false,
    );
  });

  it("mints the same OutcomeId for the same decision payload regardless of sourceRecordIds order", () => {
    const base = createOutcome();
    const inputA = {
      OrganizationId: base.OrganizationId,
      SiteId: base.SiteId,
      UserId: base.UserId,
      planId: base.planId,
      planVersion: base.planVersion,
      periodStart: base.periodStart,
      periodEnd: base.periodEnd,
      sourceRecordIds: ["synthetic-record-002", "synthetic-record-001"],
      decision: base.decision,
      reviewedAt: base.reviewedAt,
      reviewedBy: base.reviewedBy,
    };
    const inputB = { ...inputA, sourceRecordIds: [...inputA.sourceRecordIds].reverse() };
    assert.equal(
      mintMonitoringPeriodReviewOutcomeId(inputA),
      mintMonitoringPeriodReviewOutcomeId(inputB),
    );
  });

  it("changes OutcomeId when the human decision payload changes", () => {
    const base = createOutcome();
    const common = {
      OrganizationId: base.OrganizationId,
      SiteId: base.SiteId,
      UserId: base.UserId,
      planId: base.planId,
      planVersion: base.planVersion,
      periodStart: base.periodStart,
      periodEnd: base.periodEnd,
      sourceRecordIds: base.sourceRecordIds,
      reviewedAt: base.reviewedAt,
      reviewedBy: base.reviewedBy,
    };
    assert.notEqual(
      mintMonitoringPeriodReviewOutcomeId({ ...common, decision: "NO_CHANGE" }),
      mintMonitoringPeriodReviewOutcomeId({ ...common, decision: "CHANGE_REQUIRED" }),
    );
  });
});
