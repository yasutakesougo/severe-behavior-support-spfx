import {
  evaluateLifecycleTestOnlyLiveCreateGo,
  physicalSiteIdentity,
  verifySignedReceiptArtifact,
} from "./test-only-live-create-gate";
import {
  createInMemoryTrustedReceiptConsumeStore,
  createLocalStorageTrustedReceiptConsumeStore,
} from "./test-only-receipt-consume-registry";

const host = {
  siteIdentity: physicalSiteIdentity({
    hostname: "isogokatudouhome.sharepoint.com",
    siteId: "47e55669-18ac-4143-bc91-f68fd528c6f1",
    webId: "bdd60214-1295-4c83-bae6-3d1a77583b5b",
  }),
  listGuid: "41274293-18d0-4f57-8a45-4f063522bcc7",
  authoritativeMainSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
};

describe("B2 signed receipt gate", () => {
  it.each([
    [
      "bad signature",
      { keyId: "b2-test-only-p256-1", signedPayloadB64u: "e30", signatureB64u: "AA" },
    ],
    ["wrong pinned key", { keyId: "attacker", signedPayloadB64u: "e30", signatureB64u: "AA" }],
    [
      "artifact supplied key",
      {
        keyId: "b2-test-only-p256-1",
        signedPayloadB64u: "e30",
        signatureB64u: "AA",
        publicKey: "attacker",
      },
    ],
    [
      "malformed payload",
      { keyId: "b2-test-only-p256-1", signedPayloadB64u: "e30", signatureB64u: "AA" },
    ],
  ])("%s -> no authorization", async (_name, artifact) => {
    const result = await evaluateLifecycleTestOnlyLiveCreateGo({
      receipt: artifact,
      runtimeHost: host,
      consumeStore: createInMemoryTrustedReceiptConsumeStore(),
    });
    expect(result.authorization).toBe("NONE");
  });

  it("does not trust a localStorage registration as provenance", async () => {
    const values = new Map<string, string>();
    const store = createLocalStorageTrustedReceiptConsumeStore({
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    });
    store.set("receipt", { handle: "receipt", consumed: false });
    const result = await evaluateLifecycleTestOnlyLiveCreateGo({
      receipt: {},
      runtimeHost: host,
      consumeStore: store,
    });
    expect(result.authorization).toBe("NONE");
  });

  it("rejects an invalid signature before any consume", async () => {
    const result = await verifySignedReceiptArtifact({
      keyId: "b2-test-only-p256-1",
      signedPayloadB64u: "e30",
      signatureB64u: "AA",
    });
    expect(result.receipt).toBeUndefined();
  });
});
