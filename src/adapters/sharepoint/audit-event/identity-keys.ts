/**
 * AuditEvent physical identity digests (Accepted #29 Revision 2).
 *
 * Domain tags are raw ASCII bytes (not length-prefixed UTF-16).
 * encodeJsString applies only to OrganizationId and the record/idempotency token.
 *
 * U64BE(length) is written as a full 64-bit big-endian integer.
 * Lengths outside the safe unsigned range fail closed (no silent wrap).
 */

import { sha256HexBytes } from "../../../domain/sha256";

export const AUDIT_RECORD_IDENTITY_TAG = "AUDREC1";
export const AUDIT_IDEMPOTENCY_IDENTITY_TAG = "AUDIDEM1";

/** Max JS UTF-16 code-unit length accepted by encodeJsString (U32 payload of U64BE). */
export const ENCODE_JS_STRING_MAX_UNIT_COUNT = 0xffffffff;

export class FramingLengthError extends Error {
  override readonly name = "FramingLengthError";
}

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

function writeU64Be(view: DataView, offset: number, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new FramingLengthError("U64BE length is not a safe non-negative integer (fail-closed)");
  }
  // Values above 2^53-1 are rejected above; below that, high/low split is exact.
  const high = Math.floor(value / 0x1_0000_0000);
  const low = value >>> 0;
  view.setUint32(offset, high, false);
  view.setUint32(offset + 4, low, false);
}

/**
 * encodeJsString(value) =
 *   U64BE(JS UTF-16 code-unit length) || U16BE(each code unit)
 *
 * Fail-closed when length exceeds the supported unsigned 32-bit count
 * (U64 high word would be non-zero for larger counts; JS strings cannot reach that,
 * but silent `>>> 0` wrap is prohibited).
 */
export function encodeJsString(value: string): Uint8Array {
  const unitCount = value.length;
  if (
    !Number.isSafeInteger(unitCount) ||
    unitCount < 0 ||
    unitCount > ENCODE_JS_STRING_MAX_UNIT_COUNT
  ) {
    throw new FramingLengthError(
      "encodeJsString: UTF-16 length exceeds supported U64 range (fail-closed)",
    );
  }

  const out = new Uint8Array(8 + unitCount * 2);
  const view = new DataView(out.buffer);
  writeU64Be(view, 0, unitCount);
  for (let i = 0; i < unitCount; i += 1) {
    view.setUint16(8 + i * 2, value.charCodeAt(i), false);
  }
  return out;
}

function digestIdentityKey(tag: string, organizationId: string, token: string): string | null {
  try {
    const material = concatBytes([
      asciiBytes(tag),
      encodeJsString(organizationId),
      encodeJsString(token),
    ]);
    return sha256HexBytes(material);
  } catch {
    return null;
  }
}

export function computeRecordIdentityKey(
  organizationId: string,
  auditEventId: string,
): string | null {
  return digestIdentityKey(AUDIT_RECORD_IDENTITY_TAG, organizationId, auditEventId);
}

export function computeIdempotencyIdentityKey(
  organizationId: string,
  idempotencyKey: string,
): string | null {
  return digestIdentityKey(AUDIT_IDEMPOTENCY_IDENTITY_TAG, organizationId, idempotencyKey);
}
