import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  validateMonitoringPeriodReviewOutcomeNote,
} from "../../sbs-domain/monitoring-period-review-outcome-note.bundle";
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
  captureSyntheticReviewOutcome,
  reviewOutcomeContextKey,
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

const REVIEWED_AT = "2026-09-01T12:00:00+09:00";

describe("review-outcome-capture", () => {
  it("keeps canonical Outcome mint semantics independent from note content", () => {
    const blank = assembleSyntheticCapturedReview(MATERIALS, "NO_CHANGE", "", REVIEWED_AT);
    const withNote = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "継続して観察する",
      REVIEWED_AT,
    );
    expect(blank.status).toBe("CAPTURED");
    expect(withNote.status).toBe("CAPTURED");
    if (blank.status !== "CAPTURED" || withNote.status !== "CAPTURED") {
      throw new Error("expected CAPTURED");
    }
    expect(blank.captured.outcome.OutcomeId).toBe(withNote.captured.outcome.OutcomeId);
    expect(blank.captured.note).toBeNull();
    expect(withNote.captured.note?.OutcomeId).toBe(withNote.captured.outcome.OutcomeId);
    expect(validateMonitoringPeriodReviewOutcomeNote(withNote.captured.note)).toBe(true);
  });

  it("preserves Slice A canonical outcome validation and non-production boundaries", () => {
    const result = assembleSyntheticReviewOutcome(MATERIALS, "CHANGE_REQUIRED", REVIEWED_AT);
    expect(result.status).toBe("CAPTURED");
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");
    expect(validateMonitoringPeriodReviewOutcome(result.outcome)).toBe(true);
    expect(result.outcome.decision).toBe("CHANGE_REQUIRED");
    expect(Object.prototype.hasOwnProperty.call(result.outcome, "note")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result.outcome, "nextPlanVersion")).toBe(false);
    expect(REVIEW_OUTCOME_CAPTURE_SLICE_A.presentationOnly).toBe(true);
    expect(REVIEW_OUTCOME_CONTEXT_NOTE_SLICE_B.presentationOnly).toBe(true);
    expect(MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED).toBe(false);
    expect(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED).toBe(false);
  });

  it("fails atomically for over-limit note text", () => {
    expect(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH).toBe(255);
    const result = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "a".repeat(256),
      REVIEWED_AT,
    );
    expect(result).toEqual({ status: "INVALID" });
  });

  it("blocks duplicate decision/note overwrite after first success", () => {
    const first = assembleSyntheticCapturedReview(MATERIALS, "NO_CHANGE", "最初のメモ", REVIEWED_AT);
    if (first.status !== "CAPTURED") throw new Error("expected first capture");
    const duplicate = captureSyntheticReviewOutcome(
      first.captured,
      MATERIALS,
      "CHANGE_REQUIRED",
      "上書きメモ",
      "2026-09-01T12:01:00+09:00",
    );
    expect(duplicate.status).toBe("DUPLICATE");
    if (duplicate.status !== "DUPLICATE") throw new Error("expected duplicate");
    expect(duplicate.captured).toBe(first.captured);
    expect(duplicate.captured.outcome.decision).toBe("NO_CHANGE");
    expect(duplicate.captured.note?.note).toBe("最初のメモ");
  });

  it("keys synthetic session state by exact review context", () => {
    expect(reviewOutcomeContextKey(MATERIALS)).toContain("org-a\u001fsite-a\u001fuser-a");
    expect(reviewOutcomeContextKey({ ...MATERIALS, planVersion: 4 })).not.toBe(
      reviewOutcomeContextKey(MATERIALS),
    );
  });

  it("still exposes the canonical bridge mint directly", () => {
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
      reviewedAt: REVIEWED_AT,
      reviewedBy: "synthetic-reviewer-slice-a",
    });
    expect(id).toMatch(/^[0-9a-f]{64}$/);
  });
});
