import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  mintMonitoringPeriodReviewOutcomeId,
  validateMonitoringPeriodReviewOutcome,
  type MonitoringPeriodReviewDecision,
  type MonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";

export const REVIEW_OUTCOME_CAPTURE_SLICE_A = {
  id: "REVIEW-OUTCOME-CAPTURE-SLICE-A",
  presentationOnly: true,
  liveWriteAuthorized: MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  sharePointWriteAuthorized: false,
  planVersionMutationAuthorized: false,
  monitoringVersionAuthorized: false,
  authoritativeDecisionCompletionAuthorized: false,
} as const;

export type SyntheticReviewOutcomeCaptureResult =
  | Readonly<{ status: "CAPTURED"; outcome: MonitoringPeriodReviewOutcome }>
  | Readonly<{ status: "DUPLICATE"; outcome: MonitoringPeriodReviewOutcome }>
  | Readonly<{ status: "INVALID" }>;

export function reviewOutcomeContextKey(materials: HumanReviewMaterials): string {
  return [
    materials.OrganizationId,
    materials.SiteId,
    materials.UserId,
    materials.planId,
    String(materials.planVersion),
    materials.periodStart,
    materials.periodEnd,
  ].join("\u001f");
}

export function assembleSyntheticReviewOutcome(
  materials: HumanReviewMaterials,
  decision: MonitoringPeriodReviewDecision,
  reviewedAtIso: string = new Date().toISOString(),
): SyntheticReviewOutcomeCaptureResult {
  const sourceRecordIds = materials.records.map((record) => record.RecordId);
  const reviewedBy = "synthetic-reviewer-slice-a";
  const mintInput = {
    OrganizationId: materials.OrganizationId,
    SiteId: materials.SiteId,
    UserId: materials.UserId,
    planId: materials.planId,
    planVersion: materials.planVersion,
    periodStart: materials.periodStart,
    periodEnd: materials.periodEnd,
    sourceRecordIds,
    decision,
    reviewedAt: reviewedAtIso,
    reviewedBy,
  } as const;

  try {
    const outcome: MonitoringPeriodReviewOutcome = {
      OutcomeId: mintMonitoringPeriodReviewOutcomeId(mintInput),
      ...mintInput,
    };

    if (!validateMonitoringPeriodReviewOutcome(outcome)) {
      return { status: "INVALID" };
    }

    return { status: "CAPTURED", outcome };
  } catch {
    return { status: "INVALID" };
  }
}

export function captureSyntheticReviewOutcome(
  existingOutcome: MonitoringPeriodReviewOutcome | null,
  materials: HumanReviewMaterials,
  decision: MonitoringPeriodReviewDecision,
  reviewedAtIso?: string,
): SyntheticReviewOutcomeCaptureResult {
  if (existingOutcome) {
    return { status: "DUPLICATE", outcome: existingOutcome };
  }
  return assembleSyntheticReviewOutcome(materials, decision, reviewedAtIso);
}
