import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  decodeUtf16BeHexV1,
  encodeUtf16BeHexV1,
  UTF16BE_HEX_V1_PREFIX,
} from "../../../../src/adapters/sharepoint/audit-event";

describe("UTF16BE_HEX_V1 encoding (Accepted #29)", () => {
  it("ENC-01: round-trips ASCII and non-ASCII code units without normalization", () => {
    const samples = ["synthetic-org-001", "a b", "日本語", "emoji-\u{1F600}", ""];
    for (const sample of samples) {
      const encoded = encodeUtf16BeHexV1(sample);
      assert.equal(encoded.startsWith(UTF16BE_HEX_V1_PREFIX), true);
      assert.equal(decodeUtf16BeHexV1(encoded), sample);
    }
  });

  it("ENC-02: preserves leading/trailing spaces (no trim)", () => {
    const value = " synthetic-token ";
    assert.equal(decodeUtf16BeHexV1(encodeUtf16BeHexV1(value)), value);
  });

  it("ENC-03: fail-closed on bad prefix, non-hex, and non-4-boundary", () => {
    assert.equal(decodeUtf16BeHexV1("u16h2:0061"), null);
    assert.equal(decodeUtf16BeHexV1("u16h1:006"), null);
    assert.equal(decodeUtf16BeHexV1("u16h1:006g"), null);
    assert.equal(decodeUtf16BeHexV1("u16h1:0061ZZ"), null);
  });
});
