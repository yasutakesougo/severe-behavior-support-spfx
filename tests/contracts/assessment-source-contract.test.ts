import assert from "node:assert/strict";
import { test } from "node:test";

import { selectAssessmentScoreSource, validateAssessmentScoreSourceRecord } from "../../src/domain";
import type { AssessmentSourceLookupResult } from "../../src/domain";
import {
  SYNTHETIC_SCORE_SOURCE_EXPIRED,
  SYNTHETIC_SCORE_SOURCE_UNCONFIRMED,
  SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18,
  SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO,
} from "../domain/fixtures";

test("contract: score 0 is accepted as a valid assessment score", () => {
  const validation = validateAssessmentScoreSourceRecord(SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO);
  assert.equal(validation.valid, true);
  if (validation.valid) {
    assert.equal(validation.score, 0);
  }

  const decision = selectAssessmentScoreSource(
    [SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO],
    "2026-06-01",
  );
  assert.equal(decision.decision, "VALID");
  if (decision.decision === "VALID") {
    assert.equal(decision.score, 0);
  }
});

test("contract: FETCH_FAILED lookup status preserves failure code without collapsing", () => {
  const lookupResult: AssessmentSourceLookupResult = {
    status: "FETCH_FAILED",
    code: "ERR_SYNTHETIC_FETCH_FAILED",
  };

  const decision = selectAssessmentScoreSource(lookupResult, "2026-06-01");
  assert.deepEqual(decision, {
    decision: "FETCH_FAILED",
    code: "ERR_SYNTHETIC_FETCH_FAILED",
  });
});

test("contract: UNCONFIRMED status retains unconfirmed sources without collapsing to VALID", () => {
  const lookupResult: AssessmentSourceLookupResult = {
    status: "FOUND",
    value: [SYNTHETIC_SCORE_SOURCE_UNCONFIRMED],
  };

  const decision = selectAssessmentScoreSource(lookupResult, "2026-06-01");
  assert.equal(decision.decision, "UNCONFIRMED");
  if (decision.decision === "UNCONFIRMED") {
    assert.deepEqual(decision.sources, [SYNTHETIC_SCORE_SOURCE_UNCONFIRMED]);
  }
});

test("contract: EXPIRED status retains expired sources without collapsing to MISSING", () => {
  const lookupResult: AssessmentSourceLookupResult = {
    status: "FOUND",
    value: [SYNTHETIC_SCORE_SOURCE_EXPIRED],
  };

  const decision = selectAssessmentScoreSource(lookupResult, "2026-06-01");
  assert.equal(decision.decision, "EXPIRED");
  if (decision.decision === "EXPIRED") {
    assert.deepEqual(decision.sources, [SYNTHETIC_SCORE_SOURCE_EXPIRED]);
  }
});

test("contract: EMPTY lookup status yields MISSING decision", () => {
  const lookupResult: AssessmentSourceLookupResult = {
    status: "EMPTY",
  };

  const decision = selectAssessmentScoreSource(lookupResult, "2026-06-01");
  assert.deepEqual(decision, { decision: "MISSING" });
});

test("contract: validFrom > validTo is rejected as MALFORMED", () => {
  const invalidRangeSource = {
    ...SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18,
    validFrom: "2026-12-31",
    validTo: "2026-01-01",
  };

  const decision = selectAssessmentScoreSource([invalidRangeSource], "2026-06-01");
  assert.equal(decision.decision, "MALFORMED");
});
