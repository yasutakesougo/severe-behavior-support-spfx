import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Observation } from "../../src/domain";
import { summarizeObservationEvidence } from "../../src/domain";

function observation(RecordId: string, observedAt: string, observedBy: string): Observation {
  return {
    OrganizationId: "synthetic-org",
    SiteId: "SITE-ISG",
    UserId: "synthetic-user",
    RecordId,
    observedAt,
    observedBy,
    content: `synthetic observation ${RecordId}`,
    version: 1,
  };
}

describe("POST-RA-OBS-EVIDENCE-V1", () => {
  it("returns an empty history with no latest timestamp for no observations", () => {
    const result = summarizeObservationEvidence([]);

    assert.deepEqual(result, {
      history: [],
      latestObservedAt: undefined,
    });
  });

  it("orders observation evidence chronologically and derives latestObservedAt", () => {
    const input = [
      observation("obs-003", "2026-08-10T03:00:00+09:00", "staff-c"),
      observation("obs-001", "2026-08-10T01:00:00+09:00", "staff-a"),
      observation("obs-002", "2026-08-10T02:00:00+09:00", "staff-b"),
    ];

    const result = summarizeObservationEvidence(input);

    assert.deepEqual(result.history, [
      {
        RecordId: "obs-001",
        observedAt: "2026-08-10T01:00:00+09:00",
        observedBy: "staff-a",
      },
      {
        RecordId: "obs-002",
        observedAt: "2026-08-10T02:00:00+09:00",
        observedBy: "staff-b",
      },
      {
        RecordId: "obs-003",
        observedAt: "2026-08-10T03:00:00+09:00",
        observedBy: "staff-c",
      },
    ]);
    assert.equal(result.latestObservedAt, "2026-08-10T03:00:00+09:00");
  });

  it("orders by represented instant when ISO offsets differ", () => {
    const result = summarizeObservationEvidence([
      observation("obs-later", "2026-08-10T10:00:00+09:00", "staff-b"),
      observation("obs-earlier", "2026-08-10T00:30:00Z", "staff-a"),
    ]);

    assert.deepEqual(
      result.history.map((item) => item.RecordId),
      ["obs-earlier", "obs-later"],
    );
    assert.equal(result.latestObservedAt, "2026-08-10T10:00:00+09:00");
  });

  it("uses RecordId only as a deterministic tie-break when observedAt is equal", () => {
    const observedAt = "2026-08-10T03:00:00+09:00";
    const result = summarizeObservationEvidence([
      observation("obs-b", observedAt, "staff-b"),
      observation("obs-a", observedAt, "staff-a"),
    ]);

    assert.deepEqual(
      result.history.map((item) => item.RecordId),
      ["obs-a", "obs-b"],
    );
    assert.equal(result.latestObservedAt, observedAt);
  });

  it("does not mutate or reorder the input array", () => {
    const input = [
      observation("obs-002", "2026-08-10T02:00:00+09:00", "staff-b"),
      observation("obs-001", "2026-08-10T01:00:00+09:00", "staff-a"),
    ];
    const originalOrder = input.map((item) => item.RecordId);

    summarizeObservationEvidence(input);

    assert.deepEqual(
      input.map((item) => item.RecordId),
      originalOrder,
    );
  });

  it("exposes evidence fields only and derives no compliance or violation state", () => {
    const result = summarizeObservationEvidence([
      observation("obs-001", "2026-08-10T01:00:00+09:00", "staff-a"),
    ]);

    assert.deepEqual(Object.keys(result).sort(), ["history", "latestObservedAt"]);
    assert.deepEqual(Object.keys(result.history[0]).sort(), [
      "RecordId",
      "observedAt",
      "observedBy",
    ]);
  });
});
