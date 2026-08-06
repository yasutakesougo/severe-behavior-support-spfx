import type {
  CriterionAggregateDecision,
  CriterionResult,
} from "./types";

export function aggregateCriterionResults(
  criteria: readonly CriterionResult[],
): CriterionAggregateDecision {
  if (criteria.length === 0) {
    return "INDETERMINATE";
  }

  let hasPass = false;
  let hasUnknown = false;
  let allNotApplicable = true;

  for (const criterion of criteria) {
    if (!criterion.criterionId || criterion.criterionId.trim() === "") {
      return "INDETERMINATE";
    }

    if (criterion.status === "FAIL") {
      return "INELIGIBLE";
    }

    if (criterion.status === "UNKNOWN") {
      hasUnknown = true;
    }

    if (criterion.status === "PASS") {
      hasPass = true;
    }

    if (criterion.status !== "NOT_APPLICABLE") {
      allNotApplicable = false;
    }
  }

  if (hasUnknown) {
    return "INDETERMINATE";
  }

  if (allNotApplicable) {
    return "NOT_APPLICABLE";
  }

  if (hasPass) {
    return "ELIGIBLE";
  }

  return "INDETERMINATE";
}
