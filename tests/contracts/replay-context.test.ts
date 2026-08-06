import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyExecutionSubmission, type ExecutionRecord } from "../../src/contracts";
import { syntheticProcedure, syntheticRecord } from "./fixtures";

const contextMismatches: readonly ExecutionRecord[] = [
  { ...syntheticRecord, UserId: "synthetic-user-002" },
  { ...syntheticRecord, SiteId: "synthetic-site-002" },
  {
    ...syntheticRecord,
    Procedure: { ...syntheticProcedure, ProcedureVersion: "synthetic-version-002" },
  },
];

test("rejects duplicate replay when immutable record context differs", () => {
  for (const incoming of contextMismatches) {
    assert.deepEqual(
      classifyExecutionSubmission(
        {
          byRecordId: { status: "FOUND", value: syntheticRecord },
          byIdempotencyKey: { status: "FOUND", value: syntheticRecord },
        },
        incoming,
      ),
      {
        decision: "REJECT_DUPLICATE_CONFLICT",
        RecordId: syntheticRecord.RecordId,
        reason: "RECORD_CONTEXT_MISMATCH",
      },
    );
  }
});
