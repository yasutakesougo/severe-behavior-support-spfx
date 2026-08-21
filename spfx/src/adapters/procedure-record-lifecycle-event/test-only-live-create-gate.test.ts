/**
 * B2 Human GO gate + anti-replay tests.
 * Issuer is imported only here (Human Control / test), not by harness composition.
 */

import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
} from "./sphttpclient-list-transport";
import { issueLifecycleTestOnlyTrustedReceiptProvenance } from "./test-only-human-go-receipt-issuer";
import {
  evaluateLifecycleTestOnlyLiveCreateGo,
  LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE,
  type HumanGoRequestPacket,
} from "./test-only-live-create-gate";
import {
  createInMemoryTrustedReceiptConsumeStore,
  createLocalStorageTrustedReceiptConsumeStore,
  resetProcessTrustedReceiptConsumeStoreForTests,
} from "./test-only-receipt-consume-registry";

const MAIN_SHA = "3e4e2dee195ce82299b62f4b668d50cb563d2c68";

function makePacket(overrides: Partial<HumanGoRequestPacket> = {}): HumanGoRequestPacket {
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
    ...overrides,
  };
}

function host(): {
  siteIdentity: string;
  listGuid: string;
  authoritativeMainSha: string;
} {
  return {
    siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
    authoritativeMainSha: MAIN_SHA,
  };
}

describe("B2 test-only live-create GO gate", () => {
  beforeEach(() => {
    resetProcessTrustedReceiptConsumeStoreForTests();
  });

  it("complete request packet only → authorization NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const result = evaluateLifecycleTestOnlyLiveCreateGo({
      packet: makePacket(),
      provenance: undefined,
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });

  it("self-constructed isomorphic provenance handle not in registry → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const result = evaluateLifecycleTestOnlyLiveCreateGo({
      packet: makePacket(),
      provenance: {
        kind: "trusted-receipt-provenance-v1",
        handle: "b2hr1." + "ab".repeat(24),
      },
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });

  it("arbitrary provenance value → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const result = evaluateLifecycleTestOnlyLiveCreateGo({
      packet: makePacket(),
      provenance: { kind: "trusted-receipt-provenance-v1", handle: "not-a-real-handle" },
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });

  it("Human-issued provenance + matching host → GRANTED once; replay → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const packet = makePacket();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet,
      consumeStore: store,
    });
    const first = evaluateLifecycleTestOnlyLiveCreateGo({
      packet,
      provenance,
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(first.authorization).toBe("GRANTED");

    const replay = evaluateLifecycleTestOnlyLiveCreateGo({
      packet,
      provenance,
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(replay.authorization).toBe("NONE");
    if (replay.authorization === "NONE") {
      expect(replay.reason).toBe("receipt_already_consumed");
    }
  });

  it("wrong runtime host/site → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const packet = makePacket();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet,
      consumeStore: store,
    });
    const result = evaluateLifecycleTestOnlyLiveCreateGo({
      packet,
      provenance,
      runtimeHost: {
        ...host(),
        siteIdentity: "wrong-site-identity",
      },
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });

  it("localStorage-backed store survives reconstructed harness instance (anti-replay)", () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
    };
    const storeA = createLocalStorageTrustedReceiptConsumeStore(storage);
    const packet = makePacket();
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet,
      consumeStore: storeA,
    });
    const first = evaluateLifecycleTestOnlyLiveCreateGo({
      packet,
      provenance,
      runtimeHost: host(),
      consumeStore: storeA,
    });
    expect(first.authorization).toBe("GRANTED");

    const storeB = createLocalStorageTrustedReceiptConsumeStore(storage);
    const replay = evaluateLifecycleTestOnlyLiveCreateGo({
      packet,
      provenance,
      runtimeHost: host(),
      consumeStore: storeB,
    });
    expect(replay.authorization).toBe("NONE");
  });

  it("packet valid + provenance bound to different packet → NONE", () => {
    const store = createInMemoryTrustedReceiptConsumeStore();
    const packetA = makePacket({ lifecycleEventId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
    const packetB = makePacket({ lifecycleEventId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" });
    const provenance = issueLifecycleTestOnlyTrustedReceiptProvenance({
      packet: packetA,
      consumeStore: store,
    });
    const result = evaluateLifecycleTestOnlyLiveCreateGo({
      packet: packetB,
      provenance,
      runtimeHost: host(),
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });
});
