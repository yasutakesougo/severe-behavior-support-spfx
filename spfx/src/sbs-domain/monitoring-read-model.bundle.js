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

// src/domain/monitoring-read-model-spfx-entry.ts
var monitoring_read_model_spfx_entry_exports = {};
__export(monitoring_read_model_spfx_entry_exports, {
  buildMonitoringReadModel: () => buildMonitoringReadModel
});
module.exports = __toCommonJS(monitoring_read_model_spfx_entry_exports);

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
function evaluateObservationPeriodMembership(periodFrom, periodTo, asOf) {
  const fromDay = toAsiaTokyoCalendarDay(periodFrom);
  const toDay = toAsiaTokyoCalendarDay(periodTo);
  const asOfDay = toAsiaTokyoCalendarDay(asOf);
  if (fromDay === null || toDay === null || asOfDay === null) {
    return "MALFORMED_INPUT";
  }
  if (fromDay > toDay) {
    return "MALFORMED_INPUT";
  }
  if (fromDay <= asOfDay && asOfDay <= toDay) {
    return "IN_PERIOD";
  }
  return "OUTSIDE_PERIOD";
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
var SHA256_MAX_MESSAGE_BYTES = Math.floor(Number.MAX_SAFE_INTEGER / 8);

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

// src/domain/monitoring-read-model.ts
var MONITORING_QUERY_KEYS = /* @__PURE__ */ new Set([
  "OrganizationId",
  "SiteId",
  "UserId",
  "planId",
  "planVersion",
  "periodStart",
  "periodEnd"
]);
function parseMonitoringQuery(value) {
  if (!isRecord(value)) {
    return null;
  }
  if (!Object.keys(value).every((key) => MONITORING_QUERY_KEYS.has(key))) {
    return null;
  }
  if (!isNonEmptyString(value.OrganizationId) || !isNonEmptyString(value.SiteId) || !isNonEmptyString(value.UserId) || !isNonEmptyString(value.planId) || typeof value.planVersion !== "number" || !Number.isInteger(value.planVersion) || value.planVersion < 1 || !isValidIsoDateTime(value.periodStart) || !isValidIsoDateTime(value.periodEnd)) {
    return null;
  }
  if (evaluateObservationPeriodMembership(value.periodStart, value.periodEnd, value.periodStart) === "MALFORMED_INPUT") {
    return null;
  }
  return {
    OrganizationId: value.OrganizationId,
    SiteId: value.SiteId,
    UserId: value.UserId,
    planId: value.planId,
    planVersion: value.planVersion,
    periodStart: value.periodStart,
    periodEnd: value.periodEnd
  };
}
function monitoringRecordItem(record) {
  return {
    RecordId: record.RecordId,
    Procedure: record.Procedure,
    result: record.result,
    performedAt: record.performedAt,
    recordedAt: record.recordedAt,
    planId: record.planId,
    planVersion: record.planVersion
  };
}
function buildMonitoringReadModel(queryInput, recordsInput) {
  const query = parseMonitoringQuery(queryInput);
  if (query === null || !Array.isArray(recordsInput)) {
    return { status: "MALFORMED_INPUT" };
  }
  const seenRecordIds = /* @__PURE__ */ new Set();
  const included = [];
  for (const candidate of recordsInput) {
    if (!validateProcedureRecord(candidate)) {
      return { status: "MALFORMED_INPUT" };
    }
    if (seenRecordIds.has(candidate.RecordId)) {
      return { status: "MALFORMED_INPUT" };
    }
    seenRecordIds.add(candidate.RecordId);
    if (candidate.OrganizationId !== query.OrganizationId || candidate.SiteId !== query.SiteId || candidate.UserId !== query.UserId || candidate.planId !== query.planId || candidate.planVersion !== query.planVersion) {
      continue;
    }
    const periodMembership = evaluateObservationPeriodMembership(
      query.periodStart,
      query.periodEnd,
      candidate.performedAt
    );
    if (periodMembership === "MALFORMED_INPUT") {
      return { status: "MALFORMED_INPUT" };
    }
    if (periodMembership === "OUTSIDE_PERIOD") {
      continue;
    }
    included.push(candidate);
  }
  included.sort((left, right) => {
    const performedOrder = Date.parse(left.performedAt) - Date.parse(right.performedAt);
    if (performedOrder !== 0) {
      return performedOrder;
    }
    return left.RecordId.localeCompare(right.RecordId);
  });
  const records = included.map(monitoringRecordItem);
  return {
    status: "RESOLVED",
    value: {
      OrganizationId: query.OrganizationId,
      SiteId: query.SiteId,
      UserId: query.UserId,
      planId: query.planId,
      planVersion: query.planVersion,
      periodStart: query.periodStart,
      periodEnd: query.periodEnd,
      recordCount: records.length,
      records
    }
  };
}
