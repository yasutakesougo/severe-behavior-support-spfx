import {
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  createProcedureRecordLiveWriteSpHttpClientTransport,
  createProcedureRecordSpHttpClientTransport,
  procedureRecordListApiUrl,
  type ProcedureRecordSpHttpClient,
} from "./sphttpclient-list-transport";
import * as procedureRecordTransport from "./sphttpclient-list-transport";
import {
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
} from "./live-write-gate";

type MockCall = Readonly<{
  method: "get" | "post";
  url: string;
  body?: string;
  headers?: Record<string, string>;
  configuration: unknown;
}>;

const SYNTHETIC_CONFIGURATION = { kind: "synthetic-sphttpclient-v1" };
const SYNTHETIC_WEB = "https://synthetic.example.invalid/sites/severe-support-procedurerecord-test";
const SYNTHETIC_MAIN_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const OTHER_MAIN_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const OTHER_LIST_GUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

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
  client: ProcedureRecordSpHttpClient;
  calls: MockCall[];
} {
  const calls: MockCall[] = [];
  const client: ProcedureRecordSpHttpClient = {
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

describe("ProcedureRecord SPHttpClient binder（LOOKUP-B / CREATE-ONLY）", () => {
  it("addresses the list by GUID and never GetByTitle", () => {
    const url = procedureRecordListApiUrl(
      `${SYNTHETIC_WEB}/`,
      `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    );
    expect(url).toBe(
      `${SYNTHETIC_WEB}/_api/web/lists(guid'${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID}')`,
    );
    expect(url).not.toContain("GetByTitle");
    expect(url).not.toContain("支援手順実施記録");
  });

  it("exposes the normalized constructor GUID as targetListGuid", () => {
    const { client } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ value: [] }),
      }),
    });
    const transport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    });
    expect(transport.targetListGuid).toBe(PROCEDURE_RECORD_TEST_ONLY_LIST_GUID);
  });

  it("getSchema: GET list + fields by GUID with nometadata", async () => {
    const { client, calls } = createMockClient({
      get: async (url) => {
        if (url.includes("/fields")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              value: [
                {
                  InternalName: "prRecordId",
                  Title: "実施記録ID",
                  TypeAsString: "Text",
                  Required: true,
                  EnforceUniqueValues: true,
                  Indexed: true,
                },
              ],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Id: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
            Title: "支援手順実施記録",
            ItemCount: 0,
          }),
        };
      },
    });
    const transport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });

    const result = await transport.getSchema();
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.list.ItemCount).toBe(0);
    expect(result.fields[0]?.InternalName).toBe("prRecordId");
    expect(calls).toHaveLength(2);
    expect(calls.every((call) => call.method === "get")).toBe(true);
    expect(calls.some((call) => call.url.includes("GetByTitle"))).toBe(false);
    expect(
      calls.every((call) =>
        call.url.includes(`lists(guid'${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID}')`),
      ),
    ).toBe(true);
    expect("createItem" in transport).toBe(true);
    expect("updateItem" in transport).toBe(false);
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls.every((call) => call.method === "get")).toBe(true);
  });

  it("findByRecordId: filters prRecordId and maps 403 to FORBIDDEN", async () => {
    const found = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ value: [{ Id: 1, prRecordId: "rec-1" }] }),
      }),
    });
    const transport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: found.client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });
    const result = await transport.findByRecordId("rec-1");
    expect(result).toEqual({ ok: true, rows: [{ Id: 1, prRecordId: "rec-1" }] });
    expect(decodeURIComponent(found.calls[0].url)).toContain("prRecordId eq 'rec-1'");
    expect(found.calls[0].url).not.toContain("Title");

    const forbidden = createMockClient({
      get: async () => ({
        ok: false,
        status: 403,
        json: async () => ({}),
      }),
    });
    const forbiddenTransport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: forbidden.client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });
    await expect(forbiddenTransport.findByIdempotencyKey("key-1")).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
  });

  it("does not perform live tenant I/O（synthetic double only）", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ value: [] }),
      }),
    });
    const transport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    });
    await transport.findByRecordId("synth");
    expect(calls).toHaveLength(1);
    expect(calls[0].url.startsWith("https://synthetic.example.invalid/")).toBe(true);
    expect(calls[0].method).toBe("get");
  });

  it("createItem: production transport does not POST even if caller passes itemCreateAuthorized", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const options = {
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
      listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      itemCreateAuthorized: true,
      liveTenantIoAuthorized: false,
    };
    const transport = createProcedureRecordSpHttpClientTransport(options);
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });

  it("createItem: remains FORBIDDEN while private execution flags cannot mint authorization", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: SYNTHETIC_WEB,
      listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
      listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
    });
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });

  it("createItem: invalid Human GO packet stays FORBIDDEN", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      {
        spHttpClient: client,
        configuration: SYNTHETIC_CONFIGURATION,
        webAbsoluteUrl: SYNTHETIC_WEB,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      },
      {
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        itemCount: 1,
        logicalSiteId: "test-only-procedure-record-logical-site-id",
        organizationId: "synthetic-org-001",
      },
      { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
    );
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });

  it("createItem: valid Human GO packet POSTs to lists(guid)/items with observed entity type", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 7 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      {
        spHttpClient: client,
        configuration: SYNTHETIC_CONFIGURATION,
        webAbsoluteUrl: SYNTHETIC_WEB,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      },
      {
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
        itemCount: 0,
        logicalSiteId: "test-only-procedure-record-logical-site-id",
        organizationId: "synthetic-org-001",
      },
      { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
    );
    const result = await transport.createItem({
      prRecordId: "synth-record",
      prIdempotencyKey: "synth-key",
    });
    expect(result).toEqual({ ok: true, listItemId: 7 });
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe("post");
    expect(calls[0].url).toBe(
      `${SYNTHETIC_WEB}/_api/web/lists(guid'${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID}')/items`,
    );
    expect(calls[0].url).not.toContain("GetByTitle");
    const body = JSON.parse(calls[0].body ?? "{}") as {
      __metadata?: { type?: string };
      Title?: unknown;
      prRecordId?: string;
    };
    expect(body.__metadata?.type).toBe(PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE);
    expect(body.prRecordId).toBe("synth-record");
    expect("Title" in body).toBe(false);
  });

  it("createItem: valid-looking packet with a different transport List GUID does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      {
        spHttpClient: client,
        configuration: SYNTHETIC_CONFIGURATION,
        webAbsoluteUrl: SYNTHETIC_WEB,
        listGuid: OTHER_LIST_GUID,
        listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      },
      {
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        itemCount: 0,
        logicalSiteId: "test-only-procedure-record-logical-site-id",
        organizationId: "synthetic-org-001",
      },
      { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
    );
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });

  it("createItem: 40-hex but wrong main SHA does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      {
        spHttpClient: client,
        configuration: SYNTHETIC_CONFIGURATION,
        webAbsoluteUrl: SYNTHETIC_WEB,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      },
      {
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        itemCount: 0,
        logicalSiteId: "test-only-procedure-record-logical-site-id",
        organizationId: "synthetic-org-001",
      },
      { authoritativeMainSha: OTHER_MAIN_SHA },
    );
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });

  it("createItem: Kiosk live-verify packet does not open first-create transport POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      {
        spHttpClient: client,
        configuration: SYNTHETIC_CONFIGURATION,
        webAbsoluteUrl: SYNTHETIC_WEB,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
      },
      {
        purpose: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        logicalSiteId: "test-only-procedure-record-logical-site-id",
        organizationId: "synthetic-org-001",
        recordId: "1111111111111111111111111111111111111111111111111111111111111111",
        idempotencyKey: "2222222222222222222222222222222222222222222222222222222222222222",
        payloadFingerprint: "3333333333333333333333333333333333333333333333333333333333333333",
        mutationBudget: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
      },
      { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
    );
    await expect(transport.createItem({ prRecordId: "synth" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(calls).toHaveLength(0);
  });
});

describe("ProcedureRecord production export surface", () => {
  it("does not export test-only write seams from the transport module", () => {
    expect("createSyntheticProcedureRecordSpHttpClientTransport" in procedureRecordTransport).toBe(
      false,
    );
    expect("createSyntheticAuthorizedProcedureRecordRepository" in procedureRecordTransport).toBe(
      false,
    );
    expect(typeof createProcedureRecordSpHttpClientTransport).toBe("function");
    expect(typeof createProcedureRecordLiveWriteSpHttpClientTransport).toBe("function");
    expect("postProcedureRecordCreateItem" in procedureRecordTransport).toBe(false);
  });
});
