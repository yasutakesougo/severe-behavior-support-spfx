import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import {
  buildMonitoringReadModel,
  type MonitoringQuery,
} from "../../src/domain/monitoring-read-model";
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

function recordFor(
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
    recordedAt: new Date(new Date(performedAt).getTime() + 30 * 60 * 1000).toISOString(),
    ...overrides,
  });
}

describe("MONITORING-LINK-SLICE-A domain read model", () => {
  it("includes only exact org/site/user/plan/version records inside the performedAt period", () => {
    const records = [
      recordFor("synthetic-record-003", "2026-08-20T10:00:00+09:00", {
        result: "NOT_PERFORMED",
      }),
      recordFor("synthetic-record-001", "2026-08-05T09:00:00+09:00"),
      recordFor("synthetic-record-002", "2026-08-12T14:05:00+09:00", {
        result: "PERFORMED_WITH_ADAPTATION",
      }),
      recordFor("synthetic-record-other-org", "2026-08-12T10:00:00+09:00", {
        OrganizationId: "synthetic-org-other",
      }),
      recordFor("synthetic-record-other-site", "2026-08-12T10:00:00+09:00", {
        SiteId: "synthetic-site-other",
      }),
      recordFor("synthetic-record-other-user", "2026-08-12T10:00:00+09:00", {
        UserId: "synthetic-user-other",
      }),
      recordFor("synthetic-record-other-plan", "2026-08-12T10:00:00+09:00", {
        planId: "synthetic-plan-other",
      }),
      recordFor("synthetic-record-other-version", "2026-08-12T10:00:00+09:00", {
        planVersion: 3,
      }),
      recordFor("synthetic-record-outside", "2026-07-31T23:00:00+09:00"),
    ];

    const result = buildMonitoringReadModel(TARGET_QUERY, records);
    assert.equal(result.status, "RESOLVED");
    if (result.status !== "RESOLVED") {
      return;
    }

    assert.equal(result.value.recordCount, 3);
    assert.deepEqual(
      result.value.records.map((record) => record.RecordId),
      ["synthetic-record-001", "synthetic-record-002", "synthetic-record-003"],
    );
    assert.deepEqual(
      result.value.records.map((record) => record.result),
      ["PERFORMED_AS_PLANNED", "PERFORMED_WITH_ADAPTATION", "NOT_PERFORMED"],
    );
  });

  it("uses performedAt rather than recordedAt for period membership", () => {
    const record = recordFor("synthetic-record-midnight", "2026-08-31T23:50:00+09:00", {
      recordedAt: "2026-09-01T00:10:00+09:00",
    });

    const result = buildMonitoringReadModel(TARGET_QUERY, [record]);
    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.equal(result.value.recordCount, 1);
    }
  });

  it("keeps Asia/Tokyo calendar-day period bounds inclusive", () => {
    const first = recordFor("synthetic-record-first-day", "2026-08-01T00:01:00+09:00");
    const last = recordFor("synthetic-record-last-day", "2026-08-31T23:59:00+09:00");

    const result = buildMonitoringReadModel(TARGET_QUERY, [last, first]);
    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.deepEqual(
        result.value.records.map((record) => record.RecordId),
        ["synthetic-record-first-day", "synthetic-record-last-day"],
      );
    }
  });

  it("fails closed for malformed query, malformed record, and duplicate RecordId", () => {
    assert.deepEqual(
      buildMonitoringReadModel({ ...TARGET_QUERY, periodStart: "not-a-date" }, []),
      { status: "MALFORMED_INPUT" },
    );

    const valid = recordFor("synthetic-record-valid", "2026-08-12T10:00:00+09:00");
    assert.deepEqual(
      buildMonitoringReadModel(TARGET_QUERY, [{ ...valid, result: "FAILED" }]),
      { status: "MALFORMED_INPUT" },
    );

    assert.deepEqual(buildMonitoringReadModel(TARGET_QUERY, [valid, valid]), {
      status: "MALFORMED_INPUT",
    });
  });

  it("uses RecordId only as a deterministic tie-breaker for the same performed instant", () => {
    const laterId = recordFor("synthetic-record-z", "2026-08-12T10:00:00+09:00");
    const earlierId = recordFor("synthetic-record-a", "2026-08-12T10:00:00+09:00");

    const result = buildMonitoringReadModel(TARGET_QUERY, [laterId, earlierId]);
    assert.equal(result.status, "RESOLVED");
    if (result.status === "RESOLVED") {
      assert.deepEqual(
        result.value.records.map((record) => record.RecordId),
        ["synthetic-record-a", "synthetic-record-z"],
      );
    }
  });
});
