import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import { validateMonitoringPeriodReviewOutcomeNote } from "../../sbs-domain/monitoring-period-review-outcome-note.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED,
  mintMonitoringPeriodReviewOutcomeId,
  validateMonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import {
  REVIEW_OUTCOME_CAPTURE_SLICE_A,
  REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B,
  assembleSyntheticCapturedReview,
  assembleSyntheticReviewOutcome,
  captureSyntheticCapturedReview,
  capturedReviewMatchesMaterials,
  captureSyntheticReviewOutcome,
  reviewOutcomeContextKey,
  reviewOutcomeCurrentEpochBindingKey,
  reviewOutcomeEvidenceSnapshot,
} from "./review-outcome-capture";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

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

const MATERIALS_B: HumanReviewMaterials = {
  ...MATERIALS,
  records: MATERIALS.records.map((record) => ({ ...record, RecordId: "record-2" })),
};

describe("review-outcome-capture", () => {
  it("exposes the canonical bridge mint directly", () => {
    const id = mintMonitoringPeriodReviewOutcomeId({
      OrganizationId: MATERIALS.OrganizationId,
      SiteId: MATERIALS.SiteId,
      UserId: MATERIALS.UserId,
      planId: MATERIALS.planId,
      planVersion: MATERIALS.planVersion,
      periodStart: MATERIALS.periodStart,
      periodEnd: MATERIALS.periodEnd,
      sourceRecordIds: ["record-1"],
      decision: "NO_CHANGE",
      reviewedAt: "2026-09-01T12:00:00+09:00",
      reviewedBy: "synthetic-reviewer-slice-a",
    });
    expect(id).toMatch(/^[0-9a-f]{64}$/);
  });

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

  it("binds the current capture epoch to a canonical evidence snapshot", () => {
    expect(reviewOutcomeContextKey(MATERIALS_B)).toBe(reviewOutcomeContextKey(MATERIALS));
    expect(reviewOutcomeCurrentEpochBindingKey(MATERIALS_B)).not.toBe(
      reviewOutcomeCurrentEpochBindingKey(MATERIALS),
    );
    expect(reviewOutcomeEvidenceSnapshot(["record-b", "record-a", "record-a", ""])).toBe(
      "record-a\u001frecord-b",
    );
  });

  it("treats a stored capture as current only when base context and evidence both match", () => {
    const first = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "memo A",
      "2026-09-01T12:00:00+09:00",
    );
    if (first.status !== "CAPTURED") throw new Error("expected first capture");

    expect(capturedReviewMatchesMaterials(first.captured, MATERIALS)).toBe(true);
    expect(capturedReviewMatchesMaterials(first.captured, MATERIALS_B)).toBe(false);
    expect(capturedReviewMatchesMaterials(first.captured, { ...MATERIALS, UserId: "user-b" })).toBe(
      false,
    );
  });

  it("captures an atomic outcome + optional note pair without changing OutcomeId", () => {
    const reviewedAt = "2026-09-01T12:00:00+09:00";
    const outcomeOnly = assembleSyntheticReviewOutcome(MATERIALS, "NO_CHANGE", reviewedAt);
    const withNote = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "  継続して観察したい  ",
      reviewedAt,
    );
    expect(withNote.status).toBe("CAPTURED");
    expect(outcomeOnly.status).toBe("CAPTURED");
    if (withNote.status !== "CAPTURED" || outcomeOnly.status !== "CAPTURED") {
      throw new Error("expected CAPTURED");
    }
    expect(withNote.captured.outcome.OutcomeId).toBe(outcomeOnly.outcome.OutcomeId);
    expect(withNote.captured.note?.OutcomeId).toBe(withNote.captured.outcome.OutcomeId);
    expect(withNote.captured.note?.note).toBe("継続して観察したい");
    expect(validateMonitoringPeriodReviewOutcomeNote(withNote.captured.note)).toBe(true);
    expect(REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B.liveWriteAuthorized).toBe(false);
    expect(REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B.noteEditAuthorized).toBe(false);
  });

  it("keeps a blank note optional for both decisions", () => {
    for (const decision of ["NO_CHANGE", "CHANGE_REQUIRED"] as const) {
      const result = assembleSyntheticCapturedReview(
        MATERIALS,
        decision,
        " \n ",
        "2026-09-01T12:00:00+09:00",
      );
      expect(result.status).toBe("CAPTURED");
      if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");
      expect(result.captured.note).toBeNull();
      expect(result.captured.outcome.decision).toBe(decision);
    }
  });

  it("fails atomically for an over-limit note and blocks duplicate replacement", () => {
    const invalid = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "a".repeat(256),
      "2026-09-01T12:00:00+09:00",
    );
    expect(invalid).toEqual({ status: "INVALID" });

    const first = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "first memo",
      "2026-09-01T12:00:00+09:00",
    );
    if (first.status !== "CAPTURED") throw new Error("expected first capture");
    const duplicate = captureSyntheticCapturedReview(
      first.captured,
      MATERIALS,
      "CHANGE_REQUIRED",
      "replacement",
      "2026-09-01T12:01:00+09:00",
    );
    expect(duplicate.status).toBe("DUPLICATE");
    if (duplicate.status !== "DUPLICATE") throw new Error("expected duplicate");
    expect(duplicate.captured).toBe(first.captured);
    expect(duplicate.captured.outcome.decision).toBe("NO_CHANGE");
    expect(duplicate.captured.note?.note).toBe("first memo");
  });
});
