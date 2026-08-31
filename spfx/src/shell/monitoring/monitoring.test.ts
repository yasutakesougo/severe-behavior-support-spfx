import {
  buildDemoMonitoringForVersion,
  monitoringQueryForVersion,
  MONITORING_LINK_SLICE_A,
  MONITORING_LINK_SLICE_A_RECORDS,
} from "./monitoring-fixture";
import { buildMonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";

describe("MONITORING-LINK-SLICE-A synthetic monitoring", () => {
  it("projects exactly three target v2 records and keeps deterministic order", () => {
    const result = buildDemoMonitoringForVersion(2);
    expect(result.status).toBe("RESOLVED");
    if (result.status !== "RESOLVED") {
      return;
    }

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
  });

  it("keeps plan version isolation rather than falling back to the current version", () => {
    const v2 = buildDemoMonitoringForVersion(2);
    const v3 = buildDemoMonitoringForVersion(3);
    const v1 = buildDemoMonitoringForVersion(1);

    expect(v2.status).toBe("RESOLVED");
    expect(v3.status).toBe("RESOLVED");
    expect(v1.status).toBe("RESOLVED");

    if (v2.status === "RESOLVED" && v3.status === "RESOLVED" && v1.status === "RESOLVED") {
      expect(v2.value.recordCount).toBe(3);
      expect(v3.value.recordCount).toBe(1);
      expect(v3.value.records[0].RecordId).toBe("synthetic-monitoring-v3-001");
      expect(v1.value.recordCount).toBe(0);
    }
  });

  it("fails closed for malformed input and duplicate RecordId", () => {
    const valid = MONITORING_LINK_SLICE_A_RECORDS[0];

    expect(
      buildMonitoringReadModel(monitoringQueryForVersion(2), [
        ...MONITORING_LINK_SLICE_A_RECORDS,
        { ...valid, RecordId: "" },
      ]),
    ).toEqual({ status: "MALFORMED_INPUT" });

    expect(buildMonitoringReadModel(monitoringQueryForVersion(2), [valid, valid])).toEqual({
      status: "MALFORMED_INPUT",
    });
  });

  it("keeps all mutation and automated-judgment authorities off", () => {
    expect(MONITORING_LINK_SLICE_A.presentationOnly).toBe(true);
    expect(MONITORING_LINK_SLICE_A.humanReviewInputOnly).toBe(true);
    expect(MONITORING_LINK_SLICE_A.automaticEvaluationAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.automaticReviewDecisionAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.planMutationAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.recordMutationAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.sharePointWriteAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.liveTenantIoAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.schemaChangeAuthorized).toBe(false);
    expect(MONITORING_LINK_SLICE_A.deployAuthorized).toBe(false);
  });
});
