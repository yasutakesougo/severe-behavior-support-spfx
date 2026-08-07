import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  selectAssessmentScoreSource,
  validateAssessmentScoreSourceRecord,
} from "../../src/domain/assessment-source";
import type { AssessmentScoreSourceRecord } from "../../src/domain/types";
import {
  SYNTHETIC_SCORE_SOURCE_EXPIRED,
  SYNTHETIC_SCORE_SOURCE_INVALID_RANGE,
  SYNTHETIC_SCORE_SOURCE_UNCONFIRMED,
  SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18,
  SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO,
} from "./fixtures";

describe("Assessment Score Source Record Validation", () => {
  it("validates a correct record with score 0 as valid", () => {
    const res = validateAssessmentScoreSourceRecord(SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO);
    assert.equal(res.valid, true);
    if (res.valid) {
      assert.equal(res.score, 0);
      assert.equal(res.isConfirmed, true);
    }
  });

  it("detects unconfirmed records when confirmedAt or confirmedBy is missing", () => {
    const res = validateAssessmentScoreSourceRecord(SYNTHETIC_SCORE_SOURCE_UNCONFIRMED);
    assert.equal(res.valid, true);
    if (res.valid) {
      assert.equal(res.isConfirmed, false);
    }
  });

  it("rejects invalid date range where validFrom > validTo", () => {
    const res = validateAssessmentScoreSourceRecord(SYNTHETIC_SCORE_SOURCE_INVALID_RANGE);
    assert.equal(res.valid, false);
    if (!res.valid) {
      assert.equal(res.reason, "VALID_FROM_AFTER_VALID_TO");
    }
  });

  it("rejects missing or malformed validFrom / validTo dates", () => {
    const missingValidFrom = { ...SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18, validFrom: "" };
    assert.equal(validateAssessmentScoreSourceRecord(missingValidFrom).valid, false);

    const invalidDate = { ...SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18, validTo: "2026-02-31" };
    assert.equal(validateAssessmentScoreSourceRecord(invalidDate).valid, false);
  });
});

describe("Assessment Score Source Selection Pure Function", () => {
  it("selects a valid source and preserves score 0", () => {
    const decision = selectAssessmentScoreSource(
      [SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO],
      "2026-06-01",
    );
    assert.deepEqual(decision, {
      decision: "VALID",
      source: SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO,
      score: 0,
    });
  });

  it("returns CONFLICT when multiple valid sources exist on assessment date", () => {
    const secondSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-002b",
      score: 10,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      confirmedAt: "2026-01-02T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };

    const decision = selectAssessmentScoreSource(
      [SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18, secondSource],
      "2026-06-01",
    );
    assert.equal(decision.decision, "CONFLICT");
    if (decision.decision === "CONFLICT") {
      assert.equal(decision.sources.length, 2);
    }
  });

  it("returns UNCONFIRMED and does NOT collapse to VALID", () => {
    const decision = selectAssessmentScoreSource(
      [SYNTHETIC_SCORE_SOURCE_UNCONFIRMED],
      "2026-06-01",
    );
    assert.deepEqual(decision, {
      decision: "UNCONFIRMED",
      sources: [SYNTHETIC_SCORE_SOURCE_UNCONFIRMED],
    });
  });

  it("returns EXPIRED and does NOT collapse to MISSING", () => {
    const decision = selectAssessmentScoreSource([SYNTHETIC_SCORE_SOURCE_EXPIRED], "2026-06-01");
    assert.deepEqual(decision, {
      decision: "EXPIRED",
      sources: [SYNTHETIC_SCORE_SOURCE_EXPIRED],
    });
  });

  it("returns FETCH_FAILED and does NOT convert to MISSING, UNKNOWN, or 0", () => {
    const decision = selectAssessmentScoreSource(
      { status: "FETCH_FAILED", code: "ERR_SYNTHETIC_FETCH_FAILED" },
      "2026-06-01",
    );
    assert.deepEqual(decision, {
      decision: "FETCH_FAILED",
      code: "ERR_SYNTHETIC_FETCH_FAILED",
    });
  });

  it("uses updated score starting from its new validFrom date", () => {
    const oldSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-v1",
      score: 10,
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      confirmedAt: "2025-01-02T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };
    const newSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-v2",
      score: 18,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      confirmedAt: "2026-01-02T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };

    const beforeUpdate = selectAssessmentScoreSource([oldSource, newSource], "2025-06-01");
    assert.equal(beforeUpdate.decision, "VALID");
    if (beforeUpdate.decision === "VALID") {
      assert.equal(beforeUpdate.score, 10);
    }

    const afterUpdate = selectAssessmentScoreSource([oldSource, newSource], "2026-06-01");
    assert.equal(afterUpdate.decision, "VALID");
    if (afterUpdate.decision === "VALID") {
      assert.equal(afterUpdate.score, 18);
    }
  });

  it("does not hardcode 3-year validity", () => {
    const shortTermSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-short",
      score: 15,
      validFrom: "2026-01-01",
      validTo: "2026-03-31",
      confirmedAt: "2026-01-02T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };

    const activeDecision = selectAssessmentScoreSource([shortTermSource], "2026-02-01");
    assert.equal(activeDecision.decision, "VALID");

    const expiredDecision = selectAssessmentScoreSource([shortTermSource], "2026-04-01");
    assert.equal(expiredDecision.decision, "EXPIRED");
  });

  it("fails closed on malformed input or invalid assessment date", () => {
    assert.equal(
      selectAssessmentScoreSource([SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18], "invalid-date").decision,
      "MALFORMED",
    );
    assert.equal(
      selectAssessmentScoreSource([SYNTHETIC_SCORE_SOURCE_INVALID_RANGE], "2026-06-01").decision,
      "MALFORMED",
    );
  });

  it("includes validFrom and validTo in the validity period", () => {
    const source: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-boundary",
      score: 18,
      validFrom: "2026-04-01",
      validTo: "2026-06-30",
      confirmedAt: "2026-04-01T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };

    const beforeValidFrom = selectAssessmentScoreSource([source], "2026-03-31");
    assert.notEqual(beforeValidFrom.decision, "VALID");

    const onValidFrom = selectAssessmentScoreSource([source], "2026-04-01");
    assert.equal(onValidFrom.decision, "VALID");

    const onValidTo = selectAssessmentScoreSource([source], "2026-06-30");
    assert.equal(onValidTo.decision, "VALID");

    const afterValidTo = selectAssessmentScoreSource([source], "2026-07-01");
    assert.equal(afterValidTo.decision, "EXPIRED");
  });

  it("returns CONFLICT when overlapping valid sources have the same score", () => {
    const firstSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-same-score-1",
      score: 18,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      confirmedAt: "2026-01-02T10:00:00Z",
      confirmedBy: "synthetic-user-001",
    };

    const secondSource: AssessmentScoreSourceRecord = {
      sourceReferenceId: "synthetic-source-ref-same-score-2",
      score: 18,
      validFrom: "2026-04-01",
      validTo: "2026-09-30",
      confirmedAt: "2026-04-02T10:00:00Z",
      confirmedBy: "synthetic-user-002",
    };

    const decision = selectAssessmentScoreSource([firstSource, secondSource], "2026-06-01");

    assert.equal(decision.decision, "CONFLICT");
    if (decision.decision === "CONFLICT") {
      assert.equal(decision.sources.length, 2);
    }
  });
});
