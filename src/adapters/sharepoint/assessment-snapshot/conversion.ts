/**
 * CV-1 read/write conversion for AssessmentSnapshot physical fields.
 * MAP-AS-001〜008 per Decision-AS-CONVERSION-1.
 * MAP-AS-010 per R-1-A / W-1-A（CO-1-A transport owned by rest-body）.
 */

import type { AssessmentSnapshot } from "../../../domain/assessment-snapshot";
import {
  ASSESSMENT_SNAPSHOT_RECORD_STATUSES,
  ASSESSMENT_SNAPSHOT_RESULTS,
} from "../../../domain/assessment-snapshot";
import { isNonEmptyString, isReasonCode, isValidIsoDate } from "../../../domain/validation";
import type { AssessmentSnapshotPhysicalRow } from "./physical-columns";

export type ConversionOk<T> = Readonly<{ ok: true; value: T }>;
export type ConversionFail = Readonly<{ ok: false }>;
export type ConversionResult<T> = ConversionOk<T> | ConversionFail;

function fail<T>(): ConversionResult<T> {
  return { ok: false };
}

function ok<T>(value: T): ConversionResult<T> {
  return { ok: true, value };
}

/** C-1-A required text. */
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

/** C-2 Choice recordStatus. */
export function encodeRecordStatus(value: unknown): ConversionResult<string> {
  if (typeof value !== "string") {
    return fail();
  }
  if (!(ASSESSMENT_SNAPSHOT_RECORD_STATUSES as readonly string[]).includes(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeRecordStatus(value: unknown): ConversionResult<string> {
  return encodeRecordStatus(value);
}

/** C-2 Choice result. */
export function encodeResult(value: unknown): ConversionResult<string> {
  if (typeof value !== "string") {
    return fail();
  }
  if (!(ASSESSMENT_SNAPSHOT_RESULTS as readonly string[]).includes(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeResult(value: unknown): ConversionResult<string> {
  return encodeResult(value);
}

/**
 * C-3-A reasonCodes JSON.
 * Write: compact JSON array from validated unique string[].
 * Read: unique isReasonCode[]；duplicates FAIL-CLOSED（no normalizeReasonCodes repair）.
 */
export function encodeReasonCodes(value: unknown): ConversionResult<string> {
  if (!Array.isArray(value)) {
    return fail();
  }
  const seen = new Set<string>();
  for (const item of value) {
    if (!isReasonCode(item)) {
      return fail();
    }
    if (seen.has(item)) {
      return fail();
    }
    seen.add(item);
  }
  return ok(JSON.stringify(value));
}

export function decodeReasonCodes(value: unknown): ConversionResult<readonly string[]> {
  if (typeof value !== "string") {
    return fail();
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return fail();
  }
  if (!Array.isArray(parsed)) {
    return fail();
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of parsed) {
    if (!isReasonCode(item)) {
      return fail();
    }
    if (seen.has(item)) {
      return fail();
    }
    seen.add(item);
    out.push(item);
  }
  return ok(out);
}

/** C-4-A DateOnly civil date YYYY-MM-DD. */
export function encodeCivilDate(value: unknown): ConversionResult<string> {
  if (!isValidIsoDate(value)) {
    return fail();
  }
  return ok(value);
}

/**
 * Decode DateOnly wire forms without changing civil day.
 * Accepts YYYY-MM-DD, or midnight-UTC ISO datetime that maps to same civil day.
 */
export function decodeCivilDate(value: unknown): ConversionResult<string> {
  if (typeof value !== "string" || value.trim() === "") {
    return fail();
  }
  if (isValidIsoDate(value)) {
    return ok(value);
  }
  // Wire form: YYYY-MM-DDTHH:mm:ss(.sss)Z — civil day = date prefix only when UTC midnight.
  const match = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.\d+)?Z$/.exec(value);
  if (match && isValidIsoDate(match[1])) {
    return ok(match[1]);
  }
  return fail();
}

/** R-1-A / W-1-A optional supersedesSnapshotId field shape（transport CO-1-A separate）. */
export function encodeSupersedesSnapshotId(
  value: string | undefined,
): ConversionResult<string | undefined> {
  if (value === undefined) {
    return ok(undefined);
  }
  if (value === null || typeof value !== "string") {
    return fail();
  }
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}

export function decodeSupersedesSnapshotId(value: unknown): ConversionResult<string | undefined> {
  if (value === undefined || value === null) {
    return ok(undefined);
  }
  if (typeof value !== "string") {
    return fail();
  }
  if (!isNonEmptyString(value)) {
    return fail();
  }
  return ok(value);
}

export type PhysicalEncodeResult =
  | Readonly<{ ok: true; row: Omit<AssessmentSnapshotPhysicalRow, "ListItemId"> }>
  | Readonly<{ ok: false }>;

export function encodePhysicalRow(snapshot: AssessmentSnapshot): PhysicalEncodeResult {
  const snapshotId = encodeRequiredText(snapshot.snapshotId);
  const recordStatus = encodeRecordStatus(snapshot.recordStatus);
  const result = encodeResult(snapshot.result);
  const reasonCodes = encodeReasonCodes(snapshot.reasonCodes);
  const ruleSetVersion = encodeRequiredText(snapshot.ruleSetVersion);
  const periodStart = encodeCivilDate(snapshot.periodStart);
  const periodEnd = encodeCivilDate(snapshot.periodEnd);
  const inputFingerprint = encodeRequiredText(snapshot.inputFingerprint);
  const supersedes = encodeSupersedesSnapshotId(snapshot.supersedesSnapshotId);

  if (
    !snapshotId.ok ||
    !recordStatus.ok ||
    !result.ok ||
    !reasonCodes.ok ||
    !ruleSetVersion.ok ||
    !periodStart.ok ||
    !periodEnd.ok ||
    !inputFingerprint.ok ||
    !supersedes.ok
  ) {
    return { ok: false };
  }

  const row: Omit<AssessmentSnapshotPhysicalRow, "ListItemId"> = {
    snapshotId: snapshotId.value,
    recordStatus: recordStatus.value,
    result: result.value,
    reasonCodes: reasonCodes.value,
    ruleSetVersion: ruleSetVersion.value,
    periodStart: periodStart.value,
    periodEnd: periodEnd.value,
    inputFingerprint: inputFingerprint.value,
    ...(supersedes.value !== undefined ? { supersedesSnapshotId: supersedes.value } : {}),
  };

  return { ok: true, row };
}

export type PhysicalDecodeResult =
  Readonly<{ ok: true; snapshot: AssessmentSnapshot }> | Readonly<{ ok: false }>;

export function decodePhysicalRow(row: AssessmentSnapshotPhysicalRow): PhysicalDecodeResult {
  const snapshotId = decodeRequiredText(row.snapshotId);
  const recordStatus = decodeRecordStatus(row.recordStatus);
  const result = decodeResult(row.result);
  const reasonCodes = decodeReasonCodes(row.reasonCodes);
  const ruleSetVersion = decodeRequiredText(row.ruleSetVersion);
  const periodStart = decodeCivilDate(row.periodStart);
  const periodEnd = decodeCivilDate(row.periodEnd);
  const inputFingerprint = decodeRequiredText(row.inputFingerprint);
  const supersedes = decodeSupersedesSnapshotId(row.supersedesSnapshotId);

  if (
    !snapshotId.ok ||
    !recordStatus.ok ||
    !result.ok ||
    !reasonCodes.ok ||
    !ruleSetVersion.ok ||
    !periodStart.ok ||
    !periodEnd.ok ||
    !inputFingerprint.ok ||
    !supersedes.ok
  ) {
    return { ok: false };
  }

  if (periodEnd.value < periodStart.value) {
    return { ok: false };
  }

  const snapshot: AssessmentSnapshot = {
    snapshotId: snapshotId.value,
    recordStatus: recordStatus.value as AssessmentSnapshot["recordStatus"],
    result: result.value as AssessmentSnapshot["result"],
    reasonCodes: reasonCodes.value,
    ruleSetVersion: ruleSetVersion.value,
    periodStart: periodStart.value,
    periodEnd: periodEnd.value,
    inputFingerprint: inputFingerprint.value,
    ...(supersedes.value !== undefined ? { supersedesSnapshotId: supersedes.value } : {}),
  };

  return { ok: true, snapshot };
}
