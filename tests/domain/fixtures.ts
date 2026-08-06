import type {
  CriterionResult,
  EvaluationInput,
  Finding,
} from "../../src/domain/types";

export const SYNTHETIC_CRITERIA_PASS: readonly CriterionResult[] = Object.freeze([
  { criterionId: "synthetic-criterion-001", status: "PASS" },
  { criterionId: "synthetic-criterion-002", status: "PASS" },
]);

export const SYNTHETIC_CRITERIA_FAIL: readonly CriterionResult[] = Object.freeze([
  { criterionId: "synthetic-criterion-001", status: "PASS" },
  { criterionId: "synthetic-criterion-002", status: "FAIL" },
]);

export const SYNTHETIC_CRITERIA_UNKNOWN: readonly CriterionResult[] = Object.freeze([
  { criterionId: "synthetic-criterion-001", status: "PASS" },
  { criterionId: "synthetic-criterion-002", status: "UNKNOWN" },
]);

export const SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE: readonly CriterionResult[] = Object.freeze([
  { criterionId: "synthetic-criterion-001", status: "NOT_APPLICABLE" },
  { criterionId: "synthetic-criterion-002", status: "NOT_APPLICABLE" },
]);

export const SYNTHETIC_FINDINGS_ONE: readonly Finding[] = Object.freeze([
  {
    findingCode: "synthetic-finding-code-101",
    criterionId: "synthetic-criterion-002",
  },
]);

export const SYNTHETIC_VALID_EVALUATION_INPUT: EvaluationInput = Object.freeze({
  executionStatus: "COMPLETED",
  criteria: SYNTHETIC_CRITERIA_PASS,
  findings: [],
  missingDataCount: 0,
  pendingConfirmationCount: 0,
  expiredEvidenceCount: 0,
  systemErrorCount: 0,
  approvalRequired: true,
  approved: true,
});
