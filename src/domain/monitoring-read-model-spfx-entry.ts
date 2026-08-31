/**
 * Narrow SPFx read-model bridge entry.
 *
 * Canonical implementation remains:
 * - src/domain/monitoring-read-model.ts
 *
 * This module re-exports only the monitoring projection/read-model surface
 * consumed by MonitoringView, SupportPlan, and the synthetic SPFx fixture.
 * It has no write / persistence / review judgment / plan mutation authority.
 */
export type { ProcedureRecord } from "./procedure-record";
export {
  buildMonitoringReadModel,
  type MonitoringBuildResult,
  type MonitoringQuery,
  type MonitoringReadModel,
  type MonitoringRecordItem,
} from "./monitoring-read-model";
