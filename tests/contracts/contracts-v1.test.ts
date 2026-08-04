import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyExecutionSubmission,
  evaluateAccess,
  parseLocalDate,
  validateApprovedProcedureReference,
  validateDeploymentContext,
  validateExecutionRecord,
} from "../../src/contracts";
import { syntheticContext, syntheticIdentity, syntheticProcedure, syntheticRecord } from "./fixtures";

test("accepts a complete DeploymentContext with required organization and site", () => {
  const result = validateDeploymentContext(syntheticContext);
  assert.equal(result.ok, true);
});

test("rejects a DeploymentContext with missing organization or site", () => {
  const result = validateDeploymentContext({ OrganizationId: "", TimeZone: "Asia/Tokyo" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(result.errors.map((item) => item.path), ["OrganizationId", "SiteId"]);
});

test("accepts only an ISO calendar date interpreted under Asia/Tokyo", () => {
  assert.equal(parseLocalDate("2099-01-01").ok, true);
  assert.equal(parseLocalDate("2099-02-29").ok, false);
  assert.equal(parseLocalDate("2099-01-01T00:00:00+09:00").ok, false);
});

test("accepts approved procedure references and rejects non-approved states", () => {
  assert.equal(validateApprovedProcedureReference(syntheticProcedure).ok, true);
  const result = validateApprovedProcedureReference({
    ProcedureId: "synthetic-procedure-001",
    ProcedureVersion: "synthetic-version-001",
    ApprovalState: "DRAFT",
  });
  assert.equal(result.ok, false);
});

test("allows a matching identity with an allowed role", () => {
  assert.deepEqual(
    evaluateAccess({ context: syntheticContext, identity: { status: "FOUND", value: syntheticIdentity }, requiredRoles: ["SUPPORTER"] }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
});

test("fails closed for empty, unknown, fetch failure, mismatch, and unknown role", () => {
  assert.equal(
    evaluateAccess({ context: syntheticContext, identity: { status: "EMPTY" }, requiredRoles: ["SUPPORTER"] }).decision,
    "DENY",
  );
  assert.equal(
    evaluateAccess({ context: syntheticContext, identity: { status: "UNKNOWN", reason: "INDETERMINATE" }, requiredRoles: ["SUPPORTER"] }).reason,
    "AUTH_UNKNOWN",
  );
  assert.equal(
    evaluateAccess({ context: syntheticContext, identity: { status: "FETCH_FAILED", code: "synthetic-fetch-failure" }, requiredRoles: ["SUPPORTER"] }).reason,
    "AUTH_FETCH_FAILED",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FOUND", value: { ...syntheticIdentity, OrganizationId: "synthetic-other-organization" } },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "ORGANIZATION_MISMATCH",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FOUND", value: { ...syntheticIdentity, Roles: ["UNKNOWN_ROLE"] as never } },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "UNKNOWN_ROLE",
  );
});

test("requires an approved procedure and an idempotency key on execution records", () => {
  assert.equal(validateExecutionRecord(syntheticRecord).ok, true);
  const result = validateExecutionRecord({ ...syntheticRecord, IdempotencyKey: "" });
  assert.equal(result.ok, false);
});

test("distinguishes new, replayed, conflicting, unknown, and fetch-failed submissions", () => {
  assert.deepEqual(classifyExecutionSubmission({ status: "EMPTY" }, syntheticRecord), { decision: "ACCEPT_NEW" });
  assert.deepEqual(
    classifyExecutionSubmission({ status: "EMPTY" }, { ...syntheticRecord, IdempotencyKey: "" }),
    { decision: "REJECT_INVALID_RECORD" },
  );
  assert.deepEqual(
    classifyExecutionSubmission({ status: "FOUND", value: syntheticRecord }, syntheticRecord),
    { decision: "DUPLICATE_REPLAY", RecordId: syntheticRecord.RecordId },
  );
  assert.equal(
    classifyExecutionSubmission(
      { status: "FOUND", value: syntheticRecord },
      { ...syntheticRecord, PayloadFingerprint: "synthetic-other-payload" },
    ).decision,
    "REJECT_DUPLICATE_CONFLICT",
  );
  assert.deepEqual(
    classifyExecutionSubmission({ status: "UNKNOWN", reason: "INDETERMINATE" }, syntheticRecord),
    { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "UNKNOWN" },
  );
  assert.deepEqual(
    classifyExecutionSubmission({ status: "FETCH_FAILED", code: "synthetic-fetch-failure" }, syntheticRecord),
    { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "FETCH_FAILED" },
  );
});
