import type { EvaluationDecision } from "./types";
import { isRecord, isReasonCode } from "./validation";

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

function isEvaluationDecision(value: unknown): value is EvaluationDecision {
  return typeof value === "string" && (EVALUATION_DECISIONS as readonly string[]).includes(value);
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
