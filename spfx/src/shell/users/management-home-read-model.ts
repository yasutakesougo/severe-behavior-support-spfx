import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewDecisionReason } from "../../sbs-domain/monitoring-period-review-decision-reason.bundle";
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type {
  ActiveSupportPlan,
  ActivationReceipt,
} from "../../sbs-domain/support-plan-activation.bundle";
import type {
  RevisionIntent,
  SupportPlanRevisionDraftCandidate,
} from "../../sbs-domain/support-plan-revision.bundle";

export type ManagementHomeSource<T> =
  | Readonly<{ status: "RESOLVED"; value: T | null }>
  | Readonly<{ status: "UNAVAILABLE"; reason: string }>;

export type ManagementHomeReviewSnapshot = Readonly<{
  outcome: MonitoringPeriodReviewOutcome;
  decisionReason: MonitoringPeriodReviewDecisionReason | null;
}>;

export type ManagementHomeReviewDue = Readonly<{
  label: string;
}>;

export type ManagementHomeInput = Readonly<{
  personLabel: string;
  currentPlan: ActiveSupportPlan;
  monitoring: ManagementHomeSource<MonitoringReadModel>;
  review: ManagementHomeSource<ManagementHomeReviewSnapshot>;
  revisionIntent: ManagementHomeSource<RevisionIntent>;
  draft: ManagementHomeSource<SupportPlanRevisionDraftCandidate>;
  activationReceipt: ManagementHomeSource<ActivationReceipt>;
  reviewDue: ManagementHomeSource<ManagementHomeReviewDue>;
}>;

export type ManagementHomeSection<T> =
  | Readonly<{ status: "RESOLVED"; value: T }>
  | Readonly<{ status: "CONFIRMED_NONE" }>
  | Readonly<{ status: "UNAVAILABLE"; reason: string }>;

export type ManagementHomeNextAction =
  | Readonly<{ status: "RESOLVED"; label: string }>
  | Readonly<{ status: "UNAVAILABLE"; label: string }>;

export type ManagementHomeReadModel = Readonly<{
  status: "RESOLVED" | "PARTIAL";
  personLabel: string;
  planId: string;
  currentVersion: number;
  monitoring: ManagementHomeSection<MonitoringReadModel>;
  review: ManagementHomeSection<ManagementHomeReviewSnapshot>;
  revisionIntent: ManagementHomeSection<RevisionIntent>;
  draft: ManagementHomeSection<SupportPlanRevisionDraftCandidate>;
  activationReceipt: ManagementHomeSection<ActivationReceipt>;
  reviewDue: ManagementHomeSection<ManagementHomeReviewDue>;
  nextAction: ManagementHomeNextAction;
}>;

function sectionFromSource<T>(
  source: ManagementHomeSource<T>,
): ManagementHomeSection<T> {
  if (source.status === "UNAVAILABLE") {
    return { status: "UNAVAILABLE", reason: source.reason };
  }
  if (source.value === null) {
    return { status: "CONFIRMED_NONE" };
  }
  return { status: "RESOLVED", value: source.value };
}

function unavailable(
  reason: string,
): Readonly<{ status: "UNAVAILABLE"; reason: string }> {
  return { status: "UNAVAILABLE", reason };
}

function samePlanIdentity(
  plan: ActiveSupportPlan,
  candidate: Readonly<{
    OrganizationId: string;
    SiteId: string;
    UserId: string;
    planId: string;
  }>,
): boolean {
  return (
    plan.OrganizationId === candidate.OrganizationId &&
    plan.SiteId === candidate.SiteId &&
    plan.UserId === candidate.UserId &&
    plan.PlanId === candidate.planId
  );
}

function reviewMatchesMonitoring(
  review: ManagementHomeReviewSnapshot,
  monitoring: MonitoringReadModel,
): boolean {
  const outcome = review.outcome;
  return (
    outcome.OrganizationId === monitoring.OrganizationId &&
    outcome.SiteId === monitoring.SiteId &&
    outcome.UserId === monitoring.UserId &&
    outcome.planId === monitoring.planId &&
    outcome.planVersion === monitoring.planVersion &&
    outcome.periodStart === monitoring.periodStart &&
    outcome.periodEnd === monitoring.periodEnd
  );
}

function hasUnavailable(
  sections: readonly ManagementHomeSection<unknown>[],
): boolean {
  return sections.some((section) => section.status === "UNAVAILABLE");
}

function deriveNextAction(
  plan: ActiveSupportPlan,
  review: ManagementHomeSection<ManagementHomeReviewSnapshot>,
  revisionIntent: ManagementHomeSection<RevisionIntent>,
  draft: ManagementHomeSection<SupportPlanRevisionDraftCandidate>,
  sourceUnavailable: boolean,
): ManagementHomeNextAction {
  if (sourceUnavailable) {
    return {
      status: "UNAVAILABLE",
      label: "情報を確認できないため、次の行動は表示しません。",
    };
  }

  if (draft.status === "RESOLVED") {
    if (draft.value.candidate.version === plan.currentVersion + 1) {
      return {
        status: "RESOLVED",
        label: "次版はまだ未適用です。支援計画画面で内容を確認してください。",
      };
    }
    if (draft.value.candidate.version === plan.currentVersion) {
      return { status: "RESOLVED", label: "新しい版が現在適用中です。" };
    }
  }

  if (review.status === "CONFIRMED_NONE") {
    return { status: "RESOLVED", label: "見直し状況を確認してください。" };
  }

  if (review.status === "RESOLVED") {
    if (review.value.outcome.decision === "NO_CHANGE") {
      return {
        status: "RESOLVED",
        label: "次回見直し時期を確認してください。",
      };
    }
    if (revisionIntent.status === "CONFIRMED_NONE") {
      return {
        status: "RESOLVED",
        label: "変更作業開始の状態を確認してください。",
      };
    }
    if (
      revisionIntent.status === "RESOLVED" &&
      revisionIntent.value.status === "OPEN"
    ) {
      return {
        status: "RESOLVED",
        label: "変更作業の開始状態を確認してください。",
      };
    }
  }

  return {
    status: "RESOLVED",
    label: "現在の支援計画と見直し状況を確認してください。",
  };
}

/**
 * #554 SBS-MGMT-HOME-C presentation composer.
 * Inputs are existing read-only snapshots. This function creates no new business authority,
 * persistence, workflow state, recommendation, or LIVE WRITE behavior.
 */
export function buildManagementHomeReadModel(
  input: ManagementHomeInput,
): ManagementHomeReadModel {
  const { currentPlan } = input;

  let monitoring = sectionFromSource(input.monitoring);
  if (
    monitoring.status === "RESOLVED" &&
    !samePlanIdentity(currentPlan, monitoring.value)
  ) {
    monitoring = unavailable("MONITORING_IDENTITY_MISMATCH");
  }

  let review = sectionFromSource(input.review);
  if (review.status === "RESOLVED") {
    const { outcome, decisionReason } = review.value;
    if (!samePlanIdentity(currentPlan, outcome)) {
      review = unavailable("REVIEW_IDENTITY_MISMATCH");
    } else if (decisionReason && decisionReason.OutcomeId !== outcome.OutcomeId) {
      review = unavailable("REVIEW_REASON_MISMATCH");
    } else if (
      outcome.decision === "CHANGE_REQUIRED" &&
      decisionReason === null
    ) {
      review = unavailable("REVIEW_REASON_REQUIRED");
    } else if (
      monitoring.status === "RESOLVED" &&
      !reviewMatchesMonitoring(review.value, monitoring.value)
    ) {
      review = unavailable("REVIEW_MONITORING_MISMATCH");
    }
  }

  let revisionIntent = sectionFromSource(input.revisionIntent);
  if (revisionIntent.status === "RESOLVED") {
    const intent = revisionIntent.value;
    if (!samePlanIdentity(currentPlan, intent)) {
      revisionIntent = unavailable("REVISION_IDENTITY_MISMATCH");
    } else if (review.status === "RESOLVED") {
      if (
        intent.sourcePlanVersion !== review.value.outcome.planVersion ||
        intent.sourceReviewOutcomeId !== review.value.outcome.OutcomeId ||
        review.value.outcome.decision !== "CHANGE_REQUIRED"
      ) {
        revisionIntent = unavailable("REVISION_REVIEW_BINDING_MISMATCH");
      }
    } else if (review.status === "CONFIRMED_NONE") {
      revisionIntent = unavailable("REVISION_WITHOUT_REVIEW");
    } else {
      revisionIntent = unavailable("REVIEW_SOURCE_UNAVAILABLE");
    }
  }

  let draft = sectionFromSource(input.draft);
  if (draft.status === "RESOLVED") {
    const candidate = draft.value.candidate;
    const binding = draft.value.reviewBinding;
    if (
      !samePlanIdentity(currentPlan, candidate) ||
      !samePlanIdentity(currentPlan, binding)
    ) {
      draft = unavailable("DRAFT_IDENTITY_MISMATCH");
    } else if (
      binding.planVersion !== candidate.version ||
      (candidate.version !== currentPlan.currentVersion &&
        candidate.version !== currentPlan.currentVersion + 1)
    ) {
      draft = unavailable("DRAFT_VERSION_MISMATCH");
    } else if (revisionIntent.status !== "RESOLVED") {
      draft = unavailable("DRAFT_INTENT_UNAVAILABLE");
    } else if (
      revisionIntent.value.status !== "CONSUMED" ||
      draft.value.RevisionIntentId !== revisionIntent.value.RevisionIntentId
    ) {
      draft = unavailable("DRAFT_INTENT_BINDING_MISMATCH");
    } else if (review.status !== "RESOLVED") {
      draft = unavailable("DRAFT_REVIEW_UNAVAILABLE");
    } else if (
      binding.reviewedPlanVersion !== review.value.outcome.planVersion ||
      binding.sourceOutcomeId !== review.value.outcome.OutcomeId
    ) {
      draft = unavailable("DRAFT_REVIEW_BINDING_MISMATCH");
    }
  } else if (
    draft.status === "CONFIRMED_NONE" &&
    revisionIntent.status === "RESOLVED" &&
    revisionIntent.value.status === "CONSUMED"
  ) {
    draft = unavailable("CONSUMED_INTENT_WITHOUT_DRAFT");
  }

  let activationReceipt = sectionFromSource(input.activationReceipt);
  if (activationReceipt.status === "RESOLVED") {
    const receipt = activationReceipt.value;
    if (
      receipt.planId !== currentPlan.PlanId ||
      receipt.activatedVersion !== currentPlan.currentVersion ||
      receipt.activatedVersion !== receipt.fromVersion + 1
    ) {
      activationReceipt = unavailable("ACTIVATION_RECEIPT_MISMATCH");
    } else if (
      draft.status === "RESOLVED" &&
      draft.value.candidate.version === currentPlan.currentVersion &&
      receipt.RevisionIntentId !== draft.value.RevisionIntentId
    ) {
      activationReceipt = unavailable("ACTIVATION_DRAFT_MISMATCH");
    }
  }

  let reviewDue = sectionFromSource(input.reviewDue);
  if (
    reviewDue.status === "RESOLVED" &&
    reviewDue.value.label.trim().length === 0
  ) {
    reviewDue = unavailable("REVIEW_DUE_LABEL_INVALID");
  }

  const sourceUnavailable = hasUnavailable([
    monitoring,
    review,
    revisionIntent,
    draft,
    activationReceipt,
    reviewDue,
  ]);

  return {
    status: sourceUnavailable ? "PARTIAL" : "RESOLVED",
    personLabel: input.personLabel,
    planId: currentPlan.PlanId,
    currentVersion: currentPlan.currentVersion,
    monitoring,
    review,
    revisionIntent,
    draft,
    activationReceipt,
    reviewDue,
    nextAction: deriveNextAction(
      currentPlan,
      review,
      revisionIntent,
      draft,
      sourceUnavailable,
    ),
  };
}
