import type { LookupResult } from "../contracts/types";
import { validateProcedureRecord, type ProcedureRecord } from "./procedure-record";
import { isRecord } from "./validation";

/**
 * Persistence adapter results (Decision-PROCEDURE-RECORD-PERSISTENCE-1 D9).
 * These are not ProcedureRecord.result.
 */
export const PROCEDURE_RECORD_SAVE_OUTCOMES = [
  "saved",
  "save_failed",
  "save_outcome_unknown",
] as const;

export type ProcedureRecordSaveOutcome = (typeof PROCEDURE_RECORD_SAVE_OUTCOMES)[number];

/**
 * Physical create attempt only. Orchestration owns dual lookup and GET-by-RecordId.
 * v1 has no update / delete.
 */
export type ProcedureRecordCreateAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export interface ProcedureRecordPersistencePort {
  findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>>;
  findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecord>>;
  create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt>;
}

export type ProcedureRecordLookupClassification =
  | Readonly<{ kind: "ACCEPT_NEW" }>
  | Readonly<{ kind: "REPLAY"; persisted: ProcedureRecord }>
  | Readonly<{ kind: "CONFLICT" }>
  | Readonly<{ kind: "DEFINITE_FAILURE" }>
  | Readonly<{ kind: "LOOKUP_UNAVAILABLE"; reason: "UNKNOWN" | "FETCH_FAILED" }>;

/** D9: schema / identity / configuration failures are definite, not unknown. */
export const DEFINITE_LOOKUP_FAILURE_CODES = [
  "MALFORMED_PHYSICAL",
  "MULTI_MATCH",
  "SITE_BINDING_MISMATCH",
  "LIST_BINDING_MISSING",
  "INVALID_LOOKUP_RESULT",
] as const;

export type DefiniteLookupFailureCode = (typeof DEFINITE_LOOKUP_FAILURE_CODES)[number];

export function isDefiniteLookupFailureCode(code: string): code is DefiniteLookupFailureCode {
  return (DEFINITE_LOOKUP_FAILURE_CODES as readonly string[]).includes(code);
}

const IMMUTABLE_CONTEXT_FIELDS = [
  "OrganizationId",
  "SiteId",
  "UserId",
  "RecordId",
  "IdempotencyKey",
  "planId",
  "planVersion",
  "result",
  "performedAt",
  "recordedAt",
  "recordedBy",
  "LocalDate",
  "PayloadFingerprint",
] as const satisfies ReadonlyArray<keyof ProcedureRecord>;

function sameProcedure(
  left: ProcedureRecord["Procedure"],
  right: ProcedureRecord["Procedure"],
): boolean {
  return (
    left.ProcedureId === right.ProcedureId &&
    left.ProcedureVersion === right.ProcedureVersion &&
    left.ApprovalState === right.ApprovalState
  );
}

function sameProcedureRecord(left: ProcedureRecord, right: ProcedureRecord): boolean {
  return (
    IMMUTABLE_CONTEXT_FIELDS.every((field) => left[field] === right[field]) &&
    sameProcedure(left.Procedure, right.Procedure) &&
    left.TimeZone === right.TimeZone
  );
}

function isLookupResult(value: unknown): value is LookupResult<ProcedureRecord> {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }
  if (value.status === "EMPTY") {
    return true;
  }
  if (value.status === "FOUND") {
    return validateProcedureRecord(value.value);
  }
  if (value.status === "UNKNOWN") {
    return (
      value.reason === "NOT_AUTHENTICATED" ||
      value.reason === "NOT_AUTHORIZED" ||
      value.reason === "INDETERMINATE"
    );
  }
  if (value.status === "FETCH_FAILED") {
    return typeof value.code === "string";
  }
  return false;
}

async function performLookup(
  lookup: () => Promise<LookupResult<ProcedureRecord>>,
): Promise<LookupResult<ProcedureRecord>> {
  try {
    const result = await lookup();
    if (!isLookupResult(result)) {
      return { status: "FETCH_FAILED", code: "INVALID_LOOKUP_RESULT" };
    }
    return result;
  } catch {
    return { status: "FETCH_FAILED", code: "LOOKUP_THREW" };
  }
}

function isDefiniteLookupFailure(result: LookupResult<ProcedureRecord>): boolean {
  return result.status === "FETCH_FAILED" && isDefiniteLookupFailureCode(result.code);
}

function isIndeterminateLookupFailure(result: LookupResult<ProcedureRecord>): boolean {
  if (result.status === "UNKNOWN") {
    return true;
  }
  return result.status === "FETCH_FAILED" && !isDefiniteLookupFailureCode(result.code);
}

export function classifyProcedureRecordLookups(
  incoming: ProcedureRecord,
  byRecordId: LookupResult<ProcedureRecord>,
  byIdempotencyKey: LookupResult<ProcedureRecord>,
): ProcedureRecordLookupClassification {
  if (isDefiniteLookupFailure(byRecordId) || isDefiniteLookupFailure(byIdempotencyKey)) {
    return { kind: "DEFINITE_FAILURE" };
  }
  if (isIndeterminateLookupFailure(byRecordId) || isIndeterminateLookupFailure(byIdempotencyKey)) {
    return {
      kind: "LOOKUP_UNAVAILABLE",
      reason:
        byRecordId.status === "UNKNOWN" || byIdempotencyKey.status === "UNKNOWN"
          ? "UNKNOWN"
          : "FETCH_FAILED",
    };
  }

  if (byRecordId.status === "EMPTY" && byIdempotencyKey.status === "EMPTY") {
    return { kind: "ACCEPT_NEW" };
  }

  if (byRecordId.status !== "FOUND" || byIdempotencyKey.status !== "FOUND") {
    return { kind: "CONFLICT" };
  }

  if (!sameProcedureRecord(byRecordId.value, byIdempotencyKey.value)) {
    return { kind: "CONFLICT" };
  }

  const persisted = byRecordId.value;
  if (sameProcedureRecord(persisted, incoming)) {
    return { kind: "REPLAY", persisted };
  }

  return { kind: "CONFLICT" };
}

function matchesSavedReadBack(incoming: ProcedureRecord, persisted: ProcedureRecord): boolean {
  return (
    persisted.RecordId === incoming.RecordId &&
    persisted.planId === incoming.planId &&
    persisted.planVersion === incoming.planVersion &&
    sameProcedure(persisted.Procedure, incoming.Procedure) &&
    persisted.result === incoming.result &&
    persisted.performedAt === incoming.performedAt &&
    persisted.recordedAt === incoming.recordedAt &&
    persisted.OrganizationId === incoming.OrganizationId &&
    persisted.SiteId === incoming.SiteId
  );
}

async function savedAfterGetByRecordId(
  incoming: ProcedureRecord,
  port: ProcedureRecordPersistencePort,
): Promise<ProcedureRecordSaveOutcome> {
  const readBack = await performLookup(() => port.findByRecordId(incoming.RecordId));
  if (isDefiniteLookupFailure(readBack)) {
    return "save_failed";
  }
  if (readBack.status === "UNKNOWN" || readBack.status === "FETCH_FAILED") {
    return "save_outcome_unknown";
  }
  if (readBack.status !== "FOUND") {
    return "save_outcome_unknown";
  }
  if (!matchesSavedReadBack(incoming, readBack.value)) {
    return "save_failed";
  }
  return "saved";
}

async function reconcileAfterUnknown(
  incoming: ProcedureRecord,
  port: ProcedureRecordPersistencePort,
): Promise<ProcedureRecordSaveOutcome> {
  const [byRecordId, byIdempotencyKey] = await Promise.all([
    performLookup(() => port.findByRecordId(incoming.RecordId)),
    performLookup(() => port.findByIdempotencyKey(incoming.IdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordLookups(incoming, byRecordId, byIdempotencyKey);
  if (classified.kind === "REPLAY") {
    return savedAfterGetByRecordId(incoming, port);
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  return "save_outcome_unknown";
}

/**
 * Dual-lookup CREATE-ONLY persistence.
 * GET-by-RecordId is required before `saved`.
 * `save_outcome_unknown` never automatically retries create.
 */
export async function persistProcedureRecord(
  record: ProcedureRecord,
  port: ProcedureRecordPersistencePort,
): Promise<ProcedureRecordSaveOutcome> {
  if (!validateProcedureRecord(record)) {
    return "save_failed";
  }

  const [byRecordId, byIdempotencyKey] = await Promise.all([
    performLookup(() => port.findByRecordId(record.RecordId)),
    performLookup(() => port.findByIdempotencyKey(record.IdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordLookups(record, byRecordId, byIdempotencyKey);

  if (classified.kind === "LOOKUP_UNAVAILABLE") {
    return "save_outcome_unknown";
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  if (classified.kind === "REPLAY") {
    return savedAfterGetByRecordId(record, port);
  }

  const created = await port.create(record);
  if (created.status === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  if (created.status === "INDETERMINATE") {
    return reconcileAfterUnknown(record, port);
  }

  return savedAfterGetByRecordId(record, port);
}
