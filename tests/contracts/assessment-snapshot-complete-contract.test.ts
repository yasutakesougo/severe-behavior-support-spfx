import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ASSESSMENT_SNAPSHOT_RECORD_STATUSES,
  ASSESSMENT_SNAPSHOT_RESULTS,
  toAssessmentSnapshotResultCandidate,
  validateAssessmentSnapshot,
  type AssessmentSnapshot,
} from "../../src/domain";

const baseFields = {
  ruleSetVersion: "synthetic-ruleset-001",
  periodStart: "2099-01-01",
  periodEnd: "2099-01-31",
  inputFingerprint: "synthetic-input-fingerprint-001",
} as const;

function draftFixture(
  overrides: Partial<AssessmentSnapshot> & Pick<AssessmentSnapshot, "snapshotId" | "result">,
): AssessmentSnapshot {
  return {
    snapshotId: overrides.snapshotId,
    recordStatus: overrides.recordStatus ?? "draft",
    result: overrides.result,
    reasonCodes: overrides.reasonCodes ?? [],
    ruleSetVersion: overrides.ruleSetVersion ?? baseFields.ruleSetVersion,
    periodStart: overrides.periodStart ?? baseFields.periodStart,
    periodEnd: overrides.periodEnd ?? baseFields.periodEnd,
    inputFingerprint: overrides.inputFingerprint ?? baseFields.inputFingerprint,
    ...(overrides.findingIds !== undefined ? { findingIds: overrides.findingIds } : {}),
    ...(overrides.supersedesSnapshotId !== undefined
      ? { supersedesSnapshotId: overrides.supersedesSnapshotId }
      : {}),
  };
}

describe("AssessmentSnapshot Complete Contract (PR-J)", () => {
  it("recordStatus 値集合を draft / finalized に固定する", () => {
    assert.deepEqual([...ASSESSMENT_SNAPSHOT_RECORD_STATUSES], ["draft", "finalized"]);
  });

  it("永続 Result 3 値を Result 変換と共有する", () => {
    assert.deepEqual(
      [...ASSESSMENT_SNAPSHOT_RESULTS],
      ["NO_FINDINGS", "FINDINGS_PRESENT", "NOT_APPLICABLE"],
    );
  });

  it("draft 合成 fixture を受理する", () => {
    const draft = draftFixture({
      snapshotId: "synthetic-snapshot-draft-001",
      result: "NO_FINDINGS",
      recordStatus: "draft",
    });
    assert.deepEqual(validateAssessmentSnapshot(draft), { ok: true, snapshot: draft });
  });

  it("finalized 合成 fixture を受理する", () => {
    const finalized = draftFixture({
      snapshotId: "synthetic-snapshot-finalized-001",
      result: "FINDINGS_PRESENT",
      recordStatus: "finalized",
      reasonCodes: ["SYNTHETIC_REASON_OPTIONAL_001"],
    });
    assert.deepEqual(validateAssessmentSnapshot(finalized), { ok: true, snapshot: finalized });
  });

  it("corrected-new-version 合成 fixture を受理する", () => {
    const corrected = draftFixture({
      snapshotId: "synthetic-snapshot-corrected-001",
      result: "NOT_APPLICABLE",
      recordStatus: "finalized",
      reasonCodes: ["SYNTHETIC_NOT_APPLICABLE_001"],
      supersedesSnapshotId: "synthetic-snapshot-original-001",
    });
    assert.deepEqual(validateAssessmentSnapshot(corrected), { ok: true, snapshot: corrected });
  });

  it("findingIds は OPTIONAL（未指定でも受理する）", () => {
    const withoutFindingIds = draftFixture({
      snapshotId: "synthetic-snapshot-no-findings-ids-001",
      result: "FINDINGS_PRESENT",
      recordStatus: "finalized",
    });
    assert.equal("findingIds" in withoutFindingIds, false);
    assert.deepEqual(validateAssessmentSnapshot(withoutFindingIds), {
      ok: true,
      snapshot: withoutFindingIds,
    });
  });

  it("findingIds がある場合は非空文字列配列として受理する", () => {
    const withFindingIds = draftFixture({
      snapshotId: "synthetic-snapshot-optional-finding-ids-001",
      result: "FINDINGS_PRESENT",
      recordStatus: "finalized",
      findingIds: ["synthetic-finding-001", "synthetic-finding-002"],
    });
    assert.deepEqual(validateAssessmentSnapshot(withFindingIds), {
      ok: true,
      snapshot: withFindingIds,
    });
  });

  it("NOT_APPLICABLE で reasonCodes 不足なら MISSING_REASON_CODES", () => {
    assert.deepEqual(
      validateAssessmentSnapshot(
        draftFixture({
          snapshotId: "synthetic-snapshot-missing-reason-001",
          result: "NOT_APPLICABLE",
          recordStatus: "finalized",
          reasonCodes: [],
        }),
      ),
      { ok: false, code: "MISSING_REASON_CODES" },
    );
  });

  it("demo / retrieval_failed / INDETERMINATE / SOURCE_UNAVAILABLE を FORBIDDEN_RESULT として拒否する", () => {
    for (const result of ["demo", "retrieval_failed", "INDETERMINATE", "SOURCE_UNAVAILABLE"]) {
      assert.deepEqual(
        validateAssessmentSnapshot({
          snapshotId: "synthetic-snapshot-forbidden-001",
          recordStatus: "finalized",
          result,
          reasonCodes: [],
          ...baseFields,
        }),
        { ok: false, code: "FORBIDDEN_RESULT" },
      );
    }
  });

  it("未知 Result / 不正期間 / 未知キーを MALFORMED_INPUT として拒否する", () => {
    assert.deepEqual(
      validateAssessmentSnapshot({
        snapshotId: "synthetic-snapshot-unknown-result-001",
        recordStatus: "finalized",
        result: "UNKNOWN_RESULT",
        reasonCodes: [],
        ...baseFields,
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      validateAssessmentSnapshot(
        draftFixture({
          snapshotId: "synthetic-snapshot-bad-period-001",
          result: "NO_FINDINGS",
          periodStart: "2099-02-01",
          periodEnd: "2099-01-01",
        }),
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      validateAssessmentSnapshot({
        ...draftFixture({
          snapshotId: "synthetic-snapshot-unknown-key-001",
          result: "NO_FINDINGS",
        }),
        schemaId: "invented-schema-id",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("訂正リンク不正（自己参照 / draft 訂正版）を INVALID_CORRECTION_LINK として拒否する", () => {
    assert.deepEqual(
      validateAssessmentSnapshot(
        draftFixture({
          snapshotId: "synthetic-snapshot-self-correct-001",
          result: "NO_FINDINGS",
          recordStatus: "finalized",
          supersedesSnapshotId: "synthetic-snapshot-self-correct-001",
        }),
      ),
      { ok: false, code: "INVALID_CORRECTION_LINK" },
    );
    assert.deepEqual(
      validateAssessmentSnapshot(
        draftFixture({
          snapshotId: "synthetic-snapshot-draft-correct-001",
          result: "NO_FINDINGS",
          recordStatus: "draft",
          supersedesSnapshotId: "synthetic-snapshot-original-001",
        }),
      ),
      { ok: false, code: "INVALID_CORRECTION_LINK" },
    );
  });

  it("Result 変換 PERSISTABLE 出力を完全契約 result / reasonCodes へ接続できる", () => {
    const converted = toAssessmentSnapshotResultCandidate({
      evaluationDecision: "NOT_APPLICABLE",
      reasonCodes: ["SYNTHETIC_NOT_APPLICABLE_002"],
    });
    assert.equal(converted.ok, true);
    assert.equal(converted.ok && converted.persistable, true);
    if (!converted.ok || !converted.persistable) {
      return;
    }

    const snapshot = draftFixture({
      snapshotId: "synthetic-snapshot-from-conversion-001",
      result: converted.result,
      reasonCodes: converted.reasonCodes,
      recordStatus: "finalized",
    });
    assert.deepEqual(validateAssessmentSnapshot(snapshot), { ok: true, snapshot });
  });

  it("Result 変換純関数の既存契約を壊さない", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NO_FINDINGS",
      }),
      {
        ok: true,
        persistable: true,
        result: "NO_FINDINGS",
        reasonCodes: [],
      },
    );
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "SOURCE_UNAVAILABLE",
      }),
      {
        ok: true,
        persistable: false,
        reason: "SOURCE_UNAVAILABLE",
      },
    );
  });
});
