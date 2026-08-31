import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_DECISIONS,
  MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION,
  mintMonitoringPeriodReviewOutcomeId,
  toMonitoringPeriodReviewOutcomeDto,
  validateMonitoringPeriodReviewOutcomeDto,
} from "../../src/domain/monitoring-period-review-outcome";

describe("MonitoringPeriodReviewOutcome contract", () => {
  it("locks schema identity, decision vocabulary, and LIVE WRITE false", () => {
    assert.equal(
      MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.outcome",
    );
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION, "1.0.0");
    assert.deepEqual([...MONITORING_PERIOD_REVIEW_DECISIONS], ["NO_CHANGE", "CHANGE_REQUIRED"]);
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED, false);
  });

  it("round-trips the DTO envelope and rejects schema drift", () => {
    const input = {
      OrganizationId: "synthetic-org-001",
      SiteId: "synthetic-site-001",
      UserId: "synthetic-user-001",
      planId: "synthetic-plan-001",
      planVersion: 2,
      periodStart: "2026-08-01T00:00:00+09:00",
      periodEnd: "2026-08-31T23:59:59+09:00",
      sourceRecordIds: [] as readonly string[],
      decision: "NO_CHANGE" as const,
      reviewedAt: "2026-08-31T18:00:00+09:00",
      reviewedBy: "synthetic-staff-001",
    };
    const outcome = { OutcomeId: mintMonitoringPeriodReviewOutcomeId(input), ...input };
    const dto = toMonitoringPeriodReviewOutcomeDto(outcome);
    assert.equal(validateMonitoringPeriodReviewOutcomeDto(dto), true);
    assert.equal(
      validateMonitoringPeriodReviewOutcomeDto({ ...dto, dtoVersion: "2.0.0" }),
      false,
    );
  });
});
