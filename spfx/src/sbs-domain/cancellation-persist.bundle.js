"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/domain/procedure-record-cancellation-staff-save.ts
var procedure_record_cancellation_staff_save_exports = {};
__export(procedure_record_cancellation_staff_save_exports, {
  createInMemoryProcedureRecordCancellationPersistencePort: () => createInMemoryProcedureRecordCancellationPersistencePort,
  nowAsiaTokyoIsoDateTime: () => nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCancellation: () => persistStaffProcedureRecordCancellation
});
module.exports = __toCommonJS(procedure_record_cancellation_staff_save_exports);

// src/contracts/types.ts
var ASIA_TOKYO_TIME_ZONE = "Asia/Tokyo";
var AUTHORIZED_SITE_IDS = ["SITE-ISG", "SITE-HOM"];

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

// src/domain/procedure-record-staff-save.ts
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

// src/domain/kiosk-contract.ts
var KIOSK_IDENTITY_SEPARATOR = "";
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

// src/contracts/validation.ts
var error = (code, path) => ({ code, path });
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var requiredString = (value, path) => {
  if (value === void 0 || value === null) return error("REQUIRED", path);
  if (typeof value !== "string") return error("TYPE", path);
  if (value.trim().length === 0) return error("EMPTY", path);
  return void 0;
};
var validateDeploymentContext = (value) => {
  if (!isRecord2(value)) return { ok: false, errors: [error("TYPE", "DeploymentContext")] };
  const errors = [
    requiredString(value.OrganizationId, "OrganizationId"),
    requiredString(value.SiteId, "SiteId"),
    value.TimeZone === void 0 ? error("REQUIRED", "TimeZone") : value.TimeZone !== ASIA_TOKYO_TIME_ZONE ? error("VALUE", "TimeZone") : void 0
  ].filter((item) => item !== void 0);
  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      OrganizationId: value.OrganizationId,
      SiteId: value.SiteId,
      TimeZone: ASIA_TOKYO_TIME_ZONE
    }
  };
};

// src/contracts/decisions.ts
var roles = [
  "SUPPORTER",
  "PLANNER",
  "SERVICE_MANAGER",
  "SITE_ADMIN",
  "ORG_ADMIN",
  "SYSTEM_ADMIN",
  "VIEWER"
];
var isRole = (value) => roles.includes(value);
var isRecord3 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var isAuthorizedSiteId = (value) => typeof value === "string" && AUTHORIZED_SITE_IDS.includes(value);
var isSiteMembershipShape = (value) => {
  if (!isRecord3(value)) return false;
  if (!isAuthorizedSiteId(value.SiteId)) return false;
  if (!Array.isArray(value.Roles)) return false;
  return value.Roles.every((role) => typeof role === "string");
};
var isSiteContext = (value) => {
  if (!isRecord3(value)) return false;
  if (!Array.isArray(value.Memberships)) return false;
  if (!value.Memberships.every(isSiteMembershipShape)) return false;
  if (value.SelectedSiteId !== null && typeof value.SelectedSiteId !== "string") return false;
  return true;
};
var isAuthorizationContext = (value) => {
  if (!isRecord3(value)) return false;
  if (!isNonEmptyString2(value.Subject)) return false;
  if (!isNonEmptyString2(value.UserId)) return false;
  if (!isNonEmptyString2(value.OrganizationId)) return false;
  if (!isSiteContext(value.SiteContext)) return false;
  return true;
};
var evaluateAccess = (input) => {
  if (!validateDeploymentContext(input.context).ok)
    return { decision: "DENY", reason: "INVALID_CONTEXT" };
  if (input.identity.status === "EMPTY") return { decision: "DENY", reason: "AUTH_EMPTY" };
  if (input.identity.status === "UNKNOWN") return { decision: "DENY", reason: "AUTH_UNKNOWN" };
  if (input.identity.status === "FETCH_FAILED")
    return { decision: "DENY", reason: "AUTH_FETCH_FAILED" };
  const identity = input.identity.value;
  if (!isRecord3(identity)) return { decision: "DENY", reason: "INVALID_IDENTITY" };
  const identityRoles = identity.Roles;
  if (!isNonEmptyString2(identity.Subject) || !isNonEmptyString2(identity.OrganizationId) || !isNonEmptyString2(identity.SiteId) || !Array.isArray(identityRoles)) {
    return { decision: "DENY", reason: "INVALID_IDENTITY" };
  }
  if (identity.OrganizationId !== input.context.OrganizationId) {
    return { decision: "DENY", reason: "ORGANIZATION_MISMATCH" };
  }
  if (identity.SiteId !== input.context.SiteId)
    return { decision: "DENY", reason: "SITE_MISMATCH" };
  if (!Array.isArray(input.requiredRoles) || input.requiredRoles.length === 0) {
    return { decision: "DENY", reason: "NO_REQUIRED_ROLE" };
  }
  if (!identityRoles.every(isRole) || !input.requiredRoles.every(isRole)) {
    return { decision: "DENY", reason: "UNKNOWN_ROLE" };
  }
  if (!input.requiredRoles.some((role) => identityRoles.includes(role))) {
    return { decision: "DENY", reason: "ROLE_NOT_ALLOWED" };
  }
  return { decision: "ALLOW", reason: "ROLE_ALLOWED" };
};
var evaluateAuthorizationAccess = (input) => {
  var _a;
  if (input.authorization.status === "EMPTY") return { decision: "DENY", reason: "AUTH_EMPTY" };
  if (input.authorization.status === "UNKNOWN") return { decision: "DENY", reason: "AUTH_UNKNOWN" };
  if (input.authorization.status === "FETCH_FAILED")
    return { decision: "DENY", reason: "AUTH_FETCH_FAILED" };
  const raw = input.authorization.value;
  if (!isAuthorizationContext(raw)) {
    if (!isRecord3(raw)) return { decision: "DENY", reason: "INVALID_IDENTITY" };
    if (!isNonEmptyString2(raw.Subject)) return { decision: "DENY", reason: "INVALID_IDENTITY" };
    if (!isNonEmptyString2(raw.UserId) || !isNonEmptyString2(raw.OrganizationId)) {
      return { decision: "DENY", reason: "INVALID_IDENTITY" };
    }
    return { decision: "DENY", reason: "INVALID_CONTEXT" };
  }
  const authorization = raw;
  const selectedSiteId = authorization.SiteContext.SelectedSiteId;
  if (selectedSiteId === null || selectedSiteId.trim().length === 0) {
    return { decision: "DENY", reason: "SITE_SELECTION_REQUIRED" };
  }
  if (!isAuthorizedSiteId(selectedSiteId)) {
    return { decision: "DENY", reason: "INVALID_CONTEXT" };
  }
  const membership = authorization.SiteContext.Memberships.find(
    (item) => item.SiteId === selectedSiteId
  );
  if (membership === void 0) {
    return { decision: "DENY", reason: "SITE_NOT_IN_MEMBERSHIP" };
  }
  const deploymentContext = (_a = input.context) != null ? _a : {
    OrganizationId: authorization.OrganizationId,
    SiteId: selectedSiteId,
    TimeZone: ASIA_TOKYO_TIME_ZONE
  };
  const identity = {
    Subject: authorization.Subject,
    OrganizationId: authorization.OrganizationId,
    SiteId: selectedSiteId,
    Roles: membership.Roles
  };
  return evaluateAccess({
    context: deploymentContext,
    identity: { status: "FOUND", value: identity },
    requiredRoles: input.requiredRoles
  });
};

// src/domain/procedure-record-correction.ts
var PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR = PROCEDURE_RECORD_IDENTITY_SEPARATOR;
var PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE = "procedure-record-correction.correction-id.v1";
var PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE = "procedure-record-correction.idempotency-key.v1";
function isLocalDateString2(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function isApprovedProcedureReference2(value) {
  if (!isRecord(value)) {
    return false;
  }
  return isNonEmptyString(value.ProcedureId) && isNonEmptyString(value.ProcedureVersion) && value.ApprovalState === "APPROVED";
}
function freezeProcedureRecordCorrectionPayload(material) {
  return [
    material.result,
    material.performedAt,
    material.reason,
    material.correctedAt,
    material.correctedBy
  ].join(PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR);
}
function mintProcedureRecordCorrectionIdentity(originalRecordId, frozenPayload) {
  const framed = [originalRecordId, frozenPayload].join(
    PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR
  );
  return {
    CorrectionId: sha256Hex(
      `${PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`
    ),
    IdempotencyKey: sha256Hex(
      `${PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`
    )
  };
}
function validateProcedureRecordCorrection(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.CorrectionId) || !isNonEmptyString(value.IdempotencyKey) || !isNonEmptyString(value.originalRecordId) || !isNonEmptyString(value.OrganizationId) || !isNonEmptyString(value.SiteId) || !isNonEmptyString(value.UserId) || !isApprovedProcedureReference2(value.Procedure) || !isNonEmptyString(value.planId) || typeof value.planVersion !== "number" || !Number.isInteger(value.planVersion) || value.planVersion < 1 || !isValidIsoDateTime(value.originalRecordedAt) || !isNonEmptyString(value.originalRecordedBy) || !isLocalDateString2(value.originalLocalDate) || !isProcedureRecordResult(value.result) || !isValidIsoDateTime(value.performedAt) || !isNonEmptyString(value.reason) || value.reason.trim() !== value.reason || !isValidIsoDateTime(value.correctedAt) || !isNonEmptyString(value.correctedBy)) {
    return false;
  }
  if (value.CorrectionId === value.IdempotencyKey) {
    return false;
  }
  const tokyoDay = toAsiaTokyoCalendarDay(value.performedAt);
  if (tokyoDay === null || tokyoDay !== value.originalLocalDate) {
    return false;
  }
  return true;
}
function orderProcedureRecordCorrections(corrections) {
  return [...corrections].sort((left, right) => {
    const leftInstant = Date.parse(left.correctedAt);
    const rightInstant = Date.parse(right.correctedAt);
    if (leftInstant !== rightInstant) {
      return leftInstant < rightInstant ? -1 : 1;
    }
    if (left.CorrectionId === right.CorrectionId) {
      return 0;
    }
    return left.CorrectionId < right.CorrectionId ? -1 : 1;
  });
}

// src/domain/procedure-record-cancellation.ts
var PROCEDURE_RECORD_CANCELLATION_SEMANTICS_VERSION = "1.0.0";
var PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED = false;
var PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES = [
  "SUPPORTER",
  "SERVICE_MANAGER"
];
var PROCEDURE_RECORD_CANCELLATION_SEMANTICS = {
  version: PROCEDURE_RECORD_CANCELLATION_SEMANTICS_VERSION,
  operation: "CANCEL",
  lifecycleEventType: "CANCEL",
  storage: "APPEND_ONLY_LIFECYCLE_EVENT",
  originalRecord: "IMMUTABLE",
  result: "UNCHANGED",
  replacementRecordId: "FORBIDDEN",
  reason: "REQUIRED",
  target: "CURRENT_EFFECTIVE_RECORDED_ONLY",
  effectiveStateAuthority: "OCCURRENCE_BINDING_AND_LIFECYCLE_RESOLVER",
  rolePolicy: "SUPPORTER_OR_SERVICE_MANAGER_ONLY",
  siteAuthority: "EXPLICIT_SELECTED_SITE_MEMBERSHIP",
  correctionAuthority: "VALIDATED_APPEND_ONLY_COLLECTION",
  cancelled: "DENY",
  unrecorded: "DENY",
  conflict: "DENY",
  invalid: "DENY",
  superseded: "DENY",
  historical: "DENY",
  corrected: "EFFECTIVE_CORRECTED_PROJECTION_ONLY",
  replay: "EXACT_FROZEN_CONTEXT_REPLAY_OR_CONFLICT"
};
var ALLOWED_INPUT_KEYS = /* @__PURE__ */ new Set([
  "operation",
  "targetRecordId",
  "originalRecord",
  "reason",
  "boundRecordIds",
  "lifecycleEvents",
  "corrections",
  "authorization"
]);
function hasOnlyAllowedInputKeys(value) {
  return Object.keys(value).every((key) => ALLOWED_INPUT_KEYS.has(key));
}
function hasUnsupportedControlCharacters(value) {
  return /[\u0000-\u001F\u007F-\u009F]/.test(value);
}
function requiredText(value) {
  if (!isNonEmptyString(value) || value !== value.trim() || hasUnsupportedControlCharacters(value)) {
    return null;
  }
  return value;
}
function isRecordIdCollection(value) {
  if (!Array.isArray(value)) return false;
  const seen = /* @__PURE__ */ new Set();
  for (const recordId of value) {
    if (!isNonEmptyString(recordId) || recordId !== recordId.trim() || seen.has(recordId)) {
      return false;
    }
    seen.add(recordId);
  }
  return true;
}
function sameProcedure(left, right) {
  return left.ProcedureId === right.ProcedureId && left.ProcedureVersion === right.ProcedureVersion && left.ApprovalState === right.ApprovalState;
}
function correctionMatchesOriginalRecord(correction, record) {
  return correction.originalRecordId === record.RecordId && correction.OrganizationId === record.OrganizationId && correction.SiteId === record.SiteId && correction.UserId === record.UserId && sameProcedure(correction.Procedure, record.Procedure) && correction.planId === record.planId && correction.planVersion === record.planVersion && correction.originalRecordedAt === record.recordedAt && correction.originalRecordedBy === record.recordedBy && correction.originalLocalDate === record.LocalDate;
}
function correctionIdentityMatchesPayload(correction) {
  const frozenPayload = freezeProcedureRecordCorrectionPayload({
    result: correction.result,
    performedAt: correction.performedAt,
    reason: correction.reason,
    correctedAt: correction.correctedAt,
    correctedBy: correction.correctedBy
  });
  const expected = mintProcedureRecordCorrectionIdentity(
    correction.originalRecordId,
    frozenPayload
  );
  return expected.CorrectionId === correction.CorrectionId && expected.IdempotencyKey === correction.IdempotencyKey;
}
function frozenCorrection(correction) {
  return {
    CorrectionId: correction.CorrectionId,
    IdempotencyKey: correction.IdempotencyKey,
    originalRecordId: correction.originalRecordId,
    result: correction.result,
    performedAt: correction.performedAt,
    reason: correction.reason,
    correctedAt: correction.correctedAt,
    correctedBy: correction.correctedBy
  };
}
function frozenContextFingerprint(context) {
  var _a, _b, _c;
  return sha256Hex(
    JSON.stringify([
      context.targetRecordId,
      context.originalRecordId,
      context.originalRecordFingerprint,
      context.occurrenceContextFingerprint,
      context.reason,
      context.effectiveState,
      context.occurrence,
      context.lineage,
      context.projection,
      (_a = context.correctionOriginalRecordId) != null ? _a : "",
      (_b = context.correctionId) != null ? _b : "",
      (_c = context.correction) != null ? _c : null,
      context.actorSubject,
      context.actorUserId,
      context.actorRoles,
      context.organizationId,
      context.siteId,
      context.selectedSiteId
    ])
  );
}
function originalRecordFingerprint(record) {
  return sha256Hex(
    JSON.stringify([
      record.OrganizationId,
      record.SiteId,
      record.UserId,
      record.TimeZone,
      record.RecordId,
      record.IdempotencyKey,
      record.PayloadFingerprint,
      record.Procedure,
      record.LocalDate,
      record.planId,
      record.planVersion,
      record.result,
      record.performedAt,
      record.recordedAt,
      record.recordedBy
    ])
  );
}
function occurrenceContextFingerprint(boundRecordIds, lifecycleEvents) {
  const events = lifecycleEvents.map((event) => {
    var _a, _b;
    return [
      event.LifecycleEventId,
      event.LifecycleIdempotencyKey,
      event.LifecyclePayloadFingerprint,
      event.eventType,
      event.targetRecordId,
      (_a = event.replacementRecordId) != null ? _a : "",
      event.recordedAt,
      event.recordedBy,
      (_b = event.reason) != null ? _b : ""
    ];
  }).sort((left, right) => left[0].localeCompare(right[0]));
  return sha256Hex(JSON.stringify([[...boundRecordIds].sort(), events]));
}
function invalid(reason) {
  return { status: "INVALID", reason };
}
function resolveCorrectionProjection(corrections, originalRecord) {
  const correctionIds = /* @__PURE__ */ new Set();
  const idempotencyKeys = /* @__PURE__ */ new Set();
  const validated = [];
  for (const correction of corrections) {
    if (!validateProcedureRecordCorrection(correction) || !correctionIdentityMatchesPayload(correction)) {
      return { invalid: "CORRECTION_INVALID" };
    }
    if (!correctionMatchesOriginalRecord(correction, originalRecord)) {
      return { invalid: "CORRECTION_TARGET_MISMATCH" };
    }
    if (correctionIds.has(correction.CorrectionId) || idempotencyKeys.has(correction.IdempotencyKey) || correction.CorrectionId === originalRecord.RecordId || correction.IdempotencyKey === originalRecord.RecordId) {
      return { invalid: "CORRECTION_CONFLICT" };
    }
    correctionIds.add(correction.CorrectionId);
    idempotencyKeys.add(correction.IdempotencyKey);
    validated.push(correction);
  }
  if (validated.length === 0) {
    return { projection: "ORIGINAL" };
  }
  const ordered = orderProcedureRecordCorrections(validated);
  const latest = ordered[ordered.length - 1];
  if (latest === void 0) {
    return { invalid: "CORRECTION_CONFLICT" };
  }
  return { projection: "CORRECTED_EFFECTIVE", correction: frozenCorrection(latest) };
}
function assembleProcedureRecordCancellationSemantics(value) {
  if (!isRecord(value)) return invalid("INVALID_SHAPE");
  if (!hasOnlyAllowedInputKeys(value)) return invalid("UNSUPPORTED_MUTATION_FIELD");
  if (value.operation !== "CANCEL") return invalid("INVALID_OPERATION");
  if (!isNonEmptyString(value.targetRecordId)) return invalid("INVALID_TARGET_RECORD_ID");
  if (!validateProcedureRecord(value.originalRecord)) return invalid("INVALID_ORIGINAL_RECORD");
  if (value.targetRecordId !== value.originalRecord.RecordId) {
    return invalid("TARGET_NOT_BOUND");
  }
  if (!isRecordIdCollection(value.boundRecordIds)) return invalid("INVALID_BOUND_RECORD_IDS");
  if (!Array.isArray(value.lifecycleEvents) || !Array.isArray(value.corrections)) {
    return invalid("INVALID_SHAPE");
  }
  if (!isRecord(value.authorization)) return invalid("UNAUTHORIZED");
  const boundRecordIds = value.boundRecordIds;
  const resolved = resolveEffectiveOccurrenceState(boundRecordIds, value.lifecycleEvents);
  if (resolved.status !== "RECORDED") {
    return invalid("INVALID_EFFECTIVE_STATE");
  }
  if (!boundRecordIds.includes(value.originalRecord.RecordId)) {
    return invalid("TARGET_NOT_BOUND");
  }
  if (resolved.effectiveRecordId !== value.targetRecordId) {
    return invalid("TARGET_NOT_EFFECTIVE");
  }
  const reason = requiredText(value.reason);
  if (reason === null) return invalid("REASON_REQUIRED");
  const authorization = value.authorization;
  const access = evaluateAuthorizationAccess({
    authorization,
    requiredRoles: PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES
  });
  if (access.decision !== "ALLOW" || authorization.status !== "FOUND") {
    return invalid("UNAUTHORIZED");
  }
  const selectedSiteId = authorization.value.SiteContext.SelectedSiteId;
  if (selectedSiteId === null || selectedSiteId.trim().length === 0) {
    return invalid("UNAUTHORIZED");
  }
  const selectedMembership = authorization.value.SiteContext.Memberships.find(
    (membership) => membership.SiteId === selectedSiteId
  );
  if (selectedMembership === void 0) {
    return invalid("UNAUTHORIZED");
  }
  if (authorization.value.OrganizationId !== value.originalRecord.OrganizationId || selectedSiteId !== value.originalRecord.SiteId) {
    return invalid("TARGET_CONTEXT_MISMATCH");
  }
  const correctionProjection = resolveCorrectionProjection(value.corrections, value.originalRecord);
  if ("invalid" in correctionProjection) {
    return invalid(correctionProjection.invalid);
  }
  const frozenContext = __spreadProps(__spreadValues({
    targetRecordId: value.targetRecordId,
    originalRecordId: value.originalRecord.RecordId,
    originalRecordFingerprint: originalRecordFingerprint(value.originalRecord),
    occurrenceContextFingerprint: occurrenceContextFingerprint(
      boundRecordIds,
      value.lifecycleEvents
    ),
    reason,
    // These values are derived from the resolver above; they are not client authority.
    effectiveState: "RECORDED",
    occurrence: "CURRENT",
    lineage: "CURRENT",
    projection: correctionProjection.projection
  }, correctionProjection.projection === "CORRECTED_EFFECTIVE" ? {
    correctionOriginalRecordId: correctionProjection.correction.originalRecordId,
    correctionId: correctionProjection.correction.CorrectionId,
    correction: correctionProjection.correction
  } : {}), {
    actorSubject: authorization.value.Subject,
    actorUserId: authorization.value.UserId,
    actorRoles: [...selectedMembership.Roles].sort(),
    organizationId: authorization.value.OrganizationId,
    siteId: selectedSiteId,
    selectedSiteId
  });
  const submissionFingerprint = frozenContextFingerprint(frozenContext);
  return {
    status: "VALID",
    contract: PROCEDURE_RECORD_CANCELLATION_SEMANTICS,
    operation: "CANCEL",
    lifecycleEventType: "CANCEL",
    targetRecordId: value.targetRecordId,
    originalRecord: value.originalRecord,
    reason,
    frozenContext,
    submissionFingerprint
  };
}

// src/domain/procedure-record-cancellation-event.ts
var PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED = false;
function invalid2(reason) {
  return { status: "INVALID", reason };
}
function assembleProcedureRecordCancellationLifecycleEvent(input) {
  if (!isRecord(input)) return invalid2("INVALID_SHAPE");
  if (!("semanticsInput" in input) || !("recordedAtIso" in input)) {
    return invalid2("INVALID_SHAPE");
  }
  if (Object.keys(input).some((key) => key !== "semanticsInput" && key !== "recordedAtIso")) {
    return invalid2("INVALID_SHAPE");
  }
  if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
    return invalid2("LIVE_WRITE_FORBIDDEN");
  }
  if (PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED !== false) {
    return invalid2("PERSISTENCE_NOT_AUTHORIZED");
  }
  const recordedAtIso = input.recordedAtIso;
  if (typeof recordedAtIso !== "string" || !isValidIsoDateTime(recordedAtIso)) {
    return invalid2("INVALID_RECORDED_AT");
  }
  const semantics = assembleProcedureRecordCancellationSemantics(input.semanticsInput);
  if (semantics.status !== "VALID") {
    return invalid2(semantics.reason);
  }
  const recordedBy = semantics.frozenContext.actorUserId;
  const identity = mintLifecycleEventIdentity({
    eventType: "CANCEL",
    targetRecordId: semantics.targetRecordId,
    recordedAt: recordedAtIso,
    recordedBy,
    reason: semantics.reason
  });
  const event = {
    schemaVersion: "1.0.0",
    LifecycleEventId: identity.LifecycleEventId,
    LifecycleIdempotencyKey: identity.LifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: identity.LifecyclePayloadFingerprint,
    eventType: "CANCEL",
    targetRecordId: semantics.targetRecordId,
    recordedAt: recordedAtIso,
    recordedBy,
    reason: semantics.reason
  };
  if (!validateProcedureRecordLifecycleEvent(event)) {
    return invalid2("EVENT_VALIDATION_FAILED");
  }
  if (event.replacementRecordId !== void 0) {
    return invalid2("EVENT_VALIDATION_FAILED");
  }
  return {
    status: "CREATED",
    event,
    semantics,
    submissionFingerprint: semantics.submissionFingerprint
  };
}

// src/domain/procedure-record-cancellation-persistence.ts
var PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED = false;
var CANCELLATION_DEFINITE_LOOKUP_FAILURE_CODES = [
  "MALFORMED_PHYSICAL",
  "MULTI_MATCH",
  "SITE_BINDING_MISMATCH",
  "LIST_BINDING_MISSING",
  "LIST_BINDING_MISMATCH",
  "INVALID_LOOKUP_RESULT"
];
function isCancellationDefiniteLookupFailureCode(code) {
  return CANCELLATION_DEFINITE_LOOKUP_FAILURE_CODES.includes(code);
}
function copyProcedureRecordLifecycleEvent(event) {
  return __spreadValues(__spreadProps(__spreadValues({
    schemaVersion: event.schemaVersion,
    LifecycleEventId: event.LifecycleEventId,
    LifecycleIdempotencyKey: event.LifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: event.LifecyclePayloadFingerprint,
    eventType: event.eventType,
    targetRecordId: event.targetRecordId
  }, event.replacementRecordId === void 0 ? {} : { replacementRecordId: event.replacementRecordId }), {
    recordedAt: event.recordedAt,
    recordedBy: event.recordedBy
  }), event.reason === void 0 ? {} : { reason: event.reason });
}
function sameCancellationEvent(left, right) {
  return left.schemaVersion === right.schemaVersion && left.LifecycleEventId === right.LifecycleEventId && left.LifecycleIdempotencyKey === right.LifecycleIdempotencyKey && left.LifecyclePayloadFingerprint === right.LifecyclePayloadFingerprint && left.eventType === right.eventType && left.targetRecordId === right.targetRecordId && left.replacementRecordId === right.replacementRecordId && left.recordedAt === right.recordedAt && left.recordedBy === right.recordedBy && left.reason === right.reason;
}
function isCancelLifecycleEvent(value) {
  return validateProcedureRecordLifecycleEvent(value) && value.eventType === "CANCEL" && value.replacementRecordId === void 0;
}
function isLookupResult(value) {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }
  if (value.status === "EMPTY") {
    return true;
  }
  if (value.status === "FOUND") {
    return isCancelLifecycleEvent(value.value);
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
  return result.status === "FETCH_FAILED" && isCancellationDefiniteLookupFailureCode(result.code);
}
function isIndeterminateLookupFailure(result) {
  if (result.status === "UNKNOWN") {
    return result.reason === "INDETERMINATE";
  }
  return result.status === "FETCH_FAILED" && !isCancellationDefiniteLookupFailureCode(result.code);
}
function classifyProcedureRecordCancellationLookups(incoming, byLifecycleEventId, byLifecycleIdempotencyKey) {
  if (isDefiniteLookupFailure(byLifecycleEventId) || isDefiniteLookupFailure(byLifecycleIdempotencyKey)) {
    return { kind: "DEFINITE_FAILURE" };
  }
  if (isIndeterminateLookupFailure(byLifecycleEventId) || isIndeterminateLookupFailure(byLifecycleIdempotencyKey)) {
    return {
      kind: "LOOKUP_UNAVAILABLE",
      reason: byLifecycleEventId.status === "UNKNOWN" || byLifecycleIdempotencyKey.status === "UNKNOWN" ? "UNKNOWN" : "FETCH_FAILED"
    };
  }
  if (byLifecycleEventId.status === "EMPTY" && byLifecycleIdempotencyKey.status === "EMPTY") {
    return { kind: "ACCEPT_NEW" };
  }
  if (byLifecycleEventId.status !== "FOUND" || byLifecycleIdempotencyKey.status !== "FOUND") {
    return { kind: "CONFLICT" };
  }
  if (!sameCancellationEvent(byLifecycleEventId.value, byLifecycleIdempotencyKey.value)) {
    return { kind: "CONFLICT" };
  }
  const persisted = byLifecycleEventId.value;
  if (sameCancellationEvent(persisted, incoming)) {
    return { kind: "REPLAY", persisted };
  }
  return { kind: "CONFLICT" };
}
function savedAfterGetByLifecycleEventId(incoming, storage) {
  return __async(this, null, function* () {
    const readBack = yield performLookup(
      () => storage.findByLifecycleEventId(incoming.LifecycleEventId)
    );
    if (isDefiniteLookupFailure(readBack)) {
      return "save_failed";
    }
    if (readBack.status === "UNKNOWN" || readBack.status === "FETCH_FAILED") {
      return "save_outcome_unknown";
    }
    if (readBack.status !== "FOUND") {
      return "save_outcome_unknown";
    }
    if (!sameCancellationEvent(incoming, readBack.value)) {
      return "save_failed";
    }
    return "saved";
  });
}
function reconcileAfterUnknown(incoming, storage) {
  return __async(this, null, function* () {
    const [byLifecycleEventId, byLifecycleIdempotencyKey] = yield Promise.all([
      performLookup(() => storage.findByLifecycleEventId(incoming.LifecycleEventId)),
      performLookup(() => storage.findByLifecycleIdempotencyKey(incoming.LifecycleIdempotencyKey))
    ]);
    const classified = classifyProcedureRecordCancellationLookups(
      incoming,
      byLifecycleEventId,
      byLifecycleIdempotencyKey
    );
    if (classified.kind === "REPLAY") {
      return savedAfterGetByLifecycleEventId(incoming, storage);
    }
    if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
      return "save_failed";
    }
    return "save_outcome_unknown";
  });
}
function persistProcedureRecordCancellation(event, storage) {
  return __async(this, null, function* () {
    if (!isCancelLifecycleEvent(event)) {
      return { saveState: "save_failed", appendCalled: false };
    }
    if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
      return { saveState: "save_failed", appendCalled: false };
    }
    if (PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED !== false) {
      return { saveState: "save_failed", appendCalled: false };
    }
    const [byLifecycleEventId, byLifecycleIdempotencyKey] = yield Promise.all([
      performLookup(() => storage.findByLifecycleEventId(event.LifecycleEventId)),
      performLookup(() => storage.findByLifecycleIdempotencyKey(event.LifecycleIdempotencyKey))
    ]);
    const classified = classifyProcedureRecordCancellationLookups(
      event,
      byLifecycleEventId,
      byLifecycleIdempotencyKey
    );
    if (classified.kind === "LOOKUP_UNAVAILABLE") {
      return { saveState: "save_outcome_unknown", appendCalled: false };
    }
    if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
      return { saveState: "save_failed", appendCalled: false };
    }
    if (classified.kind === "REPLAY") {
      return {
        saveState: yield savedAfterGetByLifecycleEventId(event, storage),
        appendCalled: false
      };
    }
    const created = yield storage.append(event);
    if (created.status === "DEFINITE_FAILURE") {
      return { saveState: "save_failed", appendCalled: true };
    }
    if (created.status === "INDETERMINATE") {
      return {
        saveState: yield reconcileAfterUnknown(event, storage),
        appendCalled: true
      };
    }
    return {
      saveState: yield savedAfterGetByLifecycleEventId(event, storage),
      appendCalled: true
    };
  });
}
function createInMemoryProcedureRecordCancellationStoragePort(options = {}) {
  var _a;
  const byLifecycleEventId = /* @__PURE__ */ new Map();
  const byLifecycleIdempotencyKey = /* @__PURE__ */ new Map();
  const state = {
    appendCalls: 0,
    appendMode: (_a = options.appendMode) != null ? _a : "created"
  };
  return {
    byLifecycleEventId,
    byLifecycleIdempotencyKey,
    get appendCalls() {
      return state.appendCalls;
    },
    set appendCalls(value) {
      state.appendCalls = value;
    },
    get appendMode() {
      return state.appendMode;
    },
    set appendMode(value) {
      state.appendMode = value;
    },
    findByLifecycleEventId(lifecycleEventId) {
      return __async(this, null, function* () {
        const found = byLifecycleEventId.get(lifecycleEventId);
        if (found === void 0) {
          return { status: "EMPTY" };
        }
        return { status: "FOUND", value: copyProcedureRecordLifecycleEvent(found) };
      });
    },
    findByLifecycleIdempotencyKey(lifecycleIdempotencyKey) {
      return __async(this, null, function* () {
        const found = byLifecycleIdempotencyKey.get(lifecycleIdempotencyKey);
        if (found === void 0) {
          return { status: "EMPTY" };
        }
        return { status: "FOUND", value: copyProcedureRecordLifecycleEvent(found) };
      });
    },
    append(event) {
      return __async(this, null, function* () {
        state.appendCalls += 1;
        if (state.appendMode === "definite_failure") {
          return { status: "DEFINITE_FAILURE" };
        }
        if (state.appendMode === "indeterminate") {
          return { status: "INDETERMINATE" };
        }
        if (state.appendMode === "created_without_readback") {
          return { status: "CREATED" };
        }
        const stored = copyProcedureRecordLifecycleEvent(event);
        byLifecycleEventId.set(stored.LifecycleEventId, stored);
        byLifecycleIdempotencyKey.set(stored.LifecycleIdempotencyKey, stored);
        return { status: "CREATED" };
      });
    },
    listByTargetRecordId(targetRecordId) {
      return __async(this, null, function* () {
        return [...byLifecycleEventId.values()].filter((item) => item.targetRecordId === targetRecordId).map((item) => copyProcedureRecordLifecycleEvent(item)).sort((left, right) => left.LifecycleEventId.localeCompare(right.LifecycleEventId));
      });
    }
  };
}
function createProcedureRecordCancellationPersistencePort(storage) {
  return {
    liveWriteAuthorized: PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED,
    submitCancellation(request) {
      return __async(this, null, function* () {
        if (PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED !== false) {
          return { saveState: "save_failed", event: null, appendCalled: false };
        }
        if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
          return { saveState: "save_failed", event: null, appendCalled: false };
        }
        const assembled = assembleProcedureRecordCancellationLifecycleEvent({
          semanticsInput: request.semanticsInput,
          recordedAtIso: request.recordedAtIso
        });
        if (assembled.status !== "CREATED") {
          return { saveState: "save_failed", event: null, appendCalled: false };
        }
        const persisted = yield persistProcedureRecordCancellation(assembled.event, storage);
        return {
          saveState: persisted.saveState,
          event: assembled.event,
          appendCalled: persisted.appendCalled
        };
      });
    },
    listCancellations(targetRecordId) {
      return __async(this, null, function* () {
        const events = yield storage.listByTargetRecordId(targetRecordId);
        return {
          targetRecordId,
          events: events.map((item) => copyProcedureRecordLifecycleEvent(item))
        };
      });
    }
  };
}
function createInMemoryProcedureRecordCancellationPersistencePort(options = {}) {
  const storage = createInMemoryProcedureRecordCancellationStoragePort(options);
  const port = createProcedureRecordCancellationPersistencePort(storage);
  return Object.assign(port, { storage });
}

// src/domain/procedure-record-cancellation-staff-save.ts
function persistStaffProcedureRecordCancellation(input, port) {
  return __async(this, null, function* () {
    const recordedAt = isNonEmptyString(input.recordedAtIso) ? input.recordedAtIso : input.nowIso;
    if (!isValidIsoDateTime(recordedAt)) {
      return { saveState: "save_failed", event: null, appendCalled: false };
    }
    const result = yield port.submitCancellation({
      semanticsInput: input.semanticsInput,
      recordedAtIso: recordedAt
    });
    return {
      saveState: result.saveState,
      event: result.event,
      appendCalled: result.appendCalled
    };
  });
}
