import {
  buildHumanReviewMaterials,
  type HumanReviewMaterialsBuildResult,
  type ReviewPresentationContext,
} from "../../sbs-domain/monitoring-read-model.bundle";
import { buildDemoMonitoringForVersion } from "./monitoring-fixture";

function exactContextForResolvedMonitoring(
  result: ReturnType<typeof buildDemoMonitoringForVersion>,
): ReviewPresentationContext | undefined {
  if (result.status !== "RESOLVED") return undefined;

  const model = result.value;
  return {
    OrganizationId: model.OrganizationId,
    SiteId: model.SiteId,
    UserId: model.UserId,
    planId: model.planId,
    planVersion: model.planVersion,
    periodStart: model.periodStart,
    periodEnd: model.periodEnd,
  };
}

export function humanReviewResultForSyntheticVersion(
  planVersion: number,
): HumanReviewMaterialsBuildResult {
  const monitoring = buildDemoMonitoringForVersion(planVersion);
  if (monitoring.status !== "RESOLVED") {
    return buildHumanReviewMaterials(undefined);
  }

  return buildHumanReviewMaterials(monitoring.value, exactContextForResolvedMonitoring(monitoring));
}

const mismatchMonitoring = buildDemoMonitoringForVersion(2);
const mismatchContext = exactContextForResolvedMonitoring(mismatchMonitoring);

export const HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE: HumanReviewMaterialsBuildResult =
  mismatchMonitoring.status === "RESOLVED" && mismatchContext
    ? buildHumanReviewMaterials(mismatchMonitoring.value, {
        ...mismatchContext,
        planId: `${mismatchContext.planId}-mismatch`,
      })
    : buildHumanReviewMaterials(undefined);

export const HUMAN_REVIEW_MALFORMED_FIXTURE: HumanReviewMaterialsBuildResult =
  buildHumanReviewMaterials(undefined);
