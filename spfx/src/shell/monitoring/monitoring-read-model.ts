import type { ProcedureRecord } from "../../sbs-domain/kiosk-read-model.bundle";

export type MonitoringQuery = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
}>;

export type MonitoringRecordItem = Readonly<{
  RecordId: string;
  Procedure: ProcedureRecord["Procedure"];
  result: ProcedureRecord["result"];
  performedAt: string;
  recordedAt: string;
  planId: string;
  planVersion: number;
}>;

export type MonitoringReadModel = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  records: readonly MonitoringRecordItem[];
}>;

export type MonitoringBuildResult =
  | Readonly<{ status: "RESOLVED"; value: MonitoringReadModel }>
  | Readonly<{ status: "MALFORMED_INPUT" }>;

const RESULT_VALUES = new Set([
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED",
]);

const QUERY_KEYS = new Set([
  "OrganizationId",
  "SiteId",
  "UserId",
  "planId",
  "planVersion",
  "periodStart",
  "periodEnd",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isValidIsoDateTime(value: unknown): value is string {
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

function toAsiaTokyoCalendarDay(value: unknown): string | null {
  if (!isValidIsoDateTime(value)) {
    return null;
  }

  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

  return /^\d{4}-\d{2}-\d{2}$/.test(formatted) ? formatted : null;
}

function periodMembership(
  periodStart: unknown,
  periodEnd: unknown,
  performedAt: unknown,
): "IN_PERIOD" | "OUTSIDE_PERIOD" | "MALFORMED_INPUT" {
  const fromDay = toAsiaTokyoCalendarDay(periodStart);
  const toDay = toAsiaTokyoCalendarDay(periodEnd);
  const performedDay = toAsiaTokyoCalendarDay(performedAt);

  if (fromDay === null || toDay === null || performedDay === null || fromDay > toDay) {
    return "MALFORMED_INPUT";
  }

  return fromDay <= performedDay && performedDay <= toDay ? "IN_PERIOD" : "OUTSIDE_PERIOD";
}

function isApprovedProcedureReference(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isNonEmptyString(value.ProcedureId) &&
    isNonEmptyString(value.ProcedureVersion) &&
    value.ApprovalState === "APPROVED"
  );
}

function isProcedureRecord(value: unknown): value is ProcedureRecord {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    value.TimeZone !== "Asia/Tokyo" ||
    !isNonEmptyString(value.RecordId) ||
    !isNonEmptyString(value.IdempotencyKey) ||
    !isNonEmptyString(value.PayloadFingerprint) ||
    !isApprovedProcedureReference(value.Procedure) ||
    typeof value.LocalDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.LocalDate) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    typeof value.result !== "string" ||
    !RESULT_VALUES.has(value.result) ||
    !isValidIsoDateTime(value.performedAt) ||
    !isValidIsoDateTime(value.recordedAt) ||
    !isNonEmptyString(value.recordedBy)
  ) {
    return false;
  }

  if (Date.parse(value.recordedAt) < Date.parse(value.performedAt)) {
    return false;
  }

  return value.LocalDate === toAsiaTokyoCalendarDay(value.performedAt);
}

function parseQuery(value: unknown): MonitoringQuery | null {
  if (!isRecord(value) || !Object.keys(value).every((key) => QUERY_KEYS.has(key))) {
    return null;
  }

  if (
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isValidIsoDateTime(value.periodStart) ||
    !isValidIsoDateTime(value.periodEnd) ||
    periodMembership(value.periodStart, value.periodEnd, value.periodStart) === "MALFORMED_INPUT"
  ) {
    return null;
  }

  return {
    OrganizationId: value.OrganizationId,
    SiteId: value.SiteId,
    UserId: value.UserId,
    planId: value.planId,
    planVersion: value.planVersion,
    periodStart: value.periodStart,
    periodEnd: value.periodEnd,
  };
}

/**
 * SPFx-local read-only mirror of the locked canonical Monitoring projection.
 * Root contract tests compare this result with src/domain/monitoring-read-model.ts.
 * No persistence, review judgment, plan mutation, or live tenant I/O is exposed here.
 */
export function buildMonitoringReadModel(
  queryInput: unknown,
  recordsInput: unknown,
): MonitoringBuildResult {
  const query = parseQuery(queryInput);
  if (query === null || !Array.isArray(recordsInput)) {
    return { status: "MALFORMED_INPUT" };
  }

  const seen = new Set<string>();
  const included: ProcedureRecord[] = [];

  for (const candidate of recordsInput) {
    if (!isProcedureRecord(candidate) || seen.has(candidate.RecordId)) {
      return { status: "MALFORMED_INPUT" };
    }
    seen.add(candidate.RecordId);

    if (
      candidate.OrganizationId !== query.OrganizationId ||
      candidate.SiteId !== query.SiteId ||
      candidate.UserId !== query.UserId ||
      candidate.planId !== query.planId ||
      candidate.planVersion !== query.planVersion
    ) {
      continue;
    }

    const membership = periodMembership(query.periodStart, query.periodEnd, candidate.performedAt);
    if (membership === "MALFORMED_INPUT") {
      return { status: "MALFORMED_INPUT" };
    }
    if (membership === "OUTSIDE_PERIOD") {
      continue;
    }

    included.push(candidate);
  }

  included.sort((left, right) => {
    const performedOrder = Date.parse(left.performedAt) - Date.parse(right.performedAt);
    return performedOrder !== 0 ? performedOrder : left.RecordId.localeCompare(right.RecordId);
  });

  const records: readonly MonitoringRecordItem[] = included.map((record) => ({
    RecordId: record.RecordId,
    Procedure: record.Procedure,
    result: record.result,
    performedAt: record.performedAt,
    recordedAt: record.recordedAt,
    planId: record.planId,
    planVersion: record.planVersion,
  }));

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
      records,
    },
  };
}

export type { ProcedureRecord };
