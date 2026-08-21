import { composeTestOnlyHarnessCancellationPersistence } from "./test-only-harness-composition";
import { createInMemoryTrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

describe("B2 harness composition", () => {
  it("does not construct a transport without a valid signed receipt", async () => {
    let posts = 0;
    const result = await composeTestOnlyHarnessCancellationPersistence({
      receipt: {},
      runtimeHost: { siteIdentity: "wrong", listGuid: "wrong", authoritativeMainSha: "wrong" },
      consumeStore: createInMemoryTrustedReceiptConsumeStore(),
      spHttpClient: {
        get: async () => ({ ok: true, status: 200, json: async () => ({ value: [] }) }),
        post: async () => {
          posts += 1;
          return { ok: true, status: 201, json: async () => ({}) };
        },
      },
      configuration: {},
      webAbsoluteUrl: "https://synthetic.example.invalid",
    });
    expect(result.ok).toBe(false);
    expect(posts).toBe(0);
  });
});
