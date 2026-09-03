/**
 * Canonical SBS-MGMT-LOOP-B / B2 revision orchestration fixture.
 * Identity must match DEMO_UX_SUPPORT_PLAN_FIXTURE + monitoring-fixture-data.
 * Session-only. LIVE WRITE = false.
 */
import type { MonitoringPeriodReviewDecisionReason } from "../../sbs-domain/monitoring-period-review-decision-reason.bundle";
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { SupportPlanVersion } from "../../sbs-domain/support-plan-revision.bundle";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import type { ShellSupportPlanPresentation } from "./support-plan-types";

export const SBS_MGMT_LOOP_B_REVISION_FIXTURE = {
  id: "SBS-MGMT-LOOP-B-REVISION",
  presentationOnly: true as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  sourceVersionMutationAuthorized: false as const,
  OrganizationId: "synthetic-org-001",
  SiteId: "SITE-ISG",
  UserId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
  planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
  planVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  actor: "planning-pc-synthetic-staff",
  actionAt: "2026-09-03T12:00:00+09:00",
  versionCreatedBy: "synthetic-planning-pc",
  versionCreatedAt: "2026-07-01T09:00:00+09:00",
} as const;

export function assertPresentationMatchesRevisionFixture(
  presentation: ShellSupportPlanPresentation,
): boolean {
  return (
    presentation.userId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId &&
    presentation.planId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId &&
    presentation.currentVersion === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion
  );
}

export function assertOutcomeMatchesRevisionFixture(
  outcome: MonitoringPeriodReviewOutcome,
): boolean {
  return (
    outcome.OrganizationId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.OrganizationId &&
    outcome.SiteId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.SiteId &&
    outcome.UserId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId &&
    outcome.planId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId &&
    outcome.planVersion === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion
  );
}

export function buildCanonicalRevisionSourceVersion(
  presentation: ShellSupportPlanPresentation,
  outcome: MonitoringPeriodReviewOutcome,
): SupportPlanVersion | undefined {
  if (
    !assertPresentationMatchesRevisionFixture(presentation) ||
    !assertOutcomeMatchesRevisionFixture(outcome)
  ) {
    return undefined;
  }
  const currentVersionEntry = presentation.versions.find(
    (entry) => entry.isCurrent && entry.version === presentation.currentVersion,
  );
  if (!currentVersionEntry) {
    return undefined;
  }
  return {
    planId: outcome.planId,
    OrganizationId: outcome.OrganizationId,
    SiteId: outcome.SiteId,
    UserId: outcome.UserId,
    version: outcome.planVersion,
    goals: presentation.goals.map((goal) => goal.body),
    supportMethods: [...currentVersionEntry.supportMethods],
    precautions: [...currentVersionEntry.precautions],
    reviewCriteria: [presentation.reviewStatus.reviewDueLabel],
    versionCreatedBy: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedBy,
    versionCreatedAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedAt,
  };
}

export function buildCanonicalRevisionDecisionReason(
  outcome: MonitoringPeriodReviewOutcome,
  reason: string,
): MonitoringPeriodReviewDecisionReason {
  return {
    OutcomeId: outcome.OutcomeId,
    reason,
  };
}
