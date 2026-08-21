/**
 * B2 harness composition: GO before synthetic CREATE; no provenance mint in composition.
 */

import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "./sphttpclient-list-transport";
import { composeTestOnlyHarnessCancellationPersistence } from "./test-only-harness-composition";
import { issueLifecycleTestOnlyTrustedReceiptProvenance } from "./test-only-human-go-receipt-issuer";
import {
  LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE,
  type HumanGoRequestPacket,
} from "./test-only-live-create-gate";
import {
  createInMemoryTrustedReceiptConsumeStore,
  resetProcessTrustedReceiptConsumeStoreForTests,
} from "./test-only-receipt-consume-registry";

const MAIN_SHA = "3e4e2dee195ce82299b62f4b668d50cb563d2c68";
const SYNTHETIC_WEB = "https://synthetic.example.invalid/sites/severe-support-procedurerecord-test";

function makePacket(): HumanGoRequestPacket {
  return {
    purpose: LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE,
    humanLiveCreateGo: true,
    expectedMainSha: MAIN_SHA,
    siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
    lifecycleEventId: "11111111-1111-4111-8111-111111111111",
    lifecycleIdempotencyKey: "22222222-2222-4222-8222-222222222222",
    lifecyclePayloadFingerprint: "3333333333333333333333333333333333333333333333333333333333333333",
    mutationBudget: { create: 1, retryPost: 0, update: 0, delete: 0 },
  };
}

function mockClient(): ProcedureRecordLifecycleEventSpHttpClient & { postCount: () => number } {
  let posts = 0;
  return {
    postCount: () => posts,
    async get() {
      return {
        ok: true,
        status: 200,
        async json() {
          return { value: [] };
        },
      };
    },
    async post() {
      posts += 1;
      return {
        ok: true,
        status: 201,
        async json() {
          return { Id: 1 };
        },
      };
    },
  };
}

describe("B2 test-only harness composition", () => {
  beforeEach(() => {
    resetProcessTrustedReceiptConsumeStoreForTests();
  });

  it("packet-only (no provenance) → NONE / POST budget 0", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const client = mockClient();
    const result = composeTestOnlyHarnessCancellationPersistence({
      packet: makePacket(),
      provenance: undefined,
      runtimeHost: {
        siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
        listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        authoritativeMainSha: MAIN_SHA,
      },
      consumeStore: store,
      spHttpClient: client,
      configuration: { kind: "synthetic" },
      webAbsoluteUrl: SYNTHETIC_WEB,
      listItemEntityTypeFullName: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
    });
    expect(result.ok).toBe(false);
    expect(result.authorization).toBe("NONE");
    expect(result.postBudgetRemaining).toBe(0);
    expect(client.postCount()).toBe(0);
  });

  it("trusted GO grants persistence port once; second compose with same receipt → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const packet = makePacket();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet,
      consumeStore: store,
    });
    const client = mockClient();
    const input = {
      packet,
      provenance,
      runtimeHost: {
        siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
        listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        authoritativeMainSha: MAIN_SHA,
      },
      consumeStore: store,
      spHttpClient: client,
      configuration: { kind: "synthetic" },
      webAbsoluteUrl: SYNTHETIC_WEB,
      listItemEntityTypeFullName: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
    };

    const first = composeTestOnlyHarnessCancellationPersistence(input);
    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.postBudgetRemaining).toBe(1);
      expect(first.persistencePort).toBeTruthy();
    }

    const second = composeTestOnlyHarnessCancellationPersistence(input);
    expect(second.ok).toBe(false);
    expect(second.authorization).toBe("NONE");
    expect(client.postCount()).toBe(0);
  });

  it("composition module does not re-export issuer mint API", () => {
    expect(
      (
        composeTestOnlyHarnessCancellationPersistence as unknown as {
          issueLifecycleTestOnlyTrustedReceiptProvenance?: unknown;
        }
      ).issueLifecycleTestOnlyTrustedReceiptProvenance,
    ).toBeUndefined();
  });
});
