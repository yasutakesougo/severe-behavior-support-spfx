export const MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID: "severe-behavior-support.monitoring-period-review.outcome";
export const MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION: "1.0.0";
export const MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED: false;
export const MONITORING_PERIOD_REVIEW_DECISIONS: readonly ["NO_CHANGE", "CHANGE_REQUIRED"];

export type MonitoringPeriodReviewDecision = (typeof MONITORING_PERIOD_REVIEW_DECISIONS)[number];

export type MonitoringPeriodReviewOutcome = Readonly<{
  OutcomeId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  sourceRecordIds: readonly string[];
  decision: MonitoringPeriodReviewDecision;
  reviewedAt: string;
  reviewedBy: string;
}>;

export type MonitoringPeriodReviewOutcomeDto = Readonly<{
  schemaId: typeof MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID;
  schemaVersion: typeof MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION;
  dtoVersion: typeof MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION;
  data: MonitoringPeriodReviewOutcome;
}>;

export type MonitoringPeriodReviewOutcomeIdentityMintInput = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  sourceRecordIds: readonly string[];
  decision: MonitoringPeriodReviewDecision;
  reviewedAt: string;
  reviewedBy: string;
}>;

export function mintMonitoringPeriodReviewOutcomeId(
  input: MonitoringPeriodReviewOutcomeIdentityMintInput,
): string;
export function validateMonitoringPeriodReviewOutcome(
  value: unknown,
): value is MonitoringPeriodReviewOutcome;
export function validateMonitoringPeriodReviewOutcomeDto(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeDto;
