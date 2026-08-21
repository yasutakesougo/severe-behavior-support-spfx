import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyAutonomyChange,
  evaluateAutonomyGate,
  type GateEvaluatorInput,
} from "../../src/governance/ai-autonomy-classifier-gate-evaluator.js";

const head = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

function passingGateInput(): GateEvaluatorInput {
  return {
    classification: "L1",
    currentHeadSha: head,
    productionCapabilityDelta: { status: "NONE" },
    evidence: {
      scope: { status: "PASS", headSha: head },
      ci: { status: "PASS", headSha: head },
      tests: { status: "PASS", headSha: head },
      contracts: { status: "PASS", headSha: head },
      review: { status: "PASS", headSha: head, p0: 0, p1: 0 },
      prohibitedPathCheck: { status: "PASS", headSha: head },
      rollbackEvidence: {
        status: "PASS",
        headSha: head,
        fullyRepresentedInGit: true,
        externalMutationOccurred: false,
        irreversibleSideEffectOccurred: false,
        previousRepositoryStateRecoverable: true,
      },
    },
  };
}

describe("classifyAutonomyChange", () => {
  it("classifies positively proven docs-only changes as L1", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "docs/architecture/example.md", patch: "+example" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "L1",
      reasons: ["L1_ALLOWLIST_ONLY"],
    });
  });

  it("does not let caller-supplied DOCS_ONLY downgrade a src change", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "src/domain/example.ts", patch: "+behavior" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "L2",
      reasons: ["L2_BEHAVIORAL_CHANGE"],
    });
  });

  it("promotes a mixed docs/src change to L2", () => {
    const result = classifyAutonomyChange({
      changedFiles: [
        { path: "docs/example.md", patch: "+docs" },
        { path: "src/domain/example.ts", patch: "+behavior" },
      ],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY", "DOMAIN_LOGIC"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.equal(result.classification, "L2");
  });

  it("promotes workflow changes to L3 even when caller labels them L1", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: ".github/workflows/release.yml", patch: "+permissions: write-all" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.equal(result.classification, "L3");
  });

  it("classifies a present production capability delta as L3", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "docs/example.md", patch: "+example" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: {
        status: "PRESENT",
        capabilities: ["LIVE_CREATE"],
      },
    });

    assert.deepEqual(result, {
      classification: "L3",
      reasons: ["PRODUCTION_CAPABILITY_DELTA_PRESENT"],
    });
  });

  it("fails closed when production capability delta is unknown", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "docs/example.md", patch: "+example" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "UNKNOWN" },
    });

    assert.equal(result.classification, "UNKNOWN");
  });

  it("fails closed when any changed-file diff is unavailable", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "docs/example.md", patch: null }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "UNKNOWN",
      reasons: ["DIFF_UNAVAILABLE"],
    });
  });

  it("fails closed for an unrecognized path even if caller labels it L1", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "unknown-area/example.txt", patch: "+example" }],
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "UNKNOWN",
      reasons: ["CHANGED_AREA_UNRESOLVED"],
    });
  });

  it("fails closed when classification evidence is unavailable", () => {
    const result = classifyAutonomyChange({
      changedFiles: [{ path: "docs/example.md", patch: "+example" }],
      classificationEvidenceAvailable: false,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "UNKNOWN",
      reasons: ["CLASSIFICATION_EVIDENCE_MISSING"],
    });
  });
});

describe("evaluateAutonomyGate", () => {
  it("allows L1 only when every required gate condition passes", () => {
    const result = evaluateAutonomyGate(passingGateInput());
    assert.deepEqual(result, { autonomyEligible: true, reasons: [] });
  });

  it("keeps L2 ineligible even when all evidence passes", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({ ...input, classification: "L2" });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("CLASS_L2"));
  });

  it("keeps L3 ineligible even when all evidence passes", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({ ...input, classification: "L3" });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("CLASS_L3"));
  });

  it("fails closed for UNKNOWN classification", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({ ...input, classification: "UNKNOWN" });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("CLASS_UNKNOWN"));
  });

  it("rejects evidence bound to a different HEAD", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      evidence: {
        ...input.evidence,
        ci: { status: "PASS", headSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" },
      },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("HEAD_EVIDENCE_MISMATCH"));
  });

  it("rejects missing, stale, unparseable, and indeterminate evidence", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      evidence: {
        ...input.evidence,
        scope: { status: "MISSING" },
        ci: { status: "STALE", headSha: head },
        tests: { status: "UNPARSEABLE", headSha: head },
        contracts: { status: "INDETERMINATE", headSha: head },
      },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("EVIDENCE_MISSING"));
    assert.ok(result.reasons.includes("EVIDENCE_STALE"));
    assert.ok(result.reasons.includes("EVIDENCE_UNPARSEABLE"));
    assert.ok(result.reasons.includes("EVIDENCE_INDETERMINATE"));
  });

  it("rejects P0 or P1 findings", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      evidence: {
        ...input.evidence,
        review: { status: "PASS", headSha: head, p0: 1, p1: 2 },
      },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("P0_PRESENT"));
    assert.ok(result.reasons.includes("P1_PRESENT"));
  });

  it("rejects a production capability delta", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      productionCapabilityDelta: { status: "PRESENT", capabilities: ["DEPLOY"] },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("PRODUCTION_CAPABILITY_DELTA_PRESENT"));
  });

  it("rejects unknown production capability delta", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      productionCapabilityDelta: { status: "UNKNOWN" },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("PRODUCTION_CAPABILITY_DELTA_UNKNOWN"));
  });

  it("rejects rollback evidence with an external mutation", () => {
    const input = passingGateInput();
    const result = evaluateAutonomyGate({
      ...input,
      evidence: {
        ...input.evidence,
        rollbackEvidence: {
          ...input.evidence.rollbackEvidence,
          externalMutationOccurred: true,
        },
      },
    });
    assert.equal(result.autonomyEligible, false);
    assert.ok(result.reasons.includes("ROLLBACK_UNAVAILABLE"));
  });
});
