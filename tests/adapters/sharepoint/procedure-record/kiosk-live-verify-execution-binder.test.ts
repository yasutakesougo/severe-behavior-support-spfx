import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  bindProcedureRecordList,
  bindTestOnlyProvisionedProcedureRecordList,
  createProcedureRecordKioskLiveVerifyExecutionRepository,
  createProcedureRecordLiveWriteAuthorization,
  createProcedureRecordLiveWriteExecutionRepository,
  isProcedureRecordLiveWriteAuthorized,
  PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
  PROCEDURE_RECORD_PR_RESULT_CHOICES,
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  type ObservedPhysicalField,
  type ProcedureRecordKioskLiveVerifyExecutionBinding,
  type ProcedureRecordKioskLiveVerifyGoPacket,
  type ProcedureRecordLiveListTransport,
  type ProcedureRecordLiveWriteGoPacket,
} from "../../../../src/adapters/sharepoint/procedure-record";
import {
  computeProcedureRecordPayloadFingerprint,
  mintProcedureRecordIdentity,
  procedureRecordFingerprintMaterial,
  type ProcedureRecord,
} from "../../../../src/domain/procedure-record";
import { assembleProcedureRecordForCreate } from "../../../../src/domain/procedure-record-staff-save";
import {
  SYNTHETIC_PLAN_ID,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
} from "../../../domain/support-plan-fixtures";
import {
  SYNTHETIC_PROCEDURE_P3_ID,
  SYNTHETIC_PROCEDURE_P3_VERSION,
} from "../../../domain/procedure-record-fixtures";

const here = dirname(fileURLToPath(import.meta.url));
const SYNTHETIC_MAIN_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const OTHER_MAIN_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const OTHER_LIST_GUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const OTHER_ORGANIZATION_ID = "other-org-001";
const OTHER_SITE_ID = "other-logical-site-id";
const OTHER_DIGEST = "4444444444444444444444444444444444444444444444444444444444444444";

function source(relativeFromRepoRoot: string): string {
  return readFileSync(join(here, "../../../../", relativeFromRepoRoot), "utf8");
}

function schemaFields(): ObservedPhysicalField[] {
  const fields: ObservedPhysicalField[] = PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS.map(
    (column) => ({
      InternalName: column.InternalName,
      StaticName: column.InternalName,
      Title: column.Title,
      TypeAsString: column.TypeAsString,
      Required: column.Required,
      EnforceUniqueValues: column.EnforceUniqueValues,
      Indexed: column.Indexed,
      MaxLength: column.MaxLength,
    }),
  );
  fields.push({
    InternalName: "prResult",
    StaticName: "prResult",
    Title: "実施結果",
    TypeAsString: "Choice",
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    Choices: [...PROCEDURE_RECORD_PR_RESULT_CHOICES],
    FillInChoice: false,
    DefaultValue: null,
  });
  fields.push({
    InternalName: "Title",
    StaticName: "Title",
    Title: "タイトル",
    TypeAsString: "Text",
    Required: false,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255,
  });
  return fields;
}

function createTransport(): {
  transport: ProcedureRecordLiveListTransport;
  calls: { getSchema: number; createItem: number };
} {
  const calls = { getSchema: 0, createItem: 0 };
  const transport: ProcedureRecordLiveListTransport = {
    targetListGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    async getSchema() {
      calls.getSchema += 1;
      return {
        ok: true,
        list: {
          Id: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          Title: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
          ItemCount: 1,
        },
        fields: schemaFields(),
      };
    },
    async findByRecordId() {
      return { ok: true, rows: [] };
    },
    async findByIdempotencyKey() {
      return { ok: true, rows: [] };
    },
    async createItem() {
      calls.createItem += 1;
      return { ok: true, listItemId: 2 };
    },
  };
  return { transport, calls };
}

function lockedRecord(): ProcedureRecord {
  const assembled = assembleProcedureRecordForCreate({
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    recordedBy: "synthetic-subject-001",
    planId: SYNTHETIC_PLAN_ID,
    planVersion: 3,
    ProcedureId: SYNTHETIC_PROCEDURE_P3_ID,
    ProcedureVersion: SYNTHETIC_PROCEDURE_P3_VERSION,
    result: "PERFORMED_AS_PLANNED",
    performedAtLocal: "2026-08-17T14:05",
    nowIso: "2026-08-17T14:10:00+09:00",
  });
  if (!assembled.ok) {
    throw new Error("locked ProcedureRecord fixture failed to assemble");
  }
  return assembled.record;
}

function kioskPacket(record: ProcedureRecord): ProcedureRecordKioskLiveVerifyGoPacket {
  return {
    purpose: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    logicalSiteId: record.SiteId,
    organizationId: record.OrganizationId,
    recordId: record.RecordId,
    idempotencyKey: record.IdempotencyKey,
    payloadFingerprint: record.PayloadFingerprint,
    mutationBudget: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  };
}

function kioskBinding(record: ProcedureRecord): ProcedureRecordKioskLiveVerifyExecutionBinding {
  return {
    authoritativeMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    organizationId: record.OrganizationId,
    logicalSiteId: record.SiteId,
    recordId: record.RecordId,
    idempotencyKey: record.IdempotencyKey,
    payloadFingerprint: record.PayloadFingerprint,
  };
}

function firstCreatePacket(record: ProcedureRecord): ProcedureRecordLiveWriteGoPacket {
  return {
    purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    itemCount: 0,
    logicalSiteId: record.SiteId,
    organizationId: record.OrganizationId,
  };
}

function testOnlyBinding(record: ProcedureRecord) {
  const binding = bindTestOnlyProvisionedProcedureRecordList({
    organizationId: record.OrganizationId,
    siteId: record.SiteId,
  });
  assert.ok(binding);
  return binding;
}

describe("EB-ROOT Kiosk execution repository binder", () => {
  it("EB-ROOT-01: valid Kiosk packet and exact binding mint a repository", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.equal(repository.liveWriteAuthorized, true);
    assert.equal(isProcedureRecordLiveWriteAuthorized(), false);
    assert.equal(createProcedureRecordLiveWriteAuthorization(), null);
  });

  it("EB-ROOT-02: first-create packet cannot mint a Kiosk repository", () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        testOnlyBinding(record),
        transport,
        firstCreatePacket(record),
        kioskBinding(record),
      ),
      null,
    );
    assert.equal(calls.createItem, 0);
  });

  it("EB-ROOT-03: Kiosk packet cannot mint the first-create repository", () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    assert.equal(
      createProcedureRecordLiveWriteExecutionRepository(
        testOnlyBinding(record),
        transport,
        kioskPacket(record),
        { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
      ),
      null,
    );
    assert.equal(calls.createItem, 0);
  });

  it("EB-ROOT-04: main SHA mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        testOnlyBinding(record),
        transport,
        kioskPacket(record),
        { ...kioskBinding(record), authoritativeMainSha: OTHER_MAIN_SHA },
      ),
      null,
    );
  });

  it("EB-ROOT-05: List mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    const binding = bindProcedureRecordList({
      organizationId: record.OrganizationId,
      siteId: record.SiteId,
      listGuid: OTHER_LIST_GUID,
    });
    assert.ok(binding);
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        binding,
        transport,
        kioskPacket(record),
        kioskBinding(record),
      ),
      null,
    );
  });

  it("EB-ROOT-06: organization mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    const binding = bindProcedureRecordList({
      organizationId: OTHER_ORGANIZATION_ID,
      siteId: record.SiteId,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });
    assert.ok(binding);
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        binding,
        transport,
        kioskPacket(record),
        kioskBinding(record),
      ),
      null,
    );
  });

  it("EB-ROOT-07: site mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    const binding = bindProcedureRecordList({
      organizationId: record.OrganizationId,
      siteId: OTHER_SITE_ID,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });
    assert.ok(binding);
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        binding,
        transport,
        kioskPacket(record),
        kioskBinding(record),
      ),
      null,
    );
  });

  it("EB-ROOT-08: RecordId mismatch in execution binding returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        testOnlyBinding(record),
        transport,
        kioskPacket(record),
        { ...kioskBinding(record), recordId: OTHER_DIGEST },
      ),
      null,
    );
  });

  it("EB-ROOT-09: IdempotencyKey mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        testOnlyBinding(record),
        transport,
        kioskPacket(record),
        { ...kioskBinding(record), idempotencyKey: OTHER_DIGEST },
      ),
      null,
    );
  });

  it("EB-ROOT-10: PayloadFingerprint mismatch returns null", () => {
    const record = lockedRecord();
    const { transport } = createTransport();
    assert.equal(
      createProcedureRecordKioskLiveVerifyExecutionRepository(
        testOnlyBinding(record),
        transport,
        kioskPacket(record),
        { ...kioskBinding(record), payloadFingerprint: OTHER_DIGEST },
      ),
      null,
    );
  });
});

describe("EB-REC Kiosk repository record identity lock", () => {
  it("EB-REC-01: exact locked ProcedureRecord may call mocked createItem", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(await repository.create(record), { status: "CREATED" });
    assert.equal(calls.createItem, 1);
  });

  it("EB-REC-02: different RecordId is DEFINITE_FAILURE with createItem=0", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(await repository.create({ ...record, RecordId: OTHER_DIGEST }), {
      status: "DEFINITE_FAILURE",
    });
    assert.equal(calls.createItem, 0);
    assert.equal(calls.getSchema, 0);
  });

  it("EB-REC-03: different IdempotencyKey is DEFINITE_FAILURE with createItem=0", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(await repository.create({ ...record, IdempotencyKey: OTHER_DIGEST }), {
      status: "DEFINITE_FAILURE",
    });
    assert.equal(calls.createItem, 0);
  });

  it("EB-REC-04: different PayloadFingerprint is DEFINITE_FAILURE with createItem=0", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(await repository.create({ ...record, PayloadFingerprint: OTHER_DIGEST }), {
      status: "DEFINITE_FAILURE",
    });
    assert.equal(calls.createItem, 0);
  });

  it("EB-REC-05: different OrganizationId is DEFINITE_FAILURE with createItem=0", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(
      await repository.create({ ...record, OrganizationId: OTHER_ORGANIZATION_ID }),
      {
        status: "DEFINITE_FAILURE",
      },
    );
    assert.equal(calls.createItem, 0);
  });

  it("EB-REC-06: different SiteId is DEFINITE_FAILURE with createItem=0", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    assert.deepEqual(await repository.create({ ...record, SiteId: OTHER_SITE_ID }), {
      status: "DEFINITE_FAILURE",
    });
    assert.equal(calls.createItem, 0);
  });

  it("EB-REC-07: stale fingerprint string after content change is refused", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    const mutated: ProcedureRecord = { ...record, result: "NOT_PERFORMED" };
    assert.notEqual(
      computeProcedureRecordPayloadFingerprint(procedureRecordFingerprintMaterial(mutated)),
      record.PayloadFingerprint,
    );
    assert.deepEqual(await repository.create(mutated), { status: "DEFINITE_FAILURE" });
    assert.equal(calls.createItem, 0);
  });

  it("EB-REC-08: stale RecordId/IdempotencyKey after UserId change is refused", async () => {
    const record = lockedRecord();
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordKioskLiveVerifyExecutionRepository(
      testOnlyBinding(record),
      transport,
      kioskPacket(record),
      kioskBinding(record),
    );
    assert.ok(repository);
    const mutated: ProcedureRecord = { ...record, UserId: "other-user-001" };
    const reminted = mintProcedureRecordIdentity({
      OrganizationId: mutated.OrganizationId,
      SiteId: mutated.SiteId,
      UserId: mutated.UserId,
      planId: mutated.planId,
      planVersion: mutated.planVersion,
      ProcedureId: mutated.Procedure.ProcedureId,
      ProcedureVersion: mutated.Procedure.ProcedureVersion,
      result: mutated.result,
      performedAt: mutated.performedAt,
      recordedAt: mutated.recordedAt,
      recordedBy: mutated.recordedBy,
    });
    assert.notEqual(reminted.RecordId, record.RecordId);
    assert.equal(
      computeProcedureRecordPayloadFingerprint(procedureRecordFingerprintMaterial(mutated)),
      record.PayloadFingerprint,
    );
    assert.deepEqual(await repository.create(mutated), { status: "DEFINITE_FAILURE" });
    assert.equal(calls.createItem, 0);
  });
});

describe("Kiosk execution binder default runtime and export", () => {
  it("keeps Staff form default persistPort on LIVE WRITE HOLD", () => {
    const form = source("spfx/src/shell/procedure/ProcedureRecordForm.tsx");
    assert.equal(form.includes("persistPort = STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT"), true);
    assert.equal(createProcedureRecordLiveWriteAuthorization(), null);
    assert.equal(isProcedureRecordLiveWriteAuthorized(), false);
  });

  it("does not hardcode PREP locked payload into production binder source", () => {
    const repository = source("src/adapters/sharepoint/procedure-record/read-only-repository.ts");
    const transport = source("spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts");
    const locked = [
      "a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd",
      "faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8",
      "69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af",
    ];
    for (const value of locked) {
      assert.equal(repository.includes(value), false);
      assert.equal(transport.includes(value), false);
    }
  });
});
