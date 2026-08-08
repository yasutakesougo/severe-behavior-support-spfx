import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createSyntheticAuditEventRepository,
  SyntheticAuditEventListStore,
} from "../../../../src/adapters/sharepoint/audit-event";
import {
  persistAuditEventWithReplay,
  verifyExistingAuditEventWrite,
  type AuditEventWriteRequest,
} from "../../../../src/domain";
import {
  createSyntheticAuditEventSuccess,
  SYNTHETIC_FINDING_ID_ORG,
} from "../../../domain/finding-audit-fixtures";

function createRequest(
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

function createHarness(organizationId: string = SYNTHETIC_FINDING_ID_ORG) {
  const store = new SyntheticAuditEventListStore();
  const repository = createSyntheticAuditEventRepository(organizationId, store);
  return { store, repository };
}

describe("Synthetic AuditEvent concrete repository (#22B / Accepted #29)", () => {
  it("REPO-01: save + dual lookup round-trips PersistedAuditEventWrite without system metadata", async () => {
    const { repository, store } = createHarness();
    const request = createRequest();

    assert.equal(await repository.save(request), "SAVED");

    const byRecord = await repository.findByRecordId(request.auditEvent.auditEventId);
    const byKey = await repository.findByIdempotencyKey(request.idempotencyKey);

    assert.equal(byRecord.kind, "FOUND");
    assert.equal(byKey.kind, "FOUND");
    if (byRecord.kind !== "FOUND" || byKey.kind !== "FOUND") {
      return;
    }

    assert.deepEqual(byRecord.persisted, {
      auditEvent: request.auditEvent,
      idempotencyKey: request.idempotencyKey,
    });
    assert.deepEqual(byKey.persisted, byRecord.persisted);

    const persistedKeys = Object.keys(byRecord.persisted as object);
    assert.deepEqual(persistedKeys.sort(), ["auditEvent", "idempotencyKey"]);
    const eventKeys = Object.keys((byRecord.persisted as { auditEvent: object }).auditEvent);
    assert.equal(eventKeys.includes("ListItemId"), false);
    assert.equal(eventKeys.includes("ETag"), false);
    assert.equal(eventKeys.includes("Created"), false);
    assert.equal(eventKeys.includes("Title"), false);

    const rows = store.snapshotRows();
    assert.equal(rows.length, 1);
    assert.equal(typeof rows[0].ListItemId, "number");
    assert.equal(rows[0].SbsAudOccurredAtRaw, request.auditEvent.occurredAt);
  });

  it("REPO-02: lookup is digest key-only and NOT_FOUND for unknown tokens", async () => {
    const { repository } = createHarness();
    assert.deepEqual(await repository.findByRecordId("synthetic-missing-record"), {
      kind: "NOT_FOUND",
    });
    assert.deepEqual(await repository.findByIdempotencyKey("synthetic-missing-key"), {
      kind: "NOT_FOUND",
    });
  });

  it("REPO-03: OrganizationId binding scopes digests across repositories sharing one store", async () => {
    const store = new SyntheticAuditEventListStore();
    const orgA = createSyntheticAuditEventRepository("synthetic-org-001", store);
    const orgB = createSyntheticAuditEventRepository("synthetic-org-002", store);

    const requestA = createRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        OrganizationId: "synthetic-org-001",
        auditEventId: "synthetic-shared-id-001",
      }),
      idempotencyKey: "synthetic-shared-idem-001",
    });
    const requestB = createRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        OrganizationId: "synthetic-org-002",
        auditEventId: "synthetic-shared-id-001",
        SiteId: "synthetic-site-002",
      }),
      idempotencyKey: "synthetic-shared-idem-001",
    });

    assert.equal(await orgA.save(requestA), "SAVED");
    assert.equal(await orgB.save(requestB), "SAVED");

    const foundA = await orgA.findByRecordId("synthetic-shared-id-001");
    const foundB = await orgB.findByRecordId("synthetic-shared-id-001");
    assert.equal(foundA.kind, "FOUND");
    assert.equal(foundB.kind, "FOUND");
    if (foundA.kind === "FOUND" && foundB.kind === "FOUND") {
      assert.equal(
        (foundA.persisted as { auditEvent: { OrganizationId: string } }).auditEvent.OrganizationId,
        "synthetic-org-001",
      );
      assert.equal(
        (foundB.persisted as { auditEvent: { OrganizationId: string } }).auditEvent.OrganizationId,
        "synthetic-org-002",
      );
    }
  });

  it("REPO-04: unique collision returns SAVE_OUTCOME_UNKNOWN (not CONFLICT)", async () => {
    const { repository } = createHarness();
    const first = createRequest();
    const colliding = createRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        auditEventId: first.auditEvent.auditEventId,
        correlationId: "synthetic-correlation-002",
      }),
      idempotencyKey: "synthetic-idempotency-key-002",
    });

    assert.equal(await repository.save(first), "SAVED");
    assert.equal(await repository.save(colliding), "SAVE_OUTCOME_UNKNOWN");
  });

  it("REPO-05: multi-match on digest key returns RETRIEVAL_FAILED", async () => {
    const { repository, store } = createHarness();
    const request = createRequest();
    assert.equal(await repository.save(request), "SAVED");

    const existing = store.snapshotRows()[0];
    store.forceInsert({ ...existing, ListItemId: undefined, ETag: undefined });

    assert.deepEqual(await repository.findByRecordId(request.auditEvent.auditEventId), {
      kind: "RETRIEVAL_FAILED",
    });
    assert.deepEqual(await repository.findByIdempotencyKey(request.idempotencyKey), {
      kind: "RETRIEVAL_FAILED",
    });
  });

  it("REPO-06: date / encoding integrity failures are RETRIEVAL_FAILED", async () => {
    const request = createRequest();
    const seedStore = new SyntheticAuditEventListStore();
    const seedRepo = createSyntheticAuditEventRepository(SYNTHETIC_FINDING_ID_ORG, seedStore);
    assert.equal(await seedRepo.save(request), "SAVED");
    const row = seedStore.snapshotRows()[0];

    const dateStore = new SyntheticAuditEventListStore();
    const dateRepo = createSyntheticAuditEventRepository(SYNTHETIC_FINDING_ID_ORG, dateStore);
    dateStore.forceInsert({
      ...row,
      SbsAudOccurredAtUtc: "2099-01-01T00:00:00.000Z",
    });
    assert.deepEqual(await dateRepo.findByRecordId(request.auditEvent.auditEventId), {
      kind: "RETRIEVAL_FAILED",
    });

    const encodingStore = new SyntheticAuditEventListStore();
    const encodingRepo = createSyntheticAuditEventRepository(
      SYNTHETIC_FINDING_ID_ORG,
      encodingStore,
    );
    encodingStore.forceInsert({
      ...row,
      SbsAudAuditEventIdEncoded: "not-a-valid-encoding",
    });
    assert.deepEqual(await encodingRepo.findByRecordId(request.auditEvent.auditEventId), {
      kind: "RETRIEVAL_FAILED",
    });
  });

  it("REPO-07: logical invalid reconstructed row surfaces REPLAY MALFORMED via FOUND junk", async () => {
    const request = createRequest();
    const seedStore = new SyntheticAuditEventListStore();
    const seedRepo = createSyntheticAuditEventRepository(SYNTHETIC_FINDING_ID_ORG, seedStore);
    assert.equal(await seedRepo.save(request), "SAVED");
    const row = seedStore.snapshotRows()[0];

    const brokenStore = new SyntheticAuditEventListStore();
    const brokenRepo = createSyntheticAuditEventRepository(SYNTHETIC_FINDING_ID_ORG, brokenStore);
    brokenStore.forceInsert({
      ...row,
      SbsAudActionCode: "not-a-valid-action-code",
    });

    const lookup = await brokenRepo.findByRecordId(request.auditEvent.auditEventId);
    assert.equal(lookup.kind, "FOUND");

    const verification = await verifyExistingAuditEventWrite(request, brokenRepo);
    assert.equal(verification, "MALFORMED");
  });

  it("REPO-08: forbidden / transport modes map to FORBIDDEN / SAVE_FAILED / RETRIEVAL_FAILED", async () => {
    const { repository, store } = createHarness();
    const request = createRequest();

    store.setMode("forbidden");
    assert.equal(await repository.save(request), "FORBIDDEN");
    assert.deepEqual(await repository.findByRecordId(request.auditEvent.auditEventId), {
      kind: "FORBIDDEN",
    });

    store.setMode("transport_error");
    assert.equal(await repository.save(request), "SAVE_FAILED");
    assert.deepEqual(await repository.findByRecordId(request.auditEvent.auditEventId), {
      kind: "RETRIEVAL_FAILED",
    });
  });

  it("REPO-09: persistAuditEventWithReplay saves once and safe-replays as SAVED", async () => {
    const { repository } = createHarness();
    const request = createRequest();

    assert.equal(await persistAuditEventWithReplay(request, repository, repository), "SAVED");
    assert.equal(await persistAuditEventWithReplay(request, repository, repository), "SAVED");

    const colliding = createRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        auditEventId: request.auditEvent.auditEventId,
        correlationId: "synthetic-correlation-009",
      }),
      idempotencyKey: "synthetic-idempotency-key-009",
    });
    assert.equal(await persistAuditEventWithReplay(colliding, repository, repository), "CONFLICT");
  });

  it("REPO-10: save rejects OrganizationId mismatch against boundOrganizationId", async () => {
    const { repository } = createHarness("synthetic-org-001");
    const request = createRequest({
      auditEvent: createSyntheticAuditEventSuccess({
        OrganizationId: "synthetic-org-002",
      }),
    });
    assert.equal(await repository.save(request), "SAVE_FAILED");
  });
});
