import type { ScheduleItem, ScheduledOccurrence } from "./kiosk-contract";
import type { SupportPlanVersion } from "./support-plan";
import {
  type SupportPlanVersionProcedureBinding,
  bindingMatchesSupportPlanVersion,
} from "./support-plan-version-procedure-binding";
import { isNonEmptyString, isRecord } from "./validation";

/**
 * Schema identity for CanonicalProcedureResolver
 * Aligned with A2 Selection and Design V1.1 (Issue #347 / PR #707 baseline).
 */
export const CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID =
  "severe-behavior-support.procedure.canonical-resolver" as const;
export const CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION = "1.0.0" as const;

/**
 * Presentation projection for procedure execution.
 * Preserves strict array order of supportMethods and precautions.
 */
export type CanonicalProcedureProjection = Readonly<{
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
  noteLabel: string;
}>;

/**
 * Resolution query passed by the presentation or coordinator layer.
 * All core identity keys are mandatory non-empty values.
 */
export type CanonicalProcedureResolutionQuery = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  scheduleItemId?: string;
  occurrenceId?: string;
}>;

/**
 * Catalog entry representing an approved, verified procedure binding and its projection.
 */
export type CanonicalProcedureCatalogEntry = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  approvalState: "APPROVED";
  sceneLabel: string;
  performLabels: readonly string[];
  avoidLabels: readonly string[];
  noteLabel: string;
  planPeriodLabel: string;
  scheduleItemId?: string;
}>;

export type CanonicalProcedureUnresolvedReasonCode =
  | "INPUT_INVALID"
  | "USER_OR_SITE_MISMATCH"
  | "PLAN_VERSION_MISMATCH"
  | "PROCEDURE_VERSION_MISMATCH"
  | "NOT_APPROVED"
  | "BINDING_PLAN_MISMATCH"
  | "SCHEDULE_OCCURRENCE_MISMATCH"
  | "AMBIGUOUS_DUPLICATE_ENTRY"
  | "AMBIGUOUS_PROCEDURE_MAPPING"
  | "CATALOG_ENTRY_NOT_FOUND";

export type CanonicalProcedureResolutionOutcome =
  | Readonly<{
      status: "RESOLVED";
      projection: CanonicalProcedureProjection;
      planPeriodLabel: string;
      /**
       * Authority invariant: Resolver success NEVER grants record creation by itself.
       * Creation eligibility remains strictly determined by occurrence status, staff role, and pause guards.
       */
      canStartProcedureRecord: false;
      context: Readonly<{
        organizationId: string;
        siteId: string;
        userId: string;
        planId: string;
        planVersion: number;
        procedureId: string;
        procedureVersion: string;
        occurrenceId?: string;
        scheduleItemId?: string;
      }>;
    }>
  | Readonly<{
      status: "UNRESOLVED";
      reasonCode: CanonicalProcedureUnresolvedReasonCode;
      unresolvedReason: string;
      canStartProcedureRecord: false;
      context?: Readonly<{
        organizationId?: string;
        siteId?: string;
        userId?: string;
        planId?: string;
        planVersion?: number;
        procedureId?: string;
        procedureVersion?: string;
        occurrenceId?: string;
        scheduleItemId?: string;
      }>;
    }>;

export function validateCanonicalProcedureResolutionQuery(
  value: unknown,
): value is CanonicalProcedureResolutionQuery {
  if (!isRecord(value)) {
    return false;
  }

  const hasScheduleItemId =
    value.scheduleItemId === undefined || isNonEmptyString(value.scheduleItemId);
  const hasOccurrenceId = value.occurrenceId === undefined || isNonEmptyString(value.occurrenceId);

  return (
    isNonEmptyString(value.organizationId) &&
    isNonEmptyString(value.siteId) &&
    isNonEmptyString(value.userId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    isNonEmptyString(value.procedureId) &&
    isNonEmptyString(value.procedureVersion) &&
    hasScheduleItemId &&
    hasOccurrenceId
  );
}

export function validateCanonicalProcedureCatalogEntry(
  value: unknown,
): value is CanonicalProcedureCatalogEntry {
  if (!isRecord(value)) {
    return false;
  }

  const hasScheduleItemId =
    value.scheduleItemId === undefined || isNonEmptyString(value.scheduleItemId);

  return (
    isNonEmptyString(value.organizationId) &&
    isNonEmptyString(value.siteId) &&
    isNonEmptyString(value.userId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    isNonEmptyString(value.procedureId) &&
    isNonEmptyString(value.procedureVersion) &&
    value.approvalState === "APPROVED" &&
    typeof value.sceneLabel === "string" &&
    Array.isArray(value.performLabels) &&
    value.performLabels.every((item) => typeof item === "string") &&
    Array.isArray(value.avoidLabels) &&
    value.avoidLabels.every((item) => typeof item === "string") &&
    typeof value.noteLabel === "string" &&
    isNonEmptyString(value.planPeriodLabel) &&
    hasScheduleItemId
  );
}

/**
 * Pure builder function: builds a CanonicalProcedureCatalogEntry from verified domain entities.
 * Returns undefined if any binding, approval, or structural invariant fails.
 */
export function buildCanonicalProcedureCatalogEntry(input: {
  planVersion: SupportPlanVersion;
  binding: SupportPlanVersionProcedureBinding;
  scheduleItem?: ScheduleItem;
  planPeriodLabel?: string;
  sceneLabel?: string;
  noteLabel?: string;
}): CanonicalProcedureCatalogEntry | undefined {
  const { planVersion, binding, scheduleItem } = input;

  // 1. Rejection of non-APPROVED references
  if (binding.Procedure.ApprovalState !== "APPROVED") {
    return undefined;
  }

  // 2. Exact binding and SupportPlanVersion alignment
  if (!bindingMatchesSupportPlanVersion(binding, planVersion)) {
    return undefined;
  }

  // 3. ScheduleItem consistency check if provided
  if (scheduleItem) {
    if (
      scheduleItem.OrganizationId !== planVersion.OrganizationId ||
      scheduleItem.SiteId !== planVersion.SiteId ||
      scheduleItem.planId !== planVersion.planId ||
      scheduleItem.planVersion !== planVersion.version ||
      scheduleItem.Procedure.ProcedureId !== binding.Procedure.ProcedureId ||
      scheduleItem.Procedure.ProcedureVersion !== binding.Procedure.ProcedureVersion ||
      scheduleItem.Procedure.ApprovalState !== "APPROVED"
    ) {
      return undefined;
    }
  }

  const computedSceneLabel =
    input.sceneLabel ??
    (scheduleItem
      ? `${scheduleItem.activityLabel}${scheduleItem.scheduledTime ? `（${scheduleItem.scheduledTime}）` : ""}`
      : "支援手順");

  const computedPlanPeriodLabel = input.planPeriodLabel ?? `第${planVersion.version}版 承認手順`;

  const computedNoteLabel =
    input.noteLabel ??
    (planVersion.reviewCriteria && planVersion.reviewCriteria.length > 0
      ? planVersion.reviewCriteria.join(" / ")
      : "");

  // Preserves strict array order of supportMethods and precautions
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
    scheduleItemId: scheduleItem?.ScheduleItemId,
  };
}

/**
 * Pure resolver: matches query against catalog entries.
 * Enforces all 10 canonical verification rules:
 * - Exact composite key match (Org, Site, User, Plan, PlanVer, Proc, ProcVer)
 * - Strict prohibition of fallback to other users, sites, or versions
 * - Fails closed on duplicate, contradictory, or missing entries
 * - Preserves supportMethods and precautions array order
 */
export function resolveCanonicalProcedure(
  query: CanonicalProcedureResolutionQuery,
  catalog: readonly CanonicalProcedureCatalogEntry[],
): CanonicalProcedureResolutionOutcome {
  if (!validateCanonicalProcedureResolutionQuery(query)) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "解決クエリの入力値が不正です。必須識別子が欠落しています。",
      canStartProcedureRecord: false,
    };
  }

  // Filter matching entries by exact composite identity
  const matches = catalog.filter((entry) => {
    return (
      entry.organizationId === query.organizationId &&
      entry.siteId === query.siteId &&
      entry.userId === query.userId &&
      entry.planId === query.planId &&
      entry.planVersion === query.planVersion &&
      entry.procedureId === query.procedureId &&
      entry.procedureVersion === query.procedureVersion
    );
  });

  if (matches.length === 0) {
    // Check if partial matches exist to provide a specific, audited reason code
    const userOrSiteMismatch = catalog.some(
      (e) =>
        e.planId === query.planId &&
        e.planVersion === query.planVersion &&
        e.procedureId === query.procedureId &&
        (e.userId !== query.userId ||
          e.siteId !== query.siteId ||
          e.organizationId !== query.organizationId),
    );
    if (userOrSiteMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "USER_OR_SITE_MISMATCH",
        unresolvedReason:
          "要求された手順の利用者ID、事業所ID、または組織IDが正本データと一致しません。他者・別事業所へのフォールバックは遮断されました。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    const planVersionMismatch = catalog.some(
      (e) =>
        e.organizationId === query.organizationId &&
        e.siteId === query.siteId &&
        e.userId === query.userId &&
        e.planId === query.planId &&
        e.procedureId === query.procedureId &&
        e.planVersion !== query.planVersion,
    );
    if (planVersionMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PLAN_VERSION_MISMATCH",
        unresolvedReason: `要求された計画版数（第${query.planVersion}版）と一致する手順正本が見つかりません。旧版または別版へのフォールバックは遮断されました。`,
        canStartProcedureRecord: false,
        context: query,
      };
    }

    const procVersionMismatch = catalog.some(
      (e) =>
        e.organizationId === query.organizationId &&
        e.siteId === query.siteId &&
        e.userId === query.userId &&
        e.planId === query.planId &&
        e.planVersion === query.planVersion &&
        e.procedureId === query.procedureId &&
        e.procedureVersion !== query.procedureVersion,
    );
    if (procVersionMismatch) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PROCEDURE_VERSION_MISMATCH",
        unresolvedReason: `要求された手順版数（${query.procedureVersion}）と一致する正本が見つかりません。`,
        canStartProcedureRecord: false,
        context: query,
      };
    }

    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason: "指定された条件に一致する承認済み手順正本が存在しません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // P0 defense: Reject if any matching entry is not APPROVED (do not mask unapproved entries or inconsistency)
  const unapprovedEntry = matches.find((e) => e.approvalState !== "APPROVED");
  if (unapprovedEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "NOT_APPROVED",
      unresolvedReason:
        "対象手順エントリの承認状態が APPROVED ではありません。未承認データの解決および混在は遮断されました。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // Catalog entry structural validation
  const invalidEntry = matches.find((e) => !validateCanonicalProcedureCatalogEntry(e));
  if (invalidEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "カタログエントリの形式または必須フィールドが不正です。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // P1 & P2: Disambiguate multiple entries by scheduleItemId or fail closed
  if (matches.length > 1) {
    if (!query.scheduleItemId) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
        unresolvedReason:
          "同一手順に対して複数の活動枠が存在しますが、スケジュール枠（scheduleItemId）が指定されていないため本文対応を一意に決定できません。",
        canStartProcedureRecord: false,
        context: query,
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
          noteLabel: resolved.noteLabel,
        },
        planPeriodLabel: resolved.planPeriodLabel,
        canStartProcedureRecord: false,
        context: query,
      };
    }

    if (scheduleMatches.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason:
          "同一のスケジュール枠（scheduleItemId）に対して重複する手順エントリが存在します。曖昧性を排除するため解決を遮断しました。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
      unresolvedReason:
        "指定されたスケジュール枠（scheduleItemId）と一致する手順エントリを特定できません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  const entry = matches[0];

  // ScheduleItemId match verification if both are present
  if (
    query.scheduleItemId &&
    entry.scheduleItemId &&
    query.scheduleItemId !== entry.scheduleItemId
  ) {
    return {
      status: "UNRESOLVED",
      reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
      unresolvedReason:
        "要求されたスケジュール枠（ScheduleItemId）と登録された手順エントリの枠が一致しません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  return {
    status: "RESOLVED",
    projection: {
      sceneLabel: entry.sceneLabel,
      performLabels: [...entry.performLabels], // Strict array order preserved
      avoidLabels: [...entry.avoidLabels], // Strict array order preserved
      noteLabel: entry.noteLabel,
    },
    planPeriodLabel: entry.planPeriodLabel,
    canStartProcedureRecord: false,
    context: query,
  };
}

/**
 * Pure resolver orchestrator from domain entities:
 * Validates domain entities, checks schedule & occurrence consistency,
 * builds catalog entries, and deterministically resolves the procedure.
 */
export function resolveCanonicalProcedureFromEntities(input: {
  query: CanonicalProcedureResolutionQuery;
  planVersions: readonly SupportPlanVersion[];
  bindings: readonly SupportPlanVersionProcedureBinding[];
  scheduleItems?: readonly ScheduleItem[];
  occurrences?: readonly ScheduledOccurrence[];
}): CanonicalProcedureResolutionOutcome {
  const { query, planVersions, bindings, scheduleItems, occurrences } = input;

  if (!validateCanonicalProcedureResolutionQuery(query)) {
    return {
      status: "UNRESOLVED",
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "解決クエリの入力値が不正です。必須識別子が欠落しています。",
      canStartProcedureRecord: false,
    };
  }

  // 1. ScheduledOccurrence consistency check if occurrenceId is present
  if (query.occurrenceId && occurrences !== undefined) {
    const matchingOccurrences = occurrences.filter((o) => o.OccurrenceId === query.occurrenceId);
    if (matchingOccurrences.length === 0) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "指定された OccurrenceId に対応する予定実績データが見つかりません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    if (matchingOccurrences.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason:
          "同一 OccurrenceId に対して複数の予定実績データが存在するため一意に解決できません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    const matchingOccurrence = matchingOccurrences[0];

    if (
      matchingOccurrence.OrganizationId !== query.organizationId ||
      matchingOccurrence.SiteId !== query.siteId ||
      matchingOccurrence.UserId !== query.userId ||
      matchingOccurrence.planId !== query.planId ||
      matchingOccurrence.planVersion !== query.planVersion ||
      matchingOccurrence.Procedure.ProcedureId !== query.procedureId ||
      matchingOccurrence.Procedure.ProcedureVersion !== query.procedureVersion ||
      matchingOccurrence.Procedure.ApprovalState !== "APPROVED"
    ) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "Occurrence の識別子または手順参照が解決クエリと一致しません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    if (query.scheduleItemId && matchingOccurrence.ScheduleItemId !== query.scheduleItemId) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "Occurrence の ScheduleItemId がクエリと一致しません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }
  }

  // 2. ScheduleItem consistency check and selection
  let resolvedScheduleItem: ScheduleItem | undefined = undefined;
  if (query.scheduleItemId && scheduleItems !== undefined) {
    const matchingScheduleItems = scheduleItems.filter(
      (s) =>
        s.ScheduleItemId === query.scheduleItemId &&
        s.OrganizationId === query.organizationId &&
        s.SiteId === query.siteId &&
        s.planId === query.planId &&
        s.planVersion === query.planVersion &&
        s.Procedure.ProcedureId === query.procedureId &&
        s.Procedure.ProcedureVersion === query.procedureVersion,
    );

    if (matchingScheduleItems.length > 1) {
      return {
        status: "UNRESOLVED",
        reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
        unresolvedReason:
          "同一スコープ・手順・ScheduleItemIdに対して複数の重複スケジュール枠が存在します。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    if (matchingScheduleItems.length === 0) {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason:
          "指定された ScheduleItemId に対応する有効なスケジュール枠が見つかりません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    const candidate = matchingScheduleItems[0];
    if (candidate.Procedure.ApprovalState !== "APPROVED") {
      return {
        status: "UNRESOLVED",
        reasonCode: "SCHEDULE_OCCURRENCE_MISMATCH",
        unresolvedReason: "ScheduleItem の手順承認状態が APPROVED ではありません。",
        canStartProcedureRecord: false,
        context: query,
      };
    }

    resolvedScheduleItem = candidate;
  }

  // 3. Find matching SupportPlanVersion
  const matchingPlanVersions = planVersions.filter(
    (pv) =>
      pv.OrganizationId === query.organizationId &&
      pv.SiteId === query.siteId &&
      pv.UserId === query.userId &&
      pv.planId === query.planId &&
      pv.version === query.planVersion,
  );

  if (matchingPlanVersions.length > 1) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
      unresolvedReason:
        "同一スコープ・計画ID・版数に対して複数の SupportPlanVersion が存在します。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  const planVersion = matchingPlanVersions[0];

  if (!planVersion) {
    // Check if version mismatch exists
    const hasDifferentVersion = planVersions.some(
      (pv) =>
        pv.OrganizationId === query.organizationId &&
        pv.SiteId === query.siteId &&
        pv.UserId === query.userId &&
        pv.planId === query.planId &&
        pv.version !== query.planVersion,
    );
    if (hasDifferentVersion) {
      return {
        status: "UNRESOLVED",
        reasonCode: "PLAN_VERSION_MISMATCH",
        unresolvedReason: `要求された計画版（第${query.planVersion}版）と異なる版数のみ存在します。`,
        canStartProcedureRecord: false,
        context: query,
      };
    }

    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason: "指定された条件に一致する SupportPlanVersion が見つかりません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // 4. Find matching Binding(s)
  const matchingBindings = bindings.filter(
    (b) =>
      b.OrganizationId === query.organizationId &&
      b.SiteId === query.siteId &&
      b.UserId === query.userId &&
      b.planId === query.planId &&
      b.planVersion === query.planVersion &&
      b.Procedure.ProcedureId === query.procedureId &&
      b.Procedure.ProcedureVersion === query.procedureVersion,
  );

  if (matchingBindings.length === 0) {
    return {
      status: "UNRESOLVED",
      reasonCode: "CATALOG_ENTRY_NOT_FOUND",
      unresolvedReason:
        "指定された手順に対応する SupportPlanVersionProcedureBinding が見つかりません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // 5. Check if any matching binding is not APPROVED
  const nonApproved = matchingBindings.find((b) => b.Procedure.ApprovalState !== "APPROVED");
  if (nonApproved) {
    return {
      status: "UNRESOLVED",
      reasonCode: "NOT_APPROVED",
      unresolvedReason: "結び付けられた手順参照の承認状態が APPROVED ではありません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // 6. Check binding alignment with planVersion
  const misaligned = matchingBindings.find(
    (b) => !bindingMatchesSupportPlanVersion(b, planVersion),
  );
  if (misaligned) {
    return {
      status: "UNRESOLVED",
      reasonCode: "BINDING_PLAN_MISMATCH",
      unresolvedReason:
        "Binding のスコープ（Org/Site/User/planId/version）が SupportPlanVersion と整合しません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // 7. Check duplicates
  if (matchingBindings.length > 1) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_DUPLICATE_ENTRY",
      unresolvedReason: "同一手順に対して複数の重複バインディングが存在します。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  // 8. Activity slot ambiguity check
  const candidateScheduleItems = scheduleItems?.filter(
    (s) =>
      s.OrganizationId === query.organizationId &&
      s.SiteId === query.siteId &&
      s.planId === query.planId &&
      s.planVersion === query.planVersion &&
      s.Procedure.ProcedureId === query.procedureId &&
      s.Procedure.ProcedureVersion === query.procedureVersion,
  );

  if (candidateScheduleItems && candidateScheduleItems.length > 1 && !query.scheduleItemId) {
    return {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_PROCEDURE_MAPPING",
      unresolvedReason:
        "同一手順に対して複数の活動枠が存在しますが、scheduleItemId が指定されていないため一意に解決できません。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  const binding = matchingBindings[0];

  const catalogEntry = buildCanonicalProcedureCatalogEntry({
    planVersion,
    binding,
    scheduleItem: resolvedScheduleItem,
  });

  if (!catalogEntry) {
    return {
      status: "UNRESOLVED",
      reasonCode: "BINDING_PLAN_MISMATCH",
      unresolvedReason: "カタログエントリの生成検証に失敗しました。",
      canStartProcedureRecord: false,
      context: query,
    };
  }

  return resolveCanonicalProcedure(query, [catalogEntry]);
}
