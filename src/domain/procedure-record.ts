import {
  ASIA_TOKYO_TIME_ZONE,
  type ApprovedProcedureReference,
  type LocalDate,
  type LookupResult,
} from "../contracts/types";
import type { SupportPlanVersion } from "./support-plan";
import { toAsiaTokyoCalendarDay } from "./support-plan";
import type { SupportPlanVersionProcedureBinding } from "./support-plan-version-procedure-binding";
import type { SupportRecordTraceRef } from "./support-record-trace";
import { sha256Hex } from "./sha256";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

/**
 * Schema identity for ProcedureRecord
 * (Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1 / Issue #352).
 */
export const PROCEDURE_RECORD_SCHEMA_ID =
  "severe-behavior-support.procedure-record.record" as const;
export const PROCEDURE_RECORD_SCHEMA_VERSION = "1.0.0" as const;

/**
 * Result vocabulary — factual outcomes, not staff success/failure.
 * Mapping to FAILED / error / violation is forbidden.
 */
export const PROCEDURE_RECORD_RESULTS = [
  "PERFORMED_AS_PLANNED",
  "PERFORMED_WITH_ADAPTATION",
  "NOT_PERFORMED",
] as const;

export type ProcedureRecordResult = (typeof PROCEDURE_RECORD_RESULTS)[number];

/**
 * First-class support-procedure execution record (B-PKG-1).
 * Does not mutate ExecutionRecord / AbcRecord. Procedure body stays outside (A2).
 */
export type ProcedureRecord = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  TimeZone: typeof ASIA_TOKYO_TIME_ZONE;
  RecordId: string;
  IdempotencyKey: string;
  PayloadFingerprint: string;
  Procedure: ApprovedProcedureReference;
  LocalDate: LocalDate;
  planId: string;
  planVersion: number;
  result: ProcedureRecordResult;
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

export type ProcedureRecordDto = Readonly<{
  schemaId: typeof PROCEDURE_RECORD_SCHEMA_ID;
  schemaVersion: typeof PROCEDURE_RECORD_SCHEMA_VERSION;
  dtoVersion: typeof PROCEDURE_RECORD_SCHEMA_VERSION;
  data: ProcedureRecord;
}>;

/**
 * Fields that PayloadFingerprint must constrain (B-PKG-1 §3.4).
 * Fingerprint itself remains an opaque non-empty string (ExecutionRecord meaning).
 */
export type ProcedureRecordFingerprintMaterial = Readonly<{
  planId: string;
  planVersion: number;
  ProcedureId: string;
  ProcedureVersion: string;
  result: ProcedureRecordResult;
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

export const toProcedureRecordDto = (data: ProcedureRecord): ProcedureRecordDto => ({
  schemaId: PROCEDURE_RECORD_SCHEMA_ID,
  schemaVersion: PROCEDURE_RECORD_SCHEMA_VERSION,
  dtoVersion: PROCEDURE_RECORD_SCHEMA_VERSION,
  data,
});

export function isProcedureRecordResult(value: unknown): value is ProcedureRecordResult {
  return (
    typeof value === "string" && (PROCEDURE_RECORD_RESULTS as readonly string[]).includes(value)
  );
}

function isApprovedProcedureReference(value: unknown): value is ApprovedProcedureReference {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.ProcedureId) &&
    isNonEmptyString(value.ProcedureVersion) &&
    value.ApprovalState === "APPROVED"
  );
}

function isLocalDateString(value: unknown): value is LocalDate {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isoDateTimeMs(value: string): number | null {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export function procedureRecordFingerprintMaterial(
  record: ProcedureRecord,
): ProcedureRecordFingerprintMaterial {
  return {
    planId: record.planId,
    planVersion: record.planVersion,
    ProcedureId: record.Procedure.ProcedureId,
    ProcedureVersion: record.Procedure.ProcedureVersion,
    result: record.result,
    performedAt: record.performedAt,
    recordedAt: record.recordedAt,
    recordedBy: record.recordedBy,
  };
}

/** Same unit-separator framing as FindingIdentity (opaque digest; not a new vocabulary). */
export const PROCEDURE_RECORD_IDENTITY_SEPARATOR = "\u001f";

export function computeProcedureRecordPayloadFingerprint(
  material: ProcedureRecordFingerprintMaterial,
): string {
  return sha256Hex(
    [
      material.planId,
      String(material.planVersion),
      material.ProcedureId,
      material.ProcedureVersion,
      material.result,
      material.performedAt,
      material.recordedAt,
      material.recordedBy,
    ].join(PROCEDURE_RECORD_IDENTITY_SEPARATOR),
  );
}

export type ProcedureRecordIdentityMintInput = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  ProcedureId: string;
  ProcedureVersion: string;
  result: ProcedureRecordResult;
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

/**
 * Deterministic RecordId / IdempotencyKey for one CREATE payload.
 * Retry of the same payload reuses the same keys (persist dual-lookup REPLAY).
 */
export function mintProcedureRecordIdentity(
  input: ProcedureRecordIdentityMintInput,
): Readonly<{ RecordId: string; IdempotencyKey: string }> {
  const material = [
    input.OrganizationId,
    input.SiteId,
    input.UserId,
    input.planId,
    String(input.planVersion),
    input.ProcedureId,
    input.ProcedureVersion,
    input.result,
    input.performedAt,
    input.recordedAt,
    input.recordedBy,
  ].join(PROCEDURE_RECORD_IDENTITY_SEPARATOR);

  return {
    RecordId: sha256Hex(
      `procedure-record.record-id${PROCEDURE_RECORD_IDENTITY_SEPARATOR}${material}`,
    ),
    IdempotencyKey: sha256Hex(
      `procedure-record.idempotency-key${PROCEDURE_RECORD_IDENTITY_SEPARATOR}${material}`,
    ),
  };
}

export function validateProcedureRecord(value: unknown): value is ProcedureRecord {
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

export function validateProcedureRecordDto(value: unknown): value is ProcedureRecordDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaId === PROCEDURE_RECORD_SCHEMA_ID &&
    value.schemaVersion === PROCEDURE_RECORD_SCHEMA_VERSION &&
    value.dtoVersion === PROCEDURE_RECORD_SCHEMA_VERSION &&
    validateProcedureRecord(value.data)
  );
}

/**
 * Issue A alignment: org/site/user + plan/version + approved procedure must match binding.
 */
export function procedureRecordMatchesBinding(
  record: ProcedureRecord,
  binding: SupportPlanVersionProcedureBinding,
): boolean {
  return (
    record.OrganizationId === binding.OrganizationId &&
    record.SiteId === binding.SiteId &&
    record.UserId === binding.UserId &&
    record.planId === binding.planId &&
    record.planVersion === binding.planVersion &&
    record.Procedure.ProcedureId === binding.Procedure.ProcedureId &&
    record.Procedure.ProcedureVersion === binding.Procedure.ProcedureVersion &&
    record.Procedure.ApprovalState === binding.Procedure.ApprovalState
  );
}

/**
 * Derive TraceRef from ProcedureRecord — TraceRef is not a second canonical body.
 */
export function deriveSupportRecordTraceRefFromProcedureRecord(
  record: ProcedureRecord,
): SupportRecordTraceRef {
  return {
    RecordId: record.RecordId,
    planId: record.planId,
    planVersion: record.planVersion,
    recordedAt: record.recordedAt,
    recordedBy: record.recordedBy,
  };
}

/**
 * FW-05: projection / review must use the record's frozen planVersion, never Active currentVersion.
 */
export function planVersionForProcedureRecordProjection(record: ProcedureRecord): number {
  return record.planVersion;
}

export type HistoricalPlanVersionResolution<T> =
  | Readonly<{ status: "RESOLVED"; value: T }>
  | Readonly<{
      status: "UNRESOLVED";
      reason: "EMPTY" | "UNKNOWN" | "FETCH_FAILED" | "VERSION_MISMATCH" | "PLAN_MISMATCH";
    }>;

/**
 * FW05-HIST-02: historical plan/version lookup must not fall back to a newer Active version.
 */
export function resolveHistoricalPlanVersionForProcedureRecord(
  record: ProcedureRecord,
  historicalLookup: LookupResult<SupportPlanVersion>,
): HistoricalPlanVersionResolution<SupportPlanVersion> {
  if (historicalLookup.status === "EMPTY") {
    return { status: "UNRESOLVED", reason: "EMPTY" };
  }
  if (historicalLookup.status === "UNKNOWN") {
    return { status: "UNRESOLVED", reason: "UNKNOWN" };
  }
  if (historicalLookup.status === "FETCH_FAILED") {
    return { status: "UNRESOLVED", reason: "FETCH_FAILED" };
  }

  const planVersion = historicalLookup.value;
  if (planVersion.planId !== record.planId) {
    return { status: "UNRESOLVED", reason: "PLAN_MISMATCH" };
  }
  if (planVersion.version !== record.planVersion) {
    return { status: "UNRESOLVED", reason: "VERSION_MISMATCH" };
  }

  return { status: "RESOLVED", value: planVersion };
}

/**
 * A2 presentation projection source for a record — only from matching historical planVersion.
 * Does not invent body fields; returns planVersion content arrays for presentation use.
 */
export function projectProcedureRecordSupportContent(
  record: ProcedureRecord,
  historicalPlanVersion: SupportPlanVersion,
): Readonly<{
  planId: string;
  planVersion: number;
  supportMethods: readonly string[];
  precautions: readonly string[];
}> | null {
  if (
    historicalPlanVersion.planId !== record.planId ||
    historicalPlanVersion.version !== record.planVersion
  ) {
    return null;
  }

  return {
    planId: record.planId,
    planVersion: record.planVersion,
    supportMethods: historicalPlanVersion.supportMethods,
    precautions: historicalPlanVersion.precautions,
  };
}
