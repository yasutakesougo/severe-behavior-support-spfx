"use strict";
// Generated narrow bridge for src/domain/monitoring-period-review-outcome-note-spfx-entry.ts.
// Canonical implementation remains under src/domain; this bundle grants no write authority.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.outcome-note";
exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION = "1.0.0";
exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED = false;
exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH = 255;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateMonitoringPeriodReviewOutcomeNote(value) {
  if (!isRecord(value)) return false;
  if (!isNonEmptyString(value.OutcomeId) || typeof value.note !== "string") return false;
  return (
    value.note.length >= 1 &&
    value.note.length <= exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH &&
    value.note.trim() === value.note
  );
}
exports.validateMonitoringPeriodReviewOutcomeNote = validateMonitoringPeriodReviewOutcomeNote;

function buildMonitoringPeriodReviewOutcomeNote(OutcomeId, rawNoteText) {
  if (
    !isNonEmptyString(OutcomeId) ||
    typeof rawNoteText !== "string" ||
    rawNoteText.length > exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH
  ) {
    return { status: "INVALID" };
  }
  const normalized = rawNoteText.trim();
  if (normalized.length === 0) return { status: "BLANK", note: null };
  const note = { OutcomeId, note: normalized };
  return validateMonitoringPeriodReviewOutcomeNote(note)
    ? { status: "VALID", note }
    : { status: "INVALID" };
}
exports.buildMonitoringPeriodReviewOutcomeNote = buildMonitoringPeriodReviewOutcomeNote;

function toMonitoringPeriodReviewOutcomeNoteDto(data) {
  return {
    schemaId: exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
    schemaVersion: exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    dtoVersion: exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    data,
  };
}
exports.toMonitoringPeriodReviewOutcomeNoteDto = toMonitoringPeriodReviewOutcomeNoteDto;

function validateMonitoringPeriodReviewOutcomeNoteDto(value) {
  if (!isRecord(value)) return false;
  return (
    value.schemaId === exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID &&
    value.schemaVersion === exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    value.dtoVersion === exports.MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewOutcomeNote(value.data)
  );
}
exports.validateMonitoringPeriodReviewOutcomeNoteDto = validateMonitoringPeriodReviewOutcomeNoteDto;
