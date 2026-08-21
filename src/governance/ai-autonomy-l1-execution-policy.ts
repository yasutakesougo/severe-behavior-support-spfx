import type {
  AutonomyClassification,
  EvidenceStatus,
  ProductionCapabilityDelta,
  RollbackEvidence,
} from "./ai-autonomy-classifier-gate-evaluator.js";

export type ExecutionPolicyReasonCode =
  | "CLASS_NOT_L1"
  | "GATE_NOT_ELIGIBLE"
  | "SELF_GOVERNANCE_CHANGE"
  | "INTEGRATION_BRANCH_NOT_ALLOWED"
  | "REPOSITORY_AUTONOMY_POLICY_NOT_ENABLED"
  | "REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY"
  | "REPOSITORY_AUTONOMY_POLICY_AUTHORITY_UNAVAILABLE"
  | "CI_NOT_GREEN"
  | "REVIEW_NOT_CLEARED"
  | "UNRESOLVED_THREADS_PRESENT"
  | "HEAD_EVIDENCE_MISMATCH"
  | "EVIDENCE_MISSING"
  | "EVIDENCE_STALE"
  | "EVIDENCE_UNPARSEABLE"
  | "EVIDENCE_INDETERMINATE"
  | "BASE_HEAD_DRIFTED"
  | "MERGEABILITY_NOT_TRUE"
  | "PRE_MERGE_REVALIDATION_FAILED"
  | "PRODUCTION_CAPABILITY_DELTA_PRESENT"
  | "PRODUCTION_CAPABILITY_DELTA_UNKNOWN"
  | "ROLLBACK_UNAVAILABLE";

export type AutonomyCapabilityState = "AUTO_ALLOWED" | "HUMAN_ONLY" | "NOT_ENABLED";

export type RepositoryAutonomyPolicyEvidence = Readonly<{
  status: EvidenceStatus;
  sourcePath: string;
  baseHeadSha?: string;
  ready: AutonomyCapabilityState;
  merge: AutonomyCapabilityState;
}>;

export type HeadBoundExecutionEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
}>;

export type ExecutionReviewEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
  p0: number;
  p1: number;
}>;

export type ReviewThreadsEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
  unresolvedCount?: number;
}>;

export type PreMergeRevalidationEvidence = Readonly<{
  status: EvidenceStatus;
  currentPrHeadSha?: string;
  currentBaseHeadSha?: string;
  readyTimeBaseHeadSha?: string;
  baseRelativeEvidenceRevalidated: boolean;
  mergeable: boolean | null;
  ci: HeadBoundExecutionEvidence;
  review: ExecutionReviewEvidence;
  threads: ReviewThreadsEvidence;
  repositoryPolicy: RepositoryAutonomyPolicyEvidence;
}>;

export type L1ExecutionPolicyInput = Readonly<{
  classification: AutonomyClassification;
  gateAutonomyEligible: boolean;
  currentPrHeadSha: string;
  currentBaseHeadSha: string;
  baseBranch: string;
  changedPaths: readonly string[];
  ci: HeadBoundExecutionEvidence;
  review: ExecutionReviewEvidence;
  threads: ReviewThreadsEvidence;
  rollback: RollbackEvidence;
  productionCapabilityDelta: ProductionCapabilityDelta;
  repositoryPolicy: RepositoryAutonomyPolicyEvidence;
  preMerge?: PreMergeRevalidationEvidence;
}>;

export type L1ExecutionPolicyResult = Readonly<{
  autoReadyAllowed: boolean;
  autoMergeAllowed: boolean;
  reasons: readonly ExecutionPolicyReasonCode[];
}>;

const AUTONOMY_POLICY_PATH = "docs/process/autonomy-policy-v1.md";
const APPROVED_INTEGRATION_BRANCHES = new Set(["main"]);

const DESIGNATED_AUTONOMY_POLICY_FILES = new Set([
  "docs/process/autonomy-policy-v1.md",
  "docs/architecture/decision-autonomy-policy-v1-selection.md",
  "docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md",
  "docs/architecture/ai-autonomy-l1-execution-policy-combined-reconciliation-1.md",
  "docs/architecture/ai-autonomy-l1-execution-policy-post-merge-reconciliation-1.md",
  "docs/architecture/ai-autonomy-l1-enablement-exact-slice-definition-1.md",
  "docs/decisions/DEC-AA-001.md",
  "docs/decisions/DEC-AA-003.md",
  "docs/decisions/DEC-AI-ORG-003.md",
  "docs/process/low-auto-pilot-v1.md",
  "docs/process/routine-aug-v1.md",
  "docs/process/fast-lane-v1.md",
  "docs/process/process-optimization-v1.md",
  "docs/process/self-referential-gate-policy.md",
]);

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isSelfGovernancePath(path: string): boolean {
  const normalized = normalizePath(path);
  return (
    normalized.startsWith("src/governance/") ||
    normalized.startsWith("tests/governance/") ||
    normalized.startsWith(".github/workflows/") ||
    DESIGNATED_AUTONOMY_POLICY_FILES.has(normalized)
  );
}

function addEvidenceStateReason(
  status: EvidenceStatus,
  reasons: ExecutionPolicyReasonCode[],
): void {
  if (status === "MISSING") reasons.push("EVIDENCE_MISSING");
  if (status === "STALE") reasons.push("EVIDENCE_STALE");
  if (status === "UNPARSEABLE") reasons.push("EVIDENCE_UNPARSEABLE");
  if (status === "INDETERMINATE") reasons.push("EVIDENCE_INDETERMINATE");
}

function rollbackAvailable(rollback: RollbackEvidence): boolean {
  return (
    rollback.status === "PASS" &&
    rollback.fullyRepresentedInGit &&
    !rollback.externalMutationOccurred &&
    !rollback.irreversibleSideEffectOccurred &&
    rollback.previousRepositoryStateRecoverable
  );
}

function addPolicyAuthorityReasons(
  policy: RepositoryAutonomyPolicyEvidence,
  expectedBaseHeadSha: string,
  capability: "ready" | "merge",
  reasons: ExecutionPolicyReasonCode[],
): void {
  addEvidenceStateReason(policy.status, reasons);

  if (
    policy.status !== "PASS" ||
    normalizePath(policy.sourcePath) !== AUTONOMY_POLICY_PATH ||
    policy.baseHeadSha === undefined ||
    policy.baseHeadSha !== expectedBaseHeadSha
  ) {
    reasons.push("REPOSITORY_AUTONOMY_POLICY_AUTHORITY_UNAVAILABLE");
    return;
  }

  const state = policy[capability];
  if (state === "NOT_ENABLED") {
    reasons.push("REPOSITORY_AUTONOMY_POLICY_NOT_ENABLED");
  }
  if (state === "HUMAN_ONLY") {
    reasons.push("REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY");
  }
}

function addReadyReasons(
  input: L1ExecutionPolicyInput,
  reasons: ExecutionPolicyReasonCode[],
): void {
  if (input.classification !== "L1") reasons.push("CLASS_NOT_L1");
  if (!input.gateAutonomyEligible) reasons.push("GATE_NOT_ELIGIBLE");

  if (input.changedPaths.length === 0) {
    reasons.push("EVIDENCE_MISSING");
  }
  if (input.changedPaths.some(isSelfGovernancePath)) {
    reasons.push("SELF_GOVERNANCE_CHANGE");
  }

  if (!APPROVED_INTEGRATION_BRANCHES.has(input.baseBranch)) {
    reasons.push("INTEGRATION_BRANCH_NOT_ALLOWED");
  }

  addPolicyAuthorityReasons(input.repositoryPolicy, input.currentBaseHeadSha, "ready", reasons);

  addEvidenceStateReason(input.ci.status, reasons);
  if (input.ci.status !== "PASS") reasons.push("CI_NOT_GREEN");

  addEvidenceStateReason(input.review.status, reasons);
  if (input.review.status !== "PASS" || input.review.p0 > 0 || input.review.p1 > 0) {
    reasons.push("REVIEW_NOT_CLEARED");
  }

  addEvidenceStateReason(input.threads.status, reasons);
  if (
    input.threads.status !== "PASS" ||
    input.threads.unresolvedCount === undefined ||
    input.threads.unresolvedCount > 0
  ) {
    reasons.push("UNRESOLVED_THREADS_PRESENT");
  }

  addEvidenceStateReason(input.rollback.status, reasons);

  const headBound = [
    input.ci.headSha,
    input.review.headSha,
    input.threads.headSha,
    input.rollback.headSha,
  ];
  if (headBound.some((headSha) => headSha === undefined || headSha !== input.currentPrHeadSha)) {
    reasons.push("HEAD_EVIDENCE_MISMATCH");
  }

  if (input.productionCapabilityDelta.status === "PRESENT") {
    reasons.push("PRODUCTION_CAPABILITY_DELTA_PRESENT");
  }
  if (input.productionCapabilityDelta.status === "UNKNOWN") {
    reasons.push("PRODUCTION_CAPABILITY_DELTA_UNKNOWN");
  }

  if (!rollbackAvailable(input.rollback)) reasons.push("ROLLBACK_UNAVAILABLE");
}

function addPreMergeReasons(
  input: L1ExecutionPolicyInput,
  preMerge: PreMergeRevalidationEvidence | undefined,
  reasons: ExecutionPolicyReasonCode[],
): void {
  if (preMerge === undefined) {
    reasons.push("PRE_MERGE_REVALIDATION_FAILED");
    reasons.push("EVIDENCE_MISSING");
    return;
  }

  addEvidenceStateReason(preMerge.status, reasons);
  if (preMerge.status !== "PASS") {
    reasons.push("PRE_MERGE_REVALIDATION_FAILED");
  }

  if (
    preMerge.currentPrHeadSha === undefined ||
    preMerge.currentPrHeadSha !== input.currentPrHeadSha
  ) {
    reasons.push("HEAD_EVIDENCE_MISMATCH");
  }

  if (preMerge.currentBaseHeadSha === undefined) {
    reasons.push("EVIDENCE_MISSING");
    reasons.push("PRE_MERGE_REVALIDATION_FAILED");
  }

  if (preMerge.mergeable !== true) {
    reasons.push("MERGEABILITY_NOT_TRUE");
  }

  addEvidenceStateReason(preMerge.ci.status, reasons);
  if (preMerge.ci.status !== "PASS") reasons.push("CI_NOT_GREEN");

  addEvidenceStateReason(preMerge.review.status, reasons);
  if (preMerge.review.status !== "PASS" || preMerge.review.p0 > 0 || preMerge.review.p1 > 0) {
    reasons.push("REVIEW_NOT_CLEARED");
  }

  addEvidenceStateReason(preMerge.threads.status, reasons);
  if (
    preMerge.threads.status !== "PASS" ||
    preMerge.threads.unresolvedCount === undefined ||
    preMerge.threads.unresolvedCount > 0
  ) {
    reasons.push("UNRESOLVED_THREADS_PRESENT");
  }

  const currentBaseHeadSha = preMerge.currentBaseHeadSha;
  if (currentBaseHeadSha !== undefined) {
    // Fresh-base Auto Ready re-evaluation before Auto Merge predicates.
    addPolicyAuthorityReasons(preMerge.repositoryPolicy, currentBaseHeadSha, "ready", reasons);
    addPolicyAuthorityReasons(preMerge.repositoryPolicy, currentBaseHeadSha, "merge", reasons);
  }

  const preMergeHeads = [preMerge.ci.headSha, preMerge.review.headSha, preMerge.threads.headSha];
  if (
    preMergeHeads.some((headSha) => headSha === undefined || headSha !== preMerge.currentPrHeadSha)
  ) {
    reasons.push("HEAD_EVIDENCE_MISMATCH");
  }

  if (
    preMerge.readyTimeBaseHeadSha !== undefined &&
    preMerge.currentBaseHeadSha !== undefined &&
    preMerge.readyTimeBaseHeadSha !== preMerge.currentBaseHeadSha &&
    !preMerge.baseRelativeEvidenceRevalidated
  ) {
    reasons.push("BASE_HEAD_DRIFTED");
    reasons.push("EVIDENCE_STALE");
  }
}

export function evaluateL1ExecutionPolicy(input: L1ExecutionPolicyInput): L1ExecutionPolicyResult {
  const readyReasons: ExecutionPolicyReasonCode[] = [];
  addReadyReasons(input, readyReasons);
  const uniqueReadyReasons = [...new Set(readyReasons)];
  const autoReadyAllowed = uniqueReadyReasons.length === 0;

  // Merge requires Ready predicates on the fresh pre-merge evidence set as well
  // as Ready-time denies (seeded below) and merge-specific checks.
  const mergeReasons = [...uniqueReadyReasons];
  addPolicyAuthorityReasons(
    input.repositoryPolicy,
    input.currentBaseHeadSha,
    "merge",
    mergeReasons,
  );
  addPreMergeReasons(input, input.preMerge, mergeReasons);

  const uniqueMergeReasons = [...new Set(mergeReasons)];
  return {
    autoReadyAllowed,
    autoMergeAllowed: uniqueMergeReasons.length === 0,
    reasons: uniqueMergeReasons,
  };
}
