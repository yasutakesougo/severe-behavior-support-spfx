import { sha256Hex } from "./sha256";
import type { SupportPlan } from "./support-plan";
import { validateSupportPlan } from "./support-plan";
import type { SupportPlanRevisionDraftCandidate } from "./support-plan-revision";
import { validateSupportPlanRevisionDraftCandidate } from "./support-plan-revision";
import { isNonEmptyString, isValidIsoDateTime } from "./validation";

/**
 * SBS-MGMT-PLAN-ACTIVATION-C (#583) — Human Apply / version transition.
 * Synthetic/session-only. Does not authorize LIVE WRITE / Production Binding / Deploy.
 */
export const SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED = false as const;

const DRAFT_SNAPSHOT_ID_SEPARATOR = "\u001f";
const DRAFT_SNAPSHOT_ID_NAMESPACE = "support-plan.draft-snapshot-id.v1";

export type ActivationReceipt = Readonly<{
  planId: string;
  fromVersion: number;
  activatedVersion: number;
  activatedAt: string;
  activatedBy: string;
  RevisionIntentId: string;
  DraftSnapshotId: string;
}>;

export type SupportPlanActivationRequest = Readonly<{
  currentPlan: SupportPlan;
  draft: SupportPlanRevisionDraftCandidate;
  confirmedDraftSnapshotId: string;
  expectedCurrentVersion: number;
  expectedRowVersion: number;
  actor: string;
  actionAt: string;
  /** Optional prior receipt for exact-snapshot idempotent ALREADY_APPLIED. */
  existingReceipt?: ActivationReceipt;
}>;

export type ApplySupportPlanActivationResult =
  | Readonly<{
      status: "SUCCESS";
      nextPlan: SupportPlan;
      receipt: ActivationReceipt;
    }>
  | Readonly<{
      status: "ALREADY_APPLIED";
      currentPlan: SupportPlan;
      receipt: ActivationReceipt;
    }>
  | Readonly<{ status: "HOLD"; reason: string }>
  | Readonly<{ status: "INVALID"; reason: string }>;

function serializeStringList(values: readonly string[]): string {
  return JSON.stringify(values);
}

/**
 * Deterministic digest of the exact Human-confirmed draft candidate snapshot.
 * RevisionIntentId alone is insufficient (#583 Definition Correction-1 C1-3).
 */
export function mintDraftSnapshotId(draft: SupportPlanRevisionDraftCandidate): string {
  const candidate = draft.candidate;
  const binding = draft.reviewBinding;
  const material = [
    draft.RevisionIntentId,
    candidate.planId,
    candidate.OrganizationId,
    candidate.SiteId,
    candidate.UserId,
    String(candidate.version),
    serializeStringList(candidate.goals),
    serializeStringList(candidate.supportMethods),
    serializeStringList(candidate.precautions),
    serializeStringList(candidate.reviewCriteria),
    candidate.versionCreatedBy,
    candidate.versionCreatedAt,
    binding.OrganizationId,
    binding.SiteId,
    binding.UserId,
    binding.planId,
    String(binding.planVersion),
    String(binding.reviewedPlanVersion),
    binding.sourceOutcomeId,
    binding.boundAt,
    binding.boundBy,
  ].join(DRAFT_SNAPSHOT_ID_SEPARATOR);
  return sha256Hex(
    `${DRAFT_SNAPSHOT_ID_NAMESPACE}${DRAFT_SNAPSHOT_ID_SEPARATOR}${material}`,
  );
}

export function validateActivationReceipt(value: unknown): value is ActivationReceipt {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const receipt = value as Record<string, unknown>;
  return (
    isNonEmptyString(receipt.planId) &&
    typeof receipt.fromVersion === "number" &&
    Number.isInteger(receipt.fromVersion) &&
    receipt.fromVersion >= 1 &&
    typeof receipt.activatedVersion === "number" &&
    Number.isInteger(receipt.activatedVersion) &&
    receipt.activatedVersion >= 1 &&
    receipt.activatedVersion === receipt.fromVersion + 1 &&
    isValidIsoDateTime(receipt.activatedAt) &&
    isNonEmptyString(receipt.activatedBy) &&
    isNonEmptyString(receipt.RevisionIntentId) &&
    isNonEmptyString(receipt.DraftSnapshotId)
  );
}

/**
 * Pure domain transition preparation for Human Apply.
 * Does not call repository.save — CAS remains in session orchestration.
 * Does not mutate old SupportPlanVersion rows.
 * Does not overwrite approvedBy / approvedAt / effectiveFrom.
 */
export function applySupportPlanActivation(
  request: SupportPlanActivationRequest,
): ApplySupportPlanActivationResult {
  const {
    currentPlan,
    draft,
    confirmedDraftSnapshotId,
    expectedCurrentVersion,
    expectedRowVersion,
    actor,
    actionAt,
    existingReceipt,
  } = request;

  if (!validateSupportPlan(currentPlan)) {
    return { status: "INVALID", reason: "INVALID_CURRENT_PLAN" };
  }
  if (!validateSupportPlanRevisionDraftCandidate(draft)) {
    return { status: "INVALID", reason: "INVALID_DRAFT" };
  }
  if (!isNonEmptyString(confirmedDraftSnapshotId)) {
    return { status: "INVALID", reason: "MISSING_DRAFT_SNAPSHOT_ID" };
  }
  if (!isNonEmptyString(actor) || !isValidIsoDateTime(actionAt)) {
    return { status: "INVALID", reason: "INVALID_ACTOR_OR_TIME" };
  }
  if (
    !Number.isInteger(expectedCurrentVersion) ||
    expectedCurrentVersion < 1 ||
    !Number.isInteger(expectedRowVersion) ||
    expectedRowVersion < 1
  ) {
    return { status: "INVALID", reason: "INVALID_EXPECTED_VERSIONS" };
  }

  if (SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED !== false) {
    return { status: "HOLD", reason: "LIVE_WRITE_NOT_AUTHORIZED" };
  }

  if (currentPlan.status !== "Active") {
    return { status: "HOLD", reason: "PLAN_NOT_ACTIVE" };
  }

  const candidate = draft.candidate;
  const binding = draft.reviewBinding;

  if (
    currentPlan.PlanId !== candidate.planId ||
    currentPlan.OrganizationId !== candidate.OrganizationId ||
    currentPlan.SiteId !== candidate.SiteId ||
    currentPlan.UserId !== candidate.UserId ||
    currentPlan.PlanId !== binding.planId ||
    currentPlan.OrganizationId !== binding.OrganizationId ||
    currentPlan.SiteId !== binding.SiteId ||
    currentPlan.UserId !== binding.UserId ||
    draft.RevisionIntentId.length === 0
  ) {
    return { status: "HOLD", reason: "IDENTITY_MISMATCH" };
  }

  const recomputedSnapshotId = mintDraftSnapshotId(draft);
  if (recomputedSnapshotId !== confirmedDraftSnapshotId) {
    return { status: "HOLD", reason: "DRAFT_SNAPSHOT_MISMATCH" };
  }

  if (
    existingReceipt &&
    validateActivationReceipt(existingReceipt) &&
    existingReceipt.DraftSnapshotId === confirmedDraftSnapshotId &&
    existingReceipt.RevisionIntentId === draft.RevisionIntentId &&
    existingReceipt.planId === currentPlan.PlanId &&
    existingReceipt.activatedVersion === candidate.version &&
    currentPlan.currentVersion === candidate.version
  ) {
    return {
      status: "ALREADY_APPLIED",
      currentPlan,
      receipt: existingReceipt,
    };
  }

  if (currentPlan.currentVersion !== expectedCurrentVersion) {
    return { status: "HOLD", reason: "STALE_CURRENT_VERSION" };
  }

  if (currentPlan.version !== expectedRowVersion) {
    return { status: "HOLD", reason: "ROW_VERSION_MISMATCH" };
  }

  if (candidate.version !== expectedCurrentVersion + 1) {
    return { status: "HOLD", reason: "TARGET_VERSION_NOT_N_PLUS_1" };
  }

  if (binding.reviewedPlanVersion !== expectedCurrentVersion) {
    return { status: "HOLD", reason: "REVIEW_BINDING_SOURCE_MISMATCH" };
  }

  if (binding.planVersion !== candidate.version) {
    return { status: "HOLD", reason: "REVIEW_BINDING_TARGET_MISMATCH" };
  }

  const receipt: ActivationReceipt = {
    planId: currentPlan.PlanId,
    fromVersion: expectedCurrentVersion,
    activatedVersion: candidate.version,
    activatedAt: actionAt,
    activatedBy: actor,
    RevisionIntentId: draft.RevisionIntentId,
    DraftSnapshotId: confirmedDraftSnapshotId,
  };

  // Advance content currentVersion only. Keep row concurrency token for CAS save.
  // Do not rewrite approvedBy / approvedAt / effectiveFrom (#419 D2 / Correction C1-5).
  const nextPlan: SupportPlan = {
    ...currentPlan,
    currentVersion: candidate.version,
  };

  if (!validateSupportPlan(nextPlan)) {
    return { status: "INVALID", reason: "INVALID_NEXT_PLAN" };
  }

  if (
    nextPlan.approvedBy !== currentPlan.approvedBy ||
    nextPlan.approvedAt !== currentPlan.approvedAt ||
    nextPlan.effectiveFrom !== currentPlan.effectiveFrom
  ) {
    return { status: "HOLD", reason: "APPROVAL_METADATA_MUTATION_FORBIDDEN" };
  }

  return {
    status: "SUCCESS",
    nextPlan,
    receipt,
  };
}
