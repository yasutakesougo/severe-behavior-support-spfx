import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateObservationPeriodMembership,
  toAsiaTokyoCalendarDay,
} from "../../src/domain";

describe("Observation period membership contract (Issue #24)", () => {
  it("同一東京暦日内（from=to=asOf）→ IN_PERIOD", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-01T00:00:00.000Z",
        "2026-04-01T00:00:00.000Z",
        "2026-04-01T12:00:00.000Z",
      ),
      "IN_PERIOD",
    );
  });

  it("asOf が from より前の東京暦日 → OUTSIDE_PERIOD", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-10T00:00:00.000Z",
        "2026-04-20T00:00:00.000Z",
        "2026-04-09T00:00:00.000Z",
      ),
      "OUTSIDE_PERIOD",
    );
  });

  it("asOf が to より後の東京暦日 → OUTSIDE_PERIOD", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-10T00:00:00.000Z",
        "2026-04-20T00:00:00.000Z",
        "2026-04-21T00:00:00.000Z",
      ),
      "OUTSIDE_PERIOD",
    );
  });

  it("asOf が from/to の間 → IN_PERIOD", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-10T00:00:00.000Z",
        "2026-04-20T00:00:00.000Z",
        "2026-04-15T00:00:00.000Z",
      ),
      "IN_PERIOD",
    );
  });

  it("periodFrom / periodTo / asOf のいずれか不正 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "not-a-date",
        "2026-04-20T00:00:00.000Z",
        "2026-04-15T00:00:00.000Z",
      ),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-10T00:00:00.000Z",
        "2026-13-40T00:00:00.000Z",
        "2026-04-15T00:00:00.000Z",
      ),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-10T00:00:00.000Z",
        "2026-04-20T00:00:00.000Z",
        null,
      ),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateObservationPeriodMembership(
        undefined,
        "2026-04-20T00:00:00.000Z",
        "2026-04-15T00:00:00.000Z",
      ),
      "MALFORMED_INPUT",
    );
  });

  it("fromDay > toDay → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-20T00:00:00.000Z",
        "2026-04-10T00:00:00.000Z",
        "2026-04-15T00:00:00.000Z",
      ),
      "MALFORMED_INPUT",
    );
  });

  it("UTC瞬間が前日でも Asia/Tokyo 暦日へ変換する", () => {
    // 2026-04-09T16:00:00.000Z == 2026-04-10T01:00:00+09:00
    assert.equal(
      toAsiaTokyoCalendarDay("2026-04-09T16:00:00.000Z"),
      "2026-04-10",
    );
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-04-09T16:00:00.000Z",
        "2026-04-20T00:00:00.000Z",
        "2026-04-09T16:30:00.000Z",
      ),
      "IN_PERIOD",
    );
  });

  it("閉区間端点: asOfDay === fromDay / toDay → IN_PERIOD", () => {
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-05-01T00:00:00.000Z",
        "2026-05-31T00:00:00.000Z",
        "2026-05-01T23:00:00.000Z",
      ),
      "IN_PERIOD",
    );
    assert.equal(
      evaluateObservationPeriodMembership(
        "2026-05-01T00:00:00.000Z",
        "2026-05-31T00:00:00.000Z",
        "2026-05-31T01:00:00.000Z",
      ),
      "IN_PERIOD",
    );
  });

  it("不正入力を IN_PERIOD / OUTSIDE_PERIOD へ倒さない", () => {
    assert.equal(
      evaluateObservationPeriodMembership("", "", ""),
      "MALFORMED_INPUT",
    );
    assert.equal(
      evaluateObservationPeriodMembership(42, 42, 42),
      "MALFORMED_INPUT",
    );
  });
});
