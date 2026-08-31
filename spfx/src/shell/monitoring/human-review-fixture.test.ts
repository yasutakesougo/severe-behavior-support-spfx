import {
  HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE,
  HUMAN_REVIEW_MALFORMED_FIXTURE,
  humanReviewResultForSyntheticVersion,
} from "./human-review-fixture";

describe("HUMAN-REVIEW-UI-SLICE-A synthetic review materials", () => {
  it("keeps exact v2 facts and result vocabulary", () => {
    const result = humanReviewResultForSyntheticVersion(2);
    expect(result.status).toBe("RESOLVED");
    if (result.status !== "RESOLVED") return;

    expect(result.value.UserId).toBe("user-a");
    expect(result.value.planId).toBe("synthetic-plan-001");
    expect(result.value.planVersion).toBe(2);
    expect(result.value.recordCount).toBe(3);
    expect(result.value.records.map((record) => record.RecordId)).toEqual([
      "synthetic-monitoring-v2-001",
      "synthetic-monitoring-v2-002",
      "synthetic-monitoring-v2-003",
    ]);
    expect(result.value.records.map((record) => record.result)).toEqual([
      "PERFORMED_AS_PLANNED",
      "PERFORMED_WITH_ADAPTATION",
      "NOT_PERFORMED",
    ]);
    expect(result.value.records[0].ProcedureVersion).toBe("synthetic-procedure-p2-v1");
    expect(result.value.humanInterpretationRequired).toBe(true);
  });

  it("keeps version isolation and zero-record distinct from NOT_PERFORMED", () => {
    const v1 = humanReviewResultForSyntheticVersion(1);
    const v3 = humanReviewResultForSyntheticVersion(3);
    expect(v1.status).toBe("RESOLVED");
    expect(v3.status).toBe("RESOLVED");
    if (v1.status !== "RESOLVED" || v3.status !== "RESOLVED") return;

    expect(v1.value.recordCount).toBe(0);
    expect(v1.value.records).toEqual([]);
    expect(v3.value.planVersion).toBe(3);
    expect(v3.value.recordCount).toBe(1);
    expect(v3.value.records[0].RecordId).toBe("synthetic-monitoring-v3-001");
  });

  it("preserves explicit fail-closed parent states", () => {
    expect(HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE).toEqual({ status: "CONTEXT_MISMATCH" });
    expect(HUMAN_REVIEW_MALFORMED_FIXTURE).toEqual({ status: "MALFORMED_INPUT" });
  });

  it("keeps an unrepresented positive version as exact zero-record context without fallback", () => {
    const result = humanReviewResultForSyntheticVersion(99);
    expect(result.status).toBe("RESOLVED");
    if (result.status !== "RESOLVED") return;

    expect(result.value.planVersion).toBe(99);
    expect(result.value.recordCount).toBe(0);
    expect(result.value.records).toEqual([]);
  });
});
