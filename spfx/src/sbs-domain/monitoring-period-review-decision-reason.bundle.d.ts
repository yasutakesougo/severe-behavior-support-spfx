export const MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID: "severe-behavior-support.monitoring-period-review.decision-reason";
export const MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION: "1.0.0";
export const MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED: false;

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
): MonitoringPeriodReviewDecisionReasonNormalizationResult;
export function toMonitoringPeriodReviewDecisionReasonDto(
  data: MonitoringPeriodReviewDecisionReason,
): MonitoringPeriodReviewDecisionReasonDto;
export function validateMonitoringPeriodReviewDecisionReason(
  value: unknown,
): value is MonitoringPeriodReviewDecisionReason;
export function validateMonitoringPeriodReviewDecisionReasonDto(
  value: unknown,
): value is MonitoringPeriodReviewDecisionReasonDto;
