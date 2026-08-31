import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "node:test";
import { buildMonitoringReadModel as buildCanonicalMonitoringReadModel } from "../../src/domain/monitoring-read-model";
const require = createRequire(import.meta.url);
const { buildMonitoringReadModel: buildSpfxMonitoringReadModel } =
  require("../../spfx/src/sbs-domain/monitoring-read-model.bundle.js") as {
    buildMonitoringReadModel: typeof buildCanonicalMonitoringReadModel;
  };
const { monitoringQueryForVersion, MONITORING_LINK_SLICE_A_RECORDS } =
  require("../../spfx/src/shell/monitoring/monitoring-fixture-data.ts") as {
    monitoringQueryForVersion: (
      planVersion: number,
    ) => Parameters<typeof buildCanonicalMonitoringReadModel>[0];
    MONITORING_LINK_SLICE_A_RECORDS: Parameters<typeof buildCanonicalMonitoringReadModel>[1];
  };

describe("MONITORING-LINK-SLICE-A contract", () => {
  it("keeps the SPFx bundle projection equivalent to the canonical domain projection", () => {
    const query = monitoringQueryForVersion(2);
    const canonical = buildCanonicalMonitoringReadModel(query, MONITORING_LINK_SLICE_A_RECORDS);
    const spfx = buildSpfxMonitoringReadModel(query, MONITORING_LINK_SLICE_A_RECORDS);

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
