import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateRetentionCompleteDeletionProhibitionPolicy,
  validateReviewMonitoringGuidancePolicy,
} from "../../src/domain";

const acceptedRetentionCompleteDeletionProhibitionPolicy = {
  kind: "retention_complete_deletion_prohibited" as const,
  retentionYears: 5 as const,
  duringRetentionCompleteDeletion: "prohibited" as const,
  afterRetentionDeletionPermissibility: "separate_decision" as const,
  automaticCompleteDeletionAfterRetention: "not_adopted" as const,
  automaticPhysicalDeletionExecution: "not_adopted" as const,
};

const acceptedReviewMonitoringGuidancePolicy = {
  kind: "informational_cadence_guide" as const,
  guideText: "3か月に1回程度" as const,
  purpose: "display_and_notify_as_guide" as const,
  institutionalReviewCadence: "maintained" as const,
  overdueState: "not_adopted" as const,
  overdueWarning: "not_adopted" as const,
  overdueBusinessRestriction: "not_adopted" as const,
  fixedNinetyDays: "not_adopted" as const,
  hardDueOverdue: "not_adopted" as const,
};

describe("Retention complete-deletion prohibition contract (GOV-AUD-05 / DEC-012)", () => {
  it("accepts the Accepted RetentionCompleteDeletionProhibitionPolicy literals", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy(
        acceptedRetentionCompleteDeletionProhibitionPolicy,
      ),
      {
        ok: true,
        retentionCompleteDeletionProhibitionPolicy:
          acceptedRetentionCompleteDeletionProhibitionPolicy,
      },
    );
  });

  it("rejects missing kind", () => {
    const { kind: _kind, ...rest } = acceptedRetentionCompleteDeletionProhibitionPolicy;
    assert.deepEqual(validateRetentionCompleteDeletionProhibitionPolicy(rest), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("rejects incorrect retentionYears", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy({
        ...acceptedRetentionCompleteDeletionProhibitionPolicy,
        retentionYears: 7,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects duringRetentionCompleteDeletion allowed", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy({
        ...acceptedRetentionCompleteDeletionProhibitionPolicy,
        duringRetentionCompleteDeletion: "allowed",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects afterRetentionDeletionPermissibility closed", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy({
        ...acceptedRetentionCompleteDeletionProhibitionPolicy,
        afterRetentionDeletionPermissibility: "allowed",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects automaticCompleteDeletionAfterRetention adopted", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy({
        ...acceptedRetentionCompleteDeletionProhibitionPolicy,
        automaticCompleteDeletionAfterRetention: "adopted",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed and non-record input fail-closed", () => {
    assert.deepEqual(validateRetentionCompleteDeletionProhibitionPolicy(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(validateRetentionCompleteDeletionProhibitionPolicy(undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy("retention_complete_deletion_prohibited"),
      {
        ok: false,
        code: "MALFORMED_INPUT",
      },
    );
  });

  it("rejects unknown keys fail-closed", () => {
    assert.deepEqual(
      validateRetentionCompleteDeletionProhibitionPolicy({
        ...acceptedRetentionCompleteDeletionProhibitionPolicy,
        purgeJobEnabled: true,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("leaves ReviewMonitoringGuidancePolicy validation unchanged", () => {
    assert.deepEqual(
      validateReviewMonitoringGuidancePolicy(acceptedReviewMonitoringGuidancePolicy),
      {
        ok: true,
        reviewMonitoringGuidancePolicy: acceptedReviewMonitoringGuidancePolicy,
      },
    );
  });
});
