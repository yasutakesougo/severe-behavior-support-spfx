import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES,
  bindProcedureRecordLifecycleEventList,
  createProcedureRecordCancellationSharePointStoragePort,
  decodeProcedureRecordLifecycleEventPhysicalRow,
  encodeProcedureRecordLifecycleEventPhysicalRow,
  type ObservedLifecycleEventPhysicalField,
  type ProcedureRecordLifecycleEventItemCreateResult,
  type ProcedureRecordLifecycleEventItemReadResult,
  type ProcedureRecordLifecycleEventListTransport,
} from "../../../../src/adapters/sharepoint/procedure-record-lifecycle-event";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
  mintLifecycleEventIdentity,
  type ProcedureRecordLifecycleEvent,
} from "../../../../src/domain/kiosk-contract";
import { persistProcedureRecordCancellation } from "../../../../src/domain/procedure-record-cancellation-persistence";

const SITE_IDENTITY = "https://tenant.example/sites/sbs-test";
const COLUMNS = PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS;

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

type FakeOptions = {
  createMode?: "created" | "forbidden" | "transport_error";
  omitSchemaVersion?: boolean;
  targetSiteIdentity?: string;
  targetListGuid?: string;
};

function createFakeTransport(
  options: FakeOptions = {},
): ProcedureRecordLifecycleEventListTransport & {
  rows: Array<Record<string, unknown>>;
  createCalls: number;
} {
  const rows: Array<Record<string, unknown>> = [];
  let createCalls = 0;
  const targetListGuid =
    options.targetListGuid ?? PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID;

  function query(
    predicate: (row: Readonly<Record<string, unknown>>) => boolean,
  ): ProcedureRecordLifecycleEventItemReadResult {
    return { ok: true, rows: rows.filter(predicate) };
  }

  return {
    targetSiteIdentity: options.targetSiteIdentity ?? SITE_IDENTITY,
    targetListGuid,
    liveTenantIoAuthorized: false,
    rows,
    get createCalls() {
      return createCalls;
    },
    set createCalls(value: number) {
      createCalls = value;
    },

    async getSchema() {
      const fields = options.omitSchemaVersion
        ? observedFields().filter((field) => field.InternalName !== COLUMNS.schemaVersion)
        : observedFields();
      return {
        ok: true as const,
        list: {
          Id: targetListGuid,
          Title: PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
          ItemCount: rows.length,
        },
        fields,
      };
    },

    async findByLifecycleEventId(lifecycleEventId) {
      return query((row) => row[COLUMNS.lifecycleEventId] === lifecycleEventId);
    },

    async findByLifecycleIdempotencyKey(lifecycleIdempotencyKey) {
      return query((row) => row[COLUMNS.lifecycleIdempotencyKey] === lifecycleIdempotencyKey);
    },

    async listByTargetRecordId(targetRecordId) {
      return query((row) => row[COLUMNS.targetRecordId] === targetRecordId);
    },

    async createItem(fields): Promise<ProcedureRecordLifecycleEventItemCreateResult> {
      createCalls += 1;
      if (options.createMode === "forbidden") {
        return { ok: false, failure: "FORBIDDEN" };
      }
      if (options.createMode === "transport_error") {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
      rows.push({ ...fields, Id: rows.length + 1 });
      return { ok: true, listItemId: rows.length };
    },
  };
}

function makeStorage(transport: ProcedureRecordLifecycleEventListTransport) {
  const binding = bindProcedureRecordLifecycleEventList({
    siteIdentity: SITE_IDENTITY,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  });
  assert.ok(binding);
  return createProcedureRecordCancellationSharePointStoragePort(binding, transport);
}

describe("ProcedureRecordLifecycleEvent physical mapper", () => {
  it("round-trips CANCEL without replacementRecordId", () => {
    const event = makeCancelEvent();
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    assert.equal("lifeReplacementRecordId" in encoded.row, false);

    const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(encoded.row);
    assert.deepEqual(decoded, { ok: true, event });
  });

  it("parses shared SUPERSEDE rows without orchestration", () => {
    const event = makeSupersedeEvent();
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(encoded.row);
    assert.deepEqual(decoded, { ok: true, event });
  });

  it("rejects CANCEL with physical replacementRecordId", () => {
    const event = makeCancelEvent();
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }
    const decoded = decodeProcedureRecordLifecycleEventPhysicalRow({
      ...encoded.row,
      lifeReplacementRecordId: "record-002",
    });
    assert.deepEqual(decoded, { ok: false, reason: "MALFORMED_PHYSICAL" });
  });
});

describe("CANCEL-SLICE-E SharePoint storage port", () => {
  it("uses dual lookup and Slice C read-back before saved", async () => {
    const transport = createFakeTransport();
    const storage = makeStorage(transport);
    const event = makeCancelEvent();

    const beforeById = await storage.findByLifecycleEventId(event.LifecycleEventId);
    const beforeByKey = await storage.findByLifecycleIdempotencyKey(
      event.LifecycleIdempotencyKey,
    );
    assert.deepEqual(beforeById, { status: "EMPTY" });
    assert.deepEqual(beforeByKey, { status: "EMPTY" });

    const persisted = await persistProcedureRecordCancellation(event, storage);
    assert.deepEqual(persisted, { saveState: "saved", appendCalled: true });
    assert.equal(transport.createCalls, 1);

    const after = await storage.findByLifecycleEventId(event.LifecycleEventId);
    assert.deepEqual(after, { status: "FOUND", value: event });
  });

  it("keeps transport ambiguity as save_outcome_unknown", async () => {
    const transport = createFakeTransport({ createMode: "transport_error" });
    const storage = makeStorage(transport);
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_outcome_unknown", appendCalled: true });
  });

  it("maps definite create refusal to save_failed", async () => {
    const transport = createFakeTransport({ createMode: "forbidden" });
    const storage = makeStorage(transport);
    const result = await persistProcedureRecordCancellation(makeCancelEvent(), storage);
    assert.deepEqual(result, { saveState: "save_failed", appendCalled: true });
  });

  it("blocks CREATE while lifeSchemaVersion is absent", async () => {
    const transport = createFakeTransport({ omitSchemaVersion: true });
    const storage = makeStorage(transport);
    const attempt = await storage.append(makeCancelEvent());
    assert.deepEqual(attempt, { status: "DEFINITE_FAILURE" });
    assert.equal(transport.createCalls, 0);
  });

  it("fails closed on Site/List binding mismatch", async () => {
    const wrongSite = createFakeTransport({
      targetSiteIdentity: "https://tenant.example/sites/other",
    });
    const siteStorage = makeStorage(wrongSite);
    const event = makeCancelEvent();
    assert.deepEqual(await siteStorage.findByLifecycleEventId(event.LifecycleEventId), {
      status: "FETCH_FAILED",
      code: "SITE_BINDING_MISMATCH",
    });
    assert.deepEqual(await siteStorage.append(event), { status: "DEFINITE_FAILURE" });

    const wrongList = createFakeTransport({
      targetListGuid: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
    const listStorage = makeStorage(wrongList);
    assert.deepEqual(await listStorage.findByLifecycleEventId(event.LifecycleEventId), {
      status: "FETCH_FAILED",
      code: "LIST_BINDING_MISMATCH",
    });
  });

  it("fails closed on malformed or duplicate lookup rows", async () => {
    const transport = createFakeTransport();
    const storage = makeStorage(transport);
    const event = makeCancelEvent();
    const encoded = encodeProcedureRecordLifecycleEventPhysicalRow(event);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) {
      return;
    }

    transport.rows.push({
      ...encoded.row,
      lifeEventType: "DELETE",
    });
    assert.deepEqual(await storage.findByLifecycleEventId(event.LifecycleEventId), {
      status: "FETCH_FAILED",
      code: "MALFORMED_PHYSICAL",
    });

    transport.rows.length = 0;
    transport.rows.push({ ...encoded.row }, { ...encoded.row });
    assert.deepEqual(await storage.findByLifecycleEventId(event.LifecycleEventId), {
      status: "FETCH_FAILED",
      code: "MULTI_MATCH",
    });
  });

  it("lists target history without UPDATE/DELETE surface", async () => {
    const transport = createFakeTransport();
    const storage = makeStorage(transport);
    const first = makeCancelEvent("first");
    const secondInput = {
      eventType: "CANCEL" as const,
      targetRecordId: "record-001",
      recordedAt: "2026-08-21T00:02:00.000Z",
      recordedBy: "staff-002",
      reason: "second",
    };
    const second: ProcedureRecordLifecycleEvent = {
      schemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
      ...mintLifecycleEventIdentity(secondInput),
      ...secondInput,
    };

    assert.deepEqual(await storage.append(first), { status: "CREATED" });
    assert.deepEqual(await storage.append(second), { status: "CREATED" });

    const history = await storage.listByTargetRecordId("record-001");
    assert.equal(history.length, 2);
    assert.deepEqual(
      new Set(history.map((event) => event.LifecycleEventId)),
      new Set([first.LifecycleEventId, second.LifecycleEventId]),
    );
    assert.equal("updateItem" in transport, false);
    assert.equal("deleteItem" in transport, false);
    assert.equal(storage.liveWriteAuthorized, false);
  });
});
