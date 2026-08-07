import {
  isRecord,
  isNonEmptyString,
  isReasonCode,
  isValidIsoDateTime,
  isValidIsoDate,
} from "./validation";
import { isCriterionResult } from "./criteria";
import { sha256Hex } from "./sha256";

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

/** C0 controls, DEL, and C1 controls. */
export const STABLE_FINDING_ID_CONTROL_CHARACTER_PATTERN =
  // Intentional: reject control characters in stable finding identity material.
  // eslint-disable-next-line no-control-regex -- domain validation requires C0/C1 detection
  /[\u0000-\u001F\u007F-\u009F]/u;

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
    if (STABLE_FINDING_ID_CONTROL_CHARACTER_PATTERN.test(value)) {
      return true;
    }
  }
  return false;
}

export type AssembleFindingIdentityResult =
  | Readonly<{
      ok: true;
      identity: FindingIdentity;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "UNSUPPORTED_IDENTITY_VALUE";
    }>;

/**
 * Assemble FindingIdentity from externally supplied parts (FindingCode required).
 * Does not adopt a FindingCode catalog or redefine deriveStableFindingId.
 * Technical contract: docs/architecture/finding-identity-assembly.md
 */
export function assembleFindingIdentity(input: unknown): AssembleFindingIdentityResult {
  if (!validateFindingIdentity(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (hasUnsupportedIdentityValue(input)) {
    return { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" };
  }

  return {
    ok: true,
    identity: {
      OrganizationId: input.OrganizationId,
      SiteId: input.SiteId,
      UserId: input.UserId,
      FindingCode: input.FindingCode,
      ruleSetVersion: input.ruleSetVersion,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    },
  };
}

/**
 * Derive a deterministic stable finding ID from FindingIdentity.
 * Technical contract: docs/architecture/finding-stable-id.md
 */
export function deriveStableFindingId(input: unknown): DeriveStableFindingIdResult {
  if (!validateFindingIdentity(input)) {
    return { ok: false, code: "INVALID_IDENTITY" };
  }

  if (hasUnsupportedIdentityValue(input)) {
    return { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" };
  }

  const material = STABLE_FINDING_ID_FIELD_ORDER.map((field) => input[field]).join(
    STABLE_FINDING_ID_SEPARATOR,
  );

  const digest = sha256Hex(material);
  return {
    ok: true,
    findingId: `finding_${digest}`,
  };
}

export const FINDING_STATUSES = ["Open", "Confirmed", "InProgress", "Resolved"] as const;

export type FindingStatus = (typeof FINDING_STATUSES)[number];

/**
 * Allowed FindingStatus edges for lifecycle transition (Issue #24).
 * Technical contract: docs/architecture/finding-lifecycle-transition.md
 */
export const FINDING_STATUS_ALLOWED_TRANSITIONS = [
  ["Open", "Confirmed"],
  ["Confirmed", "InProgress"],
  ["InProgress", "Resolved"],
] as const satisfies ReadonlyArray<readonly [FindingStatus, FindingStatus]>;

export type FindingStatusTransitionResult =
  | Readonly<{
      ok: true;
      status: FindingStatus;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION";
    }>;

export function isFindingStatus(value: unknown): value is FindingStatus {
  return typeof value === "string" && FINDING_STATUSES.includes(value as FindingStatus);
}

/**
 * Transition FindingStatus along the approved lifecycle graph only.
 * Fail-closed: no exceptions. Roles / persistence are out of scope.
 */
export function transitionFindingStatus(
  currentStatus: unknown,
  targetStatus: unknown,
): FindingStatusTransitionResult {
  if (!isFindingStatus(currentStatus) || !isFindingStatus(targetStatus)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const allowed = FINDING_STATUS_ALLOWED_TRANSITIONS.some(
    ([from, to]) => from === currentStatus && to === targetStatus,
  );

  if (!allowed) {
    return { ok: false, code: "INVALID_TRANSITION" };
  }

  return { ok: true, status: targetStatus };
}

/**
 * Fields that must match for a RECURRENCE candidate (Q2-A / Q4-A).
 * periodStart/periodEnd are excluded; ruleSetVersion is included.
 */
export const FINDING_RECURRENCE_MATCH_FIELDS = [
  "OrganizationId",
  "SiteId",
  "UserId",
  "FindingCode",
  "ruleSetVersion",
] as const;

export type FindingRecurrenceDecision = "SAME" | "RECURRENCE" | "NEW";

export type FindingRecurrenceDecisionResult =
  | Readonly<{
      ok: true;
      decision: FindingRecurrenceDecision;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "CONFLICT_OPEN_FINDING";
    }>;

function identitiesFullyEqual(left: FindingIdentity, right: FindingIdentity): boolean {
  return STABLE_FINDING_ID_FIELD_ORDER.every((field) => left[field] === right[field]);
}

function identitiesMatchForRecurrence(left: FindingIdentity, right: FindingIdentity): boolean {
  return FINDING_RECURRENCE_MATCH_FIELDS.every((field) => left[field] === right[field]);
}

function periodsDiffer(left: FindingIdentity, right: FindingIdentity): boolean {
  return left.periodStart !== right.periodStart || left.periodEnd !== right.periodEnd;
}

/**
 * Decide SAME / RECURRENCE / NEW between candidate and optional prior finding.
 * Accepted boundaries: Q1-C / Q2-A / Q3-A / Q4-A.
 * Technical contract: docs/architecture/finding-recurrence.md
 */
export function decideFindingRecurrence(input: unknown): FindingRecurrenceDecisionResult {
  if (!isRecord(input) || !("candidate" in input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const candidateResult = assembleFindingIdentity(input.candidate);
  if (!candidateResult.ok) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!("prior" in input) || input.prior === null || input.prior === undefined) {
    return { ok: true, decision: "NEW" };
  }

  if (!isRecord(input.prior)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!("identity" in input.prior) || !("status" in input.prior)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!isFindingStatus(input.prior.status)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const priorResult = assembleFindingIdentity(input.prior.identity);
  if (!priorResult.ok) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const candidate = candidateResult.identity;
  const priorIdentity = priorResult.identity;
  const priorStatus = input.prior.status;

  // Q4-A: SAME = full FindingIdentity equality (same stable-id key)
  if (identitiesFullyEqual(candidate, priorIdentity)) {
    return { ok: true, decision: "SAME" };
  }

  // Q2-A: ruleSetVersion is part of match keys; mismatch => NEW (not recurrence)
  if (!identitiesMatchForRecurrence(candidate, priorIdentity)) {
    return { ok: true, decision: "NEW" };
  }

  // Q1-C: period difference is required for RECURRENCE (not sufficient alone)
  if (!periodsDiffer(candidate, priorIdentity)) {
    return { ok: true, decision: "NEW" };
  }

  // Q3-A: different-period candidate requires prior Resolved
  if (priorStatus !== "Resolved") {
    return { ok: false, code: "CONFLICT_OPEN_FINDING" };
  }

  return { ok: true, decision: "RECURRENCE" };
}

export type FindingGenerationDoNotGenerateReason =
  "EMPTY_CRITERIA" | "NO_FAILING_CRITERIA" | "ALL_NOT_APPLICABLE" | "HAS_UNKNOWN";

export type FindingGenerationDecisionResult =
  | Readonly<{
      ok: true;
      decision: "GENERATE_REQUIRED";
    }>
  | Readonly<{
      ok: true;
      decision: "DO_NOT_GENERATE";
      reason: FindingGenerationDoNotGenerateReason;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

/**
 * Decide whether finding generation is required from criteria only.
 * Does not build Finding / FindingCode / Identity. Technical contract:
 * docs/architecture/finding-generation-conditions.md
 */
export function decideFindingGeneration(input: unknown): FindingGenerationDecisionResult {
  if (!isRecord(input) || !("criteria" in input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const { criteria } = input;
  if (!Array.isArray(criteria)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!criteria.every(isCriterionResult)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (criteria.length === 0) {
    return {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "EMPTY_CRITERIA",
    };
  }

  if (criteria.every((criterion) => criterion.status === "NOT_APPLICABLE")) {
    return {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "ALL_NOT_APPLICABLE",
    };
  }

  if (criteria.some((criterion) => criterion.status === "UNKNOWN")) {
    return {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "HAS_UNKNOWN",
    };
  }

  if (criteria.some((criterion) => criterion.status === "FAIL")) {
    return { ok: true, decision: "GENERATE_REQUIRED" };
  }

  return {
    ok: true,
    decision: "DO_NOT_GENERATE",
    reason: "NO_FAILING_CRITERIA",
  };
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

export const AUDIT_EVENT_RESULTS = ["success", "denied", "failed"] as const;

export type AuditEventResult = (typeof AUDIT_EVENT_RESULTS)[number];

export const AUDIT_EVENT_TARGET_TYPES = ["HandoffState"] as const;

export type AuditEventTargetType = (typeof AUDIT_EVENT_TARGET_TYPES)[number];

export type AuditEvent = Readonly<{
  auditEventId: string;
  OrganizationId: string;
  SiteId?: string;
  actorStaffId?: string;
  actionCode: string;
  targetType: AuditEventTargetType;
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

/**
 * Decision-AUD-SAN-VALUE-1 IDENTIFIER / VERSION opaque-token boundary.
 * Reuses STABLE_FINDING_ID_CONTROL_CHARACTER_PATTERN; does not invent a new regex.
 * Reject-only: never trim / normalize / mutate to accept.
 */
function isSafeAuditEventToken(value: unknown): value is string {
  return (
    isNonEmptyString(value) &&
    value === value.trim() &&
    !STABLE_FINDING_ID_CONTROL_CHARACTER_PATTERN.test(value)
  );
}

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
    !isSafeAuditEventToken(value.auditEventId) ||
    !isSafeAuditEventToken(value.OrganizationId) ||
    !isReasonCode(value.actionCode) ||
    !AUDIT_EVENT_TARGET_TYPES.includes(value.targetType as AuditEventTargetType) ||
    !AUDIT_EVENT_RESULTS.includes(value.result as AuditEventResult) ||
    !isValidIsoDateTime(value.occurredAt) ||
    !isSafeAuditEventToken(value.correlationId)
  ) {
    return false;
  }

  if (value.SiteId !== undefined && !isSafeAuditEventToken(value.SiteId)) {
    return false;
  }
  if (value.actorStaffId !== undefined && !isSafeAuditEventToken(value.actorStaffId)) {
    return false;
  }
  if (value.targetRecordId !== undefined && !isSafeAuditEventToken(value.targetRecordId)) {
    return false;
  }
  if (value.reasonCode !== undefined && !isReasonCode(value.reasonCode)) {
    return false;
  }
  if (value.appVersion !== undefined && !isSafeAuditEventToken(value.appVersion)) {
    return false;
  }
  if (value.ruleSetVersion !== undefined && !isSafeAuditEventToken(value.ruleSetVersion)) {
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

export function validateSnapshotCorrection(value: unknown): value is SnapshotCorrection {
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
  if (typeof status !== "string" || !HANDOFF_STATUSES.includes(status as HandoffStatus)) {
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
    if (
      new Date(value.includedAt as string).getTime() <
      new Date(value.requestedAt as string).getTime()
    ) {
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
      new Date(value.includedAt as string).getTime() <
        new Date(value.requestedAt as string).getTime() ||
      new Date(value.acknowledgedAt as string).getTime() <
        new Date(value.includedAt as string).getTime()
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
      new Date(value.includedAt as string).getTime() <
        new Date(value.requestedAt as string).getTime() ||
      new Date(value.acknowledgedAt as string).getTime() <
        new Date(value.includedAt as string).getTime() ||
      new Date(value.closedAt as string).getTime() <
        new Date(value.acknowledgedAt as string).getTime()
    ) {
      return false;
    }
  }

  return true;
}
