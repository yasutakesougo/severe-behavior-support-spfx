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
  it("classifies allowlisted non-behavioral changes as L1", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/architecture/example.md"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "L1",
      reasons: ["L1_ALLOWLIST_ONLY"],
    });
  });

  it("promotes a mixed L1/L2 change to L2", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/example.md", "src/domain/example.ts"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY", "DOMAIN_LOGIC"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.equal(result.classification, "L2");
  });

  it("promotes any L3 changed area over lower-risk categories", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/example.md", ".github/workflows/release.yml"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY", "WORKFLOW_PERMISSION_EXPANSION"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.equal(result.classification, "L3");
  });

  it("classifies a present production capability delta as L3", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["generated/output.ts"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DETERMINISTIC_GENERATED_ARTIFACTS"],
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
      changedFilePaths: ["docs/example.md"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "UNKNOWN" },
    });

    assert.equal(result.classification, "UNKNOWN");
  });

  it("does not classify from a file path without changed-area evidence", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/example.md"],
      diffAvailable: true,
      classificationEvidenceAvailable: true,
      changedAreaCategories: [],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "UNKNOWN",
      reasons: ["CHANGED_AREA_UNRESOLVED"],
    });
  });

  it("fails closed when classification evidence is unavailable", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/example.md"],
      diffAvailable: true,
      classificationEvidenceAvailable: false,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.deepEqual(result, {
      classification: "UNKNOWN",
      reasons: ["CLASSIFICATION_EVIDENCE_MISSING"],
    });
  });

  it("fails closed when diff evidence is unavailable", () => {
    const result = classifyAutonomyChange({
      changedFilePaths: ["docs/example.md"],
      diffAvailable: false,
      classificationEvidenceAvailable: true,
      changedAreaCategories: ["DOCS_ONLY"],
      productionCapabilityDelta: { status: "NONE" },
    });

    assert.equal(result.classification, "UNKNOWN");
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
      productionCapabilityDelta: {
        status: "PRESENT",
        capabilities: ["DEPLOY"],
      },
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
