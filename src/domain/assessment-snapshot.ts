import type { EvaluationDecision } from "./types";
import { isNonEmptyString, isRecord, isReasonCode, isValidIsoDate } from "./validation";

export const ASSESSMENT_SNAPSHOT_RESULTS = [
  "NO_FINDINGS",
  "FINDINGS_PRESENT",
  "NOT_APPLICABLE",
] as const;

export type AssessmentSnapshotResult = (typeof ASSESSMENT_SNAPSHOT_RESULTS)[number];

export const EVALUATION_DECISIONS = [
  "NO_FINDINGS",
  "FINDINGS_PRESENT",
  "INDETERMINATE",
  "NOT_APPLICABLE",
  "SOURCE_UNAVAILABLE",
] as const;

export type AssessmentSnapshotNotPersistableReason = "INDETERMINATE" | "SOURCE_UNAVAILABLE";

export type AssessmentSnapshotResultCandidateResult =
  | Readonly<{
      ok: true;
      persistable: true;
      result: AssessmentSnapshotResult;
      reasonCodes: readonly string[];
    }>
  | Readonly<{
      ok: true;
      persistable: false;
      reason: AssessmentSnapshotNotPersistableReason;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "MISSING_REASON_CODES";
    }>;

export const ASSESSMENT_SNAPSHOT_RECORD_STATUSES = ["draft", "finalized"] as const;

export type AssessmentSnapshotRecordStatus = (typeof ASSESSMENT_SNAPSHOT_RECORD_STATUSES)[number];

/**
 * Domain complete-contract surface for AssessmentSnapshot (PR-J).
 * Technical contract: docs/architecture/assessment-snapshot-complete-contract.md
 * Schema ID / SharePoint / DTO / FindingCode are out of scope.
 */
export type AssessmentSnapshot = Readonly<{
  snapshotId: string;
  recordStatus: AssessmentSnapshotRecordStatus;
  result: AssessmentSnapshotResult;
  reasonCodes: readonly string[];
  ruleSetVersion: string;
  periodStart: string;
  periodEnd: string;
  inputFingerprint: string;
  findingIds?: readonly string[];
  supersedesSnapshotId?: string;
}>;

export type ValidateAssessmentSnapshotResult =
  | Readonly<{
      ok: true;
      snapshot: AssessmentSnapshot;
    }>
  | Readonly<{
      ok: false;
      code:
        "MALFORMED_INPUT" | "MISSING_REASON_CODES" | "FORBIDDEN_RESULT" | "INVALID_CORRECTION_LINK";
    }>;

const ASSESSMENT_SNAPSHOT_ALLOWED_KEYS = new Set([
  "snapshotId",
  "recordStatus",
  "result",
  "reasonCodes",
  "ruleSetVersion",
  "periodStart",
  "periodEnd",
  "inputFingerprint",
  "findingIds",
  "supersedesSnapshotId",
]);

const FORBIDDEN_PERSISTED_RESULTS = new Set([
  "demo",
  "retrieval_failed",
  "INDETERMINATE",
  "SOURCE_UNAVAILABLE",
]);

function isEvaluationDecision(value: unknown): value is EvaluationDecision {
  return typeof value === "string" && (EVALUATION_DECISIONS as readonly string[]).includes(value);
}

function isAssessmentSnapshotResult(value: unknown): value is AssessmentSnapshotResult {
  return (
    typeof value === "string" && (ASSESSMENT_SNAPSHOT_RESULTS as readonly string[]).includes(value)
  );
}

function isAssessmentSnapshotRecordStatus(value: unknown): value is AssessmentSnapshotRecordStatus {
  return (
    typeof value === "string" &&
    (ASSESSMENT_SNAPSHOT_RECORD_STATUSES as readonly string[]).includes(value)
  );
}

function normalizeReasonCodes(
  value: unknown,
): { ok: true; reasonCodes: readonly string[] } | { ok: false; code: "MALFORMED_INPUT" } {
  if (value === undefined) {
    return { ok: true, reasonCodes: [] };
  }

  if (!Array.isArray(value)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (!isReasonCode(item)) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
    normalized.push(item);
  }

  return { ok: true, reasonCodes: normalized };
}

function normalizeFindingIds(
  value: unknown,
): { ok: true; findingIds?: readonly string[] } | { ok: false; code: "MALFORMED_INPUT" } {
  if (value === undefined) {
    return { ok: true };
  }

  if (!Array.isArray(value)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (!isNonEmptyString(item)) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
    normalized.push(item);
  }

  return { ok: true, findingIds: normalized };
}

/**
 * Convert EvaluationDecision into an AssessmentSnapshot Result candidate.
 * Persistence / DEC-009 / GOV-AUD are out of scope.
 * Technical contract: docs/architecture/assessment-snapshot-result-conversion.md
 */
export function toAssessmentSnapshotResultCandidate(
  input: unknown,
): AssessmentSnapshotResultCandidateResult {
  if (!isRecord(input) || !("evaluationDecision" in input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const { evaluationDecision, reasonCodes: rawReasonCodes } = input;

  if (!isEvaluationDecision(evaluationDecision)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const reasonCodesResult = normalizeReasonCodes(rawReasonCodes);
  if (!reasonCodesResult.ok) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const reasonCodes = reasonCodesResult.reasonCodes;

  if (evaluationDecision === "SOURCE_UNAVAILABLE") {
    return {
      ok: true,
      persistable: false,
      reason: "SOURCE_UNAVAILABLE",
    };
  }

  if (evaluationDecision === "INDETERMINATE") {
    return {
      ok: true,
      persistable: false,
      reason: "INDETERMINATE",
    };
  }

  if (evaluationDecision === "NOT_APPLICABLE") {
    if (reasonCodes.length === 0) {
      return { ok: false, code: "MISSING_REASON_CODES" };
    }

    return {
      ok: true,
      persistable: true,
      result: "NOT_APPLICABLE",
      reasonCodes,
    };
  }

  // NO_FINDINGS | FINDINGS_PRESENT
  return {
    ok: true,
    persistable: true,
    result: evaluationDecision,
    reasonCodes,
  };
}

/**
 * Validate AssessmentSnapshot complete-contract domain surface (PR-J).
 * SharePoint / DTO / Schema ID / FindingCode / application save flow are out of scope.
 * Technical contract: docs/architecture/assessment-snapshot-complete-contract.md
 */
export function validateAssessmentSnapshot(input: unknown): ValidateAssessmentSnapshotResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => ASSESSMENT_SNAPSHOT_ALLOWED_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    !isNonEmptyString(input.snapshotId) ||
    !isAssessmentSnapshotRecordStatus(input.recordStatus) ||
    !isNonEmptyString(input.ruleSetVersion) ||
    !isValidIsoDate(input.periodStart) ||
    !isValidIsoDate(input.periodEnd) ||
    !isNonEmptyString(input.inputFingerprint)
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (input.periodEnd < input.periodStart) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (typeof input.result !== "string") {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (FORBIDDEN_PERSISTED_RESULTS.has(input.result)) {
    return { ok: false, code: "FORBIDDEN_RESULT" };
  }

  if (!isAssessmentSnapshotResult(input.result)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!("reasonCodes" in input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const reasonCodesResult = normalizeReasonCodes(input.reasonCodes);
  if (!reasonCodesResult.ok) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (input.result === "NOT_APPLICABLE" && reasonCodesResult.reasonCodes.length === 0) {
    return { ok: false, code: "MISSING_REASON_CODES" };
  }

  const findingIdsResult = normalizeFindingIds(input.findingIds);
  if (!findingIdsResult.ok) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (input.supersedesSnapshotId !== undefined) {
    if (!isNonEmptyString(input.supersedesSnapshotId)) {
      return { ok: false, code: "INVALID_CORRECTION_LINK" };
    }
    if (input.supersedesSnapshotId === input.snapshotId) {
      return { ok: false, code: "INVALID_CORRECTION_LINK" };
    }
    if (input.recordStatus !== "finalized") {
      return { ok: false, code: "INVALID_CORRECTION_LINK" };
    }
  }

  const snapshot: AssessmentSnapshot = {
    snapshotId: input.snapshotId,
    recordStatus: input.recordStatus,
    result: input.result,
    reasonCodes: reasonCodesResult.reasonCodes,
    ruleSetVersion: input.ruleSetVersion,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    inputFingerprint: input.inputFingerprint,
    ...(findingIdsResult.findingIds !== undefined
      ? { findingIds: findingIdsResult.findingIds }
      : {}),
    ...(input.supersedesSnapshotId !== undefined
      ? { supersedesSnapshotId: input.supersedesSnapshotId }
      : {}),
  };

  return { ok: true, snapshot };
}
