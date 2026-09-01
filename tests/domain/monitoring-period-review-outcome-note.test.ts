import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  normalizeMonitoringPeriodReviewOutcomeNote,
  validateMonitoringPeriodReviewOutcomeNote,
} from "../../src/domain/monitoring-period-review-outcome-note";

const OUTCOME_ID = "outcome-001";

// prettier-ignore
describe("MonitoringPeriodReviewOutcomeNote domain", () => {
  it("treats blank and whitespace-only drafts as no note record", () => {
    assert.deepEqual(normalizeMonitoringPeriodReviewOutcomeNote(OUTCOME_ID, ""), {
      status: "BLANK",
      note: null,
    });
    assert.deepEqual(normalizeMonitoringPeriodReviewOutcomeNote(OUTCOME_ID, " \n\t "), {
      status: "BLANK",
      note: null,
    });
  });

  it("accepts 1 and 255 UTF-16 code units and rejects 256 before trim", () => {
    const one = normalizeMonitoringPeriodReviewOutcomeNote(OUTCOME_ID, "a");
    assert.equal(one.status, "VALID");

    const max = normalizeMonitoringPeriodReviewOutcomeNote(
      OUTCOME_ID,
      "a".repeat(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH),
    );
    assert.equal(max.status, "VALID");

    const over = normalizeMonitoringPeriodReviewOutcomeNote(
      OUTCOME_ID,
      "a".repeat(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH + 1),
    );
    assert.equal(over.status, "INVALID");

    const wouldTrimToMax = normalizeMonitoringPeriodReviewOutcomeNote(
      OUTCOME_ID,
      `${"a".repeat(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH)} `,
    );
    assert.equal(wouldTrimToMax.status, "INVALID");
  });

  it("trims only after raw-length validation and keeps line breaks as plain text", () => {
    const result = normalizeMonitoringPeriodReviewOutcomeNote(
      OUTCOME_ID,
      "  <b>確認</b>\n次行  ",
    );
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    assert.equal(result.note.note, "<b>確認</b>\n次行");
    assert.equal(validateMonitoringPeriodReviewOutcomeNote(result.note), true);
  });

  it("fails closed on missing OutcomeId and on non-normalized stored note", () => {
    assert.equal(normalizeMonitoringPeriodReviewOutcomeNote("", "memo").status, "INVALID");
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNote({ OutcomeId: OUTCOME_ID, note: " memo " }),
      false,
    );
  });
});
