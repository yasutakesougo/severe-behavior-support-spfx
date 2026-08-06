import { createHash } from "node:crypto";
import {
  isRecord,
  isNonEmptyString,
  isReasonCode,
  isValidIsoDateTime,
  isValidIsoDate,
} from "./validation";

// ==========================================
// Finding & Identity Contracts
// ==========================================

export type FindingIdentity = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  FindingCode: string;
  ruleSetVersion: string;
  periodStart: string;
  periodEnd: string;
}>;

export const STABLE_FINDING_ID_FIELD_ORDER = [
  "OrganizationId",
  "SiteId",
  "UserId",
  "FindingCode",
  "ruleSetVersion",
  "periodStart",
  "periodEnd",
] as const;

export const STABLE_FINDING_ID_SEPARATOR = "\u001f";

export type DeriveStableFindingIdResult =
  | Readonly<{
      ok: true;
      findingId: string;
    }>
  | Readonly<{
      ok: false;
      code: "INVALID_IDENTITY" | "UNSUPPORTED_IDENTITY_VALUE";
    }>;

function hasUnsupportedIdentityValue(identity: FindingIdentity): boolean {
  for (const field of STABLE_FINDING_ID_FIELD_ORDER) {
    const value = identity[field];
    if (value !== value.trim()) {
      return true;
    }
    if (
      value.includes("\u0000") ||
      value.includes(STABLE_FINDING_ID_SEPARATOR)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Derive a deterministic stable finding ID from FindingIdentity.
 * Technical contract: docs/architecture/finding-stable-id.md
 */
export function deriveStableFindingId(
  input: unknown
): DeriveStableFindingIdResult {
  if (!validateFindingIdentity(input)) {
    return { ok: false, code: "INVALID_IDENTITY" };
  }

  if (hasUnsupportedIdentityValue(input)) {
    return { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" };
  }

  const material = STABLE_FINDING_ID_FIELD_ORDER.map(
    (field) => input[field]
  ).join(STABLE_FINDING_ID_SEPARATOR);

  const digest = createHash("sha256").update(material, "utf8").digest("hex");
  return {
    ok: true,
    findingId: `finding_${digest}`,
  };
}

export const FINDING_STATUSES = [
  "Open",
  "Confirmed",
  "InProgress",
  "Resolved",
] as const;

export type FindingStatus = (typeof FINDING_STATUSES)[number];

export function isFindingStatus(value: unknown): value is FindingStatus {
  return typeof value === "string" && FINDING_STATUSES.includes(value as FindingStatus);
}

export function validateFindingIdentity(value: unknown): value is FindingIdentity {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);
  const allowedKeys = new Set([
    "OrganizationId",
    "SiteId",
    "UserId",
    "FindingCode",
    "ruleSetVersion",
    "periodStart",
    "periodEnd",
  ]);

  if (keys.length !== 7 || !keys.every((key) => allowedKeys.has(key))) {
    return false;
  }

  if (
    !isNonEmptyString(value.OrganizationId) ||
    !isNonEmptyString(value.SiteId) ||
    !isNonEmptyString(value.UserId) ||
    !isReasonCode(value.FindingCode) ||
    !isNonEmptyString(value.ruleSetVersion) ||
    !isValidIsoDate(value.periodStart) ||
    !isValidIsoDate(value.periodEnd)
  ) {
    return false;
  }

  if (value.periodEnd < value.periodStart) {
    return false;
  }

  return true;
}

// ==========================================
// AuditEvent Contracts & Strict Allowlist
// ==========================================

export const AUDIT_EVENT_RESULTS = [
  "success",
  "denied",
  "failed",
] as const;

export type AuditEventResult = (typeof AUDIT_EVENT_RESULTS)[number];

export type AuditEvent = Readonly<{
  auditEventId: string;
  OrganizationId: string;
  SiteId?: string;
  actorStaffId?: string;
  actionCode: string;
  targetType: string;
  targetRecordId?: string;
  result: AuditEventResult;
  occurredAt: string;
  correlationId: string;
  reasonCode?: string;
  appVersion?: string;
  ruleSetVersion?: string;
}>;

const FORBIDDEN_AUDIT_KEYS = new Set([
  "name",
  "username",
  "birthdate",
  "address",
  "supportplan",
  "supportmethods",
  "antecedent",
  "behavior",
  "aftermath",
  "observation",
  "password",
  "token",
  "cookie",
  "clientsecret",
  "secret",
  "message",
  "errormessage",
  "stack",
]);

export function validateAuditEvent(value: unknown): value is AuditEvent {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);
  for (const key of keys) {
    if (FORBIDDEN_AUDIT_KEYS.has(key.toLowerCase())) {
      return false;
    }
  }

  const allowedKeys = new Set([
    "auditEventId",
    "OrganizationId",
    "SiteId",
    "actorStaffId",
    "actionCode",
    "targetType",
    "targetRecordId",
    "result",
    "occurredAt",
    "correlationId",
    "reasonCode",
    "appVersion",
    "ruleSetVersion",
  ]);

  if (!keys.every((key) => allowedKeys.has(key))) {
    return false;
  }

  if (
    !isNonEmptyString(value.auditEventId) ||
    !isNonEmptyString(value.OrganizationId) ||
    !isReasonCode(value.actionCode) ||
    !isNonEmptyString(value.targetType) ||
    !AUDIT_EVENT_RESULTS.includes(value.result as AuditEventResult) ||
    !isValidIsoDateTime(value.occurredAt) ||
    !isNonEmptyString(value.correlationId)
  ) {
    return false;
  }

  if (value.SiteId !== undefined && !isNonEmptyString(value.SiteId)) {
    return false;
  }
  if (value.actorStaffId !== undefined && !isNonEmptyString(value.actorStaffId)) {
    return false;
  }
  if (value.targetRecordId !== undefined && !isNonEmptyString(value.targetRecordId)) {
    return false;
  }
  if (value.reasonCode !== undefined && !isReasonCode(value.reasonCode)) {
    return false;
  }
  if (value.appVersion !== undefined && !isNonEmptyString(value.appVersion)) {
    return false;
  }
  if (value.ruleSetVersion !== undefined && !isNonEmptyString(value.ruleSetVersion)) {
    return false;
  }

  return true;
}

// ==========================================
// SnapshotCorrection Contracts
// ==========================================

export type SnapshotCorrection = Readonly<{
  correctionId: string;
  originalSnapshotId: string;
  replacementSnapshotId: string;
  reasonCode: string;
  reasonText?: string;
  correctedAt: string;
  correctedBy: string;
}>;

export function validateSnapshotCorrection(
  value: unknown
): value is SnapshotCorrection {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);
  const allowedKeys = new Set([
    "correctionId",
    "originalSnapshotId",
    "replacementSnapshotId",
    "reasonCode",
    "reasonText",
    "correctedAt",
    "correctedBy",
  ]);

  if (!keys.every((key) => allowedKeys.has(key))) {
    return false;
  }

  if (
    !isNonEmptyString(value.correctionId) ||
    !isNonEmptyString(value.originalSnapshotId) ||
    !isNonEmptyString(value.replacementSnapshotId) ||
    !isReasonCode(value.reasonCode) ||
    !isValidIsoDateTime(value.correctedAt) ||
    !isNonEmptyString(value.correctedBy)
  ) {
    return false;
  }

  if (value.originalSnapshotId === value.replacementSnapshotId) {
    return false;
  }

  if (value.reasonText !== undefined && !isNonEmptyString(value.reasonText)) {
    return false;
  }

  return true;
}

// ==========================================
// HandoffState Discriminated Union & Contracts
// ==========================================

export const HANDOFF_STATUSES = [
  "not_required",
  "pending",
  "included",
  "acknowledged",
  "closed",
] as const;

export type HandoffStatus = (typeof HANDOFF_STATUSES)[number];

export type HandoffState =
  | Readonly<{
      status: "not_required";
      requestedAt?: never;
      requestedBy?: never;
      meetingId?: never;
      includedAt?: never;
      includedBy?: never;
      acknowledgedAt?: never;
      acknowledgedBy?: never;
      closedAt?: never;
      closedBy?: never;
    }>
  | Readonly<{
      status: "pending";
      requestedAt: string;
      requestedBy: string;
      meetingId?: never;
      includedAt?: never;
      includedBy?: never;
      acknowledgedAt?: never;
      acknowledgedBy?: never;
      closedAt?: never;
      closedBy?: never;
    }>
  | Readonly<{
      status: "included";
      requestedAt: string;
      requestedBy: string;
      meetingId: string;
      includedAt: string;
      includedBy: string;
      acknowledgedAt?: never;
      acknowledgedBy?: never;
      closedAt?: never;
      closedBy?: never;
    }>
  | Readonly<{
      status: "acknowledged";
      requestedAt: string;
      requestedBy: string;
      meetingId: string;
      includedAt: string;
      includedBy: string;
      acknowledgedAt: string;
      acknowledgedBy: string;
      closedAt?: never;
      closedBy?: never;
    }>
  | Readonly<{
      status: "closed";
      requestedAt: string;
      requestedBy: string;
      meetingId: string;
      includedAt: string;
      includedBy: string;
      acknowledgedAt: string;
      acknowledgedBy: string;
      closedAt: string;
      closedBy: string;
    }>;

export function validateHandoffState(value: unknown): value is HandoffState {
  if (!isRecord(value)) {
    return false;
  }

  const status = value.status;
  if (
    typeof status !== "string" ||
    !HANDOFF_STATUSES.includes(status as HandoffStatus)
  ) {
    return false;
  }

  const keys = Object.keys(value);
  const allowedKeys = new Set([
    "status",
    "requestedAt",
    "requestedBy",
    "meetingId",
    "includedAt",
    "includedBy",
    "acknowledgedAt",
    "acknowledgedBy",
    "closedAt",
    "closedBy",
  ]);

  if (!keys.every((key) => allowedKeys.has(key))) {
    return false;
  }

  const hasReqAt = value.requestedAt !== undefined;
  const hasReqBy = value.requestedBy !== undefined;
  const hasMtgId = value.meetingId !== undefined;
  const hasIncAt = value.includedAt !== undefined;
  const hasIncBy = value.includedBy !== undefined;
  const hasAckAt = value.acknowledgedAt !== undefined;
  const hasAckBy = value.acknowledgedBy !== undefined;
  const hasClsAt = value.closedAt !== undefined;
  const hasClsBy = value.closedBy !== undefined;

  if (status === "not_required") {
    if (
      hasReqAt ||
      hasReqBy ||
      hasMtgId ||
      hasIncAt ||
      hasIncBy ||
      hasAckAt ||
      hasAckBy ||
      hasClsAt ||
      hasClsBy
    ) {
      return false;
    }
  } else if (status === "pending") {
    if (
      !isValidIsoDateTime(value.requestedAt) ||
      !isNonEmptyString(value.requestedBy) ||
      hasMtgId ||
      hasIncAt ||
      hasIncBy ||
      hasAckAt ||
      hasAckBy ||
      hasClsAt ||
      hasClsBy
    ) {
      return false;
    }
  } else if (status === "included") {
    if (
      !isValidIsoDateTime(value.requestedAt) ||
      !isNonEmptyString(value.requestedBy) ||
      !isNonEmptyString(value.meetingId) ||
      !isValidIsoDateTime(value.includedAt) ||
      !isNonEmptyString(value.includedBy) ||
      hasAckAt ||
      hasAckBy ||
      hasClsAt ||
      hasClsBy
    ) {
      return false;
    }
    if (new Date(value.includedAt as string).getTime() < new Date(value.requestedAt as string).getTime()) {
      return false;
    }
  } else if (status === "acknowledged") {
    if (
      !isValidIsoDateTime(value.requestedAt) ||
      !isNonEmptyString(value.requestedBy) ||
      !isNonEmptyString(value.meetingId) ||
      !isValidIsoDateTime(value.includedAt) ||
      !isNonEmptyString(value.includedBy) ||
      !isValidIsoDateTime(value.acknowledgedAt) ||
      !isNonEmptyString(value.acknowledgedBy) ||
      hasClsAt ||
      hasClsBy
    ) {
      return false;
    }
    if (
      new Date(value.includedAt as string).getTime() < new Date(value.requestedAt as string).getTime() ||
      new Date(value.acknowledgedAt as string).getTime() < new Date(value.includedAt as string).getTime()
    ) {
      return false;
    }
  } else if (status === "closed") {
    if (
      !isValidIsoDateTime(value.requestedAt) ||
      !isNonEmptyString(value.requestedBy) ||
      !isNonEmptyString(value.meetingId) ||
      !isValidIsoDateTime(value.includedAt) ||
      !isNonEmptyString(value.includedBy) ||
      !isValidIsoDateTime(value.acknowledgedAt) ||
      !isNonEmptyString(value.acknowledgedBy) ||
      !isValidIsoDateTime(value.closedAt) ||
      !isNonEmptyString(value.closedBy)
    ) {
      return false;
    }
    if (
      new Date(value.includedAt as string).getTime() < new Date(value.requestedAt as string).getTime() ||
      new Date(value.acknowledgedAt as string).getTime() < new Date(value.includedAt as string).getTime() ||
      new Date(value.closedAt as string).getTime() < new Date(value.acknowledgedAt as string).getTime()
    ) {
      return false;
    }
  }

  return true;
}
