import {
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
  startSupportPlanRevision,
  type RevisionIntent,
  type SupportPlanRevisionDraftCandidate,
  type SupportPlanVersion,
  type StartSupportPlanRevisionResult,
} from "../../sbs-domain/support-plan-revision.bundle";
import type { SyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import {
  SBS_MGMT_LOOP_B_CURRENT_PLAN,
  SBS_MGMT_LOOP_B_EXISTING_VERSIONS,
  SBS_MGMT_LOOP_B_SOURCE_VERSION,
  assertOutcomeMatchesRevisionFixture,
  assertPresentationMatchesRevisionFixture,
} from "./support-plan-revision-fixture";
import type { ShellSupportPlanPresentation } from "./support-plan-types";

export type SupportPlanRevisionSession = Readonly<{
  intents: readonly RevisionIntent[];
  drafts: readonly SupportPlanRevisionDraftCandidate[];
  /** Canonical + session-known versions for N+1 conflict checks. */
  existingVersions: readonly SupportPlanVersion[];
}>;

export const EMPTY_SUPPORT_PLAN_REVISION_SESSION: SupportPlanRevisionSession = {
  intents: [],
  drafts: [],
  existingVersions: SBS_MGMT_LOOP_B_EXISTING_VERSIONS,
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

  const sourceDecisionReason = capturedReview.decisionReason ?? {
    OutcomeId: outcome.OutcomeId,
    reason: "",
  };

  // Provenance comes from canonical fixture — not reconstructed from presentation.
  return startSupportPlanRevision({
    currentPlan: SBS_MGMT_LOOP_B_CURRENT_PLAN,
    sourceVersion: SBS_MGMT_LOOP_B_SOURCE_VERSION,
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
    existingVersions: session.existingVersions,
    existingIntents: session.intents,
    existingDrafts: session.drafts,
    actor,
    actionAt,
  });
}
