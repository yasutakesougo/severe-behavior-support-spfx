import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  toAssessmentSnapshotResultCandidate,
  ASSESSMENT_SNAPSHOT_RESULTS,
  EVALUATION_DECISIONS,
  decideFindingGeneration,
} from "../../src/domain";

describe("AssessmentSnapshot Result Conversion Contract", () => {
  it("永続Result候補の値集合を固定する", () => {
    assert.deepEqual([...ASSESSMENT_SNAPSHOT_RESULTS], [
      "NO_FINDINGS",
      "FINDINGS_PRESENT",
      "NOT_APPLICABLE",
    ]);
  });

  it("EvaluationDecision入力値集合を再定義せず固定する", () => {
    assert.deepEqual([...EVALUATION_DECISIONS], [
      "NO_FINDINGS",
      "FINDINGS_PRESENT",
      "INDETERMINATE",
      "NOT_APPLICABLE",
      "SOURCE_UNAVAILABLE",
    ]);
  });

  it("NO_FINDINGS / FINDINGS_PRESENT をPERSISTABLEへ変換する", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NO_FINDINGS",
      }),
      {
        ok: true,
        persistable: true,
        result: "NO_FINDINGS",
        reasonCodes: [],
      }
    );
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "FINDINGS_PRESENT",
        reasonCodes: ["SYNTHETIC_REASON_OPTIONAL_001"],
      }),
      {
        ok: true,
        persistable: true,
        result: "FINDINGS_PRESENT",
        reasonCodes: ["SYNTHETIC_REASON_OPTIONAL_001"],
      }
    );
  });

  it("NOT_APPLICABLEはreasonCodes必須でPERSISTABLEにする", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NOT_APPLICABLE",
        reasonCodes: ["SYNTHETIC_NOT_APPLICABLE_001"],
      }),
      {
        ok: true,
        persistable: true,
        result: "NOT_APPLICABLE",
        reasonCodes: ["SYNTHETIC_NOT_APPLICABLE_001"],
      }
    );
  });

  it("NOT_APPLICABLEでreasonCodes不足ならMISSING_REASON_CODESとする", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NOT_APPLICABLE",
      }),
      { ok: false, code: "MISSING_REASON_CODES" }
    );
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NOT_APPLICABLE",
        reasonCodes: [],
      }),
      { ok: false, code: "MISSING_REASON_CODES" }
    );
  });

  it("INDETERMINATE / SOURCE_UNAVAILABLE をNOT_PERSISTABLEへ倒す", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "INDETERMINATE",
      }),
      {
        ok: true,
        persistable: false,
        reason: "INDETERMINATE",
      }
    );
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "SOURCE_UNAVAILABLE",
      }),
      {
        ok: true,
        persistable: false,
        reason: "SOURCE_UNAVAILABLE",
      }
    );
  });

  it("SOURCE_UNAVAILABLE / INDETERMINATE を永続Resultへ変換しない", () => {
    for (const decision of ["SOURCE_UNAVAILABLE", "INDETERMINATE"] as const) {
      const result = toAssessmentSnapshotResultCandidate({
        evaluationDecision: decision,
      });
      assert.equal(result.ok, true);
      if (!result.ok) {
        return;
      }
      assert.equal(result.persistable, false);
      assert.equal("result" in result, false);
    }
  });

  it("demo / retrieval_failed / 未知DecisionをMALFORMED_INPUTとして拒否する", () => {
    for (const evaluationDecision of [
      "demo",
      "retrieval_failed",
      "UNKNOWN_DECISION",
      123,
      null,
    ]) {
      assert.deepEqual(
        toAssessmentSnapshotResultCandidate({ evaluationDecision }),
        { ok: false, code: "MALFORMED_INPUT" }
      );
    }
    assert.deepEqual(toAssessmentSnapshotResultCandidate(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(toAssessmentSnapshotResultCandidate({}), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("不正reasonCodesをMALFORMED_INPUTとして拒否する", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NO_FINDINGS",
        reasonCodes: "SYNTHETIC_REASON_001",
      }),
      { ok: false, code: "MALFORMED_INPUT" }
    );
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "FINDINGS_PRESENT",
        reasonCodes: ["not-a-reason-code"],
      }),
      { ok: false, code: "MALFORMED_INPUT" }
    );
  });

  it("reasonCodesの重複を除去して出現順を維持する", () => {
    assert.deepEqual(
      toAssessmentSnapshotResultCandidate({
        evaluationDecision: "NOT_APPLICABLE",
        reasonCodes: [
          "SYNTHETIC_REASON_A",
          "SYNTHETIC_REASON_B",
          "SYNTHETIC_REASON_A",
        ],
      }),
      {
        ok: true,
        persistable: true,
        result: "NOT_APPLICABLE",
        reasonCodes: ["SYNTHETIC_REASON_A", "SYNTHETIC_REASON_B"],
      }
    );
  });

  it("decideFindingGenerationを呼び出さず独立して動作する", () => {
    const before = decideFindingGeneration({
      criteria: [{ criterionId: "synthetic-criterion-001", status: "FAIL" }],
    });
    const converted = toAssessmentSnapshotResultCandidate({
      evaluationDecision: "FINDINGS_PRESENT",
    });
    const after = decideFindingGeneration({
      criteria: [{ criterionId: "synthetic-criterion-001", status: "FAIL" }],
    });

    assert.deepEqual(converted, {
      ok: true,
      persistable: true,
      result: "FINDINGS_PRESENT",
      reasonCodes: [],
    });
    assert.deepEqual(before, after);
    assert.deepEqual(before, { ok: true, decision: "GENERATE_REQUIRED" });
  });
});
