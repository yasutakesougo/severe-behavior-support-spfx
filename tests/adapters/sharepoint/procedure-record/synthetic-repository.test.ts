import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSyntheticProcedureRecordRepository,
  decodePhysicalRow,
  decodePlanVersion,
  decodeResult,
  encodeIsoDateTime,
  encodePhysicalRow,
  getProcedureRecordDerivedEnvelope,
  PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_PHYSICAL_COLUMNS,
  resolveProcedureRecordListGuid,
  SPFX_SPHTTPCLIENT_HOST_SEAM,
  SyntheticProcedureRecordListStore,
  type ProcedureRecordListBinding,
} from "../../../../src/adapters/sharepoint/procedure-record";
import { persistProcedureRecord } from "../../../../src/domain/procedure-record-persistence";
import { createSyntheticProcedureRecord } from "../../../domain/procedure-record-fixtures";
import {
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
} from "../../../domain/support-plan-fixtures";

const SYNTHETIC_LIST_GUID = "synthetic-procedure-record-list-guid-not-provisioned";

function syntheticBinding(
  overrides?: Partial<ProcedureRecordListBinding>,
): ProcedureRecordListBinding {
  return {
    organizationId: SYNTHETIC_PLAN_ORG_ID,
    siteId: SYNTHETIC_PLAN_SITE_ID,
    listGuid: SYNTHETIC_LIST_GUID,
    ...overrides,
  };
}

function createHarness(binding: ProcedureRecordListBinding = syntheticBinding()) {
  const store = new SyntheticProcedureRecordListStore();
  const repository = createSyntheticProcedureRecordRepository(binding, store);
  return { store, repository };
}

describe("ProcedureRecord synthetic adapter — LOOKUP-B / PR-MAP-NAMES-1", () => {
  it("round-trips create → GET-by-RecordId as saved without writing Title or DERIVED fields", async () => {
    const { repository, store } = createHarness();
    const record = createSyntheticProcedureRecord();
    assert.equal(await persistProcedureRecord(record, repository), "saved");

    const byRecord = await repository.findByRecordId(record.RecordId);
    const byIdem = await repository.findByIdempotencyKey(record.IdempotencyKey);
    assert.equal(byRecord.status, "FOUND");
    assert.equal(byIdem.status, "FOUND");
    if (byRecord.status !== "FOUND" || byIdem.status !== "FOUND") {
      return;
    }
    assert.deepEqual(byRecord.value, record);
    assert.equal(byRecord.value.performedAt, record.performedAt);
    assert.equal(byRecord.value.recordedAt, record.recordedAt);

    const fields = repository.lastPreparedFields;
    assert.ok(fields);
    assert.equal("Title" in fields, false);
    assert.equal("schemaId" in fields, false);
    assert.equal("schemaVersion" in fields, false);
    assert.equal("dtoVersion" in fields, false);
    assert.equal("TimeZone" in fields, false);
    assert.equal(fields[PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordId], record.RecordId);
    assert.equal(fields[PROCEDURE_RECORD_PHYSICAL_COLUMNS.planVersion], "2");
    assert.equal(store.snapshotRows().length, 1);
    assert.equal(store.snapshotRows()[0].Title, undefined);
  });

  it("does not use Display Name as lookup identity", () => {
    const guid = resolveProcedureRecordListGuid(
      { [SYNTHETIC_PLAN_SITE_ID]: SYNTHETIC_LIST_GUID },
      SYNTHETIC_PLAN_SITE_ID,
    );
    assert.equal(guid, SYNTHETIC_LIST_GUID);
    assert.equal(
      resolveProcedureRecordListGuid(
        { [PROCEDURE_RECORD_LIST_DISPLAY_NAME]: SYNTHETIC_LIST_GUID },
        SYNTHETIC_PLAN_SITE_ID,
      ),
      null,
    );
    assert.notEqual(repositoryLookupKey(), PROCEDURE_RECORD_LIST_DISPLAY_NAME);
  });

  it("maps missing List GUID config to save_failed and does not create", async () => {
    const { repository, store } = createHarness(syntheticBinding({ listGuid: "   " }));
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), repository),
      "save_failed",
    );
    assert.equal(store.snapshotRows().length, 0);
  });

  it("fails closed on OrganizationId / SiteId mismatch", async () => {
    const { repository } = createHarness();
    const record = createSyntheticProcedureRecord({ SiteId: "synthetic-other-site" });
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
  });

  it("replays the same payload without inserting a second item", async () => {
    const { repository, store } = createHarness();
    const record = createSyntheticProcedureRecord();
    assert.equal(await persistProcedureRecord(record, repository), "saved");
    assert.equal(await persistProcedureRecord(record, repository), "saved");
    assert.equal(store.snapshotRows().length, 1);
  });

  it("maps synthetic store forbidden through persistProcedureRecord to save_failed without create", async () => {
    const { repository, store } = createHarness();
    store.setMode("forbidden");
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), repository),
      "save_failed",
    );
    assert.equal(store.snapshotRows().length, 0);
  });

  it("maps malformed physical rows to FETCH_FAILED, not EMPTY", async () => {
    const { repository, store } = createHarness();
    const encoded = encodePhysicalRow(createSyntheticProcedureRecord());
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    store.forceInsert({ ...encoded.row, prResult: "FAILED" });
    const lookup = await repository.findByRecordId(createSyntheticProcedureRecord().RecordId);
    assert.equal(lookup.status, "FETCH_FAILED");
    if (lookup.status === "FETCH_FAILED") {
      assert.equal(lookup.code, "MALFORMED_PHYSICAL");
    }
  });

  it("maps malformed physical lookup through persistProcedureRecord to save_failed without create", async () => {
    const { repository, store } = createHarness();
    const record = createSyntheticProcedureRecord();
    const encoded = encodePhysicalRow(record);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    store.forceInsert({ ...encoded.row, prResult: "FAILED" });
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
    assert.equal(store.snapshotRows().length, 1);
  });

  it("maps multi-match lookup through persistProcedureRecord to save_failed without create", async () => {
    const { repository, store } = createHarness();
    const record = createSyntheticProcedureRecord();
    const encoded = encodePhysicalRow(record);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    store.forceInsert(encoded.row);
    store.forceInsert(encoded.row);
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
    assert.equal(store.snapshotRows().length, 2);
  });

  it("maps transport lookup failure through persistProcedureRecord to save_outcome_unknown without create", async () => {
    const { repository, store } = createHarness();
    store.setMode("transport_error");
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), repository),
      "save_outcome_unknown",
    );
    assert.equal(store.snapshotRows().length, 0);
  });

  it("fail-closes when a later DERIVED column disagrees with constants", async () => {
    const { repository, store } = createHarness();
    const encoded = encodePhysicalRow(createSyntheticProcedureRecord());
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    store.forceInsert({ ...encoded.row, TimeZone: "UTC" });
    const lookup = await repository.findByRecordId(createSyntheticProcedureRecord().RecordId);
    assert.equal(lookup.status, "FETCH_FAILED");
  });

  it("keeps D4=A clocks as the original ISO strings", () => {
    const record = createSyntheticProcedureRecord();
    const encoded = encodePhysicalRow(record);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    assert.equal(encoded.row.prPerformedAt, record.performedAt);
    assert.equal(encoded.row.prRecordedAt, record.recordedAt);
    assert.deepEqual(encodeIsoDateTime(record.performedAt), {
      ok: true,
      value: record.performedAt,
    });
    const decoded = decodePhysicalRow(encoded.row);
    assert.equal(decoded.ok, true);
    if (!decoded.ok) {
      return;
    }
    assert.equal(decoded.record.TimeZone, getProcedureRecordDerivedEnvelope().TimeZone);
    assert.equal(decoded.record.performedAt, record.performedAt);
  });

  it("fail-closes non-integer planVersion and unknown result tokens", () => {
    assert.equal(decodePlanVersion("01").ok, false);
    assert.equal(decodePlanVersion("1.0").ok, false);
    assert.equal(decodeResult("FAILED").ok, false);
    assert.equal(decodeResult("save_failed").ok, false);
  });

  it("does not authorize live tenant I/O or expose update/delete", () => {
    const { repository } = createHarness();
    assert.equal(SPFX_SPHTTPCLIENT_HOST_SEAM.liveTenantIoAuthorized, false);
    assert.equal(SPFX_SPHTTPCLIENT_HOST_SEAM.liveWriteAuthorized, false);
    assert.equal(SPFX_SPHTTPCLIENT_HOST_SEAM.bindWhenAvailable, true);
    assert.equal(
      SPFX_SPHTTPCLIENT_HOST_SEAM.binderModule,
      "spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts",
    );
    assert.equal("update" in repository, false);
    assert.equal("delete" in repository, false);
  });
});

function repositoryLookupKey(): string {
  return syntheticBinding().listGuid;
}
