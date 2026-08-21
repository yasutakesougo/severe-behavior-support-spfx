/**
 * B2 Human GO execution gate for isolated test-only lifecycle CREATE.
 *
 * HumanGoRequestPacket ≠ TrustedReceiptProvenanceEvidence.
 * Reconstructing every request packet field alone MUST NOT authorize POST.
 * Does NOT copy ProcedureRecord live-write-gate field-shape-only mint pattern.
 */

import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  normalizeProcedureRecordLifecycleEventListGuid,
} from "./sphttpclient-list-transport";
import type { TrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

export const LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE =
  "lifecycle-event-test-only-live-create" as const;

const MAIN_SHA_RE = /^[0-9a-f]{40}$/;
const NON_EMPTY = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export type HumanGoRequestPacketMutationBudget = Readonly<{
  create: 1;
  retryPost: 0;
  update: 0;
  delete: 0;
}>;

export type HumanGoRequestPacket = Readonly<{
  purpose: typeof LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE;
  humanLiveCreateGo: true;
  expectedMainSha: string;
  siteIdentity: string;
  listGuid: string;
  lifecycleEventId: string;
  lifecycleIdempotencyKey: string;
  lifecyclePayloadFingerprint: string;
  mutationBudget: HumanGoRequestPacketMutationBudget;
}>;

/**
 * Trust material distinct from HumanGoRequestPacket.
 * Handle is opaque and not reconstructible from request fields.
 */
export type TrustedReceiptProvenanceEvidence = Readonly<{
  kind: "trusted-receipt-provenance-v1";
  handle: string;
}>;

const HARNESS_RUN_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "spfx-lifecycle-test-only-harness-run-authorization",
);

export type LifecycleTestOnlyHarnessRunAuthorization = Readonly<{
  readonly [HARNESS_RUN_AUTHORIZATION_BRAND]: true;
  readonly receiptHandle: string;
  readonly packet: HumanGoRequestPacket;
}>;

export type LifecycleTestOnlyGoGateResult =
  | Readonly<{ authorization: "NONE"; reason: string }>
  | Readonly<{
      authorization: "GRANTED";
      token: LifecycleTestOnlyHarnessRunAuthorization;
    }>;

export type LifecycleTestOnlyRuntimeHostContext = Readonly<{
  siteIdentity: string;
  listGuid: string;
  authoritativeMainSha: string;
}>;

export function isLifecycleTestOnlyHarnessRunAuthorization(
  value: unknown,
): value is LifecycleTestOnlyHarnessRunAuthorization {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    (value as { [HARNESS_RUN_AUTHORIZATION_BRAND]?: true })[HARNESS_RUN_AUTHORIZATION_BRAND] ===
    true
  );
}

export function isHumanGoRequestPacket(value: unknown): value is HumanGoRequestPacket {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const packet = value as Partial<HumanGoRequestPacket>;
  if (packet.purpose !== LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE) {
    return false;
  }
  if (packet.humanLiveCreateGo !== true) {
    return false;
  }
  if (typeof packet.expectedMainSha !== "string" || !MAIN_SHA_RE.test(packet.expectedMainSha)) {
    return false;
  }
  if (!NON_EMPTY(packet.siteIdentity)) {
    return false;
  }
  const listGuid =
    typeof packet.listGuid === "string"
      ? normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid)
      : undefined;
  if (listGuid === undefined) {
    return false;
  }
  if (!NON_EMPTY(packet.lifecycleEventId)) {
    return false;
  }
  if (!NON_EMPTY(packet.lifecycleIdempotencyKey)) {
    return false;
  }
  if (!NON_EMPTY(packet.lifecyclePayloadFingerprint)) {
    return false;
  }
  const budget = packet.mutationBudget as Partial<HumanGoRequestPacketMutationBudget> | undefined;
  if (
    !budget ||
    budget.create !== 1 ||
    budget.retryPost !== 0 ||
    budget.update !== 0 ||
    budget.delete !== 0
  ) {
    return false;
  }
  return true;
}

export function isTrustedReceiptProvenanceEvidence(
  value: unknown,
): value is TrustedReceiptProvenanceEvidence {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const evidence = value as Partial<TrustedReceiptProvenanceEvidence>;
  return (
    evidence.kind === "trusted-receipt-provenance-v1" &&
    typeof evidence.handle === "string" &&
    evidence.handle.startsWith("b2hr1.") &&
    evidence.handle.length >= 40
  );
}

/** Canonical binding digest for packet ↔ provenance registration. */
export function humanGoRequestPacketBindingDigest(packet: HumanGoRequestPacket): string {
  const listGuid = normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid) ?? "";
  const canonical = [
    packet.purpose,
    packet.expectedMainSha.toLowerCase(),
    packet.siteIdentity.trim(),
    listGuid,
    packet.lifecycleEventId.trim(),
    packet.lifecycleIdempotencyKey.trim(),
    packet.lifecyclePayloadFingerprint.trim(),
    "c1",
    "r0",
    "u0",
    "d0",
  ].join("\u0000");
  return `pkt1.${fnv1aHex(canonical)}`;
}

export function evaluateLifecycleTestOnlyLiveCreateGo(input: {
  packet: unknown;
  provenance: unknown;
  runtimeHost: LifecycleTestOnlyRuntimeHostContext;
  consumeStore: TrustedReceiptConsumeStore;
  nowIso?: string;
}): LifecycleTestOnlyGoGateResult {
  if (!isHumanGoRequestPacket(input.packet)) {
    return { authorization: "NONE", reason: "malformed_or_incomplete_request_packet" };
  }
  if (!isTrustedReceiptProvenanceEvidence(input.provenance)) {
    return { authorization: "NONE", reason: "trusted_provenance_absent_or_invalid" };
  }

  const packet = input.packet;
  const packetListGuid = normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid);
  const hostListGuid = normalizeProcedureRecordLifecycleEventListGuid(input.runtimeHost.listGuid);
  if (packetListGuid === undefined || hostListGuid === undefined) {
    return { authorization: "NONE", reason: "list_guid_invalid" };
  }
  if (packetListGuid !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID) {
    return { authorization: "NONE", reason: "list_guid_not_test_only_target" };
  }
  if (hostListGuid !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID) {
    return { authorization: "NONE", reason: "runtime_host_list_mismatch" };
  }
  if (packet.siteIdentity.trim() !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY) {
    return { authorization: "NONE", reason: "site_identity_not_test_only_target" };
  }
  if (
    input.runtimeHost.siteIdentity.trim() !==
    PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY
  ) {
    return { authorization: "NONE", reason: "runtime_host_site_mismatch" };
  }
  if (packet.siteIdentity.trim() !== input.runtimeHost.siteIdentity.trim()) {
    return { authorization: "NONE", reason: "packet_host_site_mismatch" };
  }
  if (packetListGuid !== hostListGuid) {
    return { authorization: "NONE", reason: "packet_host_list_mismatch" };
  }
  if (
    packet.expectedMainSha.toLowerCase() !== input.runtimeHost.authoritativeMainSha.toLowerCase()
  ) {
    return { authorization: "NONE", reason: "main_sha_mismatch" };
  }

  const digest = humanGoRequestPacketBindingDigest(packet);
  const entry = input.consumeStore.get(input.provenance.handle);
  if (!entry) {
    return { authorization: "NONE", reason: "trusted_provenance_not_registered" };
  }
  if (entry.handle !== input.provenance.handle) {
    return { authorization: "NONE", reason: "trusted_provenance_handle_mismatch" };
  }
  if (entry.packetBindingDigest !== digest) {
    return { authorization: "NONE", reason: "trusted_provenance_packet_binding_mismatch" };
  }
  if (entry.consumed) {
    return { authorization: "NONE", reason: "receipt_already_consumed" };
  }

  const nowIso = input.nowIso ?? new Date().toISOString();
  input.consumeStore.set(input.provenance.handle, {
    ...entry,
    consumed: true,
    consumedAtIso: nowIso,
  });

  return {
    authorization: "GRANTED",
    token: {
      [HARNESS_RUN_AUTHORIZATION_BRAND]: true,
      receiptHandle: input.provenance.handle,
      packet,
    },
  };
}

function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16);
  return ("00000000" + hex).slice(-8);
}
