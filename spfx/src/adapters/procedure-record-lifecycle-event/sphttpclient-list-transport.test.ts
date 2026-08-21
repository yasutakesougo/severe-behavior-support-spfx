import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  createProcedureRecordLifecycleEventSpHttpClientTransport,
  createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport,
  mintProcedureRecordLifecycleEventSyntheticCreateAuthorization,
  procedureRecordLifecycleEventListApiUrl,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "./sphttpclient-list-transport";
import * as lifecycleTransport from "./sphttpclient-list-transport";

type MockCall = Readonly<{
  method: "get" | "post";
  url: string;
  body?: string;
  headers?: Record<string, string>;
  configuration: unknown;
}>;

const SYNTHETIC_CONFIGURATION = { kind: "synthetic-sphttpclient-v1" };
const SYNTHETIC_WEB = "https://synthetic.example.invalid/sites/severe-support-procedurerecord-test";

const CANCEL_FIELDS = {
  lifeSchemaVersion: "1.0.0",
  lifeLifecycleEventId: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  lifeLifecycleIdempotencyKey: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  lifeLifecyclePayloadFingerprint:
    "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  lifeEventType: "CANCEL",
  lifeTargetRecordId: "record-001",
  lifeRecordedAt: "2026-08-21T00:00:00.000Z",
  lifeRecordedBy: "staff-001",
  lifeReason: "duplicate entry",
} as const;

function createMockClient(handler: {
  get?: (url: string) => Promise<{
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
  }>;
  post?: (
    url: string,
    options: { body?: string; headers?: Record<string, string> },
  ) => Promise<{
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
  }>;
}): {
  client: ProcedureRecordLifecycleEventSpHttpClient;
  calls: MockCall[];
} {
  const calls: MockCall[] = [];
  const client: ProcedureRecordLifecycleEventSpHttpClient = {
    async get(url, configuration, options) {
      calls.push({
        method: "get",
        url,
        headers: options?.headers,
        configuration,
      });
      if (!handler.get) {
        throw new Error("unexpected get");
      }
      return handler.get(url);
    },
    async post(url, configuration, options) {
      calls.push({
        method: "post",
        url,
        body: options.body,
        headers: options.headers,
        configuration,
      });
      if (!handler.post) {
        throw new Error("unexpected post");
      }
      return handler.post(url, { body: options.body, headers: options.headers });
    },
  };
  return { client, calls };
}

function defaultOptions(client: ProcedureRecordLifecycleEventSpHttpClient): {
  spHttpClient: ProcedureRecordLifecycleEventSpHttpClient;
  configuration: unknown;
  webAbsoluteUrl: string;
  siteIdentity: string;
  listGuid: string;
  listItemEntityTypeFullName: string;
} {
  return {
    spHttpClient: client,
    configuration: SYNTHETIC_CONFIGURATION,
    webAbsoluteUrl: SYNTHETIC_WEB,
    siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
    listItemEntityTypeFullName: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  };
}

function expectedSchemaFields(): Array<{
  InternalName: string;
  StaticName: string;
  TypeAsString: string;
  Required: boolean;
  EnforceUniqueValues: boolean;
  Indexed: boolean;
  MaxLength?: number;
  Choices?: string[];
  FillInChoice?: boolean;
  Hidden: boolean;
}> {
  return [
    {
      InternalName: "lifeSchemaVersion",
      StaticName: "lifeSchemaVersion",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeLifecycleEventId",
      StaticName: "lifeLifecycleEventId",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: true,
      Indexed: true,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeLifecycleIdempotencyKey",
      StaticName: "lifeLifecycleIdempotencyKey",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: true,
      Indexed: true,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeLifecyclePayloadFingerprint",
      StaticName: "lifeLifecyclePayloadFingerprint",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeEventType",
      StaticName: "lifeEventType",
      TypeAsString: "Choice",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      Choices: ["SUPERSEDE", "CANCEL"],
      FillInChoice: false,
      Hidden: false,
    },
    {
      InternalName: "lifeTargetRecordId",
      StaticName: "lifeTargetRecordId",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: true,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeReplacementRecordId",
      StaticName: "lifeReplacementRecordId",
      TypeAsString: "Text",
      Required: false,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeRecordedAt",
      StaticName: "lifeRecordedAt",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeRecordedBy",
      StaticName: "lifeRecordedBy",
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
    {
      InternalName: "lifeReason",
      StaticName: "lifeReason",
      TypeAsString: "Text",
      Required: false,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
      Hidden: false,
    },
  ];
}

describe("ProcedureRecordLifecycleEvent SPHttpClient binder（GATE-3）", () => {
  it("1. uses exact GUID endpoint and never getByTitle", () => {
    const url = procedureRecordLifecycleEventListApiUrl(
      `${SYNTHETIC_WEB}/`,
      `{${PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    );
    expect(url).toBe(
      `${SYNTHETIC_WEB}/_api/web/lists(guid'${PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID}')`,
    );
    expect(url).not.toContain("getByTitle");
    expect(url).not.toContain("GetByTitle");
    expect(url).not.toContain("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS");
  });

  it("2. retains exact Site/List binding on the transport", () => {
    const { client } = createMockClient({
      get: async () => ({ ok: true, status: 200, json: async () => ({ value: [] }) }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    expect(transport.targetListGuid).toBe(PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID);
    expect(transport.targetSiteIdentity).toBe(
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    );
    expect(transport.liveTenantIoAuthorized).toBe(false);
  });

  it("3. schema GET maps the final 10-column contract", async () => {
    const { client, calls } = createMockClient({
      get: async (url) => {
        if (url.includes("/fields")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ value: expectedSchemaFields() }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Id: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
            Title: "SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS",
            ItemCount: 1,
          }),
        };
      },
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    const result = await transport.getSchema();
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.list.Id).toBe(PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID);
    expect(result.fields.map((field) => field.InternalName)).toEqual(
      expectedSchemaFields().map((field) => field.InternalName),
    );
    const schemaVersion = result.fields.find((field) => field.InternalName === "lifeSchemaVersion");
    expect(schemaVersion).toMatchObject({
      TypeAsString: "Text",
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    });
    expect(calls.every((call) => call.method === "get")).toBe(true);
    expect(
      calls.every((call) =>
        call.url.includes(`lists(guid'${PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID}')`),
      ),
    ).toBe(true);
    expect(calls.some((call) => call.url.toLowerCase().includes("getbytitle"))).toBe(false);
  });

  it("4. event-id lookup escapes OData and maps rows", async () => {
    const token = "id-with-'quote";
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          value: [{ Id: 1, lifeLifecycleEventId: token, lifeEventType: "CANCEL" }],
        }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    const result = await transport.findByLifecycleEventId(token);
    expect(result).toEqual({
      ok: true,
      rows: [{ Id: 1, lifeLifecycleEventId: token, lifeEventType: "CANCEL" }],
    });
    expect(decodeURIComponent(calls[0].url)).toContain("lifeLifecycleEventId eq 'id-with-''quote'");
    expect(calls[0].url).not.toContain("getByTitle");
  });

  it("5. idempotency-key lookup maps rows", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          value: [{ Id: 2, lifeLifecycleIdempotencyKey: "key-1" }],
        }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    await expect(transport.findByLifecycleIdempotencyKey("key-1")).resolves.toEqual({
      ok: true,
      rows: [{ Id: 2, lifeLifecycleIdempotencyKey: "key-1" }],
    });
    expect(decodeURIComponent(calls[0].url)).toContain("lifeLifecycleIdempotencyKey eq 'key-1'");
  });

  it("6. targetRecordId history query maps rows", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          value: [
            { Id: 1, lifeTargetRecordId: "record-001" },
            { Id: 2, lifeTargetRecordId: "record-001" },
          ],
        }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    const result = await transport.listByTargetRecordId("record-001");
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.rows).toHaveLength(2);
    expect(decodeURIComponent(calls[0].url)).toContain("lifeTargetRecordId eq 'record-001'");
  });

  it("7. default construction cannot perform authorized tenant CREATE", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
    expect(transport.liveTenantIoAuthorized).toBe(false);
  });

  it("8. one authorized synthetic CREATE => POST count exactly 1", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 9 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: true,
      listItemId: 9,
    });
    expect(calls.filter((call) => call.method === "post")).toHaveLength(1);
    expect(calls[0].url).toBe(
      `${SYNTHETIC_WEB}/_api/web/lists(guid'${PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID}')/items`,
    );
    expect(calls[0].url.toLowerCase()).not.toContain("getbytitle");
  });

  it("9. exact replay of same frozen identity => zero second POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 3 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await transport.createItem({ ...CANCEL_FIELDS });
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls.filter((call) => call.method === "post")).toHaveLength(1);
  });

  it("11. HTTP 409 => TRANSPORT_ERROR (INDETERMINATE path) / zero retry", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: false,
        status: 409,
        json: async () => ({}),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls.filter((call) => call.method === "post")).toHaveLength(1);
  });

  it("12. timeout / thrown POST => TRANSPORT_ERROR / zero retry", async () => {
    const { client, calls } = createMockClient({
      post: async () => {
        throw new Error("network timeout");
      },
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls.filter((call) => call.method === "post")).toHaveLength(1);
  });

  it("17. 401/403 => FORBIDDEN / no retry", async () => {
    for (const status of [401, 403]) {
      const { client, calls } = createMockClient({
        post: async () => ({
          ok: false,
          status,
          json: async () => ({}),
        }),
      });
      const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
        defaultOptions(client),
        mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
      );
      await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
        ok: false,
        failure: "FORBIDDEN",
      });
      await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
        ok: false,
        failure: "FORBIDDEN",
      });
      expect(calls.filter((call) => call.method === "post")).toHaveLength(1);
    }
  });

  it("18. malformed response => fail closed", async () => {
    const { client } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ not: "a collection" }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    await expect(transport.findByLifecycleEventId("x")).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });

    const createClient = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: "not-a-number" } }),
      }),
    });
    const createTransport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(createClient.client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(createTransport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });
  });

  it("19. exposes no UPDATE / DELETE transport surface", () => {
    const { client } = createMockClient({
      get: async () => ({ ok: true, status: 200, json: async () => ({ value: [] }) }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    expect("createItem" in transport).toBe(true);
    expect("updateItem" in transport).toBe(false);
    expect("deleteItem" in transport).toBe(false);
  });

  it("20. SUPERSEDE cannot be persisted through this path", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(
      transport.createItem({
        ...CANCEL_FIELDS,
        lifeEventType: "SUPERSEDE",
        lifeReplacementRecordId: "record-002",
      }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(calls).toHaveLength(0);
  });

  it("does not export private POST helper or invent liveWrite flags", () => {
    expect("postProcedureRecordLifecycleEventCreateItem" in lifecycleTransport).toBe(false);
    expect(typeof createProcedureRecordLifecycleEventSpHttpClientTransport).toBe("function");
    expect(typeof createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport).toBe(
      "function",
    );
  });

  it("P1-001: malformed listGuid fails closed without TEST_ONLY substitution", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({ ok: true, status: 200, json: async () => ({ value: [] }) }),
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      {
        ...defaultOptions(client),
        listGuid: "not-a-guid",
      },
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    expect(transport.targetListGuid).toBe("");
    await expect(transport.findByLifecycleEventId("x")).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "TRANSPORT_ERROR",
    });
    expect(calls).toHaveLength(0);
    expect(
      calls.some((call) => call.url.includes(PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID)),
    ).toBe(false);
  });

  it("P1-001: valid non-locked listGuid does not rewrite to TEST_ONLY; CREATE FORBIDDEN", async () => {
    const otherGuid = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const { client, calls } = createMockClient({
      get: async () => ({ ok: true, status: 200, json: async () => ({ value: [] }) }),
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      {
        ...defaultOptions(client),
        listGuid: otherGuid,
      },
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    expect(transport.targetListGuid).toBe(otherGuid);
    await transport.findByLifecycleEventId("x");
    expect(calls[0].url).toContain(`lists(guid'${otherGuid}')`);
    expect(calls[0].url).not.toContain(PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID);
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls.filter((call) => call.method === "post")).toHaveLength(0);
  });

  it("P2: unknown physical keys are rejected before POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
      defaultOptions(client),
      mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(),
    );
    await expect(
      transport.createItem({
        ...CANCEL_FIELDS,
        Title: "extra",
      }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    await expect(
      transport.createItem({
        ...CANCEL_FIELDS,
        lifeReplacementRecordId: "record-002",
      }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(calls).toHaveLength(0);
  });
});

describe("GATE-3 production barrel export surface", () => {
  it("P1-002: default construction remains CREATE FORBIDDEN with zero POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLifecycleEventSpHttpClientTransport(
      defaultOptions(client),
    );
    await expect(transport.createItem({ ...CANCEL_FIELDS })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });
});
