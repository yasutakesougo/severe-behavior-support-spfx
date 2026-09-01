"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/domain/monitoring-period-review-outcome-note-spfx-entry.ts
var monitoring_period_review_outcome_note_spfx_entry_exports = {};
__export(monitoring_period_review_outcome_note_spfx_entry_exports, {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED: () => MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH: () => MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID: () => MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION: () => MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
  normalizeMonitoringPeriodReviewOutcomeNote: () => normalizeMonitoringPeriodReviewOutcomeNote,
  toMonitoringPeriodReviewOutcomeNoteDto: () => toMonitoringPeriodReviewOutcomeNoteDto,
  validateMonitoringPeriodReviewOutcomeNote: () => validateMonitoringPeriodReviewOutcomeNote,
  validateMonitoringPeriodReviewOutcomeNoteDto: () => validateMonitoringPeriodReviewOutcomeNoteDto
});
module.exports = __toCommonJS(monitoring_period_review_outcome_note_spfx_entry_exports);

// src/domain/validation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// src/domain/monitoring-period-review-outcome-note.ts
var MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID = "severe-behavior-support.monitoring-period-review.outcome-note";
var MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION = "1.0.0";
var MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED = false;
var MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH = 255;
function normalizeMonitoringPeriodReviewOutcomeNote(OutcomeId, rawDraft) {
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
  const note = { OutcomeId, note: normalized };
  return validateMonitoringPeriodReviewOutcomeNote(note) ? { status: "VALID", note } : { status: "INVALID", note: null };
}
function validateMonitoringPeriodReviewOutcomeNote(value) {
  if (!isRecord(value) || !isNonEmptyString(value.OutcomeId) || !isNonEmptyString(value.note)) {
    return false;
  }
  return value.note.length <= MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH && value.note === value.note.trim();
}
function toMonitoringPeriodReviewOutcomeNoteDto(data) {
  return {
    schemaId: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
    schemaVersion: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    dtoVersion: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
    data
  };
}
function validateMonitoringPeriodReviewOutcomeNoteDto(value) {
  return isRecord(value) && value.schemaId === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID && value.schemaVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION && value.dtoVersion === MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION && validateMonitoringPeriodReviewOutcomeNote(value.data);
}
