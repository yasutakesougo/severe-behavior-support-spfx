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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBehaviorScoreInvalidReason(value: unknown): value is BehaviorScoreInvalidReason {
  return (
    value === "TYPE" ||
    value === "NOT_FINITE" ||
    value === "NOT_INTEGER" ||
    value === "OUT_OF_RANGE"
  );
}

const malformedState = (): BehaviorScoreDecision => ({
  decision: "REJECTED_INVALID_INPUT",
  reason: "MALFORMED_STATE",
});

export function parseBehaviorRelatedScore(value: unknown): BehaviorScoreValidationResult {
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

export function classifyBehaviorScore(input: BehaviorScoreInput): BehaviorScoreDecision {
  const candidate: unknown = input;
  if (!isRecord(candidate) || typeof candidate.status !== "string") {
    return malformedState();
  }

  switch (candidate.status) {
    case "VALUE": {
      const validation = parseBehaviorRelatedScore(candidate.value);
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
      return isBehaviorScoreInvalidReason(candidate.reason)
        ? {
            decision: "REJECTED_INVALID_INPUT",
            reason: candidate.reason,
          }
        : malformedState();
    case "UNKNOWN":
      return typeof candidate.reasonCode === "string" && candidate.reasonCode.trim().length > 0
        ? {
            decision: "INDETERMINATE",
            reasonCode: candidate.reasonCode,
          }
        : malformedState();
    case "FETCH_FAILED":
      return typeof candidate.code === "string" && candidate.code.trim().length > 0
        ? {
            decision: "REJECTED_SOURCE_UNAVAILABLE",
            code: candidate.code,
          }
        : malformedState();
    default:
      return malformedState();
  }
}
