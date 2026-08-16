import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LookupResult } from "../../src/contracts/types";
import {
  classifyProcedureRecordLookups,
  persistProcedureRecord,
  type ProcedureRecordCreateAttempt,
  type ProcedureRecordPersistencePort,
} from "../../src/domain/procedure-record-persistence";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

class FakeProcedureRecordPort implements ProcedureRecordPersistencePort {
  readonly byRecord = new Map<string, ProcedureRecord>();
  readonly byIdem = new Map<string, ProcedureRecord>();
  lookupMode: "ok" | "unknown" | "fetch_failed" = "ok";
  createMode: "created" | "definite" | "indeterminate" | "created_without_readback" = "created";
  createCalls = 0;

  async findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>> {
    return this.lookup("record", recordId);
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecord>> {
    return this.lookup("idem", idempotencyKey);
  }

  async create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt> {
    this.createCalls += 1;
    if (this.createMode === "definite") {
      return { status: "DEFINITE_FAILURE" };
    }
    if (this.createMode === "indeterminate") {
      return { status: "INDETERMINATE" };
    }
    if (this.createMode === "created_without_readback") {
      return { status: "CREATED" };
    }
    this.byRecord.set(record.RecordId, record);
    this.byIdem.set(record.IdempotencyKey, record);
    return { status: "CREATED" };
  }

  private lookup(kind: "record" | "idem", token: string): LookupResult<ProcedureRecord> {
    if (this.lookupMode === "unknown") {
      return { status: "UNKNOWN", reason: "INDETERMINATE" };
    }
    if (this.lookupMode === "fetch_failed") {
      return { status: "FETCH_FAILED", code: "SYNTHETIC" };
    }
    const found = kind === "record" ? this.byRecord.get(token) : this.byIdem.get(token);
    if (found === undefined) {
      return { status: "EMPTY" };
    }
    return { status: "FOUND", value: found };
  }
}

describe("persistProcedureRecord — D5/D8/D9", () => {
  it("returns save_failed for an invalid record without create", async () => {
    const port = new FakeProcedureRecordPort();
    const outcome = await persistProcedureRecord(
      createSyntheticProcedureRecord({ RecordId: "   " }),
      port,
    );
    assert.equal(outcome, "save_failed");
    assert.equal(port.createCalls, 0);
  });

  it("creates then GET-by-RecordId before saved", async () => {
    const port = new FakeProcedureRecordPort();
    const record = createSyntheticProcedureRecord();
    assert.equal(await persistProcedureRecord(record, port), "saved");
    assert.equal(port.createCalls, 1);
    assert.equal(port.byRecord.get(record.RecordId), record);
  });

  it("allows NOT_PERFORMED to coexist with saved", async () => {
    const port = new FakeProcedureRecordPort();
    const record = createSyntheticProcedureRecord({ result: "NOT_PERFORMED" });
    assert.equal(await persistProcedureRecord(record, port), "saved");
  });

  it("maps UNKNOWN lookup to save_outcome_unknown and does not create", async () => {
    const port = new FakeProcedureRecordPort();
    port.lookupMode = "unknown";
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), port),
      "save_outcome_unknown",
    );
    assert.equal(port.createCalls, 0);
  });

  it("maps FETCH_FAILED lookup to save_outcome_unknown and does not create", async () => {
    const port = new FakeProcedureRecordPort();
    port.lookupMode = "fetch_failed";
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), port),
      "save_outcome_unknown",
    );
    assert.equal(port.createCalls, 0);
  });

  it("maps diverged lookups to save_failed", async () => {
    const port = new FakeProcedureRecordPort();
    const incoming = createSyntheticProcedureRecord();
    port.byRecord.set(incoming.RecordId, incoming);
    assert.equal(await persistProcedureRecord(incoming, port), "save_failed");
    assert.equal(port.createCalls, 0);
  });

  it("replays the same record without a second create", async () => {
    const port = new FakeProcedureRecordPort();
    const record = createSyntheticProcedureRecord();
    port.byRecord.set(record.RecordId, record);
    port.byIdem.set(record.IdempotencyKey, record);
    assert.equal(await persistProcedureRecord(record, port), "saved");
    assert.equal(port.createCalls, 0);
  });

  it("maps same ids with different fingerprint to save_failed", async () => {
    const port = new FakeProcedureRecordPort();
    const persisted = createSyntheticProcedureRecord();
    const incoming = createSyntheticProcedureRecord({
      PayloadFingerprint: "synthetic-procedure-fingerprint-002",
    });
    port.byRecord.set(persisted.RecordId, persisted);
    port.byIdem.set(persisted.IdempotencyKey, persisted);
    assert.equal(await persistProcedureRecord(incoming, port), "save_failed");
    assert.equal(port.createCalls, 0);
  });

  it("maps definite create failure to save_failed", async () => {
    const port = new FakeProcedureRecordPort();
    port.createMode = "definite";
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), port),
      "save_failed",
    );
    assert.equal(port.createCalls, 1);
  });

  it("does not retry create after indeterminate; reconciles via dual lookup", async () => {
    const port = new FakeProcedureRecordPort();
    const record = createSyntheticProcedureRecord();
    port.createMode = "indeterminate";
    port.create = async (incoming) => {
      port.createCalls += 1;
      port.byRecord.set(incoming.RecordId, incoming);
      port.byIdem.set(incoming.IdempotencyKey, incoming);
      return { status: "INDETERMINATE" };
    };
    assert.equal(await persistProcedureRecord(record, port), "saved");
    assert.equal(port.createCalls, 1);
  });

  it("keeps save_outcome_unknown when create is indeterminate and lookups stay EMPTY", async () => {
    const port = new FakeProcedureRecordPort();
    port.createMode = "indeterminate";
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), port),
      "save_outcome_unknown",
    );
    assert.equal(port.createCalls, 1);
  });

  it("does not treat create success without GET-by-RecordId as saved", async () => {
    const port = new FakeProcedureRecordPort();
    port.createMode = "created_without_readback";
    assert.equal(
      await persistProcedureRecord(createSyntheticProcedureRecord(), port),
      "save_outcome_unknown",
    );
    assert.equal(port.createCalls, 1);
  });

  it("maps GET-by-RecordId clock mismatch after create to save_failed", async () => {
    const port = new FakeProcedureRecordPort();
    const incoming = createSyntheticProcedureRecord();
    port.create = async (record) => {
      port.createCalls += 1;
      port.byRecord.set(record.RecordId, {
        ...record,
        recordedAt: "2026-08-12T16:00:00+09:00",
      });
      port.byIdem.set(record.IdempotencyKey, record);
      return { status: "CREATED" };
    };
    assert.equal(await persistProcedureRecord(incoming, port), "save_failed");
  });
});

describe("classifyProcedureRecordLookups", () => {
  it("accepts new writes only when both lookups are EMPTY", () => {
    const incoming = createSyntheticProcedureRecord();
    assert.deepEqual(
      classifyProcedureRecordLookups(incoming, { status: "EMPTY" }, { status: "EMPTY" }),
      { kind: "ACCEPT_NEW" },
    );
  });
});
