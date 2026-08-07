import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyExecutionSubmission,
  evaluateAccess,
  parseLocalDate,
  validateApprovedProcedureReference,
  validateDeploymentContext,
  validateExecutionRecord,
  type ExecutionRecord,
  type LookupResult,
  type Role,
} from "../../src/contracts";
import {
  syntheticContext,
  syntheticIdentity,
  syntheticProcedure,
  syntheticRecord,
} from "./fixtures";

const formalRoles: readonly Role[] = [
  "SUPPORTER",
  "PLANNER",
  "SERVICE_MANAGER",
  "SITE_ADMIN",
  "ORG_ADMIN",
  "SYSTEM_ADMIN",
  "VIEWER",
];

const found = (value: ExecutionRecord): LookupResult<ExecutionRecord> => ({
  status: "FOUND",
  value,
});
const empty = (): LookupResult<ExecutionRecord> => ({ status: "EMPTY" });

test("accepts a complete DeploymentContext with required organization and site", () => {
  const result = validateDeploymentContext(syntheticContext);
  assert.equal(result.ok, true);
});

test("rejects a DeploymentContext with missing organization or site", () => {
  const result = validateDeploymentContext({ OrganizationId: "", TimeZone: "Asia/Tokyo" });
  assert.equal(result.ok, false);
  if (!result.ok)
    assert.deepEqual(
      result.errors.map((item) => item.path),
      ["OrganizationId", "SiteId"],
    );
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

test("recognizes all seven formal application roles", () => {
  for (const role of formalRoles) {
    assert.deepEqual(
      evaluateAccess({
        context: syntheticContext,
        identity: { status: "FOUND", value: { ...syntheticIdentity, Roles: [role] } },
        requiredRoles: [role],
      }),
      { decision: "ALLOW", reason: "ROLE_ALLOWED" },
    );
  }
});

test("fails closed for unavailable identity, invalid scope, empty subject, and invalid roles", () => {
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "EMPTY" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_EMPTY",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "UNKNOWN", reason: "INDETERMINATE" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_UNKNOWN",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FETCH_FAILED", code: "synthetic-fetch-failure" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_FETCH_FAILED",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: {
        status: "FOUND",
        value: { ...syntheticIdentity, OrganizationId: "synthetic-other-organization" },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "ORGANIZATION_MISMATCH",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: {
        status: "FOUND",
        value: { ...syntheticIdentity, SiteId: "synthetic-other-site" },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_MISMATCH",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FOUND", value: { ...syntheticIdentity, Subject: "" } },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_IDENTITY",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FOUND", value: syntheticIdentity },
      requiredRoles: [],
    }).reason,
    "NO_REQUIRED_ROLE",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: {
        status: "FOUND",
        value: { ...syntheticIdentity, Roles: ["UNKNOWN_ROLE" as unknown as Role] },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "UNKNOWN_ROLE",
  );
  assert.equal(
    evaluateAccess({
      context: syntheticContext,
      identity: { status: "FOUND", value: syntheticIdentity },
      requiredRoles: ["UNKNOWN_ROLE" as unknown as Role],
    }).reason,
    "UNKNOWN_ROLE",
  );
});

test("requires a user id, approved procedure, valid time zone, and idempotency key", () => {
  assert.equal(validateExecutionRecord(syntheticRecord).ok, true);

  const missingUser = validateExecutionRecord({ ...syntheticRecord, UserId: "" });
  assert.equal(missingUser.ok, false);
  if (!missingUser.ok)
    assert.deepEqual(
      missingUser.errors.map((item) => item.path),
      ["UserId"],
    );

  assert.equal(validateExecutionRecord({ ...syntheticRecord, IdempotencyKey: "" }).ok, false);
  assert.equal(validateExecutionRecord({ ...syntheticRecord, TimeZone: "UTC" }).ok, false);
  assert.equal(
    validateExecutionRecord({
      ...syntheticRecord,
      Procedure: { ...syntheticProcedure, ProcedureVersion: "" },
    }).ok,
    false,
  );
});

test("accepts a new record only when both lookups are empty", () => {
  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: empty(), byIdempotencyKey: empty() },
      syntheticRecord,
    ),
    { decision: "ACCEPT_NEW" },
  );

  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: empty(), byIdempotencyKey: empty() },
      { ...syntheticRecord, UserId: "" },
    ),
    { decision: "REJECT_INVALID_RECORD" },
  );
});

test("treats only a complete two-lookup match as a duplicate replay", () => {
  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: found(syntheticRecord), byIdempotencyKey: found(syntheticRecord) },
      syntheticRecord,
    ),
    { decision: "DUPLICATE_REPLAY", RecordId: syntheticRecord.RecordId },
  );
});

test("rejects reuse of an existing record id with a different idempotency key", () => {
  const incoming = { ...syntheticRecord, IdempotencyKey: "synthetic-idempotency-002" };
  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: found(syntheticRecord), byIdempotencyKey: empty() },
      incoming,
    ),
    {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: syntheticRecord.RecordId,
      reason: "RECORD_ID_REUSED",
    },
  );
});

test("rejects reuse of an idempotency key and distinguishes payload mismatch", () => {
  const samePayload = { ...syntheticRecord, RecordId: "synthetic-record-002" };
  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: empty(), byIdempotencyKey: found(syntheticRecord) },
      samePayload,
    ),
    {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: syntheticRecord.RecordId,
      reason: "IDEMPOTENCY_KEY_REUSED",
    },
  );

  const differentPayload = {
    ...samePayload,
    PayloadFingerprint: "synthetic-payload-fingerprint-002",
  };
  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: empty(), byIdempotencyKey: found(syntheticRecord) },
      differentPayload,
    ),
    {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: syntheticRecord.RecordId,
      reason: "PAYLOAD_MISMATCH",
    },
  );
});

test("rejects divergent records returned by the two lookups", () => {
  const otherRecord: ExecutionRecord = {
    ...syntheticRecord,
    RecordId: "synthetic-record-002",
    IdempotencyKey: "synthetic-idempotency-002",
  };

  assert.deepEqual(
    classifyExecutionSubmission(
      { byRecordId: found(syntheticRecord), byIdempotencyKey: found(otherRecord) },
      syntheticRecord,
    ),
    {
      decision: "REJECT_DUPLICATE_CONFLICT",
      RecordId: syntheticRecord.RecordId,
      reason: "LOOKUP_RESULTS_DIVERGED",
    },
  );
});

test("rejects unavailable lookups and gives fetch failure precedence", () => {
  assert.deepEqual(
    classifyExecutionSubmission(
      {
        byRecordId: { status: "UNKNOWN", reason: "INDETERMINATE" },
        byIdempotencyKey: empty(),
      },
      syntheticRecord,
    ),
    { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "UNKNOWN" },
  );

  assert.deepEqual(
    classifyExecutionSubmission(
      {
        byRecordId: { status: "UNKNOWN", reason: "INDETERMINATE" },
        byIdempotencyKey: { status: "FETCH_FAILED", code: "synthetic-fetch-failure" },
      },
      syntheticRecord,
    ),
    { decision: "REJECT_LOOKUP_UNAVAILABLE", reason: "FETCH_FAILED" },
  );
});
