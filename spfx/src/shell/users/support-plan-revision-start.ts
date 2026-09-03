import {
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
  startSupportPlanRevision,
  type RevisionIntent,
  type SupportPlanRevisionDraftCandidate,
  type SupportPlanVersion,
  type StartSupportPlanRevisionResult,
} from "../../sbs-domain/support-plan-revision.bundle";
import { humanReviewResultForSyntheticVersion } from "../monitoring/human-review-fixture";
import {
  assembleSyntheticCapturedReview,
  type SyntheticCapturedReview,
} from "../monitoring/review-outcome-capture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import {
  SBS_MGMT_LOOP_B_CURRENT_PLAN,
  SBS_MGMT_LOOP_B_EXISTING_VERSIONS,
  SBS_MGMT_LOOP_B_REVISION_FIXTURE,
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

export type BeforeApplyStaffTransitionArrival = Readonly<{
  session: SupportPlanRevisionSession;
  capturedReview: SyntheticCapturedReview;
}>;

/**
 * Lands Actual Staff Plan-Transition Check on Definition Before-Apply:
 * v3 applied + v4 Draft. Session-only. Does not auto-Apply.
 */
export function createBeforeApplyStaffTransitionArrival(): BeforeApplyStaffTransitionArrival | null {
  const materials = humanReviewResultForSyntheticVersion(
    SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
  );
  if (materials.status !== "RESOLVED") {
    return null;
  }
  const captured = assembleSyntheticCapturedReview(
    materials.value,
    "CHANGE_REQUIRED",
    "活動切替前の予告方法を見直す必要がある",
    "",
    SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
  );
  if (captured.status !== "CAPTURED") {
    return null;
  }
  const started = startSyntheticPlanningPcRevision({
    presentation: DEMO_UX_SUPPORT_PLAN_FIXTURE,
    capturedReview: captured.captured,
    session: EMPTY_SUPPORT_PLAN_REVISION_SESSION,
    actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
    actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
  });
  if (started.status !== "STARTED" && started.status !== "ALREADY_STARTED") {
    return null;
  }
  const knownVersions = EMPTY_SUPPORT_PLAN_REVISION_SESSION.existingVersions.some(
    (version) => version.version === started.draft.candidate.version,
  )
    ? EMPTY_SUPPORT_PLAN_REVISION_SESSION.existingVersions
    : [...EMPTY_SUPPORT_PLAN_REVISION_SESSION.existingVersions, started.draft.candidate];
  return {
    capturedReview: captured.captured,
    session: {
      intents: [started.intent],
      drafts: [started.draft],
      existingVersions: knownVersions,
    },
  };
}
