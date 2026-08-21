/** Fail-closed signed receipt gate for the isolated test-only harness. */
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  normalizeProcedureRecordLifecycleEventListGuid,
} from "./sphttpclient-list-transport";
import type { TrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";
import { B2_HARNESS_BUILD_BASIS_SHA } from "./b2-build-basis.generated";

export const LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE =
  "lifecycle-event-test-only-live-create" as const;
const MAIN_SHA_RE = /^[0-9a-f]{40}$/;
const B64U_RE = /^[A-Za-z0-9_-]+$/;
const PINNED_KEY_ID = "b2-test-only-p256-1" as const;
const PINNED_SPKI_B64U =
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEChjf6chK4xa05betp1snbL_DipjvrXiRvSEVpKs-97s-lS6Ztymur7tf7qZ2lVAI7-M_MZ5QPwCJ4or1pidp2w" as const;

export type HumanGoRequestPacket = Readonly<{
  purpose: typeof LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE;
  humanLiveCreateGo: true;
  expectedMainSha: string;
  siteIdentity: string;
  listGuid: string;
  lifecycleEventId: string;
  lifecycleIdempotencyKey: string;
  lifecyclePayloadFingerprint: string;
  mutationBudget: Readonly<{ create: 1; retryPost: 0; update: 0; delete: 0 }>;
}>;

export type SignedReceiptPayload = HumanGoRequestPacket &
  Readonly<{
    receiptId: string;
    packetBindingDigest: string;
    issuedAt: string;
    expiresAt: string;
  }>;

export type SignedReceiptArtifact = Readonly<{
  keyId: string;
  signedPayloadB64u: string;
  signatureB64u: string;
}>;

export type LifecycleIdentity = Readonly<{
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
}>;

const VERIFIED_RECEIPT_BRAND: unique symbol = Symbol("b2-verified-trusted-receipt");
export type VerifiedTrustedReceipt = Readonly<{
  readonly [VERIFIED_RECEIPT_BRAND]: true;
  readonly payload: SignedReceiptPayload;
}>;

export type LifecycleTestOnlyRuntimeHostContext = Readonly<{
  siteIdentity: string;
  listGuid: string;
  authoritativeMainSha: string;
}>;

export function physicalSiteIdentity(
  input: Readonly<{
    hostname: string;
    siteId: string;
    webId: string;
  }>,
): string {
  return `${input.hostname},${input.siteId},${input.webId}`;
}

/** Build-time injection is required; an absent basis is deliberately unusable. */
export function getB2HarnessCodeBasisSha(): string {
  return MAIN_SHA_RE.test(B2_HARNESS_BUILD_BASIS_SHA) ? B2_HARNESS_BUILD_BASIS_SHA : "";
}

const AUTH_BRAND: unique symbol = Symbol("b2-harness-authorization");
export type LifecycleTestOnlyHarnessRunAuthorization = Readonly<{
  readonly [AUTH_BRAND]: true;
  readonly receiptId: string;
  readonly packet: HumanGoRequestPacket;
}>;

export type LifecycleTestOnlyGoGateResult =
  | Readonly<{ authorization: "NONE"; reason: string }>
  | Readonly<{ authorization: "GRANTED"; token: LifecycleTestOnlyHarnessRunAuthorization }>;

export function isLifecycleTestOnlyHarnessRunAuthorization(
  value: unknown,
): value is LifecycleTestOnlyHarnessRunAuthorization {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { [AUTH_BRAND]?: true })[AUTH_BRAND] === true
  );
}

function b64uDecode(value: string): Uint8Array | undefined {
  if (!B64U_RE.test(value)) return undefined;
  try {
    const binary = atob(
      value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4),
    );
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return undefined;
  }
}

function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function canonicalPacket(packet: HumanGoRequestPacket): string {
  const listGuid = normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid) ?? "";
  return [
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
}

/** SHA-256 binding digest, encoded as a stable lowercase hex string. */
export async function humanGoRequestPacketBindingDigest(
  packet: HumanGoRequestPacket,
): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", utf8(canonicalPacket(packet)));
  return `pkt1.${Array.from(new Uint8Array(hash), (byte) => {
    const hex = byte.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join("")}`;
}

function isPacket(value: unknown): value is HumanGoRequestPacket {
  if (typeof value !== "object" || value === null) return false;
  const packet = value as Partial<HumanGoRequestPacket>;
  const budget = packet.mutationBudget;
  return (
    packet.purpose === LIFECYCLE_TEST_ONLY_LIVE_CREATE_GO_PURPOSE &&
    packet.humanLiveCreateGo === true &&
    typeof packet.expectedMainSha === "string" &&
    MAIN_SHA_RE.test(packet.expectedMainSha) &&
    typeof packet.siteIdentity === "string" &&
    typeof packet.lifecycleEventId === "string" &&
    packet.lifecycleEventId.length > 0 &&
    typeof packet.lifecycleIdempotencyKey === "string" &&
    packet.lifecycleIdempotencyKey.length > 0 &&
    typeof packet.lifecyclePayloadFingerprint === "string" &&
    packet.lifecyclePayloadFingerprint.length > 0 &&
    typeof budget === "object" &&
    budget !== null &&
    budget.create === 1 &&
    budget.retryPost === 0 &&
    budget.update === 0 &&
    budget.delete === 0 &&
    normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid ?? "") !== undefined
  );
}

function isPayload(value: unknown): value is SignedReceiptPayload {
  if (!isPacket(value)) return false;
  const payload = value as Partial<SignedReceiptPayload>;
  return (
    typeof payload.receiptId === "string" &&
    payload.receiptId.length > 0 &&
    typeof payload.packetBindingDigest === "string" &&
    payload.packetBindingDigest.startsWith("pkt1.") &&
    typeof payload.issuedAt === "string" &&
    typeof payload.expiresAt === "string" &&
    !Number.isNaN(Date.parse(payload.issuedAt)) &&
    !Number.isNaN(Date.parse(payload.expiresAt))
  );
}

export async function verifySignedReceiptArtifact(
  artifact: unknown,
  now = new Date(),
): Promise<
  | Readonly<{ receipt: VerifiedTrustedReceipt; reason?: undefined }>
  | Readonly<{ receipt?: undefined; reason: string }>
> {
  if (typeof artifact !== "object" || artifact === null) return { reason: "artifact_malformed" };
  const value = artifact as Partial<SignedReceiptArtifact>;
  if (
    value.keyId !== PINNED_KEY_ID ||
    typeof value.signedPayloadB64u !== "string" ||
    typeof value.signatureB64u !== "string"
  )
    return { reason: "unknown_key" };
  const payloadBytes = b64uDecode(value.signedPayloadB64u);
  const signature = b64uDecode(value.signatureB64u);
  if (!payloadBytes || !signature || signature.length !== 64)
    return { reason: "artifact_encoding_invalid" };
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as unknown;
  } catch {
    return { reason: "payload_malformed" };
  }
  if (!isPayload(payload)) return { reason: "payload_malformed" };
  if (
    Date.parse(payload.issuedAt) > now.getTime() ||
    Date.parse(payload.expiresAt) <= now.getTime()
  )
    return { reason: "receipt_not_valid_now" };
  const expectedDigest = await humanGoRequestPacketBindingDigest(payload);
  if (payload.packetBindingDigest !== expectedDigest) return { reason: "packet_binding_mismatch" };
  try {
    const key = await crypto.subtle.importKey(
      "spki",
      b64uDecode(PINNED_SPKI_B64U)!,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["verify"],
    );
    if (
      !(await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        signature,
        payloadBytes,
      ))
    )
      return { reason: "signature_invalid" };
  } catch {
    return { reason: "signature_invalid" };
  }
  return { receipt: { [VERIFIED_RECEIPT_BRAND]: true, payload } };
}

export function isVerifiedTrustedReceipt(value: unknown): value is VerifiedTrustedReceipt {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { [VERIFIED_RECEIPT_BRAND]?: true })[VERIFIED_RECEIPT_BRAND] === true
  );
}

export function signedReceiptLifecycleIdentityMatches(
  packet: HumanGoRequestPacket,
  computed: LifecycleIdentity,
): boolean {
  return (
    packet.lifecycleEventId === computed.LifecycleEventId &&
    packet.lifecycleIdempotencyKey === computed.LifecycleIdempotencyKey &&
    packet.lifecyclePayloadFingerprint === computed.LifecyclePayloadFingerprint
  );
}

export async function evaluateLifecycleTestOnlyLiveCreateGo(input: {
  receipt: unknown;
  packet?: unknown;
  runtimeHost: LifecycleTestOnlyRuntimeHostContext;
  consumeStore: TrustedReceiptConsumeStore;
  now?: Date;
}): Promise<LifecycleTestOnlyGoGateResult> {
  if (!isVerifiedTrustedReceipt(input.receipt))
    return { authorization: "NONE", reason: "verified_receipt_required" };
  const packet = input.receipt.payload;
  if (input.packet !== undefined) {
    if (!isPacket(input.packet) || canonicalPacket(input.packet) !== canonicalPacket(packet))
      return { authorization: "NONE", reason: "packet_artifact_mismatch" };
  }
  if (
    packet.siteIdentity !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY ||
    input.runtimeHost.siteIdentity !== physicalSiteIdentityFromExpected(packet.siteIdentity)
  )
    return { authorization: "NONE", reason: "site_identity_mismatch" };
  if (
    normalizeProcedureRecordLifecycleEventListGuid(packet.listGuid) !==
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID ||
    normalizeProcedureRecordLifecycleEventListGuid(input.runtimeHost.listGuid) !==
      PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID
  )
    return { authorization: "NONE", reason: "list_guid_mismatch" };
  if (packet.expectedMainSha.toLowerCase() !== input.runtimeHost.authoritativeMainSha.toLowerCase())
    return { authorization: "NONE", reason: "main_sha_mismatch" };
  const entry = input.consumeStore.get(packet.receiptId);
  if (entry && entry.handle !== packet.receiptId)
    return { authorization: "NONE", reason: "receipt_handle_mismatch" };
  if (entry?.consumed) return { authorization: "NONE", reason: "receipt_already_consumed" };
  input.consumeStore.set(packet.receiptId, {
    handle: packet.receiptId,
    consumed: true,
    consumedAtIso: (input.now ?? new Date()).toISOString(),
  });
  return {
    authorization: "GRANTED",
    token: { [AUTH_BRAND]: true, receiptId: packet.receiptId, packet },
  };
}

function physicalSiteIdentityFromExpected(identity: string): string {
  return identity;
}
