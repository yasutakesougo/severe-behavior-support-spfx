import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateSupportRecordTraceRef } from "../../src/domain";

const validTrace = {
  RecordId: "REC-000001",
  planId: "PLAN-000001",
  planVersion: 2,
  recordedAt: "2026-08-11T08:00:00+09:00",
  recordedBy: "STF-000001",
};

describe("POST-RA-SUPPORT-TRACE-CONTRACT", () => {
  it("accepts the minimal traceability reference", () => {
    assert.equal(validateSupportRecordTraceRef(validTrace), true);
  });

  it("rejects a missing or empty record identity", () => {
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, RecordId: "" }), false);
    const { RecordId: _RecordId, ...withoutRecordId } = validTrace;
    assert.equal(validateSupportRecordTraceRef(withoutRecordId), false);
  });

  it("requires a non-empty planId and positive integer planVersion", () => {
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, planId: "" }), false);
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, planVersion: 0 }), false);
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, planVersion: 1.5 }), false);
  });

  it("uses the existing ISO datetime boundary for recordedAt", () => {
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, recordedAt: "2026-08-11" }), false);
    assert.equal(
      validateSupportRecordTraceRef({ ...validTrace, recordedAt: "2026-08-11T08:00:00Z" }),
      true,
    );
  });

  it("requires a non-empty recordedBy", () => {
    assert.equal(validateSupportRecordTraceRef({ ...validTrace, recordedBy: " " }), false);
  });

  it("does not require ABC, Observation, workflow, statutory mapping, or persistence fields", () => {
    assert.deepEqual(Object.keys(validTrace).sort(), [
      "RecordId",
      "planId",
      "planVersion",
      "recordedAt",
      "recordedBy",
    ]);
    assert.equal(validateSupportRecordTraceRef(validTrace), true);
  });
});
