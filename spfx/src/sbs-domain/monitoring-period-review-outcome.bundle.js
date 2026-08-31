"use strict";
// Generated narrow bridge for src/domain/monitoring-period-review-outcome-spfx-entry.ts.
// Canonical implementation remains under src/domain; this bundle grants no write authority.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID =
  "severe-behavior-support.monitoring-period-review.outcome";
exports.MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION = "1.0.0";
exports.MONITORING_PERIOD_REVIEW_OUTCOME_LIVE_WRITE_AUTHORIZED = false;
exports.MONITORING_PERIOD_REVIEW_DECISIONS = ["NO_CHANGE", "CHANGE_REQUIRED"];
const ID_SEPARATOR = "\u001f";
const ID_NAMESPACE = "monitoring-period-review.outcome-id.v1";
const TOKYO_TIME_ZONE = "Asia/Tokyo";
// prettier-ignore
const K = new Uint32Array([
  0x428a2f98,
  0x71374491,
  0xb5c0fbcf,
  0xe9b5dba5,
  0x3956c25b,
  0x59f111f1,
  0x923f82a4,
  0xab1c5ed5,
  0xd807aa98,
  0x12835b01,
  0x243185be,
  0x550c7dc3,
  0x72be5d74,
  0x80deb1fe,
  0x9bdc06a7,
  0xc19bf174,
  0xe49b69c1,
  0xefbe4786,
  0x0fc19dc6,
  0x240ca1cc,
  0x2de92c6f,
  0x4a7484aa,
  0x5cb0a9dc,
  0x76f988da,
  0x983e5152,
  0xa831c66d,
  0xb00327c8,
  0xbf597fc7,
  0xc6e00bf3,
  0xd5a79147,
  0x06ca6351,
  0x14292967,
  0x27b70a85,
  0x2e1b2138,
  0x4d2c6dfc,
  0x53380d13,
  0x650a7354,
  0x766a0abb,
  0x81c2c92e,
  0x92722c85,
  0xa2bfe8a1,
  0xa81a664b,
  0xc24b8b70,
  0xc76c51a3,
  0xd192e819,
  0xd6990624,
  0xf40e3585,
  0x106aa070,
  0x19a4c116,
  0x1e376c08,
  0x2748774c,
  0x34b0bcb5,
  0x391c0cb3,
  0x4ed8aa4a,
  0x5b9cca4f,
  0x682e6ff3,
  0x748f82ee,
  0x78a5636f,
  0x84c87814,
  0x8cc70208,
  0x90befffa,
  0xa4506ceb,
  0xbef9a3f7,
  0xc67178f2,
]);

function rotr(value, bits) {
  return (value >>> bits) | (value << (32 - bits));
}

function utf8Bytes(value) {
  return new TextEncoder().encode(value);
}

function sha256Hex(value) {
  const message = utf8Bytes(value);
  const byteLength = message.length;
  if (
    !Number.isSafeInteger(byteLength) ||
    byteLength < 0 ||
    byteLength > Math.floor(Number.MAX_SAFE_INTEGER / 8)
  ) {
    throw new RangeError("sha256HexBytes: message length exceeds supported range (fail-closed)");
  }

  const bitLength = byteLength * 8;
  const withPaddingLength = (byteLength + 9 + 63) & ~63;
  const padded = new Uint8Array(withPaddingLength);
  padded.set(message);
  padded[byteLength] = 0x80;

  const view = new DataView(padded.buffer);
  const high = Math.floor(bitLength / 0x100000000);
  const low = bitLength >>> 0;
  view.setUint32(padded.length - 8, high, false);
  view.setUint32(padded.length - 4, low, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const w = new Uint32Array(64);

  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i += 1) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + K[i] + w[i]) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  [h0, h1, h2, h3, h4, h5, h6, h7].forEach((item, index) => digestView.setUint32(index * 4, item));

  let out = "";
  for (let i = 0; i < digest.length; i += 1) {
    out += digest[i].toString(16).padStart(2, "0");
  }
  return out;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidIsoDateTime(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.exec(
    value,
  );
  if (!match) {
    return false;
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }
  return !isNaN(new Date(value).getTime());
}

function toAsiaTokyoCalendarDay(value) {
  if (!isValidIsoDateTime(value)) {
    return null;
  }
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) {
    return null;
  }
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : null;
}

function isWellFormedReviewPeriod(start, end) {
  const from = toAsiaTokyoCalendarDay(start);
  const to = toAsiaTokyoCalendarDay(end);
  return from !== null && to !== null && from <= to;
}

function isUniqueStringArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  const seen = new Set();
  for (const item of value) {
    if (!isNonEmptyString(item) || seen.has(item)) {
      return false;
    }
    seen.add(item);
  }
  return true;
}

function isDecision(value) {
  return typeof value === "string" && exports.MONITORING_PERIOD_REVIEW_DECISIONS.includes(value);
}

function mintMonitoringPeriodReviewOutcomeId(input) {
  const ids = [...input.sourceRecordIds].sort();
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.planVersion),
    input.periodStart,
    input.periodEnd,
    ids.join(ID_SEPARATOR),
    input.decision,
    input.reviewedAt,
    input.reviewedBy,
  ].join(ID_SEPARATOR);
  return sha256Hex(`${ID_NAMESPACE}${ID_SEPARATOR}${material}`);
}

function validateMonitoringPeriodReviewOutcome(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.OutcomeId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isValidIsoDateTime(value.periodStart) ||
    !isValidIsoDateTime(value.periodEnd) ||
    !isUniqueStringArray(value.sourceRecordIds) ||
    !isDecision(value.decision) ||
    !isValidIsoDateTime(value.reviewedAt) ||
    !isNonEmptyString(value.reviewedBy)
  ) {
    return false;
  }
  return isWellFormedReviewPeriod(value.periodStart, value.periodEnd);
}

function validateMonitoringPeriodReviewOutcomeDto(value) {
  return (
    isRecord(value) &&
    value.schemaId === exports.MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_ID &&
    value.schemaVersion === exports.MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION &&
    value.dtoVersion === exports.MONITORING_PERIOD_REVIEW_OUTCOME_SCHEMA_VERSION &&
    validateMonitoringPeriodReviewOutcome(value.data)
  );
}

exports.mintMonitoringPeriodReviewOutcomeId = mintMonitoringPeriodReviewOutcomeId;
exports.validateMonitoringPeriodReviewOutcome = validateMonitoringPeriodReviewOutcome;
exports.validateMonitoringPeriodReviewOutcomeDto = validateMonitoringPeriodReviewOutcomeDto;
