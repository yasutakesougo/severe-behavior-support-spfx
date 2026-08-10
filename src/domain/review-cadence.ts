import { isRecord } from "./validation";

// ==========================================
// Review cadence logical schema (GOV-RULE-06)
// Technical contract: docs/architecture/review-cadence-contract.md
// GOV-RULE-06: Accepted
// ==========================================

export type ReviewCadence = Readonly<{
  unit: "month";
  interval: 3;
  precision: "approximate";
}>;

export type ValidateReviewCadenceResult =
  | Readonly<{
      ok: true;
      reviewCadence: ReviewCadence;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const REVIEW_CADENCE_KEYS = new Set(["unit", "interval", "precision"]);

const ACCEPTED_REVIEW_CADENCE: ReviewCadence = {
  unit: "month",
  interval: 3,
  precision: "approximate",
};

/**
 * Validate GOV-RULE-06 ReviewCadence logical representation.
 *
 * - unit = "month", interval = 3, precision = "approximate"
 * - Fail-closed on malformed or incomplete input
 *
 * due-date calculation, SupportPlan wiring, and duration_days conversion are out of scope.
 */
export function validateReviewCadence(input: unknown): ValidateReviewCadenceResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => REVIEW_CADENCE_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    input.unit !== ACCEPTED_REVIEW_CADENCE.unit ||
    input.interval !== ACCEPTED_REVIEW_CADENCE.interval ||
    input.precision !== ACCEPTED_REVIEW_CADENCE.precision
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    reviewCadence: {
      unit: ACCEPTED_REVIEW_CADENCE.unit,
      interval: ACCEPTED_REVIEW_CADENCE.interval,
      precision: ACCEPTED_REVIEW_CADENCE.precision,
    },
  };
}
