import { isRecord } from "./validation";

// ==========================================
// Review anchor logical schema (GOV-RULE-05)
// Technical contract: docs/architecture/review-anchor-contract.md
// GOV-RULE-05: Accepted
// ==========================================

export type ReviewAnchorPolicy = Readonly<{
  first: "support_plan_effective_from";
  subsequent: "previous_review_date";
}>;

export type ValidateReviewAnchorPolicyResult =
  | Readonly<{
      ok: true;
      reviewAnchorPolicy: ReviewAnchorPolicy;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const REVIEW_ANCHOR_POLICY_KEYS = new Set(["first", "subsequent"]);

const ACCEPTED_REVIEW_ANCHOR_POLICY: ReviewAnchorPolicy = {
  first: "support_plan_effective_from",
  subsequent: "previous_review_date",
};

/**
 * Validate GOV-RULE-05 ReviewAnchorPolicy logical representation.
 *
 * - first = "support_plan_effective_from", subsequent = "previous_review_date"
 * - Fail-closed on malformed or incomplete input
 *
 * reviewDueDate calculation, physical previous_review_date field adoption,
 * SupportPlan wiring, and duration_days conversion are out of scope.
 */
export function validateReviewAnchorPolicy(input: unknown): ValidateReviewAnchorPolicyResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => REVIEW_ANCHOR_POLICY_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    input.first !== ACCEPTED_REVIEW_ANCHOR_POLICY.first ||
    input.subsequent !== ACCEPTED_REVIEW_ANCHOR_POLICY.subsequent
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    reviewAnchorPolicy: {
      first: ACCEPTED_REVIEW_ANCHOR_POLICY.first,
      subsequent: ACCEPTED_REVIEW_ANCHOR_POLICY.subsequent,
    },
  };
}
