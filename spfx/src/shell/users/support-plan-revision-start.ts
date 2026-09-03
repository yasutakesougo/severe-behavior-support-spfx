import {
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
  startSupportPlanRevision,
  type RevisionIntent,
  type SupportPlanRevisionDraftCandidate,
  type StartSupportPlanRevisionResult,
} from "../../sbs-domain/support-plan-revision.bundle";
import type { SyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import {
  SBS_MGMT_LOOP_B_REVISION_FIXTURE,
  assertOutcomeMatchesRevisionFixture,
  assertPresentationMatchesRevisionFixture,
  buildCanonicalRevisionSourceVersion,
} from "./support-plan-revision-fixture";
import type { ShellSupportPlanPresentation } from "./support-plan-types";

export type SupportPlanRevisionSession = Readonly<{
  intents: readonly RevisionIntent[];
  drafts: readonly SupportPlanRevisionDraftCandidate[];
}>;

export const EMPTY_SUPPORT_PLAN_REVISION_SESSION: SupportPlanRevisionSession = {
  intents: [],
  drafts: [],
};

export const SUPPORT_PLAN_REVISION_SESSION_LIVE_WRITE_AUTHORIZED =
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED;

export function startSyntheticPlanningPcRevision(
  input: Readonly<{
    presentation: ShellSupportPlanPresentation;
    capturedReview: SyntheticCapturedReview;
    session: SupportPlanRevisionSession;
    actor: string;
    actionAt: string;
  }>,
): StartSupportPlanRevisionResult {
  const { presentation, capturedReview, session, actor, actionAt } = input;
  const outcome = capturedReview.outcome;

  if (
    !assertPresentationMatchesRevisionFixture(presentation) ||
    !assertOutcomeMatchesRevisionFixture(outcome)
  ) {
    return { status: "INVALID", reason: "CONTEXT_MISMATCH" };
  }

  const sourceVersion = buildCanonicalRevisionSourceVersion(presentation, outcome);
  if (!sourceVersion) {
    return { status: "INVALID", reason: "SOURCE_VERSION_NOT_PRESENT" };
  }

  const sourceDecisionReason = capturedReview.decisionReason ?? {
    OutcomeId: outcome.OutcomeId,
    reason: "",
  };

  return startSupportPlanRevision({
    currentPlan: {
      PlanId: outcome.planId,
      OrganizationId: outcome.OrganizationId,
      SiteId: outcome.SiteId,
      UserId: outcome.UserId,
      currentVersion: outcome.planVersion,
      createdBy: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedBy,
      createdAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedAt,
      version: 1,
      status: "Active",
      submittedBy: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedBy,
      submittedAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedAt,
      approvedBy: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedBy,
      approvedAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedAt,
      effectiveFrom: SBS_MGMT_LOOP_B_REVISION_FIXTURE.versionCreatedAt,
    },
    sourceVersion,
    sourceOutcome: {
      OutcomeId: outcome.OutcomeId,
      OrganizationId: outcome.OrganizationId,
      SiteId: outcome.SiteId,
      UserId: outcome.UserId,
      planId: outcome.planId,
      planVersion: outcome.planVersion,
      periodStart: outcome.periodStart,
      periodEnd: outcome.periodEnd,
      sourceRecordIds: outcome.sourceRecordIds,
      decision: outcome.decision,
      reviewedAt: outcome.reviewedAt,
      reviewedBy: outcome.reviewedBy,
    },
    sourceDecisionReason,
    existingVersions: [sourceVersion],
    existingIntents: session.intents,
    existingDrafts: session.drafts,
    actor,
    actionAt,
  });
}
