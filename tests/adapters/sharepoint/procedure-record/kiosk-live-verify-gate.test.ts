import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket,
  createProcedureRecordLiveWriteAuthorization,
  createProcedureRecordLiveWriteAuthorizationFromGoPacket,
  createProcedureRecordLiveWriteExecutionRepository,
  isProcedureRecordKioskLiveVerifyGoPacket,
  isProcedureRecordLiveWriteAuthorization,
  isProcedureRecordLiveWriteAuthorized,
  isProcedureRecordLiveWriteGoPacket,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  bindTestOnlyProvisionedProcedureRecordList,
  type ProcedureRecordKioskLiveVerifyExecutionBinding,
  type ProcedureRecordLiveWriteGoPacket,
} from "../../../../src/adapters/sharepoint/procedure-record";

const here = dirname(fileURLToPath(import.meta.url));
const SYNTHETIC_MAIN_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const OTHER_MAIN_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const LOGICAL_SITE_ID = "test-only-procedure-record-logical-site-id";
const OTHER_LOGICAL_SITE_ID = "other-logical-site-id";
const ORGANIZATION_ID = "synthetic-org-001";
const OTHER_ORGANIZATION_ID = "other-org-001";
const OTHER_LIST_GUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PRODUCTION_LIKE_LIST_GUID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const RECORD_ID = "1111111111111111111111111111111111111111111111111111111111111111";
const OTHER_RECORD_ID = "4444444444444444444444444444444444444444444444444444444444444444";
const IDEMPOTENCY_KEY = "2222222222222222222222222222222222222222222222222222222222222222";
const OTHER_IDEMPOTENCY_KEY = "5555555555555555555555555555555555555555555555555555555555555555";
const PAYLOAD_FINGERPRINT = "3333333333333333333333333333333333333333333333333333333333333333";
const OTHER_PAYLOAD_FINGERPRINT =
  "6666666666666666666666666666666666666666666666666666666666666666";

function source(relativeFromRepoRoot: string): string {
  return readFileSync(join(here, "../../../../", relativeFromRepoRoot), "utf8");
}

function validKioskPacket(overrides: Record<string, unknown> = {}): Record<string, unknown> {
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
    mutationBudget: { ...PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET },
    ...overrides,
  };
}

function validKioskBinding(
  overrides: Partial<ProcedureRecordKioskLiveVerifyExecutionBinding> = {},
): ProcedureRecordKioskLiveVerifyExecutionBinding {
  return {
    authoritativeMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    organizationId: ORGANIZATION_ID,
    logicalSiteId: LOGICAL_SITE_ID,
    recordId: RECORD_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    payloadFingerprint: PAYLOAD_FINGERPRINT,
    ...overrides,
  };
}

function validFirstCreatePacket(): ProcedureRecordLiveWriteGoPacket {
  return {
    purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    itemCount: 0,
    logicalSiteId: LOGICAL_SITE_ID,
    organizationId: ORGANIZATION_ID,
  };
}

function mint(
  packet: unknown,
  execution: unknown = validKioskBinding(),
): ReturnType<typeof createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket> {
  return createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket(packet, execution);
}

describe("LG-OLD first-create gate remains unchanged", () => {
  it("LG-OLD-01: procedure-record-first-create remains a valid purpose", () => {
    assert.equal(PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE, "procedure-record-first-create");
    assert.equal(isProcedureRecordLiveWriteGoPacket(validFirstCreatePacket()), true);
    assert.ok(
      isProcedureRecordLiveWriteAuthorization(
        createProcedureRecordLiveWriteAuthorizationFromGoPacket(validFirstCreatePacket(), {
          authoritativeMainSha: SYNTHETIC_MAIN_SHA,
          listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          organizationId: ORGANIZATION_ID,
          logicalSiteId: LOGICAL_SITE_ID,
        }),
      ),
    );
  });

  it("LG-OLD-02: old purpose rejects itemCount other than 0", () => {
    assert.equal(
      isProcedureRecordLiveWriteGoPacket({
        ...validFirstCreatePacket(),
        itemCount: 1,
      }),
      false,
    );
    assert.equal(
      createProcedureRecordLiveWriteAuthorizationFromGoPacket(
        { ...validFirstCreatePacket(), itemCount: 1 },
        {
          authoritativeMainSha: SYNTHETIC_MAIN_SHA,
          listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          organizationId: ORGANIZATION_ID,
          logicalSiteId: LOGICAL_SITE_ID,
        },
      ),
      null,
    );
  });

  it("LG-OLD-03: old target remains the test-only List", () => {
    assert.equal(
      isProcedureRecordLiveWriteGoPacket({
        ...validFirstCreatePacket(),
        listGuid: OTHER_LIST_GUID,
      }),
      false,
    );
  });

  it("LG-OLD-04: consumed first-create packet is not revived in code", () => {
    const gate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    assert.equal(gate.includes("unconsume"), false);
    assert.equal(gate.includes("reviveConsumed"), false);
    assert.equal(
      createProcedureRecordLiveWriteAuthorizationFromGoPacket(
        { ...validFirstCreatePacket(), itemCount: 1 },
        {
          authoritativeMainSha: SYNTHETIC_MAIN_SHA,
          listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          organizationId: ORGANIZATION_ID,
          logicalSiteId: LOGICAL_SITE_ID,
        },
      ),
      null,
    );
  });

  it("LG-OLD-05: default authorization mint remains null", () => {
    assert.equal(createProcedureRecordLiveWriteAuthorization(), null);
    assert.equal(isProcedureRecordLiveWriteAuthorized(), false);
  });
});

describe("LG-NEW Kiosk live-verify gate", () => {
  it("LG-NEW-01: exact valid Kiosk packet is accepted", () => {
    assert.equal(
      PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
      "kiosk-spfx-persistence-live-verify-1",
    );
    assert.equal(isProcedureRecordKioskLiveVerifyGoPacket(validKioskPacket()), true);
  });

  it("LG-NEW-02: exact execution binding mints authorization", () => {
    const authorization = mint(validKioskPacket(), validKioskBinding());
    assert.ok(isProcedureRecordLiveWriteAuthorization(authorization));
    assert.equal(isProcedureRecordLiveWriteAuthorized(), false);
    assert.equal(createProcedureRecordLiveWriteAuthorization(), null);
  });

  it("LG-NEW-03: test-only List is the only accepted List GUID", () => {
    assert.ok(isProcedureRecordLiveWriteAuthorization(mint(validKioskPacket())));
    assert.equal(mint(validKioskPacket({ listGuid: OTHER_LIST_GUID })), null);
    assert.equal(mint(validKioskPacket({ listGuid: PRODUCTION_LIKE_LIST_GUID })), null);
  });

  it("LG-NEW-04: exact main SHA binding", () => {
    assert.ok(isProcedureRecordLiveWriteAuthorization(mint(validKioskPacket())));
    assert.equal(
      mint(validKioskPacket(), validKioskBinding({ authoritativeMainSha: OTHER_MAIN_SHA })),
      null,
    );
  });

  it("LG-NEW-05: exact organizationId binding", () => {
    assert.equal(
      mint(validKioskPacket(), validKioskBinding({ organizationId: OTHER_ORGANIZATION_ID })),
      null,
    );
  });

  it("LG-NEW-06: exact logicalSiteId binding", () => {
    assert.equal(
      mint(validKioskPacket(), validKioskBinding({ logicalSiteId: OTHER_LOGICAL_SITE_ID })),
      null,
    );
  });

  it("LG-NEW-07: exact RecordId binding", () => {
    assert.equal(mint(validKioskPacket(), validKioskBinding({ recordId: OTHER_RECORD_ID })), null);
  });

  it("LG-NEW-08: exact IdempotencyKey binding", () => {
    assert.equal(
      mint(validKioskPacket(), validKioskBinding({ idempotencyKey: OTHER_IDEMPOTENCY_KEY })),
      null,
    );
  });

  it("LG-NEW-09: exact PayloadFingerprint binding", () => {
    assert.equal(
      mint(
        validKioskPacket(),
        validKioskBinding({ payloadFingerprint: OTHER_PAYLOAD_FINGERPRINT }),
      ),
      null,
    );
  });

  it("LG-NEW-10: mutation budget is exactly 1/0/0/0", () => {
    assert.deepEqual(PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET, {
      create: 1,
      update: 0,
      delete: 0,
      retryPost: 0,
    });
    assert.equal(isProcedureRecordKioskLiveVerifyGoPacket(validKioskPacket()), true);
  });

  it("LG-03: itemCount===0 is not a Kiosk authorization requirement", () => {
    const gate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    const start = gate.indexOf("export function isProcedureRecordKioskLiveVerifyGoPacket");
    const end = gate.indexOf("function isBoundKioskLiveVerifyExecution");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    assert.equal(gate.slice(start, end).includes("itemCount"), false);
    assert.equal(
      isProcedureRecordKioskLiveVerifyGoPacket({
        ...validKioskPacket(),
        itemCount: 1,
      }),
      true,
    );
    assert.ok(
      isProcedureRecordLiveWriteAuthorization(
        mint({
          ...validKioskPacket(),
          itemCount: 1,
        }),
      ),
    );
  });
});

describe("Kiosk live-verify fail-closed field changes", () => {
  it("rejects wrong purpose", () => {
    assert.equal(
      mint({
        ...validKioskPacket(),
        purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
      }),
      null,
    );
  });

  it("rejects humanLiveWriteGo false", () => {
    assert.equal(
      mint({
        ...validKioskPacket(),
        humanLiveWriteGo: false,
      }),
      null,
    );
  });

  it("rejects wrong main SHA", () => {
    assert.equal(mint(validKioskPacket({ expectedMainSha: OTHER_MAIN_SHA })), null);
  });

  it("rejects wrong List GUID", () => {
    assert.equal(mint(validKioskPacket({ listGuid: OTHER_LIST_GUID })), null);
  });

  it("rejects production/other List GUID", () => {
    assert.equal(mint(validKioskPacket({ listGuid: PRODUCTION_LIKE_LIST_GUID })), null);
  });

  it("rejects empty organizationId", () => {
    assert.equal(mint(validKioskPacket({ organizationId: "" })), null);
  });

  it("rejects different organizationId", () => {
    assert.equal(mint(validKioskPacket({ organizationId: OTHER_ORGANIZATION_ID })), null);
  });

  it("rejects empty logicalSiteId", () => {
    assert.equal(mint(validKioskPacket({ logicalSiteId: "" })), null);
  });

  it("rejects GUID-like logicalSiteId", () => {
    assert.equal(
      mint(validKioskPacket({ logicalSiteId: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID })),
      null,
    );
  });

  it("rejects different logicalSiteId", () => {
    assert.equal(mint(validKioskPacket({ logicalSiteId: OTHER_LOGICAL_SITE_ID })), null);
  });

  it("rejects different RecordId", () => {
    assert.equal(mint(validKioskPacket({ recordId: OTHER_RECORD_ID })), null);
  });

  it("rejects different IdempotencyKey", () => {
    assert.equal(mint(validKioskPacket({ idempotencyKey: OTHER_IDEMPOTENCY_KEY })), null);
  });

  it("rejects different PayloadFingerprint", () => {
    assert.equal(mint(validKioskPacket({ payloadFingerprint: OTHER_PAYLOAD_FINGERPRINT })), null);
  });

  it("rejects mutationBudget create=0", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: { create: 0, update: 0, delete: 0, retryPost: 0 },
        }),
      ),
      null,
    );
  });

  it("rejects mutationBudget create=2", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: { create: 2, update: 0, delete: 0, retryPost: 0 },
        }),
      ),
      null,
    );
  });

  it("rejects mutationBudget update=1", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: { create: 1, update: 1, delete: 0, retryPost: 0 },
        }),
      ),
      null,
    );
  });

  it("rejects mutationBudget delete=1", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: { create: 1, update: 0, delete: 1, retryPost: 0 },
        }),
      ),
      null,
    );
  });

  it("rejects mutationBudget retryPost=1", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: { create: 1, update: 0, delete: 0, retryPost: 1 },
        }),
      ),
      null,
    );
  });

  it("rejects extra mutation capability keys", () => {
    assert.equal(
      mint(
        validKioskPacket({
          mutationBudget: {
            create: 1,
            update: 0,
            delete: 0,
            retryPost: 0,
            patch: 0,
          },
        }),
      ),
      null,
    );
  });
});

describe("cross-purpose isolation", () => {
  it("rejects a first-create packet in the Kiosk validator and mint", () => {
    assert.equal(isProcedureRecordKioskLiveVerifyGoPacket(validFirstCreatePacket()), false);
    assert.equal(mint(validFirstCreatePacket(), validKioskBinding()), null);
  });

  it("rejects a Kiosk packet in the first-create validator and mint", () => {
    assert.equal(isProcedureRecordLiveWriteGoPacket(validKioskPacket()), false);
    assert.equal(
      createProcedureRecordLiveWriteAuthorizationFromGoPacket(validKioskPacket(), {
        authoritativeMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        organizationId: ORGANIZATION_ID,
        logicalSiteId: LOGICAL_SITE_ID,
      }),
      null,
    );
  });

  it("does not open the first-create execution repository from a Kiosk packet", () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    assert.equal(
      createProcedureRecordLiveWriteExecutionRepository(
        binding,
        {
          targetListGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
          async getSchema() {
            throw new Error("network must stay 0");
          },
          async findByRecordId() {
            throw new Error("network must stay 0");
          },
          async findByIdempotencyKey() {
            throw new Error("network must stay 0");
          },
          async createItem() {
            throw new Error("network must stay 0");
          },
        },
        validKioskPacket(),
        { authoritativeMainSha: SYNTHETIC_MAIN_SHA },
      ),
      null,
    );
  });
});

describe("Kiosk live-verify network isolation and locked payload", () => {
  it("gate source does not perform SharePoint, REST, or Graph I/O", () => {
    const rootGate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    const spfxGate = source("spfx/src/adapters/procedure-record/live-write-gate.ts");
    for (const text of [rootGate, spfxGate]) {
      assert.equal(text.includes("fetch("), false);
      assert.equal(text.includes("/_api"), false);
      assert.equal(text.includes("graph.microsoft"), false);
      assert.equal(text.includes("sharepoint.com"), false);
    }
  });

  it("does not hardcode the PREP locked payload into production gate source", () => {
    const rootGate = source("src/adapters/sharepoint/procedure-record/live-write-gate.ts");
    const spfxGate = source("spfx/src/adapters/procedure-record/live-write-gate.ts");
    const locked = [
      "a850964e3b78dc7f2917701b344fa2401a2dde9625073fad8e164c66bc826fcd",
      "faa67e9b0403a4185dfa7776626186d2798c9b232810f71029e0821cdbdd34a8",
      "69aecf49d46fcd97614d3c3e79cfe50a4ebde1bb5b4d3c84decfa183ca1e58af",
    ];
    for (const value of locked) {
      assert.equal(rootGate.includes(value), false);
      assert.equal(spfxGate.includes(value), false);
    }
  });

  it("keeps Staff form default persistPort on LIVE WRITE HOLD", () => {
    const form = source("spfx/src/shell/procedure/ProcedureRecordForm.tsx");
    assert.equal(form.includes("persistPort = STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT"), true);
  });
});
