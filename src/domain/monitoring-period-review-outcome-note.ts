import { isNonEmptyString, isRecord } from "./validation";

export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.outcome-note" as const;
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION = "1.0.0" as const;
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED = false as const;
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH = 255 as const;

export type MonitoringPeriodReviewOutcomeNote = Readonly<{
  OutcomeId: string;
  note: string;
}>;

export type MonitoringPeriodReviewOutcomeNoteDto = Readonly<{
  schemaId: typeof MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID;
  schemaVersion: typeof MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION;
  dtoVersion: typeof MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION;
  data: MonitoringPeriodReviewOutcomeNote;
}>;

export type MonitoringPeriodReviewOutcomeNoteBuildResult =
  | Readonly<{ status: "BLANK"; note: null }>
  | Readonly<{ status: "VALID"; note: MonitoringPeriodReviewOutcomeNote }>
  | Readonly<{ status: "INVALID" }>;

export function validateMonitoringPeriodReviewOutcomeNote(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeNote {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.OutcomeId) || typeof value.note !== "string") {
    return false;
  }
  return (
    value.note.length >= 1 &&
    value.note.length <= MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH &&
    value.note.trim() === value.note
  );
}

export function buildMonitoringPeriodReviewOutcomeNote(
  OutcomeId: string,
  rawNoteText: string,
): MonitoringPeriodReviewOutcomeNoteBuildResult {
  if (
    !isNonEmptyString(OutcomeId) ||
    typeof rawNoteText !== "string" ||
    rawNoteText.length > MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH
  ) {
    return { status: "INVALID" };
  }

  const normalized = rawNoteText.trim();
  if (normalized.length === 0) {
    return { status: "BLANK", note: null };
  }

  const note: MonitoringPeriodReviewOutcomeNote = { OutcomeId, note: normalized };
  return validateMonitoringPeriodReviewOutcomeNote(note)
    ? { status: "VALID", note }
    : { status: "INVALID" };
}

export function toMonitoringPeriodReviewOutcomeNoteDto(
  data: MonitoringPeriodReviewOutcomeNote,
): MonitoringPeriodReviewOutcomeNoteDto {
  return {
    schemaId: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
    schemaVersion: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    dtoVersion: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    data,
  };
}

export function validateMonitoringPeriodReviewOutcomeNoteDto(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeNoteDto {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.schemaId === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID &&
    value.schemaVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    value.dtoVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewOutcomeNote(value.data)
  );
}
