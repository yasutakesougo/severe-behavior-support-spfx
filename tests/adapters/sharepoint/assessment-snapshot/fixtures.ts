import type { AssessmentSnapshot } from "../../../../src/domain/assessment-snapshot.js";

/** Synthetic AssessmentSnapshot fixture — no production/pilot records. */
export function validSnapshot(overrides: Partial<AssessmentSnapshot> = {}): AssessmentSnapshot {
  return {
    snapshotId: "snap-001",
    recordStatus: "draft",
    result: "NO_FINDINGS",
    reasonCodes: ["RC_ALPHA", "RC_BETA"],
    ruleSetVersion: "ruleset-1.0.0",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-15",
    inputFingerprint: "fp-synthetic-001",
    ...overrides,
  };
}

export function validFinalizedSnapshot(
  overrides: Partial<AssessmentSnapshot> = {},
): AssessmentSnapshot {
  return validSnapshot({
    recordStatus: "finalized",
    ...overrides,
  });
}
