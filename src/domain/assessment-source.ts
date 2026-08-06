import { parseBehaviorRelatedScore } from "./behavior-score";
import type {
  AssessmentScoreSourceRecord,
  AssessmentSourceDecision,
  AssessmentSourceLookupResult,
  BehaviorRelatedScore,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export type AssessmentSourceRecordValidationResult =
  | Readonly<{
      valid: true;
      score: BehaviorRelatedScore;
      isConfirmed: boolean;
    }>
  | Readonly<{
      valid: false;
      reason: string;
    }>;

export function validateAssessmentScoreSourceRecord(
  record: unknown,
): AssessmentSourceRecordValidationResult {
  if (!isRecord(record)) {
    return { valid: false, reason: "NOT_AN_OBJECT" };
  }

  if (
    typeof record.sourceReferenceId !== "string" ||
    record.sourceReferenceId.trim().length === 0
  ) {
    return { valid: false, reason: "INVALID_SOURCE_REFERENCE_ID" };
  }

  if (
    typeof record.validFrom !== "string" ||
    !isCalendarDate(record.validFrom)
  ) {
    return { valid: false, reason: "INVALID_VALID_FROM_DATE" };
  }

  if (
    typeof record.validTo !== "string" ||
    !isCalendarDate(record.validTo)
  ) {
    return { valid: false, reason: "INVALID_VALID_TO_DATE" };
  }

  if (record.validFrom > record.validTo) {
    return { valid: false, reason: "VALID_FROM_AFTER_VALID_TO" };
  }

  const scoreResult = parseBehaviorRelatedScore(record.score);
  if (!scoreResult.success) {
    return { valid: false, reason: `INVALID_SCORE:${scoreResult.reason}` };
  }

  const hasConfirmedAt =
    typeof record.confirmedAt === "string" &&
    record.confirmedAt.trim().length > 0;
  const hasConfirmedBy =
    typeof record.confirmedBy === "string" &&
    record.confirmedBy.trim().length > 0;

  const isConfirmed = hasConfirmedAt && hasConfirmedBy;

  return {
    valid: true,
    score: scoreResult.score,
    isConfirmed,
  };
}

export function selectAssessmentScoreSource(
  input: AssessmentSourceLookupResult | readonly AssessmentScoreSourceRecord[],
  assessmentDate: string,
): AssessmentSourceDecision {
  if (typeof assessmentDate !== "string" || !isCalendarDate(assessmentDate)) {
    return { decision: "MALFORMED", reason: "INVALID_ASSESSMENT_DATE" };
  }

  if (isRecord(input) && "status" in input) {
    switch (input.status) {
      case "FETCH_FAILED": {
        if (
          typeof input.code !== "string" ||
          input.code.trim().length === 0
        ) {
          return { decision: "MALFORMED", reason: "EMPTY_FETCH_FAILED_CODE" };
        }
        return { decision: "FETCH_FAILED", code: input.code };
      }
      case "EMPTY":
        return { decision: "MISSING" };
      case "FOUND": {
        if (!Array.isArray(input.value)) {
          return { decision: "MALFORMED", reason: "INVALID_LOOKUP_VALUE" };
        }
        return processRecords(input.value, assessmentDate);
      }
      default:
        return { decision: "MALFORMED", reason: "UNKNOWN_LOOKUP_STATUS" };
    }
  }

  if (Array.isArray(input)) {
    return processRecords(input, assessmentDate);
  }

  return { decision: "MALFORMED", reason: "INVALID_INPUT" };
}

function processRecords(
  records: readonly AssessmentScoreSourceRecord[],
  assessmentDate: string,
): AssessmentSourceDecision {
  if (records.length === 0) {
    return { decision: "MISSING" };
  }

  const validActive: {
    source: AssessmentScoreSourceRecord;
    score: BehaviorRelatedScore;
  }[] = [];
  const unconfirmedActive: AssessmentScoreSourceRecord[] = [];
  const expiredSources: AssessmentScoreSourceRecord[] = [];

  for (const record of records) {
    const val = validateAssessmentScoreSourceRecord(record);
    if (!val.valid) {
      if (val.reason === "VALID_FROM_AFTER_VALID_TO") {
        return { decision: "MALFORMED", reason: val.reason };
      }
      continue;
    }

    const isActiveOnDate =
      record.validFrom <= assessmentDate && assessmentDate <= record.validTo;

    if (isActiveOnDate) {
      if (val.isConfirmed) {
        validActive.push({ source: record, score: val.score });
      } else {
        unconfirmedActive.push(record);
      }
    } else if (assessmentDate > record.validTo) {
      expiredSources.push(record);
    }
  }

  if (validActive.length === 1) {
    return {
      decision: "VALID",
      source: validActive[0].source,
      score: validActive[0].score,
    };
  }

  if (validActive.length > 1) {
    return {
      decision: "CONFLICT",
      sources: validActive.map((item) => item.source),
    };
  }

  if (unconfirmedActive.length > 0) {
    return {
      decision: "UNCONFIRMED",
      sources: unconfirmedActive,
    };
  }

  if (expiredSources.length > 0) {
    return {
      decision: "EXPIRED",
      sources: expiredSources,
    };
  }

  return { decision: "MISSING" };
}
