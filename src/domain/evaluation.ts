import type {
  CriterionStatus,
  EvaluationDecision,
  EvaluationInput,
} from "./types";

function isValidNonNegativeInteger(value: number): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function isCriterionStatus(value: unknown): value is CriterionStatus {
  return (
    value === "PASS" ||
    value === "FAIL" ||
    value === "UNKNOWN" ||
    value === "NOT_APPLICABLE"
  );
}

export function deriveEvaluationDecision(
  input: EvaluationInput,
): EvaluationDecision {
  if (
    !isValidNonNegativeInteger(input.missingDataCount) ||
    !isValidNonNegativeInteger(input.pendingConfirmationCount) ||
    !isValidNonNegativeInteger(input.expiredEvidenceCount) ||
    !isValidNonNegativeInteger(input.systemErrorCount)
  ) {
    return "INDETERMINATE";
  }

  if (
    input.executionStatus === "FAILED" ||
    input.systemErrorCount >= 1
  ) {
    return "SOURCE_UNAVAILABLE";
  }

  if (
    input.executionStatus === "NOT_RUN" ||
    input.executionStatus === "RUNNING" ||
    input.executionStatus === "COMPLETED_WITH_MISSING_DATA" ||
    input.executionStatus === "PENDING_CONFIRMATION"
  ) {
    return "INDETERMINATE";
  }

  if (
    input.missingDataCount >= 1 ||
    input.pendingConfirmationCount >= 1 ||
    input.expiredEvidenceCount >= 1
  ) {
    return "INDETERMINATE";
  }

  if (input.criteria.length === 0) {
    return "INDETERMINATE";
  }

  if (
    input.criteria.some(
      (criterion) =>
        typeof criterion.criterionId !== "string" ||
        criterion.criterionId.trim().length === 0 ||
        !isCriterionStatus(criterion.status),
    )
  ) {
    return "INDETERMINATE";
  }

  let hasFail = false;
  let hasUnknown = false;
  let allNotApplicable = true;

  for (const criterion of input.criteria) {
    if (criterion.status === "FAIL") {
      hasFail = true;
    }
    if (criterion.status === "UNKNOWN") {
      hasUnknown = true;
    }
    if (criterion.status !== "NOT_APPLICABLE") {
      allNotApplicable = false;
    }
  }

  if (allNotApplicable && input.findings.length >= 1) {
    return "INDETERMINATE";
  }

  if (allNotApplicable) {
    return "NOT_APPLICABLE";
  }

  if (input.findings.length >= 1 || hasFail) {
    return "FINDINGS_PRESENT";
  }

  if (hasUnknown) {
    return "INDETERMINATE";
  }

  if (input.approvalRequired && !input.approved) {
    return "INDETERMINATE";
  }

  if (
    input.executionStatus === "COMPLETED" &&
    input.findings.length === 0 &&
    input.missingDataCount === 0 &&
    input.pendingConfirmationCount === 0 &&
    input.expiredEvidenceCount === 0 &&
    input.systemErrorCount === 0 &&
    (!input.approvalRequired || input.approved)
  ) {
    return "NO_FINDINGS";
  }

  return "INDETERMINATE";
}
