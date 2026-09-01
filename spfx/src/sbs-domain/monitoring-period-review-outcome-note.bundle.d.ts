export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID: "severe-behavior-support.monitoring-period-review.outcome-note";
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION: "1.0.0";
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED: false;
export const MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH: 255;

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
): MonitoringPeriodReviewOutcomeNoteNormalizationResult;
export function toMonitoringPeriodReviewOutcomeNoteDto(
  data: MonitoringPeriodReviewOutcomeNote,
): MonitoringPeriodReviewOutcomeNoteDto;
export function validateMonitoringPeriodReviewOutcomeNote(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeNote;
export function validateMonitoringPeriodReviewOutcomeNoteDto(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeNoteDto;
