import {
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  createProcedureRecordKioskLiveVerifySpHttpClientTransport,
  createProcedureRecordLiveWriteSpHttpClientTransport,
  createProcedureRecordSpHttpClientTransport,
  type ProcedureRecordSpHttpClient,
} from "./sphttpclient-list-transport";
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
const ORGANIZATION_ID = "synthetic-org-001";
const LOGICAL_SITE_ID = "synthetic-site-001";
const RECORD_ID = "1111111111111111111111111111111111111111111111111111111111111111";
const IDEMPOTENCY_KEY = "2222222222222222222222222222222222222222222222222222222222222222";
const PAYLOAD_FINGERPRINT = "3333333333333333333333333333333333333333333333333333333333333333";
const OTHER_DIGEST = "4444444444444444444444444444444444444444444444444444444444444444";

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

function transportOptions(client: ProcedureRecordSpHttpClient): {
  spHttpClient: ProcedureRecordSpHttpClient;
  configuration: unknown;
  webAbsoluteUrl: string;
  listGuid: string;
  listItemEntityTypeFullName: string;
} {
  return {
    spHttpClient: client,
    configuration: SYNTHETIC_CONFIGURATION,
    webAbsoluteUrl: SYNTHETIC_WEB,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    listItemEntityTypeFullName: PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  };
}

function kioskPacket(): {
  purpose: typeof PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE;
  humanLiveWriteGo: true;
  expectedMainSha: string;
  listGuid: string;
  logicalSiteId: string;
  organizationId: string;
  recordId: string;
  idempotencyKey: string;
  payloadFingerprint: string;
  mutationBudget: typeof PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET;
} {
  return {
    purpose: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    logicalSiteId: LOGICAL_SITE_ID,
    organizationId: ORGANIZATION_ID,
    recordId: RECORD_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    payloadFingerprint: PAYLOAD_FINGERPRINT,
    mutationBudget: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  };
}

function kioskExecution(): {
  authoritativeMainSha: string;
  listGuid: string;
  organizationId: string;
  logicalSiteId: string;
  recordId: string;
  idempotencyKey: string;
  payloadFingerprint: string;
} {
  return {
    authoritativeMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    organizationId: ORGANIZATION_ID,
    logicalSiteId: LOGICAL_SITE_ID,
    recordId: RECORD_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    payloadFingerprint: PAYLOAD_FINGERPRINT,
  };
}

function lockedFields(): Readonly<Record<string, string>> {
  return {
    prRecordId: RECORD_ID,
    prIdempotencyKey: IDEMPOTENCY_KEY,
    prPayloadFingerprint: PAYLOAD_FINGERPRINT,
    prOrganizationId: ORGANIZATION_ID,
    prSiteId: LOGICAL_SITE_ID,
  };
}

function postCount(calls: readonly MockCall[]): number {
  return calls.filter((call) => call.method === "post").length;
}

describe("SPFx Kiosk live-verify execution transport", () => {
  it("EB-SPFX-01/09: exact Kiosk packet and locked fields reach mock POST once", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 2 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      kioskExecution(),
    );
    await expect(transport.createItem(lockedFields())).resolves.toEqual({
      ok: true,
      listItemId: 2,
    });
    expect(postCount(calls)).toBe(1);
  });

  it("EB-SPFX-02: normal transport remains FORBIDDEN", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordSpHttpClientTransport(transportOptions(client));
    await expect(transport.createItem(lockedFields())).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-03: first-create transport rejects a Kiosk packet", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordLiveWriteSpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
    );
    await expect(transport.createItem(lockedFields())).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-04: Kiosk transport rejects a first-create packet", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      {
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
        humanLiveWriteGo: true,
        expectedMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        itemCount: 0,
        logicalSiteId: LOGICAL_SITE_ID,
        organizationId: ORGANIZATION_ID,
      },
      kioskExecution(),
    );
    await expect(transport.createItem(lockedFields())).resolves.toEqual({
      ok: false,
      failure: "FORBIDDEN",
    });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-05: fields RecordId mismatch does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      kioskExecution(),
    );
    await expect(
      transport.createItem({ ...lockedFields(), prRecordId: OTHER_DIGEST }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-06: fields IdempotencyKey mismatch does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      kioskExecution(),
    );
    await expect(
      transport.createItem({ ...lockedFields(), prIdempotencyKey: OTHER_DIGEST }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-07: fields fingerprint mismatch does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      kioskExecution(),
    );
    await expect(
      transport.createItem({ ...lockedFields(), prPayloadFingerprint: OTHER_DIGEST }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(postCount(calls)).toBe(0);
  });

  it("EB-SPFX-08: fields org/site mismatch does not POST", async () => {
    const { client, calls } = createMockClient({
      post: async () => ({
        ok: true,
        status: 201,
        json: async () => ({ d: { Id: 1 } }),
      }),
    });
    const transport = createProcedureRecordKioskLiveVerifySpHttpClientTransport(
      transportOptions(client),
      kioskPacket(),
      kioskExecution(),
    );
    await expect(
      transport.createItem({ ...lockedFields(), prOrganizationId: "other-org-001" }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    await expect(
      transport.createItem({ ...lockedFields(), prSiteId: "other-logical-site-id" }),
    ).resolves.toEqual({ ok: false, failure: "FORBIDDEN" });
    expect(postCount(calls)).toBe(0);
  });
});
