import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasSameAuditEventSemanticPayload,
  persistAuditEventWithReplay,
  verifyExistingAuditEventWrite,
  type AuditEventExistingLookupResult,
  type AuditEventExistingResultPort,
  type AuditEventPersistencePort,
  type AuditEventWriteRequest,
  type AuditEventWriteResult,
  type PersistedAuditEventWrite,
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

function createPersistedWrite(
  request: AuditEventWriteRequest = createWriteRequest(),
  overrides?: Partial<PersistedAuditEventWrite>,
): PersistedAuditEventWrite {
  return {
    auditEvent: request.auditEvent,
    idempotencyKey: request.idempotencyKey,
    ...overrides,
  };
}

function found(persisted: unknown): AuditEventExistingLookupResult {
  return { kind: "FOUND", persisted };
}

const NOT_FOUND: AuditEventExistingLookupResult = { kind: "NOT_FOUND" };
const FORBIDDEN: AuditEventExistingLookupResult = { kind: "FORBIDDEN" };
const RETRIEVAL_FAILED: AuditEventExistingLookupResult = { kind: "RETRIEVAL_FAILED" };

function createScriptedLookupPort(
  recordResults: readonly AuditEventExistingLookupResult[],
  keyResults: readonly AuditEventExistingLookupResult[],
): {
  port: AuditEventExistingResultPort;
  recordCalls: string[];
  keyCalls: string[];
} {
  const recordCalls: string[] = [];
  const keyCalls: string[] = [];

  return {
    recordCalls,
    keyCalls,
    port: {
      async findByRecordId(recordId) {
        const index = recordCalls.length;
        recordCalls.push(recordId);
        const result = recordResults[index];
        if (result === undefined) {
          throw new Error("unexpected record lookup");
        }
        return result;
      },
      async findByIdempotencyKey(idempotencyKey) {
        const index = keyCalls.length;
        keyCalls.push(idempotencyKey);
        const result = keyResults[index];
        if (result === undefined) {
          throw new Error("unexpected key lookup");
        }
        return result;
      },
    },
  };
}

function createRecordingPersistencePort(result: AuditEventWriteResult): {
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

describe("Decision-AUD-REPLAY-1 logical replay contract", () => {
  it("REPLAY-01: semantic payload excludes auditEventId and otherwise uses exact equality", () => {
    const left = createSyntheticAuditEventSuccess({
      auditEventId: "synthetic-audit-event-001",
    });
    const samePayloadDifferentId = createSyntheticAuditEventSuccess({
      auditEventId: "synthetic-audit-event-002",
    });
    const differentPayload = createSyntheticAuditEventSuccess({
      auditEventId: "synthetic-audit-event-002",
      correlationId: "synthetic-correlation-002",
    });

    assert.equal(hasSameAuditEventSemanticPayload(left, samePayloadDifferentId), true);
    assert.equal(hasSameAuditEventSemanticPayload(left, differentPayload), false);
  });

  it("REPLAY-02: absent optional field equals explicit undefined without normalization", () => {
    const absent = createSyntheticAuditEventSuccess();
    const explicitUndefined = {
      ...createSyntheticAuditEventSuccess(),
      reasonCode: undefined,
    };
    const defined = createSyntheticAuditEventSuccess({
      reasonCode: "SYNTHETIC_REASON_001",
    });

    assert.equal(hasSameAuditEventSemanticPayload(absent, explicitUndefined), true);
    assert.equal(hasSameAuditEventSemanticPayload(absent, defined), false);
  });

  it("REPLAY-03: dual lookup found same record/key/payload verifies SAME", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request);
    const { port, recordCalls, keyCalls } = createScriptedLookupPort(
      [found(persisted)],
      [found(persisted)],
    );

    const result = await verifyExistingAuditEventWrite(request, port);

    assert.equal(result, "SAME");
    assert.deepEqual(recordCalls, [request.auditEvent.auditEventId]);
    assert.deepEqual(keyCalls, [request.idempotencyKey]);
  });

  it("REPLAY-04: both NOT_FOUND is the only new-save eligibility result", async () => {
    const request = createWriteRequest();
    const { port } = createScriptedLookupPort([NOT_FOUND], [NOT_FOUND]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "NOT_FOUND");
  });

  it("REPLAY-05: one-sided FOUND evidence is CONFLICT", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request);
    const { port } = createScriptedLookupPort([found(persisted)], [NOT_FOUND]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "CONFLICT");
  });

  it("REPLAY-06: same RecordId with different IdempotencyKey is CONFLICT", async () => {
    const request = createWriteRequest({ idempotencyKey: "synthetic-idempotency-key-002" });
    const persisted = createPersistedWrite(request, {
      idempotencyKey: "synthetic-idempotency-key-001",
    });
    const { port } = createScriptedLookupPort([found(persisted)], [found(persisted)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "CONFLICT");
  });

  it("REPLAY-07: different RecordId with same IdempotencyKey is CONFLICT", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request, {
      auditEvent: createSyntheticAuditEventSuccess({
        auditEventId: "synthetic-audit-event-002",
      }),
    });
    const { port } = createScriptedLookupPort([found(persisted)], [found(persisted)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "CONFLICT");
  });

  it("REPLAY-08: same RecordId/key with different semantic payload is CONFLICT", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request, {
      auditEvent: createSyntheticAuditEventSuccess({
        correlationId: "synthetic-correlation-002",
      }),
    });
    const { port } = createScriptedLookupPort([found(persisted)], [found(persisted)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "CONFLICT");
  });

  it("REPLAY-09: incompatible dual FOUND evidence is CONFLICT", async () => {
    const request = createWriteRequest();
    const byRecord = createPersistedWrite(request);
    const byKey = createPersistedWrite(request, {
      auditEvent: createSyntheticAuditEventSuccess({
        auditEventId: "synthetic-audit-event-002",
      }),
    });
    const { port } = createScriptedLookupPort([found(byRecord)], [found(byKey)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "CONFLICT");
  });

  it("REPLAY-10: pre-save FORBIDDEN takes fail-closed precedence", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request);
    const { port } = createScriptedLookupPort([FORBIDDEN], [found(persisted)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "FORBIDDEN");
  });

  it("REPLAY-11: retrieval failure and thrown lookup both classify RETRIEVAL_FAILED", async () => {
    const request = createWriteRequest();
    const explicit = createScriptedLookupPort([RETRIEVAL_FAILED], [NOT_FOUND]);
    assert.equal(await verifyExistingAuditEventWrite(request, explicit.port), "RETRIEVAL_FAILED");

    const throwingPort: AuditEventExistingResultPort = {
      async findByRecordId() {
        throw new Error("synthetic retrieval failure");
      },
      async findByIdempotencyKey() {
        return NOT_FOUND;
      },
    };
    assert.equal(await verifyExistingAuditEventWrite(request, throwingPort), "RETRIEVAL_FAILED");
  });

  it("REPLAY-12: malformed persisted evidence is MALFORMED", async () => {
    const request = createWriteRequest();
    const malformed = {
      ...createPersistedWrite(request),
      etag: "synthetic-etag-out-of-logical-boundary",
    };
    const { port } = createScriptedLookupPort([found(malformed)], [found(malformed)]);

    assert.equal(await verifyExistingAuditEventWrite(request, port), "MALFORMED");
  });

  it("REPLAY-13: confirmed safe replay returns SAVED without a new write", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request);
    const lookups = createScriptedLookupPort([found(persisted)], [found(persisted)]);
    const persistence = createRecordingPersistencePort("SAVED");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "SAVED");
    assert.equal(persistence.calls.length, 0);
  });

  it("REPLAY-14: dual NOT_FOUND performs exactly one new save", async () => {
    const request = createWriteRequest();
    const lookups = createScriptedLookupPort([NOT_FOUND], [NOT_FOUND]);
    const persistence = createRecordingPersistencePort("SAVED");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "SAVED");
    assert.equal(persistence.calls.length, 1);
    assert.equal(persistence.calls[0], request);
  });

  it("REPLAY-15: pre-save FORBIDDEN returns FORBIDDEN without save", async () => {
    const request = createWriteRequest();
    const lookups = createScriptedLookupPort([FORBIDDEN], [NOT_FOUND]);
    const persistence = createRecordingPersistencePort("SAVED");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "FORBIDDEN");
    assert.equal(persistence.calls.length, 0);
  });

  it("REPLAY-16: pre-save retrieval/malformed -> SAVE_FAILED without save", async () => {
    const request = createWriteRequest();
    const malformed = found({
      auditEvent: request.auditEvent,
      idempotencyKey: request.idempotencyKey,
      physicalMetadata: "out",
    });

    for (const recordResult of [RETRIEVAL_FAILED, malformed]) {
      const lookups = createScriptedLookupPort([recordResult], [NOT_FOUND]);
      const persistence = createRecordingPersistencePort("SAVED");
      const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

      assert.equal(result, "SAVE_FAILED");
      assert.equal(persistence.calls.length, 0);
    }
  });

  it("REPLAY-17: SAVE_OUTCOME_UNKNOWN + verified same becomes SAVED without retry", async () => {
    const request = createWriteRequest();
    const persisted = createPersistedWrite(request);
    const lookups = createScriptedLookupPort(
      [NOT_FOUND, found(persisted)],
      [NOT_FOUND, found(persisted)],
    );
    const persistence = createRecordingPersistencePort("SAVE_OUTCOME_UNKNOWN");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "SAVED");
    assert.equal(persistence.calls.length, 1);
    assert.equal(lookups.recordCalls.length, 2);
    assert.equal(lookups.keyCalls.length, 2);
  });

  it("REPLAY-18: unknown + conflict -> CONFLICT without retry", async () => {
    const request = createWriteRequest();
    const conflict = createPersistedWrite(request, {
      auditEvent: createSyntheticAuditEventSuccess({
        correlationId: "synthetic-correlation-conflict",
      }),
    });
    const lookups = createScriptedLookupPort(
      [NOT_FOUND, found(conflict)],
      [NOT_FOUND, found(conflict)],
    );
    const persistence = createRecordingPersistencePort("SAVE_OUTCOME_UNKNOWN");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "CONFLICT");
    assert.equal(persistence.calls.length, 1);
  });

  it("REPLAY-19: SAVE_OUTCOME_UNKNOWN + NOT_FOUND remains unknown without retry", async () => {
    const request = createWriteRequest();
    const lookups = createScriptedLookupPort([NOT_FOUND, NOT_FOUND], [NOT_FOUND, NOT_FOUND]);
    const persistence = createRecordingPersistencePort("SAVE_OUTCOME_UNKNOWN");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "SAVE_OUTCOME_UNKNOWN");
    assert.equal(persistence.calls.length, 1);
  });

  it("REPLAY-20: unknown recovery failures stay unknown without retry", async () => {
    const request = createWriteRequest();
    const malformed = found({
      auditEvent: request.auditEvent,
      idempotencyKey: request.idempotencyKey,
      physicalMetadata: "out",
    });

    for (const recoveryResult of [FORBIDDEN, RETRIEVAL_FAILED, malformed]) {
      const lookups = createScriptedLookupPort([NOT_FOUND, recoveryResult], [NOT_FOUND, NOT_FOUND]);
      const persistence = createRecordingPersistencePort("SAVE_OUTCOME_UNKNOWN");

      const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

      assert.equal(result, "SAVE_OUTCOME_UNKNOWN");
      assert.equal(persistence.calls.length, 1);
    }
  });

  it("REPLAY-21: invalid AuditEvent fails validation before any lookup or save", async () => {
    const request = createWriteRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        OrganizationId: " synthetic-org-001",
      }),
    });
    const lookups = createScriptedLookupPort([], []);
    const persistence = createRecordingPersistencePort("SAVED");

    const result = await persistAuditEventWithReplay(request, persistence.port, lookups.port);

    assert.equal(result, "VALIDATION_FAILED");
    assert.equal(lookups.recordCalls.length, 0);
    assert.equal(lookups.keyCalls.length, 0);
    assert.equal(persistence.calls.length, 0);
  });
});
