export type BehaviorRelatedScore = number & {
  readonly __brand: "BehaviorRelatedScore";
};

export type BehaviorScoreInvalidReason =
  | "TYPE"
  | "NOT_FINITE"
  | "NOT_INTEGER"
  | "OUT_OF_RANGE";

export type BehaviorScoreRejectionReason =
  | BehaviorScoreInvalidReason
  | "MALFORMED_STATE";

/**
 * Input state for the official behavior-related score itself.
 *
 * NOT_APPLICABLE is intentionally excluded. Rule applicability belongs to
 * CriterionResult, not to the score value or its retrieval state.
 */
export type BehaviorScoreInput =
  | Readonly<{
      status: "VALUE";
      value: unknown;
    }>
  | Readonly<{
      status: "EMPTY";
    }>
  | Readonly<{
      status: "INVALID";
      reason: BehaviorScoreInvalidReason;
    }>
  | Readonly<{
      status: "UNKNOWN";
      reasonCode: string;
    }>
  | Readonly<{
      status: "FETCH_FAILED";
      code: string;
    }>;

export type BehaviorScoreDecision =
  | Readonly<{
      decision: "BELOW_BASE_THRESHOLD";
      score: BehaviorRelatedScore;
    }>
  | Readonly<{
      decision: "BASE_SUPPORT_TARGET";
      score: BehaviorRelatedScore;
    }>
  | Readonly<{
      decision: "HIGH_INTENSITY_TARGET";
      score: BehaviorRelatedScore;
    }>
  | Readonly<{
      decision: "INDETERMINATE";
      reasonCode: string;
    }>
  | Readonly<{
      decision: "REJECTED_INCOMPLETE_INPUT";
    }>
  | Readonly<{
      decision: "REJECTED_INVALID_INPUT";
      reason: BehaviorScoreRejectionReason;
    }>
  | Readonly<{
      decision: "REJECTED_SOURCE_UNAVAILABLE";
      code: string;
    }>;

export type FacilityType =
  | "STANDALONE_DAY_ACTIVITY"
  | "DISABILITY_SUPPORT_FACILITY"
  | "COEXISTENCE_TYPE"
  | "MULTI_UNIT";

export type CriterionStatus =
  | "PASS"
  | "FAIL"
  | "UNKNOWN"
  | "NOT_APPLICABLE";

export type CriterionResult =
  | Readonly<{
      criterionId: string;
      status: "PASS" | "FAIL";
    }>
  | Readonly<{
      criterionId: string;
      status: "UNKNOWN" | "NOT_APPLICABLE";
      reasonCode: string;
    }>;

export type CriterionAggregateDecision =
  | "ELIGIBLE"
  | "INELIGIBLE"
  | "INDETERMINATE"
  | "NOT_APPLICABLE";

export type EvaluationExecutionStatus =
  | "NOT_RUN"
  | "RUNNING"
  | "COMPLETED"
  | "COMPLETED_WITH_MISSING_DATA"
  | "PENDING_CONFIRMATION"
  | "FAILED";

export type EvaluationDecision =
  | "NO_FINDINGS"
  | "FINDINGS_PRESENT"
  | "INDETERMINATE"
  | "NOT_APPLICABLE"
  | "SOURCE_UNAVAILABLE";

export type Finding = Readonly<{
  findingCode: string;
  criterionId?: string;
}>;

export type EvaluationInput = Readonly<{
  executionStatus: EvaluationExecutionStatus;
  criteria: readonly CriterionResult[];
  findings: readonly Finding[];
  missingDataCount: number;
  pendingConfirmationCount: number;
  expiredEvidenceCount: number;
  systemErrorCount: number;
  approvalRequired: boolean;
  approved: boolean;
}>;
