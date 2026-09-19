import {
  evaluateL1ExecutionPolicy,
  type L1ExecutionPolicyInput,
  type L1ExecutionPolicyResult,
} from "./ai-autonomy-l1-execution-policy.js";
import type { EvidenceStatus } from "./ai-autonomy-classifier-gate-evaluator.js";

export const L1_READY_EXECUTOR_BACKEND_ID = "L1_READY_EXECUTOR_V1" as const;
export const READY_CAPABILITY_ID = "pull_request.ready" as const;
export const AUTONOMY_POLICY_PATH = "docs/process/autonomy-policy-v1.md";

export type ReadyExecutorMode = "dry_run" | "execute";

export type KillSwitchState = "ENABLED" | "DISABLED" | "UNKNOWN";

export type KillSwitchEvidence = Readonly<{
  status: EvidenceStatus;
  sourcePath: string;
  baseHeadSha?: string;
  l1AutoReady: KillSwitchState;
  l1AutoMerge: KillSwitchState;
}>;

export type ReadyPullRequestTarget = Readonly<{
  owner: string;
  repo: string;
  pullNumber: number;
  headSha: string;
  isDraft: boolean;
}>;

export type ReadyExecutorDecision =
  "DRY_RUN" | "PREPARED" | "EXECUTED" | "NO_OP" | "DENY" | "EXECUTION_FAILED";

export type ReadyExecutorReasonCode =
  | "MODE_INVALID"
  | "TARGET_INVALID"
  | "POLICY_DENIED"
  | "KILL_SWITCH_DISABLED"
  | "KILL_SWITCH_AUTHORITY_UNAVAILABLE"
  | "AUDIT_UNAVAILABLE"
  | "FORBIDDEN_CAPABILITY"
  | "HEAD_MISMATCH"
  | "MUTATION_FAILED"
  | "ALREADY_READY";

export type ReadyAuditRecord = Readonly<{
  auditId: string;
  timestamp: string;
  decision: ReadyExecutorDecision;
  reasons: readonly ReadyExecutorReasonCode[];
  policyReasons: readonly string[];
  capability: typeof READY_CAPABILITY_ID;
  executorBackendId: typeof L1_READY_EXECUTOR_BACKEND_ID;
  mode: ReadyExecutorMode | "unknown";
  repository: string;
  pullNumber: number;
  currentPrHeadSha: string;
  currentBaseHeadSha: string;
  autoReadyAllowed: boolean;
  autoMergeAllowed: boolean;
  killSwitch: Readonly<{
    l1AutoReady: KillSwitchState;
    l1AutoMerge: KillSwitchState;
    sourcePath: string;
    baseHeadSha?: string;
    status: EvidenceStatus;
  }>;
  mutationAttempted: boolean;
}>;

export type ReadyAuditSink = Readonly<{
  available: boolean;
  write(record: ReadyAuditRecord): Promise<void> | void;
}>;

export type ReadyMutationPort = Readonly<{
  markReadyForReview(target: ReadyPullRequestTarget): Promise<void> | void;
}>;

export type L1ReadyExecutorInput = Readonly<{
  mode: ReadyExecutorMode | string;
  target: ReadyPullRequestTarget;
  policyInput: L1ExecutionPolicyInput;
  killSwitch: KillSwitchEvidence;
  audit: ReadyAuditSink;
  mutation?: ReadyMutationPort;
  capability?: string;
  now?: () => Date;
  createAuditId?: () => string;
}>;

export type L1ReadyExecutorResult = Readonly<{
  decision: ReadyExecutorDecision;
  reasons: readonly ReadyExecutorReasonCode[];
  policy: L1ExecutionPolicyResult;
  mutationAttempted: boolean;
  auditWritten: boolean;
}>;

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isReadyMode(mode: string): mode is ReadyExecutorMode {
  return mode === "dry_run" || mode === "execute";
}

function targetValid(target: ReadyPullRequestTarget): boolean {
  return (
    target.owner.trim().length > 0 &&
    target.repo.trim().length > 0 &&
    Number.isInteger(target.pullNumber) &&
    target.pullNumber > 0 &&
    /^[0-9a-f]{40}$/i.test(target.headSha)
  );
}

function killSwitchAllowsReady(
  killSwitch: KillSwitchEvidence,
  expectedBaseHeadSha: string,
): ReadyExecutorReasonCode | undefined {
  if (killSwitch.status !== "PASS") {
    return "KILL_SWITCH_AUTHORITY_UNAVAILABLE";
  }
  if (normalizePath(killSwitch.sourcePath) !== AUTONOMY_POLICY_PATH) {
    return "KILL_SWITCH_AUTHORITY_UNAVAILABLE";
  }
  if (killSwitch.baseHeadSha === undefined || killSwitch.baseHeadSha !== expectedBaseHeadSha) {
    return "KILL_SWITCH_AUTHORITY_UNAVAILABLE";
  }
  if (killSwitch.l1AutoReady !== "ENABLED") {
    return "KILL_SWITCH_DISABLED";
  }
  return undefined;
}

async function writeAudit(audit: ReadyAuditSink, record: ReadyAuditRecord): Promise<boolean> {
  if (!audit.available) return false;
  await audit.write(record);
  return true;
}

function buildAuditRecord(
  input: L1ReadyExecutorInput,
  decision: ReadyExecutorDecision,
  reasons: readonly ReadyExecutorReasonCode[],
  policy: L1ExecutionPolicyResult,
  mutationAttempted: boolean,
  mode: ReadyExecutorMode | "unknown",
): ReadyAuditRecord {
  const now = input.now?.() ?? new Date();
  const auditId = input.createAuditId?.() ?? `ready-audit-${now.toISOString()}`;
  return {
    auditId,
    timestamp: now.toISOString(),
    decision,
    reasons,
    policyReasons: policy.reasons,
    capability: READY_CAPABILITY_ID,
    executorBackendId: L1_READY_EXECUTOR_BACKEND_ID,
    mode,
    repository: `${input.target.owner}/${input.target.repo}`,
    pullNumber: input.target.pullNumber,
    currentPrHeadSha: input.policyInput.currentPrHeadSha,
    currentBaseHeadSha: input.policyInput.currentBaseHeadSha,
    autoReadyAllowed: policy.autoReadyAllowed,
    autoMergeAllowed: policy.autoMergeAllowed,
    killSwitch: {
      l1AutoReady: input.killSwitch.l1AutoReady,
      l1AutoMerge: input.killSwitch.l1AutoMerge,
      sourcePath: input.killSwitch.sourcePath,
      baseHeadSha: input.killSwitch.baseHeadSha,
      status: input.killSwitch.status,
    },
    mutationAttempted,
  };
}

/**
 * Fail-closed L1 Ready executor.
 * Mutates only through an injected ReadyMutationPort when mode=execute and all gates pass.
 * Never implements Merge.
 */
export async function executeL1Ready(input: L1ReadyExecutorInput): Promise<L1ReadyExecutorResult> {
  const policy = evaluateL1ExecutionPolicy(input.policyInput);
  const reasons: ReadyExecutorReasonCode[] = [];

  if (input.capability !== undefined && input.capability !== READY_CAPABILITY_ID) {
    reasons.push("FORBIDDEN_CAPABILITY");
  }

  if (!isReadyMode(input.mode)) {
    reasons.push("MODE_INVALID");
  }

  if (!targetValid(input.target)) {
    reasons.push("TARGET_INVALID");
  } else if (
    input.target.headSha.toLowerCase() !== input.policyInput.currentPrHeadSha.toLowerCase()
  ) {
    reasons.push("HEAD_MISMATCH");
  }

  if (!policy.autoReadyAllowed) {
    reasons.push("POLICY_DENIED");
  }

  const killSwitchDeny = killSwitchAllowsReady(
    input.killSwitch,
    input.policyInput.currentBaseHeadSha,
  );
  if (killSwitchDeny !== undefined) {
    reasons.push(killSwitchDeny);
  }

  if (!input.audit.available) {
    reasons.push("AUDIT_UNAVAILABLE");
  }

  const uniqueReasons = [...new Set(reasons)];
  const mode: ReadyExecutorMode | "unknown" = isReadyMode(input.mode) ? input.mode : "unknown";

  if (uniqueReasons.length > 0) {
    const auditWritten = await writeAudit(
      input.audit,
      buildAuditRecord(input, "DENY", uniqueReasons, policy, false, mode),
    );
    return {
      decision: "DENY",
      reasons: uniqueReasons,
      policy,
      mutationAttempted: false,
      auditWritten,
    };
  }

  // Already non-draft: idempotent success, no mutation.
  if (!input.target.isDraft) {
    const auditWritten = await writeAudit(
      input.audit,
      buildAuditRecord(input, "NO_OP", ["ALREADY_READY"], policy, false, mode),
    );
    return {
      decision: "NO_OP",
      reasons: ["ALREADY_READY"],
      policy,
      mutationAttempted: false,
      auditWritten,
    };
  }

  if (mode === "dry_run") {
    const auditWritten = await writeAudit(
      input.audit,
      buildAuditRecord(input, "DRY_RUN", [], policy, false, mode),
    );
    return {
      decision: "DRY_RUN",
      reasons: [],
      policy,
      mutationAttempted: false,
      auditWritten,
    };
  }

  // mode === "execute"
  if (input.mutation === undefined) {
    const execReasons: ReadyExecutorReasonCode[] = ["MUTATION_FAILED"];
    const auditWritten = await writeAudit(
      input.audit,
      buildAuditRecord(input, "EXECUTION_FAILED", execReasons, policy, false, mode),
    );
    return {
      decision: "EXECUTION_FAILED",
      reasons: execReasons,
      policy,
      mutationAttempted: false,
      auditWritten,
    };
  }

  // Durable PREPARED audit before side effect.
  const preparedWritten = await writeAudit(
    input.audit,
    buildAuditRecord(input, "PREPARED", [], policy, false, mode),
  );
  if (!preparedWritten) {
    return {
      decision: "DENY",
      reasons: ["AUDIT_UNAVAILABLE"],
      policy,
      mutationAttempted: false,
      auditWritten: false,
    };
  }

  try {
    await input.mutation.markReadyForReview(input.target);
  } catch {
    const failReasons: ReadyExecutorReasonCode[] = ["MUTATION_FAILED"];
    const auditWritten = await writeAudit(
      input.audit,
      buildAuditRecord(input, "EXECUTION_FAILED", failReasons, policy, true, mode),
    );
    return {
      decision: "EXECUTION_FAILED",
      reasons: failReasons,
      policy,
      mutationAttempted: true,
      auditWritten,
    };
  }

  const auditWritten = await writeAudit(
    input.audit,
    buildAuditRecord(input, "EXECUTED", [], policy, true, mode),
  );
  return {
    decision: "EXECUTED",
    reasons: [],
    policy,
    mutationAttempted: true,
    auditWritten,
  };
}
