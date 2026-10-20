"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
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
    var step = (x) =>
      x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/adapters/sharepoint/procedure-record/spfx-read-entry.ts
var spfx_read_entry_exports = {};
__export(spfx_read_entry_exports, {
  bindProcedureRecordList: () => bindProcedureRecordList,
  createReadOnlyProcedureRecordLookup: () => createReadOnlyProcedureRecordLookup,
});
module.exports = __toCommonJS(spfx_read_entry_exports);

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
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }
  return !isNaN(new Date(value).getTime());
}

// src/adapters/sharepoint/procedure-record/physical-columns.ts
var PROCEDURE_RECORD_SCHEMA_ID = "severe-behavior-support.procedure-record.record";
var PROCEDURE_RECORD_SCHEMA_VERSION = "1.0.0";
var PROCEDURE_RECORD_DTO_VERSION = "1.0.0";
var PROCEDURE_RECORD_TIME_ZONE = "Asia/Tokyo";
var PROCEDURE_RECORD_PHYSICAL_COLUMNS = {
  recordId: "prRecordId",
  idempotencyKey: "prIdempotencyKey",
  payloadFingerprint: "prPayloadFingerprint",
  organizationId: "prOrganizationId",
  siteId: "prSiteId",
  userId: "prUserId",
  procedureId: "prProcedureId",
  procedureVersion: "prProcedureVersion",
  approvalState: "prApprovalState",
  localDate: "prLocalDate",
  planId: "prPlanId",
  planVersion: "prPlanVersion",
  result: "prResult",
  performedAt: "prPerformedAt",
  recordedAt: "prRecordedAt",
  recordedBy: "prRecordedBy",
};

// src/adapters/sharepoint/procedure-record/list-binding.ts
var SHAREPOINT_GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function normalizeSharePointGuid(value) {
  if (!isNonEmptyString(value)) {
    return null;
  }
  const normalized = value
    .trim()
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  return SHAREPOINT_GUID_RE.test(normalized) ? normalized : null;
}
function isUsableListBinding(binding) {
  return (
    isNonEmptyString(binding.organizationId) &&
    isNonEmptyString(binding.siteId) &&
    isNonEmptyString(binding.listGuid)
  );
}
function isUsableLiveListBinding(binding) {
  if (!isUsableListBinding(binding)) {
    return false;
  }
  const listGuid = normalizeSharePointGuid(binding.listGuid);
  if (listGuid === null) {
    return false;
  }
  const siteAsGuid = normalizeSharePointGuid(binding.siteId);
  if (siteAsGuid !== null && siteAsGuid === listGuid) {
    return false;
  }
  return true;
}
function bindProcedureRecordList(input) {
  const binding = {
    organizationId: input.organizationId,
    siteId: input.siteId,
    listGuid: input.listGuid,
  };
  if (!isUsableLiveListBinding(binding)) {
    return null;
  }
  const normalized = normalizeSharePointGuid(input.listGuid);
  if (normalized === null) {
    return null;
  }
  return {
    organizationId: input.organizationId,
    siteId: input.siteId,
    listGuid: normalized,
  };
}

// src/contracts/types.ts
var ASIA_TOKYO_TIME_ZONE = "Asia/Tokyo";

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
    day: "2-digit",
  }).format(instant);
  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : null;
}

// src/domain/sha256.ts
var K = new Uint32Array([
  1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
  3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
  3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
  2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
  666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
  2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
  430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
  1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
]);
var SHA256_MAX_MESSAGE_BYTES = Math.floor(Number.MAX_SAFE_INTEGER / 8);

// src/domain/procedure-record.ts
var PROCEDURE_RECORD_RESULTS = [
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED",
];
function isProcedureRecordResult(value) {
  return typeof value === "string" && PROCEDURE_RECORD_RESULTS.includes(value);
}
function isApprovedProcedureReference(value) {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isNonEmptyString(value.ProcedureId) &&
    isNonEmptyString(value.ProcedureVersion) &&
    value.ApprovalState === "APPROVED"
  );
}
function isLocalDateString(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function isoDateTimeMs(value) {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}
function validateProcedureRecord(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    value.TimeZone !== ASIA_TOKYO_TIME_ZONE ||
    !isNonEmptyString(value.RecordId) ||
    !isNonEmptyString(value.IdempotencyKey) ||
    !isNonEmptyString(value.PayloadFingerprint) ||
    !isApprovedProcedureReference(value.Procedure) ||
    !isLocalDateString(value.LocalDate) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isProcedureRecordResult(value.result) ||
    !isValidIsoDateTime(value.performedAt) ||
    !isValidIsoDateTime(value.recordedAt) ||
    !isNonEmptyString(value.recordedBy)
  ) {
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

// src/adapters/sharepoint/procedure-record/derived-envelope.ts
function getProcedureRecordDerivedEnvelope() {
  return {
    schemaId: PROCEDURE_RECORD_SCHEMA_ID,
    schemaVersion: PROCEDURE_RECORD_SCHEMA_VERSION,
    dtoVersion: PROCEDURE_RECORD_DTO_VERSION,
    TimeZone: PROCEDURE_RECORD_TIME_ZONE,
  };
}
var FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS = [
  "schemaId",
  "schemaVersion",
  "dtoVersion",
  "TimeZone",
  "Title",
];

// src/adapters/sharepoint/procedure-record/conversion.ts
function fail() {
  return { ok: false };
}
function ok(value) {
  return { ok: true, value };
}
function encodeRequiredText(value) {
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}
function decodeRequiredText(value) {
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}
function decodeRecordId(value) {
  if (typeof value !== "string") {
    return fail();
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return fail();
  }
  return ok(trimmed);
}
function encodeIsoDateTime(value) {
  if (!isValidIsoDateTime(value)) {
    return fail();
  }
  return ok(value);
}
function decodeIsoDateTime(value) {
  return encodeIsoDateTime(value);
}
function encodeLocalDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fail();
  }
  return ok(value);
}
function decodeLocalDate(value) {
  return encodeLocalDate(value);
}
function encodePlanVersion(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return fail();
  }
  return ok(String(value));
}
function decodePlanVersion(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return fail();
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== value) {
    return fail();
  }
  return ok(parsed);
}
function encodeResult(value) {
  if (!isProcedureRecordResult(value)) {
    return fail();
  }
  return ok(value);
}
function decodeResult(value) {
  return encodeResult(value);
}
function encodeApprovalState(value) {
  if (value !== "APPROVED") {
    return fail();
  }
  return ok("APPROVED");
}
function decodeApprovalState(value) {
  return encodeApprovalState(value);
}
function disagreeingDerivedField(row, key, expected) {
  if (!Object.prototype.hasOwnProperty.call(row, key)) {
    return false;
  }
  const actual = row[key];
  return actual !== expected;
}
function encodePhysicalRow(record) {
  const recordId = encodeRequiredText(record.RecordId);
  const idempotencyKey = encodeRequiredText(record.IdempotencyKey);
  const payloadFingerprint = encodeRequiredText(record.PayloadFingerprint);
  const organizationId = encodeRequiredText(record.OrganizationId);
  const siteId = encodeRequiredText(record.SiteId);
  const userId = encodeRequiredText(record.UserId);
  const procedureId = encodeRequiredText(record.Procedure.ProcedureId);
  const procedureVersion = encodeRequiredText(record.Procedure.ProcedureVersion);
  const approvalState = encodeApprovalState(record.Procedure.ApprovalState);
  const localDate = encodeLocalDate(record.LocalDate);
  const planId = encodeRequiredText(record.planId);
  const planVersion = encodePlanVersion(record.planVersion);
  const result = encodeResult(record.result);
  const performedAt = encodeIsoDateTime(record.performedAt);
  const recordedAt = encodeIsoDateTime(record.recordedAt);
  const recordedBy = encodeRequiredText(record.recordedBy);
  if (
    !recordId.ok ||
    !idempotencyKey.ok ||
    !payloadFingerprint.ok ||
    !organizationId.ok ||
    !siteId.ok ||
    !userId.ok ||
    !procedureId.ok ||
    !procedureVersion.ok ||
    !approvalState.ok ||
    !localDate.ok ||
    !planId.ok ||
    !planVersion.ok ||
    !result.ok ||
    !performedAt.ok ||
    !recordedAt.ok ||
    !recordedBy.ok
  ) {
    return { ok: false };
  }
  return {
    ok: true,
    row: {
      prRecordId: recordId.value,
      prIdempotencyKey: idempotencyKey.value,
      prPayloadFingerprint: payloadFingerprint.value,
      prOrganizationId: organizationId.value,
      prSiteId: siteId.value,
      prUserId: userId.value,
      prProcedureId: procedureId.value,
      prProcedureVersion: procedureVersion.value,
      prApprovalState: approvalState.value,
      prLocalDate: localDate.value,
      prPlanId: planId.value,
      prPlanVersion: planVersion.value,
      prResult: result.value,
      prPerformedAt: performedAt.value,
      prRecordedAt: recordedAt.value,
      prRecordedBy: recordedBy.value,
    },
  };
}
function decodePhysicalRow(row) {
  const derived = getProcedureRecordDerivedEnvelope();
  if (
    disagreeingDerivedField(row, "schemaId", derived.schemaId) ||
    disagreeingDerivedField(row, "schemaVersion", derived.schemaVersion) ||
    disagreeingDerivedField(row, "dtoVersion", derived.dtoVersion) ||
    disagreeingDerivedField(row, "TimeZone", derived.TimeZone)
  ) {
    return { ok: false };
  }
  const recordId = decodeRecordId(row.prRecordId);
  const idempotencyKey = decodeRequiredText(row.prIdempotencyKey);
  const payloadFingerprint = decodeRequiredText(row.prPayloadFingerprint);
  const organizationId = decodeRequiredText(row.prOrganizationId);
  const siteId = decodeRequiredText(row.prSiteId);
  const userId = decodeRequiredText(row.prUserId);
  const procedureId = decodeRequiredText(row.prProcedureId);
  const procedureVersion = decodeRequiredText(row.prProcedureVersion);
  const approvalState = decodeApprovalState(row.prApprovalState);
  const localDate = decodeLocalDate(row.prLocalDate);
  const planId = decodeRequiredText(row.prPlanId);
  const planVersion = decodePlanVersion(row.prPlanVersion);
  const result = decodeResult(row.prResult);
  const performedAt = decodeIsoDateTime(row.prPerformedAt);
  const recordedAt = decodeIsoDateTime(row.prRecordedAt);
  const recordedBy = decodeRequiredText(row.prRecordedBy);
  if (
    !recordId.ok ||
    !idempotencyKey.ok ||
    !payloadFingerprint.ok ||
    !organizationId.ok ||
    !siteId.ok ||
    !userId.ok ||
    !procedureId.ok ||
    !procedureVersion.ok ||
    !approvalState.ok ||
    !localDate.ok ||
    !planId.ok ||
    !planVersion.ok ||
    !result.ok ||
    !performedAt.ok ||
    !recordedAt.ok ||
    !recordedBy.ok
  ) {
    return { ok: false };
  }
  const record = {
    OrganizationId: organizationId.value,
    SiteId: siteId.value,
    UserId: userId.value,
    TimeZone: derived.TimeZone,
    RecordId: recordId.value,
    IdempotencyKey: idempotencyKey.value,
    PayloadFingerprint: payloadFingerprint.value,
    Procedure: {
      ProcedureId: procedureId.value,
      ProcedureVersion: procedureVersion.value,
      ApprovalState: approvalState.value,
    },
    LocalDate: localDate.value,
    planId: planId.value,
    planVersion: planVersion.value,
    result: result.value,
    performedAt: performedAt.value,
    recordedAt: recordedAt.value,
    recordedBy: recordedBy.value,
  };
  if (!validateProcedureRecord(record)) {
    return { ok: false };
  }
  return { ok: true, record };
}

// src/adapters/sharepoint/procedure-record/live-write-gate.ts
var LIVE_WRITE_AUTHORIZATION_BRAND = Symbol("procedure-record-live-write-authorization");
function refuseUnauthorizedLiveCreate() {
  return { status: "DEFINITE_FAILURE" };
}
function isProcedureRecordLiveWriteAuthorization(value) {
  if (typeof value !== "object" || !value) {
    return false;
  }
  return value[LIVE_WRITE_AUTHORIZATION_BRAND] === true;
}
function createProcedureRecordLiveWriteAuthorization() {
  return null;
}

// src/adapters/sharepoint/procedure-record/physical-schema.ts
var PROCEDURE_RECORD_PR_RESULT_CHOICES = PROCEDURE_RECORD_RESULTS;
var PROCEDURE_RECORD_INDEX_CANDIDATE_COLUMNS = [
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.userId,
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.localDate,
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.planId,
];
var PROCEDURE_RECORD_FORBIDDEN_COLUMN_INTERNAL_NAMES = [
  "schemaId",
  "schemaVersion",
  "dtoVersion",
  "TimeZone",
];
var UNIQUE_TEXT = {
  TypeAsString: "Text",
  Required: true,
  EnforceUniqueValues: true,
  Indexed: true,
  MaxLength: 255,
};
var REQUIRED_TEXT = {
  TypeAsString: "Text",
  Required: true,
  EnforceUniqueValues: false,
  Indexed: false,
  MaxLength: 255,
};
var PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS = [
  __spreadValues({ InternalName: "prRecordId", Title: "\u5B9F\u65BD\u8A18\u9332ID" }, UNIQUE_TEXT),
  __spreadValues(
    { InternalName: "prIdempotencyKey", Title: "\u51AA\u7B49\u30AD\u30FC" },
    UNIQUE_TEXT,
  ),
  __spreadValues(
    { InternalName: "prPayloadFingerprint", Title: "\u30DA\u30A4\u30ED\u30FC\u30C9\u6307\u7D0B" },
    REQUIRED_TEXT,
  ),
  __spreadValues({ InternalName: "prOrganizationId", Title: "\u7D44\u7E54ID" }, REQUIRED_TEXT),
  __spreadValues({ InternalName: "prSiteId", Title: "\u4E8B\u696D\u6240ID" }, REQUIRED_TEXT),
  __spreadValues({ InternalName: "prUserId", Title: "\u5229\u7528\u8005ID" }, REQUIRED_TEXT),
  __spreadValues({ InternalName: "prProcedureId", Title: "\u624B\u9806ID" }, REQUIRED_TEXT),
  __spreadValues(
    { InternalName: "prProcedureVersion", Title: "\u624B\u9806\u7248" },
    REQUIRED_TEXT,
  ),
  __spreadValues(
    { InternalName: "prApprovalState", Title: "\u627F\u8A8D\u72B6\u614B" },
    REQUIRED_TEXT,
  ),
  __spreadValues({ InternalName: "prLocalDate", Title: "\u5B9F\u65BD\u66A6\u65E5" }, REQUIRED_TEXT),
  __spreadValues({ InternalName: "prPlanId", Title: "\u8A08\u753BID" }, REQUIRED_TEXT),
  __spreadValues({ InternalName: "prPlanVersion", Title: "\u8A08\u753B\u7248" }, REQUIRED_TEXT),
  __spreadValues(
    { InternalName: "prPerformedAt", Title: "\u5B9F\u65BD\u65E5\u6642" },
    REQUIRED_TEXT,
  ),
  __spreadValues(
    { InternalName: "prRecordedAt", Title: "\u8A18\u9332\u65E5\u6642" },
    REQUIRED_TEXT,
  ),
  __spreadValues({ InternalName: "prRecordedBy", Title: "\u8A18\u9332\u8005" }, REQUIRED_TEXT),
];
function fieldByInternalName(fields, internalName) {
  return fields.find((field) => field.InternalName === internalName);
}
function sameChoices(actual, expected) {
  if (!actual || actual.length !== expected.length) {
    return false;
  }
  return expected.every((token, index) => actual[index] === token);
}
function verifyProcedureRecordPhysicalSchema(expectedListGuid, list, fields) {
  const reasons = [];
  const listGuid = normalizeSharePointGuid(list.Id);
  const expectedGuid = normalizeSharePointGuid(expectedListGuid);
  if (expectedGuid === null || listGuid !== expectedGuid) {
    reasons.push("list-guid-mismatch");
  }
  if (list.Title !== "\u652F\u63F4\u624B\u9806\u5B9F\u65BD\u8A18\u9332") {
    reasons.push("list-display-name-mismatch");
  }
  for (const expected of PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS) {
    const actual = fieldByInternalName(fields, expected.InternalName);
    if (!actual) {
      reasons.push(`missing:${expected.InternalName}`);
      continue;
    }
    if (actual.StaticName !== void 0 && actual.StaticName !== expected.InternalName) {
      reasons.push(`static-name:${expected.InternalName}`);
    }
    if (actual.Title !== expected.Title) {
      reasons.push(`display-name:${expected.InternalName}`);
    }
    if (actual.TypeAsString !== expected.TypeAsString) {
      reasons.push(`type:${expected.InternalName}`);
    }
    if (actual.Required !== expected.Required) {
      reasons.push(`required:${expected.InternalName}`);
    }
    if (actual.EnforceUniqueValues !== expected.EnforceUniqueValues) {
      reasons.push(`unique:${expected.InternalName}`);
    }
    if (actual.Indexed !== expected.Indexed) {
      reasons.push(`indexed:${expected.InternalName}`);
    }
    if (actual.MaxLength !== expected.MaxLength) {
      reasons.push(`max-length:${expected.InternalName}`);
    }
  }
  const prResult = fieldByInternalName(fields, PROCEDURE_RECORD_PHYSICAL_COLUMNS.result);
  if (!prResult) {
    reasons.push("missing:prResult");
  } else {
    if (prResult.Title !== "\u5B9F\u65BD\u7D50\u679C") {
      reasons.push("display-name:prResult");
    }
    if (prResult.TypeAsString !== "Choice") {
      reasons.push("type:prResult");
    }
    if (prResult.Required !== true) {
      reasons.push("required:prResult");
    }
    if (prResult.EnforceUniqueValues !== false) {
      reasons.push("unique:prResult");
    }
    if (prResult.Indexed !== false) {
      reasons.push("indexed:prResult");
    }
    if (prResult.FillInChoice !== false) {
      reasons.push("fill-in:prResult");
    }
    if (prResult.DefaultValue !== null && prResult.DefaultValue !== void 0) {
      reasons.push("default:prResult");
    }
    if (!sameChoices(prResult.Choices, PROCEDURE_RECORD_PR_RESULT_CHOICES)) {
      reasons.push("choices:prResult");
    }
  }
  const title = fieldByInternalName(fields, "Title");
  if (!title) {
    reasons.push("missing:Title");
  } else {
    if (title.InternalName !== "Title") {
      reasons.push("internal-name:Title");
    }
    if (title.Required !== false) {
      reasons.push("required:Title");
    }
    if (title.EnforceUniqueValues === true) {
      reasons.push("unique:Title");
    }
  }
  for (const forbidden of PROCEDURE_RECORD_FORBIDDEN_COLUMN_INTERNAL_NAMES) {
    if (fieldByInternalName(fields, forbidden)) {
      reasons.push(`forbidden-column:${forbidden}`);
    }
  }
  const uniqueFields = fields.filter(
    (field) => field.EnforceUniqueValues === true && field.Hidden !== true,
  );
  for (const field of uniqueFields) {
    if (field.InternalName !== "prRecordId" && field.InternalName !== "prIdempotencyKey") {
      reasons.push(`extra-unique:${field.InternalName}`);
    }
  }
  for (const candidate of PROCEDURE_RECORD_INDEX_CANDIDATE_COLUMNS) {
    const actual = fieldByInternalName(fields, candidate);
    if ((actual == null ? void 0 : actual.Indexed) === true) {
      reasons.push(`extra-index:${candidate}`);
    }
  }
  if (reasons.length > 0) {
    return { ok: false, reasons };
  }
  return { ok: true };
}

// src/adapters/sharepoint/procedure-record/rest-body.ts
function assertNoForbiddenKeys(fields) {
  for (const key of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      throw new Error(`forbidden SharePoint item field: ${key}`);
    }
  }
}
function buildCreateItemFields(record) {
  const encoded = encodePhysicalRow(record);
  if (!encoded.ok) {
    return { ok: false, reason: "CONVERSION_FAILED" };
  }
  const fields = {
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordId]: encoded.row.prRecordId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.idempotencyKey]: encoded.row.prIdempotencyKey,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.payloadFingerprint]: encoded.row.prPayloadFingerprint,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.organizationId]: encoded.row.prOrganizationId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.siteId]: encoded.row.prSiteId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.userId]: encoded.row.prUserId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.procedureId]: encoded.row.prProcedureId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.procedureVersion]: encoded.row.prProcedureVersion,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.approvalState]: encoded.row.prApprovalState,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.localDate]: encoded.row.prLocalDate,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.planId]: encoded.row.prPlanId,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.planVersion]: encoded.row.prPlanVersion,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.result]: encoded.row.prResult,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.performedAt]: encoded.row.prPerformedAt,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordedAt]: encoded.row.prRecordedAt,
    [PROCEDURE_RECORD_PHYSICAL_COLUMNS.recordedBy]: encoded.row.prRecordedBy,
  };
  assertNoForbiddenKeys(fields);
  return { ok: true, fields };
}

// src/adapters/sharepoint/procedure-record/read-only-repository.ts
var PHYSICAL_KEYS = [
  "prRecordId",
  "prIdempotencyKey",
  "prPayloadFingerprint",
  "prOrganizationId",
  "prSiteId",
  "prUserId",
  "prProcedureId",
  "prProcedureVersion",
  "prApprovalState",
  "prLocalDate",
  "prPlanId",
  "prPlanVersion",
  "prResult",
  "prPerformedAt",
  "prRecordedAt",
  "prRecordedBy",
];
function physicalRowFromRestItem(item) {
  const row = {};
  for (const key of PHYSICAL_KEYS) {
    row[key] = item[key];
  }
  if (typeof item.Id === "number") {
    row.ListItemId = item.Id;
  }
  if (typeof item.schemaId === "string") {
    row.schemaId = item.schemaId;
  }
  if (typeof item.schemaVersion === "string") {
    row.schemaVersion = item.schemaVersion;
  }
  if (typeof item.dtoVersion === "string") {
    row.dtoVersion = item.dtoVersion;
  }
  if (typeof item.TimeZone === "string") {
    row.TimeZone = item.TimeZone;
  }
  return row;
}
function lookupUnavailable(code) {
  if (code === "FORBIDDEN") {
    return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
  }
  return { status: "FETCH_FAILED", code };
}
function classifyRows(binding, result) {
  if (!result.ok) {
    return lookupUnavailable(result.failure);
  }
  if (result.rows.length === 0) {
    return { status: "EMPTY" };
  }
  if (result.rows.length >= 2) {
    return { status: "FETCH_FAILED", code: "MULTI_MATCH" };
  }
  const decoded = decodePhysicalRow(physicalRowFromRestItem(result.rows[0]));
  if (!decoded.ok) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  if (
    decoded.record.OrganizationId !== binding.organizationId ||
    decoded.record.SiteId !== binding.siteId
  ) {
    return { status: "FETCH_FAILED", code: "SITE_BINDING_MISMATCH" };
  }
  return { status: "FOUND", value: decoded.record };
}
function listBindingMatchesTransport(binding, transport) {
  const bindingGuid = normalizeSharePointGuid(binding.listGuid);
  const targetGuid = normalizeSharePointGuid(transport.targetListGuid);
  return bindingGuid !== null && targetGuid !== null && bindingGuid === targetGuid;
}
function mapCreateFailure(failure) {
  if (failure === "FORBIDDEN") {
    return { status: "DEFINITE_FAILURE" };
  }
  return { status: "INDETERMINATE" };
}
function createBoundProcedureRecordRepository(binding, transport, authorization) {
  function lookup(query, token) {
    return __async(this, null, function* () {
      if (!isUsableLiveListBinding(binding)) {
        return { status: "FETCH_FAILED", code: "LIST_BINDING_MISSING" };
      }
      if (!listBindingMatchesTransport(binding, transport)) {
        return { status: "FETCH_FAILED", code: "LIST_BINDING_MISMATCH" };
      }
      try {
        return classifyRows(binding, yield query(token));
      } catch (e) {
        return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
      }
    });
  }
  return {
    binding,
    liveWriteAuthorized: authorization !== null,
    findByRecordId(recordId) {
      return __async(this, null, function* () {
        return lookup((token) => transport.findByRecordId(token), recordId);
      });
    },
    findByIdempotencyKey(idempotencyKey) {
      return __async(this, null, function* () {
        return lookup((token) => transport.findByIdempotencyKey(token), idempotencyKey);
      });
    },
    create(record) {
      return __async(this, null, function* () {
        if (!isProcedureRecordLiveWriteAuthorization(authorization)) {
          return refuseUnauthorizedLiveCreate();
        }
        if (!isUsableLiveListBinding(binding)) {
          return { status: "DEFINITE_FAILURE" };
        }
        if (!listBindingMatchesTransport(binding, transport)) {
          return { status: "DEFINITE_FAILURE" };
        }
        if (record.OrganizationId !== binding.organizationId || record.SiteId !== binding.siteId) {
          return { status: "DEFINITE_FAILURE" };
        }
        try {
          const schema = yield transport.getSchema();
          if (!schema.ok) {
            return mapCreateFailure(schema.failure);
          }
          const physical = verifyProcedureRecordPhysicalSchema(
            binding.listGuid,
            schema.list,
            schema.fields,
          );
          if (!physical.ok) {
            return { status: "DEFINITE_FAILURE" };
          }
          const prepared = buildCreateItemFields(record);
          if (!prepared.ok) {
            return { status: "DEFINITE_FAILURE" };
          }
          const created = yield transport.createItem(prepared.fields);
          if (!created.ok) {
            return mapCreateFailure(created.failure);
          }
          return { status: "CREATED" };
        } catch (e) {
          return { status: "INDETERMINATE" };
        }
      });
    },
    verifyPhysicalSchema() {
      return __async(this, null, function* () {
        if (!isUsableLiveListBinding(binding)) {
          return { ok: false, reasons: ["list-binding-missing"] };
        }
        if (!listBindingMatchesTransport(binding, transport)) {
          return { ok: false, reasons: ["transport-target-mismatch"] };
        }
        try {
          const schema = yield transport.getSchema();
          if (!schema.ok) {
            return { ok: false, reasons: [`transport:${schema.failure}`] };
          }
          return verifyProcedureRecordPhysicalSchema(binding.listGuid, schema.list, schema.fields);
        } catch (e) {
          return { ok: false, reasons: ["transport:TRANSPORT_ERROR"] };
        }
      });
    },
  };
}
function createProcedureRecordRepository(binding, transport) {
  return createBoundProcedureRecordRepository(
    binding,
    transport,
    createProcedureRecordLiveWriteAuthorization(),
  );
}
function createReadOnlyProcedureRecordRepository(binding, transport) {
  return createProcedureRecordRepository(binding, transport);
}

// src/adapters/sharepoint/procedure-record/spfx-read-entry.ts
var failClosedSchema = () =>
  __async(null, null, function* () {
    return {
      ok: false,
      failure: "FORBIDDEN",
    };
  });
var failClosedRead = () =>
  __async(null, null, function* () {
    return {
      ok: false,
      failure: "FORBIDDEN",
    };
  });
var failClosedCreate = () =>
  __async(null, null, function* () {
    return {
      ok: false,
      failure: "FORBIDDEN",
    };
  });
function createReadOnlyProcedureRecordLookup(binding, transport) {
  var _a, _b;
  const internalTransport = {
    targetListGuid: transport.targetListGuid,
    getSchema: (_a = transport.getSchema) != null ? _a : failClosedSchema,
    findByRecordId: (recordId) => transport.findByRecordId(recordId),
    findByIdempotencyKey: (_b = transport.findByIdempotencyKey) != null ? _b : failClosedRead,
    createItem: failClosedCreate,
  };
  const repository = createReadOnlyProcedureRecordRepository(binding, internalTransport);
  return Object.freeze({
    binding: repository.binding,
    findByRecordId: (recordId) => repository.findByRecordId(recordId),
  });
}
