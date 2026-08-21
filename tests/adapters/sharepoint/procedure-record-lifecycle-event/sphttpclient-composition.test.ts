/**
 * GATE-3 SPHttpClient × Slice E storage port × Slice C persist (authoritative).
 * Synthetic SPHttpClient doubles only. No live tenant I/O.
 *
 * Loads GATE-3 transport from the SPFx source module via a one-shot CJS bundle
 * (Node 22 + node:test cannot named-import the SPFx .ts module reliably).
 * Does not import the production barrel (mint / synthetic-create stay off index).
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES,
  bindProcedureRecordLifecycleEventList,
  createProcedureRecordCancellationSharePointStoragePort,
  encodeProcedureRecordLifecycleEventPhysicalRow,
  type ObservedLifecycleEventPhysicalField,
  type ProcedureRecordLifecycleEventListTransport,
} from "../../../../src/adapters/sharepoint/procedure-record-lifecycle-event";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
  mintLifecycleEventIdentity,
  type ProcedureRecordLifecycleEvent,
} from "../../../../src/domain/kiosk-contract";
import { persistProcedureRecordCancellation } from "../../../../src/domain/procedure-record-cancellation-persistence";

const require = createRequire(import.meta.url);
const transportSource = fileURLToPath(
  new URL(
    "../../../../spfx/src/adapters/procedure-record-lifecycle-event/sphttpclient-list-transport.ts",
    import.meta.url,
  ),
);
const transportBundle = path.join(tmpdir(), "gate3-lifecycle-sphttpclient-list-transport.cjs");
execFileSync(
  require.resolve("esbuild/bin/esbuild"),
  [
    transportSource,
    "--bundle",
    "--platform=node",
    "--format=cjs",
    `--outfile=${transportBundle}`,
    "--log-level=error",
  ],
  { stdio: "pipe" },
);

type LifecycleSpHttpModule = {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID: string;
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY: string;
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE: string;
  createProcedureRecordLifecycleEventSpHttpClientTransport: (
    options: Record<string, unknown>,
  ) => ProcedureRecordLifecycleEventListTransport;
  createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport: (
    options: Record<string, unknown>,
    authorization: unknown,
  ) => ProcedureRecordLifecycleEventListTransport;
  mintProcedureRecordLifecycleEventSyntheticCreateAuthorization: () => unknown;
  ProcedureRecordLifecycleEventSpHttpClient: unknown;
};

const LifecycleSpHttp = require(transportBundle) as LifecycleSpHttpModule;

const COLUMNS = PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS;
const SYNTHETIC_CONFIGURATION = { kind: "synthetic-sphttpclient-v1" };
const SYNTHETIC_WEB = "https://synthetic.example.invalid/sites/severe-support-procedurerecord-test";

const SITE_IDENTITY = LifecycleSpHttp.PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY;
const LIST_GUID = LifecycleSpHttp.PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID;
const ENTITY_TYPE =
  LifecycleSpHttp.PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE;

type StoredRow = Record<string, unknown>;
type SpHttpClient = {
  get(
    url: string,
    configuration: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
  post(
    url: string,
    configuration: unknown,
    options: { headers?: Record<string, string>; body?: string },
  ): Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
};

function makeCancelEvent(reason = "duplicate entry"): ProcedureRecordLifecycleEvent {
  const input = {
    eventType: "CANCEL" as const,
    targetRecordId: "record-001",
    recordedAt: "2026-08-21T00:00:00.000Z",
    recordedBy: "staff-001",
    reason,
  };
  return {
    schemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
    ...mintLifecycleEventIdentity(input),
    ...input,
  };
}

function makeSupersedeEvent(): ProcedureRecordLifecycleEvent {
  const input = {
    eventType: "SUPERSEDE" as const,
    targetRecordId: "record-001",
    replacementRecordId: "record-002",
    recordedAt: "2026-08-21T00:01:00.000Z",
    recordedBy: "staff-001",
    reason: "correction",
  };
  return {
    schemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
    ...mintLifecycleEventIdentity(input),
    ...input,
  };
}

function observedFields(): ObservedLifecycleEventPhysicalField[] {
  const fields: ObservedLifecycleEventPhysicalField[] = [];
  for (const column of PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS) {
    fields.push({
      InternalName: column.InternalName,
      StaticName: column.InternalName,
      TypeAsString: "Text",
      Required: column.Required,
      EnforceUniqueValues: column.EnforceUniqueValues,
      Indexed: column.Indexed,
      MaxLength: column.MaxLength,
    });
  }
  fields.push({
    InternalName: COLUMNS.eventType,
    StaticName: COLUMNS.eventType,
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

function createStatefulSyntheticClient(options: {
  createMode?:
    | "created"
    | "conflict_409"
    | "forbidden_403"
    | "timeout"
    | "created_empty_readback"
    | "created_nonexact";
}): {
  client: SpHttpClient;
  rows: StoredRow[];
  postCount: () => number;
} {
  const rows: StoredRow[] = [];
  let postCount = 0;
  const createMode = options.createMode ?? "created";

  function filterRows(field: string, token: string): StoredRow[] {
    return rows.filter((row) => row[field] === token);
  }

  const client: SpHttpClient = {
    async get(url) {
      if (url.includes("/fields")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ value: observedFields() }),
        };
      }
      if (url.includes("?$select=Id,Title,ItemCount")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Id: LIST_GUID,
            Title: PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
            ItemCount: rows.length,
          }),
        };
      }

      const decoded = decodeURIComponent(url);
      const match =
        /life(LifecycleEventId|LifecycleIdempotencyKey|TargetRecordId) eq '([^']*)'/.exec(
          decoded.replace(/''/g, "'"),
        );
      if (!match) {
        return { ok: false, status: 500, json: async () => ({}) };
      }
      const fieldMap = {
        LifecycleEventId: COLUMNS.lifecycleEventId,
        LifecycleIdempotencyKey: COLUMNS.lifecycleIdempotencyKey,
        TargetRecordId: COLUMNS.targetRecordId,
      } as const;
      const field = fieldMap[match[1] as keyof typeof fieldMap];
      return {
        ok: true,
        status: 200,
        json: async () => ({ value: filterRows(field, match[2]) }),
      };
    },
    async post(_url, _configuration, request) {
      postCount += 1;
      if (createMode === "timeout") {
        throw new Error("network timeout");
      }
      if (createMode === "forbidden_403") {
        return { ok: false, status: 403, json: async () => ({}) };
      }
      if (createMode === "conflict_409") {
        return { ok: false, status: 409, json: async () => ({}) };
      }
      const body = JSON.parse(request.body ?? "{}") as Record<string, unknown>;
      const fields: Record<string, unknown> = { ...body };
      delete fields.__metadata;
      if (createMode === "created") {
        rows.push({ ...fields, Id: rows.length + 1 });
      } else if (createMode === "created_nonexact") {
        rows.push({ ...fields, lifeReason: "tampered reason", Id: rows.length + 1 });
      }
      return {
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: Math.max(rows.length, 1) } }),
      };
    },
  };

  return {
    client,
    rows,
    postCount: () => postCount,
  };
}

function makeAuthorizedTransport(client: SpHttpClient): ProcedureRecordLifecycleEventListTransport {
  return LifecycleSpHttp.createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
    {
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      siteIdentity: SITE_IDENTITY,
      listGuid: LIST_GUID,
      listItemEntityTypeFullName: ENTITY_TYPE,
    },
    LifecycleSpHttp.mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
  );
}

function makeStorage(transport: ProcedureRecordLifecycleEventListTransport) {
  const binding = bindProcedureRecordLifecycleEventList({
    siteIdentity: SITE_IDENTITY,
    listGuid: LIST_GUID,
  });
  assert.ok(binding);
  return createProcedureRecordCancellationSharePointStoragePort(binding, transport);
}

describe("GATE-3 production barrel export containment", () => {
  it("P1-002: index does not re-export synthetic CREATE mint / constructor", () => {
    const indexSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../../spfx/src/adapters/procedure-record-lifecycle-event/index.ts",
          import.meta.url,
        ),
      ),
      "utf8",
    );
    assert.equal(
      indexSource.includes("mintProcedureRecordLifecycleEventSyntheticCreateAuthorization"),
      false,
    );
    assert.equal(
      indexSource.includes(
        "createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport",
      ),
      false,
    );
    assert.equal(
      indexSource.includes("isSpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization"),
      false,
    );
    assert.equal(
      indexSource.includes("SpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization"),
      false,
    );
    assert.equal(
      indexSource.includes("createProcedureRecordLifecycleEventSpHttpClientTransport"),
      true,
    );
    assert.equal(
      indexSource.includes("createProcedureRecordLifecycleEventSpHttpClientTransportFromHost"),
      true,
    );
  });
});

describe("GATE-3 SPHttpClient × Slice E × Slice C composition（synthetic only）", () => {
  it("one CREATE + exact read-back => saved; POST=1", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const event = makeCancelEvent();
    const persisted = await persistProcedureRecordCancellation(event, storage);
    assert.deepEqual(persisted, { saveState: "saved", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
  });

  it("exact full-event replay => saved; zero second POST", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const event = makeCancelEvent();
    assert.deepEqual(await persistProcedureRecordCancellation(event, storage), {
      saveState: "saved",
      appendCalled: true,
    });
    assert.deepEqual(await persistProcedureRecordCancellation(event, storage), {
      saveState: "saved",
      appendCalled: false,
    });
    assert.equal(synthetic.postCount(), 1);
  });

  it("same identities + different reason => save_failed; zero POST", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const event = makeCancelEvent("original reason");
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    synthetic.rows.push({ ...encoded.row, Id: 1 });
    const conflicted: ProcedureRecordLifecycleEvent = {
      ...event,
      reason: "changed reason",
    };
    const result = await persistProcedureRecordCancellation(conflicted, storage);
    assert.deepEqual(result, { saveState: "save_failed", appendCalled: false });
    assert.equal(synthetic.postCount(), 0);
  });

  it("HTTP 409 => INDETERMINATE reconcile; never second POST", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "conflict_409" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const event = makeCancelEvent();
    const result = await persistProcedureRecordCancellation(event, storage);
    assert.deepEqual(result, { saveState: "save_outcome_unknown", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
    const retry = await storage.append(event);
    assert.deepEqual(retry, { status: "DEFINITE_FAILURE" });
    assert.equal(synthetic.postCount(), 1);
  });

  it("timeout POST => save_outcome_unknown; no retry", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "timeout" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_outcome_unknown", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
  });

  it("CREATED + EMPTY read-back => not saved; POST=1", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created_empty_readback" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_outcome_unknown", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
  });

  it("CREATED + non-exact read-back => save_failed; POST=1", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created_nonexact" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_failed", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
  });

  it("INDETERMINATE after POST + exact dual-lookup reconcile => saved; POST=1", async () => {
    let postCount = 0;
    const rows: StoredRow[] = [];
    const event = makeCancelEvent();
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }

    const client: SpHttpClient = {
      async get(url) {
        if (url.includes("/fields")) {
          return { ok: true, status: 200, json: async () => ({ value: observedFields() }) };
        }
        if (url.includes("?$select=Id,Title,ItemCount")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              Id: LIST_GUID,
              Title: PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
              ItemCount: rows.length,
            }),
          };
        }
        const decoded = decodeURIComponent(url);
        const match =
          /life(LifecycleEventId|LifecycleIdempotencyKey|TargetRecordId) eq '([^']*)'/.exec(
            decoded.replace(/''/g, "'"),
          );
        assert.ok(match);
        const fieldMap = {
          LifecycleEventId: COLUMNS.lifecycleEventId,
          LifecycleIdempotencyKey: COLUMNS.lifecycleIdempotencyKey,
          TargetRecordId: COLUMNS.targetRecordId,
        } as const;
        const field = fieldMap[match[1] as keyof typeof fieldMap];
        return {
          ok: true,
          status: 200,
          json: async () => ({ value: rows.filter((row) => row[field] === match[2]) }),
        };
      },
      async post() {
        postCount += 1;
        rows.push({ ...encoded.row, Id: 1 });
        return { ok: false, status: 409, json: async () => ({}) };
      },
    };

    const storage = makeStorage(makeAuthorizedTransport(client));
    const result = await persistProcedureRecordCancellation(event, storage);
    assert.deepEqual(result, { saveState: "saved", appendCalled: true });
    assert.equal(postCount, 1);
  });

  it("INDETERMINATE + both EMPTY => save_outcome_unknown", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "conflict_409" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_outcome_unknown", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
  });

  it("401/403 => save_failed; no retry POST", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "forbidden_403" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    const event = makeCancelEvent();
    const result = await persistProcedureRecordCancellation(event, storage);
    assert.deepEqual(result, { saveState: "save_failed", appendCalled: true });
    assert.equal(synthetic.postCount(), 1);
    const retry = await storage.append(event);
    assert.deepEqual(retry, { status: "DEFINITE_FAILURE" });
    assert.equal(synthetic.postCount(), 1);
  });

  it("SUPERSEDE append => DEFINITE_FAILURE; zero POST", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created" });
    const storage = makeStorage(makeAuthorizedTransport(synthetic.client));
    assert.deepEqual(await storage.append(makeSupersedeEvent()), { status: "DEFINITE_FAILURE" });
    assert.equal(synthetic.postCount(), 0);
  });

  it("default construction cannot CREATE through Slice E append", async () => {
    const synthetic = createStatefulSyntheticClient({ createMode: "created" });
    const transport = LifecycleSpHttp.createProcedureRecordLifecycleEventSpHttpClientTransport({
      spHttpClient: synthetic.client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      siteIdentity: SITE_IDENTITY,
      listGuid: LIST_GUID,
      listItemEntityTypeFullName: ENTITY_TYPE,
    });
    const storage = makeStorage(transport);
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_failed", appendCalled: true });
    assert.equal(synthetic.postCount(), 0);
  });
});
