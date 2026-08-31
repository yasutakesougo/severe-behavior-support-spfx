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

export type MonitoringPeriodReviewOutcomeNoteNormalizationResult =
  | Readonly<{ status: "BLANK"; note: null }>
  | Readonly<{ status: "VALID"; note: MonitoringPeriodReviewOutcomeNote }>
  | Readonly<{ status: "INVALID"; note: null }>;

export function normalizeMonitoringPeriodReviewOutcomeNote(
  OutcomeId: string,
  rawDraft: string,
): MonitoringPeriodReviewOutcomeNoteNormalizationResult {
  if (!isNonEmptyString(OutcomeId) || typeof rawDraft !== "string") {
    return { status: "INVALID", note: null };
  }
  if (rawDraft.length > MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH) {
    return { status: "INVALID", note: null };
  }

  const normalized = rawDraft.trim();
  if (normalized.length === 0) {
    return { status: "BLANK", note: null };
  }

  const note: MonitoringPeriodReviewOutcomeNote = { OutcomeId, note: normalized };
  return validateMonitoringPeriodReviewOutcomeNote(note)
    ? { status: "VALID", note }
    : { status: "INVALID", note: null };
}

export function validateMonitoringPeriodReviewOutcomeNote(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeNote {
  if (!isRecord(value) || !isNonEmptyString(value.OutcomeId) || !isNonEmptyString(value.note)) {
    return false;
  }
  return (
    value.note.length <= MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH &&
    value.note === value.note.trim()
  );
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
  return (
    isRecord(value) &&
    value.schemaId === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID &&
    value.schemaVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    value.dtoVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewOutcomeNote(value.data)
  );
}
