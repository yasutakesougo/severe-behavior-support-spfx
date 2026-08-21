import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES,
  verifyProcedureRecordLifecycleEventPhysicalSchema,
  type ObservedLifecycleEventListIdentity,
  type ObservedLifecycleEventPhysicalField,
} from "../../../../src/adapters/sharepoint/procedure-record-lifecycle-event";

function observedFields(): ObservedLifecycleEventPhysicalField[] {
  const fields: ObservedLifecycleEventPhysicalField[] =
    PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS.map((column) => ({
      InternalName: column.InternalName,
      StaticName: column.InternalName,
      TypeAsString: "Text",
      Required: column.Required,
      EnforceUniqueValues: column.EnforceUniqueValues,
      Indexed: column.Indexed,
      MaxLength: column.MaxLength,
    }));
  fields.push({
    InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType,
    StaticName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType,
    TypeAsString: "Choice",
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    Choices: [...PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES],
    FillInChoice: false,
  });
  fields.push({
    InternalName: "Title",
    StaticName: "Title",
    TypeAsString: "Text",
    Required: false,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255,
  });
  return fields;
}

function observedList(): ObservedLifecycleEventListIdentity {
  return {
    Id: `{${PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    Title: PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
    ItemCount: 0,
  };
}

describe("ProcedureRecordLifecycleEvent physical schema", () => {
  it("accepts the locked LN-1 / Package A / TP-1 / PG-3 schema", () => {
    assert.deepEqual(
      verifyProcedureRecordLifecycleEventPhysicalSchema(
        PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        observedList(),
        observedFields(),
      ),
      { ok: true },
    );
  });

  it("fails closed while the separately-gated lifeSchemaVersion provisioning delta is absent", () => {
    const fields = observedFields().filter(
      (field) =>
        field.InternalName !==
        PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.schemaVersion,
    );
    const result = verifyProcedureRecordLifecycleEventPhysicalSchema(
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
      observedList(),
      fields,
    );
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(
        result.reasons.includes(
          `missing:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.schemaVersion}`,
        ),
      );
    }
  });

  it("rejects list identity/title drift and eventType vocabulary drift", () => {
    const fields = observedFields().map((field) =>
      field.InternalName === PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType
        ? { ...field, Choices: ["SUPERSEDE", "CANCEL", "DELETE"] }
        : field,
    );
    const result = verifyProcedureRecordLifecycleEventPhysicalSchema(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      { ...observedList(), Title: "wrong" },
      fields,
    );
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.reasons.includes("list-guid-mismatch"));
      assert.ok(result.reasons.includes("list-display-name-mismatch"));
      assert.ok(
        result.reasons.includes(
          `choices:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`,
        ),
      );
    }
  });

  it("rejects extra lifecycle unique/index drift and Title becoming required", () => {
    const fields = observedFields().map((field) => {
      if (field.InternalName === PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.reason) {
        return { ...field, EnforceUniqueValues: true, Indexed: true };
      }
      if (field.InternalName === "Title") {
        return { ...field, Required: true };
      }
      return field;
    });
    const result = verifyProcedureRecordLifecycleEventPhysicalSchema(
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
      observedList(),
      fields,
    );
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(
        result.reasons.includes(
          `extra-unique:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.reason}`,
        ),
      );
      assert.ok(
        result.reasons.includes(
          `extra-index:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.reason}`,
        ),
      );
      assert.ok(result.reasons.includes("required:Title"));
    }
  });
});
