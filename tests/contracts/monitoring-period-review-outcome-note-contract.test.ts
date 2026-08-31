import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
  normalizeMonitoringPeriodReviewOutcomeNote,
  toMonitoringPeriodReviewOutcomeNoteDto,
  validateMonitoringPeriodReviewOutcomeNoteDto,
} from "../../src/domain/monitoring-period-review-outcome-note";

describe("MonitoringPeriodReviewOutcomeNote contract", () => {
  it("locks schema identity, bounded memo size, and LIVE WRITE false", () => {
    assert.equal(
      MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.outcome-note",
    );
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION, "1.0.0");
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH, 255);
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED, false);
  });

  it("round-trips the narrow DTO and rejects schema drift", () => {
    const result = normalizeMonitoringPeriodReviewOutcomeNote("outcome-001", "確認を継続");
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    const dto = toMonitoringPeriodReviewOutcomeNoteDto(result.note);
    assert.equal(validateMonitoringPeriodReviewOutcomeNoteDto(dto), true);
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNoteDto({ ...dto, dtoVersion: "2.0.0" }),
      false,
    );
  });
});
