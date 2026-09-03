"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// src/domain/support-plan-revision-spfx-entry.ts
var support_plan_revision_spfx_entry_exports = {};
__export(support_plan_revision_spfx_entry_exports, {
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED: () => SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
  startSupportPlanRevision: () => startSupportPlanRevision,
});
module.exports = __toCommonJS(support_plan_revision_spfx_entry_exports);

// src/domain/validation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function isReasonCode(value) {
  return typeof value === "string" && /^[A-Z][A-Z0-9_]{1,63}$/.test(value);
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

// src/domain/monitoring-period-review-decision-reason.ts
function validateMonitoringPeriodReviewDecisionReason(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.OutcomeId) &&
    isNonEmptyString(value.reason) &&
    value.reason === value.reason.trim()
  );
}

// src/domain/support-plan.ts
var SUPPORT_PLAN_STATUSES = ["Draft", "PendingReview", "Returned", "Active", "Closed"];
function validateSupportPlan(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (
    typeof value.PlanId !== "string" ||
    value.PlanId.trim() === "" ||
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.currentVersion !== "number" ||
    !Number.isInteger(value.currentVersion) ||
    value.currentVersion < 1 ||
    typeof value.createdBy !== "string" ||
    value.createdBy.trim() === "" ||
    !isValidIsoDateTime(value.createdAt) ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    return false;
  }
  if (value.reviewDueDate !== void 0 && !isValidIsoDateTime(value.reviewDueDate)) {
    return false;
  }
  const status = value.status;
  if (!SUPPORT_PLAN_STATUSES.includes(status)) {
    return false;
  }
  const hasSubBy = value.submittedBy !== void 0;
  const hasSubAt = value.submittedAt !== void 0;
  if (hasSubBy !== hasSubAt) {
    return false;
  }
  if (hasSubBy) {
    if (!isNonEmptyString(value.submittedBy) || !isValidIsoDateTime(value.submittedAt)) {
      return false;
    }
  }
  const hasRetBy = value.returnedBy !== void 0;
  const hasRetAt = value.returnedAt !== void 0;
  const hasRetCode = value.returnReasonCode !== void 0;
  const hasRetText = value.returnReasonText !== void 0;
  if (hasRetText && !(hasRetBy && hasRetAt && hasRetCode)) {
    return false;
  }
  if (hasRetBy || hasRetAt || hasRetCode) {
    if (!(hasRetBy && hasRetAt && hasRetCode)) {
      return false;
    }
    if (
      !isNonEmptyString(value.returnedBy) ||
      !isValidIsoDateTime(value.returnedAt) ||
      !isReasonCode(value.returnReasonCode)
    ) {
      return false;
    }
    if (hasRetText && !isNonEmptyString(value.returnReasonText)) {
      return false;
    }
  }
  if (status === "Draft") {
    if (
      hasSubBy ||
      hasRetBy ||
      value.approvedBy !== void 0 ||
      value.approvedAt !== void 0 ||
      value.effectiveFrom !== void 0 ||
      value.effectiveTo !== void 0 ||
      value.closedBy !== void 0 ||
      value.closedAt !== void 0 ||
      value.closeReasonCode !== void 0 ||
      value.closeReasonText !== void 0
    ) {
      return false;
    }
  } else if (status === "PendingReview") {
    if (!hasSubBy) {
      return false;
    }
    if (
      hasRetBy ||
      value.approvedBy !== void 0 ||
      value.approvedAt !== void 0 ||
      value.effectiveFrom !== void 0 ||
      value.effectiveTo !== void 0 ||
      value.closedBy !== void 0 ||
      value.closedAt !== void 0 ||
      value.closeReasonCode !== void 0 ||
      value.closeReasonText !== void 0
    ) {
      return false;
    }
  } else if (status === "Returned") {
    if (!hasSubBy || !hasRetBy) {
      return false;
    }
    if (
      value.approvedBy !== void 0 ||
      value.approvedAt !== void 0 ||
      value.effectiveFrom !== void 0 ||
      value.effectiveTo !== void 0 ||
      value.closedBy !== void 0 ||
      value.closedAt !== void 0 ||
      value.closeReasonCode !== void 0 ||
      value.closeReasonText !== void 0
    ) {
      return false;
    }
  } else if (status === "Active") {
    if (!hasSubBy) {
      return false;
    }
    if (
      !isNonEmptyString(value.approvedBy) ||
      !isValidIsoDateTime(value.approvedAt) ||
      !isValidIsoDateTime(value.effectiveFrom)
    ) {
      return false;
    }
    if (value.effectiveTo !== void 0 && !isValidIsoDateTime(value.effectiveTo)) {
      return false;
    }
    if (
      value.effectiveTo !== void 0 &&
      new Date(value.effectiveTo).getTime() < new Date(value.effectiveFrom).getTime()
    ) {
      return false;
    }
    if (
      value.closedBy !== void 0 ||
      value.closedAt !== void 0 ||
      value.closeReasonCode !== void 0 ||
      value.closeReasonText !== void 0
    ) {
      return false;
    }
  } else if (status === "Closed") {
    if (!hasSubBy) {
      return false;
    }
    if (
      !isNonEmptyString(value.approvedBy) ||
      !isValidIsoDateTime(value.approvedAt) ||
      !isValidIsoDateTime(value.effectiveFrom) ||
      !isValidIsoDateTime(value.effectiveTo) ||
      !isNonEmptyString(value.closedBy) ||
      !isValidIsoDateTime(value.closedAt) ||
      !isReasonCode(value.closeReasonCode)
    ) {
      return false;
    }
    if (value.closeReasonText !== void 0 && !isNonEmptyString(value.closeReasonText)) {
      return false;
    }
    if (new Date(value.effectiveTo).getTime() < new Date(value.effectiveFrom).getTime()) {
      return false;
    }
  }
  return true;
}
function validateSupportPlanVersion(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (
    typeof value.planId !== "string" ||
    value.planId.trim() === "" ||
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1 ||
    !Array.isArray(value.goals) ||
    !Array.isArray(value.supportMethods) ||
    !Array.isArray(value.precautions) ||
    !Array.isArray(value.reviewCriteria) ||
    typeof value.versionCreatedBy !== "string" ||
    value.versionCreatedBy.trim() === "" ||
    !isValidIsoDateTime(value.versionCreatedAt)
  ) {
    return false;
  }
  const isStringArray = (arr) =>
    arr.every((item) => typeof item === "string" && item.trim() !== "");
  if (
    !isStringArray(value.goals) ||
    !isStringArray(value.supportMethods) ||
    !isStringArray(value.precautions) ||
    !isStringArray(value.reviewCriteria)
  ) {
    return false;
  }
  return true;
}
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
  1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
  3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
  3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
  2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
  666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
  2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
  430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
  1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
]);
function rotr(value, bits) {
  return (value >>> bits) | (value << (32 - bits));
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
  if (
    !Number.isSafeInteger(byteLength) ||
    byteLength < 0 ||
    byteLength > SHA256_MAX_MESSAGE_BYTES
  ) {
    throw new RangeError("sha256HexBytes: message length exceeds supported range (fail-closed)");
  }
  const bitLength = byteLength * 8;
  const withPaddingLength = (byteLength + 9 + 63) & ~63;
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
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
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

// src/domain/monitoring-period-review-outcome.ts
var MONITORING_PERIOD_REVIEW_DECISIONS = ["NO_CHANGE", "CHANGE_REQUIRED"];
function isMonitoringPeriodReviewDecision(value) {
  return typeof value === "string" && MONITORING_PERIOD_REVIEW_DECISIONS.includes(value);
}
function isUniqueStringArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  const seen = /* @__PURE__ */ new Set();
  for (const item of value) {
    if (!isNonEmptyString(item) || seen.has(item)) {
      return false;
    }
    seen.add(item);
  }
  return true;
}
function isWellFormedReviewPeriod(periodStart, periodEnd) {
  return (
    evaluateObservationPeriodMembership(periodStart, periodEnd, periodStart) !== "MALFORMED_INPUT"
  );
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
    !isMonitoringPeriodReviewDecision(value.decision) ||
    !isValidIsoDateTime(value.reviewedAt) ||
    !isNonEmptyString(value.reviewedBy)
  ) {
    return false;
  }
  return isWellFormedReviewPeriod(value.periodStart, value.periodEnd);
}

// src/domain/support-plan-version-monitoring-period-review-binding.ts
function validateSupportPlanVersionMonitoringPeriodReviewBinding(value) {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isNonEmptyString(value.OrganizationId) &&
    isNonEmptyString(value.SiteId) &&
    isNonEmptyString(value.UserId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    typeof value.reviewedPlanVersion === "number" &&
    Number.isInteger(value.reviewedPlanVersion) &&
    value.reviewedPlanVersion >= 1 &&
    value.planVersion > value.reviewedPlanVersion &&
    isNonEmptyString(value.sourceOutcomeId) &&
    isValidIsoDateTime(value.boundAt) &&
    isNonEmptyString(value.boundBy)
  );
}

// src/domain/support-plan-revision.ts
var SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED = false;
var REVISION_INTENT_ID_SEPARATOR = "";
var REVISION_INTENT_ID_NAMESPACE = "support-plan.revision-intent-id.v1";
function samePlanContext(plan, version) {
  return (
    plan.PlanId === version.planId &&
    plan.OrganizationId === version.OrganizationId &&
    plan.SiteId === version.SiteId &&
    plan.UserId === version.UserId
  );
}
function outcomeMatchesSource(outcome, sourceVersion) {
  return (
    outcome.OrganizationId === sourceVersion.OrganizationId &&
    outcome.SiteId === sourceVersion.SiteId &&
    outcome.UserId === sourceVersion.UserId &&
    outcome.planId === sourceVersion.planId &&
    outcome.planVersion === sourceVersion.version
  );
}
function mintRevisionIntentId(input) {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.sourcePlanVersion),
    input.sourceReviewOutcomeId,
  ].join(REVISION_INTENT_ID_SEPARATOR);
  return sha256Hex(`${REVISION_INTENT_ID_NAMESPACE}${REVISION_INTENT_ID_SEPARATOR}${material}`);
}
function validateRevisionIntent(value) {
  if (!isRecord(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.RevisionIntentId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isNonEmptyString(value.planId) ||
    typeof value.sourcePlanVersion !== "number" ||
    !Number.isInteger(value.sourcePlanVersion) ||
    value.sourcePlanVersion < 1 ||
    !isNonEmptyString(value.sourceReviewOutcomeId) ||
    !isValidIsoDateTime(value.createdAt) ||
    !isNonEmptyString(value.createdBy) ||
    (value.status !== "OPEN" && value.status !== "CONSUMED")
  ) {
    return false;
  }
  return (
    value.RevisionIntentId ===
    mintRevisionIntentId({
      OrganizationId: value.OrganizationId,
      SiteId: value.SiteId,
      UserId: value.UserId,
      planId: value.planId,
      sourcePlanVersion: value.sourcePlanVersion,
      sourceReviewOutcomeId: value.sourceReviewOutcomeId,
    })
  );
}
function validateSupportPlanRevisionDraftCandidate(value) {
  if (!isRecord(value) || !isNonEmptyString(value.RevisionIntentId)) {
    return false;
  }
  return (
    validateSupportPlanVersion(value.candidate) &&
    validateSupportPlanVersionMonitoringPeriodReviewBinding(value.reviewBinding)
  );
}
function revisionDraftMatchesIntent(draft, intent) {
  if (!validateSupportPlanRevisionDraftCandidate(draft) || !validateRevisionIntent(intent)) {
    return false;
  }
  const { candidate, reviewBinding } = draft;
  return (
    draft.RevisionIntentId === intent.RevisionIntentId &&
    candidate.OrganizationId === intent.OrganizationId &&
    candidate.SiteId === intent.SiteId &&
    candidate.UserId === intent.UserId &&
    candidate.planId === intent.planId &&
    candidate.version === intent.sourcePlanVersion + 1 &&
    reviewBinding.OrganizationId === intent.OrganizationId &&
    reviewBinding.SiteId === intent.SiteId &&
    reviewBinding.UserId === intent.UserId &&
    reviewBinding.planId === intent.planId &&
    reviewBinding.planVersion === candidate.version &&
    reviewBinding.reviewedPlanVersion === intent.sourcePlanVersion &&
    reviewBinding.sourceOutcomeId === intent.sourceReviewOutcomeId
  );
}
function createRevisionIntent(input) {
  const { currentPlan, sourceVersion, sourceOutcome, sourceDecisionReason } = input;
  if (
    !validateSupportPlan(currentPlan) ||
    !validateSupportPlanVersion(sourceVersion) ||
    !validateMonitoringPeriodReviewOutcome(sourceOutcome) ||
    !validateMonitoringPeriodReviewDecisionReason(sourceDecisionReason) ||
    !isNonEmptyString(input.createdBy) ||
    !isValidIsoDateTime(input.createdAt)
  ) {
    return { status: "INVALID", reason: "MALFORMED_INPUT" };
  }
  if (
    !samePlanContext(currentPlan, sourceVersion) ||
    !outcomeMatchesSource(sourceOutcome, sourceVersion)
  ) {
    return { status: "INVALID", reason: "CONTEXT_MISMATCH" };
  }
  if (currentPlan.currentVersion !== sourceVersion.version) {
    return { status: "INVALID", reason: "STALE_SOURCE_PLAN_VERSION" };
  }
  if (sourceOutcome.decision !== "CHANGE_REQUIRED") {
    return { status: "INVALID", reason: "REVIEW_DOES_NOT_REQUIRE_CHANGE" };
  }
  if (
    sourceDecisionReason.OutcomeId !== sourceOutcome.OutcomeId ||
    sourceDecisionReason.reason.trim().length === 0
  ) {
    return { status: "INVALID", reason: "MISSING_OR_MISMATCHED_DECISION_REASON" };
  }
  const identity = {
    OrganizationId: sourceOutcome.OrganizationId,
    SiteId: sourceOutcome.SiteId,
    UserId: sourceOutcome.UserId,
    planId: sourceOutcome.planId,
    sourcePlanVersion: sourceOutcome.planVersion,
    sourceReviewOutcomeId: sourceOutcome.OutcomeId,
  };
  const intent = __spreadProps(
    __spreadValues(
      {
        RevisionIntentId: mintRevisionIntentId(identity),
      },
      identity,
    ),
    {
      createdAt: input.createdAt,
      createdBy: input.createdBy,
      status: "OPEN",
    },
  );
  return validateRevisionIntent(intent)
    ? { status: "CREATED", intent }
    : { status: "INVALID", reason: "INVALID_REVISION_INTENT" };
}
function consumeRevisionIntentToDraft(input) {
  const { intent, sourceVersion, sourceOutcome } = input;
  if (
    !validateRevisionIntent(intent) ||
    !validateSupportPlanVersion(sourceVersion) ||
    !validateMonitoringPeriodReviewOutcome(sourceOutcome) ||
    !isNonEmptyString(input.draftCreatedBy) ||
    !isValidIsoDateTime(input.draftCreatedAt)
  ) {
    return { status: "INVALID", reason: "MALFORMED_INPUT" };
  }
  if (intent.status !== "OPEN") {
    return { status: "INVALID", reason: "INTENT_NOT_OPEN" };
  }
  if (
    intent.OrganizationId !== sourceVersion.OrganizationId ||
    intent.SiteId !== sourceVersion.SiteId ||
    intent.UserId !== sourceVersion.UserId ||
    intent.planId !== sourceVersion.planId ||
    intent.sourcePlanVersion !== sourceVersion.version ||
    intent.sourceReviewOutcomeId !== sourceOutcome.OutcomeId ||
    !outcomeMatchesSource(sourceOutcome, sourceVersion) ||
    sourceOutcome.decision !== "CHANGE_REQUIRED"
  ) {
    return { status: "INVALID", reason: "SOURCE_BINDING_MISMATCH" };
  }
  const priorDrafts = input.existingDrafts.filter(
    (draft2) =>
      validateSupportPlanRevisionDraftCandidate(draft2) &&
      draft2.RevisionIntentId === intent.RevisionIntentId,
  );
  if (priorDrafts.length > 0) {
    return { status: "HOLD", intent, reason: "REVISION_ALREADY_STARTED" };
  }
  const targetVersion = intent.sourcePlanVersion + 1;
  const versionConflict = input.existingVersions.some(
    (version) =>
      validateSupportPlanVersion(version) &&
      version.OrganizationId === intent.OrganizationId &&
      version.SiteId === intent.SiteId &&
      version.UserId === intent.UserId &&
      version.planId === intent.planId &&
      version.version === targetVersion,
  );
  if (versionConflict) {
    return { status: "HOLD", intent, reason: "TARGET_VERSION_CONFLICT" };
  }
  const candidate = {
    planId: sourceVersion.planId,
    OrganizationId: sourceVersion.OrganizationId,
    SiteId: sourceVersion.SiteId,
    UserId: sourceVersion.UserId,
    version: targetVersion,
    goals: [...sourceVersion.goals],
    supportMethods: [...sourceVersion.supportMethods],
    precautions: [...sourceVersion.precautions],
    reviewCriteria: [...sourceVersion.reviewCriteria],
    versionCreatedBy: input.draftCreatedBy,
    versionCreatedAt: input.draftCreatedAt,
  };
  const reviewBinding = {
    OrganizationId: intent.OrganizationId,
    SiteId: intent.SiteId,
    UserId: intent.UserId,
    planId: intent.planId,
    planVersion: targetVersion,
    reviewedPlanVersion: intent.sourcePlanVersion,
    sourceOutcomeId: intent.sourceReviewOutcomeId,
    boundAt: input.draftCreatedAt,
    boundBy: input.draftCreatedBy,
  };
  const consumedIntent = __spreadProps(__spreadValues({}, intent), { status: "CONSUMED" });
  const draft = {
    RevisionIntentId: intent.RevisionIntentId,
    candidate,
    reviewBinding,
  };
  if (
    !validateSupportPlanVersion(candidate) ||
    !validateSupportPlanVersionMonitoringPeriodReviewBinding(reviewBinding) ||
    !validateRevisionIntent(consumedIntent) ||
    !revisionDraftMatchesIntent(draft, consumedIntent)
  ) {
    return { status: "INVALID", reason: "INVALID_DRAFT_AGGREGATE" };
  }
  return { status: "CREATED", intent: consumedIntent, draft };
}
function startSupportPlanRevision(input) {
  const created = createRevisionIntent({
    currentPlan: input.currentPlan,
    sourceVersion: input.sourceVersion,
    sourceOutcome: input.sourceOutcome,
    sourceDecisionReason: input.sourceDecisionReason,
    createdBy: input.actor,
    createdAt: input.actionAt,
  });
  if (created.status === "INVALID") {
    return created;
  }
  const sameIdentityIntents = input.existingIntents.filter(
    (intent) =>
      validateRevisionIntent(intent) && intent.RevisionIntentId === created.intent.RevisionIntentId,
  );
  if (sameIdentityIntents.length > 1) {
    return { status: "HOLD", reason: "DUPLICATE_INTENT_STATE" };
  }
  if (sameIdentityIntents.length === 1) {
    const existingIntent = sameIdentityIntents[0];
    const matchingDrafts = input.existingDrafts.filter(
      (draft) => draft.RevisionIntentId === existingIntent.RevisionIntentId,
    );
    if (
      existingIntent.status === "CONSUMED" &&
      matchingDrafts.length === 1 &&
      revisionDraftMatchesIntent(matchingDrafts[0], existingIntent)
    ) {
      return {
        status: "ALREADY_STARTED",
        intent: existingIntent,
        draft: matchingDrafts[0],
      };
    }
    if (existingIntent.status !== "OPEN") {
      return { status: "HOLD", reason: "INCONSISTENT_EXISTING_REVISION_STATE" };
    }
    const consumedExisting = consumeRevisionIntentToDraft({
      intent: existingIntent,
      sourceVersion: input.sourceVersion,
      sourceOutcome: input.sourceOutcome,
      existingVersions: input.existingVersions,
      existingDrafts: input.existingDrafts,
      draftCreatedBy: input.actor,
      draftCreatedAt: input.actionAt,
    });
    if (consumedExisting.status === "CREATED") {
      return {
        status: "STARTED",
        intent: consumedExisting.intent,
        draft: consumedExisting.draft,
      };
    }
    return consumedExisting.status === "HOLD"
      ? { status: "HOLD", reason: consumedExisting.reason }
      : consumedExisting;
  }
  const consumed = consumeRevisionIntentToDraft({
    intent: created.intent,
    sourceVersion: input.sourceVersion,
    sourceOutcome: input.sourceOutcome,
    existingVersions: input.existingVersions,
    existingDrafts: input.existingDrafts,
    draftCreatedBy: input.actor,
    draftCreatedAt: input.actionAt,
  });
  if (consumed.status === "CREATED") {
    return { status: "STARTED", intent: consumed.intent, draft: consumed.draft };
  }
  return consumed.status === "HOLD" ? { status: "HOLD", reason: consumed.reason } : consumed;
}
