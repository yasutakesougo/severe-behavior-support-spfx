import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS,
  PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_PR_RESULT_CHOICES,
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  verifyProcedureRecordPhysicalSchema,
  type ObservedListIdentity,
  type ObservedPhysicalField,
} from "../../../../src/adapters/sharepoint/procedure-record";

function observedCompleteFields(): ObservedPhysicalField[] {
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

function observedList(): ObservedListIdentity {
  return {
    Id: `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    Title: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
    ItemCount: 0,
  };
}

describe("ProcedureRecord physical schema verification", () => {
  it("accepts the provisioning-complete REST observation", () => {
    const result = verifyProcedureRecordPhysicalSchema(observedList(), observedCompleteFields());
    assert.deepEqual(result, { ok: true });
  });

  it("rejects Title Required, extra unique/index, forbidden columns, and ItemCount", () => {
    const fields = observedCompleteFields().map((field) => {
      if (field.InternalName === "Title") {
        return { ...field, Required: true };
      }
      if (field.InternalName === "prUserId") {
        return { ...field, Indexed: true };
      }
      return field;
    });
    fields.push({
      InternalName: "schemaId",
      TypeAsString: "Text",
      Required: false,
      EnforceUniqueValues: false,
      Indexed: false,
    });
    const result = verifyProcedureRecordPhysicalSchema({ ...observedList(), ItemCount: 1 }, fields);
    assert.equal(result.ok, false);
    if (result.ok) {
      return;
    }
    assert.ok(result.reasons.includes("required:Title"));
    assert.ok(result.reasons.includes("forbidden-column:schemaId"));
    assert.ok(result.reasons.includes("extra-index:prUserId"));
    assert.ok(result.reasons.includes("item-count-not-zero"));
  });

  it("rejects prResult choice drift", () => {
    const fields = observedCompleteFields().map((field) =>
      field.InternalName === "prResult"
        ? {
            ...field,
            Choices: [
              "PERFORMED_AS_PLANNED",
              "PERFORMED_WITH_ADAPTATION",
              "NOT_PERFORMED",
              "FAILED",
            ],
          }
        : field,
    );
    const result = verifyProcedureRecordPhysicalSchema(observedList(), fields);
    assert.equal(result.ok, false);
    if (result.ok) {
      return;
    }
    assert.ok(result.reasons.includes("choices:prResult"));
  });
});
