import type {
  CriterionResult,
  CriterionStatus,
  EvaluationDecision,
  EvaluationExecutionStatus,
  EvaluationInput,
  Finding,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidNonNegativeInteger(value: unknown): value is number {
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

function isCriterionResult(value: unknown): value is CriterionResult {
  return (
    isRecord(value) &&
    typeof value.criterionId === "string" &&
    value.criterionId.trim().length > 0 &&
    isCriterionStatus(value.status)
  );
}

function isFinding(value: unknown): value is Finding {
  return (
    isRecord(value) &&
    typeof value.findingCode === "string" &&
    value.findingCode.trim().length > 0 &&
    (value.criterionId === undefined ||
      (typeof value.criterionId === "string" && value.criterionId.trim().length > 0))
  );
}

function isExecutionStatus(value: unknown): value is EvaluationExecutionStatus {
  return (
    value === "NOT_RUN" ||
    value === "RUNNING" ||
    value === "COMPLETED" ||
    value === "COMPLETED_WITH_MISSING_DATA" ||
    value === "PENDING_CONFIRMATION" ||
    value === "FAILED"
  );
}

export function deriveEvaluationDecision(
  input: EvaluationInput,
): EvaluationDecision {
  const candidate: unknown = input;
  if (!isRecord(candidate)) {
    return "INDETERMINATE";
  }

  if (
    !isExecutionStatus(candidate.executionStatus) ||
    !Array.isArray(candidate.criteria) ||
    !Array.isArray(candidate.findings) ||
    !candidate.criteria.every(isCriterionResult) ||
    !candidate.findings.every(isFinding) ||
    !isValidNonNegativeInteger(candidate.missingDataCount) ||
    !isValidNonNegativeInteger(candidate.pendingConfirmationCount) ||
    !isValidNonNegativeInteger(candidate.expiredEvidenceCount) ||
    !isValidNonNegativeInteger(candidate.systemErrorCount) ||
    typeof candidate.approvalRequired !== "boolean" ||
    typeof candidate.approved !== "boolean"
  ) {
    return "INDETERMINATE";
  }

  const executionStatus = candidate.executionStatus;
  const criteria = candidate.criteria;
  const findings = candidate.findings;
  const missingDataCount = candidate.missingDataCount;
  const pendingConfirmationCount = candidate.pendingConfirmationCount;
  const expiredEvidenceCount = candidate.expiredEvidenceCount;
  const systemErrorCount = candidate.systemErrorCount;
  const approvalRequired = candidate.approvalRequired;
  const approved = candidate.approved;

  if (executionStatus === "FAILED" || systemErrorCount >= 1) {
    return "SOURCE_UNAVAILABLE";
  }

  if (
    executionStatus === "NOT_RUN" ||
    executionStatus === "RUNNING" ||
    executionStatus === "COMPLETED_WITH_MISSING_DATA" ||
    executionStatus === "PENDING_CONFIRMATION"
  ) {
    return "INDETERMINATE";
  }

  if (
    missingDataCount >= 1 ||
    pendingConfirmationCount >= 1 ||
    expiredEvidenceCount >= 1 ||
    criteria.length === 0
  ) {
    return "INDETERMINATE";
  }

  const hasFail = criteria.some((criterion) => criterion.status === "FAIL");
  const hasUnknown = criteria.some((criterion) => criterion.status === "UNKNOWN");
  const allNotApplicable = criteria.every(
    (criterion) => criterion.status === "NOT_APPLICABLE",
  );

  if (allNotApplicable && findings.length >= 1) {
    return "INDETERMINATE";
  }

  if (allNotApplicable) {
    return "NOT_APPLICABLE";
  }

  if (findings.length >= 1 || hasFail) {
    return "FINDINGS_PRESENT";
  }

  if (hasUnknown || (approvalRequired && !approved)) {
    return "INDETERMINATE";
  }

  if (
    executionStatus === "COMPLETED" &&
    findings.length === 0 &&
    missingDataCount === 0 &&
    pendingConfirmationCount === 0 &&
    expiredEvidenceCount === 0 &&
    systemErrorCount === 0 &&
    (!approvalRequired || approved)
  ) {
    return "NO_FINDINGS";
  }

  return "INDETERMINATE";
}
