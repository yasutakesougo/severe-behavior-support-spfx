/**
 * UTF16BE_HEX_V1 reversible storage (Accepted #29 Revision 2).
 *
 * wire = "u16h1:" + 4 lowercase hex digits per JavaScript UTF-16 code unit
 * Decoder is fail-closed: no U+FFFD substitution.
 */

export const UTF16BE_HEX_V1_PREFIX = "u16h1:";

const HEX_BODY_PATTERN = /^[0-9a-f]*$/;

export function encodeUtf16BeHexV1(value: string): string {
  let body = "";
  for (let i = 0; i < value.length; i += 1) {
    body += value.charCodeAt(i).toString(16).padStart(4, "0");
  }
  return `${UTF16BE_HEX_V1_PREFIX}${body}`;
}

export function decodeUtf16BeHexV1(encoded: string): string | null {
  if (!encoded.startsWith(UTF16BE_HEX_V1_PREFIX)) {
    return null;
  }

  const body = encoded.slice(UTF16BE_HEX_V1_PREFIX.length);
  if (body.length % 4 !== 0) {
    return null;
  }
  if (!HEX_BODY_PATTERN.test(body)) {
    return null;
  }

  let out = "";
  for (let i = 0; i < body.length; i += 4) {
    const unit = Number.parseInt(body.slice(i, i + 4), 16);
    out += String.fromCharCode(unit);
  }
  return out;
}
