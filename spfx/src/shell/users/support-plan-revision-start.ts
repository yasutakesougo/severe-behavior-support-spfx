import {
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
  startSupportPlanRevision,
  type RevisionIntent,
  type SupportPlanRevisionDraftCandidate,
  type SupportPlanVersion,
  type StartSupportPlanRevisionResult,
} from "../../sbs-domain/support-plan-revision.bundle";
import type { SyntheticCapturedReview } from "../monitoring/review-outcome-capture";
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

export function startSyntheticPlanningPcRevision(input: Readonly<{
  presentation: ShellSupportPlanPresentation;
  capturedReview: SyntheticCapturedReview;
  session: SupportPlanRevisionSession;
  actor: string;
  actionAt: string;
}>): StartSupportPlanRevisionResult {
  const { presentation, capturedReview, session, actor, actionAt } = input;
  const currentVersionEntry = presentation.versions.find(
    (entry) => entry.isCurrent && entry.version === presentation.currentVersion,
  );
  if (!currentVersionEntry) {
    return { status: "INVALID", reason: "SOURCE_VERSION_NOT_PRESENT" };
  }

  const sourceVersion: SupportPlanVersion = {
    planId: presentation.planId,
    OrganizationId: capturedReview.outcome.OrganizationId,
    SiteId: capturedReview.outcome.SiteId,
    UserId: presentation.userId,
    version: presentation.currentVersion,
    goals: presentation.goals.map((goal) => goal.body),
    supportMethods: [...currentVersionEntry.supportMethods],
    precautions: [...currentVersionEntry.precautions],
    reviewCriteria: [presentation.reviewStatus.reviewDueLabel],
    versionCreatedBy: "synthetic-planning-pc",
    versionCreatedAt: "2026-07-01T09:00:00+09:00",
  };

  return startSupportPlanRevision({
    currentPlan: {
      PlanId: presentation.planId,
      OrganizationId: capturedReview.outcome.OrganizationId,
      SiteId: capturedReview.outcome.SiteId,
      UserId: presentation.userId,
      currentVersion: presentation.currentVersion,
      createdBy: "synthetic-planning-pc",
      createdAt: "2026-07-01T09:00:00+09:00",
      version: 1,
      status: "Active",
      submittedBy: "synthetic-planning-pc",
      submittedAt: "2026-07-01T09:00:00+09:00",
      approvedBy: "synthetic-planning-pc",
      approvedAt: "2026-07-01T09:00:00+09:00",
      effectiveFrom: "2026-07-01T09:00:00+09:00",
    },
    sourceVersion,
    sourceOutcome: capturedReview.outcome,
    sourceDecisionReason: capturedReview.decisionReason ?? {
      OutcomeId: capturedReview.outcome.OutcomeId,
      reason: "",
    },
    existingVersions: [sourceVersion],
    existingIntents: session.intents,
    existingDrafts: session.drafts,
    actor,
    actionAt,
  });
}
