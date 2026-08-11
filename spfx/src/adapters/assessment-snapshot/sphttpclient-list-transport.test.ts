import {
  ASSESSMENT_SNAPSHOTS_LIST_ITEM_ENTITY_TYPE,
  createAssessmentSnapshotSpHttpClientTransport,
  type AssessmentSnapshotSpHttpClient,
} from "./sphttpclient-list-transport";

type MockCall = Readonly<{
  method: "get" | "post";
  url: string;
  body?: string;
  headers?: Record<string, string>;
  configuration: unknown;
}>;

const SYNTHETIC_CONFIGURATION = { kind: "synthetic-sphttpclient-v1" };

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
  client: AssessmentSnapshotSpHttpClient;
  calls: MockCall[];
} {
  const calls: MockCall[] = [];
  const client: AssessmentSnapshotSpHttpClient = {
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
      const body = options.body;
      const headers = options.headers;
      calls.push({
        method: "post",
        url,
        body,
        headers,
        configuration,
      });
      if (!handler.post) {
        throw new Error("unexpected post");
      }
      return handler.post(url, { body, headers });
    },
  };
  return { client, calls };
}

describe("AssessmentSnapshot SPHttpClient binder（synthetic double）", () => {
  const webAbsoluteUrl = "https://contoso.sharepoint.com/sites/synthetic-pilot";

  it("createItem: posts verbose REST body and preserves omitted supersedes", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 42 } }),
      }),
    });
    const transport = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });

    const result = await transport.createItem({
      snapshotId: "snap-001",
      recordStatus: "draft",
      result: "pass",
      reasonCodes: "[]",
      ruleSetVersion: "1.0.0",
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      inputFingerprint: "fp-1",
    });

    expect(result).toEqual({ ok: true, listItemId: 42 });
    expect(calls).toHaveLength(1);
    expect(calls[0].method).toBe("post");
    expect(calls[0].configuration).toBe(SYNTHETIC_CONFIGURATION);
    expect(calls[0].url).toContain("/_api/web/lists/GetByTitle('AssessmentSnapshots')/items");
    expect(calls[0].headers?.["Content-Type"]).toBe("application/json;odata=verbose");
    const body = JSON.parse(calls[0].body ?? "{}") as Record<string, unknown>;
    expect(body.__metadata).toEqual({
      type: ASSESSMENT_SNAPSHOTS_LIST_ITEM_ENTITY_TYPE,
    });
    expect(body.snapshotId).toBe("snap-001");
    expect("supersedesSnapshotId" in body).toBe(false);
  });

  it("updateItem: MERGE with JSON null clear for supersedesSnapshotId（CL-1-B）", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 204,
        json: async () => ({}),
      }),
    });
    const transport = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });

    const result = await transport.updateItem(7, {
      snapshotId: "snap-001",
      recordStatus: "draft",
      result: "pass",
      reasonCodes: "[]",
      ruleSetVersion: "1.0.0",
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      inputFingerprint: "fp-1",
      supersedesSnapshotId: null,
    });

    expect(result).toEqual({ ok: true, listItemId: 7 });
    expect(calls[0].url).toContain("/items(7)");
    expect(calls[0].headers?.["X-HTTP-Method"]).toBe("MERGE");
    expect(calls[0].headers?.["IF-MATCH"]).toBe("*");
    const body = JSON.parse(calls[0].body ?? "{}") as Record<string, unknown>;
    expect(Object.prototype.hasOwnProperty.call(body, "supersedesSnapshotId")).toBe(true);
    expect(body.supersedesSnapshotId).toBeNull();
  });

  it("updateItem: omit leaves supersedesSnapshotId absent（≠ clear）", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 204,
        json: async () => ({}),
      }),
    });
    const transport = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });

    await transport.updateItem(7, {
      snapshotId: "snap-001",
      recordStatus: "draft",
      result: "pass",
      reasonCodes: "[]",
      ruleSetVersion: "1.0.0",
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      inputFingerprint: "fp-1",
    });

    const body = JSON.parse(calls[0].body ?? "{}") as Record<string, unknown>;
    expect("supersedesSnapshotId" in body).toBe(false);
  });

  it("getBySnapshotId: filters AssessmentSnapshots and maps fields", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          d: {
            results: [
              {
                Id: 9,
                snapshotId: "snap-001",
                recordStatus: "draft",
                result: "pass",
                reasonCodes: "[]",
                ruleSetVersion: "1.0.0",
                periodStart: "2026-01-01",
                periodEnd: "2026-01-31",
                inputFingerprint: "fp-1",
                supersedesSnapshotId: "  prior  ",
              },
            ],
          },
        }),
      }),
    });
    const transport = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });

    const result = await transport.getBySnapshotId("snap-001");
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.listItemId).toBe(9);
    expect(result.fields.supersedesSnapshotId).toBe("  prior  ");
    expect(calls[0].url).toContain("$filter=");
    expect(decodeURIComponent(calls[0].url)).toContain("snapshotId eq 'snap-001'");
  });

  it("maps 403 to FORBIDDEN and empty filter to NOT_FOUND", async () => {
    const forbidden = createMockClient({
      post: async () => ({
        ok: false,
        status: 403,
        json: async () => ({}),
      }),
    });
    const transportForbidden = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: forbidden.client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });
    await expect(transportForbidden.createItem({ snapshotId: "x" })).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });

    const missing = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ d: { results: [] } }),
      }),
    });
    const transportMissing = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: missing.client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl,
    });
    await expect(transportMissing.getBySnapshotId("missing")).resolves.toEqual({
      ok: false,
      failure: "NOT_FOUND",
    });
  });

  it("does not perform live tenant I/O（synthetic double only）", async () => {
    const { client, calls } = createMockClient({
      get: async () => ({
        ok: true,
        status: 200,
        json: async () => ({ d: { results: [] } }),
      }),
    });
    const transport = createAssessmentSnapshotSpHttpClientTransport({
      spHttpClient: client,
      configuration: SYNTHETIC_CONFIGURATION,
      webAbsoluteUrl: "https://synthetic.example.invalid/sites/no-tenant",
    });
    await transport.getBySnapshotId("snap-synth");
    expect(calls).toHaveLength(1);
    expect(calls[0].url.startsWith("https://synthetic.example.invalid/")).toBe(true);
  });
});
