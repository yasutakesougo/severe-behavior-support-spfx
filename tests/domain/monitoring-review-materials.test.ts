import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  MonitoringReadModel,
  MonitoringRecordItem,
} from "../../src/domain/monitoring-read-model";
import {
  buildHumanReviewMaterials,
  type ReviewPresentationContext,
} from "../../src/domain/monitoring-review-materials";

function record(
  RecordId: string,
  performedAt: string,
  result: MonitoringRecordItem["result"] = "PERFORMED_AS_PLANNED",
): MonitoringRecordItem {
  return {
    RecordId,
    Procedure: {
      ProcedureId: `procedure-${RecordId}`,
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    result,
    performedAt,
    recordedAt: new Date(new Date(performedAt).getTime() + 600_000).toISOString(),
    planId: "synthetic-plan-001",
    planVersion: 2,
  };
}

function model(records: readonly MonitoringRecordItem[], planVersion = 2): MonitoringReadModel {
  return {
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: "synthetic-user-001",
    planId: "synthetic-plan-001",
    planVersion,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    recordCount: records.length,
    records: records.map((item) => ({ ...item, planVersion })),
  };
}

function contextFor(value: MonitoringReadModel): ReviewPresentationContext {
  return {
    OrganizationId: value.OrganizationId,
    SiteId: value.SiteId,
    UserId: value.UserId,
    planId: value.planId,
    planVersion: value.planVersion,
    periodStart: value.periodStart,
    periodEnd: value.periodEnd,
  };
}

describe("MONITORING-REVIEW-LINK-SLICE-A human review materials", () => {
  it("projects exact version-2 monitoring facts without judgment", () => {
    const input = model([
      record("record-001", "2026-08-05T09:00:00+09:00"),
      record("record-002", "2026-08-12T14:05:00+09:00", "PERFORMED_WITH_ADAPTATION"),
      record("record-003", "2026-08-20T10:00:00+09:00", "NOT_PERFORMED"),
    ]);

    const result = buildHumanReviewMaterials(input, contextFor(input));
    assert.equal(result.status, "RESOLVED");
    if (result.status !== "RESOLVED") return;

    assert.equal(result.value.planVersion, 2);
    assert.equal(result.value.recordCount, 3);
    assert.equal(result.value.periodStart, input.periodStart);
    assert.equal(result.value.periodEnd, input.periodEnd);
    assert.equal(result.value.humanInterpretationRequired, true);
    assert.deepEqual(
      result.value.records.map((item) => item.result),
      ["PERFORMED_AS_PLANNED", "PERFORMED_WITH_ADAPTATION", "NOT_PERFORMED"],
    );
    assert.deepEqual(
      result.value.records.map((item) => item.RecordId),
      ["record-001", "record-002", "record-003"],
    );
    assert.equal(result.value.records[1].ProcedureId, "procedure-record-002");
    assert.equal(result.value.records[1].ProcedureVersion, "v1");
    assert.equal("reviewDecision" in result.value, false);
    assert.equal("recommendation" in result.value, false);
    assert.equal("score" in result.value, false);
  });

  it("preserves version isolation including one-record and zero-record RESOLVED states", () => {
    const version3 = model([record("record-v3", "2026-08-10T09:00:00+09:00")], 3);
    const version1 = model([], 1);

    const v3 = buildHumanReviewMaterials(version3);
    const v1 = buildHumanReviewMaterials(version1);

    assert.equal(v3.status, "RESOLVED");
    assert.equal(v1.status, "RESOLVED");
    if (v3.status === "RESOLVED") {
      assert.equal(v3.value.planVersion, 3);
      assert.equal(v3.value.recordCount, 1);
    }
    if (v1.status === "RESOLVED") {
      assert.equal(v1.value.planVersion, 1);
      assert.equal(v1.value.recordCount, 0);
      assert.deepEqual(v1.value.records, []);
    }
  });

  it("fails closed on presentation-context mismatch without choosing a source", () => {
    const input = model([]);
    const mismatched = { ...contextFor(input), planVersion: 3 };
    assert.deepEqual(buildHumanReviewMaterials(input, mismatched), {
      status: "CONTEXT_MISMATCH",
    });
  });

  it("fails closed on malformed or internally contradictory monitoring input", () => {
    const input = model([record("record-001", "2026-08-05T09:00:00+09:00")]);
    assert.deepEqual(buildHumanReviewMaterials({ ...input, recordCount: 2 }), {
      status: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      buildHumanReviewMaterials({
        ...input,
        records: [{ ...input.records[0], planVersion: 3 }],
      }),
      { status: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      buildHumanReviewMaterials({
        ...model([]),
        periodStart: "2026-09-01T00:00:00+09:00",
        periodEnd: "2026-08-01T00:00:00+09:00",
      }),
      { status: "MALFORMED_INPUT" },
    );
  });

  it("fails closed on malformed presentation context before mismatch comparison", () => {
    const input = model([]);
    const malformedContext = {
      ...contextFor(input),
      periodStart: "2026-09-01T00:00:00+09:00",
      periodEnd: "2026-08-01T00:00:00+09:00",
    };
    assert.deepEqual(buildHumanReviewMaterials(input, malformedContext), {
      status: "MALFORMED_INPUT",
    });
  });

  it("requires the upstream deterministic chronological sequence instead of re-sorting", () => {
    const later = record("record-z", "2026-08-20T10:00:00+09:00");
    const earlier = record("record-a", "2026-08-05T09:00:00+09:00");
    assert.deepEqual(buildHumanReviewMaterials(model([later, earlier])), {
      status: "MALFORMED_INPUT",
    });
  });

  it("does not synthesize NOT_PERFORMED from a zero-record state", () => {
    const result = buildHumanReviewMaterials(model([], 1));
    assert.equal(result.status, "RESOLVED");
    if (result.status !== "RESOLVED") return;

    assert.equal(result.value.recordCount, 0);
    assert.equal(
      result.value.records.some((item) => item.result === "NOT_PERFORMED"),
      false,
    );
  });
});
