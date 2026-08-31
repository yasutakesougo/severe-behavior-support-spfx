import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMonitoringReadModel as buildCanonicalMonitoringReadModel } from "../../src/domain/monitoring-read-model";
import {
  buildDemoMonitoringForVersion,
  monitoringQueryForVersion,
  MONITORING_LINK_SLICE_A_RECORDS,
} from "../../spfx/src/shell/monitoring/monitoring-fixture";

describe("MONITORING-LINK-SLICE-A contract", () => {
  it("keeps the SPFx synthetic projection equivalent to the canonical domain projection", () => {
    const query = monitoringQueryForVersion(2);
    const canonical = buildCanonicalMonitoringReadModel(query, MONITORING_LINK_SLICE_A_RECORDS);
    const spfx = buildDemoMonitoringForVersion(2);

    assert.deepEqual(spfx, canonical);
    assert.equal(canonical.status, "RESOLVED");
    if (canonical.status === "RESOLVED") {
      assert.equal(canonical.value.recordCount, 3);
      assert.ok(canonical.value.records.every((record) => record.planVersion === 2));
    }
  });

  it("does not substitute another plan version when the requested version has no records", () => {
    const canonical = buildCanonicalMonitoringReadModel(
      monitoringQueryForVersion(1),
      MONITORING_LINK_SLICE_A_RECORDS,
    );

    assert.equal(canonical.status, "RESOLVED");
    if (canonical.status === "RESOLVED") {
      assert.equal(canonical.value.planVersion, 1);
      assert.equal(canonical.value.recordCount, 0);
    }
  });

  it("preserves factual ProcedureRecord result vocabulary without evaluation labels", () => {
    const canonical = buildCanonicalMonitoringReadModel(
      monitoringQueryForVersion(2),
      MONITORING_LINK_SLICE_A_RECORDS,
    );

    assert.equal(canonical.status, "RESOLVED");
    if (canonical.status !== "RESOLVED") {
      return;
    }

    const results = canonical.value.records.map((record) => record.result);
    assert.deepEqual(results, [
      "PERFORMED_AS_PLANNED",
      "PERFORMED_WITH_ADAPTATION",
      "NOT_PERFORMED",
    ]);
    assert.equal(results.includes("SUCCESS" as (typeof results)[number]), false);
    assert.equal(results.includes("FAILURE" as (typeof results)[number]), false);
  });
});
