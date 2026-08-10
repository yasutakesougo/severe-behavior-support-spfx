/**
 * SharePoint REST List Items field-body construction（TC-1-A + CO-1-A）.
 * Does not perform HTTP. No /_api/ calls. No runtime SharePoint client.
 */

import type { AssessmentSnapshot } from "../../../domain/assessment-snapshot";
import { isNonEmptyString } from "../../../domain/validation";
import { FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS } from "./derived-envelope";
import { encodePhysicalRow } from "./conversion";

export type RestBodyBuildResult =
  | Readonly<{ ok: true; fields: Readonly<Record<string, unknown>> }>
  | Readonly<{ ok: false; reason: "CONVERSION_FAILED" | "INVALID_OPTIONAL" }>;

/**
 * Create body: omit supersedesSnapshotId when logically absent（CO-1-A preferred）.
 */
export function buildCreateItemFields(snapshot: AssessmentSnapshot): RestBodyBuildResult {
  const encoded = encodePhysicalRow(snapshot);
  if (!encoded.ok) {
    return { ok: false, reason: "CONVERSION_FAILED" };
  }

  const fields: Record<string, unknown> = {
    snapshotId: encoded.row.snapshotId,
    recordStatus: encoded.row.recordStatus,
    result: encoded.row.result,
    reasonCodes: encoded.row.reasonCodes,
    ruleSetVersion: encoded.row.ruleSetVersion,
    periodStart: encoded.row.periodStart,
    periodEnd: encoded.row.periodEnd,
    inputFingerprint: encoded.row.inputFingerprint,
  };

  if (snapshot.supersedesSnapshotId !== undefined) {
    if (!isNonEmptyString(snapshot.supersedesSnapshotId)) {
      return { ok: false, reason: "INVALID_OPTIONAL" };
    }
    fields.supersedesSnapshotId = snapshot.supersedesSnapshotId;
  }
  // else: omit key（create absence）

  assertNoForbiddenKeys(fields);
  return { ok: true, fields };
}

export type UpdateSupersedesMode =
  | Readonly<{ kind: "set"; value: string }>
  | Readonly<{ kind: "clear" }>
  | Readonly<{ kind: "omit" }>;

/**
 * Update body field construction.
 * - set: exact string
 * - clear: JSON null（CO-1-A）
 * - omit: do not include key（leave existing；MUST NOT mean clear）
 */
export function buildUpdateItemFields(
  snapshot: AssessmentSnapshot,
  supersedesMode: UpdateSupersedesMode,
): RestBodyBuildResult {
  if (supersedesMode.kind === "set" && !isNonEmptyString(supersedesMode.value)) {
    return { ok: false, reason: "INVALID_OPTIONAL" };
  }

  // Fail-closed: logical null / empty / whitespace never reach transport.
  if (snapshot.supersedesSnapshotId !== undefined) {
    if (
      snapshot.supersedesSnapshotId === null ||
      typeof snapshot.supersedesSnapshotId !== "string" ||
      !isNonEmptyString(snapshot.supersedesSnapshotId)
    ) {
      return { ok: false, reason: "INVALID_OPTIONAL" };
    }
  }

  const encoded = encodePhysicalRow({
    ...snapshot,
    ...(supersedesMode.kind === "set"
      ? { supersedesSnapshotId: supersedesMode.value }
      : supersedesMode.kind === "clear" || supersedesMode.kind === "omit"
        ? {}
        : {}),
  });
  if (!encoded.ok) {
    return { ok: false, reason: "CONVERSION_FAILED" };
  }

  const fields: Record<string, unknown> = {
    snapshotId: encoded.row.snapshotId,
    recordStatus: encoded.row.recordStatus,
    result: encoded.row.result,
    reasonCodes: encoded.row.reasonCodes,
    ruleSetVersion: encoded.row.ruleSetVersion,
    periodStart: encoded.row.periodStart,
    periodEnd: encoded.row.periodEnd,
    inputFingerprint: encoded.row.inputFingerprint,
  };

  if (supersedesMode.kind === "set") {
    fields.supersedesSnapshotId = supersedesMode.value;
  } else if (supersedesMode.kind === "clear") {
    fields.supersedesSnapshotId = null;
  }
  // omit: leave key absent

  assertNoForbiddenKeys(fields);
  return { ok: true, fields };
}

/**
 * Resolve update supersedes mode from logical snapshot vs prior physical value.
 * - logical present → set
 * - logical absent + prior present → clear（null）
 * - logical absent + prior absent → omit
 */
export type ResolveUpdateSupersedesResult =
  | Readonly<{ ok: true; mode: UpdateSupersedesMode }>
  | Readonly<{ ok: false; reason: "INVALID_OPTIONAL" }>;

export function resolveUpdateSupersedesMode(
  snapshot: AssessmentSnapshot,
  priorSupersedes: string | null | undefined,
): ResolveUpdateSupersedesResult {
  const logical = snapshot.supersedesSnapshotId;
  if (logical !== undefined) {
    if (logical === null || typeof logical !== "string" || !isNonEmptyString(logical)) {
      return { ok: false, reason: "INVALID_OPTIONAL" };
    }
    return { ok: true, mode: { kind: "set", value: logical } };
  }

  const priorPresent = typeof priorSupersedes === "string" && isNonEmptyString(priorSupersedes);
  if (priorPresent) {
    return { ok: true, mode: { kind: "clear" } };
  }
  return { ok: true, mode: { kind: "omit" } };
}

function assertNoForbiddenKeys(fields: Readonly<Record<string, unknown>>): void {
  for (const key of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      throw new Error(`FORBIDDEN SharePoint item field key emitted: ${key}`);
    }
  }
}
