import {
  createSpfxProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket,
  createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket,
  isSpfxProcedureRecordKioskLiveVerifyGoPacket,
  isSpfxProcedureRecordLiveWriteAuthorization,
  isSpfxProcedureRecordLiveWriteGoPacket,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
  PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
  type ProcedureRecordKioskLiveVerifyExecutionBinding,
  type ProcedureRecordKioskLiveVerifyGoPacket,
  type ProcedureRecordLiveWriteGoPacket,
} from "./live-write-gate";
import { PROCEDURE_RECORD_TEST_ONLY_LIST_GUID } from "./sphttpclient-list-transport";

const SYNTHETIC_MAIN_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const RECORD_ID = "1111111111111111111111111111111111111111111111111111111111111111";
const IDEMPOTENCY_KEY = "2222222222222222222222222222222222222222222222222222222222222222";
const PAYLOAD_FINGERPRINT = "3333333333333333333333333333333333333333333333333333333333333333";

function validKioskPacket(): ProcedureRecordKioskLiveVerifyGoPacket {
  return {
    purpose: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    logicalSiteId: "test-only-procedure-record-logical-site-id",
    organizationId: "synthetic-org-001",
    recordId: RECORD_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    payloadFingerprint: PAYLOAD_FINGERPRINT,
    mutationBudget: PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET,
  };
}

function validKioskBinding(): ProcedureRecordKioskLiveVerifyExecutionBinding {
  return {
    authoritativeMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    organizationId: "synthetic-org-001",
    logicalSiteId: "test-only-procedure-record-logical-site-id",
    recordId: RECORD_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    payloadFingerprint: PAYLOAD_FINGERPRINT,
  };
}

function validFirstCreatePacket(): ProcedureRecordLiveWriteGoPacket {
  return {
    purpose: PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE,
    humanLiveWriteGo: true,
    expectedMainSha: SYNTHETIC_MAIN_SHA,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    itemCount: 0,
    logicalSiteId: "test-only-procedure-record-logical-site-id",
    organizationId: "synthetic-org-001",
  };
}

describe("SPFx Kiosk live-verify gate copy", () => {
  it("accepts an exact Kiosk packet and mints authorization", () => {
    expect(isSpfxProcedureRecordKioskLiveVerifyGoPacket(validKioskPacket())).toBe(true);
    const authorization = createSpfxProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket(
      validKioskPacket(),
      validKioskBinding(),
    );
    expect(isSpfxProcedureRecordLiveWriteAuthorization(authorization)).toBe(true);
  });

  it("rejects first-create packets in the Kiosk validator", () => {
    expect(isSpfxProcedureRecordKioskLiveVerifyGoPacket(validFirstCreatePacket())).toBe(false);
    expect(
      createSpfxProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket(
        validFirstCreatePacket(),
        validKioskBinding(),
      ),
    ).toBeUndefined();
  });

  it("rejects Kiosk packets in the first-create validator", () => {
    expect(isSpfxProcedureRecordLiveWriteGoPacket(validKioskPacket())).toBe(false);
    expect(
      createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket(validKioskPacket(), {
        authoritativeMainSha: SYNTHETIC_MAIN_SHA,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
      }),
    ).toBeUndefined();
  });
});
