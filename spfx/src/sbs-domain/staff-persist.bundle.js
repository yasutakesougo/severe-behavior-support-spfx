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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/domain/procedure-record-staff-save.ts
var procedure_record_staff_save_exports = {};
__export(procedure_record_staff_save_exports, {
  asiaTokyoDateTimeLocalToIso: () => asiaTokyoDateTimeLocalToIso,
  assembleProcedureRecordForCreate: () => assembleProcedureRecordForCreate,
  createLiveWriteHoldProcedureRecordPersistencePort: () => createLiveWriteHoldProcedureRecordPersistencePort,
  formatInstantAsAsiaTokyoIsoDateTime: () => formatInstantAsAsiaTokyoIsoDateTime,
  nowAsiaTokyoIsoDateTime: () => nowAsiaTokyoIsoDateTime,
  persistProcedureRecord: () => persistProcedureRecord,
  persistStaffProcedureRecord: () => persistStaffProcedureRecord
});
module.exports = __toCommonJS(procedure_record_staff_save_exports);

// src/contracts/types.ts
var ASIA_TOKYO_TIME_ZONE = "Asia/Tokyo";

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

// src/domain/support-plan.ts
var TOKYO_TIME_ZONE = "Asia/Tokyo";
function toAsiaTokyoCalendarDay(isoDateTime) {
  if (!isValidIsoDateTime(isoDateTime)) {
    return null;
  }
  const instant = new Date(isoDateTime);
  if (Number.isNaN(instant.getTime())) {
    return null;
  }
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(instant);
  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : null;
}

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

// src/domain/procedure-record.ts
var PROCEDURE_RECORD_RESULTS = [
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED"
];
function isProcedureRecordResult(value) {
  return typeof value === "string" && PROCEDURE_RECORD_RESULTS.includes(value);
}
function isApprovedProcedureReference(value) {
  if (!isRecord(value)) {
    return false;
  }
  return isNonEmptyString(value.ProcedureId) && isNonEmptyString(value.ProcedureVersion) && value.ApprovalState === "APPROVED";
}
function isLocalDateString(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function isoDateTimeMs(value) {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}
var PROCEDURE_RECORD_IDENTITY_SEPARATOR = "";
function computeProcedureRecordPayloadFingerprint(material) {
  return sha256Hex(
    [
      material.planId,
      String(material.planVersion),
      material.ProcedureId,
      material.ProcedureVersion,
      material.result,
      material.performedAt,
      material.recordedAt,
      material.recordedBy
    ].join(PROCEDURE_RECORD_IDENTITY_SEPARATOR)
  );
}
function mintProcedureRecordIdentity(input) {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.planVersion),
    input.ProcedureId,
    input.ProcedureVersion,
    input.result,
    input.performedAt,
    input.recordedAt,
    input.recordedBy
  ].join(PROCEDURE_RECORD_IDENTITY_SEPARATOR);
  return {
    RecordId: sha256Hex(
      `procedure-record.record-id${PROCEDURE_RECORD_IDENTITY_SEPARATOR}${material}`
    ),
    IdempotencyKey: sha256Hex(
      `procedure-record.idempotency-key${PROCEDURE_RECORD_IDENTITY_SEPARATOR}${material}`
    )
  };
}
function validateProcedureRecord(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.OrganizationId) || !isNonEmptyString(value.SiteId) || !isNonEmptyString(value.UserId) || value.TimeZone !== ASIA_TOKYO_TIME_ZONE || !isNonEmptyString(value.RecordId) || !isNonEmptyString(value.IdempotencyKey) || !isNonEmptyString(value.PayloadFingerprint) || !isApprovedProcedureReference(value.Procedure) || !isLocalDateString(value.LocalDate) || !isNonEmptyString(value.planId) || typeof value.planVersion !== "number" || !Number.isInteger(value.planVersion) || value.planVersion < 1 || !isProcedureRecordResult(value.result) || !isValidIsoDateTime(value.performedAt) || !isValidIsoDateTime(value.recordedAt) || !isNonEmptyString(value.recordedBy)) {
    return false;
  }
  const performedMs = isoDateTimeMs(value.performedAt);
  const recordedMs = isoDateTimeMs(value.recordedAt);
  if (performedMs === null || recordedMs === null || recordedMs < performedMs) {
    return false;
  }
  const tokyoDay = toAsiaTokyoCalendarDay(value.performedAt);
  if (tokyoDay === null || value.LocalDate !== tokyoDay) {
    return false;
  }
  return true;
}

// src/domain/procedure-record-persistence.ts
function createLiveWriteHoldProcedureRecordPersistencePort() {
  return {
    findByRecordId: () => __async(null, null, function* () {
      return { status: "EMPTY" };
    }),
    findByIdempotencyKey: () => __async(null, null, function* () {
      return { status: "EMPTY" };
    }),
    create: () => __async(null, null, function* () {
      return { status: "DEFINITE_FAILURE" };
    })
  };
}
var DEFINITE_LOOKUP_FAILURE_CODES = [
  "MALFORMED_PHYSICAL",
  "MULTI_MATCH",
  "SITE_BINDING_MISMATCH",
  "LIST_BINDING_MISSING",
  "LIST_BINDING_MISMATCH",
  "INVALID_LOOKUP_RESULT"
];
function isDefiniteLookupFailureCode(code) {
  return DEFINITE_LOOKUP_FAILURE_CODES.includes(code);
}
var IMMUTABLE_CONTEXT_FIELDS = [
  "OrganizationId",
  "SiteId",
  "UserId",
  "RecordId",
  "IdempotencyKey",
  "planId",
  "planVersion",
  "result",
  "performedAt",
  "recordedAt",
  "recordedBy",
  "LocalDate",
  "PayloadFingerprint"
];
function sameProcedure(left, right) {
  return left.ProcedureId === right.ProcedureId && left.ProcedureVersion === right.ProcedureVersion && left.ApprovalState === right.ApprovalState;
}
function sameProcedureRecord(left, right) {
  return IMMUTABLE_CONTEXT_FIELDS.every((field) => left[field] === right[field]) && sameProcedure(left.Procedure, right.Procedure) && left.TimeZone === right.TimeZone;
}
function isLookupResult(value) {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }
  if (value.status === "EMPTY") {
    return true;
  }
  if (value.status === "FOUND") {
    return validateProcedureRecord(value.value);
  }
  if (value.status === "UNKNOWN") {
    return value.reason === "NOT_AUTHENTICATED" || value.reason === "NOT_AUTHORIZED" || value.reason === "INDETERMINATE";
  }
  if (value.status === "FETCH_FAILED") {
    return typeof value.code === "string";
  }
  return false;
}
function performLookup(lookup) {
  return __async(this, null, function* () {
    try {
      const result = yield lookup();
      if (!isLookupResult(result)) {
        return { status: "FETCH_FAILED", code: "INVALID_LOOKUP_RESULT" };
      }
      return result;
    } catch (e) {
      return { status: "FETCH_FAILED", code: "LOOKUP_THREW" };
    }
  });
}
function isDefiniteLookupFailure(result) {
  if (result.status === "UNKNOWN") {
    return result.reason === "NOT_AUTHORIZED" || result.reason === "NOT_AUTHENTICATED";
  }
  return result.status === "FETCH_FAILED" && isDefiniteLookupFailureCode(result.code);
}
function isIndeterminateLookupFailure(result) {
  if (result.status === "UNKNOWN") {
    return result.reason === "INDETERMINATE";
  }
  return result.status === "FETCH_FAILED" && !isDefiniteLookupFailureCode(result.code);
}
function classifyProcedureRecordLookups(incoming, byRecordId, byIdempotencyKey) {
  if (isDefiniteLookupFailure(byRecordId) || isDefiniteLookupFailure(byIdempotencyKey)) {
    return { kind: "DEFINITE_FAILURE" };
  }
  if (isIndeterminateLookupFailure(byRecordId) || isIndeterminateLookupFailure(byIdempotencyKey)) {
    return {
      kind: "LOOKUP_UNAVAILABLE",
      reason: byRecordId.status === "UNKNOWN" || byIdempotencyKey.status === "UNKNOWN" ? "UNKNOWN" : "FETCH_FAILED"
    };
  }
  if (byRecordId.status === "EMPTY" && byIdempotencyKey.status === "EMPTY") {
    return { kind: "ACCEPT_NEW" };
  }
  if (byRecordId.status !== "FOUND" || byIdempotencyKey.status !== "FOUND") {
    return { kind: "CONFLICT" };
  }
  if (!sameProcedureRecord(byRecordId.value, byIdempotencyKey.value)) {
    return { kind: "CONFLICT" };
  }
  const persisted = byRecordId.value;
  if (sameProcedureRecord(persisted, incoming)) {
    return { kind: "REPLAY", persisted };
  }
  return { kind: "CONFLICT" };
}
function matchesSavedReadBack(incoming, persisted) {
  return persisted.RecordId === incoming.RecordId && persisted.planId === incoming.planId && persisted.planVersion === incoming.planVersion && sameProcedure(persisted.Procedure, incoming.Procedure) && persisted.result === incoming.result && persisted.performedAt === incoming.performedAt && persisted.recordedAt === incoming.recordedAt && persisted.OrganizationId === incoming.OrganizationId && persisted.SiteId === incoming.SiteId;
}
function savedAfterGetByRecordId(incoming, port) {
  return __async(this, null, function* () {
    const readBack = yield performLookup(() => port.findByRecordId(incoming.RecordId));
    if (isDefiniteLookupFailure(readBack)) {
      return "save_failed";
    }
    if (readBack.status === "UNKNOWN" || readBack.status === "FETCH_FAILED") {
      return "save_outcome_unknown";
    }
    if (readBack.status !== "FOUND") {
      return "save_outcome_unknown";
    }
    if (!matchesSavedReadBack(incoming, readBack.value)) {
      return "save_failed";
    }
    return "saved";
  });
}
function reconcileAfterUnknown(incoming, port) {
  return __async(this, null, function* () {
    const [byRecordId, byIdempotencyKey] = yield Promise.all([
      performLookup(() => port.findByRecordId(incoming.RecordId)),
      performLookup(() => port.findByIdempotencyKey(incoming.IdempotencyKey))
    ]);
    const classified = classifyProcedureRecordLookups(incoming, byRecordId, byIdempotencyKey);
    if (classified.kind === "REPLAY") {
      return savedAfterGetByRecordId(incoming, port);
    }
    if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
      return "save_failed";
    }
    return "save_outcome_unknown";
  });
}
function persistProcedureRecord(record, port) {
  return __async(this, null, function* () {
    if (!validateProcedureRecord(record)) {
      return "save_failed";
    }
    const [byRecordId, byIdempotencyKey] = yield Promise.all([
      performLookup(() => port.findByRecordId(record.RecordId)),
      performLookup(() => port.findByIdempotencyKey(record.IdempotencyKey))
    ]);
    const classified = classifyProcedureRecordLookups(record, byRecordId, byIdempotencyKey);
    if (classified.kind === "LOOKUP_UNAVAILABLE") {
      return "save_outcome_unknown";
    }
    if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
      return "save_failed";
    }
    if (classified.kind === "REPLAY") {
      return savedAfterGetByRecordId(record, port);
    }
    const created = yield port.create(record);
    if (created.status === "DEFINITE_FAILURE") {
      return "save_failed";
    }
    if (created.status === "INDETERMINATE") {
      return reconcileAfterUnknown(record, port);
    }
    return savedAfterGetByRecordId(record, port);
  });
}

// src/domain/procedure-record-staff-save.ts
var DATETIME_LOCAL_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/;
function asiaTokyoDateTimeLocalToIso(local) {
  var _a;
  if (!isNonEmptyString(local)) {
    return null;
  }
  const match = DATETIME_LOCAL_RE.exec(local.trim());
  if (!match) {
    return null;
  }
  const seconds = (_a = match[3]) != null ? _a : "00";
  const iso = `${match[1]}T${match[2]}:${seconds}+09:00`;
  return isValidIsoDateTime(iso) ? iso : null;
}
function formatInstantAsAsiaTokyoIsoDateTime(instant) {
  if (Number.isNaN(instant.getTime())) {
    return null;
  }
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: ASIA_TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(instant);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: ASIA_TOKYO_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(instant);
  const iso = `${datePart}T${timePart}+09:00`;
  return isValidIsoDateTime(iso) ? iso : null;
}
function nowAsiaTokyoIsoDateTime() {
  return formatInstantAsAsiaTokyoIsoDateTime(/* @__PURE__ */ new Date());
}
function hasUnsupportedControlCharacters(value) {
  return /[\u0000-\u001F\u007F-\u009F]/.test(value);
}
function requiredIdentity(value) {
  if (!isNonEmptyString(value) || value !== value.trim() || hasUnsupportedControlCharacters(value)) {
    return null;
  }
  return value;
}
function assembleProcedureRecordForCreate(input) {
  const organizationId = requiredIdentity(input.OrganizationId);
  const siteId = requiredIdentity(input.SiteId);
  const userId = requiredIdentity(input.UserId);
  const recordedBy = requiredIdentity(input.recordedBy);
  const planId = requiredIdentity(input.planId);
  const procedureId = requiredIdentity(input.ProcedureId);
  const procedureVersion = requiredIdentity(input.ProcedureVersion);
  if (organizationId === null || siteId === null || userId === null || recordedBy === null || planId === null || procedureId === null || procedureVersion === null || !Number.isInteger(input.planVersion) || input.planVersion < 1 || !isProcedureRecordResult(input.result)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }
  const performedAt = asiaTokyoDateTimeLocalToIso(input.performedAtLocal);
  const recordedAt = isNonEmptyString(input.recordedAtIso) ? input.recordedAtIso : input.nowIso;
  if (performedAt === null || !isValidIsoDateTime(recordedAt)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }
  const localDate = toAsiaTokyoCalendarDay(performedAt);
  if (localDate === null) {
    return { ok: false, reason: "INVALID_INPUT" };
  }
  const identity = mintProcedureRecordIdentity({
    OrganizationId: organizationId,
    SiteId: siteId,
    UserId: userId,
    planId,
    planVersion: input.planVersion,
    ProcedureId: procedureId,
    ProcedureVersion: procedureVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy
  });
  const fingerprintMaterial = {
    planId,
    planVersion: input.planVersion,
    ProcedureId: procedureId,
    ProcedureVersion: procedureVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy
  };
  const record = {
    OrganizationId: organizationId,
    SiteId: siteId,
    UserId: userId,
    TimeZone: ASIA_TOKYO_TIME_ZONE,
    RecordId: identity.RecordId,
    IdempotencyKey: identity.IdempotencyKey,
    PayloadFingerprint: computeProcedureRecordPayloadFingerprint(fingerprintMaterial),
    Procedure: {
      ProcedureId: procedureId,
      ProcedureVersion: procedureVersion,
      ApprovalState: "APPROVED"
    },
    LocalDate: localDate,
    planId,
    planVersion: input.planVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy
  };
  if (!validateProcedureRecord(record)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }
  return { ok: true, record };
}
function persistStaffProcedureRecord(input, port) {
  return __async(this, null, function* () {
    const assembled = assembleProcedureRecordForCreate(input);
    if (!assembled.ok) {
      return { saveState: "save_failed", record: null, persistCalled: false };
    }
    const saveState = yield persistProcedureRecord(assembled.record, port);
    return { saveState, record: assembled.record, persistCalled: true };
  });
}
