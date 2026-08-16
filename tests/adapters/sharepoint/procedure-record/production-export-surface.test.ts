import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import * as procedureRecord from "../../../../src/adapters/sharepoint/procedure-record";

const here = dirname(fileURLToPath(import.meta.url));

function source(relativeFromRepoRoot: string): string {
  return readFileSync(join(here, "../../../../", relativeFromRepoRoot), "utf8");
}

describe("ProcedureRecord production export surface", () => {
  it("does not export test-only write seams", () => {
    assert.equal("createSyntheticAuthorizedProcedureRecordRepository" in procedureRecord, false);
    assert.equal("createSyntheticProcedureRecordSpHttpClientTransport" in procedureRecord, false);
    assert.equal("postProcedureRecordCreateItem" in procedureRecord, false);
    assert.equal(typeof procedureRecord.createProcedureRecordRepository, "function");
    assert.equal(typeof procedureRecord.createReadOnlyProcedureRecordRepository, "function");
    assert.equal(typeof procedureRecord.createProcedureRecordLiveWriteAuthorization, "function");
    assert.equal(procedureRecord.createProcedureRecordLiveWriteAuthorization(), null);
  });

  it("does not export the SPFx POST helper or execution gate from production index source", () => {
    const spfxIndex = source("spfx/src/adapters/procedure-record/index.ts");
    assert.equal(spfxIndex.includes("createSyntheticProcedureRecordSpHttpClientTransport"), false);
    assert.equal(spfxIndex.includes("postProcedureRecordCreateItem"), false);
    assert.equal(spfxIndex.includes("createSpfxProcedureRecordLiveWriteAuthorization"), false);
    assert.equal(spfxIndex.includes("SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE"), false);
    assert.equal(spfxIndex.includes("createProcedureRecordSpHttpClientTransportFromHost"), true);
    assert.equal(spfxIndex.includes("createProcedureRecordSpHttpClientTransport"), true);
    const factory = source(
      "spfx/src/adapters/procedure-record/sphttpclient-list-transport.factory.ts",
    );
    assert.equal(factory.includes("itemCreateAuthorized"), false);
    assert.equal(factory.includes("liveTenantIoAuthorized"), false);
  });

  it("keeps both production execution gates closed and aligned", () => {
    const rootGate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    const spfxGate = source("spfx/src/adapters/procedure-record/live-write-gate.ts");
    assert.equal(rootGate.includes("itemCreateAuthorized: false"), true);
    assert.equal(rootGate.includes("liveTenantIoAuthorized: false"), true);
    assert.equal(spfxGate.includes("itemCreateAuthorized: false"), true);
    assert.equal(spfxGate.includes("liveTenantIoAuthorized: false"), true);
    assert.equal(rootGate.includes("itemCreateAuthorized: true"), false);
    assert.equal(spfxGate.includes("itemCreateAuthorized: true"), false);
    assert.equal(procedureRecord.PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized, false);
    assert.equal(procedureRecord.PROCEDURE_RECORD_LIVE_WRITE_GATE.liveTenantIoAuthorized, false);
  });

  it("wires production create to mint authorization then reach the reviewed POST helper", () => {
    const repository = source("src/adapters/sharepoint/procedure-record/read-only-repository.ts");
    const transport = source("spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts");
    assert.equal(repository.includes("createProcedureRecordLiveWriteAuthorization"), true);
    assert.equal(repository.includes("transport.createItem"), true);
    assert.equal(transport.includes("createSpfxProcedureRecordLiveWriteAuthorization"), true);
    assert.equal(transport.includes("postProcedureRecordCreateItem"), true);
    assert.equal(transport.includes("${input.listApiUrl}/items"), true);
    assert.equal(transport.includes("/lists/GetByTitle"), false);
  });
});
