import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type {
  ActivationReceipt,
  ActiveSupportPlan,
  SupportPlanRevisionDraftCandidate,
} from "../../sbs-domain/support-plan-activation.bundle";
import type { RevisionIntent } from "../../sbs-domain/support-plan-revision.bundle";

export type ManagementHomeDecisionReason = Readonly<{
  OutcomeId: string;
  reason: string;
}>;

export type SourceSlot<T> =
  | Readonly<{ status: "RESOLVED"; value: T | null }>
  | Readonly<{ status: "UNAVAILABLE"; reason: string }>;

export type ManagementHomeInput = Readonly<{
  personLabel: string;
  plan: ActiveSupportPlan;
  monitoring: SourceSlot<MonitoringReadModel>;
  reviewOutcome: SourceSlot<MonitoringPeriodReviewOutcome>;
  decisionReason: SourceSlot<ManagementHomeDecisionReason>;
  revisionIntent: SourceSlot<RevisionIntent>;
  draft: SourceSlot<SupportPlanRevisionDraftCandidate>;
  activationReceipt: SourceSlot<ActivationReceipt>;
  reviewDueLabel: SourceSlot<string>;
}>;

export type ManagementHomePresentation = Readonly<{
  personLabel: string;
  currentPlanLabel: string;
  monitoringLabel: string;
  reviewLabel: string;
  revisionLabel: string;
  nextActionLabel: string;
  reviewDueLabel: string;
  provenanceLabel: string | null;
  unavailableSections: readonly string[];
}>;

function samePlanIdentity(
  plan: ActiveSupportPlan,
  value: Readonly<{
    OrganizationId: string;
    SiteId: string;
    UserId: string;
    planId: string;
  }>,
): boolean {
  return (
    plan.OrganizationId === value.OrganizationId &&
    plan.SiteId === value.SiteId &&
    plan.UserId === value.UserId &&
    plan.PlanId === value.planId
  );
}

function unavailable<T>(
  slot: SourceSlot<T>,
): slot is Readonly<{ status: "UNAVAILABLE"; reason: string }> {
  return slot.status === "UNAVAILABLE";
}

function reviewMatchesMonitoring(
  monitoring: MonitoringReadModel,
  review: MonitoringPeriodReviewOutcome,
): boolean {
  if (monitoring.periodStart !== review.periodStart || monitoring.periodEnd !== review.periodEnd) {
    return false;
  }
  const recordIds = new Set(monitoring.records.map((record) => record.RecordId));
  return review.sourceRecordIds.length === recordIds.size && review.sourceRecordIds.every((id) => recordIds.has(id));
}

export function buildManagementHomeReadModel(
  input: ManagementHomeInput,
): ManagementHomePresentation {
  const unavailableSections: string[] = [];
  const currentVersion = input.plan.currentVersion;

  let monitoringLabel = "記録: 確認できません";
  const monitoring = input.monitoring.status === "RESOLVED" ? input.monitoring.value : null;
  if (unavailable(input.monitoring)) {
    unavailableSections.push("monitoring");
  } else if (monitoring === null) {
    monitoringLabel = "記録: 該当情報なし";
  } else if (!samePlanIdentity(input.plan, monitoring) || monitoring.planVersion !== currentVersion) {
    unavailableSections.push("monitoring");
  } else {
    monitoringLabel = `記録: ${monitoring.recordCount}件 / ${monitoring.periodStart}〜${monitoring.periodEnd}`;
  }

  let reviewLabel = "見直し: 確認できません";
  const review = input.reviewOutcome.status === "RESOLVED" ? input.reviewOutcome.value : null;
  if (unavailable(input.reviewOutcome)) {
    unavailableSections.push("review");
  } else if (review === null) {
    reviewLabel = "見直し: 該当情報なし";
  } else if (
    !samePlanIdentity(input.plan, review) ||
    review.planVersion !== currentVersion ||
    (monitoring !== null && input.monitoring.status === "RESOLVED" && !reviewMatchesMonitoring(monitoring, review))
  ) {
    unavailableSections.push("review");
  } else {
    let reason = "";
    if (input.decisionReason.status === "UNAVAILABLE") {
      unavailableSections.push("decisionReason");
    } else if (input.decisionReason.value === null) {
      if (review.decision === "CHANGE_REQUIRED") {
        unavailableSections.push("decisionReason");
      }
    } else if (input.decisionReason.value.OutcomeId !== review.OutcomeId) {
      unavailableSections.push("decisionReason");
    } else {
      reason = ` / 理由: ${input.decisionReason.value.reason}`;
    }

    if (!unavailableSections.includes("decisionReason")) {
      reviewLabel = `見直し: ${review.decision} / ${review.reviewedAt} / ${review.reviewedBy}${reason}`;
    }
  }

  let revisionLabel = "変更対応: 確認できません";
  const intent = input.revisionIntent.status === "RESOLVED" ? input.revisionIntent.value : null;
  const draft = input.draft.status === "RESOLVED" ? input.draft.value : null;
  const intentReviewMismatch =
    intent !== null &&
    ((input.reviewOutcome.status === "RESOLVED" && review === null) ||
      (review !== null &&
        (intent.sourcePlanVersion !== review.planVersion ||
          intent.sourceReviewOutcomeId !== review.OutcomeId)));
  const draftBindingMismatch =
    draft !== null &&
    (intent === null ||
      !samePlanIdentity(input.plan, draft.reviewBinding) ||
      draft.reviewBinding.planVersion !== draft.candidate.version ||
      draft.candidate.version !== intent.sourcePlanVersion + 1 ||
      draft.reviewBinding.reviewedPlanVersion !== intent.sourcePlanVersion ||
      draft.reviewBinding.sourceOutcomeId !== intent.sourceReviewOutcomeId ||
      (review !== null &&
        (draft.reviewBinding.reviewedPlanVersion !== review.planVersion ||
          draft.reviewBinding.sourceOutcomeId !== review.OutcomeId)) ||
      (currentVersion !== intent.sourcePlanVersion && currentVersion !== draft.candidate.version));
  const standaloneIntentVersionMismatch =
    intent !== null && draft === null && intent.sourcePlanVersion !== currentVersion;

  if (unavailable(input.revisionIntent) || unavailable(input.draft)) {
    unavailableSections.push("revision");
  } else if (intent === null && draft === null) {
    revisionLabel = "変更対応: 該当情報なし";
  } else if (
    (intent !== null && !samePlanIdentity(input.plan, intent)) ||
    (draft !== null && !samePlanIdentity(input.plan, draft.candidate)) ||
    (intent !== null && draft !== null && intent.RevisionIntentId !== draft.RevisionIntentId) ||
    intentReviewMismatch ||
    draftBindingMismatch ||
    standaloneIntentVersionMismatch
  ) {
    unavailableSections.push("revision");
  } else if (draft !== null) {
    const applied = draft.candidate.version === currentVersion;
    revisionLabel = `変更対応: Draft v${draft.candidate.version} ${applied ? "現在適用中" : "未適用"}${intent ? ` / Intent ${intent.status}` : ""}`;
  } else if (intent !== null) {
    revisionLabel = `変更対応: Revision Intent ${intent.status}`;
  }

  let reviewDueLabel = "次回確認: 確認できません";
  if (input.reviewDueLabel.status === "UNAVAILABLE") {
    unavailableSections.push("reviewDue");
  } else if (input.reviewDueLabel.value === null) {
    reviewDueLabel = "次回確認: 該当情報なし";
  } else {
    reviewDueLabel = `次回確認: ${input.reviewDueLabel.value}`;
  }

  let provenanceLabel: string | null = null;
  if (input.activationReceipt.status === "UNAVAILABLE") {
    unavailableSections.push("activationReceipt");
  } else if (input.activationReceipt.value) {
    const receipt = input.activationReceipt.value;
    const receiptIntentMismatch =
      (intent !== null && receipt.RevisionIntentId !== intent.RevisionIntentId) ||
      (draft !== null && receipt.RevisionIntentId !== draft.RevisionIntentId);
    if (
      receipt.planId === input.plan.PlanId &&
      receipt.activatedVersion === currentVersion &&
      !receiptIntentMismatch
    ) {
      provenanceLabel = `適用: v${receipt.fromVersion}→v${receipt.activatedVersion} / ${receipt.activatedBy} / ${receipt.activatedAt}`;
    } else {
      unavailableSections.push("activationReceipt");
    }
  }

  const hasUnknown = unavailableSections.length > 0;
  let nextActionLabel = "次に必要な人の行動: なし";
  if (hasUnknown) {
    nextActionLabel = "次に必要な人の行動: 情報を確認してから判断";
  } else if (review?.decision === "CHANGE_REQUIRED" && intent === null) {
    nextActionLabel = "次に必要な人の行動: 変更作業開始の状態を確認";
  } else if (draft !== null && draft.candidate.version !== currentVersion) {
    nextActionLabel = "次に必要な人の行動: 次版はまだ未適用";
  } else if (review === null) {
    nextActionLabel = "次に必要な人の行動: 見直し状況を確認";
  }

  return {
    personLabel: input.personLabel,
    currentPlanLabel: `現在の計画: v${currentVersion}（適用中）`,
    monitoringLabel,
    reviewLabel,
    revisionLabel,
    nextActionLabel,
    reviewDueLabel,
    provenanceLabel,
    unavailableSections,
  };
}
