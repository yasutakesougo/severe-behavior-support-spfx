import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import { buildMonitoringReadModel } from "../../src/domain/monitoring-read-model";
import type { MonitoringQuery } from "../../src/domain/monitoring-read-model";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

const TARGET_QUERY: MonitoringQuery = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  UserId: "synthetic-user-001",
  planId: "synthetic-plan-001",
  planVersion: 2,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
};

function makeRecord(
  recordId: string,
  performedAt: string,
  overrides: Partial<ProcedureRecord> = {},
): ProcedureRecord {
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(performedAt)) as ProcedureRecord["LocalDate"];

  const recordedAt = new Date(new Date(performedAt).getTime() + 1_800_000).toISOString();

  return createSyntheticProcedureRecord({
    OrganizationId: TARGET_QUERY.OrganizationId,
    SiteId: TARGET_QUERY.SiteId,
    UserId: TARGET_QUERY.UserId,
    planId: TARGET_QUERY.planId,
    planVersion: TARGET_QUERY.planVersion,
    RecordId: recordId,
    IdempotencyKey: `synthetic-idempotency-${recordId}`,
    PayloadFingerprint: `synthetic-fingerprint-${recordId}`,
    LocalDate: localDate,
    performedAt,
    recordedAt,
    ...overrides,
  });
}

describe("MONITORING-LINK-SLICE-A domain read model", () => {
  it("filters exact identity and period", () => {
    const records = [
      makeRecord("synthetic-record-003", "2026-08-20T10:00:00+09:00", {
        result: "NOT_PERFORMED",
      }),
      makeRecord("synthetic-record-001", "2026-08-05T09:00:00+09:00"),
      makeRecord("synthetic-record-002", "2026-08-12T14:05:00+09:00", {
        result: "PERFORMED_WITH_ADAPTATION",
      }),
      makeRecord("synthetic-record-other-org", "2026-08-12T10:00:00+09:00", {
        OrganizationId: "synthetic-org-other",
      }),
      makeRecord("synthetic-record-other-site", "2026-08-12T10:00:00+09:00", {
        SiteId: "synthetic-site-other",
      }),
      makeRecord("synthetic-record-other-user", "2026-08-12T10:00:00+09:00", {
        UserId: "synthetic-user-other",
      }),
      makeRecord("synthetic-record-other-plan", "2026-08-12T10:00:00+09:00", {
        planId: "synthetic-plan-other",
      }),
      makeRecord("synthetic-record-other-version", "2026-08-12T10:00:00+09:00", {
        planVersion: 3,
      }),
      makeRecord("synthetic-record-outside", "2026-07-31T23:00:00+09:00"),
    ];

    const result = buildMonitoringReadModel(TARGET_QUERY, records);
    assert.equal(result.status, "RESOLVED");
    if (result.status !== "RESOLVED") {
      return;
    }

    assert.equal(result.value.recordCount, 3);
    assert.equal(result.value.records[0].RecordId, "synthetic-record-001");
    assert.equal(result.value.records[1].RecordId, "synthetic-record-002");
    assert.equal(result.value.records[2].RecordId, "synthetic-record-003");
    assert.equal(result.value.records[0].result, "PERFORMED_AS_PLANNED");
    assert.equal(result.value.records[1].result, "PERFORMED_WITH_ADAPTATION");
    assert.equal(result.value.records[2].result, "NOT_PERFORMED");
  });

  it("uses performedAt rather than recordedAt for membership", () => {
    const record = makeRecord("synthetic-record-midnight", "2026-08-31T23:50:00+09:00", {
      recordedAt: "2026-09-01T00:10:00+09:00",
    });
    const result = buildMonitoringReadModel(TARGET_QUERY, [record]);

    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.equal(result.value.recordCount, 1);
    }
  });

  it("keeps Asia/Tokyo calendar-day bounds inclusive", () => {
    const first = makeRecord("synthetic-record-first-day", "2026-08-01T00:01:00+09:00");
    const last = makeRecord("synthetic-record-last-day", "2026-08-31T23:59:00+09:00");
    const result = buildMonitoringReadModel(TARGET_QUERY, [last, first]);

    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.equal(result.value.records[0].RecordId, "synthetic-record-first-day");
      assert.equal(result.value.records[1].RecordId, "synthetic-record-last-day");
    }
  });

  it("fails closed for malformed query, record, and duplicate identity", () => {
    const malformedQuery = { ...TARGET_QUERY, periodStart: "not-a-date" };
    assert.deepEqual(buildMonitoringReadModel(malformedQuery, []), {
      status: "MALFORMED_INPUT",
    });

    const valid = makeRecord("synthetic-record-valid", "2026-08-12T10:00:00+09:00");
    const malformedRecord = { ...valid, result: "FAILED" };
    assert.deepEqual(buildMonitoringReadModel(TARGET_QUERY, [malformedRecord]), {
      status: "MALFORMED_INPUT",
    });
    assert.deepEqual(buildMonitoringReadModel(TARGET_QUERY, [valid, valid]), {
      status: "MALFORMED_INPUT",
    });
  });

  it("uses RecordId as the same-instant deterministic tie-breaker", () => {
    const laterId = makeRecord("synthetic-record-z", "2026-08-12T10:00:00+09:00");
    const earlierId = makeRecord("synthetic-record-a", "2026-08-12T10:00:00+09:00");
    const result = buildMonitoringReadModel(TARGET_QUERY, [laterId, earlierId]);

    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.equal(result.value.records[0].RecordId, "synthetic-record-a");
      assert.equal(result.value.records[1].RecordId, "synthetic-record-z");
    }
  });
});
