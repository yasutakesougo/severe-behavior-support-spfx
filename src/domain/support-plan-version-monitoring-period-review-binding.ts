import type { MonitoringPeriodReviewOutcome } from "./monitoring-period-review-outcome";
import { validateMonitoringPeriodReviewOutcome } from "./monitoring-period-review-outcome";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

export const SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.version-outcome-binding" as const;
export const SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION =
  "1.0.0" as const;

export type SupportPlanVersionMonitoringPeriodReviewBinding = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  reviewedPlanVersion: number;
  sourceOutcomeId: string;
  boundAt: string;
  boundBy: string;
}>;

export type SupportPlanVersionMonitoringPeriodReviewBindingDto = Readonly<{
  schemaId: typeof SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID;
  schemaVersion: typeof SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION;
  dtoVersion: typeof SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION;
  data: SupportPlanVersionMonitoringPeriodReviewBinding;
}>;

export function toSupportPlanVersionMonitoringPeriodReviewBindingDto(
  data: SupportPlanVersionMonitoringPeriodReviewBinding,
): SupportPlanVersionMonitoringPeriodReviewBindingDto {
  return {
    schemaId: SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID,
    schemaVersion: SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION,
    dtoVersion: SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION,
    data,
  };
}

export function validateSupportPlanVersionMonitoringPeriodReviewBinding(
  value: unknown,
): value is SupportPlanVersionMonitoringPeriodReviewBinding {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.OrganizationId) &&
    isNonEmptyString(value.SiteId) &&
    isNonEmptyString(value.UserId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    typeof value.reviewedPlanVersion === "number" &&
    Number.isInteger(value.reviewedPlanVersion) &&
    value.reviewedPlanVersion >= 1 &&
    value.planVersion > value.reviewedPlanVersion &&
    isNonEmptyString(value.sourceOutcomeId) &&
    isValidIsoDateTime(value.boundAt) &&
    isNonEmptyString(value.boundBy)
  );
}

export function validateSupportPlanVersionMonitoringPeriodReviewBindingDto(
  value: unknown,
): value is SupportPlanVersionMonitoringPeriodReviewBindingDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaId === SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID &&
    value.schemaVersion === SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION &&
    value.dtoVersion === SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION &&
    validateSupportPlanVersionMonitoringPeriodReviewBinding(value.data)
  );
}

export function bindingMatchesMonitoringPeriodReviewOutcome(
  binding: SupportPlanVersionMonitoringPeriodReviewBinding,
  outcome: MonitoringPeriodReviewOutcome,
): boolean {
  return (
    validateSupportPlanVersionMonitoringPeriodReviewBinding(binding) &&
    validateMonitoringPeriodReviewOutcome(outcome) &&
    outcome.decision === "CHANGE_REQUIRED" &&
    binding.OrganizationId === outcome.OrganizationId &&
    binding.SiteId === outcome.SiteId &&
    binding.UserId === outcome.UserId &&
    binding.planId === outcome.planId &&
    binding.reviewedPlanVersion === outcome.planVersion &&
    binding.sourceOutcomeId === outcome.OutcomeId
  );
}

export function findBindingForOutcome(
  outcomeId: string,
  bindings: readonly SupportPlanVersionMonitoringPeriodReviewBinding[],
): SupportPlanVersionMonitoringPeriodReviewBinding | null {
  if (!isNonEmptyString(outcomeId)) {
    return null;
  }
  const matches = bindings.filter(
    (binding) =>
      validateSupportPlanVersionMonitoringPeriodReviewBinding(binding) &&
      binding.sourceOutcomeId === outcomeId,
  );
  return matches.length === 1 ? matches[0] : null;
}

export function findBindingForPlanVersion(
  planId: string,
  planVersion: number,
  bindings: readonly SupportPlanVersionMonitoringPeriodReviewBinding[],
): SupportPlanVersionMonitoringPeriodReviewBinding | null {
  if (!isNonEmptyString(planId) || !Number.isInteger(planVersion) || planVersion < 1) {
    return null;
  }
  const matches = bindings.filter(
    (binding) =>
      validateSupportPlanVersionMonitoringPeriodReviewBinding(binding) &&
      binding.planId === planId &&
      binding.planVersion === planVersion,
  );
  return matches.length === 1 ? matches[0] : null;
}

export function isRevisionPending(
  outcome: MonitoringPeriodReviewOutcome,
  bindings: readonly SupportPlanVersionMonitoringPeriodReviewBinding[],
): boolean {
  if (!validateMonitoringPeriodReviewOutcome(outcome) || outcome.decision !== "CHANGE_REQUIRED") {
    return false;
  }
  return !bindings.some(
    (binding) =>
      validateSupportPlanVersionMonitoringPeriodReviewBinding(binding) &&
      binding.sourceOutcomeId === outcome.OutcomeId,
  );
}

/**
 * Fail-closed aggregate validation for Scope U1-U5.
 *
 * U1: one sourceOutcomeId -> at most one binding
 * U2: one (OrganizationId, SiteId, planId, planVersion) -> at most one binding
 * U3: planVersion > reviewedPlanVersion (enforced by shape validator)
 * U4: binding source Outcome must be CHANGE_REQUIRED
 * U5: NO_CHANGE Outcome must not have a binding
 */
export function validateMonitoringPeriodReviewBindingSet(
  outcomes: readonly MonitoringPeriodReviewOutcome[],
  bindings: readonly SupportPlanVersionMonitoringPeriodReviewBinding[],
): boolean {
  const outcomeById = new Map<string, MonitoringPeriodReviewOutcome>();
  for (const outcome of outcomes) {
    if (!validateMonitoringPeriodReviewOutcome(outcome) || outcomeById.has(outcome.OutcomeId)) {
      return false;
    }
    outcomeById.set(outcome.OutcomeId, outcome);
  }

  const seenOutcomeIds = new Set<string>();
  const seenPlanVersions = new Set<string>();

  for (const binding of bindings) {
    if (!validateSupportPlanVersionMonitoringPeriodReviewBinding(binding)) {
      return false;
    }
    if (seenOutcomeIds.has(binding.sourceOutcomeId)) {
      return false;
    }
    seenOutcomeIds.add(binding.sourceOutcomeId);

    const planVersionKey = [
      binding.OrganizationId,
      binding.SiteId,
      binding.planId,
      String(binding.planVersion),
    ].join("\u001f");
    if (seenPlanVersions.has(planVersionKey)) {
      return false;
    }
    seenPlanVersions.add(planVersionKey);

    const sourceOutcome = outcomeById.get(binding.sourceOutcomeId);
    if (!sourceOutcome || !bindingMatchesMonitoringPeriodReviewOutcome(binding, sourceOutcome)) {
      return false;
    }
  }

  return true;
}
