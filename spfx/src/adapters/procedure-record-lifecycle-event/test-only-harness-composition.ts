/**
 * B2 controlled GATE-3 composition for isolated test-only harness.
 *
 * - Sole file allowed to import synthetic CREATE mint for harness runs
 * - MUST NOT mint TrustedReceiptProvenanceEvidence
 * - GO gate PASS required before synthetic CREATE transport construction
 * - Does not export a generic CREATE API
 */

import {
  bindProcedureRecordLifecycleEventList,
  createProcedureRecordCancellationSharePointStoragePort,
} from "../../sbs-domain/lifecycle-cancellation-storage.bundle";
import {
  createProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationPersistencePort,
} from "../../sbs-domain/cancellation-persist.bundle";
import {
  createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport,
  mintProcedureRecordLifecycleEventSyntheticCreateAuthorization,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  type CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "./sphttpclient-list-transport";
import {
  evaluateLifecycleTestOnlyLiveCreateGo,
  isLifecycleTestOnlyHarnessRunAuthorization,
  type HumanGoRequestPacket,
  type LifecycleTestOnlyHarnessRunAuthorization,
  type LifecycleTestOnlyRuntimeHostContext,
} from "./test-only-live-create-gate";
import type { TrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

export type TestOnlyHarnessCompositionInput = Readonly<{
  receipt: unknown;
  packet?: unknown;
  runtimeHost: LifecycleTestOnlyRuntimeHostContext;
  consumeStore: TrustedReceiptConsumeStore;
  spHttpClient: ProcedureRecordLifecycleEventSpHttpClient;
  configuration: unknown;
  webAbsoluteUrl: string;
  listItemEntityTypeFullName?: string;
}>;

export type TestOnlyHarnessCompositionResult =
  | Readonly<{
      ok: false;
      authorization: "NONE";
      reason: string;
      persistencePort: undefined;
      postBudgetRemaining: 0;
    }>
  | Readonly<{
      ok: true;
      authorization: "GRANTED";
      token: LifecycleTestOnlyHarnessRunAuthorization;
      persistencePort: ProcedureRecordCancellationPersistencePort;
      packet: HumanGoRequestPacket;
      postBudgetRemaining: 1;
    }>;

/**
 * Validates Human GO (packet + trusted provenance + host) then builds
 * Slice C persistence over Slice E storage + GATE-3 synthetic CREATE transport.
 */
export async function composeTestOnlyHarnessCancellationPersistence(
  input: TestOnlyHarnessCompositionInput,
): Promise<TestOnlyHarnessCompositionResult> {
  const gate = await evaluateLifecycleTestOnlyLiveCreateGo({
    receipt: input.receipt,
    packet: input.packet,
    runtimeHost: input.runtimeHost,
    consumeStore: input.consumeStore,
  });
  if (gate.authorization !== "GRANTED") {
    return {
      ok: false,
      authorization: "NONE",
      reason: gate.reason,
      persistencePort: undefined,
      postBudgetRemaining: 0,
    };
  }

  const token = gate.token;
  if (!isLifecycleTestOnlyHarnessRunAuthorization(token)) {
    return {
      ok: false,
      authorization: "NONE",
      reason: "harness_run_authorization_invalid",
      persistencePort: undefined,
      postBudgetRemaining: 0,
    };
  }

  const binding = bindProcedureRecordLifecycleEventList({
    siteIdentity: token.packet.siteIdentity,
    listGuid: token.packet.listGuid,
  });
  if (!binding) {
    return {
      ok: false,
      authorization: "NONE",
      reason: "list_binding_unusable",
      persistencePort: undefined,
      postBudgetRemaining: 0,
    };
  }

  const transportOptions: CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions = {
    spHttpClient: input.spHttpClient,
    configuration: input.configuration,
    webAbsoluteUrl: input.webAbsoluteUrl,
    siteIdentity: token.packet.siteIdentity,
    listGuid: token.packet.listGuid,
    listItemEntityTypeFullName:
      input.listItemEntityTypeFullName ??
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE,
  };

  // Synthetic CREATE mint only after GO PASS — this file is the sole harness importer.
  const syntheticAuth = mintProcedureRecordLifecycleEventSyntheticCreateAuthorization();
  const transport = createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
    transportOptions,
    syntheticAuth,
  );
  const storage = createProcedureRecordCancellationSharePointStoragePort(binding, transport);
  const persistencePort = createProcedureRecordCancellationPersistencePort(
    storage as Parameters<typeof createProcedureRecordCancellationPersistencePort>[0],
  );

  return {
    ok: true,
    authorization: "GRANTED",
    token,
    persistencePort,
    packet: token.packet,
    postBudgetRemaining: 1,
  };
}
