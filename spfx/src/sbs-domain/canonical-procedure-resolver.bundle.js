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

// src/domain/canonical-procedure-resolver-spfx-entry.ts
var canonical_procedure_resolver_spfx_entry_exports = {};
__export(canonical_procedure_resolver_spfx_entry_exports, {
  CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID: () => CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID,
  CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION: () => CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION,
  buildCanonicalProcedureCatalogEntry: () => buildCanonicalProcedureCatalogEntry,
  resolveCanonicalProcedure: () => resolveCanonicalProcedure,
  resolveCanonicalProcedureFromEntities: () => resolveCanonicalProcedureFromEntities,
  validateCanonicalProcedureCatalogEntry: () => validateCanonicalProcedureCatalogEntry,
  validateCanonicalProcedureResolutionQuery: () => validateCanonicalProcedureResolutionQuery
});
module.exports = __toCommonJS(canonical_procedure_resolver_spfx_entry_exports);

// src/domain/validation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// src/domain/support-plan-version-procedure-binding.ts
function bindingMatchesSupportPlanVersion(binding, planVersion) {
  return binding.OrganizationId === planVersion.OrganizationId && binding.SiteId === planVersion.SiteId && binding.UserId === planVersion.UserId && binding.planId === planVersion.planId && binding.planVersion === planVersion.version;
}

// src/domain/canonical-procedure-resolver.ts
var CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID = "severe-behavior-support.procedure.canonical-resolver";
var CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION = "1.0.0";
function validateCanonicalProcedureResolutionQuery(value) {
  if (!isRecord(value)) {
    return false;
  }
  const hasScheduleItemId = value.scheduleItemId === void 0 || isNonEmptyString(value.scheduleItemId);
  const hasOccurrenceId = value.occurrenceId === void 0 || isNonEmptyString(value.occurrenceId);
  return isNonEmptyString(value.organizationId) && isNonEmptyString(value.siteId) && isNonEmptyString(value.userId) && isNonEmptyString(value.planId) && typeof value.planVersion === "number" && Number.isInteger(value.planVersion) && value.planVersion >= 1 && isNonEmptyString(value.procedureId) && isNonEmptyString(value.procedureVersion) && hasScheduleItemId && hasOccurrenceId;
}
function validateCanonicalProcedureCatalogEntry(value) {
  if (!isRecord(value)) {
    return false;
  }
  const hasScheduleItemId = value.scheduleItemId === void 0 || isNonEmptyString(value.scheduleItemId);
  return isNonEmptyString(value.organizationId) && isNonEmptyString(value.siteId) && isNonEmptyString(value.userId) && isNonEmptyString(value.planId) && typeof value.planVersion === "number" && Number.isInteger(value.planVersion) && value.planVersion >= 1 && isNonEmptyString(value.procedureId) && isNonEmptyString(value.procedureVersion) && value.approvalState === "APPROVED" && typeof value.sceneLabel === "string" && Array.isArray(value.performLabels) && value.performLabels.every((item) => typeof item === "string") && Array.isArray(value.avoidLabels) && value.avoidLabels.every((item) => typeof item === "string") && typeof value.noteLabel === "string" && isNonEmptyString(value.planPeriodLabel) && hasScheduleItemId;
}
function buildCanonicalProcedureCatalogEntry(input) {
  var _a, _b, _c;
  const { planVersion, binding, scheduleItem } = input;
  if (binding.Procedure.ApprovalState !== "APPROVED") {
    return void 0;
  }
  if (!bindingMatchesSupportPlanVersion(binding, planVersion)) {
    return void 0;
  }
  if (scheduleItem) {
    if (scheduleItem.OrganizationId !== planVersion.OrganizationId || scheduleItem.SiteId !== planVersion.SiteId || scheduleItem.planId !== planVersion.planId || scheduleItem.planVersion !== planVersion.version || scheduleItem.Procedure.ProcedureId !== binding.Procedure.ProcedureId || scheduleItem.Procedure.ProcedureVersion !== binding.Procedure.ProcedureVersion || scheduleItem.Procedure.ApprovalState !== "APPROVED") {
      return void 0;
    }
  }
  const computedSceneLabel = (_a = input.sceneLabel) != null ? _a : scheduleItem ? `${scheduleItem.activityLabel}${scheduleItem.scheduledTime ? `\uFF08${scheduleItem.scheduledTime}\uFF09` : ""}` : "\u652F\u63F4\u624B\u9806";
  const computedPlanPeriodLabel = (_b = input.planPeriodLabel) != null ? _b : `\u7B2C${planVersion.version}\u7248 \u627F\u8A8D\u624B\u9806`;
  const computedNoteLabel = (_c = input.noteLabel) != null ? _c : planVersion.reviewCriteria && planVersion.reviewCriteria.length > 0 ? planVersion.reviewCriteria.join(" / ") : "";
  return {
    organizationId: planVersion.OrganizationId,
    siteId: planVersion.SiteId,
    userId: planVersion.UserId,
    planId: planVersion.planId,
    planVersion: planVersion.version,
    procedureId: binding.Procedure.ProcedureId,
    procedureVersion: binding.Procedure.ProcedureVersion,
    approvalState: "APPROVED",
    sceneLabel: computedSceneLabel,
    performLabels: [...planVersion.supportMethods],
    avoidLabels: [...planVersion.precautions],
    noteLabel: computedNoteLabel,
    planPeriodLabel: computedPlanPeriodLabel,
    scheduleItemId: scheduleItem == null ? void 0 : scheduleItem.ScheduleItemId
  };
}
function resolveCanonicalProcedure(query, catalog) {
  if (!validateCanonicalProcedureResolutionQuery(query)) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "\u89E3\u6C7A\u30AF\u30A8\u30EA\u306E\u5165\u529B\u5024\u304C\u4E0D\u6B63\u3067\u3059\u3002\u5FC5\u9808\u8B58\u5225\u5B50\u304C\u6B20\u843D\u3057\u3066\u3044\u307E\u3059\u3002",
      canStartProcedureRecord: false
    };
  }
  const matches = catalog.filter((entry2) => {
    return entry2.organizationId === query.organizationId && entry2.siteId === query.siteId && entry2.userId === query.userId && entry2.planId === query.planId && entry2.planVersion === query.planVersion && entry2.procedureId === query.procedureId && entry2.procedureVersion === query.procedureVersion;
  });
  if (matches.length === 0) {
    const userOrSiteMismatch = catalog.some(
      (e) => e.planId === query.planId && e.planVersion === query.planVersion && e.procedureId === query.procedureId && (e.userId !== query.userId || e.siteId !== query.siteId || e.organizationId !== query.organizationId)
    );
    if (userOrSiteMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "USER_OR_SITE_MISMATCH",
        unresolvedReason: "\u8981\u6C42\u3055\u308C\u305F\u624B\u9806\u306E\u5229\u7528\u8005ID\u3001\u4E8B\u696D\u6240ID\u3001\u307E\u305F\u306F\u7D44\u7E54ID\u304C\u6B63\u672C\u30C7\u30FC\u30BF\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002\u4ED6\u8005\u30FB\u5225\u4E8B\u696D\u6240\u3078\u306E\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u306F\u906E\u65AD\u3055\u308C\u307E\u3057\u305F\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    const planVersionMismatch = catalog.some(
      (e) => e.organizationId === query.organizationId && e.siteId === query.siteId && e.userId === query.userId && e.planId === query.planId && e.procedureId === query.procedureId && e.planVersion !== query.planVersion
    );
    if (planVersionMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PLAN_VERSION_MISMATCH",
        unresolvedReason: `\u8981\u6C42\u3055\u308C\u305F\u8A08\u753B\u7248\u6570\uFF08\u7B2C${query.planVersion}\u7248\uFF09\u3068\u4E00\u81F4\u3059\u308B\u624B\u9806\u6B63\u672C\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u65E7\u7248\u307E\u305F\u306F\u5225\u7248\u3078\u306E\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u306F\u906E\u65AD\u3055\u308C\u307E\u3057\u305F\u3002`,
        canStartProcedureRecord: false,
        context: query
      };
    }
    const procVersionMismatch = catalog.some(
      (e) => e.organizationId === query.organizationId && e.siteId === query.siteId && e.userId === query.userId && e.planId === query.planId && e.planVersion === query.planVersion && e.procedureId === query.procedureId && e.procedureVersion !== query.procedureVersion
    );
    if (procVersionMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PROCEDURE_VERSION_MISMATCH",
        unresolvedReason: `\u8981\u6C42\u3055\u308C\u305F\u624B\u9806\u7248\u6570\uFF08${query.procedureVersion}\uFF09\u3068\u4E00\u81F4\u3059\u308B\u6B63\u672C\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002`,
        canStartProcedureRecord: false,
        context: query
      };
    }
    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F\u6761\u4EF6\u306B\u4E00\u81F4\u3059\u308B\u627F\u8A8D\u6E08\u307F\u624B\u9806\u6B63\u672C\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const unapprovedEntry = matches.find((e) => e.approvalState !== "APPROVED");
  if (unapprovedEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "NOT_APPROVED",
      unresolvedReason: "\u5BFE\u8C61\u624B\u9806\u30A8\u30F3\u30C8\u30EA\u306E\u627F\u8A8D\u72B6\u614B\u304C APPROVED \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u672A\u627F\u8A8D\u30C7\u30FC\u30BF\u306E\u89E3\u6C7A\u304A\u3088\u3073\u6DF7\u5728\u306F\u906E\u65AD\u3055\u308C\u307E\u3057\u305F\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const invalidEntry = matches.find((e) => !validateCanonicalProcedureCatalogEntry(e));
  if (invalidEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "\u30AB\u30BF\u30ED\u30B0\u30A8\u30F3\u30C8\u30EA\u306E\u5F62\u5F0F\u307E\u305F\u306F\u5FC5\u9808\u30D5\u30A3\u30FC\u30EB\u30C9\u304C\u4E0D\u6B63\u3067\u3059\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  if (matches.length > 1) {
    if (!query.scheduleItemId) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
        unresolvedReason: "\u540C\u4E00\u624B\u9806\u306B\u5BFE\u3057\u3066\u8907\u6570\u306E\u6D3B\u52D5\u67A0\u304C\u5B58\u5728\u3057\u307E\u3059\u304C\u3001\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\uFF08scheduleItemId\uFF09\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u672C\u6587\u5BFE\u5FDC\u3092\u4E00\u610F\u306B\u6C7A\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    const scheduleMatches = matches.filter((m) => m.scheduleItemId === query.scheduleItemId);
    if (scheduleMatches.length === 1) {
      const resolved = scheduleMatches[0];
      return {
        status: "RESOLVED",
        projection: {
          sceneLabel: resolved.sceneLabel,
          performLabels: [...resolved.performLabels],
          avoidLabels: [...resolved.avoidLabels],
          noteLabel: resolved.noteLabel
        },
        planPeriodLabel: resolved.planPeriodLabel,
        canStartProcedureRecord: false,
        context: query
      };
    }
    if (scheduleMatches.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason: "\u540C\u4E00\u306E\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\uFF08scheduleItemId\uFF09\u306B\u5BFE\u3057\u3066\u91CD\u8907\u3059\u308B\u624B\u9806\u30A8\u30F3\u30C8\u30EA\u304C\u5B58\u5728\u3057\u307E\u3059\u3002\u66D6\u6627\u6027\u3092\u6392\u9664\u3059\u308B\u305F\u3081\u89E3\u6C7A\u3092\u906E\u65AD\u3057\u307E\u3057\u305F\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
      unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\uFF08scheduleItemId\uFF09\u3068\u4E00\u81F4\u3059\u308B\u624B\u9806\u30A8\u30F3\u30C8\u30EA\u3092\u7279\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const entry = matches[0];
  if (query.scheduleItemId && entry.scheduleItemId && query.scheduleItemId !== entry.scheduleItemId) {
    return {
      status: "UNRESOLVED",
      reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
      unresolvedReason: "\u8981\u6C42\u3055\u308C\u305F\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\uFF08ScheduleItemId\uFF09\u3068\u767B\u9332\u3055\u308C\u305F\u624B\u9806\u30A8\u30F3\u30C8\u30EA\u306E\u67A0\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  return {
    status: "RESOLVED",
    projection: {
      sceneLabel: entry.sceneLabel,
      performLabels: [...entry.performLabels],
      // Strict array order preserved
      avoidLabels: [...entry.avoidLabels],
      // Strict array order preserved
      noteLabel: entry.noteLabel
    },
    planPeriodLabel: entry.planPeriodLabel,
    canStartProcedureRecord: false,
    context: query
  };
}
function resolveCanonicalProcedureFromEntities(input) {
  const { query, planVersions, bindings, scheduleItems, occurrences } = input;
  if (!validateCanonicalProcedureResolutionQuery(query)) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "\u89E3\u6C7A\u30AF\u30A8\u30EA\u306E\u5165\u529B\u5024\u304C\u4E0D\u6B63\u3067\u3059\u3002\u5FC5\u9808\u8B58\u5225\u5B50\u304C\u6B20\u843D\u3057\u3066\u3044\u307E\u3059\u3002",
      canStartProcedureRecord: false
    };
  }
  if (query.occurrenceId && occurrences !== void 0) {
    const matchingOccurrences = occurrences.filter((o) => o.OccurrenceId === query.occurrenceId);
    if (matchingOccurrences.length === 0) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F OccurrenceId \u306B\u5BFE\u5FDC\u3059\u308B\u4E88\u5B9A\u5B9F\u7E3E\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    if (matchingOccurrences.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason: "\u540C\u4E00 OccurrenceId \u306B\u5BFE\u3057\u3066\u8907\u6570\u306E\u4E88\u5B9A\u5B9F\u7E3E\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3059\u308B\u305F\u3081\u4E00\u610F\u306B\u89E3\u6C7A\u3067\u304D\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    const matchingOccurrence = matchingOccurrences[0];
    if (matchingOccurrence.OrganizationId !== query.organizationId || matchingOccurrence.SiteId !== query.siteId || matchingOccurrence.UserId !== query.userId || matchingOccurrence.planId !== query.planId || matchingOccurrence.planVersion !== query.planVersion || matchingOccurrence.Procedure.ProcedureId !== query.procedureId || matchingOccurrence.Procedure.ProcedureVersion !== query.procedureVersion || matchingOccurrence.Procedure.ApprovalState !== "APPROVED") {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "Occurrence \u306E\u8B58\u5225\u5B50\u307E\u305F\u306F\u624B\u9806\u53C2\u7167\u304C\u89E3\u6C7A\u30AF\u30A8\u30EA\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    if (query.scheduleItemId && matchingOccurrence.ScheduleItemId !== query.scheduleItemId) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "Occurrence \u306E ScheduleItemId \u304C\u30AF\u30A8\u30EA\u3068\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
  }
  let resolvedScheduleItem = void 0;
  if (query.scheduleItemId && scheduleItems !== void 0) {
    const matchingScheduleItems = scheduleItems.filter(
      (s) => s.ScheduleItemId === query.scheduleItemId && s.OrganizationId === query.organizationId && s.SiteId === query.siteId && s.planId === query.planId && s.planVersion === query.planVersion && s.Procedure.ProcedureId === query.procedureId && s.Procedure.ProcedureVersion === query.procedureVersion
    );
    if (matchingScheduleItems.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason: "\u540C\u4E00\u30B9\u30B3\u30FC\u30D7\u30FB\u624B\u9806\u30FBScheduleItemId\u306B\u5BFE\u3057\u3066\u8907\u6570\u306E\u91CD\u8907\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\u304C\u5B58\u5728\u3057\u307E\u3059\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    if (matchingScheduleItems.length === 0) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F ScheduleItemId \u306B\u5BFE\u5FDC\u3059\u308B\u6709\u52B9\u306A\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u67A0\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    const candidate = matchingScheduleItems[0];
    if (candidate.Procedure.ApprovalState !== "APPROVED") {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "ScheduleItem \u306E\u624B\u9806\u627F\u8A8D\u72B6\u614B\u304C APPROVED \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
        canStartProcedureRecord: false,
        context: query
      };
    }
    resolvedScheduleItem = candidate;
  }
  const matchingPlanVersions = planVersions.filter(
    (pv) => pv.OrganizationId === query.organizationId && pv.SiteId === query.siteId && pv.UserId === query.userId && pv.planId === query.planId && pv.version === query.planVersion
  );
  if (matchingPlanVersions.length > 1) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
      unresolvedReason: "\u540C\u4E00\u30B9\u30B3\u30FC\u30D7\u30FB\u8A08\u753BID\u30FB\u7248\u6570\u306B\u5BFE\u3057\u3066\u8907\u6570\u306E SupportPlanVersion \u304C\u5B58\u5728\u3057\u307E\u3059\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const planVersion = matchingPlanVersions[0];
  if (!planVersion) {
    const hasDifferentVersion = planVersions.some(
      (pv) => pv.OrganizationId === query.organizationId && pv.SiteId === query.siteId && pv.UserId === query.userId && pv.planId === query.planId && pv.version !== query.planVersion
    );
    if (hasDifferentVersion) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PLAN_VERSION_MISMATCH",
        unresolvedReason: `\u8981\u6C42\u3055\u308C\u305F\u8A08\u753B\u7248\uFF08\u7B2C${query.planVersion}\u7248\uFF09\u3068\u7570\u306A\u308B\u7248\u6570\u306E\u307F\u5B58\u5728\u3057\u307E\u3059\u3002`,
        canStartProcedureRecord: false,
        context: query
      };
    }
    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F\u6761\u4EF6\u306B\u4E00\u81F4\u3059\u308B SupportPlanVersion \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const matchingBindings = bindings.filter(
    (b) => b.OrganizationId === query.organizationId && b.SiteId === query.siteId && b.UserId === query.userId && b.planId === query.planId && b.planVersion === query.planVersion && b.Procedure.ProcedureId === query.procedureId && b.Procedure.ProcedureVersion === query.procedureVersion
  );
  if (matchingBindings.length === 0) {
    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason: "\u6307\u5B9A\u3055\u308C\u305F\u624B\u9806\u306B\u5BFE\u5FDC\u3059\u308B SupportPlanVersionProcedureBinding \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const nonApproved = matchingBindings.find((b) => b.Procedure.ApprovalState !== "APPROVED");
  if (nonApproved) {
    return {
      status: "UNRESOLVED",
      reasonCode: "NOT_APPROVED",
      unresolvedReason: "\u7D50\u3073\u4ED8\u3051\u3089\u308C\u305F\u624B\u9806\u53C2\u7167\u306E\u627F\u8A8D\u72B6\u614B\u304C APPROVED \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const misaligned = matchingBindings.find(
    (b) => !bindingMatchesSupportPlanVersion(b, planVersion)
  );
  if (misaligned) {
    return {
      status: "UNRESOLVED",
      reasonCode: "BINDING_PLAN_MISMATCH",
      unresolvedReason: "Binding \u306E\u30B9\u30B3\u30FC\u30D7\uFF08Org/Site/User/planId/version\uFF09\u304C SupportPlanVersion \u3068\u6574\u5408\u3057\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  if (matchingBindings.length > 1) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
      unresolvedReason: "\u540C\u4E00\u624B\u9806\u306B\u5BFE\u3057\u3066\u8907\u6570\u306E\u91CD\u8907\u30D0\u30A4\u30F3\u30C7\u30A3\u30F3\u30B0\u304C\u5B58\u5728\u3057\u307E\u3059\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const candidateScheduleItems = scheduleItems == null ? void 0 : scheduleItems.filter(
    (s) => s.OrganizationId === query.organizationId && s.SiteId === query.siteId && s.planId === query.planId && s.planVersion === query.planVersion && s.Procedure.ProcedureId === query.procedureId && s.Procedure.ProcedureVersion === query.procedureVersion
  );
  if (candidateScheduleItems && candidateScheduleItems.length > 1 && !query.scheduleItemId) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
      unresolvedReason: "\u540C\u4E00\u624B\u9806\u306B\u5BFE\u3057\u3066\u8907\u6570\u306E\u6D3B\u52D5\u67A0\u304C\u5B58\u5728\u3057\u307E\u3059\u304C\u3001scheduleItemId \u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u4E00\u610F\u306B\u89E3\u6C7A\u3067\u304D\u307E\u305B\u3093\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  const binding = matchingBindings[0];
  const catalogEntry = buildCanonicalProcedureCatalogEntry({
    planVersion,
    binding,
    scheduleItem: resolvedScheduleItem
  });
  if (!catalogEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "BINDING_PLAN_MISMATCH",
      unresolvedReason: "\u30AB\u30BF\u30ED\u30B0\u30A8\u30F3\u30C8\u30EA\u306E\u751F\u6210\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002",
      canStartProcedureRecord: false,
      context: query
    };
  }
  return resolveCanonicalProcedure(query, [catalogEntry]);
}
