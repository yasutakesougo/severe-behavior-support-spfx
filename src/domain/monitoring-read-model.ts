import type { ApprovedProcedureReference } from "../contracts/types";
import {
  validateProcedureRecord,
  type ProcedureRecord,
  type ProcedureRecordResult,
} from "./procedure-record";
import { evaluateObservationPeriodMembership } from "./support-plan";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

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
  Procedure: ApprovedProcedureReference;
  result: ProcedureRecordResult;
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

const MONITORING_QUERY_KEYS = new Set([
  "OrganizationId",
  "SiteId",
  "UserId",
  "planId",
  "planVersion",
  "periodStart",
  "periodEnd",
]);

function parseMonitoringQuery(value: unknown): MonitoringQuery | null {
  if (!isRecord(value)) {
    return null;
  }

  if (!Object.keys(value).every((key) => MONITORING_QUERY_KEYS.has(key))) {
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
    !isValidIsoDateTime(value.periodEnd)
  ) {
    return null;
  }

  if (
    evaluateObservationPeriodMembership(value.periodStart, value.periodEnd, value.periodStart) ===
    "MALFORMED_INPUT"
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

function monitoringRecordItem(record: ProcedureRecord): MonitoringRecordItem {
  return {
    RecordId: record.RecordId,
    Procedure: record.Procedure,
    result: record.result,
    performedAt: record.performedAt,
    recordedAt: record.recordedAt,
    planId: record.planId,
    planVersion: record.planVersion,
  };
}

/**
 * Build a fact-only monitoring read model from ProcedureRecord evidence.
 *
 * - Exact Organization / Site / User / Plan / PlanVersion isolation.
 * - Period membership uses performedAt with the locked Asia/Tokyo closed-day semantics.
 * - Malformed query, malformed record, duplicate RecordId, or malformed period fails closed.
 * - Result vocabulary is preserved; this function does not derive success/failure or plan advice.
 */
export function buildMonitoringReadModel(
  queryInput: unknown,
  recordsInput: unknown,
): MonitoringBuildResult {
  const query = parseMonitoringQuery(queryInput);
  if (query === null || !Array.isArray(recordsInput)) {
    return { status: "MALFORMED_INPUT" };
  }

  const seenRecordIds = new Set<string>();
  const included: ProcedureRecord[] = [];

  for (const candidate of recordsInput) {
    if (!validateProcedureRecord(candidate)) {
      return { status: "MALFORMED_INPUT" };
    }

    if (seenRecordIds.has(candidate.RecordId)) {
      return { status: "MALFORMED_INPUT" };
    }
    seenRecordIds.add(candidate.RecordId);

    if (
      candidate.OrganizationId !== query.OrganizationId ||
      candidate.SiteId !== query.SiteId ||
      candidate.UserId !== query.UserId ||
      candidate.planId !== query.planId ||
      candidate.planVersion !== query.planVersion
    ) {
      continue;
    }

    const periodMembership = evaluateObservationPeriodMembership(
      query.periodStart,
      query.periodEnd,
      candidate.performedAt,
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
      records,
    },
  };
}
