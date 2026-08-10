import { isRecord } from "./validation";

// ==========================================
// Review monitoring guidance (Decision-RD-3)
// Technical contract: docs/architecture/review-monitoring-guidance-contract.md
// Decision-RD-3: Accepted / LOCKED
// ==========================================

export type ReviewMonitoringGuidancePolicy = Readonly<{
  kind: "informational_cadence_guide";
  guideText: "3か月に1回程度";
  purpose: "display_and_notify_as_guide";
  institutionalReviewCadence: "maintained";
  overdueState: "not_adopted";
  overdueWarning: "not_adopted";
  overdueBusinessRestriction: "not_adopted";
  fixedNinetyDays: "not_adopted";
  hardDueOverdue: "not_adopted";
}>;

export type ValidateReviewMonitoringGuidancePolicyResult =
  | Readonly<{
      ok: true;
      reviewMonitoringGuidancePolicy: ReviewMonitoringGuidancePolicy;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const REVIEW_MONITORING_GUIDANCE_POLICY_KEYS = new Set([
  "kind",
  "guideText",
  "purpose",
  "institutionalReviewCadence",
  "overdueState",
  "overdueWarning",
  "overdueBusinessRestriction",
  "fixedNinetyDays",
  "hardDueOverdue",
]);

const ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY: ReviewMonitoringGuidancePolicy = {
  kind: "informational_cadence_guide",
  guideText: "3か月に1回程度",
  purpose: "display_and_notify_as_guide",
  institutionalReviewCadence: "maintained",
  overdueState: "not_adopted",
  overdueWarning: "not_adopted",
  overdueBusinessRestriction: "not_adopted",
  fixedNinetyDays: "not_adopted",
  hardDueOverdue: "not_adopted",
};

/**
 * Validate Decision-RD-3 ReviewMonitoringGuidancePolicy logical representation.
 *
 * - informational cadence guide only
 * - institutional review cadence maintained
 * - overdue / 90-day / hard due semantics not adopted
 * - Fail-closed on malformed or incomplete input
 *
 * Day-count approach windows, reviewDueDate calculation, overdue engines,
 * notification delivery, schema wiring, and DTO/adapter logic are out of scope.
 */
export function validateReviewMonitoringGuidancePolicy(
  input: unknown,
): ValidateReviewMonitoringGuidancePolicyResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => REVIEW_MONITORING_GUIDANCE_POLICY_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    input.kind !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.kind ||
    input.guideText !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.guideText ||
    input.purpose !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.purpose ||
    input.institutionalReviewCadence !==
      ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.institutionalReviewCadence ||
    input.overdueState !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueState ||
    input.overdueWarning !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueWarning ||
    input.overdueBusinessRestriction !==
      ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueBusinessRestriction ||
    input.fixedNinetyDays !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.fixedNinetyDays ||
    input.hardDueOverdue !== ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.hardDueOverdue
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    reviewMonitoringGuidancePolicy: {
      kind: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.kind,
      guideText: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.guideText,
      purpose: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.purpose,
      institutionalReviewCadence:
        ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.institutionalReviewCadence,
      overdueState: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueState,
      overdueWarning: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueWarning,
      overdueBusinessRestriction:
        ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.overdueBusinessRestriction,
      fixedNinetyDays: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.fixedNinetyDays,
      hardDueOverdue: ACCEPTED_REVIEW_MONITORING_GUIDANCE_POLICY.hardDueOverdue,
    },
  };
}
