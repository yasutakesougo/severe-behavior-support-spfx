import type { ProcedureRecordResult } from "./procedure-record";
import type { MonitoringReadModel } from "./monitoring-read-model";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

export type ReviewPresentationContext = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
}>;

export type HumanReviewMaterialRecord = Readonly<{
  RecordId: string;
  ProcedureId: string;
  ProcedureVersion: string;
  result: ProcedureRecordResult;
  performedAt: string;
  recordedAt: string;
}>;

export type HumanReviewMaterials = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
  records: readonly HumanReviewMaterialRecord[];
  humanInterpretationRequired: true;
}>;

export type HumanReviewMaterialsBuildResult =
  | Readonly<{ status: "RESOLVED"; value: HumanReviewMaterials }>
  | Readonly<{ status: "MALFORMED_INPUT" }>
  | Readonly<{ status: "CONTEXT_MISMATCH" }>;

const RESULT_VALUES = new Set<ProcedureRecordResult>([
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED",
]);

const CONTEXT_KEYS = new Set([
  "OrganizationId",
  "SiteId",
  "UserId",
  "planId",
  "planVersion",
  "periodStart",
  "periodEnd",
]);

function parsePresentationContext(value: unknown): ReviewPresentationContext | null {
  if (!isRecord(value) || !Object.keys(value).every((key) => CONTEXT_KEYS.has(key))) {
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

function validateMonitoringReadModel(value: unknown): value is MonitoringReadModel {
  if (!isRecord(value)) {
    return false;
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
    typeof value.recordCount !== "number" ||
    !Number.isInteger(value.recordCount) ||
    value.recordCount < 0 ||
    !Array.isArray(value.records) ||
    value.recordCount !== value.records.length
  ) {
    return false;
  }

  const seen = new Set<string>();
  let previousPerformedAt: string | null = null;
  let previousRecordId: string | null = null;

  for (const record of value.records) {
    if (!isRecord(record) || !isRecord(record.Procedure)) {
      return false;
    }

    if (
      !isNonEmptyString(record.RecordId) ||
      !isNonEmptyString(record.Procedure.ProcedureId) ||
      !isNonEmptyString(record.Procedure.ProcedureVersion) ||
      record.Procedure.ApprovalState !== "APPROVED" ||
      !RESULT_VALUES.has(record.result as ProcedureRecordResult) ||
      !isValidIsoDateTime(record.performedAt) ||
      !isValidIsoDateTime(record.recordedAt) ||
      record.planId !== value.planId ||
      record.planVersion !== value.planVersion
    ) {
      return false;
    }

    if (seen.has(record.RecordId)) {
      return false;
    }
    seen.add(record.RecordId);

    if (previousPerformedAt !== null && previousRecordId !== null) {
      const timeOrder = Date.parse(previousPerformedAt) - Date.parse(record.performedAt);
      if (
        timeOrder > 0 ||
        (timeOrder === 0 && previousRecordId.localeCompare(record.RecordId) > 0)
      ) {
        return false;
      }
    }
    previousPerformedAt = record.performedAt;
    previousRecordId = record.RecordId;
  }

  return true;
}

function contextMatches(
  model: MonitoringReadModel,
  context: ReviewPresentationContext,
): boolean {
  return (
    model.OrganizationId === context.OrganizationId &&
    model.SiteId === context.SiteId &&
    model.UserId === context.UserId &&
    model.planId === context.planId &&
    model.planVersion === context.planVersion &&
    model.periodStart === context.periodStart &&
    model.periodEnd === context.periodEnd
  );
}

/**
 * Deterministically project already-resolved Monitoring evidence into human review materials.
 *
 * This layer never re-filters ProcedureRecord evidence, never substitutes another plan/version/period,
 * and never derives review outcomes, effectiveness, staff performance, recommendations, rates, or trends.
 */
export function buildHumanReviewMaterials(
  monitoringInput: unknown,
  presentationContextInput?: unknown,
): HumanReviewMaterialsBuildResult {
  if (!validateMonitoringReadModel(monitoringInput)) {
    return { status: "MALFORMED_INPUT" };
  }

  if (presentationContextInput !== undefined) {
    const context = parsePresentationContext(presentationContextInput);
    if (context === null) {
      return { status: "MALFORMED_INPUT" };
    }
    if (!contextMatches(monitoringInput, context)) {
      return { status: "CONTEXT_MISMATCH" };
    }
  }

  return {
    status: "RESOLVED",
    value: {
      OrganizationId: monitoringInput.OrganizationId,
      SiteId: monitoringInput.SiteId,
      UserId: monitoringInput.UserId,
      planId: monitoringInput.planId,
      planVersion: monitoringInput.planVersion,
      periodStart: monitoringInput.periodStart,
      periodEnd: monitoringInput.periodEnd,
      recordCount: monitoringInput.recordCount,
      records: monitoringInput.records.map((record) => ({
        RecordId: record.RecordId,
        ProcedureId: record.Procedure.ProcedureId,
        ProcedureVersion: record.Procedure.ProcedureVersion,
        result: record.result,
        performedAt: record.performedAt,
        recordedAt: record.recordedAt,
      })),
      humanInterpretationRequired: true,
    },
  };
}
