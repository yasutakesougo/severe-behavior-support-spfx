import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";

import type {
  ProcedureRecordListBinding,
  ProcedureRecordReadTransport,
  ReadOnlyProcedureRecordLookup,
} from "../../../../spfx/src/sbs-domain/procedure-record-read.bundle";

type BridgeModule = Readonly<{
  bindProcedureRecordList(input: {
    organizationId: string;
    siteId: string;
    listGuid: string;
  }): ProcedureRecordListBinding | null;
  createReadOnlyProcedureRecordLookup(
    binding: ProcedureRecordListBinding,
    transport: ProcedureRecordReadTransport,
  ): ReadOnlyProcedureRecordLookup;
}>;

const require = createRequire(import.meta.url);
const bridge =
  require("../../../../spfx/src/sbs-domain/procedure-record-read.bundle.js") as BridgeModule;
const declaration = readFileSync(
  new URL("../../../../spfx/src/sbs-domain/procedure-record-read.bundle.d.ts", import.meta.url),
  "utf8",
);
const bundleText = readFileSync(
  new URL("../../../../spfx/src/sbs-domain/procedure-record-read.bundle.js", import.meta.url),
  "utf8",
);

const LIST_GUID = "00000000-0000-0000-0000-000000000001";
const OTHER_LIST_GUID = "00000000-0000-0000-0000-000000000002";
const RECORD_ID = "synthetic-procedure-record-001";

const BASE_ROW: Readonly<Record<string, unknown>> = {
  prRecordId: RECORD_ID,
  prIdempotencyKey: "synthetic-procedure-idempotency-001",
  prPayloadFingerprint: "synthetic-procedure-fingerprint-001",
  prOrganizationId: "synthetic-org-001",
  prSiteId: "SITE-ISG",
  prUserId: "user-a",
  prProcedureId: "synthetic-procedure-p2",
  prProcedureVersion: "synthetic-procedure-p2-v1",
  prApprovalState: "APPROVED",
  prLocalDate: "2026-08-12",
  prPlanId: "synthetic-plan-001",
  prPlanVersion: "2",
  prResult: "PERFORMED_AS_PLANNED",
  prPerformedAt: "2026-08-12T14:05:00+09:00",
  prRecordedAt: "2026-08-12T15:32:00+09:00",
  prRecordedBy: "synthetic-subject-001",
};

function row(overrides: Readonly<Record<string, unknown>> = {}): Readonly<Record<string, unknown>> {
  return { ...BASE_ROW, ...overrides };
}

function binding(listGuid = LIST_GUID): ProcedureRecordListBinding {
  const value = bridge.bindProcedureRecordList({
    organizationId: "synthetic-org-001",
    siteId: "SITE-ISG",
    listGuid,
  });
  assert.notEqual(value, null);
  return value as ProcedureRecordListBinding;
}

function transport(
  rows: readonly Readonly<Record<string, unknown>>[],
): ProcedureRecordReadTransport {
  return {
    targetListGuid: LIST_GUID,
    findByRecordId: async () => ({ ok: true, rows }),
  };
}

async function lookup(
  rows: readonly Readonly<Record<string, unknown>>[],
  listGuid = LIST_GUID,
): Promise<ReadOnlyProcedureRecordLookup> {
  return bridge.createReadOnlyProcedureRecordLookup(binding(listGuid), transport(rows));
}

test("binding rejects missing fields, invalid GUID, and SiteId equal to List GUID", () => {
  assert.equal(
    bridge.bindProcedureRecordList({ organizationId: "", siteId: "SITE-ISG", listGuid: LIST_GUID }),
    null,
  );
  assert.equal(
    bridge.bindProcedureRecordList({
      organizationId: "synthetic-org-001",
      siteId: "",
      listGuid: LIST_GUID,
    }),
    null,
  );
  assert.equal(
    bridge.bindProcedureRecordList({
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      listGuid: "not-a-guid",
    }),
    null,
  );
  assert.equal(
    bridge.bindProcedureRecordList({
      organizationId: "synthetic-org-001",
      siteId: LIST_GUID,
      listGuid: LIST_GUID,
    }),
    null,
  );
});

test("one matching row returns FOUND", async () => {
  const result = await (await lookup([row()])).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FOUND");
  if (result.status === "FOUND") {
    assert.equal(result.value.RecordId, RECORD_ID);
    assert.equal(result.value.UserId, "user-a");
  }
});

test("zero rows returns EMPTY", async () => {
  const result = await (await lookup([])).findByRecordId(RECORD_ID);
  assert.equal(result.status, "EMPTY");
});

test("two rows returns MULTI_MATCH", async () => {
  const result = await (
    await lookup([row(), row({ prRecordId: "synthetic-procedure-record-002" })])
  ).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FETCH_FAILED");
  if (result.status === "FETCH_FAILED") {
    assert.equal(result.code, "MULTI_MATCH");
  }
});

test("malformed physical row fails closed", async () => {
  const result = await (
    await lookup([row({ prPlanVersion: "not-an-integer" })])
  ).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FETCH_FAILED");
  if (result.status === "FETCH_FAILED") {
    assert.equal(result.code, "MALFORMED_PHYSICAL");
  }
});

test("OrganizationId mismatch fails closed", async () => {
  const result = await (
    await lookup([row({ prOrganizationId: "other-org" })])
  ).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FETCH_FAILED");
  if (result.status === "FETCH_FAILED") {
    assert.equal(result.code, "SITE_BINDING_MISMATCH");
  }
});

test("SiteId mismatch fails closed", async () => {
  const result = await (await lookup([row({ prSiteId: "OTHER-SITE" })])).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FETCH_FAILED");
  if (result.status === "FETCH_FAILED") {
    assert.equal(result.code, "SITE_BINDING_MISMATCH");
  }
});

test("binding List GUID mismatch fails closed", async () => {
  const result = await (await lookup([row()], OTHER_LIST_GUID)).findByRecordId(RECORD_ID);
  assert.equal(result.status, "FETCH_FAILED");
  if (result.status === "FETCH_FAILED") {
    assert.equal(result.code, "LIST_BINDING_MISMATCH");
  }
});

test("runtime export surface contains only read operations", async () => {
  assert.deepEqual(
    Object.keys(bridge)
      .filter((key) => key !== "__esModule")
      .sort(),
    ["bindProcedureRecordList", "createReadOnlyProcedureRecordLookup"],
  );

  const value = await lookup([row()]);
  assert.deepEqual(Object.keys(value).sort(), ["binding", "findByRecordId"]);
  assert.equal(Object.isFrozen(value), true);
  assert.equal("create" in value, false);
  assert.equal("createItem" in value, false);
  assert.equal("repository" in value, false);
  assert.equal("port" in value, false);
});

test("write-capable transport methods are never called", async () => {
  let createCalls = 0;
  const transportWithWrite = {
    targetListGuid: LIST_GUID,
    findByRecordId: async () => ({ ok: true, rows: [row()] }),
    createItem: async () => {
      createCalls += 1;
      return { ok: false, failure: "FORBIDDEN" };
    },
  } as unknown as ProcedureRecordReadTransport;

  const value = bridge.createReadOnlyProcedureRecordLookup(binding(), transportWithWrite);
  const result = await value.findByRecordId(RECORD_ID);
  assert.equal(result.status, "FOUND");
  assert.equal(createCalls, 0);
});

test("declaration surface and bundle contain no write or external runtime exposure", () => {
  const publicDeclaration = declaration.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  for (const forbidden of [
    "createItem",
    "ProcedureRecordPersistencePort",
    "createProcedureRecordRepository",
    "LiveWrite",
    "liveWrite",
  ]) {
    assert.equal(publicDeclaration.includes(forbidden), false, `declaration exposed ${forbidden}`);
  }

  assert.equal(/require\(["']@microsoft\/sp-http["']\)/.test(bundleText), false);
  assert.equal(/require\(["']react(-dom)?["']\)/.test(bundleText), false);
  assert.equal(/require\(["']node:/.test(bundleText), false);
});
