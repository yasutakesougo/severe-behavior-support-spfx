import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyExecutionSubmission,
  evaluateAccess,
  type AuthenticatedIdentity,
  type ExecutionRecord,
  type LookupResult,
} from "../../src/contracts";
import { syntheticContext, syntheticIdentity, syntheticRecord } from "./fixtures";

test("fails closed instead of throwing for malformed identity values", () => {
  const malformedIdentities: readonly unknown[] = [
    null,
    { ...syntheticIdentity, Subject: 123 },
    { ...syntheticIdentity, Roles: undefined },
  ];

  for (const malformed of malformedIdentities) {
    const identity = {
      status: "FOUND",
      value: malformed as AuthenticatedIdentity,
    } as LookupResult<AuthenticatedIdentity>;

    assert.deepEqual(
      evaluateAccess({ context: syntheticContext, identity, requiredRoles: ["SUPPORTER"] }),
      { decision: "DENY", reason: "INVALID_IDENTITY" },
    );
  }
});

test("fails closed for malformed FOUND execution records", () => {
  const malformedStoredRecord = {
    ...syntheticRecord,
    UserId: "",
  } as ExecutionRecord;

  assert.deepEqual(
    classifyExecutionSubmission(
      {
        byRecordId: { status: "FOUND", value: malformedStoredRecord },
        byIdempotencyKey: { status: "EMPTY" },
      },
      syntheticRecord,
    ),
    { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "INVALID_LOOKUP_RESULT" },
  );
});
