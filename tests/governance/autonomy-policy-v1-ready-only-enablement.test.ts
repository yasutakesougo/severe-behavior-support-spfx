import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  evaluateL1ExecutionPolicy,
  type L1ExecutionPolicyInput,
  type PreMergeRevalidationEvidence,
  type RepositoryAutonomyPolicyEvidence,
} from "../../src/governance/ai-autonomy-l1-execution-policy.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const policyPath = path.join(repoRoot, "docs/process/autonomy-policy-v1.md");

const prHead = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const baseHead = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

function parseL1EnablementBinding(markdown: string): Record<string, string> {
  const match = markdown.match(
    /BEGIN_L1_ENABLEMENT_BINDING\n([\s\S]*?)\nEND_L1_ENABLEMENT_BINDING/,
  );
  assert.ok(match, "BEGIN_L1_ENABLEMENT_BINDING block must exist");
  const binding: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    assert.ok(eq > 0, `binding line must be key=value: ${trimmed}`);
    binding[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return binding;
}

function selectionAPolicy(policyBaseHead = baseHead): RepositoryAutonomyPolicyEvidence {
  return {
    status: "PASS",
    sourcePath: "docs/process/autonomy-policy-v1.md",
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

function selectionAInput(): L1ExecutionPolicyInput {
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

describe("autonomy-policy-v1 Ready-only enablement（Selection A）", () => {
  it("exposes a parseable L1 enablement binding with Ready-only Selection A shape", () => {
    const markdown = readFileSync(policyPath, "utf8");
    const binding = parseL1EnablementBinding(markdown);

    assert.equal(binding.policyVersion, "AUTONOMY-POLICY-V1");
    assert.equal(binding.enablementUnit, "AI-AUTONOMY-L1-READY-ONLY-POLICY-MUTATION-1");
    assert.equal(binding.repository, "yasutakesougo/severe-behavior-support-spfx");
    assert.equal(binding.environment, "repository-default");
    assert.equal(binding.basisMainSha, "8eca3e08a1aeafa723c649980cc17484e4d54e53");
    assert.equal(binding.selection, "A");
    assert.equal(binding["pull_request.ready"], "AUTO_ALLOWED");
    assert.equal(binding["pull_request.merge"], "HUMAN_ONLY");
    assert.equal(binding.L1_AUTO_READY, "ENABLED");
    assert.equal(binding.L1_AUTO_MERGE, "DISABLED");
    assert.equal(binding.readyExecutor, "L1_READY_EXECUTOR_V1");
    assert.equal(binding.mergeExecutor, "ABSENT");
  });

  it("keeps pull_request.ready out of the HUMAN_ONLY table and merge inside it", () => {
    const markdown = readFileSync(policyPath, "utf8");
    assert.doesNotMatch(
      markdown,
      /\| `pull_request\.ready` \| `HUMAN_ONLY` \|/,
      "ready must not remain HUMAN_ONLY after Ready-only Policy Mutation",
    );
    assert.match(markdown, /\| `pull_request\.ready` \| `AUTO_ALLOWED` \|/);
    assert.match(markdown, /\| `pull_request\.merge` \| `HUMAN_ONLY` \|/);
    assert.match(markdown, /状態: \*\*ACCEPTED \/ READY-ONLY ENABLED（Selection A）\*\*/);
  });

  it("maps Selection A observation to Ready allow / Merge deny under L1 predicates", () => {
    const result = evaluateL1ExecutionPolicy(selectionAInput());
    assert.equal(result.autoReadyAllowed, true);
    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY"));
  });

  it("still denies Ready when observed policy returns Ready to HUMAN_ONLY", () => {
    const repositoryPolicy: RepositoryAutonomyPolicyEvidence = {
      ...selectionAPolicy(),
      ready: "HUMAN_ONLY",
    };
    const result = evaluateL1ExecutionPolicy({
      ...selectionAInput(),
      repositoryPolicy,
      preMerge: passingPreMerge(repositoryPolicy),
    });
    assert.equal(result.autoReadyAllowed, false);
    assert.equal(result.autoMergeAllowed, false);
    assert.ok(result.reasons.includes("REPOSITORY_AUTONOMY_POLICY_HUMAN_ONLY"));
  });
});
