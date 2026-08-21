import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  L1ExecutionPolicyInput,
  PreMergeRevalidationEvidence,
  RepositoryAutonomyPolicyEvidence,
} from "../../src/governance/ai-autonomy-l1-execution-policy.js";
import {
  AUTONOMY_POLICY_PATH,
  executeL1Ready,
  L1_READY_EXECUTOR_BACKEND_ID,
  READY_CAPABILITY_ID,
  type KillSwitchEvidence,
  type ReadyAuditRecord,
  type ReadyPullRequestTarget,
} from "../../src/governance/ai-autonomy-l1-ready-executor.js";

const prHead = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const baseHead = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

function selectionAPolicy(policyBaseHead = baseHead): RepositoryAutonomyPolicyEvidence {
  return {
    status: "PASS",
    sourcePath: AUTONOMY_POLICY_PATH,
    baseHeadSha: policyBaseHead,
    ready: "AUTO_ALLOWED",
    merge: "HUMAN_ONLY",
  };
}

function passingPreMerge(
  repositoryPolicy: RepositoryAutonomyPolicyEvidence,
): PreMergeRevalidationEvidence {
  return {
    status: "PASS",
    currentPrHeadSha: prHead,
    currentBaseHeadSha: baseHead,
    readyTimeBaseHeadSha: baseHead,
    baseRelativeEvidenceRevalidated: true,
    mergeable: true,
    ci: { status: "PASS", headSha: prHead },
    review: { status: "PASS", headSha: prHead, p0: 0, p1: 0 },
    threads: { status: "PASS", headSha: prHead, unresolvedCount: 0 },
    repositoryPolicy,
  };
}

function passingPolicyInput(): L1ExecutionPolicyInput {
  const repositoryPolicy = selectionAPolicy();
  return {
    classification: "L1",
    gateAutonomyEligible: true,
    currentPrHeadSha: prHead,
    currentBaseHeadSha: baseHead,
    baseBranch: "main",
    changedPaths: ["docs/architecture/example.md"],
    ci: { status: "PASS", headSha: prHead },
    review: { status: "PASS", headSha: prHead, p0: 0, p1: 0 },
    threads: { status: "PASS", headSha: prHead, unresolvedCount: 0 },
    rollback: {
      status: "PASS",
      headSha: prHead,
      fullyRepresentedInGit: true,
      externalMutationOccurred: false,
      irreversibleSideEffectOccurred: false,
      previousRepositoryStateRecoverable: true,
    },
    productionCapabilityDelta: { status: "NONE" },
    repositoryPolicy,
    preMerge: passingPreMerge(repositoryPolicy),
  };
}

function enabledKillSwitch(): KillSwitchEvidence {
  return {
    status: "PASS",
    sourcePath: AUTONOMY_POLICY_PATH,
    baseHeadSha: baseHead,
    l1AutoReady: "ENABLED",
    l1AutoMerge: "DISABLED",
  };
}

function draftTarget(overrides: Partial<ReadyPullRequestTarget> = {}): ReadyPullRequestTarget {
  return {
    owner: "yasutakesougo",
    repo: "severe-behavior-support-spfx",
    pullNumber: 999,
    headSha: prHead,
    isDraft: true,
    ...overrides,
  };
}

function memoryAudit(available = true): {
  sink: { available: boolean; write(record: ReadyAuditRecord): void };
  records: ReadyAuditRecord[];
} {
  const records: ReadyAuditRecord[] = [];
  return {
    records,
    sink: {
      available,
      write(record) {
        records.push(record);
      },
    },
  };
}

describe("executeL1Ready", () => {
  it("dry_run allows without mutation when policy and kill switch pass", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "dry_run",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "DRY_RUN");
    assert.equal(result.mutationAttempted, false);
    assert.equal(mutations, 0);
    assert.equal(result.policy.autoReadyAllowed, true);
    assert.equal(result.policy.autoMergeAllowed, false);
    assert.equal(audit.records.at(-1)?.executorBackendId, L1_READY_EXECUTOR_BACKEND_ID);
    assert.equal(audit.records.at(-1)?.capability, READY_CAPABILITY_ID);
    assert.equal(audit.records.at(-1)?.mutationAttempted, false);
  });

  it("execute calls mutation port once after PREPARED audit", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
      createAuditId: () => "audit-1",
    });

    assert.equal(result.decision, "EXECUTED");
    assert.equal(result.mutationAttempted, true);
    assert.equal(mutations, 1);
    assert.deepEqual(
      audit.records.map((r) => r.decision),
      ["PREPARED", "EXECUTED"],
    );
  });

  it("denies when policy evaluation fails", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: {
        ...passingPolicyInput(),
        changedPaths: ["src/governance/example.ts"],
      },
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("POLICY_DENIED"));
    assert.equal(mutations, 0);
    assert.equal(result.mutationAttempted, false);
  });

  it("denies when kill switch is DISABLED", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: { ...enabledKillSwitch(), l1AutoReady: "DISABLED" },
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("KILL_SWITCH_DISABLED"));
    assert.equal(mutations, 0);
  });

  it("denies when kill switch baseHeadSha mismatches", async () => {
    const audit = memoryAudit();
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: {
        ...enabledKillSwitch(),
        baseHeadSha: "cccccccccccccccccccccccccccccccccccccccc",
      },
      audit: audit.sink,
      mutation: { markReadyForReview() {} },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("KILL_SWITCH_AUTHORITY_UNAVAILABLE"));
  });

  it("denies when audit sink is unavailable", async () => {
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: { available: false, write() {} },
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("AUDIT_UNAVAILABLE"));
    assert.equal(mutations, 0);
  });

  it("returns NO_OP when PR is already non-draft", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget({ isDraft: false }),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "NO_OP");
    assert.ok(result.reasons.includes("ALREADY_READY"));
    assert.equal(mutations, 0);
  });

  it("denies forbidden capabilities such as merge", async () => {
    const audit = memoryAudit();
    let mutations = 0;
    const result = await executeL1Ready({
      mode: "execute",
      capability: "pull_request.merge",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          mutations += 1;
        },
      },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("FORBIDDEN_CAPABILITY"));
    assert.equal(mutations, 0);
  });

  it("denies unknown mode", async () => {
    const audit = memoryAudit();
    const result = await executeL1Ready({
      mode: "maybe",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: { markReadyForReview() {} },
    });

    assert.equal(result.decision, "DENY");
    assert.ok(result.reasons.includes("MODE_INVALID"));
  });

  it("records EXECUTION_FAILED when mutation port throws", async () => {
    const audit = memoryAudit();
    const result = await executeL1Ready({
      mode: "execute",
      target: draftTarget(),
      policyInput: passingPolicyInput(),
      killSwitch: enabledKillSwitch(),
      audit: audit.sink,
      mutation: {
        markReadyForReview() {
          throw new Error("network");
        },
      },
    });

    assert.equal(result.decision, "EXECUTION_FAILED");
    assert.ok(result.reasons.includes("MUTATION_FAILED"));
    assert.equal(result.mutationAttempted, true);
    assert.ok(audit.records.some((r) => r.decision === "PREPARED"));
    assert.ok(audit.records.some((r) => r.decision === "EXECUTION_FAILED"));
  });
});
