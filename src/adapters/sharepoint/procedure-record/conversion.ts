/**
 * PR-MAP-NAMES-1 read/write conversion for ProcedureRecord physical fields.
 * D4=A: performedAt / recordedAt remain ISO DateTime strings (no DateTime column).
 * Fail-closed: conversion failure is not empty success.
 */

import {
  isProcedureRecordResult,
  validateProcedureRecord,
  type ProcedureRecord,
} from "../../../domain/procedure-record";
import { isNonEmptyString, isValidIsoDateTime } from "../../../domain/validation";
import { getProcedureRecordDerivedEnvelope } from "./derived-envelope";
import type { ProcedureRecordPhysicalRow } from "./physical-columns";

export type ConversionOk<T> = Readonly<{ ok: true; value: T }>;
export type ConversionFail = Readonly<{ ok: false }>;
export type ConversionResult<T> = ConversionOk<T> | ConversionFail;

function fail<T>(): ConversionResult<T> {
  return { ok: false };
}

function ok<T>(value: T): ConversionResult<T> {
  return { ok: true, value };
}

export function encodeRequiredText(value: unknown): ConversionResult<string> {
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeRequiredText(value: unknown): ConversionResult<string> {
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}

/** MAP-PR-001: read trims RecordId; write keeps the non-empty string as given. */
export function decodeRecordId(value: unknown): ConversionResult<string> {
  if (typeof value !== "string") {
    return fail();
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return fail();
  }
  return ok(trimmed);
}

export function encodeIsoDateTime(value: unknown): ConversionResult<string> {
  if (!isValidIsoDateTime(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeIsoDateTime(value: unknown): ConversionResult<string> {
  return encodeIsoDateTime(value);
}

export function encodeLocalDate(value: unknown): ConversionResult<string> {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeLocalDate(value: unknown): ConversionResult<string> {
  return encodeLocalDate(value);
}

export function encodePlanVersion(value: unknown): ConversionResult<string> {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    return fail();
  }
  return ok(String(value));
}

export function decodePlanVersion(value: unknown): ConversionResult<number> {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return fail();
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || String(parsed) !== value) {
    return fail();
  }
  return ok(parsed);
}

export function encodeResult(value: unknown): ConversionResult<string> {
  if (!isProcedureRecordResult(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeResult(value: unknown): ConversionResult<string> {
  return encodeResult(value);
}

export function encodeApprovalState(value: unknown): ConversionResult<"APPROVED"> {
  if (value !== "APPROVED") {
    return fail();
  }
  return ok("APPROVED");
}

export function decodeApprovalState(value: unknown): ConversionResult<"APPROVED"> {
  return encodeApprovalState(value);
}

function disagreeingDerivedField(
  row: ProcedureRecordPhysicalRow,
  key: string,
  expected: string,
): boolean {
  if (!Object.prototype.hasOwnProperty.call(row, key)) {
    return false;
  }
  const actual = (row as Record<string, unknown>)[key];
  return actual !== expected;
}

export type PhysicalEncodeResult =
  | Readonly<{ ok: true; row: Omit<ProcedureRecordPhysicalRow, "ListItemId" | "Title"> }>
  | Readonly<{ ok: false }>;

export function encodePhysicalRow(record: ProcedureRecord): PhysicalEncodeResult {
  const recordId = encodeRequiredText(record.RecordId);
  const idempotencyKey = encodeRequiredText(record.IdempotencyKey);
  const payloadFingerprint = encodeRequiredText(record.PayloadFingerprint);
  const organizationId = encodeRequiredText(record.OrganizationId);
  const siteId = encodeRequiredText(record.SiteId);
  const userId = encodeRequiredText(record.UserId);
  const procedureId = encodeRequiredText(record.Procedure.ProcedureId);
  const procedureVersion = encodeRequiredText(record.Procedure.ProcedureVersion);
  const approvalState = encodeApprovalState(record.Procedure.ApprovalState);
  const localDate = encodeLocalDate(record.LocalDate);
  const planId = encodeRequiredText(record.planId);
  const planVersion = encodePlanVersion(record.planVersion);
  const result = encodeResult(record.result);
  const performedAt = encodeIsoDateTime(record.performedAt);
  const recordedAt = encodeIsoDateTime(record.recordedAt);
  const recordedBy = encodeRequiredText(record.recordedBy);

  if (
    !recordId.ok ||
    !idempotencyKey.ok ||
    !payloadFingerprint.ok ||
    !organizationId.ok ||
    !siteId.ok ||
    !userId.ok ||
    !procedureId.ok ||
    !procedureVersion.ok ||
    !approvalState.ok ||
    !localDate.ok ||
    !planId.ok ||
    !planVersion.ok ||
    !result.ok ||
    !performedAt.ok ||
    !recordedAt.ok ||
    !recordedBy.ok
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    row: {
      prRecordId: recordId.value,
      prIdempotencyKey: idempotencyKey.value,
      prPayloadFingerprint: payloadFingerprint.value,
      prOrganizationId: organizationId.value,
      prSiteId: siteId.value,
      prUserId: userId.value,
      prProcedureId: procedureId.value,
      prProcedureVersion: procedureVersion.value,
      prApprovalState: approvalState.value,
      prLocalDate: localDate.value,
      prPlanId: planId.value,
      prPlanVersion: planVersion.value,
      prResult: result.value,
      prPerformedAt: performedAt.value,
      prRecordedAt: recordedAt.value,
      prRecordedBy: recordedBy.value,
    },
  };
}

export type PhysicalDecodeResult =
  Readonly<{ ok: true; record: ProcedureRecord }> | Readonly<{ ok: false }>;

export function decodePhysicalRow(row: ProcedureRecordPhysicalRow): PhysicalDecodeResult {
  const derived = getProcedureRecordDerivedEnvelope();
  if (
    disagreeingDerivedField(row, "schemaId", derived.schemaId) ||
    disagreeingDerivedField(row, "schemaVersion", derived.schemaVersion) ||
    disagreeingDerivedField(row, "dtoVersion", derived.dtoVersion) ||
    disagreeingDerivedField(row, "TimeZone", derived.TimeZone)
  ) {
    return { ok: false };
  }

  const recordId = decodeRecordId(row.prRecordId);
  const idempotencyKey = decodeRequiredText(row.prIdempotencyKey);
  const payloadFingerprint = decodeRequiredText(row.prPayloadFingerprint);
  const organizationId = decodeRequiredText(row.prOrganizationId);
  const siteId = decodeRequiredText(row.prSiteId);
  const userId = decodeRequiredText(row.prUserId);
  const procedureId = decodeRequiredText(row.prProcedureId);
  const procedureVersion = decodeRequiredText(row.prProcedureVersion);
  const approvalState = decodeApprovalState(row.prApprovalState);
  const localDate = decodeLocalDate(row.prLocalDate);
  const planId = decodeRequiredText(row.prPlanId);
  const planVersion = decodePlanVersion(row.prPlanVersion);
  const result = decodeResult(row.prResult);
  const performedAt = decodeIsoDateTime(row.prPerformedAt);
  const recordedAt = decodeIsoDateTime(row.prRecordedAt);
  const recordedBy = decodeRequiredText(row.prRecordedBy);

  if (
    !recordId.ok ||
    !idempotencyKey.ok ||
    !payloadFingerprint.ok ||
    !organizationId.ok ||
    !siteId.ok ||
    !userId.ok ||
    !procedureId.ok ||
    !procedureVersion.ok ||
    !approvalState.ok ||
    !localDate.ok ||
    !planId.ok ||
    !planVersion.ok ||
    !result.ok ||
    !performedAt.ok ||
    !recordedAt.ok ||
    !recordedBy.ok
  ) {
    return { ok: false };
  }

  const record: ProcedureRecord = {
    OrganizationId: organizationId.value,
    SiteId: siteId.value,
    UserId: userId.value,
    TimeZone: derived.TimeZone,
    RecordId: recordId.value,
    IdempotencyKey: idempotencyKey.value,
    PayloadFingerprint: payloadFingerprint.value,
    Procedure: {
      ProcedureId: procedureId.value,
      ProcedureVersion: procedureVersion.value,
      ApprovalState: approvalState.value,
    },
    LocalDate: localDate.value as ProcedureRecord["LocalDate"],
    planId: planId.value,
    planVersion: planVersion.value,
    result: result.value as ProcedureRecord["result"],
    performedAt: performedAt.value,
    recordedAt: recordedAt.value,
    recordedBy: recordedBy.value,
  };

  if (!validateProcedureRecord(record)) {
    return { ok: false };
  }

  return { ok: true, record };
}
