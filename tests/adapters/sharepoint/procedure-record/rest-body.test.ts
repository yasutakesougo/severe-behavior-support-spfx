import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCreateItemFields,
  FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS,
} from "../../../../src/adapters/sharepoint/procedure-record";
import { createSyntheticProcedureRecord } from "../../../domain/procedure-record-fixtures";

describe("ProcedureRecord REST create body", () => {
  it("omits Title and DERIVED envelope keys", () => {
    const result = buildCreateItemFields(createSyntheticProcedureRecord());
    assert.equal(result.ok, true);
    if (!result.ok) {
      return;
    }
    for (const key of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
      assert.equal(key in result.fields, false);
    }
  });
});
