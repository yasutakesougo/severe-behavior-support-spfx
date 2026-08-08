import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUDIT_IDEMPOTENCY_IDENTITY_TAG,
  AUDIT_RECORD_IDENTITY_TAG,
  ENCODE_JS_STRING_MAX_UNIT_COUNT,
  FramingLengthError,
  computeIdempotencyIdentityKey,
  computeRecordIdentityKey,
  encodeJsString,
} from "../../../../src/adapters/sharepoint/audit-event";
import { SHA256_MAX_MESSAGE_BYTES, sha256HexBytes } from "../../../../src/domain/sha256";

function asciiBytes(value: string): Uint8Array {
  const out = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i += 1) {
    out[i] = value.charCodeAt(i);
  }
  return out;
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

describe("AuditEvent identity digests (Accepted #29)", () => {
  it("KEY-01: encodeJsString is U64BE(length) || U16BE code units", () => {
    const encoded = encodeJsString("ab");
    assert.equal(encoded.length, 8 + 4);
    assert.deepEqual([...encoded.slice(0, 8)], [0, 0, 0, 0, 0, 0, 0, 2]);
    assert.deepEqual([...encoded.slice(8)], [0x00, 0x61, 0x00, 0x62]);
  });

  it("KEY-02: record key uses raw ASCII AUDREC1 + encodeJsString(org/id)", () => {
    const org = "synthetic-org-001";
    const id = "synthetic-audit-event-001";
    const expected = sha256HexBytes(
      concat([asciiBytes(AUDIT_RECORD_IDENTITY_TAG), encodeJsString(org), encodeJsString(id)]),
    );
    assert.equal(computeRecordIdentityKey(org, id), expected);
    assert.equal(expected.length, 64);
    assert.equal(/^[0-9a-f]{64}$/.test(expected), true);
  });

  it("KEY-03: idempotency key uses raw ASCII AUDIDEM1 (not UTF-16-framed tag)", () => {
    const org = "synthetic-org-001";
    const key = "synthetic-idempotency-key-001";
    const expected = sha256HexBytes(
      concat([
        asciiBytes(AUDIT_IDEMPOTENCY_IDENTITY_TAG),
        encodeJsString(org),
        encodeJsString(key),
      ]),
    );
    assert.equal(computeIdempotencyIdentityKey(org, key), expected);

    const wronglyFramedTag = sha256HexBytes(
      concat([
        encodeJsString(AUDIT_IDEMPOTENCY_IDENTITY_TAG),
        encodeJsString(org),
        encodeJsString(key),
      ]),
    );
    assert.notEqual(expected, wronglyFramedTag);
  });

  it("KEY-04: different OrganizationId yields different digests for same token", () => {
    const token = "synthetic-audit-event-001";
    assert.notEqual(
      computeRecordIdentityKey("synthetic-org-001", token),
      computeRecordIdentityKey("synthetic-org-002", token),
    );
  });

  it("KEY-05: encodeJsString fail-closes instead of silently wrapping oversized length", () => {
    const oversized = {
      length: ENCODE_JS_STRING_MAX_UNIT_COUNT + 1,
      charCodeAt() {
        return 0x41;
      },
    } as unknown as string;

    assert.throws(() => encodeJsString(oversized), FramingLengthError);
    assert.equal(computeRecordIdentityKey(oversized, "synthetic-token"), null);
  });

  it("KEY-06: sha256HexBytes writes U64BE bit-length and fail-closes oversized messages", () => {
    const empty = sha256HexBytes(new Uint8Array(0));
    assert.equal(empty, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    const oversized = new Uint8Array(0);
    Object.defineProperty(oversized, "length", { value: SHA256_MAX_MESSAGE_BYTES + 1 });
    assert.throws(() => sha256HexBytes(oversized), RangeError);
  });
});
