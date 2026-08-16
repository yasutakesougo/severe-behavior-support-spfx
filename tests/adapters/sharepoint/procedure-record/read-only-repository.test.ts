import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bindProcedureRecordList,
  bindTestOnlyProvisionedProcedureRecordList,
  createProcedureRecordRepository,
  createReadOnlyProcedureRecordRepository,
  PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS,
  PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIVE_WRITE_GATE,
  PROCEDURE_RECORD_PR_RESULT_CHOICES,
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  type ObservedPhysicalField,
  type ProcedureRecordLiveListTransport,
} from "../../../../src/adapters/sharepoint/procedure-record";
import { persistProcedureRecord } from "../../../../src/domain/procedure-record-persistence";
import { createSyntheticProcedureRecord } from "../../../domain/procedure-record-fixtures";

const LOGICAL_SITE_ID = "test-only-procedure-record-logical-site-id";
const ORGANIZATION_ID = "synthetic-org-001";
const OTHER_LIST_GUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

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

function createTransport(
  overrides?: Partial<ProcedureRecordLiveListTransport> & {
    rows?: readonly Readonly<Record<string, unknown>>[];
    itemCount?: number;
  },
): {
  transport: ProcedureRecordLiveListTransport;
  calls: {
    getSchema: number;
    findByRecordId: number;
    findByIdempotencyKey: number;
    createItem: number;
  };
} {
  const { rows: overrideRows, itemCount = 0, ...transportOverrides } = overrides ?? {};
  let rows: Readonly<Record<string, unknown>>[] = [...(overrideRows ?? [])];
  const calls = { getSchema: 0, findByRecordId: 0, findByIdempotencyKey: 0, createItem: 0 };
  const transport: ProcedureRecordLiveListTransport = {
    targetListGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    async getSchema() {
      calls.getSchema += 1;
      return {
        ok: true,
        list: {
          Id: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          Title: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
          ItemCount: itemCount,
        },
        fields: schemaFields(),
      };
    },
    async findByRecordId() {
      calls.findByRecordId += 1;
      return { ok: true, rows };
    },
    async findByIdempotencyKey() {
      calls.findByIdempotencyKey += 1;
      return { ok: true, rows };
    },
    async createItem(fields) {
      calls.createItem += 1;
      const encoded = {
        Id: 1,
        ...fields,
      };
      rows = [encoded];
      return { ok: true, listItemId: 1 };
    },
    ...transportOverrides,
  };
  return { transport, calls };
}

describe("ProcedureRecord write-capable live repository", () => {
  it("verifies the bound physical schema without creating items", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    assert.deepEqual(await repository.verifyPhysicalSchema(), { ok: true });
    assert.equal(repository.liveWriteAuthorized, false);
    assert.equal(PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized, false);
    assert.equal(calls.createItem, 0);
  });

  it("maps empty dual lookup through persistProcedureRecord to save_failed without createItem", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
    assert.equal(calls.createItem, 0);
    assert.equal("updateItem" in transport, false);
  });

  it("returns EMPTY for missing items and refuses create when the production gate is closed", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    const lookup = await repository.findByRecordId("pr-missing");
    assert.equal(lookup.status, "EMPTY");
    assert.deepEqual(await repository.create(createSyntheticProcedureRecord()), {
      status: "DEFINITE_FAILURE",
    });
    assert.equal(calls.createItem, 0);
  });

  it("fail-closes when binding.listGuid is not the transport target List GUID", async () => {
    const binding = bindProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
      listGuid: OTHER_LIST_GUID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);

    const schema = await repository.verifyPhysicalSchema();
    assert.equal(schema.ok, false);
    if (!schema.ok) {
      assert.ok(schema.reasons.includes("transport-target-mismatch"));
    }

    const lookup = await repository.findByRecordId("pr-missing");
    assert.equal(lookup.status, "FETCH_FAILED");
    if (lookup.status === "FETCH_FAILED") {
      assert.equal(lookup.code, "LIST_BINDING_MISMATCH");
    }

    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
    assert.equal(calls.getSchema, 0);
    assert.equal(calls.findByRecordId, 0);
    assert.equal(calls.findByIdempotencyKey, 0);
    assert.equal(calls.createItem, 0);
  });

  it("authorized create still fail-closes on LOOKUP-B GUID mismatch without I/O", async () => {
    const binding = bindProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
      listGuid: OTHER_LIST_GUID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordRepository(binding, transport, {
      itemCreateAuthorized: true,
      liveTenantIoAuthorized: false,
    });
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.deepEqual(await repository.create(record), { status: "DEFINITE_FAILURE" });
    assert.equal(calls.getSchema, 0);
    assert.equal(calls.createItem, 0);
  });

  it("authorized create is DEFINITE_FAILURE when ItemCount is not 0", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport({ itemCount: 1 });
    const repository = createProcedureRecordRepository(binding, transport, {
      itemCreateAuthorized: true,
      liveTenantIoAuthorized: false,
    });
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.deepEqual(await repository.create(record), { status: "DEFINITE_FAILURE" });
    assert.equal(calls.getSchema, 1);
    assert.equal(calls.createItem, 0);
  });

  it("authorized synthetic create persists through GET-by-RecordId as saved", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const { transport, calls } = createTransport();
    const repository = createProcedureRecordRepository(binding, transport, {
      itemCreateAuthorized: true,
      liveTenantIoAuthorized: false,
    });
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.equal(repository.liveWriteAuthorized, true);
    assert.equal(PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized, false);
    assert.equal(await persistProcedureRecord(record, repository), "saved");
    assert.equal(calls.createItem, 1);
    assert.equal(calls.getSchema, 1);
  });
});
