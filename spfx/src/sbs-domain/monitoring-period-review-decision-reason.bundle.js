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
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable:
            !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/domain/monitoring-period-review-decision-reason-spfx-entry.ts
var monitoring_period_review_decision_reason_spfx_entry_exports = {};
__export(monitoring_period_review_decision_reason_spfx_entry_exports, {
  MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED: () =>
    MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID: () =>
    MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION: () =>
    MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
  normalizeMonitoringPeriodReviewDecisionReason: () =>
    normalizeMonitoringPeriodReviewDecisionReason,
  toMonitoringPeriodReviewDecisionReasonDto: () =>
    toMonitoringPeriodReviewDecisionReasonDto,
  validateMonitoringPeriodReviewDecisionReason: () =>
    validateMonitoringPeriodReviewDecisionReason,
  validateMonitoringPeriodReviewDecisionReasonDto: () =>
    validateMonitoringPeriodReviewDecisionReasonDto,
});
module.exports = __toCommonJS(
  monitoring_period_review_decision_reason_spfx_entry_exports,
);

// src/domain/validation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// src/domain/monitoring-period-review-decision-reason.ts
var MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.decision-reason";
var MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION = "1.0.0";
var MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED = false;
function normalizeMonitoringPeriodReviewDecisionReason(OutcomeId, rawDraft) {
  if (!isNonEmptyString(OutcomeId) || typeof rawDraft !== "string") {
    return { status: "INVALID", reason: null };
  }
  const normalized = rawDraft.trim();
  if (normalized.length === 0) {
    return { status: "BLANK", reason: null };
  }
  const reason = { OutcomeId, reason: normalized };
  return validateMonitoringPeriodReviewDecisionReason(reason)
    ? { status: "VALID", reason }
    : { status: "INVALID", reason: null };
}
function validateMonitoringPeriodReviewDecisionReason(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.OutcomeId) &&
    isNonEmptyString(value.reason) &&
    value.reason === value.reason.trim()
  );
}
function toMonitoringPeriodReviewDecisionReasonDto(data) {
  return {
    schemaId: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID,
    schemaVersion: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
    dtoVersion: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
    data,
  };
}
function validateMonitoringPeriodReviewDecisionReasonDto(value) {
  return (
    isRecord(value) &&
    value.schemaId === MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID &&
    value.schemaVersion ===
      MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION &&
    value.dtoVersion ===
      MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewDecisionReason(value.data)
  );
}
