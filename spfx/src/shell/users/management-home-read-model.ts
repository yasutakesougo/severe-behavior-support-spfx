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

function unavailable<T>(slot: SourceSlot<T>): slot is Readonly<{ status: "UNAVAILABLE"; reason: string }> {
  return slot.status === "UNAVAILABLE";
}

export function buildManagementHomeReadModel(input: ManagementHomeInput): ManagementHomePresentation {
  const unavailableSections: string[] = [];
  const currentVersion = input.plan.currentVersion;

  let monitoringLabel = "記録: 確認できません";
  if (unavailable(input.monitoring)) {
    unavailableSections.push("monitoring");
  } else if (input.monitoring.value === null) {
    monitoringLabel = "記録: 該当情報なし";
  } else if (
    !samePlanIdentity(input.plan, input.monitoring.value) ||
    input.monitoring.value.planVersion !== currentVersion
  ) {
    unavailableSections.push("monitoring");
  } else {
    monitoringLabel = `記録: ${input.monitoring.value.recordCount}件 / ${input.monitoring.value.periodStart}〜${input.monitoring.value.periodEnd}`;
  }

  let reviewLabel = "見直し: 確認できません";
  const review =
    input.reviewOutcome.status === "RESOLVED" ? input.reviewOutcome.value : null;
  if (unavailable(input.reviewOutcome)) {
    unavailableSections.push("review");
  } else if (review === null) {
    reviewLabel = "見直し: 該当情報なし";
  } else if (
    !samePlanIdentity(input.plan, review) ||
    review.planVersion !== currentVersion
  ) {
    unavailableSections.push("review");
  } else {
    const reason =
      input.decisionReason.status === "RESOLVED" &&
      input.decisionReason.value &&
      input.decisionReason.value.OutcomeId === review.OutcomeId
        ? ` / 理由: ${input.decisionReason.value.reason}`
        : "";
    if (input.decisionReason.status === "UNAVAILABLE") {
      unavailableSections.push("decisionReason");
    }
    reviewLabel = `見直し: ${review.decision} / ${review.reviewedAt} / ${review.reviewedBy}${reason}`;
  }

  let revisionLabel = "変更対応: 確認できません";
  const intent =
    input.revisionIntent.status === "RESOLVED" ? input.revisionIntent.value : null;
  const draft = input.draft.status === "RESOLVED" ? input.draft.value : null;
  if (unavailable(input.revisionIntent) || unavailable(input.draft)) {
    unavailableSections.push("revision");
  } else if (intent === null && draft === null) {
    revisionLabel = "変更対応: 該当情報なし";
  } else if (
    (intent !== null && !samePlanIdentity(input.plan, intent)) ||
    (draft !== null && !samePlanIdentity(input.plan, draft.candidate)) ||
    (intent !== null &&
      draft !== null &&
      intent.RevisionIntentId !== draft.RevisionIntentId)
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
    if (
      receipt.planId === input.plan.PlanId &&
      receipt.activatedVersion === currentVersion
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