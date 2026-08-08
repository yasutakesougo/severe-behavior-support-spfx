/**
 * AuditEvent physical identity digests (Accepted #29 Revision 2).
 *
 * Domain tags are raw ASCII bytes (not length-prefixed UTF-16).
 * encodeJsString applies only to OrganizationId and the record/idempotency token.
 */

import { sha256HexBytes } from "../../../domain/sha256";

export const AUDIT_RECORD_IDENTITY_TAG = "AUDREC1";
export const AUDIT_IDEMPOTENCY_IDENTITY_TAG = "AUDIDEM1";

function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  let total = 0;
  for (const part of parts) {
    total += part.length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function asciiBytes(value: string): Uint8Array {
  const out = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code > 0x7f) {
      throw new Error("asciiBytes expects ASCII");
    }
    out[i] = code;
  }
  return out;
}

/**
 * encodeJsString(value) =
 *   U64BE(JS UTF-16 code-unit length) || U16BE(each code unit)
 */
export function encodeJsString(value: string): Uint8Array {
  const unitCount = value.length;
  const out = new Uint8Array(8 + unitCount * 2);
  const view = new DataView(out.buffer);
  // Practical token lengths fit in 32 bits; high word stays 0.
  view.setUint32(0, 0, false);
  view.setUint32(4, unitCount >>> 0, false);
  for (let i = 0; i < unitCount; i += 1) {
    view.setUint16(8 + i * 2, value.charCodeAt(i), false);
  }
  return out;
}

function digestIdentityKey(tag: string, organizationId: string, token: string): string {
  const material = concatBytes([
    asciiBytes(tag),
    encodeJsString(organizationId),
    encodeJsString(token),
  ]);
  return sha256HexBytes(material);
}

export function computeRecordIdentityKey(organizationId: string, auditEventId: string): string {
  return digestIdentityKey(AUDIT_RECORD_IDENTITY_TAG, organizationId, auditEventId);
}

export function computeIdempotencyIdentityKey(
  organizationId: string,
  idempotencyKey: string,
): string {
  return digestIdentityKey(AUDIT_IDEMPOTENCY_IDENTITY_TAG, organizationId, idempotencyKey);
}
