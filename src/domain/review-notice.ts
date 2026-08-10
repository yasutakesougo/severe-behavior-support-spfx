import { isRecord } from "./validation";

// ==========================================
// Review notice logical schema (GOV-RULE-07)
// Technical contract: docs/architecture/review-notice-contract.md
// GOV-RULE-07: Accepted / Option C
// ==========================================

export type ReviewNoticePolicy = Readonly<{
  kind: "calendar_month";
  trigger: "enter_target_review_month";
  purpose: "notify_staff_review_period";
  precision: "approximate";
}>;

export type ValidateReviewNoticePolicyResult =
  | Readonly<{
      ok: true;
      reviewNoticePolicy: ReviewNoticePolicy;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const REVIEW_NOTICE_POLICY_KEYS = new Set(["kind", "trigger", "purpose", "precision"]);

const ACCEPTED_REVIEW_NOTICE_POLICY: ReviewNoticePolicy = {
  kind: "calendar_month",
  trigger: "enter_target_review_month",
  purpose: "notify_staff_review_period",
  precision: "approximate",
};

/**
 * Validate GOV-RULE-07 ReviewNoticePolicy logical representation (Option C).
 *
 * - kind = "calendar_month"
 * - trigger = "enter_target_review_month"
 * - purpose = "notify_staff_review_period"
 * - precision = "approximate"
 * - Fail-closed on malformed or incomplete input
 *
 * target-month calculation, notification delivery, due/overdue interpretation,
 * SupportPlan wiring, and day-count conversion are out of scope.
 */
export function validateReviewNoticePolicy(input: unknown): ValidateReviewNoticePolicyResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => REVIEW_NOTICE_POLICY_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (
    input.kind !== ACCEPTED_REVIEW_NOTICE_POLICY.kind ||
    input.trigger !== ACCEPTED_REVIEW_NOTICE_POLICY.trigger ||
    input.purpose !== ACCEPTED_REVIEW_NOTICE_POLICY.purpose ||
    input.precision !== ACCEPTED_REVIEW_NOTICE_POLICY.precision
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    reviewNoticePolicy: {
      kind: ACCEPTED_REVIEW_NOTICE_POLICY.kind,
      trigger: ACCEPTED_REVIEW_NOTICE_POLICY.trigger,
      purpose: ACCEPTED_REVIEW_NOTICE_POLICY.purpose,
      precision: ACCEPTED_REVIEW_NOTICE_POLICY.precision,
    },
  };
}
