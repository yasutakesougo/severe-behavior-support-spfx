/**
 * Staff UI → ProcedureRecord CREATE mapping.
 * Reuses persistProcedureRecord. Does not add schema, slot, chips, or D6 update/delete.
 */

import { ASIA_TOKYO_TIME_ZONE, type LocalDate } from "../contracts/types";
import {
  computeProcedureRecordPayloadFingerprint,
  isProcedureRecordResult,
  mintProcedureRecordIdentity,
  validateProcedureRecord,
  type ProcedureRecord,
} from "./procedure-record";
import {
  persistProcedureRecord,
  type ProcedureRecordPersistencePort,
  type ProcedureRecordSaveOutcome,
} from "./procedure-record-persistence";
import { toAsiaTokyoCalendarDay } from "./support-plan";
import { isNonEmptyString, isValidIsoDateTime } from "./validation";

export type StaffProcedureRecordCreateInput = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  recordedBy: string;
  planId: string;
  planVersion: number;
  ProcedureId: string;
  ProcedureVersion: string;
  result: unknown;
  performedAtLocal: string;
  /** Frozen from the first attempt of this payload; retry must reuse it. */
  recordedAtIso?: string;
  nowIso: string;
}>;

export type AssembleProcedureRecordForCreateResult =
  | Readonly<{ ok: true; record: ProcedureRecord }>
  | Readonly<{ ok: false; reason: "INVALID_INPUT" }>;

const DATETIME_LOCAL_RE = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/;

/**
 * datetime-local (Tokyo wall clock) → D4=A ISO DateTime string (+09:00).
 */
export function asiaTokyoDateTimeLocalToIso(local: string): string | null {
  if (!isNonEmptyString(local)) {
    return null;
  }
  const match = DATETIME_LOCAL_RE.exec(local.trim());
  if (!match) {
    return null;
  }
  const seconds = match[3] ?? "00";
  const iso = `${match[1]}T${match[2]}:${seconds}+09:00`;
  return isValidIsoDateTime(iso) ? iso : null;
}

export function formatInstantAsAsiaTokyoIsoDateTime(instant: Date): string | null {
  if (Number.isNaN(instant.getTime())) {
    return null;
  }

  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: ASIA_TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: ASIA_TOKYO_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(instant);
  const iso = `${datePart}T${timePart}+09:00`;
  return isValidIsoDateTime(iso) ? iso : null;
}

export function nowAsiaTokyoIsoDateTime(): string | null {
  return formatInstantAsAsiaTokyoIsoDateTime(new Date());
}

function hasUnsupportedControlCharacters(value: string): boolean {
  // Intentional: reject C0/DEL/C1 in identity fields (same as FindingIdentity).
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

export function assembleProcedureRecordForCreate(
  input: StaffProcedureRecordCreateInput,
): AssembleProcedureRecordForCreateResult {
  const organizationId = requiredIdentity(input.OrganizationId);
  const siteId = requiredIdentity(input.SiteId);
  const userId = requiredIdentity(input.UserId);
  const recordedBy = requiredIdentity(input.recordedBy);
  const planId = requiredIdentity(input.planId);
  const procedureId = requiredIdentity(input.ProcedureId);
  const procedureVersion = requiredIdentity(input.ProcedureVersion);

  if (
    organizationId === null ||
    siteId === null ||
    userId === null ||
    recordedBy === null ||
    planId === null ||
    procedureId === null ||
    procedureVersion === null ||
    !Number.isInteger(input.planVersion) ||
    input.planVersion < 1 ||
    !isProcedureRecordResult(input.result)
  ) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const performedAt = asiaTokyoDateTimeLocalToIso(input.performedAtLocal);
  const recordedAt = isNonEmptyString(input.recordedAtIso) ? input.recordedAtIso : input.nowIso;
  if (performedAt === null || !isValidIsoDateTime(recordedAt)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const localDate = toAsiaTokyoCalendarDay(performedAt);
  if (localDate === null) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  const identity = mintProcedureRecordIdentity({
    OrganizationId: organizationId,
    SiteId: siteId,
    UserId: userId,
    planId,
    planVersion: input.planVersion,
    ProcedureId: procedureId,
    ProcedureVersion: procedureVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy,
  });

  const fingerprintMaterial = {
    planId,
    planVersion: input.planVersion,
    ProcedureId: procedureId,
    ProcedureVersion: procedureVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy,
  };

  const record: ProcedureRecord = {
    OrganizationId: organizationId,
    SiteId: siteId,
    UserId: userId,
    TimeZone: ASIA_TOKYO_TIME_ZONE,
    RecordId: identity.RecordId,
    IdempotencyKey: identity.IdempotencyKey,
    PayloadFingerprint: computeProcedureRecordPayloadFingerprint(fingerprintMaterial),
    Procedure: {
      ProcedureId: procedureId,
      ProcedureVersion: procedureVersion,
      ApprovalState: "APPROVED",
    },
    LocalDate: localDate as LocalDate,
    planId,
    planVersion: input.planVersion,
    result: input.result,
    performedAt,
    recordedAt,
    recordedBy,
  };

  if (!validateProcedureRecord(record)) {
    return { ok: false, reason: "INVALID_INPUT" };
  }

  return { ok: true, record };
}

export type StaffProcedureRecordSaveResult = Readonly<{
  saveState: ProcedureRecordSaveOutcome;
  record: ProcedureRecord | null;
  persistCalled: boolean;
}>;

export async function persistStaffProcedureRecord(
  input: StaffProcedureRecordCreateInput,
  port: ProcedureRecordPersistencePort,
): Promise<StaffProcedureRecordSaveResult> {
  const assembled = assembleProcedureRecordForCreate(input);
  if (!assembled.ok) {
    return { saveState: "save_failed", record: null, persistCalled: false };
  }

  const saveState = await persistProcedureRecord(assembled.record, port);
  return { saveState, record: assembled.record, persistCalled: true };
}

export {
  createLiveWriteHoldProcedureRecordPersistencePort,
  persistProcedureRecord,
  type ProcedureRecordPersistencePort,
  type ProcedureRecordSaveOutcome,
} from "./procedure-record-persistence";
