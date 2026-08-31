import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  buildMonitoringPeriodReviewOutcomeNote,
  validateMonitoringPeriodReviewOutcomeNote,
} from "../../src/domain/monitoring-period-review-outcome-note";

describe("MonitoringPeriodReviewOutcomeNote domain", () => {
  it("treats blank and whitespace-only notes as absent", () => {
    assert.deepEqual(buildMonitoringPeriodReviewOutcomeNote("outcome-1", ""), {
      status: "BLANK",
      note: null,
    });
    assert.deepEqual(buildMonitoringPeriodReviewOutcomeNote("outcome-1", "  \n  "), {
      status: "BLANK",
      note: null,
    });
  });

  it("normalizes non-blank text and anchors it to the existing OutcomeId", () => {
    const result = buildMonitoringPeriodReviewOutcomeNote(
      "outcome-1",
      "  継続して観察する  ",
    );
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    assert.deepEqual(result.note, { OutcomeId: "outcome-1", note: "継続して観察する" });
    assert.equal(validateMonitoringPeriodReviewOutcomeNote(result.note), true);
    assert.equal(Object.prototype.hasOwnProperty.call(result.note, "NoteId"), false);
  });

  it("uses one deterministic raw UTF-16 code-unit limit", () => {
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH, 255);
    assert.equal(
      buildMonitoringPeriodReviewOutcomeNote("outcome-1", "a".repeat(255)).status,
      "VALID",
    );
    assert.equal(
      buildMonitoringPeriodReviewOutcomeNote("outcome-1", "a".repeat(256)).status,
      "INVALID",
    );
    assert.equal(
      buildMonitoringPeriodReviewOutcomeNote("outcome-1", `${"a".repeat(254)}  `).status,
      "INVALID",
    );
  });

  it("rejects malformed records and requires already-normalized stored text", () => {
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNote({ OutcomeId: "", note: "memo" }),
      false,
    );
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNote({ OutcomeId: "outcome-1", note: " memo " }),
      false,
    );
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNote({ OutcomeId: "outcome-1", note: "" }),
      false,
    );
  });
});
