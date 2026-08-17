"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/domain/kiosk-today-support-spfx-entry.ts
var kiosk_today_support_spfx_entry_exports = {};
__export(kiosk_today_support_spfx_entry_exports, {
  buildTodaySupportReadModel: () => buildTodaySupportReadModel,
  canStartProcedureRecordForStatus: () => canStartProcedureRecordForStatus,
  mintLifecycleEventIdentity: () => mintLifecycleEventIdentity,
  mintOccurrenceId: () => mintOccurrenceId
});
module.exports = __toCommonJS(kiosk_today_support_spfx_entry_exports);

// src/domain/sha256.ts
var K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
function rotr(value, bits) {
  return value >>> bits | value << 32 - bits;
}
function toHex(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}
function utf8Bytes(value) {
  return new TextEncoder().encode(value);
}
var SHA256_MAX_MESSAGE_BYTES = Math.floor(Number.MAX_SAFE_INTEGER / 8);
function sha256HexBytes(message) {
  const byteLength = message.length;
  if (!Number.isSafeInteger(byteLength) || byteLength < 0 || byteLength > SHA256_MAX_MESSAGE_BYTES) {
    throw new RangeError("sha256HexBytes: message length exceeds supported range (fail-closed)");
  }
  const bitLength = byteLength * 8;
  const withPaddingLength = byteLength + 9 + 63 & ~63;
  const padded = new Uint8Array(withPaddingLength);
  padded.set(message);
  padded[byteLength] = 128;
  const view = new DataView(padded.buffer);
  const high = Math.floor(bitLength / 4294967296);
  const low = bitLength >>> 0;
  view.setUint32(padded.length - 8, high, false);
  view.setUint32(padded.length - 4, low, false);
  let h0 = 1779033703;
  let h1 = 3144134277;
  let h2 = 1013904242;
  let h3 = 2773480762;
  let h4 = 1359893119;
  let h5 = 2600822924;
  let h6 = 528734635;
  let h7 = 1541459225;
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
      w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
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
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = e & f ^ ~e & g;
      const temp1 = h + S1 + ch + K[i] + w[i] >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const temp2 = S0 + maj >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    h0 = h0 + a >>> 0;
    h1 = h1 + b >>> 0;
    h2 = h2 + c >>> 0;
    h3 = h3 + d >>> 0;
    h4 = h4 + e >>> 0;
    h5 = h5 + f >>> 0;
    h6 = h6 + g >>> 0;
    h7 = h7 + h >>> 0;
  }
  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  digestView.setUint32(0, h0);
  digestView.setUint32(4, h1);
  digestView.setUint32(8, h2);
  digestView.setUint32(12, h3);
  digestView.setUint32(16, h4);
  digestView.setUint32(20, h5);
  digestView.setUint32(24, h6);
  digestView.setUint32(28, h7);
  return toHex(digest);
}
function sha256Hex(value) {
  return sha256HexBytes(utf8Bytes(value));
}

// src/domain/validation.ts
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
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  const match = isoPattern.exec(value);
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
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return false;
  }
  return !isNaN(new Date(value).getTime());
}

// src/domain/kiosk-contract.ts
var KIOSK_IDENTITY_SEPARATOR = "";
function mintOccurrenceId(input) {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.LocalDate,
    input.ScheduleItemId
  ].join(KIOSK_IDENTITY_SEPARATOR);
  return sha256Hex(`scheduled-occurrence.occurrence-id${KIOSK_IDENTITY_SEPARATOR}${material}`);
}
var PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION = "1.0.0";
function mintLifecycleEventIdentity(input) {
  var _a, _b;
  const material = [
    input.eventType,
    input.targetRecordId,
    (_a = input.replacementRecordId) != null ? _a : "",
    input.recordedAt,
    input.recordedBy,
    (_b = input.reason) != null ? _b : ""
  ].join(KIOSK_IDENTITY_SEPARATOR);
  return {
    LifecycleEventId: sha256Hex(
      `procedure-record.lifecycle-event-id${KIOSK_IDENTITY_SEPARATOR}${material}`
    ),
    LifecycleIdempotencyKey: sha256Hex(
      `procedure-record.lifecycle-idempotency-key${KIOSK_IDENTITY_SEPARATOR}${material}`
    ),
    LifecyclePayloadFingerprint: sha256Hex(
      `procedure-record.lifecycle-payload-fingerprint${KIOSK_IDENTITY_SEPARATOR}${material}`
    )
  };
}
function validateProcedureRecordLifecycleEvent(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (value.schemaVersion !== PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION || !isNonEmptyString(value.LifecycleEventId) || !isNonEmptyString(value.LifecycleIdempotencyKey) || !isNonEmptyString(value.LifecyclePayloadFingerprint) || value.eventType !== "SUPERSEDE" && value.eventType !== "CANCEL" || !isNonEmptyString(value.targetRecordId) || !isValidIsoDateTime(value.recordedAt) || !isNonEmptyString(value.recordedBy)) {
    return false;
  }
  if (value.reason !== void 0 && typeof value.reason !== "string") {
    return false;
  }
  if (value.eventType === "SUPERSEDE") {
    if (!isNonEmptyString(value.replacementRecordId) || value.targetRecordId === value.replacementRecordId) {
      return false;
    }
  } else if (value.eventType === "CANCEL") {
    if (value.replacementRecordId !== void 0) {
      return false;
    }
  }
  return true;
}
function resolveEffectiveOccurrenceState(boundRecordIds, events) {
  var _a;
  if (boundRecordIds.length === 0) {
    return { status: "UNRECORDED" };
  }
  for (const ev of events) {
    if (!validateProcedureRecordLifecycleEvent(ev)) {
      return { status: "INVALID", reason: "Invalid lifecycle event shape" };
    }
  }
  const supersedes = /* @__PURE__ */ new Map();
  const cancels = /* @__PURE__ */ new Set();
  for (const ev of events) {
    if (ev.eventType === "SUPERSEDE" && ev.replacementRecordId) {
      const existing = (_a = supersedes.get(ev.targetRecordId)) != null ? _a : [];
      existing.push(ev.replacementRecordId);
      supersedes.get(ev.targetRecordId);
      supersedes.set(ev.targetRecordId, existing);
    } else if (ev.eventType === "CANCEL") {
      cancels.add(ev.targetRecordId);
    }
  }
  for (const [targetId, replacements] of supersedes.entries()) {
    if (replacements.length > 1) {
      return {
        status: "CONFLICT",
        reason: `R5 CONFLICT: Multiple SUPERSEDE events for targetRecordId=${targetId}`
      };
    }
  }
  const effectiveRecordIds = /* @__PURE__ */ new Set();
  for (const startId of boundRecordIds) {
    let currentId = startId;
    const visited = /* @__PURE__ */ new Set();
    while (supersedes.has(currentId)) {
      if (visited.has(currentId)) {
        return {
          status: "INVALID",
          reason: `R6 INVALID: Cycle detected at RecordId=${currentId}`
        };
      }
      visited.add(currentId);
      const replacements = supersedes.get(currentId);
      currentId = replacements[0];
    }
    if (cancels.has(currentId)) {
      continue;
    }
    effectiveRecordIds.add(currentId);
  }
  if (effectiveRecordIds.size === 0) {
    return { status: "CANCELLED", targetRecordId: boundRecordIds[0] };
  }
  if (effectiveRecordIds.size > 1) {
    return {
      status: "CONFLICT",
      reason: "R5 CONFLICT: Multiple active effective records for single occurrence"
    };
  }
  const [effectiveRecordId] = Array.from(effectiveRecordIds);
  return { status: "RECORDED", effectiveRecordId };
}

// src/domain/kiosk-today-support-read-model.ts
function canStartProcedureRecordForStatus(status) {
  return status === "\u672A\u5B9F\u65BD";
}
function buildTodaySupportReadModel(input) {
  var _a, _b;
  const {
    userId,
    personLabel,
    localDate,
    scheduleItems,
    occurrences,
    bindings,
    procedureRecords,
    lifecycleEvents,
    observations
  } = input;
  const recordMap = /* @__PURE__ */ new Map();
  for (const r of procedureRecords) {
    recordMap.set(r.RecordId, r);
  }
  const observationMap = /* @__PURE__ */ new Map();
  for (const obs of observations) {
    if (obs.OccurrenceId) {
      observationMap.set(obs.OccurrenceId, obs);
    } else if (obs.RecordId) {
      observationMap.set(obs.RecordId, obs);
    }
  }
  const sortedScheduleItems = [...scheduleItems].sort((a, b) => {
    if (a.catalogOrder !== b.catalogOrder) {
      return a.catalogOrder - b.catalogOrder;
    }
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  const result = [];
  for (const sch of sortedScheduleItems) {
    const foundOcc = occurrences.find(
      (o) => o.ScheduleItemId === sch.ScheduleItemId && o.UserId === userId && o.LocalDate === localDate
    );
    const occurrenceId = (_a = foundOcc == null ? void 0 : foundOcc.OccurrenceId) != null ? _a : mintOccurrenceId({
      OrganizationId: sch.OrganizationId,
      SiteId: sch.SiteId,
      UserId: userId,
      LocalDate: localDate,
      ScheduleItemId: sch.ScheduleItemId
    });
    const occBindings = bindings.filter((b) => b.OccurrenceId === occurrenceId);
    const boundRecordIds = occBindings.map((b) => b.RecordId);
    const resolverResult = resolveEffectiveOccurrenceState(boundRecordIds, lifecycleEvents);
    let effectiveStatus;
    let boundRecord = void 0;
    if (resolverResult.status === "UNRECORDED") {
      effectiveStatus = "\u672A\u5B9F\u65BD";
    } else if (resolverResult.status === "RECORDED") {
      effectiveStatus = "\u8A18\u9332\u6E08\u307F";
      boundRecord = recordMap.get(resolverResult.effectiveRecordId);
    } else if (resolverResult.status === "CANCELLED") {
      effectiveStatus = "\u53D6\u6D88\u6E08\u307F";
      if (boundRecordIds.length > 0) {
        boundRecord = recordMap.get(boundRecordIds[0]);
      }
    } else {
      effectiveStatus = "\u78BA\u8A8D\u304C\u5FC5\u8981";
    }
    const obs = (_b = observationMap.get(occurrenceId)) != null ? _b : boundRecord ? observationMap.get(boundRecord.RecordId) : void 0;
    result.push({
      occurrenceId,
      scheduleItemId: sch.ScheduleItemId,
      scheduledTime: sch.scheduledTime,
      activityLabel: sch.activityLabel,
      catalogOrder: sch.catalogOrder,
      userId,
      personLabel,
      localDate,
      procedure: sch.Procedure,
      planId: sch.planId,
      planVersion: sch.planVersion,
      effectiveStatus,
      canStartProcedureRecord: canStartProcedureRecordForStatus(effectiveStatus),
      rawResolverResult: resolverResult,
      boundRecord,
      observation: obs
    });
  }
  return result;
}
