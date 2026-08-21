/**
 * Human Control issuer for B2 TrustedReceiptProvenanceEvidence.
 *
 * MUST NOT be imported by harness UI / composition / web part.
 * Tests and out-of-process Human Control may call this to issue evidence.
 * Harness may only verify + consume via the GO gate.
 */

import {
  humanGoRequestPacketBindingDigest,
  type HumanGoRequestPacket,
  type TrustedReceiptProvenanceEvidence,
} from "./test-only-live-create-gate";
import type { TrustedReceiptConsumeStore } from "./test-only-receipt-consume-registry";

function randomHandleSuffix(): string {
  const bytes = new Uint8Array(24);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => {
    const hex = b.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Issues opaque provenance evidence bound to the request packet digest.
 * Does not authorize POST by itself; harness must still verify + consume.
 */
export function issueLifecycleTestOnlyTrustedReceiptProvenance(input: {
  packet: HumanGoRequestPacket;
  consumeStore: TrustedReceiptConsumeStore;
}): TrustedReceiptProvenanceEvidence {
  const handle = `b2hr1.${randomHandleSuffix()}`;
  const packetBindingDigest = humanGoRequestPacketBindingDigest(input.packet);
  input.consumeStore.set(handle, {
    handle,
    packetBindingDigest,
    consumed: false,
  });
  return {
    kind: "trusted-receipt-provenance-v1",
    handle,
  };
}
