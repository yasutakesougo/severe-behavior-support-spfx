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
  it("does not export test-only write seams or POST helper", () => {
    assert.equal("createSyntheticAuthorizedProcedureRecordRepository" in procedureRecord, false);
    assert.equal("createSyntheticProcedureRecordSpHttpClientTransport" in procedureRecord, false);
    assert.equal("postProcedureRecordCreateItem" in procedureRecord, false);
    assert.equal("PROCEDURE_RECORD_LIVE_WRITE_GATE" in procedureRecord, false);
    assert.equal("isProcedureRecordItemCreateAuthorized" in procedureRecord, false);
    assert.equal(typeof procedureRecord.createProcedureRecordRepository, "function");
    assert.equal(typeof procedureRecord.createReadOnlyProcedureRecordRepository, "function");
    assert.equal(
      typeof procedureRecord.createProcedureRecordLiveWriteExecutionRepository,
      "function",
    );
    assert.equal(typeof procedureRecord.createProcedureRecordLiveWriteAuthorization, "function");
    assert.equal(
      typeof procedureRecord.createProcedureRecordLiveWriteAuthorizationFromGoPacket,
      "function",
    );
    assert.equal(procedureRecord.createProcedureRecordLiveWriteAuthorization(), null);
    assert.equal(procedureRecord.isProcedureRecordLiveWriteAuthorized(), false);
    assert.equal(
      procedureRecord.createProcedureRecordLiveWriteAuthorizationFromGoPacket({
        itemCreateAuthorized: true,
        liveTenantIoAuthorized: true,
      }),
      null,
    );
  });

  it("does not export the SPFx POST helper or mint from production index source", () => {
    const spfxIndex = source("spfx/src/adapters/procedure-record/index.ts");
    assert.equal(spfxIndex.includes("createSyntheticProcedureRecordSpHttpClientTransport"), false);
    assert.equal(spfxIndex.includes("postProcedureRecordCreateItem"), false);
    assert.equal(
      spfxIndex.includes("createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket"),
      false,
    );
    assert.equal(spfxIndex.includes("SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE"), false);
    assert.equal(spfxIndex.includes("createProcedureRecordSpHttpClientTransportFromHost"), true);
    assert.equal(spfxIndex.includes("createProcedureRecordLiveWriteSpHttpClientTransport"), true);
    const factory = source(
      "spfx/src/adapters/procedure-record/sphttpclient-list-transport.factory.ts",
    );
    assert.equal(factory.includes("itemCreateAuthorized"), false);
    assert.equal(factory.includes("liveTenantIoAuthorized"), false);
    assert.equal(factory.includes("createProcedureRecordLiveWriteSpHttpClientTransport"), false);
  });

  it("keeps GO packet rules aligned and does not export mutable gate flags", () => {
    const rootGate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    const spfxGate = source("spfx/src/adapters/procedure-record/live-write-gate.ts");
    assert.equal(rootGate.includes("export const PROCEDURE_RECORD_LIVE_WRITE_GATE"), false);
    assert.equal(spfxGate.includes("export const SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE"), false);
    assert.equal(rootGate.includes("purpose !== PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE"), true);
    assert.equal(spfxGate.includes("purpose !== PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE"), true);
    assert.equal(rootGate.includes("packet.itemCount !== 0"), true);
    assert.equal(spfxGate.includes("packet.itemCount !== 0"), true);
    assert.equal(rootGate.includes("procedure-record-first-create"), true);
    assert.equal(spfxGate.includes("procedure-record-first-create"), true);
  });

  it("keeps the reviewed POST helper module-private and authorization-gated", () => {
    const repository = source("src/adapters/sharepoint/procedure-record/read-only-repository.ts");
    const transport = source("spfx/src/adapters/procedure-record/sphttpclient-list-transport.ts");
    assert.equal(
      repository.includes("createProcedureRecordLiveWriteAuthorizationFromGoPacket"),
      true,
    );
    assert.equal(repository.includes("transport.createItem"), true);
    assert.equal(
      transport.includes("createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket"),
      true,
    );
    assert.equal(transport.includes("export async function postProcedureRecordCreateItem"), false);
    assert.equal(transport.includes("async function postProcedureRecordCreateItem"), true);
    assert.equal(
      transport.includes("isSpfxProcedureRecordLiveWriteAuthorization(input.authorization)"),
      true,
    );
    assert.equal(transport.includes("${input.listApiUrl}/items"), true);
    assert.equal(transport.includes('Accept: "application/json;odata=verbose"'), true);
    assert.equal(transport.includes("/lists/GetByTitle"), false);
  });
});
