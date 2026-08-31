import {
  buildMonitoringReadModel,
  type MonitoringBuildResult,
} from "../../sbs-domain/monitoring-read-model.bundle";
import {
  MONITORING_LINK_SLICE_A_RECORDS,
  monitoringQueryForVersion,
} from "./monitoring-fixture-data";

export {
  MONITORING_LINK_SLICE_A,
  MONITORING_LINK_SLICE_A_RECORDS,
  monitoringQueryForVersion,
} from "./monitoring-fixture-data";

export function buildDemoMonitoringForVersion(planVersion: number): MonitoringBuildResult {
  return buildMonitoringReadModel(
    monitoringQueryForVersion(planVersion),
    MONITORING_LINK_SLICE_A_RECORDS,
  );
}
