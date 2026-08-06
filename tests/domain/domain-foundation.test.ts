import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  aggregateCriterionResults,
  classifyBehaviorScore,
  deriveEvaluationDecision,
  parseBehaviorRelatedScore,
} from "../../src/domain";
import type {
  BehaviorScoreInput,
  CriterionResult,
} from "../../src/domain";
import {
  SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
  SYNTHETIC_CRITERIA_FAIL,
  SYNTHETIC_CRITERIA_PASS,
  SYNTHETIC_CRITERIA_UNKNOWN,
  SYNTHETIC_FINDINGS_ONE,
  SYNTHETIC_VALID_EVALUATION_INPUT,
} from "./fixtures";

// NOT_APPLICABLE belongs to CriterionResult, not to the score input state.
// @ts-expect-error The score contract intentionally excludes NOT_APPLICABLE.
const forbiddenNotApplicableScoreInput: BehaviorScoreInput = { status: "NOT_APPLICABLE", reasonCode: "synthetic-not-applicable" };
void forbiddenNotApplicableScoreInput;

describe("Behavior Score Parsing & Validation", () => {
  it("accepts valid integer scores in range 0..24", () => {
    for (const score of [0, 9, 10, 17, 18, 24]) {
      const result = parseBehaviorRelatedScore(score);
      assert.equal(result.success, true);
      if (result.success) assert.equal(result.score, score);
    }
  });

  it("rejects non-integer, out-of-range, and non-number types", () => {
    assert.deepEqual(parseBehaviorRelatedScore(-1), {
      success: false,
      reason: "OUT_OF_RANGE",
    });
    assert.deepEqual(parseBehaviorRelatedScore(25), {
      success: false,
      reason: "OUT_OF_RANGE",
    });
    assert.deepEqual(parseBehaviorRelatedScore(10.5), {
      success: false,
      reason: "NOT_INTEGER",
    });
    assert.deepEqual(parseBehaviorRelatedScore(NaN), {
      success: false,
      reason: "NOT_FINITE",
    });
    assert.deepEqual(parseBehaviorRelatedScore(Infinity), {
      success: false,
      reason: "NOT_FINITE",
    });
    assert.deepEqual(parseBehaviorRelatedScore("10"), {
      success: false,
      reason: "TYPE",
    });
    assert.deepEqual(parseBehaviorRelatedScore(null), {
      success: false,
      reason: "TYPE",
    });
    assert.deepEqual(parseBehaviorRelatedScore(undefined), {
      success: false,
      reason: "TYPE",
    });
  });
});

describe("Behavior Score Classification", () => {
  it("classifies valid scores into point bands while preserving zero", () => {
    const cases: readonly [BehaviorScoreInput, unknown][] = [
      [{ status: "VALUE", value: 0 }, { decision: "BELOW_BASE_THRESHOLD", score: 0 }],
      [{ status: "VALUE", value: 9 }, { decision: "BELOW_BASE_THRESHOLD", score: 9 }],
      [{ status: "VALUE", value: 10 }, { decision: "BASE_SUPPORT_TARGET", score: 10 }],
      [{ status: "VALUE", value: 17 }, { decision: "BASE_SUPPORT_TARGET", score: 17 }],
      [{ status: "VALUE", value: 18 }, { decision: "HIGH_INTENSITY_TARGET", score: 18 }],
      [{ status: "VALUE", value: 24 }, { decision: "HIGH_INTENSITY_TARGET", score: 24 }],
    ];

    for (const [input, expected] of cases) {
      assert.deepEqual(classifyBehaviorScore(input), expected);
    }
  });

  it("fails closed for empty, invalid, unknown, and fetch-failed score inputs", () => {
    assert.deepEqual(classifyBehaviorScore({ status: "EMPTY" }), {
      decision: "REJECTED_INCOMPLETE_INPUT",
    });
    assert.deepEqual(
      classifyBehaviorScore({ status: "INVALID", reason: "OUT_OF_RANGE" }),
      { decision: "REJECTED_INVALID_INPUT", reason: "OUT_OF_RANGE" },
    );
    assert.deepEqual(
      classifyBehaviorScore({
        status: "UNKNOWN",
        reasonCode: "synthetic-reason-code-001",
      }),
      {
        decision: "INDETERMINATE",
        reasonCode: "synthetic-reason-code-001",
      },
    );
    assert.deepEqual(
      classifyBehaviorScore({
        status: "FETCH_FAILED",
        code: "ERR_SYNTHETIC_FETCH",
      }),
      {
        decision: "REJECTED_SOURCE_UNAVAILABLE",
        code: "ERR_SYNTHETIC_FETCH",
      },
    );
  });
});

describe("Criteria Aggregation", () => {
  it("keeps NOT_APPLICABLE at the rule-criterion layer", () => {
    const criterion: CriterionResult = {
      criterionId: "synthetic-criterion-not-applicable",
      status: "NOT_APPLICABLE",
    };
    assert.equal(criterion.status, "NOT_APPLICABLE");
  });

  it("aggregates PASS, FAIL, UNKNOWN, and NOT_APPLICABLE with strict precedence", () => {
    assert.equal(aggregateCriterionResults(SYNTHETIC_CRITERIA_PASS), "ELIGIBLE");
    assert.equal(
      aggregateCriterionResults([
        { criterionId: "synthetic-01", status: "PASS" },
        { criterionId: "synthetic-02", status: "NOT_APPLICABLE" },
      ]),
      "ELIGIBLE",
    );
    assert.equal(aggregateCriterionResults(SYNTHETIC_CRITERIA_FAIL), "INELIGIBLE");
    assert.equal(
      aggregateCriterionResults([
        { criterionId: "synthetic-01", status: "FAIL" },
        { criterionId: "synthetic-02", status: "UNKNOWN" },
      ]),
      "INELIGIBLE",
    );
    assert.equal(
      aggregateCriterionResults(SYNTHETIC_CRITERIA_UNKNOWN),
      "INDETERMINATE",
    );
    assert.equal(
      aggregateCriterionResults(SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE),
      "NOT_APPLICABLE",
    );
    assert.equal(aggregateCriterionResults([]), "INDETERMINATE");
    assert.equal(
      aggregateCriterionResults([{ criterionId: "", status: "PASS" }]),
      "INDETERMINATE",
    );
    assert.equal(
      aggregateCriterionResults([{ criterionId: "   ", status: "PASS" }]),
      "INDETERMINATE",
    );
  });
});

describe("Evaluation Decision & Finding Separation", () => {
  it("returns NO_FINDINGS only when completed with no findings or missing states", () => {
    assert.equal(
      deriveEvaluationDecision(SYNTHETIC_VALID_EVALUATION_INPUT),
      "NO_FINDINGS",
    );
  });

  it("returns INDETERMINATE when execution is incomplete", () => {
    for (const executionStatus of [
      "NOT_RUN",
      "RUNNING",
      "COMPLETED_WITH_MISSING_DATA",
      "PENDING_CONFIRMATION",
    ] as const) {
      assert.equal(
        deriveEvaluationDecision({
          ...SYNTHETIC_VALID_EVALUATION_INPUT,
          executionStatus,
        }),
        "INDETERMINATE",
      );
    }
  });

  it("returns SOURCE_UNAVAILABLE for failed execution or system errors", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        executionStatus: "FAILED",
      }),
      "SOURCE_UNAVAILABLE",
    );
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        systemErrorCount: 1,
      }),
      "SOURCE_UNAVAILABLE",
    );
  });

  it("returns FINDINGS_PRESENT when findings exist or a criterion fails", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        findings: SYNTHETIC_FINDINGS_ONE,
      }),
      "FINDINGS_PRESENT",
    );
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_FAIL,
      }),
      "FINDINGS_PRESENT",
    );
  });

  it("does not create eligible or ineligible findings for unknown criteria", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_UNKNOWN,
      }),
      "INDETERMINATE",
    );
  });

  it("returns INDETERMINATE when required approval is absent", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        approved: false,
      }),
      "INDETERMINATE",
    );
  });

  it("returns NOT_APPLICABLE when all rule criteria are NOT_APPLICABLE", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
      }),
      "NOT_APPLICABLE",
    );
  });

  it("does not return NO_FINDINGS when a criterion id is empty", () => {
    for (const criterionId of ["", "   "]) {
      assert.equal(
        deriveEvaluationDecision({
          ...SYNTHETIC_VALID_EVALUATION_INPUT,
          criteria: [{ criterionId, status: "PASS" }],
        }),
        "INDETERMINATE",
      );
    }
  });

  it("returns INDETERMINATE for invalid count inputs", () => {
    const invalidInputs = [
      { missingDataCount: -1 },
      { pendingConfirmationCount: 0.5 },
      { expiredEvidenceCount: NaN },
      { systemErrorCount: Infinity },
    ];

    for (const invalidInput of invalidInputs) {
      assert.equal(
        deriveEvaluationDecision({
          ...SYNTHETIC_VALID_EVALUATION_INPUT,
          ...invalidInput,
        }),
        "INDETERMINATE",
      );
    }
  });

  it("returns INDETERMINATE for an unknown criterion status", () => {
    const invalidCriteria = [
      { criterionId: "synthetic-invalid-status", status: "BROKEN" },
    ] as unknown as readonly CriterionResult[];
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: invalidCriteria,
      }),
      "INDETERMINATE",
    );
  });

  it("returns INDETERMINATE when all criteria are NOT_APPLICABLE but findings exist", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
        findings: SYNTHETIC_FINDINGS_ONE,
      }),
      "INDETERMINATE",
    );
  });
});
