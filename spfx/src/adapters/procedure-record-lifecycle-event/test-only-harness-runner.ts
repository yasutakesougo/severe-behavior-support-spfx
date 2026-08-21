/**
 * B2 isolated test-only harness runtime orchestration.
 *
 * Runtime order:
 * parse -> actual page host -> read-only schema preflight -> non-consuming GO inspection
 * -> composition/receipt consume -> one Slice C CANCEL persistence attempt.
 *
 * No trusted receipt issuer is imported here.
 */

import {
  bindProcedureRecordLifecycleEventList,
  createProcedureRecordCancellationSharePointStoragePort,
} from "../../sbs-domain/lifecycle-cancellation-storage.bundle";
import {
  persistStaffProcedureRecordCancellation,
  type ProcedureRecord,
  type StaffProcedureRecordCancellationSaveInput,
} from "../../sbs-domain/cancellation-persist.bundle";
import { mintLifecycleEventIdentity } from "../../sbs-domain/kiosk-read-model.bundle";
import {
  createProcedureRecordLifecycleEventSpHttpClientTransport,
  normalizeProcedureRecordLifecycleEventListGuid,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "./sphttpclient-list-transport";
import { composeTestOnlyHarnessCancellationPersistence } from "./test-only-harness-composition";
import {
  inspectLifecycleTestOnlyLiveCreateGo,
  isHumanGoRequestPacket,
  isTrustedReceiptProvenanceEvidence,
  type HumanGoRequestPacket,
  type LifecycleTestOnlyRuntimeHostContext,
  type TrustedReceiptProvenanceEvidence,
} from "./test-only-live-create-gate";
import type { TrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

export const B2_HARNESS_AUTHORITY_MAIN_SHA = "3e4e2dee195ce82299b62f4b668d50cb563d2c68" as const;

const SYNTHETIC_ORGANIZATION_ID = "synthetic-org-001";
const SYNTHETIC_LOGICAL_SITE_ID = "SITE-ISG";
const SYNTHETIC_USER_ID = "b2-synthetic-user";
const SYNTHETIC_ACTOR_USER_ID = "b2-synthetic-staff";
const SYNTHETIC_RECORD_ID = "b2-synthetic-procedure-record-001";
const SYNTHETIC_CANCEL_RECORDED_AT = "2026-08-21T00:02:00.000Z";
const SYNTHETIC_CANCEL_REASON = "synthetic B2 test-only cancellation";

const SYNTHETIC_ORIGINAL_RECORD: ProcedureRecord = {
  OrganizationId: SYNTHETIC_ORGANIZATION_ID,
  SiteId: SYNTHETIC_LOGICAL_SITE_ID,
  UserId: SYNTHETIC_USER_ID,
  TimeZone: "Asia/Tokyo",
  RecordId: SYNTHETIC_RECORD_ID,
  IdempotencyKey: "b2-synthetic-procedure-record-idempotency-001",
  PayloadFingerprint: "b2-synthetic-procedure-record-payload-fingerprint-001",
  Procedure: {
    ProcedureId: "b2-synthetic-procedure",
    ProcedureVersion: "v1",
    ApprovalState: "APPROVED",
  },
  LocalDate: "2026-08-21",
  planId: "b2-synthetic-plan",
  planVersion: 1,
  result: "PERFORMED_AS_PLANNED",
  performedAt: "2026-08-21T00:00:00.000Z",
  recordedAt: "2026-08-21T00:01:00.000Z",
  recordedBy: SYNTHETIC_ACTOR_USER_ID,
};

const SYNTHETIC_SAVE_INPUT: StaffProcedureRecordCancellationSaveInput = {
  targetRecordId: SYNTHETIC_RECORD_ID,
  originalRecord: SYNTHETIC_ORIGINAL_RECORD,
  reason: SYNTHETIC_CANCEL_REASON,
  boundRecordIds: [SYNTHETIC_RECORD_ID],
  lifecycleEvents: [],
  corrections: [],
  authorization: {
    status: "FOUND",
    value: {
      Subject: "b2-synthetic-subject",
      UserId: SYNTHETIC_ACTOR_USER_ID,
      OrganizationId: SYNTHETIC_ORGANIZATION_ID,
      SiteContext: {
        SelectedSiteId: SYNTHETIC_LOGICAL_SITE_ID,
        Memberships: [
          {
            SiteId: SYNTHETIC_LOGICAL_SITE_ID,
            Roles: ["SUPPORTER"],
          },
        ],
      },
    },
  },
  recordedAtIso: SYNTHETIC_CANCEL_RECORDED_AT,
};

export const B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY = mintLifecycleEventIdentity({
  eventType: "CANCEL",
  targetRecordId: SYNTHETIC_RECORD_ID,
  recordedAt: SYNTHETIC_CANCEL_RECORDED_AT,
  recordedBy: SYNTHETIC_ACTOR_USER_ID,
  reason: SYNTHETIC_CANCEL_REASON,
});

export type LifecycleCreateTestHarnessActionInput = Readonly<{
  packetJson: string;
  provenanceJson: string;
  expectedMainSha: string;
  runtimeSiteIdentity: string;
  webAbsoluteUrl: string;
  consumeStore: TrustedReceiptConsumeStore;
  spHttpClient: ProcedureRecordLifecycleEventSpHttpClient;
  configuration: unknown;
}>;

export type LifecycleCreateTestHarnessActionResult = Readonly<{
  ok: boolean;
  stage: "VALIDATE" | "EXECUTE";
  reason: string;
  appendCalled: boolean;
  saveState?: "saved" | "save_failed" | "save_outcome_unknown";
}>;

type PreparedHarnessRun = Readonly<{
  packet: HumanGoRequestPacket;
  provenance: TrustedReceiptProvenanceEvidence;
  runtimeHost: LifecycleTestOnlyRuntimeHostContext;
}>;

type PrepareResult =
  Readonly<{ ok: false; reason: string }> | Readonly<{ ok: true; prepared: PreparedHarnessRun }>;

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function packetMatchesFrozenSyntheticCancel(packet: HumanGoRequestPacket): boolean {
  return (
    packet.lifecycleEventId === B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleEventId &&
    packet.lifecycleIdempotencyKey ===
      B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleIdempotencyKey &&
    packet.lifecyclePayloadFingerprint ===
      B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecyclePayloadFingerprint
  );
}

async function prepareHarnessRun(
  input: LifecycleCreateTestHarnessActionInput,
): Promise<PrepareResult> {
  const packet = parseJson(input.packetJson);
  const provenance = parseJson(input.provenanceJson);

  if (!isHumanGoRequestPacket(packet)) {
    return { ok: false, reason: "malformed_or_incomplete_request_packet" };
  }
  if (!isTrustedReceiptProvenanceEvidence(provenance)) {
    return { ok: false, reason: "trusted_provenance_absent_or_invalid" };
  }

  const expectedMainSha = input.expectedMainSha.trim().toLowerCase();
  if (
    expectedMainSha !== B2_HARNESS_AUTHORITY_MAIN_SHA ||
    packet.expectedMainSha.toLowerCase() !== expectedMainSha
  ) {
    return { ok: false, reason: "main_sha_confirmation_mismatch" };
  }

  if (!packetMatchesFrozenSyntheticCancel(packet)) {
    return { ok: false, reason: "packet_synthetic_cancel_identity_mismatch" };
  }

  const runtimeSiteIdentity = input.runtimeSiteIdentity.trim();
  if (runtimeSiteIdentity !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY) {
    return { ok: false, reason: "runtime_page_site_mismatch" };
  }

  // GET-only preflight. Locked GUID is the query address, but the observed List Id
  // becomes runtimeHost.listGuid; the hardcoded constant is not host proof.
  const readOnlyTransport = createProcedureRecordLifecycleEventSpHttpClientTransport({
    spHttpClient: input.spHttpClient,
    configuration: input.configuration,
    webAbsoluteUrl: input.webAbsoluteUrl,
    siteIdentity: runtimeSiteIdentity,
    listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  });

  const schema = await readOnlyTransport.getSchema();
  if (!schema.ok) {
    return { ok: false, reason: `preflight_schema_${schema.failure.toLowerCase()}` };
  }

  const observedListGuid = normalizeProcedureRecordLifecycleEventListGuid(schema.list.Id);
  if (
    observedListGuid === undefined ||
    observedListGuid !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID
  ) {
    return { ok: false, reason: "preflight_observed_list_mismatch" };
  }

  const binding = bindProcedureRecordLifecycleEventList({
    siteIdentity: runtimeSiteIdentity,
    listGuid: observedListGuid,
  });
  if (!binding) {
    return { ok: false, reason: "preflight_binding_unusable" };
  }

  const readOnlyStorage = createProcedureRecordCancellationSharePointStoragePort(
    binding,
    readOnlyTransport,
  );
  const physicalSchema = await readOnlyStorage.verifyPhysicalSchema();
  if (!physicalSchema.ok) {
    return { ok: false, reason: "preflight_physical_schema_mismatch" };
  }

  const runtimeHost: LifecycleTestOnlyRuntimeHostContext = {
    siteIdentity: runtimeSiteIdentity,
    listGuid: observedListGuid,
    authoritativeMainSha: B2_HARNESS_AUTHORITY_MAIN_SHA,
  };

  const inspection = inspectLifecycleTestOnlyLiveCreateGo({
    packet,
    provenance,
    runtimeHost,
    consumeStore: input.consumeStore,
  });
  if (inspection.authorization !== "READY") {
    return { ok: false, reason: inspection.reason };
  }

  return {
    ok: true,
    prepared: {
      packet: inspection.packet,
      provenance: inspection.provenance,
      runtimeHost,
    },
  };
}

export async function validateLifecycleCreateTestHarnessRun(
  input: LifecycleCreateTestHarnessActionInput,
): Promise<LifecycleCreateTestHarnessActionResult> {
  const prepared = await prepareHarnessRun(input);
  if (!prepared.ok) {
    return {
      ok: false,
      stage: "VALIDATE",
      reason: prepared.reason,
      appendCalled: false,
    };
  }
  return {
    ok: true,
    stage: "VALIDATE",
    reason: "ready_no_post",
    appendCalled: false,
  };
}

export async function executeLifecycleCreateTestHarnessRun(
  input: LifecycleCreateTestHarnessActionInput,
): Promise<LifecycleCreateTestHarnessActionResult> {
  const prepared = await prepareHarnessRun(input);
  if (!prepared.ok) {
    return {
      ok: false,
      stage: "EXECUTE",
      reason: prepared.reason,
      appendCalled: false,
    };
  }

  const composition = composeTestOnlyHarnessCancellationPersistence({
    packet: prepared.prepared.packet,
    provenance: prepared.prepared.provenance,
    runtimeHost: prepared.prepared.runtimeHost,
    consumeStore: input.consumeStore,
    spHttpClient: input.spHttpClient,
    configuration: input.configuration,
    webAbsoluteUrl: input.webAbsoluteUrl,
  });
  if (!composition.ok) {
    return {
      ok: false,
      stage: "EXECUTE",
      reason: composition.reason,
      appendCalled: false,
    };
  }

  const persisted = await persistStaffProcedureRecordCancellation(
    SYNTHETIC_SAVE_INPUT,
    composition.persistencePort,
  );

  if (
    persisted.event !== null &&
    (persisted.event.LifecycleEventId !== composition.packet.lifecycleEventId ||
      persisted.event.LifecycleIdempotencyKey !== composition.packet.lifecycleIdempotencyKey ||
      persisted.event.LifecyclePayloadFingerprint !==
        composition.packet.lifecyclePayloadFingerprint)
  ) {
    return {
      ok: false,
      stage: "EXECUTE",
      reason: "persisted_event_identity_mismatch",
      appendCalled: persisted.appendCalled,
      saveState: persisted.saveState,
    };
  }

  return {
    ok: persisted.saveState === "saved",
    stage: "EXECUTE",
    reason: persisted.saveState,
    appendCalled: persisted.appendCalled,
    saveState: persisted.saveState,
  };
}
