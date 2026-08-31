import { evaluateObservationPeriodMembership } from "./support-plan";
import { sha256Hex } from "./sha256";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

export const MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.outcome" as const;
export const MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION = "1.0.0" as const;
export const MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED = false as const;

export const MONITORING_PERIOD_REVIEW_DECISIONS = ["NO_CHANGE", "CHANGE_REQUIRED"] as const;
export type MonitoringPeriodReviewDecision =
  (typeof MONITORING_PERIOD_REVIEW_DECISIONS)[number];

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

export const MONITORING_PERIOD_REVIEW_OUTCOME_IDENTITY_SEPARATOR = "\u001f";
const MONITORING_PERIOD_REVIEW_OUTCOME_ID_NAMESPACE =
  "monitoring-period-review.outcome-id.v1";

export function isMonitoringPeriodReviewDecision(
  value: unknown,
): value is MonitoringPeriodReviewDecision {
  return (
    typeof value === "string" &&
    (MONITORING_PERIOD_REVIEW_DECISIONS as readonly string[]).includes(value)
  );
}

function isUniqueStringArray(value: unknown): value is readonly string[] {
  if (!Array.isArray(value)) {
    return false;
  }
  const seen = new Set<string>();
  for (const item of value) {
    if (!isNonEmptyString(item) || seen.has(item)) {
      return false;
    }
    seen.add(item);
  }
  return true;
}

function isWellFormedReviewPeriod(periodStart: string, periodEnd: string): boolean {
  return (
    evaluateObservationPeriodMembership(periodStart, periodEnd, periodStart) !==
    "MALFORMED_INPUT"
  );
}

export function mintMonitoringPeriodReviewOutcomeId(
  input: MonitoringPeriodReviewOutcomeIdentityMintInput,
): string {
  const canonicalSourceRecordIds = [...input.sourceRecordIds].sort();
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.planVersion),
    input.periodStart,
    input.periodEnd,
    canonicalSourceRecordIds.join(MONITORING_PERIOD_REVIEW_OUTCOME_IDENTITY_SEPARATOR),
    input.decision,
    input.reviewedAt,
    input.reviewedBy,
  ].join(MONITORING_PERIOD_REVIEW_OUTCOME_IDENTITY_SEPARATOR);

  return sha256Hex(
    `${MONITORING_PERIOD_REVIEW_OUTCOME_ID_NAMESPACE}${MONITORING_PERIOD_REVIEW_OUTCOME_IDENTITY_SEPARATOR}${material}`,
  );
}

export function toMonitoringPeriodReviewOutcomeDto(
  data: MonitoringPeriodReviewOutcome,
): MonitoringPeriodReviewOutcomeDto {
  return {
    schemaId: MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID,
    schemaVersion: MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION,
    dtoVersion: MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION,
    data,
  };
}

export function validateMonitoringPeriodReviewOutcome(
  value: unknown,
): value is MonitoringPeriodReviewOutcome {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNonEmptyString(value.OutcomeId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isValidIsoDateTime(value.periodStart) ||
    !isValidIsoDateTime(value.periodEnd) ||
    !isUniqueStringArray(value.sourceRecordIds) ||
    !isMonitoringPeriodReviewDecision(value.decision) ||
    !isValidIsoDateTime(value.reviewedAt) ||
    !isNonEmptyString(value.reviewedBy)
  ) {
    return false;
  }

  return isWellFormedReviewPeriod(value.periodStart, value.periodEnd);
}

export function validateMonitoringPeriodReviewOutcomeDto(
  value: unknown,
): value is MonitoringPeriodReviewOutcomeDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaId === MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID &&
    value.schemaVersion === MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION &&
    value.dtoVersion === MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewOutcome(value.data)
  );
}
