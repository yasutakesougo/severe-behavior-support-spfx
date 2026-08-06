import type {
  BehaviorRelatedScore,
  BehaviorScoreDecision,
  BehaviorScoreInput,
  BehaviorScoreInvalidReason,
} from "./types";

export type BehaviorScoreValidationResult =
  | Readonly<{
      success: true;
      score: BehaviorRelatedScore;
    }>
  | Readonly<{
      success: false;
      reason: BehaviorScoreInvalidReason;
    }>;

export function parseBehaviorRelatedScore(
  value: unknown,
): BehaviorScoreValidationResult {
  if (typeof value !== "number") {
    return { success: false, reason: "TYPE" };
  }
  if (!Number.isFinite(value)) {
    return { success: false, reason: "NOT_FINITE" };
  }
  if (!Number.isInteger(value)) {
    return { success: false, reason: "NOT_INTEGER" };
  }
  if (value < 0 || value > 24) {
    return { success: false, reason: "OUT_OF_RANGE" };
  }

  return {
    success: true,
    score: value as BehaviorRelatedScore,
  };
}

export function classifyBehaviorScore(
  input: BehaviorScoreInput,
): BehaviorScoreDecision {
  switch (input.status) {
    case "VALUE": {
      const validation = parseBehaviorRelatedScore(input.value);
      if (!validation.success) {
        return {
          decision: "REJECTED_INVALID_INPUT",
          reason: validation.reason,
        };
      }

      const score = validation.score;
      if (score >= 18) {
        return { decision: "HIGH_INTENSITY_TARGET", score };
      }
      if (score >= 10) {
        return { decision: "BASE_SUPPORT_TARGET", score };
      }
      return { decision: "BELOW_BASE_THRESHOLD", score };
    }
    case "EMPTY":
      return { decision: "REJECTED_INCOMPLETE_INPUT" };
    case "INVALID":
      return {
        decision: "REJECTED_INVALID_INPUT",
        reason: input.reason,
      };
    case "UNKNOWN":
      return {
        decision: "INDETERMINATE",
        reasonCode: input.reasonCode,
      };
    case "FETCH_FAILED":
      return {
        decision: "REJECTED_SOURCE_UNAVAILABLE",
        code: input.code,
      };
  }

  const unreachable: never = input;
  return unreachable;
}
