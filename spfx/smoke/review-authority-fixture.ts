/**
 * TEST / SMOKE-only review authority fixture.
 *
 * This is explicit synthetic authority for rendered regression smoke suites;
 * it is not a production person-registry provider.
 */
import type {
  MonitoringQuery,
  MonitoringReadModel,
  ReviewPresentationContext,
} from "../src/sbs-domain/monitoring-read-model.bundle";
import type { ReverseLegacyResolution } from "../src/sbs-domain/person-registry-reference.bundle";
import {
  buildMonitoringReviewInput,
  type MonitoringReviewInputResult,
} from "../src/shell/monitoring/monitoring-review-input";

export const SYNTHETIC_REVIEW_AUTHORITY: ReverseLegacyResolution = {
  status: "FOUND",
  MappingKey: {
    SourceSystem: "synthetic-smoke",
    OrganizationId: "synthetic-org-001",
    SourceScope: "synthetic-monitoring-smoke",
    LegacyKeyType: "UserId",
    LegacyKeyValue: "user-a",
  },
};

export function monitoringQueryForReviewAuthority(model: MonitoringReadModel): MonitoringQuery {
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

export function reviewPresentationContextForReviewAuthority(
  model: MonitoringReadModel,
): ReviewPresentationContext {
  return monitoringQueryForReviewAuthority(model);
}

export function monitoringReviewInputForSmoke(
  model: MonitoringReadModel,
): MonitoringReviewInputResult {
  return buildMonitoringReviewInput(
    SYNTHETIC_REVIEW_AUTHORITY,
    monitoringQueryForReviewAuthority(model),
    model,
  );
}
