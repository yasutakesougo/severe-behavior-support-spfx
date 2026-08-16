import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as procedureRecord from "../../../../src/adapters/sharepoint/procedure-record";

const here = dirname(fileURLToPath(import.meta.url));

describe("ProcedureRecord production export surface", () => {
  it("does not export test-only write seams", () => {
    assert.equal("createSyntheticAuthorizedProcedureRecordRepository" in procedureRecord, false);
    assert.equal("createSyntheticProcedureRecordSpHttpClientTransport" in procedureRecord, false);
    assert.equal(typeof procedureRecord.createProcedureRecordRepository, "function");
    assert.equal(typeof procedureRecord.createReadOnlyProcedureRecordRepository, "function");
  });

  it("does not export the SPFx test-only write seam from production index source", () => {
    const spfxIndex = readFileSync(
      join(here, "../../../../spfx/src/adapters/procedure-record/index.ts"),
      "utf8",
    );
    assert.equal(spfxIndex.includes("createSyntheticProcedureRecordSpHttpClientTransport"), false);
    assert.equal(spfxIndex.includes("createProcedureRecordSpHttpClientTransportFromHost"), true);
    assert.equal(spfxIndex.includes("createProcedureRecordSpHttpClientTransport"), true);
  });
});
