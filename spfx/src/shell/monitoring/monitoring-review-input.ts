import type {
  MonitoringQuery,
  MonitoringReadModel,
} from "../../sbs-domain/monitoring-read-model.bundle";
import type {
  LegacyPersonMappingKey,
  ReverseLegacyResolution,
} from "../../sbs-domain/person-registry-reference.bundle";

type FoundPersonResolution = Readonly<{
  status: "FOUND";
  MappingKey: LegacyPersonMappingKey;
}>;

export type MonitoringReviewInput = Readonly<{
  personResolution: FoundPersonResolution;
  monitoringQuery: MonitoringQuery;
  monitoringReadModel: MonitoringReadModel;
}>;

export type MonitoringReviewInputResult =
  | Readonly<{ status: "UNRESOLVED" }>
  | Readonly<{ status: "RESOLVED"; value: MonitoringReviewInput }>;

const MONITORING_CONTEXT_KEYS = [
  "OrganizationId",
  "SiteId",
  "UserId",
  "planId",
  "planVersion",
  "periodStart",
  "periodEnd",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isValidPlanVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

/** Matches src/domain/validation.ts:isValidIsoDateTime for shell handoff inputs. */
export function isCanonicalMonitoringIsoDateTime(value: unknown): value is string {
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

  return !Number.isNaN(new Date(value).getTime());
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function hasValidMonitoringContextFields(value: Record<string, unknown>): boolean {
  return (
    isNonEmptyString(value.OrganizationId) &&
    isNonEmptyString(value.SiteId) &&
    isNonEmptyString(value.UserId) &&
    isNonEmptyString(value.planId) &&
    isValidPlanVersion(value.planVersion) &&
    isCanonicalMonitoringIsoDateTime(value.periodStart) &&
    isCanonicalMonitoringIsoDateTime(value.periodEnd) &&
    Date.parse(value.periodStart) <= Date.parse(value.periodEnd)
  );
}

function isValidMonitoringContext(value: unknown): value is MonitoringQuery {
  if (!isRecord(value) || !hasOnlyKeys(value, MONITORING_CONTEXT_KEYS)) {
    return false;
  }

  return hasValidMonitoringContextFields(value);
}

function isValidMonitoringReadModel(value: unknown): value is MonitoringReadModel {
  if (!isRecord(value) || !hasValidMonitoringContextFields(value)) {
    return false;
  }

  return (
    Number.isInteger(value.recordCount) &&
    (value.recordCount as number) >= 0 &&
    Array.isArray(value.records) &&
    value.recordCount === value.records.length
  );
}

function sameMonitoringContext(left: MonitoringQuery, right: MonitoringQuery): boolean {
  return MONITORING_CONTEXT_KEYS.every((key) => left[key] === right[key]);
}

function isValidMappingKey(value: unknown): value is LegacyPersonMappingKey {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      "SourceSystem",
      "OrganizationId",
      "SourceScope",
      "LegacyKeyType",
      "LegacyKeyValue",
    ]) &&
    isNonEmptyString(value.SourceSystem) &&
    isNonEmptyString(value.OrganizationId) &&
    isNonEmptyString(value.SourceScope) &&
    isNonEmptyString(value.LegacyKeyType) &&
    isNonEmptyString(value.LegacyKeyValue)
  );
}

function foundPersonResolution(value: unknown): value is FoundPersonResolution {
  return isRecord(value) && value.status === "FOUND" && isValidMappingKey(value.MappingKey);
}

/**
 * Builds the shell's exact review-authority envelope.
 *
 * SourceScope is intentionally not compared to SiteId. SiteId belongs to the
 * monitoring context; LegacyKeyValue is the only person-to-query match here.
 */
export function buildMonitoringReviewInput(
  personResolution: ReverseLegacyResolution | undefined,
  monitoringQuery: unknown,
  monitoringReadModel: unknown,
): MonitoringReviewInputResult {
  if (
    !foundPersonResolution(personResolution) ||
    !isValidMonitoringContext(monitoringQuery) ||
    !isValidMonitoringReadModel(monitoringReadModel)
  ) {
    return { status: "UNRESOLVED" };
  }

  if (
    personResolution.MappingKey.OrganizationId !== monitoringQuery.OrganizationId ||
    personResolution.MappingKey.LegacyKeyValue !== monitoringQuery.UserId ||
    !sameMonitoringContext(monitoringQuery, monitoringReadModel)
  ) {
    return { status: "UNRESOLVED" };
  }

  return {
    status: "RESOLVED",
    value: {
      personResolution,
      monitoringQuery,
      monitoringReadModel,
    },
  };
}
