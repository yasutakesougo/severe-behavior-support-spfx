/**
 * Narrow SPFx read-model bridge entry.
 *
 * Canonical implementation remains:
 * - src/domain/monitoring-read-model.ts
 * - src/domain/monitoring-review-materials.ts
 *
 * This module re-exports only the monitoring projection/read-model and
 * deterministic human-review-materials surfaces consumed by MonitoringView,
 * SupportPlan, HumanReviewView, and synthetic SPFx fixtures.
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
export {
  buildHumanReviewMaterials,
  type HumanReviewMaterialRecord,
  type HumanReviewMaterials,
  type HumanReviewMaterialsBuildResult,
  type ReviewPresentationContext,
} from "./monitoring-review-materials";
