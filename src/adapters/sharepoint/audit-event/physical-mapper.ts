/**
 * AuditEvent ↔ SBS_AUDIT_EVENTS physical conversion + integrity (Accepted #29 Rev2).
 */

import type {
  AuditEventWriteRequest,
  PersistedAuditEventWrite,
} from "../../../domain/audit-event-persistence";
import { validateAuditEvent, type AuditEvent } from "../../../domain/finding-audit";
import { computeIdempotencyIdentityKey, computeRecordIdentityKey } from "./identity-keys";
import type { AuditEventPhysicalRow } from "./physical-columns";
import { decodeUtf16BeHexV1, encodeUtf16BeHexV1 } from "./utf16be-hex-v1";

export type PhysicalWriteBuildResult =
  | Readonly<{ ok: true; row: AuditEventPhysicalRow }>
  | Readonly<{ ok: false; reason: "ORGANIZATION_MISMATCH" | "INVALID_EVENT" }>;

export type PhysicalReadResult =
  | Readonly<{ kind: "FOUND"; persisted: PersistedAuditEventWrite }>
  | Readonly<{ kind: "RETRIEVAL_FAILED" }>
  | Readonly<{
      kind: "MALFORMED_LOGICAL";
      persisted: unknown;
    }>;

function deriveOccurredAtUtc(occurredAtRaw: string): string | null {
  const ms = Date.parse(occurredAtRaw);
  if (Number.isNaN(ms)) {
    return null;
  }
  return new Date(ms).toISOString();
}

function sameInstant(left: string, right: string): boolean {
  const leftMs = Date.parse(left);
  const rightMs = Date.parse(right);
  if (Number.isNaN(leftMs) || Number.isNaN(rightMs)) {
    return false;
  }
  return leftMs === rightMs;
}

function encodeOptional(value: string | undefined): string | undefined {
  return value === undefined ? undefined : encodeUtf16BeHexV1(value);
}

function decodeRequired(encoded: string | undefined): string | null {
  if (typeof encoded !== "string") {
    return null;
  }
  return decodeUtf16BeHexV1(encoded);
}

function decodeOptional(
  encoded: string | undefined,
): Readonly<{ ok: true; value: string | undefined }> | Readonly<{ ok: false }> {
  if (encoded === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof encoded !== "string") {
    return { ok: false };
  }
  const decoded = decodeUtf16BeHexV1(encoded);
  if (decoded === null) {
    return { ok: false };
  }
  return { ok: true, value: decoded };
}

export function buildPhysicalRow(
  request: AuditEventWriteRequest,
  boundOrganizationId: string,
): PhysicalWriteBuildResult {
  if (!validateAuditEvent(request.auditEvent)) {
    return { ok: false, reason: "INVALID_EVENT" };
  }
  if (request.auditEvent.OrganizationId !== boundOrganizationId) {
    return { ok: false, reason: "ORGANIZATION_MISMATCH" };
  }

  const occurredAtUtc = deriveOccurredAtUtc(request.auditEvent.occurredAt);
  if (occurredAtUtc === null) {
    return { ok: false, reason: "INVALID_EVENT" };
  }

  const row: AuditEventPhysicalRow = {
    SbsAudRecordIdentityKey: computeRecordIdentityKey(
      boundOrganizationId,
      request.auditEvent.auditEventId,
    ),
    SbsAudIdempotencyIdentityKey: computeIdempotencyIdentityKey(
      boundOrganizationId,
      request.idempotencyKey,
    ),
    SbsAudOrganizationIdEncoded: encodeUtf16BeHexV1(request.auditEvent.OrganizationId),
    SbsAudAuditEventIdEncoded: encodeUtf16BeHexV1(request.auditEvent.auditEventId),
    SbsAudIdempotencyKeyEncoded: encodeUtf16BeHexV1(request.idempotencyKey),
    SbsAudSiteIdEncoded: encodeOptional(request.auditEvent.SiteId),
    SbsAudActorStaffIdEncoded: encodeOptional(request.auditEvent.actorStaffId),
    SbsAudActionCode: request.auditEvent.actionCode,
    SbsAudTargetType: request.auditEvent.targetType,
    SbsAudTargetRecordIdEncoded: encodeOptional(request.auditEvent.targetRecordId),
    SbsAudResult: request.auditEvent.result,
    SbsAudOccurredAtRaw: request.auditEvent.occurredAt,
    SbsAudOccurredAtUtc: occurredAtUtc,
    SbsAudCorrelationIdEncoded: encodeUtf16BeHexV1(request.auditEvent.correlationId),
    SbsAudReasonCode: request.auditEvent.reasonCode,
    SbsAudAppVersionEncoded: encodeOptional(request.auditEvent.appVersion),
    SbsAudRuleSetVersionEncoded: encodeOptional(request.auditEvent.ruleSetVersion),
  };

  return { ok: true, row };
}

/**
 * Convert one physical row to logical evidence with Accepted integrity checks.
 *
 * lookup selects which argument must match the decoded identity token.
 */
export function readPhysicalRow(
  row: AuditEventPhysicalRow,
  boundOrganizationId: string,
  lookup:
    | Readonly<{ kind: "recordId"; token: string }>
    | Readonly<{ kind: "idempotencyKey"; token: string }>,
): PhysicalReadResult {
  const organizationId = decodeRequired(row.SbsAudOrganizationIdEncoded);
  const auditEventId = decodeRequired(row.SbsAudAuditEventIdEncoded);
  const idempotencyKey = decodeRequired(row.SbsAudIdempotencyKeyEncoded);
  const correlationId = decodeRequired(row.SbsAudCorrelationIdEncoded);

  if (
    organizationId === null ||
    auditEventId === null ||
    idempotencyKey === null ||
    correlationId === null
  ) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  const siteId = decodeOptional(row.SbsAudSiteIdEncoded);
  const actorStaffId = decodeOptional(row.SbsAudActorStaffIdEncoded);
  const targetRecordId = decodeOptional(row.SbsAudTargetRecordIdEncoded);
  const appVersion = decodeOptional(row.SbsAudAppVersionEncoded);
  const ruleSetVersion = decodeOptional(row.SbsAudRuleSetVersionEncoded);
  if (
    !siteId.ok ||
    !actorStaffId.ok ||
    !targetRecordId.ok ||
    !appVersion.ok ||
    !ruleSetVersion.ok
  ) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  if (organizationId !== boundOrganizationId) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  if (lookup.kind === "recordId" && auditEventId !== lookup.token) {
    return { kind: "RETRIEVAL_FAILED" };
  }
  if (lookup.kind === "idempotencyKey" && idempotencyKey !== lookup.token) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  const expectedRecordKey = computeRecordIdentityKey(organizationId, auditEventId);
  const expectedIdempotencyKey = computeIdempotencyIdentityKey(organizationId, idempotencyKey);
  if (
    expectedRecordKey !== row.SbsAudRecordIdentityKey ||
    expectedIdempotencyKey !== row.SbsAudIdempotencyIdentityKey
  ) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  if (
    typeof row.SbsAudOccurredAtRaw !== "string" ||
    typeof row.SbsAudOccurredAtUtc !== "string" ||
    !sameInstant(row.SbsAudOccurredAtRaw, row.SbsAudOccurredAtUtc)
  ) {
    return { kind: "RETRIEVAL_FAILED" };
  }

  const auditEvent: Record<string, unknown> = {
    auditEventId,
    OrganizationId: organizationId,
    actionCode: row.SbsAudActionCode,
    targetType: row.SbsAudTargetType,
    result: row.SbsAudResult,
    occurredAt: row.SbsAudOccurredAtRaw,
    correlationId,
  };

  if (siteId.value !== undefined) {
    auditEvent.SiteId = siteId.value;
  }
  if (actorStaffId.value !== undefined) {
    auditEvent.actorStaffId = actorStaffId.value;
  }
  if (targetRecordId.value !== undefined) {
    auditEvent.targetRecordId = targetRecordId.value;
  }
  if (row.SbsAudReasonCode !== undefined) {
    auditEvent.reasonCode = row.SbsAudReasonCode;
  }
  if (appVersion.value !== undefined) {
    auditEvent.appVersion = appVersion.value;
  }
  if (ruleSetVersion.value !== undefined) {
    auditEvent.ruleSetVersion = ruleSetVersion.value;
  }

  // System metadata must never be copied into logical evidence.
  const persistedCandidate = {
    auditEvent,
    idempotencyKey,
  };

  if (!validateAuditEvent(auditEvent as AuditEvent) || typeof idempotencyKey !== "string") {
    return { kind: "MALFORMED_LOGICAL", persisted: persistedCandidate };
  }

  const persisted: PersistedAuditEventWrite = {
    auditEvent: auditEvent as AuditEvent,
    idempotencyKey,
  };
  return { kind: "FOUND", persisted };
}
