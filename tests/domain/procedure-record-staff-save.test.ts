import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCreateItemFields } from "../../src/adapters/sharepoint/procedure-record/rest-body";
import { PROCEDURE_RECORD_PHYSICAL_COLUMNS } from "../../src/adapters/sharepoint/procedure-record/physical-columns";
import {
  PROCEDURE_RECORD_RESULTS,
  validateProcedureRecord,
} from "../../src/domain/procedure-record";
import {
  createLiveWriteHoldProcedureRecordPersistencePort,
  persistProcedureRecord,
  type ProcedureRecordCreateAttempt,
  type ProcedureRecordPersistencePort,
} from "../../src/domain/procedure-record-persistence";
import {
  asiaTokyoDateTimeLocalToIso,
  assembleProcedureRecordForCreate,
  persistStaffProcedureRecord,
  type StaffProcedureRecordCreateInput,
} from "../../src/domain/procedure-record-staff-save";
import type { LookupResult } from "../../src/contracts/types";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import {
  SYNTHETIC_PLAN_ID,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
} from "./support-plan-fixtures";
import {
  SYNTHETIC_PROCEDURE_P3_ID,
  SYNTHETIC_PROCEDURE_P3_VERSION,
} from "./procedure-record-fixtures";

const NOW_ISO = "2026-08-13T14:10:00+09:00";

function staffInput(
  overrides?: Partial<StaffProcedureRecordCreateInput>,
): StaffProcedureRecordCreateInput {
  return {
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    recordedBy: "synthetic-subject-001",
    planId: SYNTHETIC_PLAN_ID,
    planVersion: 3,
    ProcedureId: SYNTHETIC_PROCEDURE_P3_ID,
    ProcedureVersion: SYNTHETIC_PROCEDURE_P3_VERSION,
    result: "PERFORMED_AS_PLANNED",
    performedAtLocal: "2026-08-13T14:05",
    nowIso: NOW_ISO,
    ...overrides,
  };
}

class SpyProcedureRecordPort implements ProcedureRecordPersistencePort {
  readonly byRecord = new Map<string, ProcedureRecord>();
  readonly byIdem = new Map<string, ProcedureRecord>();
  createCalls = 0;
  lookupMode: "ok" | "fetch_failed" | "forbidden" = "ok";
  createMode: "created" | "definite" | "indeterminate" = "created";

  async findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>> {
    return this.lookup(this.byRecord.get(recordId));
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecord>> {
    return this.lookup(this.byIdem.get(idempotencyKey));
  }

  async create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt> {
    this.createCalls += 1;
    if (this.createMode === "definite") {
      return { status: "DEFINITE_FAILURE" };
    }
    if (this.createMode === "indeterminate") {
      return { status: "INDETERMINATE" };
    }
    this.byRecord.set(record.RecordId, record);
    this.byIdem.set(record.IdempotencyKey, record);
    return { status: "CREATED" };
  }

  private lookup(found: ProcedureRecord | undefined): LookupResult<ProcedureRecord> {
    if (this.lookupMode === "forbidden") {
      return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
    }
    if (this.lookupMode === "fetch_failed") {
      return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
    }
    if (found === undefined) {
      return { status: "EMPTY" };
    }
    return { status: "FOUND", value: found };
  }
}

describe("KIOSK-SPFX-PERSISTENCE-1 staff CREATE", () => {
  it("PERSIST-02: assembles a complete ProcedureRecord from staff draft", () => {
    const assembled = assembleProcedureRecordForCreate(staffInput());
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    assert.equal(validateProcedureRecord(assembled.record), true);
    assert.equal(assembled.record.TimeZone, "Asia/Tokyo");
    assert.equal(assembled.record.performedAt, "2026-08-13T14:05:00+09:00");
    assert.equal(assembled.record.recordedAt, NOW_ISO);
    assert.equal(assembled.record.LocalDate, "2026-08-13");
    assert.equal(assembled.record.Procedure.ApprovalState, "APPROVED");
    assert.match(assembled.record.RecordId, /^[0-9a-f]{64}$/);
    assert.match(assembled.record.IdempotencyKey, /^[0-9a-f]{64}$/);
    assert.match(assembled.record.PayloadFingerprint, /^[0-9a-f]{64}$/);
    assert.notEqual(assembled.record.RecordId, assembled.record.IdempotencyKey);
    assert.notEqual(assembled.record.RecordId, assembled.record.PayloadFingerprint);
  });

  it("PERSIST-01: staff save calls persistProcedureRecord", async () => {
    const port = new SpyProcedureRecordPort();
    const result = await persistStaffProcedureRecord(staffInput(), port);
    assert.equal(result.persistCalled, true);
    assert.equal(result.saveState, "saved");
    assert.equal(port.createCalls, 1);
    assert.ok(result.record);
    assert.equal(await persistProcedureRecord(result.record, port), "saved");
  });

  it("PERSIST-03: saved only after persist success (GET-by-RecordId path)", async () => {
    const port = new SpyProcedureRecordPort();
    const result = await persistStaffProcedureRecord(staffInput(), port);
    assert.equal(result.saveState, "saved");
    assert.equal(port.byRecord.size, 1);
  });

  it("PERSIST-03/04: LIVE WRITE HOLD port never reaches saved", async () => {
    const result = await persistStaffProcedureRecord(
      staffInput(),
      createLiveWriteHoldProcedureRecordPersistencePort(),
    );
    assert.equal(result.persistCalled, true);
    assert.equal(result.saveState, "save_failed");
  });

  it("PERSIST-04: persist definite failure is save_failed", async () => {
    const port = new SpyProcedureRecordPort();
    port.createMode = "definite";
    const result = await persistStaffProcedureRecord(staffInput(), port);
    assert.equal(result.saveState, "save_failed");
    assert.equal(port.createCalls, 1);
  });

  it("PERSIST-04: persist lookup forbidden is save_failed", async () => {
    const port = new SpyProcedureRecordPort();
    port.lookupMode = "forbidden";
    const result = await persistStaffProcedureRecord(staffInput(), port);
    assert.equal(result.saveState, "save_failed");
    assert.equal(port.createCalls, 0);
  });

  it("PERSIST-04: persist transport lookup failure is save_outcome_unknown, not saved", async () => {
    const port = new SpyProcedureRecordPort();
    port.lookupMode = "fetch_failed";
    const result = await persistStaffProcedureRecord(staffInput(), port);
    assert.equal(result.saveState, "save_outcome_unknown");
    assert.equal(port.createCalls, 0);
  });

  it("PERSIST-06: duplicate save of the same payload does not start a second create", async () => {
    const port = new SpyProcedureRecordPort();
    const input = staffInput();
    const first = await persistStaffProcedureRecord(input, port);
    const second = await persistStaffProcedureRecord(input, port);
    assert.equal(first.saveState, "saved");
    assert.equal(second.saveState, "saved");
    assert.equal(first.record?.RecordId, second.record?.RecordId);
    assert.equal(first.record?.IdempotencyKey, second.record?.IdempotencyKey);
    assert.equal(port.createCalls, 1);
  });

  it("PERSIST-07: all three result values assemble and persist", async () => {
    for (const result of PROCEDURE_RECORD_RESULTS) {
      const port = new SpyProcedureRecordPort();
      const saved = await persistStaffProcedureRecord(staffInput({ result }), port);
      assert.equal(saved.saveState, "saved");
      assert.equal(saved.record?.result, result);
    }
  });

  it("PERSIST-08: missing / invalid context is fail-closed without persist", async () => {
    const port = new SpyProcedureRecordPort();
    const cases: Partial<StaffProcedureRecordCreateInput>[] = [
      { SiteId: "" },
      { UserId: "" },
      { ProcedureId: "" },
      { recordedBy: "" },
      { result: "FAILED" },
      { result: undefined },
      { performedAtLocal: "" },
      { nowIso: "not-an-iso" },
      { OrganizationId: "" },
    ];
    for (const overrides of cases) {
      const result = await persistStaffProcedureRecord(staffInput(overrides), port);
      assert.equal(result.saveState, "save_failed");
      assert.equal(result.persistCalled, false);
      assert.equal(result.record, null);
    }
    assert.equal(port.createCalls, 0);
  });

  it("PERSIST-09: CREATE payload uses existing physical columns only", () => {
    const assembled = assembleProcedureRecordForCreate(staffInput());
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    const body = buildCreateItemFields(assembled.record);
    assert.equal(body.ok, true);
    if (!body.ok) {
      return;
    }
    const allowed = new Set<string>(Object.values(PROCEDURE_RECORD_PHYSICAL_COLUMNS));
    for (const key of Object.keys(body.fields)) {
      assert.equal(allowed.has(key), true);
      assert.notEqual(key, "Title");
    }
    assert.equal(Object.prototype.hasOwnProperty.call(body.fields, "Title"), false);
  });

  it("PERSIST-10: assembled record does not require slot, chips, or D6 fields", () => {
    const assembled = assembleProcedureRecordForCreate(staffInput({ result: "NOT_PERFORMED" }));
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    const keys = Object.keys(assembled.record);
    assert.equal(keys.includes("slot"), false);
    assert.equal(keys.includes("note"), false);
    assert.equal(keys.includes("様子"), false);
    assert.equal(keys.includes("支援者の対応"), false);
    assert.equal(keys.includes("変化"), false);
    assert.equal(keys.includes("メモ"), false);
    assert.equal(keys.includes("cancel"), false);
    assert.equal(keys.includes("deletedAt"), false);
  });

  it("reuses recordedAt freeze on retry of the same payload", () => {
    const frozen = "2026-08-13T14:09:00+09:00";
    const first = assembleProcedureRecordForCreate(staffInput({ recordedAtIso: frozen }));
    const second = assembleProcedureRecordForCreate(
      staffInput({ recordedAtIso: frozen, nowIso: "2026-08-13T14:59:00+09:00" }),
    );
    assert.equal(first.ok && second.ok, true);
    if (!first.ok || !second.ok) {
      return;
    }
    assert.equal(first.record.recordedAt, frozen);
    assert.equal(second.record.RecordId, first.record.RecordId);
    assert.equal(second.record.IdempotencyKey, first.record.IdempotencyKey);
  });

  it("maps datetime-local to D4=A Asia/Tokyo ISO", () => {
    assert.equal(asiaTokyoDateTimeLocalToIso("2026-08-13T14:05"), "2026-08-13T14:05:00+09:00");
    assert.equal(asiaTokyoDateTimeLocalToIso(""), null);
    assert.equal(asiaTokyoDateTimeLocalToIso("2026-08-13"), null);
  });
});
