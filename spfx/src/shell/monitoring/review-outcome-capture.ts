import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  mintMonitoringPeriodReviewOutcomeId,
  validateMonitoringPeriodReviewOutcome,
  type MonitoringPeriodReviewDecision,
  type MonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  buildMonitoringPeriodReviewOutcomeNote,
  type MonitoringPeriodReviewOutcomeNote,
} from "../../sbs-domain/monitoring-period-review-outcome-note.bundle";

export const REVIEW_OUTCOME_CAPTURE_SLICE_A = {
  id: "REVIEW-OUTCOME-CAPTURE-SLICE-A",
  presentationOnly: true,
  liveWriteAuthorized: MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  sharePointWriteAuthorized: false,
  planVersionMutationAuthorized: false,
  monitoringVersionAuthorized: false,
  authoritativeDecisionCompletionAuthorized: false,
} as const;

export const REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B = {
  id: "REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B",
  presentationOnly: true,
  liveWriteAuthorized: MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  sharePointWriteAuthorized: false,
  planVersionMutationAuthorized: false,
  monitoringVersionAuthorized: false,
  noteEditAuthorized: false,
  aiNoteAuthoringAuthorized: false,
} as const;

export type SyntheticCapturedReview = Readonly<{
  outcome: MonitoringPeriodReviewOutcome;
  note: MonitoringPeriodReviewOutcomeNote | null;
}>;

export type SyntheticReviewOutcomeAssemblyResult =
  | Readonly<{ status: "CAPTURED"; outcome: MonitoringPeriodReviewOutcome }>
  | Readonly<{ status: "INVALID" }>;

export type SyntheticReviewOutcomeCaptureResult =
  | Readonly<{ status: "CAPTURED"; captured: SyntheticCapturedReview }>
  | Readonly<{ status: "DUPLICATE"; captured: SyntheticCapturedReview }>
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
): SyntheticReviewOutcomeAssemblyResult {
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
    return validateMonitoringPeriodReviewOutcome(outcome)
      ? { status: "CAPTURED", outcome }
      : { status: "INVALID" };
  } catch {
    return { status: "INVALID" };
  }
}

export function assembleSyntheticCapturedReview(
  materials: HumanReviewMaterials,
  decision: MonitoringPeriodReviewDecision,
  rawNoteText: string,
  reviewedAtIso: string = new Date().toISOString(),
): SyntheticReviewOutcomeCaptureResult {
  const outcomeResult = assembleSyntheticReviewOutcome(materials, decision, reviewedAtIso);
  if (outcomeResult.status !== "CAPTURED") {
    return { status: "INVALID" };
  }

  const noteResult = buildMonitoringPeriodReviewOutcomeNote(
    outcomeResult.outcome.OutcomeId,
    rawNoteText,
  );
  if (noteResult.status === "INVALID") {
    return { status: "INVALID" };
  }

  return {
    status: "CAPTURED",
    captured: {
      outcome: outcomeResult.outcome,
      note: noteResult.status === "VALID" ? noteResult.note : null,
    },
  };
}

export function captureSyntheticReviewOutcome(
  existingCaptured: SyntheticCapturedReview | null,
  materials: HumanReviewMaterials,
  decision: MonitoringPeriodReviewDecision,
  rawNoteText: string,
  reviewedAtIso?: string,
): SyntheticReviewOutcomeCaptureResult {
  if (existingCaptured) {
    return { status: "DUPLICATE", captured: existingCaptured };
  }
  return assembleSyntheticCapturedReview(materials, decision, rawNoteText, reviewedAtIso);
}
