import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type {
  ActivationReceipt,
  ActiveSupportPlan,
  SupportPlanRevisionDraftCandidate,
} from "../../sbs-domain/support-plan-activation.bundle";
import type { RevisionIntent } from "../../sbs-domain/support-plan-revision.bundle";
import {
  formatStaffBusinessDate,
  formatStaffBusinessDateTime,
} from "../ux/staff-date-time-presentation";

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
  return (
    review.OrganizationId === monitoring.OrganizationId &&
    review.SiteId === monitoring.SiteId &&
    review.UserId === monitoring.UserId &&
    review.planId === monitoring.planId &&
    review.planVersion === monitoring.planVersion &&
    review.periodStart === monitoring.periodStart &&
    review.periodEnd === monitoring.periodEnd
  );
}

function formatReviewDecision(decision: MonitoringPeriodReviewOutcome["decision"]): string {
  return decision === "CHANGE_REQUIRED" ? "変更が必要" : "変更なし";
}

function formatRevisionIntentStatus(status: RevisionIntent["status"]): string {
  return status === "CONSUMED" ? "次版の下書き作成済み" : "変更作業を開始済み";
}

const unavailableSectionLabels: Readonly<Record<string, string>> = {
  monitoring: "見直し",
  review: "見直し",
  decisionReason: "見直し",
  reviewDue: "見直し",
  revision: "変更対応",
  activationReceipt: "変更対応",
};

function formatUnavailableNextAction(unavailableSections: readonly string[]): string {
  const labels = new Set<string>();
  for (const section of unavailableSections) {
    labels.add(unavailableSectionLabels[section] ?? "不足している情報");
  }
  const target = Array.from(labels).join("・") || "不足している情報";
  return `次に必要な人の行動: ${target}の情報を確認してから判断してください`;
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
  } else if (!samePlanIdentity(input.plan, monitoring)) {
    unavailableSections.push("monitoring");
  } else {
    monitoringLabel = `記録: ${monitoring.recordCount}件 / ${formatStaffBusinessDateTime(monitoring.periodStart)}〜${formatStaffBusinessDateTime(monitoring.periodEnd)}`;
  }

  let reviewLabel = "見直し: 確認できません";
  let reviewUsable = false;
  const review = input.reviewOutcome.status === "RESOLVED" ? input.reviewOutcome.value : null;
  if (unavailable(input.reviewOutcome)) {
    unavailableSections.push("review");
  } else if (review === null) {
    reviewLabel = "見直し: 該当情報なし";
  } else if (
    !samePlanIdentity(input.plan, review) ||
    (monitoring !== null &&
      input.monitoring.status === "RESOLVED" &&
      !reviewMatchesMonitoring(monitoring, review))
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

    if (unavailableSections.indexOf("decisionReason") < 0) {
      reviewUsable = true;
      reviewLabel = `見直し: ${formatReviewDecision(review.decision)} / ${formatStaffBusinessDateTime(review.reviewedAt)} / ${review.reviewedBy}${reason}`;
    }
  }

  let revisionLabel = "変更対応: 確認できません";
  const intent = input.revisionIntent.status === "RESOLVED" ? input.revisionIntent.value : null;
  const draft = input.draft.status === "RESOLVED" ? input.draft.value : null;
  let revisionMismatch = false;

  if (unavailable(input.revisionIntent) || unavailable(input.draft)) {
    revisionMismatch = true;
  } else if (intent !== null) {
    revisionMismatch =
      !samePlanIdentity(input.plan, intent) ||
      !reviewUsable ||
      review === null ||
      review.decision !== "CHANGE_REQUIRED" ||
      intent.sourcePlanVersion !== review.planVersion ||
      intent.sourceReviewOutcomeId !== review.OutcomeId;
  }

  if (!revisionMismatch && draft !== null) {
    const binding = draft.reviewBinding;
    revisionMismatch =
      intent === null ||
      !samePlanIdentity(input.plan, draft.candidate) ||
      !samePlanIdentity(input.plan, binding) ||
      binding.planVersion !== draft.candidate.version ||
      (draft.candidate.version !== currentVersion &&
        draft.candidate.version !== currentVersion + 1) ||
      intent.status !== "CONSUMED" ||
      draft.RevisionIntentId !== intent.RevisionIntentId ||
      !reviewUsable ||
      review === null ||
      binding.reviewedPlanVersion !== review.planVersion ||
      binding.sourceOutcomeId !== review.OutcomeId;
  }

  if (!revisionMismatch && intent !== null && intent.status === "CONSUMED" && draft === null) {
    revisionMismatch = true;
  }

  if (revisionMismatch) {
    unavailableSections.push("revision");
  } else if (intent === null && draft === null) {
    revisionLabel = "変更対応: 該当情報なし";
  } else if (draft !== null) {
    const applied = draft.candidate.version === currentVersion;
    revisionLabel = `変更対応: 次版の下書き v${draft.candidate.version}（${applied ? "現在適用中" : "未適用"}）${intent ? ` / ${formatRevisionIntentStatus(intent.status)}` : ""}`;
  } else if (intent !== null) {
    revisionLabel = `変更対応: ${formatRevisionIntentStatus(intent.status)}`;
  }

  let reviewDueLabel = "次回確認: 確認できません";
  if (input.reviewDueLabel.status === "UNAVAILABLE") {
    unavailableSections.push("reviewDue");
  } else if (input.reviewDueLabel.value === null) {
    reviewDueLabel = "次回確認: 該当情報なし";
  } else if (input.reviewDueLabel.value.trim().length === 0) {
    unavailableSections.push("reviewDue");
  } else {
    reviewDueLabel = `次回確認: ${formatStaffBusinessDate(input.reviewDueLabel.value)}`;
  }

  let provenanceLabel: string | null = null;
  if (input.activationReceipt.status === "UNAVAILABLE") {
    unavailableSections.push("activationReceipt");
  } else if (input.activationReceipt.value) {
    const receipt = input.activationReceipt.value;
    const receiptMismatch =
      receipt.planId !== input.plan.PlanId ||
      receipt.activatedVersion !== currentVersion ||
      receipt.activatedVersion !== receipt.fromVersion + 1 ||
      (draft !== null &&
        draft.candidate.version === currentVersion &&
        receipt.RevisionIntentId !== draft.RevisionIntentId);
    if (receiptMismatch) {
      unavailableSections.push("activationReceipt");
    } else {
      provenanceLabel = `適用: v${receipt.fromVersion}→v${receipt.activatedVersion} / ${receipt.activatedBy} / ${formatStaffBusinessDateTime(receipt.activatedAt)}`;
    }
  }

  const hasUnknown = unavailableSections.length > 0;
  let nextActionLabel = "次に必要な人の行動: なし";
  if (hasUnknown) {
    nextActionLabel = formatUnavailableNextAction(unavailableSections);
  } else if (draft !== null && draft.candidate.version === currentVersion + 1) {
    // CORR-1C — bind to explicit Human Apply speech-act; no auto-Apply.
    nextActionLabel = `次に必要な人の行動: 次版 v${draft.candidate.version} を適用開始する前に内容を確認してください`;
  } else if (draft !== null && draft.candidate.version === currentVersion) {
    nextActionLabel = `次に必要な人の行動: 新しい版 v${currentVersion} が現在適用中`;
  } else if (review === null) {
    nextActionLabel = "次に必要な人の行動: 見直し状況を確認";
  } else if (review.decision === "NO_CHANGE") {
    nextActionLabel = "次に必要な人の行動: 次回見直し時期を確認";
  } else if (intent === null) {
    nextActionLabel = "次に必要な人の行動: 変更作業開始の状態を確認";
  } else if (intent.status === "OPEN") {
    nextActionLabel = "次に必要な人の行動: 変更作業の開始状態を確認";
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
