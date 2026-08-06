import assert from "node:assert/strict";
import { test } from "node:test";

import { classifyBehaviorScore } from "../../src/domain";
import type { BehaviorScoreInput } from "../../src/domain";

test("fails closed for malformed behavior score state payloads", () => {
  const malformedInputs = [
    null,
    { status: "BROKEN" },
    { status: "NOT_APPLICABLE", reasonCode: "synthetic-not-applicable" },
    { status: "INVALID", reason: "BROKEN" },
    { status: "UNKNOWN", reasonCode: "" },
    { status: "FETCH_FAILED", code: "" },
  ] as unknown as readonly BehaviorScoreInput[];

  for (const input of malformedInputs) {
    assert.deepEqual(classifyBehaviorScore(input), {
      decision: "REJECTED_INVALID_INPUT",
      reason: "MALFORMED_STATE",
    });
  }
});
