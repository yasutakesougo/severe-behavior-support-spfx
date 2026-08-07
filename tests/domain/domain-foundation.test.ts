import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  aggregateCriterionResults,
  classifyBehaviorScore,
  deriveEvaluationDecision,
  parseBehaviorRelatedScore,
} from "../../src/domain";
import type { BehaviorScoreInput, CriterionResult, EvaluationInput } from "../../src/domain";
import {
  SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
  SYNTHETIC_CRITERIA_FAIL,
  SYNTHETIC_CRITERIA_PASS,
  SYNTHETIC_CRITERIA_UNKNOWN,
  SYNTHETIC_FINDINGS_ONE,
  SYNTHETIC_VALID_EVALUATION_INPUT,
} from "./fixtures";

// prettier-ignore
// @ts-expect-error NOT_APPLICABLE belongs to CriterionResult, not BehaviorScoreInput.
const forbiddenNotApplicableScoreInput: BehaviorScoreInput = { status: "NOT_APPLICABLE", reasonCode: "synthetic-not-applicable" };
// prettier-ignore
// @ts-expect-error NOT_APPLICABLE requires a non-empty reasonCode contract.
const forbiddenReasonlessCriterion: CriterionResult = { criterionId: "synthetic-reasonless", status: "NOT_APPLICABLE" };
void forbiddenNotApplicableScoreInput;
void forbiddenReasonlessCriterion;

describe("Behavior Score Parsing & Classification", () => {
  it("accepts valid integer scores in range 0..24", () => {
    for (const score of [0, 9, 10, 17, 18, 24]) {
      const result = parseBehaviorRelatedScore(score);
      assert.equal(result.success, true);
      if (result.success) assert.equal(result.score, score);
    }
  });

  it("rejects invalid score values", () => {
    const cases: readonly [unknown, string][] = [
      [-1, "OUT_OF_RANGE"],
      [25, "OUT_OF_RANGE"],
      [10.5, "NOT_INTEGER"],
      [NaN, "NOT_FINITE"],
      [Infinity, "NOT_FINITE"],
      ["10", "TYPE"],
      [null, "TYPE"],
      [undefined, "TYPE"],
    ];

    for (const [value, reason] of cases) {
      assert.deepEqual(parseBehaviorRelatedScore(value), {
        success: false,
        reason,
      });
    }
  });

  it("classifies valid values into point bands while preserving zero", () => {
    const cases: readonly [BehaviorScoreInput, unknown][] = [
      [
        { status: "VALUE", value: 0 },
        { decision: "BELOW_BASE_THRESHOLD", score: 0 },
      ],
      [
        { status: "VALUE", value: 9 },
        { decision: "BELOW_BASE_THRESHOLD", score: 9 },
      ],
      [
        { status: "VALUE", value: 10 },
        { decision: "BASE_SUPPORT_TARGET", score: 10 },
      ],
      [
        { status: "VALUE", value: 17 },
        { decision: "BASE_SUPPORT_TARGET", score: 17 },
      ],
      [
        { status: "VALUE", value: 18 },
        { decision: "HIGH_INTENSITY_TARGET", score: 18 },
      ],
      [
        { status: "VALUE", value: 24 },
        { decision: "HIGH_INTENSITY_TARGET", score: 24 },
      ],
    ];

    for (const [input, expected] of cases) {
      assert.deepEqual(classifyBehaviorScore(input), expected);
    }
  });

  it("fails closed for empty, invalid, unknown, and fetch-failed score states", () => {
    assert.deepEqual(classifyBehaviorScore({ status: "EMPTY" }), {
      decision: "REJECTED_INCOMPLETE_INPUT",
    });
    assert.deepEqual(classifyBehaviorScore({ status: "INVALID", reason: "OUT_OF_RANGE" }), {
      decision: "REJECTED_INVALID_INPUT",
      reason: "OUT_OF_RANGE",
    });
    assert.deepEqual(
      classifyBehaviorScore({ status: "UNKNOWN", reasonCode: "synthetic-unknown" }),
      { decision: "INDETERMINATE", reasonCode: "synthetic-unknown" },
    );
    assert.deepEqual(
      classifyBehaviorScore({ status: "FETCH_FAILED", code: "ERR_SYNTHETIC_FETCH" }),
      { decision: "REJECTED_SOURCE_UNAVAILABLE", code: "ERR_SYNTHETIC_FETCH" },
    );
  });
});

describe("Criterion Aggregation", () => {
  it("keeps NOT_APPLICABLE at the criterion layer with a reason", () => {
    const criterion: CriterionResult = {
      criterionId: "synthetic-criterion-not-applicable",
      status: "NOT_APPLICABLE",
      reasonCode: "synthetic-not-applicable-reason",
    };
    assert.equal(criterion.status, "NOT_APPLICABLE");
  });

  it("aggregates valid criterion combinations", () => {
    assert.equal(aggregateCriterionResults(SYNTHETIC_CRITERIA_PASS), "ELIGIBLE");
    assert.equal(
      aggregateCriterionResults([
        { criterionId: "synthetic-pass", status: "PASS" },
        {
          criterionId: "synthetic-na",
          status: "NOT_APPLICABLE",
          reasonCode: "synthetic-na-reason",
        },
      ]),
      "ELIGIBLE",
    );
    assert.equal(aggregateCriterionResults(SYNTHETIC_CRITERIA_FAIL), "INELIGIBLE");
    assert.equal(
      aggregateCriterionResults([
        { criterionId: "synthetic-fail", status: "FAIL" },
        {
          criterionId: "synthetic-unknown",
          status: "UNKNOWN",
          reasonCode: "synthetic-unknown-reason",
        },
      ]),
      "INELIGIBLE",
    );
    assert.equal(aggregateCriterionResults(SYNTHETIC_CRITERIA_UNKNOWN), "INDETERMINATE");
    assert.equal(
      aggregateCriterionResults(SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE),
      "NOT_APPLICABLE",
    );
  });

  it("fails closed for empty or malformed criteria", () => {
    const malformedCases = [
      [],
      [{ criterionId: "", status: "PASS" }],
      [{ criterionId: "synthetic-unknown", status: "UNKNOWN" }],
      [{ criterionId: "synthetic-na", status: "NOT_APPLICABLE", reasonCode: "" }],
      [{ criterionId: "synthetic-fail", status: "FAIL" }, null],
      null,
    ] as unknown as readonly (readonly CriterionResult[])[];

    for (const criteria of malformedCases) {
      assert.equal(aggregateCriterionResults(criteria), "INDETERMINATE");
    }
  });
});

describe("Evaluation Decision & Finding Separation", () => {
  it("returns NO_FINDINGS only for a complete and approved clean evaluation", () => {
    assert.equal(deriveEvaluationDecision(SYNTHETIC_VALID_EVALUATION_INPUT), "NO_FINDINGS");
  });

  it("returns INDETERMINATE for incomplete execution states", () => {
    for (const executionStatus of [
      "NOT_RUN",
      "RUNNING",
      "COMPLETED_WITH_MISSING_DATA",
      "PENDING_CONFIRMATION",
    ] as const) {
      assert.equal(
        deriveEvaluationDecision({ ...SYNTHETIC_VALID_EVALUATION_INPUT, executionStatus }),
        "INDETERMINATE",
      );
    }
  });

  it("returns SOURCE_UNAVAILABLE for failed execution or system errors", () => {
    assert.equal(
      deriveEvaluationDecision({ ...SYNTHETIC_VALID_EVALUATION_INPUT, executionStatus: "FAILED" }),
      "SOURCE_UNAVAILABLE",
    );
    assert.equal(
      deriveEvaluationDecision({ ...SYNTHETIC_VALID_EVALUATION_INPUT, systemErrorCount: 1 }),
      "SOURCE_UNAVAILABLE",
    );
  });

  it("returns FINDINGS_PRESENT for findings or failed criteria", () => {
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

  it("does not create definitive findings for unknown or unapproved evaluations", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_UNKNOWN,
      }),
      "INDETERMINATE",
    );
    assert.equal(
      deriveEvaluationDecision({ ...SYNTHETIC_VALID_EVALUATION_INPUT, approved: false }),
      "INDETERMINATE",
    );
  });

  it("returns NOT_APPLICABLE only when all rule criteria are not applicable", () => {
    assert.equal(
      deriveEvaluationDecision({
        ...SYNTHETIC_VALID_EVALUATION_INPUT,
        criteria: SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
      }),
      "NOT_APPLICABLE",
    );
  });

  it("fails closed for invalid criterion ids, statuses, or reason codes", () => {
    const invalidCriteria = [
      [{ criterionId: "", status: "PASS" }],
      [{ criterionId: "synthetic-invalid", status: "BROKEN" }],
      [{ criterionId: "synthetic-unknown", status: "UNKNOWN" }],
      [{ criterionId: "synthetic-na", status: "NOT_APPLICABLE", reasonCode: "" }],
    ] as unknown as readonly (readonly CriterionResult[])[];

    for (const criteria of invalidCriteria) {
      assert.equal(
        deriveEvaluationDecision({ ...SYNTHETIC_VALID_EVALUATION_INPUT, criteria }),
        "INDETERMINATE",
      );
    }
  });

  it("fails closed for invalid counts and malformed evaluation structures", () => {
    const invalidInputs = [
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, missingDataCount: -1 },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, pendingConfirmationCount: 0.5 },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, expiredEvidenceCount: NaN },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, systemErrorCount: Infinity },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, criteria: [null] },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, findings: null },
      { ...SYNTHETIC_VALID_EVALUATION_INPUT, approvalRequired: "yes" },
      null,
    ] as unknown as readonly EvaluationInput[];

    for (const input of invalidInputs) {
      assert.equal(deriveEvaluationDecision(input), "INDETERMINATE");
    }
  });

  it("returns INDETERMINATE for contradictory all-not-applicable findings", () => {
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
