import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
  buildMonitoringPeriodReviewOutcomeNote,
  toMonitoringPeriodReviewOutcomeNoteDto,
  validateMonitoringPeriodReviewOutcomeNoteDto,
} from "../../src/domain/monitoring-period-review-outcome-note";

describe("MonitoringPeriodReviewOutcomeNote contract", () => {
  it("locks schema identity and LIVE WRITE false", () => {
    assert.equal(
      MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.outcome-note",
    );
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION, "1.0.0");
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED, false);
  });

  it("round-trips a narrow DTO and rejects version drift", () => {
    const built = buildMonitoringPeriodReviewOutcomeNote("outcome-1", "補足");
    if (built.status !== "VALID") throw new Error("expected VALID");
    const dto = toMonitoringPeriodReviewOutcomeNoteDto(built.note);
    assert.equal(validateMonitoringPeriodReviewOutcomeNoteDto(dto), true);
    assert.equal(validateMonitoringPeriodReviewOutcomeNoteDto({ ...dto, dtoVersion: "2.0.0" }), false);
  });
});
