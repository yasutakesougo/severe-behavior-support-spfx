import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  evaluateL1ExecutionPolicy,
  type L1ExecutionPolicyInput,
  type PreMergeRevalidationEvidence,
  type RepositoryAutonomyPolicyEvidence,
} from "../../src/governance/ai-autonomy-l1-execution-policy.js";

const prHead = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const baseHead = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

function autoAllowedPolicy(policyBaseHead = baseHead): RepositoryAutonomyPolicyEvidence {
  return {
    status: "PASS",
    sourcePath: "docs/process/autonomy-policy-v1.md",
    baseHeadSha: policyBaseHead,
    ready: "AUTO_ALLOWED",
    merge: "AUTO_ALLOWED",
  };
}

function passingPreMerge(): PreMergeRevalidationEvidence {
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
    repositoryPolicy: autoAllowedPolicy(),
  };
}

function passingInput(): L1ExecutionPolicyInput {
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
    repositoryPolicy: autoAllowedPolicy(),
    preMerge: passingPreMerge(),
  };
}

describe("evaluateL1ExecutionPolicy", () => {
  it("allows synthetic L1 ready and merge only when every predicate passes", () => {
    assert.deepEqual(evaluateL1ExecutionPolicy(passingInput()), {
      autoReadyAllowed: true,
      autoMergeAllowed: true,
      reasons: [],
    });
  });

  it("denies every self-governance surface regardless of L1 classification", () => {
    const paths = [
      "src/governance/example.ts",
      "tests/governance/example.test.ts",
      ".github/workflows/release.yml",
      "docs/process/autonomy-policy-v1.md",
      "docs/architecture/decision-autonomy-policy-v1-selection.md",
      "docs/architecture/ai-autonomy-l1-execution-policy-exact-slice-definition-1.md",
      "docs/decisions/DEC-AA-001.md",
      "docs/decisions/DEC-AA-003.md",
      "docs/decisions/DEC-AI-ORG-003.md",
      "docs/process/low-auto-pilot-v1.md",
      "docs/process/routine-aug-v1.md",
      "docs/process/fast-lane-v1.md",
      "docs/process/process-optimization-v1.md",
      "docs/process/self-referential-gate-policy.md",
    ];

    for (const path of paths) {
      const result = evaluateL1ExecutionPolicy({ ...passingInput(), changedPaths: [path] });
      assert.equal(result.autoReadyAllowed, false, path);
      assert.equal(result.autoMergeAllowed, false, path);
      assert.ok(result.reasons.includes("SELF_GOVERNANCE_CHANGE"), path);
    }
  });

  it("denies non-L1 or gate-ineligible changes", () => {
    const classResult = evaluateL1ExecutionPolicy({ ...passingInput(), classification: "L2" });
    assert.equal(classResult.autoReadyAllowed, false);
    assert.ok(classResult.reasons.includes("CLASS_NOT_L1"));

    const gateResult = evaluateL1ExecutionPolicy({
      ...passingInput(),
      gateAutonomyEligible: false,
    });
    assert.equal(gateResult.autoReadyAllowed, false);
    assert.ok(gateResult.reasons.includes("GATE_NOT_ELIGIBLE"));
  });

  it("hard-allows only main as the integration branch", () => {
    const result = evaluateL1ExecutionPolicy({ ...passingInput(), baseBranch: "release" });
    assert.equal(result.autoReadyAllowed, false);
    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("INTEGRATION_BRANCH_NOT_ALLOWED"));
  });

  it("denies HUMAN_ONLY and NOT_ENABLED repository policy states", () => {
    const humanOnly = evaluateL1ExecutionPolicy({
      ...passingInput(),
      repositoryPolicy: {
        ...autoAllowedPolicy(),
        ready: "HUMAN_ONLY",
        merge: "HUMAN_ONLY",
      },
    });
    assert.equal(humanOnly.autoReadyAllowed, false);
    assert.ok(humanOnly.reasons.includes("REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY"));

    const notEnabled = evaluateL1ExecutionPolicy({
      ...passingInput(),
      repositoryPolicy: {
        ...autoAllowedPolicy(),
        ready: "NOT_ENABLED",
        merge: "NOT_ENABLED",
      },
    });
    assert.equal(notEnabled.autoReadyAllowed, false);
    assert.ok(notEnabled.reasons.includes("REPOSITORY_AUTONOMY_POLICY_NOT_ENABLED"));
  });

  it("accepts policy authority only from the fixed Git-managed path and current base HEAD", () => {
    const wrongPath = evaluateL1ExecutionPolicy({
      ...passingInput(),
      repositoryPolicy: {
        ...autoAllowedPolicy(),
        sourcePath: "docs/process/untrusted.md",
      },
    });
    assert.equal(wrongPath.autoReadyAllowed, false);
    assert.ok(wrongPath.reasons.includes("REPOSITORY_AUTONOMY_POLICY_AUTHORITY_UNAVAILABLE"));

    const staleBase = evaluateL1ExecutionPolicy({
      ...passingInput(),
      repositoryPolicy: autoAllowedPolicy("cccccccccccccccccccccccccccccccccccccccc"),
    });
    assert.equal(staleBase.autoReadyAllowed, false);
    assert.ok(staleBase.reasons.includes("REPOSITORY_AUTONOMY_POLICY_AUTHORITY_UNAVAILABLE"));
  });

  it("fails ready closed on non-green, unresolved, mismatched, production, or rollback evidence", () => {
    const input = passingInput();
    const result = evaluateL1ExecutionPolicy({
      ...input,
      ci: { status: "STALE", headSha: prHead },
      review: { status: "PASS", headSha: prHead, p0: 0, p1: 1 },
      threads: { status: "PASS", headSha: prHead, unresolvedCount: 1 },
      rollback: {
        ...input.rollback,
        headSha: "dddddddddddddddddddddddddddddddddddddddd",
        externalMutationOccurred: true,
      },
      productionCapabilityDelta: { status: "UNKNOWN" },
    });

    assert.equal(result.autoReadyAllowed, false);
    assert.ok(result.reasons.includes("CI_NOT_GREEN"));
    assert.ok(result.reasons.includes("EVIDENCE_STALE"));
    assert.ok(result.reasons.includes("REVIEW_NOT_CLEARED"));
    assert.ok(result.reasons.includes("UNRESOLVED_THREADS_PRESENT"));
    assert.ok(result.reasons.includes("HEAD_EVIDENCE_MISMATCH"));
    assert.ok(result.reasons.includes("PRODUCTION_CAPABILITY_DELTA_UNKNOWN"));
    assert.ok(result.reasons.includes("ROLLBACK_UNAVAILABLE"));
  });

  it("requires fresh pre-merge evidence before merge can be allowed", () => {
    const result = evaluateL1ExecutionPolicy({ ...passingInput(), preMerge: undefined });
    assert.equal(result.autoReadyAllowed, true);
    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("PRE_MERGE_REVALIDATION_FAILED"));
    assert.ok(result.reasons.includes("EVIDENCE_MISSING"));
  });

  it("denies merge on PR HEAD mismatch, non-mergeable state, bad CI, review, or threads", () => {
    const preMerge = passingPreMerge();
    const result = evaluateL1ExecutionPolicy({
      ...passingInput(),
      preMerge: {
        ...preMerge,
        currentPrHeadSha: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        mergeable: null,
        ci: { status: "FAIL", headSha: prHead },
        review: { status: "PASS", headSha: prHead, p0: 1, p1: 0 },
        threads: { status: "PASS", headSha: prHead, unresolvedCount: 2 },
      },
    });

    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("HEAD_EVIDENCE_MISMATCH"));
    assert.ok(result.reasons.includes("MERGEABILITY_NOT_TRUE"));
    assert.ok(result.reasons.includes("CI_NOT_GREEN"));
    assert.ok(result.reasons.includes("REVIEW_NOT_CLEARED"));
    assert.ok(result.reasons.includes("UNRESOLVED_THREADS_PRESENT"));
  });

  it("denies base drift until base-relative evidence is freshly revalidated", () => {
    const advancedBase = "ffffffffffffffffffffffffffffffffffffffff";
    const preMerge = passingPreMerge();
    const result = evaluateL1ExecutionPolicy({
      ...passingInput(),
      preMerge: {
        ...preMerge,
        currentBaseHeadSha: advancedBase,
        readyTimeBaseHeadSha: baseHead,
        baseRelativeEvidenceRevalidated: false,
        repositoryPolicy: autoAllowedPolicy(advancedBase),
      },
    });

    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("BASE_HEAD_DRIFTED"));
    assert.ok(result.reasons.includes("EVIDENCE_STALE"));
  });

  it("permits a base advance only after fresh base-relative revalidation passes", () => {
    const advancedBase = "ffffffffffffffffffffffffffffffffffffffff";
    const preMerge = passingPreMerge();
    const result = evaluateL1ExecutionPolicy({
      ...passingInput(),
      preMerge: {
        ...preMerge,
        currentBaseHeadSha: advancedBase,
        readyTimeBaseHeadSha: baseHead,
        baseRelativeEvidenceRevalidated: true,
        repositoryPolicy: autoAllowedPolicy(advancedBase),
      },
    });

    assert.equal(result.autoReadyAllowed, true);
    assert.equal(result.autoMergeAllowed, true);
    assert.equal(result.reasons.length, 0);
  });
});
