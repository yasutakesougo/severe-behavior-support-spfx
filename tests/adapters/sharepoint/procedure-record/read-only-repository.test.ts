import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bindTestOnlyProvisionedProcedureRecordList,
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
  },
): ProcedureRecordLiveListTransport {
  const rows = overrides?.rows ?? [];
  return {
    async getSchema() {
      return {
        ok: true,
        list: {
          Id: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          Title: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
          ItemCount: 0,
        },
        fields: schemaFields(),
      };
    },
    async findByRecordId() {
      return { ok: true, rows };
    },
    async findByIdempotencyKey() {
      return { ok: true, rows };
    },
    ...overrides,
  };
}

describe("ProcedureRecord read-only live repository", () => {
  it("verifies the bound physical schema without creating items", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const transport = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    assert.deepEqual(await repository.verifyPhysicalSchema(), { ok: true });
    assert.equal(repository.liveWriteAuthorized, false);
    assert.equal(PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized, false);
  });

  it("maps empty dual lookup through persistProcedureRecord to save_failed without create", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const transport = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORGANIZATION_ID,
      SiteId: LOGICAL_SITE_ID,
    });
    assert.equal(await persistProcedureRecord(record, repository), "save_failed");
    assert.equal("createItem" in transport, false);
  });

  it("returns EMPTY for missing items and refuses create directly", async () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    const transport = createTransport();
    const repository = createReadOnlyProcedureRecordRepository(binding, transport);
    const lookup = await repository.findByRecordId("pr-missing");
    assert.equal(lookup.status, "EMPTY");
    assert.deepEqual(await repository.create(createSyntheticProcedureRecord()), {
      status: "DEFINITE_FAILURE",
    });
  });
});
