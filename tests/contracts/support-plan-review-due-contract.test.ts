import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateReviewDueRelativeToAsOf, toAsiaTokyoCalendarDay } from "../../src/domain";

describe("Review due relative to asOf contract (Issue #24)", () => {
  it("asOf の東京暦日が due より前 → BEFORE_DUE", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-10T00:00:00.000Z"),
      "BEFORE_DUE",
    );
  });

  it("asOf の東京暦日が due と同日 → DUE", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-20T12:00:00.000Z"),
      "DUE",
    );
  });

  it("asOf の東京暦日が due より後 → OVERDUE", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-06-21T00:00:00.000Z"),
      "OVERDUE",
    );
  });

  it("reviewDueDate / asOf のいずれか不正 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf("not-a-date", "2026-06-20T00:00:00.000Z"),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", "2026-13-40T00:00:00.000Z"),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", 42),
      "MALFORMED_INPUT",
    );
  });

  it("reviewDueDate / asOf が undefined / null / 空 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateReviewDueRelativeToAsOf(undefined, "2026-06-20T00:00:00.000Z"),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-20T00:00:00.000Z", null),
      "MALFORMED_INPUT",
    );
    assert.equal(evaluateReviewDueRelativeToAsOf("", ""), "MALFORMED_INPUT");
  });

  it("UTC瞬間が前日でも Asia/Tokyo 暦日へ変換する（due / asOf 双方）", () => {
    // 2026-06-19T16:00:00.000Z == 2026-06-20T01:00:00+09:00
    assert.equal(toAsiaTokyoCalendarDay("2026-06-19T16:00:00.000Z"), "2026-06-20");
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-19T16:00:00.000Z", "2026-06-19T16:30:00.000Z"),
      "DUE",
    );
    assert.equal(
      evaluateReviewDueRelativeToAsOf("2026-06-19T16:00:00.000Z", "2026-06-19T14:00:00.000Z"),
      "BEFORE_DUE",
    );
  });

  it("不正入力を BEFORE_DUE / DUE / OVERDUE へ倒さない", () => {
    assert.equal(evaluateReviewDueRelativeToAsOf({}, {}), "MALFORMED_INPUT");
  });
});
