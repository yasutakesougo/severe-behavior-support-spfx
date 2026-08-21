import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "./sphttpclient-list-transport";
import {
  B2_HARNESS_AUTHORITY_MAIN_SHA,
  B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY,
  executeLifecycleCreateTestHarnessRun,
  validateLifecycleCreateTestHarnessRun,
  type LifecycleCreateTestHarnessActionInput,
} from "./test-only-harness-runner";
import { issueLifecycleTestOnlyTrustedReceiptProvenance } from "./test-only-human-go-receipt-issuer";
import {
  LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE,
  type HumanGoRequestPacket,
} from "./test-only-live-create-gate";
import { createInMemoryTrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

const WEB =
  "https://isogokatudouhome.sharepoint.com/sites/severe-support-procedurerecord-test";

function packet(): HumanGoRequestPacket {
  return {
    purpose: LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE,
    humanLiveCreateGo: true,
    expectedMainSha: B2_HARNESS_AUTHORITY_MAIN_SHA,
    siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
    lifecycleEventId: B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleEventId,
    lifecycleIdempotencyKey:
      B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleIdempotencyKey,
    lifecyclePayloadFingerprint:
      B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecyclePayloadFingerprint,
    mutationBudget: { create: 1, retryPost: 0, update: 0, delete: 0 },
  };
}

function schemaFields(): Array<Record<string, unknown>> {
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

function client(): ProcedureRecordLifecycleEventSpHttpClient & {
  getCount(): number;
  postCount(): number;
} {
  let gets = 0;
  let posts = 0;
  let storedRow: Record<string, unknown> | undefined;

  return {
    getCount: () => gets,
    postCount: () => posts,
    async get(url) {
      gets += 1;
      if (url.includes("/fields?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ value: schemaFields() }),
        };
      }
      if (url.includes("?$select=Id,Title,ItemCount")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            Id: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
            Title: "SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS",
            ItemCount: storedRow ? 2 : 1,
          }),
        };
      }
      if (url.includes("/items?")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ value: storedRow ? [storedRow] : [] }),
        };
      }
      throw new Error(`unexpected GET ${url}`);
    },
    async post(_url, _configuration, options) {
      posts += 1;
      const parsed = JSON.parse(options.body ?? "{}") as Record<string, unknown>;
      const { __metadata: _metadata, ...fields } = parsed;
      storedRow = { Id: 2, ...fields };
      return {
        ok: true,
        status: 201,
        json: async () => ({ Id: 2 }),
      };
    },
  };
}

function actionInput(options: {
  packet: HumanGoRequestPacket;
  provenance: unknown;
  store: ReturnType<typeof createInMemoryTrustedReceiptConsumeStore>;
  http: ProcedureRecordLifecycleEventSpHttpClient;
  runtimeSiteIdentity?: string;
}): LifecycleCreateTestHarnessActionInput {
  return {
    packetJson: JSON.stringify(options.packet),
    provenanceJson: JSON.stringify(options.provenance),
    expectedMainSha: B2_HARNESS_AUTHORITY_MAIN_SHA,
    runtimeSiteIdentity:
      options.runtimeSiteIdentity ??
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    webAbsoluteUrl: WEB,
    consumeStore: options.store,
    spHttpClient: options.http,
    configuration: { kind: "test" },
  };
}

describe("B2 test-only harness runtime runner", () => {
  it("wrong pageContext-derived Site identity fails closed before GET/POST", async () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const humanPacket = packet();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet: humanPacket,
      consumeStore: store,
    });
    const http = client();

    const result = await validateLifecycleCreateTestHarnessRun(
      actionInput({
        packet: humanPacket,
        provenance,
        store,
        http,
        runtimeSiteIdentity: "wrong.example,site,web",
      }),
    );

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("runtime_page_site_mismatch");
    expect(http.getCount()).toBe(0);
    expect(http.postCount()).toBe(0);
  });

  it("Validate performs GET-only preflight and does not consume receipt", async () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const humanPacket = packet();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet: humanPacket,
      consumeStore: store,
    });
    const http = client();

    const result = await validateLifecycleCreateTestHarnessRun(
      actionInput({ packet: humanPacket, provenance, store, http }),
    );

    expect(result.ok).toBe(true);
    expect(result.reason).toBe("ready_no_post");
    expect(http.getCount()).toBeGreaterThan(0);
    expect(http.postCount()).toBe(0);
    expect(store.get(provenance.handle)?.consumed).toBe(false);
  });

  it("Execute reaches Slice C/E/GATE-3 once and durable receipt blocks replay", async () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const humanPacket = packet();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet: humanPacket,
      consumeStore: store,
    });
    const http = client();
    const input = actionInput({ packet: humanPacket, provenance, store, http });

    const first = await executeLifecycleCreateTestHarnessRun(input);
    expect(first.ok).toBe(true);
    expect(first.saveState).toBe("saved");
    expect(first.appendCalled).toBe(true);
    expect(http.postCount()).toBe(1);
    expect(store.get(provenance.handle)?.consumed).toBe(true);

    const replay = await executeLifecycleCreateTestHarnessRun(input);
    expect(replay.ok).toBe(false);
    expect(replay.reason).toBe("receipt_already_consumed");
    expect(http.postCount()).toBe(1);
  });

  it("packet identity not matching frozen synthetic CANCEL fails before GET/POST", async () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const humanPacket = {
      ...packet(),
      lifecycleEventId: "not-the-frozen-synthetic-event",
    };
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet: humanPacket,
      consumeStore: store,
    });
    const http = client();

    const result = await executeLifecycleCreateTestHarnessRun(
      actionInput({ packet: humanPacket, provenance, store, http }),
    );

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("packet_synthetic_cancel_identity_mismatch");
    expect(http.getCount()).toBe(0);
    expect(http.postCount()).toBe(0);
    expect(store.get(provenance.handle)?.consumed).toBe(false);
  });
});
