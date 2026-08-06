import type {
  AssessmentScoreSourceRecord,
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
  {
    criterionId: "synthetic-criterion-002",
    status: "UNKNOWN",
    reasonCode: "synthetic-unknown-reason",
  },
]);

export const SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE: readonly CriterionResult[] = Object.freeze([
  {
    criterionId: "synthetic-criterion-001",
    status: "NOT_APPLICABLE",
    reasonCode: "synthetic-not-applicable-reason-001",
  },
  {
    criterionId: "synthetic-criterion-002",
    status: "NOT_APPLICABLE",
    reasonCode: "synthetic-not-applicable-reason-002",
  },
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

export const SYNTHETIC_SCORE_SOURCE_VALID_SCORE_18: AssessmentScoreSourceRecord = Object.freeze({
  sourceReferenceId: "synthetic-source-ref-001",
  score: 18,
  validFrom: "2026-01-01",
  validTo: "2026-12-31",
  confirmedAt: "2026-01-02T10:00:00Z",
  confirmedBy: "synthetic-user-001",
});

export const SYNTHETIC_SCORE_SOURCE_VALID_SCORE_ZERO: AssessmentScoreSourceRecord = Object.freeze({
  sourceReferenceId: "synthetic-source-ref-002",
  score: 0,
  validFrom: "2026-01-01",
  validTo: "2026-12-31",
  confirmedAt: "2026-01-02T10:00:00Z",
  confirmedBy: "synthetic-user-002",
});

export const SYNTHETIC_SCORE_SOURCE_UNCONFIRMED: AssessmentScoreSourceRecord = Object.freeze({
  sourceReferenceId: "synthetic-source-ref-003",
  score: 12,
  validFrom: "2026-01-01",
  validTo: "2026-12-31",
});

export const SYNTHETIC_SCORE_SOURCE_EXPIRED: AssessmentScoreSourceRecord = Object.freeze({
  sourceReferenceId: "synthetic-source-ref-004",
  score: 15,
  validFrom: "2024-01-01",
  validTo: "2024-12-31",
  confirmedAt: "2024-01-02T10:00:00Z",
  confirmedBy: "synthetic-user-001",
});

export const SYNTHETIC_SCORE_SOURCE_INVALID_RANGE: AssessmentScoreSourceRecord = Object.freeze({
  sourceReferenceId: "synthetic-source-ref-005",
  score: 10,
  validFrom: "2026-12-31",
  validTo: "2026-01-01",
  confirmedAt: "2026-01-02T10:00:00Z",
  confirmedBy: "synthetic-user-001",
});
