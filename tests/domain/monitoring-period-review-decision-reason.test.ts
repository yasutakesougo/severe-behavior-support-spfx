import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeMonitoringPeriodReviewDecisionReason,
  validateMonitoringPeriodReviewDecisionReason,
} from "../../src/domain/monitoring-period-review-decision-reason";

const OUTCOME_ID = "outcome-001";

describe("MonitoringPeriodReviewDecisionReason domain", () => {
  it("treats blank and whitespace-only drafts as no reason record", () => {
    assert.deepEqual(normalizeMonitoringPeriodReviewDecisionReason(OUTCOME_ID, ""), {
      status: "BLANK",
      reason: null,
    });
    assert.deepEqual(normalizeMonitoringPeriodReviewDecisionReason(OUTCOME_ID, " \n\t "), {
      status: "BLANK",
      reason: null,
    });
  });

  it("trims human-authored rationale without introducing a max length", () => {
    const result = normalizeMonitoringPeriodReviewDecisionReason(
      OUTCOME_ID,
      `  ${"a".repeat(512)}  `,
    );
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    assert.equal(result.reason.reason.length, 512);
    assert.equal(validateMonitoringPeriodReviewDecisionReason(result.reason), true);
  });

  it("keeps HTML-like text as literal plain text", () => {
    const result = normalizeMonitoringPeriodReviewDecisionReason(
      OUTCOME_ID,
      "  <b>変更理由</b>\n次行  ",
    );
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    assert.equal(result.reason.reason, "<b>変更理由</b>\n次行");
  });

  it("fails closed on missing OutcomeId and non-normalized stored reason", () => {
    assert.equal(normalizeMonitoringPeriodReviewDecisionReason("", "理由").status, "INVALID");
    assert.equal(
      validateMonitoringPeriodReviewDecisionReason({ OutcomeId: OUTCOME_ID, reason: " 理由 " }),
      false,
    );
  });
});
