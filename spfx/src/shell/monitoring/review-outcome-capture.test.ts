import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  validateMonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import {
  REVIEW_OUTCOME_CAPTURE_SLICE_A,
  assembleSyntheticReviewOutcome,
  captureSyntheticReviewOutcome,
  reviewOutcomeContextKey,
} from "./review-outcome-capture";

const MATERIALS: HumanReviewMaterials = {
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  planId: "plan-a",
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  recordCount: 1,
  records: [
    {
      RecordId: "record-1",
      ProcedureId: "procedure-1",
      ProcedureVersion: "v1",
      result: "PERFORMED_AS_PLANNED",
      performedAt: "2026-08-10T10:00:00+09:00",
      recordedAt: "2026-08-10T10:05:00+09:00",
    },
  ],
  humanInterpretationRequired: true,
};

describe("review-outcome-capture", () => {
  it("assembles a canonical domain-valid NO_CHANGE outcome with synthetic authority boundaries", () => {
    const result = assembleSyntheticReviewOutcome(
      MATERIALS,
      "NO_CHANGE",
      "2026-09-01T12:00:00+09:00",
    );
    expect(result.status).toBe("CAPTURED");
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");
    expect(validateMonitoringPeriodReviewOutcome(result.outcome)).toBe(true);
    expect(result.outcome.decision).toBe("NO_CHANGE");
    expect(result.outcome.reviewedBy).toBe("synthetic-reviewer-slice-a");
    expect(result.outcome.sourceRecordIds).toEqual(["record-1"]);
    expect(result.outcome.OutcomeId).toMatch(/^[0-9a-f]{64}$/);
    expect(REVIEW_OUTCOME_CAPTURE_SLICE_A.presentationOnly).toBe(true);
    expect(REVIEW_OUTCOME_CAPTURE_SLICE_A.authoritativeDecisionCompletionAuthorized).toBe(false);
    expect(MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED).toBe(false);
  });

  it("captures CHANGE_REQUIRED without creating or implying N+1 data", () => {
    const result = assembleSyntheticReviewOutcome(
      MATERIALS,
      "CHANGE_REQUIRED",
      "2026-09-01T12:00:00+09:00",
    );
    expect(result.status).toBe("CAPTURED");
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");
    expect(result.outcome.decision).toBe("CHANGE_REQUIRED");
    expect(Object.prototype.hasOwnProperty.call(result.outcome, "nextPlanVersion")).toBe(false);
  });

  it("fails closed on invalid reviewedAt and blocks duplicate overwrite", () => {
    expect(assembleSyntheticReviewOutcome(MATERIALS, "NO_CHANGE", "not-a-date")).toEqual({
      status: "INVALID",
    });
    const first = assembleSyntheticReviewOutcome(
      MATERIALS,
      "NO_CHANGE",
      "2026-09-01T12:00:00+09:00",
    );
    if (first.status !== "CAPTURED") throw new Error("expected first capture");
    const duplicate = captureSyntheticReviewOutcome(
      first.outcome,
      MATERIALS,
      "CHANGE_REQUIRED",
      "2026-09-01T12:01:00+09:00",
    );
    expect(duplicate.status).toBe("DUPLICATE");
    if (duplicate.status !== "DUPLICATE") throw new Error("expected duplicate");
    expect(duplicate.outcome).toBe(first.outcome);
    expect(duplicate.outcome.decision).toBe("NO_CHANGE");
  });

  it("keys synthetic session state by exact review context", () => {
    expect(reviewOutcomeContextKey(MATERIALS)).toContain("org-a\u001fsite-a\u001fuser-a");
    expect(reviewOutcomeContextKey({ ...MATERIALS, planVersion: 4 })).not.toBe(
      reviewOutcomeContextKey(MATERIALS),
    );
  });
});
