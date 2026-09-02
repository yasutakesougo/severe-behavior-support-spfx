import type {
  MonitoringPeriodReviewDecisionReason,
} from "./monitoring-period-review-decision-reason";
import { validateMonitoringPeriodReviewDecisionReason } from "./monitoring-period-review-decision-reason";
import type { MonitoringPeriodReviewOutcome } from "./monitoring-period-review-outcome";
import { validateMonitoringPeriodReviewOutcome } from "./monitoring-period-review-outcome";
import { sha256Hex } from "./sha256";
import type { SupportPlan, SupportPlanVersion } from "./support-plan";
import { validateSupportPlan, validateSupportPlanVersion } from "./support-plan";
import type {
  SupportPlanVersionMonitoringPeriodReviewBinding,
} from "./support-plan-version-monitoring-period-review-binding";
import { validateSupportPlanVersionMonitoringPeriodReviewBinding } from "./support-plan-version-monitoring-period-review-binding";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

export const SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED = false as const;
export const REVISION_INTENT_STATUSES = ["OPEN", "CONSUMED"] as const;
export type RevisionIntentStatus = (typeof REVISION_INTENT_STATUSES)[number];

export type RevisionIntent = Readonly<{
  RevisionIntentId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  sourcePlanVersion: number;
  sourceReviewOutcomeId: string;
  createdAt: string;
  createdBy: string;
  status: RevisionIntentStatus;
}>;

export type SupportPlanRevisionDraftCandidate = Readonly<{
  RevisionIntentId: string;
  candidate: SupportPlanVersion;
  reviewBinding: SupportPlanVersionMonitoringPeriodReviewBinding;
}>;

export type CreateRevisionIntentResult =
  | Readonly<{ status: "CREATED"; intent: RevisionIntent }>
  | Readonly<{ status: "INVALID"; reason: string }>;

export type ConsumeRevisionIntentToDraftResult =
  | Readonly<{
      status: "CREATED";
      intent: RevisionIntent;
      draft: SupportPlanRevisionDraftCandidate;
    }>
  | Readonly<{ status: "HOLD"; intent: RevisionIntent; reason: string }>
  | Readonly<{ status: "INVALID"; reason: string }>;

export type StartSupportPlanRevisionResult =
  | Readonly<{
      status: "STARTED";
      intent: RevisionIntent;
      draft: SupportPlanRevisionDraftCandidate;
    }>
  | Readonly<{
      status: "ALREADY_STARTED";
      intent: RevisionIntent;
      draft: SupportPlanRevisionDraftCandidate;
    }>
  | Readonly<{ status: "HOLD"; reason: string }>
  | Readonly<{ status: "INVALID"; reason: string }>;

const REVISION_INTENT_ID_SEPARATOR = "\u001f";
const REVISION_INTENT_ID_NAMESPACE = "support-plan.revision-intent-id.v1";

function samePlanContext(
  plan: Pick<SupportPlan, "PlanId" | "OrganizationId" | "SiteId" | "UserId">,
  version: Pick<SupportPlanVersion, "planId" | "OrganizationId" | "SiteId" | "UserId">,
): boolean {
  return (
    plan.PlanId === version.planId &&
    plan.OrganizationId === version.OrganizationId &&
    plan.SiteId === version.SiteId &&
    plan.UserId === version.UserId
  );
}

function outcomeMatchesSource(
  outcome: MonitoringPeriodReviewOutcome,
  sourceVersion: SupportPlanVersion,
): boolean {
  return (
    outcome.OrganizationId === sourceVersion.OrganizationId &&
    outcome.SiteId === sourceVersion.SiteId &&
    outcome.UserId === sourceVersion.UserId &&
    outcome.planId === sourceVersion.planId &&
    outcome.planVersion === sourceVersion.version
  );
}

export function mintRevisionIntentId(
  input: Pick<
    RevisionIntent,
    | "OrganizationId"
    | "SiteId"
    | "UserId"
    | "planId"
    | "sourcePlanVersion"
    | "sourceReviewOutcomeId"
  >,
): string {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.sourcePlanVersion),
    input.sourceReviewOutcomeId,
  ].join(REVISION_INTENT_ID_SEPARATOR);
  return sha256Hex(
    `${REVISION_INTENT_ID_NAMESPACE}${REVISION_INTENT_ID_SEPARATOR}${material}`,
  );
}

export function validateRevisionIntent(value: unknown): value is RevisionIntent {
  if (!isRecord(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.RevisionIntentId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isNonEmptyString(value.planId) ||
    typeof value.sourcePlanVersion !== "number" ||
    !Number.isInteger(value.sourcePlanVersion) ||
    value.sourcePlanVersion < 1 ||
    !isNonEmptyString(value.sourceReviewOutcomeId) ||
    !isValidIsoDateTime(value.createdAt) ||
    !isNonEmptyString(value.createdBy) ||
    (value.status !== "OPEN" && value.status !== "CONSUMED")
  ) {
    return false;
  }
  return (
    value.RevisionIntentId ===
    mintRevisionIntentId({
      OrganizationId: value.OrganizationId,
      SiteId: value.SiteId,
      UserId: value.UserId,
      planId: value.planId,
      sourcePlanVersion: value.sourcePlanVersion,
      sourceReviewOutcomeId: value.sourceReviewOutcomeId,
    })
  );
}

export function validateSupportPlanRevisionDraftCandidate(
  value: unknown,
): value is SupportPlanRevisionDraftCandidate {
  if (!isRecord(value) || !isNonEmptyString(value.RevisionIntentId)) {
    return false;
  }
  return (
    validateSupportPlanVersion(value.candidate) &&
    validateSupportPlanVersionMonitoringPeriodReviewBinding(value.reviewBinding)
  );
}

export function revisionDraftMatchesIntent(
  draft: SupportPlanRevisionDraftCandidate,
  intent: RevisionIntent,
): boolean {
  if (!validateSupportPlanRevisionDraftCandidate(draft) || !validateRevisionIntent(intent)) {
    return false;
  }
  const { candidate, reviewBinding } = draft;
  return (
    draft.RevisionIntentId === intent.RevisionIntentId &&
    candidate.OrganizationId === intent.OrganizationId &&
    candidate.SiteId === intent.SiteId &&
    candidate.UserId === intent.UserId &&
    candidate.planId === intent.planId &&
    candidate.version === intent.sourcePlanVersion + 1 &&
    reviewBinding.OrganizationId === intent.OrganizationId &&
    reviewBinding.SiteId === intent.SiteId &&
    reviewBinding.UserId === intent.UserId &&
    reviewBinding.planId === intent.planId &&
    reviewBinding.planVersion === candidate.version &&
    reviewBinding.reviewedPlanVersion === intent.sourcePlanVersion &&
    reviewBinding.sourceOutcomeId === intent.sourceReviewOutcomeId
  );
}

export function createRevisionIntent(
  input: Readonly<{
    currentPlan: SupportPlan;
    sourceVersion: SupportPlanVersion;
    sourceOutcome: MonitoringPeriodReviewOutcome;
    sourceDecisionReason: MonitoringPeriodReviewDecisionReason;
    createdBy: string;
    createdAt: string;
  }>,
): CreateRevisionIntentResult {
  const { currentPlan, sourceVersion, sourceOutcome, sourceDecisionReason } = input;
  if (
    !validateSupportPlan(currentPlan) ||
    !validateSupportPlanVersion(sourceVersion) ||
    !validateMonitoringPeriodReviewOutcome(sourceOutcome) ||
    !validateMonitoringPeriodReviewDecisionReason(sourceDecisionReason) ||
    !isNonEmptyString(input.createdBy) ||
    !isValidIsoDateTime(input.createdAt)
  ) {
    return { status: "INVALID", reason: "MALFORMED_INPUT" };
  }
  if (
    !samePlanContext(currentPlan, sourceVersion) ||
    !outcomeMatchesSource(sourceOutcome, sourceVersion)
  ) {
    return { status: "INVALID", reason: "CONTEXT_MISMATCH" };
  }
  if (currentPlan.currentVersion !== sourceVersion.version) {
    return { status: "INVALID", reason: "STALE_SOURCE_PLAN_VERSION" };
  }
  if (sourceOutcome.decision !== "CHANGE_REQUIRED") {
    return { status: "INVALID", reason: "REVIEW_DOES_NOT_REQUIRE_CHANGE" };
  }
  if (
    sourceDecisionReason.OutcomeId !== sourceOutcome.OutcomeId ||
    sourceDecisionReason.reason.trim().length === 0
  ) {
    return { status: "INVALID", reason: "MISSING_OR_MISMATCHED_DECISION_REASON" };
  }

  const identity = {
    OrganizationId: sourceOutcome.OrganizationId,
    SiteId: sourceOutcome.SiteId,
    UserId: sourceOutcome.UserId,
    planId: sourceOutcome.planId,
    sourcePlanVersion: sourceOutcome.planVersion,
    sourceReviewOutcomeId: sourceOutcome.OutcomeId,
  };
  const intent: RevisionIntent = {
    RevisionIntentId: mintRevisionIntentId(identity),
    ...identity,
    createdAt: input.createdAt,
    createdBy: input.createdBy,
    status: "OPEN",
  };
  return validateRevisionIntent(intent)
    ? { status: "CREATED", intent }
    : { status: "INVALID", reason: "INVALID_REVISION_INTENT" };
}

export function consumeRevisionIntentToDraft(
  input: Readonly<{
    intent: RevisionIntent;
    sourceVersion: SupportPlanVersion;
    sourceOutcome: MonitoringPeriodReviewOutcome;
    existingVersions: readonly SupportPlanVersion[];
    existingDrafts: readonly SupportPlanRevisionDraftCandidate[];
    draftCreatedBy: string;
    draftCreatedAt: string;
  }>,
): ConsumeRevisionIntentToDraftResult {
  const { intent, sourceVersion, sourceOutcome } = input;
  if (
    !validateRevisionIntent(intent) ||
    !validateSupportPlanVersion(sourceVersion) ||
    !validateMonitoringPeriodReviewOutcome(sourceOutcome) ||
    !isNonEmptyString(input.draftCreatedBy) ||
    !isValidIsoDateTime(input.draftCreatedAt)
  ) {
    return { status: "INVALID", reason: "MALFORMED_INPUT" };
  }
  if (intent.status !== "OPEN") {
    return { status: "INVALID", reason: "INTENT_NOT_OPEN" };
  }
  if (
    intent.OrganizationId !== sourceVersion.OrganizationId ||
    intent.SiteId !== sourceVersion.SiteId ||
    intent.UserId !== sourceVersion.UserId ||
    intent.planId !== sourceVersion.planId ||
    intent.sourcePlanVersion !== sourceVersion.version ||
    intent.sourceReviewOutcomeId !== sourceOutcome.OutcomeId ||
    !outcomeMatchesSource(sourceOutcome, sourceVersion) ||
    sourceOutcome.decision !== "CHANGE_REQUIRED"
  ) {
    return { status: "INVALID", reason: "SOURCE_BINDING_MISMATCH" };
  }

  const priorDrafts = input.existingDrafts.filter(
    (draft) =>
      validateSupportPlanRevisionDraftCandidate(draft) &&
      draft.RevisionIntentId === intent.RevisionIntentId,
  );
  if (priorDrafts.length > 0) {
    return { status: "HOLD", intent, reason: "REVISION_ALREADY_STARTED" };
  }

  const targetVersion = intent.sourcePlanVersion + 1;
  const versionConflict = input.existingVersions.some(
    (version) =>
      validateSupportPlanVersion(version) &&
      version.OrganizationId === intent.OrganizationId &&
      version.SiteId === intent.SiteId &&
      version.UserId === intent.UserId &&
      version.planId === intent.planId &&
      version.version === targetVersion,
  );
  if (versionConflict) {
    return { status: "HOLD", intent, reason: "TARGET_VERSION_CONFLICT" };
  }

  const candidate: SupportPlanVersion = {
    planId: sourceVersion.planId,
    OrganizationId: sourceVersion.OrganizationId,
    SiteId: sourceVersion.SiteId,
    UserId: sourceVersion.UserId,
    version: targetVersion,
    goals: [...sourceVersion.goals],
    supportMethods: [...sourceVersion.supportMethods],
    precautions: [...sourceVersion.precautions],
    reviewCriteria: [...sourceVersion.reviewCriteria],
    versionCreatedBy: input.draftCreatedBy,
    versionCreatedAt: input.draftCreatedAt,
  };
  const reviewBinding: SupportPlanVersionMonitoringPeriodReviewBinding = {
    OrganizationId: intent.OrganizationId,
    SiteId: intent.SiteId,
    UserId: intent.UserId,
    planId: intent.planId,
    planVersion: targetVersion,
    reviewedPlanVersion: intent.sourcePlanVersion,
    sourceOutcomeId: intent.sourceReviewOutcomeId,
    boundAt: input.draftCreatedAt,
    boundBy: input.draftCreatedBy,
  };
  const consumedIntent: RevisionIntent = { ...intent, status: "CONSUMED" };
  const draft: SupportPlanRevisionDraftCandidate = {
    RevisionIntentId: intent.RevisionIntentId,
    candidate,
    reviewBinding,
  };

  if (
    !validateSupportPlanVersion(candidate) ||
    !validateSupportPlanVersionMonitoringPeriodReviewBinding(reviewBinding) ||
    !validateRevisionIntent(consumedIntent) ||
    !revisionDraftMatchesIntent(draft, consumedIntent)
  ) {
    return { status: "INVALID", reason: "INVALID_DRAFT_AGGREGATE" };
  }

  return { status: "CREATED", intent: consumedIntent, draft };
}

export function startSupportPlanRevision(
  input: Readonly<{
    currentPlan: SupportPlan;
    sourceVersion: SupportPlanVersion;
    sourceOutcome: MonitoringPeriodReviewOutcome;
    sourceDecisionReason: MonitoringPeriodReviewDecisionReason;
    existingVersions: readonly SupportPlanVersion[];
    existingIntents: readonly RevisionIntent[];
    existingDrafts: readonly SupportPlanRevisionDraftCandidate[];
    actor: string;
    actionAt: string;
  }>,
): StartSupportPlanRevisionResult {
  const created = createRevisionIntent({
    currentPlan: input.currentPlan,
    sourceVersion: input.sourceVersion,
    sourceOutcome: input.sourceOutcome,
    sourceDecisionReason: input.sourceDecisionReason,
    createdBy: input.actor,
    createdAt: input.actionAt,
  });
  if (created.status === "INVALID") {
    return created;
  }

  const sameIdentityIntents = input.existingIntents.filter(
    (intent) =>
      validateRevisionIntent(intent) &&
      intent.RevisionIntentId === created.intent.RevisionIntentId,
  );
  if (sameIdentityIntents.length > 1) {
    return { status: "HOLD", reason: "DUPLICATE_INTENT_STATE" };
  }

  if (sameIdentityIntents.length === 1) {
    const existingIntent = sameIdentityIntents[0];
    const matchingDrafts = input.existingDrafts.filter(
      (draft) => draft.RevisionIntentId === existingIntent.RevisionIntentId,
    );
    if (
      existingIntent.status === "CONSUMED" &&
      matchingDrafts.length === 1 &&
      revisionDraftMatchesIntent(matchingDrafts[0], existingIntent)
    ) {
      return {
        status: "ALREADY_STARTED",
        intent: existingIntent,
        draft: matchingDrafts[0],
      };
    }
    if (existingIntent.status !== "OPEN") {
      return { status: "HOLD", reason: "INCONSISTENT_EXISTING_REVISION_STATE" };
    }
    const consumedExisting = consumeRevisionIntentToDraft({
      intent: existingIntent,
      sourceVersion: input.sourceVersion,
      sourceOutcome: input.sourceOutcome,
      existingVersions: input.existingVersions,
      existingDrafts: input.existingDrafts,
      draftCreatedBy: input.actor,
      draftCreatedAt: input.actionAt,
    });
    if (consumedExisting.status === "CREATED") {
      return {
        status: "STARTED",
        intent: consumedExisting.intent,
        draft: consumedExisting.draft,
      };
    }
    return consumedExisting.status === "HOLD"
      ? { status: "HOLD", reason: consumedExisting.reason }
      : consumedExisting;
  }

  const consumed = consumeRevisionIntentToDraft({
    intent: created.intent,
    sourceVersion: input.sourceVersion,
    sourceOutcome: input.sourceOutcome,
    existingVersions: input.existingVersions,
    existingDrafts: input.existingDrafts,
    draftCreatedBy: input.actor,
    draftCreatedAt: input.actionAt,
  });
  if (consumed.status === "CREATED") {
    return { status: "STARTED", intent: consumed.intent, draft: consumed.draft };
  }
  return consumed.status === "HOLD" ? { status: "HOLD", reason: consumed.reason } : consumed;
}
