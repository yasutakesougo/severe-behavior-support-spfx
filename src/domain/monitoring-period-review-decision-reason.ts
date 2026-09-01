import { isNonEmptyString, isRecord } from "./validation";

export const MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.decision-reason" as const;
export const MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION = "1.0.0" as const;
export const MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED = false as const;

export type MonitoringPeriodReviewDecisionReason = Readonly<{
  OutcomeId: string;
  reason: string;
}>;

export type MonitoringPeriodReviewDecisionReasonDto = Readonly<{
  schemaId: typeof MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID;
  schemaVersion: typeof MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION;
  dtoVersion: typeof MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION;
  data: MonitoringPeriodReviewDecisionReason;
}>;

export type MonitoringPeriodReviewDecisionReasonNormalizationResult =
  | Readonly<{ status: "BLANK"; reason: null }>
  | Readonly<{ status: "VALID"; reason: MonitoringPeriodReviewDecisionReason }>
  | Readonly<{ status: "INVALID"; reason: null }>;

export function normalizeMonitoringPeriodReviewDecisionReason(
  OutcomeId: string,
  rawDraft: string,
): MonitoringPeriodReviewDecisionReasonNormalizationResult {
  if (!isNonEmptyString(OutcomeId) || typeof rawDraft !== "string") {
    return { status: "INVALID", reason: null };
  }

  const normalized = rawDraft.trim();
  if (normalized.length === 0) {
    return { status: "BLANK", reason: null };
  }

  const reason: MonitoringPeriodReviewDecisionReason = { OutcomeId, reason: normalized };
  return validateMonitoringPeriodReviewDecisionReason(reason)
    ? { status: "VALID", reason }
    : { status: "INVALID", reason: null };
}

export function validateMonitoringPeriodReviewDecisionReason(
  value: unknown,
): value is MonitoringPeriodReviewDecisionReason {
  return (
    isRecord(value) &&
    isNonEmptyString(value.OutcomeId) &&
    isNonEmptyString(value.reason) &&
    value.reason === value.reason.trim()
  );
}

export function toMonitoringPeriodReviewDecisionReasonDto(
  data: MonitoringPeriodReviewDecisionReason,
): MonitoringPeriodReviewDecisionReasonDto {
  return {
    schemaId: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID,
    schemaVersion: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
    dtoVersion: MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
    data,
  };
}

export function validateMonitoringPeriodReviewDecisionReasonDto(
  value: unknown,
): value is MonitoringPeriodReviewDecisionReasonDto {
  return (
    isRecord(value) &&
    value.schemaId === MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID &&
    value.schemaVersion === MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION &&
    value.dtoVersion === MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewDecisionReason(value.data)
  );
}
