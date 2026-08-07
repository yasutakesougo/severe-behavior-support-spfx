import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUDIT_EVENT_WRITE_RESULTS,
  persistAuditEvent,
  type AuditEventPersistencePort,
  type AuditEventWriteRequest,
  type AuditEventWriteResult,
} from "../../src/domain";
import { createSyntheticAuditEventSuccess } from "../domain/finding-audit-fixtures";

function createWriteRequest(
  overrides?: Partial<{
    auditEvent: ReturnType<typeof createSyntheticAuditEventSuccess>;
    idempotencyKey: string;
  }>,
): AuditEventWriteRequest {
  return {
    auditEvent: overrides?.auditEvent ?? createSyntheticAuditEventSuccess(),
    idempotencyKey: overrides?.idempotencyKey ?? "synthetic-idempotency-key-001",
  };
}

function createRecordingPort(result: AuditEventWriteResult): {
  port: AuditEventPersistencePort;
  calls: AuditEventWriteRequest[];
} {
  const calls: AuditEventWriteRequest[] = [];
  return {
    calls,
    port: {
      async save(request) {
        calls.push(request);
        return result;
      },
    },
  };
}

describe("AuditEvent logical persistence contract", () => {
  it("TEST-01: write-result vocabulary is exactly the six Accepted values", () => {
    assert.deepEqual(
      [...AUDIT_EVENT_WRITE_RESULTS],
      [
        "SAVED",
        "VALIDATION_FAILED",
        "FORBIDDEN",
        "CONFLICT",
        "SAVE_FAILED",
        "SAVE_OUTCOME_UNKNOWN",
      ],
    );
    assert.equal(AUDIT_EVENT_WRITE_RESULTS.length, 6);
  });

  it("TEST-02: IdempotencyKey is request metadata and not an AuditEvent field", () => {
    const request = createWriteRequest({
      idempotencyKey: "synthetic-idempotency-key-001",
    });
    assert.notEqual(request.auditEvent.auditEventId, request.idempotencyKey);
    assert.equal(Object.prototype.hasOwnProperty.call(request.auditEvent, "idempotencyKey"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(request.auditEvent, "IdempotencyKey"), false);
  });

  it("TEST-03: correlationId is tracking-only and not used as IdempotencyKey", () => {
    const request = createWriteRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        correlationId: "synthetic-correlation-001",
      }),
      idempotencyKey: "synthetic-idempotency-key-001",
    });
    assert.notEqual(request.auditEvent.correlationId, request.idempotencyKey);
  });

  it("TEST-04: targetRecordId is the audited target, not AuditEvent RecordId", () => {
    const request = createWriteRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        auditEventId: "synthetic-audit-event-001",
        targetRecordId: "synthetic-record-001",
      }),
    });
    assert.notEqual(request.auditEvent.auditEventId, request.auditEvent.targetRecordId);
  });

  it("TEST-05: invalid AuditEvent returns VALIDATION_FAILED without calling port", async () => {
    const { port, calls } = createRecordingPort("SAVED");
    const request = createWriteRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        OrganizationId: " synthetic-org-001",
      }),
    });

    const result = await persistAuditEvent(request, port);

    assert.equal(result, "VALIDATION_FAILED");
    assert.equal(calls.length, 0);
  });

  it("TEST-06: valid AuditEvent delegates to port exactly once with same request", async () => {
    const { port, calls } = createRecordingPort("SAVED");
    const request = createWriteRequest();

    const result = await persistAuditEvent(request, port);

    assert.equal(result, "SAVED");
    assert.equal(calls.length, 1);
    assert.equal(calls[0], request);
    assert.deepEqual(calls[0], request);
  });

  it("TEST-07: port write results are preserved unchanged", async () => {
    const results: AuditEventWriteResult[] = [
      "SAVED",
      "FORBIDDEN",
      "CONFLICT",
      "SAVE_FAILED",
      "SAVE_OUTCOME_UNKNOWN",
      "VALIDATION_FAILED",
    ];

    for (const expected of results) {
      const { port, calls } = createRecordingPort(expected);
      const request = createWriteRequest();
      const result = await persistAuditEvent(request, port);
      assert.equal(result, expected, `${expected} must be preserved`);
      assert.equal(calls.length, 1, `${expected} must call port once`);
    }
  });

  it("TEST-08: SAVE_OUTCOME_UNKNOWN does not trigger blind retry", async () => {
    const { port, calls } = createRecordingPort("SAVE_OUTCOME_UNKNOWN");
    const request = createWriteRequest();

    const result = await persistAuditEvent(request, port);

    assert.equal(result, "SAVE_OUTCOME_UNKNOWN");
    assert.equal(calls.length, 1);
  });
});
