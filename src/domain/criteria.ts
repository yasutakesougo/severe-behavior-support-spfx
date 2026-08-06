import type {
  CriterionAggregateDecision,
  CriterionResult,
  CriterionStatus,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCriterionStatus(value: unknown): value is CriterionStatus {
  return (
    value === "PASS" ||
    value === "FAIL" ||
    value === "UNKNOWN" ||
    value === "NOT_APPLICABLE"
  );
}

function isCriterionResult(value: unknown): value is CriterionResult {
  return (
    isRecord(value) &&
    typeof value.criterionId === "string" &&
    value.criterionId.trim().length > 0 &&
    isCriterionStatus(value.status)
  );
}

export function aggregateCriterionResults(
  criteria: readonly CriterionResult[],
): CriterionAggregateDecision {
  const candidate: unknown = criteria;
  if (!Array.isArray(candidate) || candidate.length === 0) {
    return "INDETERMINATE";
  }

  if (!candidate.every(isCriterionResult)) {
    return "INDETERMINATE";
  }

  if (candidate.some((criterion) => criterion.status === "FAIL")) {
    return "INELIGIBLE";
  }

  if (candidate.some((criterion) => criterion.status === "UNKNOWN")) {
    return "INDETERMINATE";
  }

  if (candidate.every((criterion) => criterion.status === "NOT_APPLICABLE")) {
    return "NOT_APPLICABLE";
  }

  if (candidate.some((criterion) => criterion.status === "PASS")) {
    return "ELIGIBLE";
  }

  return "INDETERMINATE";
}
