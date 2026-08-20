/**
 * ProcedureRecordCorrection domain contract
 * (FIELD-STAFF-CORRECTION-PERSISTENCE-DOMAIN-CONTRACT-FAKE-PORT-1).
 *
 * Binding: C1=A / C2=D / C3=D / C4=B / C5=E / C6=A / C7=A / C8=A / C9=B
 * ProcedureRecord remains CREATE-ONLY / IMMUTABLE.
 * Correction is APPEND-ONLY / originalRecordId-bound.
 * liveWriteAuthorized remains false.
 */

import type { ApprovedProcedureReference, LocalDate } from "../contracts/types";
import {
  isProcedureRecordResult,
  PROCEDURE_RECORD_IDENTITY_SEPARATOR,
  type ProcedureRecordResult,
} from "./procedure-record";
import { toAsiaTokyoCalendarDay } from "./support-plan";
import { sha256Hex } from "./sha256";
import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

export const PROCEDURE_RECORD_CORRECTION_SCHEMA_ID =
  "severe-behavior-support.procedure-record-correction.record" as const;
export const PROCEDURE_RECORD_CORRECTION_SCHEMA_VERSION = "1.0.0" as const;

/** C9=B: source/test work must never mint a live write authorization. */
export const PROCEDURE_RECORD_CORRECTION_LIVE_WRITE_AUTHORIZED = false as const;

/** Same U+001F framing as ProcedureRecord / FindingIdentity. */
export const PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR = PROCEDURE_RECORD_IDENTITY_SEPARATOR;

/** Versioned correction-specific namespaces (C2=D). Separate from ProcedureRecord. */
export const PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE =
  "procedure-record-correction.correction-id.v1" as const;
export const PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE =
  "procedure-record-correction.idempotency-key.v1" as const;

/**
 * Append-only correction entity bound to an immutable original ProcedureRecord.
 * Does not replace or update the original.
 */
export type ProcedureRecordCorrection = Readonly<{
  CorrectionId: string;
  IdempotencyKey: string;
  originalRecordId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  originalRecordedAt: string;
  originalRecordedBy: string;
  originalLocalDate: LocalDate;
  result: ProcedureRecordResult;
  performedAt: string;
  reason: string;
  correctedAt: string;
  correctedBy: string;
}>;

/** C3=D / C4=B: client-editable factual fields plus required free-text reason. */
export type ProcedureRecordCorrectionClientInput = Readonly<{
  originalRecordId: string;
  result: unknown;
  performedAt: string;
  reason: string;
}>;

/** Immutable original binding/context. Not client-editable factual input. */
export type ProcedureRecordCorrectionOriginalBinding = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  originalRecordedAt: string;
  originalRecordedBy: string;
  originalLocalDate: LocalDate;
}>;

/**
 * C5=E: authenticated FIELD_STAFF authority boundary.
 * Actor identity is system-derived; client actor strings are forbidden.
 */
export type FieldStaffCorrectionAuthContext =
  | Readonly<{ status: "AUTHORIZED"; correctedBy: string }>
  | Readonly<{ status: "NOT_AUTHENTICATED" }>
  | Readonly<{ status: "NOT_AUTHORIZED" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export type AssembleProcedureRecordCorrectionInput = Readonly<{
  client: ProcedureRecordCorrectionClientInput;
  originalBinding: ProcedureRecordCorrectionOriginalBinding;
  auth: FieldStaffCorrectionAuthContext;
  /** Frozen from the first attempt of this payload; retry must reuse it. */
  correctedAtIso?: string;
  nowIso: string;
}>;

export type AssembleProcedureRecordCorrectionResult =
  | Readonly<{ ok: true; correction: ProcedureRecordCorrection }>
  | Readonly<{
      ok: false;
      reason:
        | "INVALID_INPUT"
        | "NOT_AUTHENTICATED"
        | "NOT_AUTHORIZED"
        | "AUTH_INDETERMINATE"
        | "FORBIDDEN_CLIENT_FIELD";
    }>;

const CLIENT_INPUT_KEYS = new Set(["originalRecordId", "result", "performedAt", "reason"] as const);

const FORBIDDEN_CLIENT_FIELD_KEYS = new Set([
  "correctedBy",
  "correctedAt",
  "CorrectionId",
  "IdempotencyKey",
  "OrganizationId",
  "SiteId",
  "UserId",
  "Procedure",
  "planId",
  "planVersion",
  "originalRecordedAt",
  "originalRecordedBy",
  "originalLocalDate",
  "recordedAt",
  "recordedBy",
  "RecordId",
  "PayloadFingerprint",
  "LocalDate",
  "TimeZone",
] as const);

function isLocalDateString(value: unknown): value is LocalDate {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
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

function hasUnsupportedControlCharacters(value: string): boolean {
  // Intentional: reject C0/DEL/C1 in identity fields.
  // eslint-disable-next-line no-control-regex -- domain validation requires C0/C1 detection
  return /[\u0000-\u001F\u007F-\u009F]/.test(value);
}

function requiredIdentity(value: unknown): string | null {
  if (
    !isNonEmptyString(value) ||
    value !== value.trim() ||
    hasUnsupportedControlCharacters(value)
  ) {
    return null;
  }
  return value;
}

function requiredReason(value: unknown): string | null {
  if (!isNonEmptyString(value)) {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || hasUnsupportedControlCharacters(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Rejects raw client objects that smuggle derived/system or original-binding fields.
 */
export function rejectForbiddenCorrectionClientFields(
  value: unknown,
): Readonly<{ ok: true }> | Readonly<{ ok: false; reason: "FORBIDDEN_CLIENT_FIELD" }> {
  if (!isRecord(value)) {
    return { ok: false, reason: "FORBIDDEN_CLIENT_FIELD" };
  }
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_CLIENT_FIELD_KEYS.has(key as never) || !CLIENT_INPUT_KEYS.has(key as never)) {
      return { ok: false, reason: "FORBIDDEN_CLIENT_FIELD" };
    }
  }
  return { ok: true };
}

export type ProcedureRecordCorrectionFrozenPayload = Readonly<{
  result: ProcedureRecordResult;
  performedAt: string;
  reason: string;
  correctedAt: string;
  correctedBy: string;
}>;

/** Canonical frozen payload material (U+001F-framed field order is stable). */
export function freezeProcedureRecordCorrectionPayload(
  material: ProcedureRecordCorrectionFrozenPayload,
): string {
  return [
    material.result,
    material.performedAt,
    material.reason,
    material.correctedAt,
    material.correctedBy,
  ].join(PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR);
}

/**
 * Deterministic CorrectionId / IdempotencyKey (C2=D).
 * Same frozen payload retry reuses both; changed payload is a different submit.
 */
export function mintProcedureRecordCorrectionIdentity(
  originalRecordId: string,
  frozenPayload: string,
): Readonly<{ CorrectionId: string; IdempotencyKey: string }> {
  const framed = [originalRecordId, frozenPayload].join(
    PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR,
  );

  return {
    CorrectionId: sha256Hex(
      `${PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`,
    ),
    IdempotencyKey: sha256Hex(
      `${PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`,
    ),
  };
}

export function validateProcedureRecordCorrection(
  value: unknown,
): value is ProcedureRecordCorrection {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNonEmptyString(value.CorrectionId) ||
    !isNonEmptyString(value.IdempotencyKey) ||
    !isNonEmptyString(value.originalRecordId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isApprovedProcedureReference(value.Procedure) ||
    !isNonEmptyString(value.planId) ||
    typeof value.planVersion !== "number" ||
    !Number.isInteger(value.planVersion) ||
    value.planVersion < 1 ||
    !isValidIsoDateTime(value.originalRecordedAt) ||
    !isNonEmptyString(value.originalRecordedBy) ||
    !isLocalDateString(value.originalLocalDate) ||
    !isProcedureRecordResult(value.result) ||
    !isValidIsoDateTime(value.performedAt) ||
    !isNonEmptyString(value.reason) ||
    value.reason.trim() !== value.reason ||
    !isValidIsoDateTime(value.correctedAt) ||
    !isNonEmptyString(value.correctedBy)
  ) {
    return false;
  }

  if (value.CorrectionId === value.IdempotencyKey) {
    return false;
  }

  const tokyoDay = toAsiaTokyoCalendarDay(value.performedAt);
  if (tokyoDay === null || tokyoDay !== value.originalLocalDate) {
    return false;
  }

  return true;
}

/**
 * Assemble a correction from client fields + immutable original binding + auth.
 * Does not mutate ProcedureRecord. Does not emit lifecycle events (C7=A).
 */
export function assembleProcedureRecordCorrection(
  input: AssembleProcedureRecordCorrectionInput,
): AssembleProcedureRecordCorrectionResult {
  const forbidden = rejectForbiddenCorrectionClientFields(input.client);
  if (!forbidden.ok) {
    return forbidden;
  }

  if (input.auth.status === "NOT_AUTHENTICATED") {
    return { ok: false, reason: "NOT_AUTHENTICATED" };
  }
  if (input.auth.status === "NOT_AUTHORIZED") {
    return { ok: false, reason: "NOT_AUTHORIZED" };
  }
  if (input.auth.status === "INDETERMINATE") {
    return { ok: false, reason: "AUTH_INDETERMINATE" };
  }

  const originalRecordId = requiredIdentity(input.client.originalRecordId);
  const reason = requiredReason(input.client.reason);
  const organizationId = requiredIdentity(input.originalBinding.OrganizationId);
  const siteId = requiredIdentity(input.originalBinding.SiteId);
  const userId = requiredIdentity(input.originalBinding.UserId);
  const planId = requiredIdentity(input.originalBinding.planId);
  const originalRecordedBy = requiredIdentity(input.originalBinding.originalRecordedBy);
  const correctedBy = requiredIdentity(input.auth.correctedBy);

  if (
    originalRecordId === null ||
    reason === null ||
    organizationId === null ||
    siteId === null ||
    userId === null ||
    planId === null ||
    originalRecordedBy === null ||
    correctedBy === null ||
    !isApprovedProcedureReference(input.originalBinding.Procedure) ||
    !Number.isInteger(input.originalBinding.planVersion) ||
    input.originalBinding.planVersion < 1 ||
    !isProcedureRecordResult(input.client.result) ||
    !isValidIsoDateTime(input.client.performedAt) ||
    !isValidIsoDateTime(input.originalBinding.originalRecordedAt) ||
    !isLocalDateString(input.originalBinding.originalLocalDate)
  ) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const tokyoDay = toAsiaTokyoCalendarDay(input.client.performedAt);
  if (tokyoDay === null || tokyoDay !== input.originalBinding.originalLocalDate) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const correctedAt = isNonEmptyString(input.correctedAtIso) ? input.correctedAtIso : input.nowIso;
  if (!isValidIsoDateTime(correctedAt)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const frozenPayload = freezeProcedureRecordCorrectionPayload({
    result: input.client.result,
    performedAt: input.client.performedAt,
    reason,
    correctedAt,
    correctedBy,
  });
  const identity = mintProcedureRecordCorrectionIdentity(originalRecordId, frozenPayload);

  const correction: ProcedureRecordCorrection = {
    CorrectionId: identity.CorrectionId,
    IdempotencyKey: identity.IdempotencyKey,
    originalRecordId,
    OrganizationId: organizationId,
    SiteId: siteId,
    UserId: userId,
    Procedure: {
      ProcedureId: input.originalBinding.Procedure.ProcedureId,
      ProcedureVersion: input.originalBinding.Procedure.ProcedureVersion,
      ApprovalState: "APPROVED",
    },
    planId,
    planVersion: input.originalBinding.planVersion,
    originalRecordedAt: input.originalBinding.originalRecordedAt,
    originalRecordedBy,
    originalLocalDate: input.originalBinding.originalLocalDate,
    result: input.client.result,
    performedAt: input.client.performedAt,
    reason,
    correctedAt,
    correctedBy,
  };

  if (!validateProcedureRecordCorrection(correction)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  return { ok: true, correction };
}

/**
 * Read projection only (C6=A). Does not mutate stored corrections.
 * Latest by correctedAt, with CorrectionId ascending as stable tie-break.
 */
export function projectLatestCorrectionFacts(
  corrections: readonly ProcedureRecordCorrection[],
): ProcedureRecordCorrection | null {
  const ordered = orderProcedureRecordCorrections(corrections);
  if (ordered.length === 0) {
    return null;
  }
  return ordered[ordered.length - 1] ?? null;
}

export function orderProcedureRecordCorrections(
  corrections: readonly ProcedureRecordCorrection[],
): readonly ProcedureRecordCorrection[] {
  return [...corrections].sort((left, right) => {
    if (left.correctedAt !== right.correctedAt) {
      return left.correctedAt < right.correctedAt ? -1 : 1;
    }
    if (left.CorrectionId === right.CorrectionId) {
      return 0;
    }
    return left.CorrectionId < right.CorrectionId ? -1 : 1;
  });
}

/**
 * Field-level copy of a correction. Nested Procedure is copied separately
 * so a returned value cannot mutate stored original-context objects.
 */
export function copyProcedureRecordCorrection(
  correction: ProcedureRecordCorrection,
): ProcedureRecordCorrection {
  return {
    CorrectionId: correction.CorrectionId,
    IdempotencyKey: correction.IdempotencyKey,
    originalRecordId: correction.originalRecordId,
    OrganizationId: correction.OrganizationId,
    SiteId: correction.SiteId,
    UserId: correction.UserId,
    Procedure: {
      ProcedureId: correction.Procedure.ProcedureId,
      ProcedureVersion: correction.Procedure.ProcedureVersion,
      ApprovalState: correction.Procedure.ApprovalState,
    },
    planId: correction.planId,
    planVersion: correction.planVersion,
    originalRecordedAt: correction.originalRecordedAt,
    originalRecordedBy: correction.originalRecordedBy,
    originalLocalDate: correction.originalLocalDate,
    result: correction.result,
    performedAt: correction.performedAt,
    reason: correction.reason,
    correctedAt: correction.correctedAt,
    correctedBy: correction.correctedBy,
  };
}
