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

// src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts
var spfx_test_harness_entry_exports = {};
__export(spfx_test_harness_entry_exports, {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID: () => PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  bindProcedureRecordLifecycleEventList: () => bindProcedureRecordLifecycleEventList,
  createProcedureRecordCancellationSharePointStoragePort: () => createProcedureRecordCancellationSharePointStoragePort,
  isUsableProcedureRecordLifecycleEventListBinding: () => isUsableProcedureRecordLifecycleEventListBinding
});
module.exports = __toCommonJS(spfx_test_harness_entry_exports);

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

// src/adapters/sharepoint/procedure-record-lifecycle-event/list-binding.ts
var SHAREPOINT_GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function normalizeLifecycleEventSharePointGuid(value) {
  if (!isNonEmptyString(value)) {
    return null;
  }
  const normalized = value.trim().replace(/^\{|\}$/g, "").toLowerCase();
  return SHAREPOINT_GUID_RE.test(normalized) ? normalized : null;
}
function isUsableProcedureRecordLifecycleEventListBinding(binding) {
  return isNonEmptyString(binding.siteIdentity) && normalizeLifecycleEventSharePointGuid(binding.listGuid) !== null;
}
function bindProcedureRecordLifecycleEventList(input) {
  const normalizedGuid = normalizeLifecycleEventSharePointGuid(input.listGuid);
  if (!isNonEmptyString(input.siteIdentity) || normalizedGuid === null) {
    return null;
  }
  return {
    siteIdentity: input.siteIdentity.trim(),
    listGuid: normalizedGuid
  };
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

// src/domain/kiosk-contract.ts
var PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION = "1.0.0";
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

// src/adapters/sharepoint/procedure-record-lifecycle-event/physical-columns.ts
var PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME = "SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS";
var PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID = "41274293-18d0-4f57-8a45-4f063522bcc7";
var PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION2 = "1.0.0";
var PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES = ["SUPERSEDE", "CANCEL"];
var PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS = {
  schemaVersion: "lifeSchemaVersion",
  lifecycleEventId: "lifeLifecycleEventId",
  lifecycleIdempotencyKey: "lifeLifecycleIdempotencyKey",
  lifecyclePayloadFingerprint: "lifeLifecyclePayloadFingerprint",
  eventType: "lifeEventType",
  targetRecordId: "lifeTargetRecordId",
  replacementRecordId: "lifeReplacementRecordId",
  recordedAt: "lifeRecordedAt",
  recordedBy: "lifeRecordedBy",
  reason: "lifeReason"
};

// src/adapters/sharepoint/procedure-record-lifecycle-event/physical-mapper.ts
var TEXT_MAX_LENGTH = 255;
function fitsText(value) {
  return value.length <= TEXT_MAX_LENGTH;
}
function readRequiredText(value) {
  return typeof value === "string" && value.length > 0 && fitsText(value) ? value : null;
}
function readOptionalText(value) {
  if (value === void 0 || value === null) {
    return { ok: true, value: void 0 };
  }
  if (typeof value !== "string" || !fitsText(value)) {
    return { ok: false };
  }
  return { ok: true, value };
}
function allPhysicalTextFits(event) {
  const values = [
    event.schemaVersion,
    event.LifecycleEventId,
    event.LifecycleIdempotencyKey,
    event.LifecyclePayloadFingerprint,
    event.eventType,
    event.targetRecordId,
    event.recordedAt,
    event.recordedBy
  ];
  if (event.replacementRecordId !== void 0) {
    values.push(event.replacementRecordId);
  }
  if (event.reason !== void 0) {
    values.push(event.reason);
  }
  return values.every(fitsText);
}
function encodeProcedureRecordLifecycleEventPhysicalRow(event) {
  if (!validateProcedureRecordLifecycleEvent(event)) {
    return { ok: false, reason: "INVALID_EVENT" };
  }
  if (!allPhysicalTextFits(event)) {
    return { ok: false, reason: "FIELD_TOO_LONG" };
  }
  const row = {
    lifeSchemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION2,
    lifeLifecycleEventId: event.LifecycleEventId,
    lifeLifecycleIdempotencyKey: event.LifecycleIdempotencyKey,
    lifeLifecyclePayloadFingerprint: event.LifecyclePayloadFingerprint,
    lifeEventType: event.eventType,
    lifeTargetRecordId: event.targetRecordId,
    lifeRecordedAt: event.recordedAt,
    lifeRecordedBy: event.recordedBy
  };
  if (event.replacementRecordId !== void 0) {
    row.lifeReplacementRecordId = event.replacementRecordId;
  }
  if (event.reason !== void 0) {
    row.lifeReason = event.reason;
  }
  return { ok: true, row };
}
function decodeProcedureRecordLifecycleEventPhysicalRow(row) {
  const schemaVersion = readRequiredText(row.lifeSchemaVersion);
  const lifecycleEventId = readRequiredText(row.lifeLifecycleEventId);
  const lifecycleIdempotencyKey = readRequiredText(row.lifeLifecycleIdempotencyKey);
  const lifecyclePayloadFingerprint = readRequiredText(row.lifeLifecyclePayloadFingerprint);
  const eventType = readRequiredText(row.lifeEventType);
  const targetRecordId = readRequiredText(row.lifeTargetRecordId);
  const recordedAt = readRequiredText(row.lifeRecordedAt);
  const recordedBy = readRequiredText(row.lifeRecordedBy);
  const replacementRecordId = readOptionalText(row.lifeReplacementRecordId);
  const reason = readOptionalText(row.lifeReason);
  if (schemaVersion !== PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION || lifecycleEventId === null || lifecycleIdempotencyKey === null || lifecyclePayloadFingerprint === null || eventType !== "SUPERSEDE" && eventType !== "CANCEL" || targetRecordId === null || recordedAt === null || recordedBy === null || !replacementRecordId.ok || !reason.ok) {
    return { ok: false, reason: "MALFORMED_PHYSICAL" };
  }
  const candidate = {
    schemaVersion: PROCEDURE_RECORD_LIFECYCLE_EVENT_SCHEMA_VERSION,
    LifecycleEventId: lifecycleEventId,
    LifecycleIdempotencyKey: lifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: lifecyclePayloadFingerprint,
    eventType,
    targetRecordId,
    recordedAt,
    recordedBy
  };
  if (replacementRecordId.value !== void 0) {
    candidate.replacementRecordId = replacementRecordId.value;
  }
  if (reason.value !== void 0) {
    candidate.reason = reason.value;
  }
  if (!validateProcedureRecordLifecycleEvent(candidate)) {
    return { ok: false, reason: "MALFORMED_PHYSICAL" };
  }
  return { ok: true, event: candidate };
}

// src/adapters/sharepoint/procedure-record-lifecycle-event/physical-schema.ts
var COLUMNS = PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS;
var PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS = [
  {
    InternalName: COLUMNS.schemaVersion,
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.lifecycleEventId,
    Required: true,
    EnforceUniqueValues: true,
    Indexed: true,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.lifecycleIdempotencyKey,
    Required: true,
    EnforceUniqueValues: true,
    Indexed: true,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.lifecyclePayloadFingerprint,
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.targetRecordId,
    Required: true,
    EnforceUniqueValues: false,
    Indexed: true,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.replacementRecordId,
    Required: false,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.recordedAt,
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.recordedBy,
    Required: true,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  },
  {
    InternalName: COLUMNS.reason,
    Required: false,
    EnforceUniqueValues: false,
    Indexed: false,
    MaxLength: 255
  }
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
function verifyProcedureRecordLifecycleEventPhysicalSchema(expectedListGuid, list, fields) {
  const reasons = [];
  const actualGuid = normalizeLifecycleEventSharePointGuid(list.Id);
  const expectedGuid = normalizeLifecycleEventSharePointGuid(expectedListGuid);
  if (expectedGuid === null || actualGuid !== expectedGuid) {
    reasons.push("list-guid-mismatch");
  }
  if (list.Title !== PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME) {
    reasons.push("list-display-name-mismatch");
  }
  for (const expected of PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS) {
    const actual = fieldByInternalName(fields, expected.InternalName);
    if (!actual) {
      reasons.push(`missing:${expected.InternalName}`);
      continue;
    }
    if (actual.StaticName !== void 0 && actual.StaticName !== expected.InternalName) {
      reasons.push(`static-name:${expected.InternalName}`);
    }
    if (actual.TypeAsString !== "Text") {
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
  const eventType = fieldByInternalName(fields, COLUMNS.eventType);
  if (!eventType) {
    reasons.push(`missing:${COLUMNS.eventType}`);
  } else {
    if (eventType.StaticName !== void 0 && eventType.StaticName !== COLUMNS.eventType) {
      reasons.push(`static-name:${COLUMNS.eventType}`);
    }
    if (eventType.TypeAsString !== "Choice") {
      reasons.push(`type:${COLUMNS.eventType}`);
    }
    if (eventType.Required !== true) {
      reasons.push(`required:${COLUMNS.eventType}`);
    }
    if (eventType.EnforceUniqueValues !== false) {
      reasons.push(`unique:${COLUMNS.eventType}`);
    }
    if (eventType.Indexed !== false) {
      reasons.push(`indexed:${COLUMNS.eventType}`);
    }
    if (eventType.FillInChoice !== false) {
      reasons.push(`fill-in:${COLUMNS.eventType}`);
    }
    if (!sameChoices(eventType.Choices, PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES)) {
      reasons.push(`choices:${COLUMNS.eventType}`);
    }
  }
  const title = fieldByInternalName(fields, "Title");
  if (!title) {
    reasons.push("missing:Title");
  } else {
    if (title.Required !== false) {
      reasons.push("required:Title");
    }
    if (title.EnforceUniqueValues === true) {
      reasons.push("unique:Title");
    }
  }
  for (const field of fields) {
    if (!field.InternalName.startsWith("life") || field.Hidden === true) {
      continue;
    }
    if (field.EnforceUniqueValues === true && field.InternalName !== COLUMNS.lifecycleEventId && field.InternalName !== COLUMNS.lifecycleIdempotencyKey) {
      reasons.push(`extra-unique:${field.InternalName}`);
    }
    if (field.Indexed === true && field.InternalName !== COLUMNS.lifecycleEventId && field.InternalName !== COLUMNS.lifecycleIdempotencyKey && field.InternalName !== COLUMNS.targetRecordId) {
      reasons.push(`extra-index:${field.InternalName}`);
    }
  }
  return reasons.length === 0 ? { ok: true } : { ok: false, reasons };
}

// src/adapters/sharepoint/procedure-record-lifecycle-event/cancellation-storage-port.ts
var PHYSICAL_KEYS = [
  "lifeSchemaVersion",
  "lifeLifecycleEventId",
  "lifeLifecycleIdempotencyKey",
  "lifeLifecyclePayloadFingerprint",
  "lifeEventType",
  "lifeTargetRecordId",
  "lifeReplacementRecordId",
  "lifeRecordedAt",
  "lifeRecordedBy",
  "lifeReason"
];
function physicalRowFromRestItem(item) {
  const row = {};
  for (const key of PHYSICAL_KEYS) {
    row[key] = item[key];
  }
  if (typeof item.Id === "number") {
    row.ListItemId = item.Id;
  }
  return row;
}
function bindingMatchesTransport(binding, transport) {
  if (binding.siteIdentity !== transport.targetSiteIdentity) {
    return "SITE_MISMATCH";
  }
  const bindingGuid = normalizeLifecycleEventSharePointGuid(binding.listGuid);
  const transportGuid = normalizeLifecycleEventSharePointGuid(transport.targetListGuid);
  if (bindingGuid === null || transportGuid === null || bindingGuid !== transportGuid) {
    return "LIST_MISMATCH";
  }
  return "MATCH";
}
function unavailableLookup(failure) {
  if (failure === "FORBIDDEN") {
    return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
  }
  return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
}
function classifySingleRow(result, expected) {
  if (!result.ok) {
    return unavailableLookup(result.failure);
  }
  if (result.rows.length === 0) {
    return { status: "EMPTY" };
  }
  if (result.rows.length > 1) {
    return { status: "FETCH_FAILED", code: "MULTI_MATCH" };
  }
  const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(
    physicalRowFromRestItem(result.rows[0])
  );
  if (!decoded.ok) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  if (expected.kind === "eventId" && decoded.event.LifecycleEventId !== expected.token || expected.kind === "idempotencyKey" && decoded.event.LifecycleIdempotencyKey !== expected.token) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  return { status: "FOUND", value: decoded.event };
}
function mapCreateFailure(result) {
  if (result.ok) {
    return { status: "CREATED" };
  }
  if (result.failure === "FORBIDDEN") {
    return { status: "DEFINITE_FAILURE" };
  }
  return { status: "INDETERMINATE" };
}
function createProcedureRecordCancellationSharePointStoragePort(binding, transport) {
  function lookup(query, expected) {
    return __async(this, null, function* () {
      if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
        return { status: "FETCH_FAILED", code: "LIST_BINDING_MISSING" };
      }
      const match = bindingMatchesTransport(binding, transport);
      if (match === "SITE_MISMATCH") {
        return { status: "FETCH_FAILED", code: "SITE_BINDING_MISMATCH" };
      }
      if (match === "LIST_MISMATCH") {
        return { status: "FETCH_FAILED", code: "LIST_BINDING_MISMATCH" };
      }
      try {
        return classifySingleRow(yield query(expected.token), expected);
      } catch (e) {
        return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
      }
    });
  }
  return {
    binding,
    liveWriteAuthorized: false,
    findByLifecycleEventId(lifecycleEventId) {
      return __async(this, null, function* () {
        return lookup((token) => transport.findByLifecycleEventId(token), {
          kind: "eventId",
          token: lifecycleEventId
        });
      });
    },
    findByLifecycleIdempotencyKey(lifecycleIdempotencyKey) {
      return __async(this, null, function* () {
        return lookup((token) => transport.findByLifecycleIdempotencyKey(token), {
          kind: "idempotencyKey",
          token: lifecycleIdempotencyKey
        });
      });
    },
    append(event) {
      return __async(this, null, function* () {
        if (!validateProcedureRecordLifecycleEvent(event) || event.eventType !== "CANCEL" || event.replacementRecordId !== void 0) {
          return { status: "DEFINITE_FAILURE" };
        }
        if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
          return { status: "DEFINITE_FAILURE" };
        }
        if (transport.liveTenantIoAuthorized !== false) {
          return { status: "DEFINITE_FAILURE" };
        }
        if (bindingMatchesTransport(binding, transport) !== "MATCH") {
          return { status: "DEFINITE_FAILURE" };
        }
        try {
          const schema = yield transport.getSchema();
          if (!schema.ok) {
            return schema.failure === "FORBIDDEN" ? { status: "DEFINITE_FAILURE" } : { status: "INDETERMINATE" };
          }
          const verified = verifyProcedureRecordLifecycleEventPhysicalSchema(
            binding.listGuid,
            schema.list,
            schema.fields
          );
          if (!verified.ok) {
            return { status: "DEFINITE_FAILURE" };
          }
          const physical = encodeProcedureRecordLifecycleEventPhysicalRow(event);
          if (!physical.ok) {
            return { status: "DEFINITE_FAILURE" };
          }
          return mapCreateFailure(yield transport.createItem(physical.row));
        } catch (e) {
          return { status: "INDETERMINATE" };
        }
      });
    },
    listByTargetRecordId(targetRecordId) {
      return __async(this, null, function* () {
        if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
          throw new Error("LIST_BINDING_MISSING");
        }
        const match = bindingMatchesTransport(binding, transport);
        if (match === "SITE_MISMATCH") {
          throw new Error("SITE_BINDING_MISMATCH");
        }
        if (match === "LIST_MISMATCH") {
          throw new Error("LIST_BINDING_MISMATCH");
        }
        let result;
        try {
          result = yield transport.listByTargetRecordId(targetRecordId);
        } catch (e) {
          throw new Error("TRANSPORT_ERROR");
        }
        if (!result.ok) {
          throw new Error(result.failure);
        }
        const events = [];
        const eventIds = /* @__PURE__ */ new Set();
        const idempotencyKeys = /* @__PURE__ */ new Set();
        for (const item of result.rows) {
          const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(
            physicalRowFromRestItem(item)
          );
          if (!decoded.ok || decoded.event.targetRecordId !== targetRecordId) {
            throw new Error("MALFORMED_PHYSICAL");
          }
          if (eventIds.has(decoded.event.LifecycleEventId) || idempotencyKeys.has(decoded.event.LifecycleIdempotencyKey)) {
            throw new Error("MULTI_MATCH");
          }
          eventIds.add(decoded.event.LifecycleEventId);
          idempotencyKeys.add(decoded.event.LifecycleIdempotencyKey);
          events.push(decoded.event);
        }
        return events.sort(
          (left, right) => left.LifecycleEventId.localeCompare(right.LifecycleEventId)
        );
      });
    },
    verifyPhysicalSchema() {
      return __async(this, null, function* () {
        if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
          return { ok: false, reasons: ["list-binding-missing"] };
        }
        const match = bindingMatchesTransport(binding, transport);
        if (match === "SITE_MISMATCH") {
          return { ok: false, reasons: ["site-binding-mismatch"] };
        }
        if (match === "LIST_MISMATCH") {
          return { ok: false, reasons: ["transport-target-mismatch"] };
        }
        try {
          const schema = yield transport.getSchema();
          if (!schema.ok) {
            return { ok: false, reasons: [`transport:${schema.failure}`] };
          }
          return verifyProcedureRecordLifecycleEventPhysicalSchema(
            binding.listGuid,
            schema.list,
            schema.fields
          );
        } catch (e) {
          return { ok: false, reasons: ["transport:TRANSPORT_ERROR"] };
        }
      });
    }
  };
}
