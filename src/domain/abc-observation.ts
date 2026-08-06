import type { ExecutionRecord } from "../contracts/types";

/**
 * Common Identity re-used from ExecutionRecord
 */
export type AbcRecordIdentity = Pick<
  ExecutionRecord,
  | "OrganizationId"
  | "SiteId"
  | "UserId"
  | "RecordId"
  | "IdempotencyKey"
  | "PayloadFingerprint"
>;

/**
 * Flexible Intensity rating contract to avoid hardcoded 1..5 scale limits
 */
export type AbcIntensity = Readonly<{
  scaleCode: string;
  value: number;
}>;

/**
 * Discriminated union for Save State to prevent invalid states
 */
export type SaveState =
  | Readonly<{
      status: "Saved";
    }>
  | Readonly<{
      status: "Deleted";
      deletedBy: string;
      deletedAt: string;
      deletionReason: string;
    }>;

/**
 * Optional Source Context for external integration references
 */
export type SourceContext = Readonly<{
  sourceType: string;
  sourceReferenceId: string;
}>;

/**
 * Discriminated union for Link State ensuring sourceContext presence rules
 */
export type LinkState =
  | Readonly<{
      status: "NotRequired";
      sourceContext?: never;
    }>
  | Readonly<{
      status: "Pending" | "Linked" | "Failed";
      sourceContext: SourceContext;
    }>;

/**
 * Core AbcRecord Contract
 */
export type AbcRecord = AbcRecordIdentity &
  Readonly<{
    occurredAt: string;
    antecedent: string;
    behavior: string;
    aftermath: string;
    intensity: AbcIntensity;
    recordedBy: string;
    planId?: string;
    saveState: SaveState;
    linkState: LinkState;
    version: number;
  }>;

/**
 * Discriminated union for Observation Correction
 */
export type ObservationCorrection =
  | Readonly<{
      correctionOf?: never;
      correctionReason?: never;
    }>
  | Readonly<{
      correctionOf: string;
      correctionReason: string;
    }>;

/**
 * Observation Record Contract
 */
export type Observation = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  RecordId: string;
  observedAt: string;
  observedBy: string;
  content: string;
  planId?: string;
  version: number;
}> &
  ObservationCorrection;

/**
 * Discriminated Union for LinkFailure state invariant enforcement
 */
export type LinkFailureState =
  | Readonly<{
      status: "Open";
      lastAttemptAt?: string;
      resolvedAt?: never;
      abandonedAt?: never;
      reasonCode?: never;
    }>
  | Readonly<{
      status: "Retrying";
      lastAttemptAt: string;
      resolvedAt?: never;
      abandonedAt?: never;
      reasonCode?: never;
    }>
  | Readonly<{
      status: "Resolved";
      lastAttemptAt?: string;
      resolvedAt: string;
      abandonedAt?: never;
      reasonCode?: never;
    }>
  | Readonly<{
      status: "Abandoned";
      lastAttemptAt?: string;
      resolvedAt?: never;
      abandonedAt: string;
      reasonCode: string;
    }>;

/**
 * LinkFailure Status enum
 */
export type LinkFailureStatus = "Open" | "Retrying" | "Resolved" | "Abandoned";

/**
 * LinkFailure Record Contract (strict allowlist enforced at runtime)
 */
export type LinkFailure = Readonly<{
  failureId: string;
  targetRecordId: string;
  OrganizationId: string;
  SiteId: string;
  correlationId: string;
  retryCount: number;
  version: number;
}> &
  LinkFailureState;

/**
 * Standard Result type for state transitions without throwing exceptions
 */
export type TransitionResult<T> =
  | Readonly<{
      ok: true;
      value: T;
    }>
  | Readonly<{
      ok: false;
      reason:
        | "MALFORMED_INPUT"
        | "CONTEXT_MISMATCH"
        | "VERSION_CONFLICT"
        | "INVALID_TRANSITION"
        | "MISSING_REASON"
        | "TARGET_DELETED"
        | "ALREADY_LINKED";
    }>;

// ==========================================
// Helper Validators
// ==========================================

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isValidIsoDateTime(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }
  // Enforce ISO-8601 string with time component (e.g. 2026-08-06T10:00:00Z or +09:00)
  const isoPattern =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  const match = isoPattern.exec(value);
  if (!match) {
    return false;
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return false;
  }

  return !isNaN(new Date(value).getTime());
}

export function isReasonCode(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (/^[A-Z][A-Z0-9_]{1,63}$/.test(value) || /^synthetic-[a-z0-9-]+$/.test(value))
  );
}

// ==========================================
// Runtime Validators
// ==========================================

export function validateAbcRecord(value: unknown): value is AbcRecord {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.RecordId !== "string" ||
    value.RecordId.trim() === "" ||
    typeof value.IdempotencyKey !== "string" ||
    value.IdempotencyKey.trim() === "" ||
    typeof value.PayloadFingerprint !== "string" ||
    value.PayloadFingerprint.trim() === "" ||
    !isValidIsoDateTime(value.occurredAt) ||
    typeof value.antecedent !== "string" ||
    value.antecedent.trim() === "" ||
    typeof value.behavior !== "string" ||
    value.behavior.trim() === "" ||
    typeof value.aftermath !== "string" ||
    value.aftermath.trim() === "" ||
    typeof value.recordedBy !== "string" ||
    value.recordedBy.trim() === "" ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    return false;
  }

  // Validate AbcIntensity object structure
  if (!isRecord(value.intensity)) {
    return false;
  }
  if (
    typeof value.intensity.scaleCode !== "string" ||
    value.intensity.scaleCode.trim() === "" ||
    typeof value.intensity.value !== "number" ||
    !Number.isFinite(value.intensity.value)
  ) {
    return false;
  }

  if (value.planId !== undefined && typeof value.planId !== "string") {
    return false;
  }

  // Validate SaveState
  if (!isRecord(value.saveState)) {
    return false;
  }
  if (value.saveState.status === "Saved") {
    if (
      value.saveState.deletedBy !== undefined ||
      value.saveState.deletedAt !== undefined ||
      value.saveState.deletionReason !== undefined
    ) {
      return false;
    }
  } else if (value.saveState.status === "Deleted") {
    if (
      typeof value.saveState.deletedBy !== "string" ||
      value.saveState.deletedBy.trim() === "" ||
      !isValidIsoDateTime(value.saveState.deletedAt) ||
      typeof value.saveState.deletionReason !== "string" ||
      value.saveState.deletionReason.trim() === ""
    ) {
      return false;
    }
  } else {
    return false;
  }

  // Validate LinkState
  if (!isRecord(value.linkState)) {
    return false;
  }
  if (value.linkState.status === "NotRequired") {
    if (value.linkState.sourceContext !== undefined) {
      return false;
    }
  } else if (
    value.linkState.status === "Pending" ||
    value.linkState.status === "Linked" ||
    value.linkState.status === "Failed"
  ) {
    if (!isRecord(value.linkState.sourceContext)) {
      return false;
    }
    if (
      typeof value.linkState.sourceContext.sourceType !== "string" ||
      value.linkState.sourceContext.sourceType.trim() === "" ||
      typeof value.linkState.sourceContext.sourceReferenceId !== "string" ||
      value.linkState.sourceContext.sourceReferenceId.trim() === ""
    ) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export function validateObservation(value: unknown): value is Observation {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.UserId !== "string" ||
    value.UserId.trim() === "" ||
    typeof value.RecordId !== "string" ||
    value.RecordId.trim() === "" ||
    !isValidIsoDateTime(value.observedAt) ||
    typeof value.observedBy !== "string" ||
    value.observedBy.trim() === "" ||
    typeof value.content !== "string" ||
    value.content.trim() === "" ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    return false;
  }

  if (value.planId !== undefined && typeof value.planId !== "string") {
    return false;
  }

  const hasCorrectionOf = value.correctionOf !== undefined;
  const hasCorrectionReason = value.correctionReason !== undefined;

  if (hasCorrectionOf !== hasCorrectionReason) {
    return false;
  }

  if (hasCorrectionOf) {
    if (
      typeof value.correctionOf !== "string" ||
      value.correctionOf.trim() === "" ||
      typeof value.correctionReason !== "string" ||
      value.correctionReason.trim() === ""
    ) {
      return false;
    }
  }

  return true;
}

const LINK_FAILURE_ALLOWED_KEYS = new Set([
  "failureId",
  "targetRecordId",
  "OrganizationId",
  "SiteId",
  "status",
  "correlationId",
  "retryCount",
  "lastAttemptAt",
  "resolvedAt",
  "abandonedAt",
  "reasonCode",
  "version",
]);

export function validateLinkFailure(value: unknown): value is LinkFailure {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);
  for (const key of keys) {
    if (!LINK_FAILURE_ALLOWED_KEYS.has(key)) {
      return false; // Rejects unallowed properties (e.g. PII, secrets, support text)
    }
  }

  if (
    typeof value.failureId !== "string" ||
    value.failureId.trim() === "" ||
    typeof value.targetRecordId !== "string" ||
    value.targetRecordId.trim() === "" ||
    typeof value.OrganizationId !== "string" ||
    value.OrganizationId.trim() === "" ||
    typeof value.SiteId !== "string" ||
    value.SiteId.trim() === "" ||
    typeof value.correlationId !== "string" ||
    value.correlationId.trim() === "" ||
    typeof value.retryCount !== "number" ||
    !Number.isInteger(value.retryCount) ||
    value.retryCount < 0 ||
    typeof value.version !== "number" ||
    !Number.isInteger(value.version) ||
    value.version < 1
  ) {
    return false;
  }

  if (value.lastAttemptAt !== undefined && !isValidIsoDateTime(value.lastAttemptAt)) {
    return false;
  }

  // Validate State Invariants based on LinkFailureState
  if (value.status === "Open") {
    if (value.resolvedAt !== undefined || value.abandonedAt !== undefined || value.reasonCode !== undefined) {
      return false;
    }
  } else if (value.status === "Retrying") {
    if (typeof value.lastAttemptAt !== "string" || !isValidIsoDateTime(value.lastAttemptAt)) {
      return false; // lastAttemptAt is required for Retrying
    }
    if (value.resolvedAt !== undefined || value.abandonedAt !== undefined || value.reasonCode !== undefined) {
      return false;
    }
  } else if (value.status === "Resolved") {
    if (typeof value.resolvedAt !== "string" || !isValidIsoDateTime(value.resolvedAt)) {
      return false; // resolvedAt is required for Resolved
    }
    if (value.abandonedAt !== undefined || value.reasonCode !== undefined) {
      return false;
    }
  } else if (value.status === "Abandoned") {
    if (
      typeof value.abandonedAt !== "string" ||
      !isValidIsoDateTime(value.abandonedAt) ||
      typeof value.reasonCode !== "string" ||
      !isReasonCode(value.reasonCode)
    ) {
      return false; // abandonedAt and reasonCode are required for Abandoned
    }
    if (value.resolvedAt !== undefined) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

// ==========================================
// Transition Pure Functions
// ==========================================

export function transitionSaveState(
  record: AbcRecord,
  targetStatus: "Saved" | "Deleted",
  context: unknown
): TransitionResult<AbcRecord> {
  if (!validateAbcRecord(record)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (!isRecord(context)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    typeof context.OrganizationId !== "string" ||
    context.OrganizationId.trim() === "" ||
    typeof context.SiteId !== "string" ||
    context.SiteId.trim() === ""
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    record.OrganizationId !== context.OrganizationId ||
    record.SiteId !== context.SiteId
  ) {
    return { ok: false, reason: "CONTEXT_MISMATCH" };
  }

  if (
    typeof context.expectedVersion !== "number" ||
    !Number.isInteger(context.expectedVersion) ||
    context.expectedVersion < 1
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (record.version !== context.expectedVersion) {
    return { ok: false, reason: "VERSION_CONFLICT" };
  }

  if (record.saveState.status === "Deleted") {
    // Deleted -> Saved or Deleted -> Deleted are rejected
    return { ok: false, reason: "INVALID_TRANSITION" };
  }

  if (targetStatus === "Deleted") {
    if (
      typeof context.deletedBy !== "string" ||
      context.deletedBy.trim() === "" ||
      typeof context.deletedAt !== "string" ||
      !isValidIsoDateTime(context.deletedAt) ||
      typeof context.deletionReason !== "string" ||
      context.deletionReason.trim() === ""
    ) {
      return { ok: false, reason: "MISSING_REASON" };
    }

    const updated: AbcRecord = {
      ...record,
      saveState: {
        status: "Deleted",
        deletedBy: context.deletedBy,
        deletedAt: context.deletedAt,
        deletionReason: context.deletionReason,
      },
      version: record.version + 1,
    };
    return { ok: true, value: updated };
  }

  return { ok: false, reason: "INVALID_TRANSITION" };
}

export function transitionLinkState(
  record: AbcRecord,
  targetStatus: "Pending" | "Linked" | "Failed",
  context: unknown
): TransitionResult<AbcRecord> {
  if (!validateAbcRecord(record)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (!isRecord(context)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    typeof context.OrganizationId !== "string" ||
    context.OrganizationId.trim() === "" ||
    typeof context.SiteId !== "string" ||
    context.SiteId.trim() === ""
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    record.OrganizationId !== context.OrganizationId ||
    record.SiteId !== context.SiteId
  ) {
    return { ok: false, reason: "CONTEXT_MISMATCH" };
  }

  if (
    typeof context.expectedVersion !== "number" ||
    !Number.isInteger(context.expectedVersion) ||
    context.expectedVersion < 1
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (record.version !== context.expectedVersion) {
    return { ok: false, reason: "VERSION_CONFLICT" };
  }

  if (record.saveState.status === "Deleted") {
    return { ok: false, reason: "TARGET_DELETED" };
  }

  const current = record.linkState;
  if (current.status === "NotRequired") {
    return { ok: false, reason: "INVALID_TRANSITION" };
  }

  if (current.status === "Linked") {
    // Linked -> Pending, Linked -> Linked are rejected
    return { ok: false, reason: "ALREADY_LINKED" };
  }

  let isAllowed = false;
  if (current.status === "Pending" && (targetStatus === "Linked" || targetStatus === "Failed")) {
    isAllowed = true;
  } else if (current.status === "Failed" && targetStatus === "Pending") {
    isAllowed = true;
  }

  if (!isAllowed) {
    return { ok: false, reason: "INVALID_TRANSITION" };
  }

  const updatedLinkState: LinkState = {
    status: targetStatus,
    sourceContext: current.sourceContext,
  };

  const updated: AbcRecord = {
    ...record,
    linkState: updatedLinkState,
    version: record.version + 1,
  };

  return { ok: true, value: updated };
}

export function transitionLinkFailureStatus(
  failure: LinkFailure,
  targetStatus: LinkFailureStatus,
  context: unknown
): TransitionResult<LinkFailure> {
  if (!validateLinkFailure(failure)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (!isRecord(context)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    typeof context.OrganizationId !== "string" ||
    context.OrganizationId.trim() === "" ||
    typeof context.SiteId !== "string" ||
    context.SiteId.trim() === ""
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    failure.OrganizationId !== context.OrganizationId ||
    failure.SiteId !== context.SiteId
  ) {
    return { ok: false, reason: "CONTEXT_MISMATCH" };
  }

  if (
    typeof context.expectedVersion !== "number" ||
    !Number.isInteger(context.expectedVersion) ||
    context.expectedVersion < 1
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (failure.version !== context.expectedVersion) {
    return { ok: false, reason: "VERSION_CONFLICT" };
  }

  const currentStatus = failure.status;

  if (currentStatus === "Open" && targetStatus === "Retrying") {
    if (!isValidIsoDateTime(context.attemptedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      failureId: failure.failureId,
      targetRecordId: failure.targetRecordId,
      OrganizationId: failure.OrganizationId,
      SiteId: failure.SiteId,
      status: "Retrying",
      correlationId: failure.correlationId,
      retryCount: failure.retryCount,
      lastAttemptAt: context.attemptedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Retrying" && targetStatus === "Resolved") {
    if (!isValidIsoDateTime(context.resolvedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      failureId: failure.failureId,
      targetRecordId: failure.targetRecordId,
      OrganizationId: failure.OrganizationId,
      SiteId: failure.SiteId,
      status: "Resolved",
      correlationId: failure.correlationId,
      retryCount: failure.retryCount,
      lastAttemptAt: failure.lastAttemptAt,
      resolvedAt: context.resolvedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Retrying" && targetStatus === "Open") {
    if (!isValidIsoDateTime(context.attemptedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      failureId: failure.failureId,
      targetRecordId: failure.targetRecordId,
      OrganizationId: failure.OrganizationId,
      SiteId: failure.SiteId,
      status: "Open",
      correlationId: failure.correlationId,
      retryCount: failure.retryCount + 1,
      lastAttemptAt: context.attemptedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Open" && targetStatus === "Abandoned") {
    if (!isReasonCode(context.abandonedReason)) {
      return { ok: false, reason: "MISSING_REASON" };
    }
    if (!isValidIsoDateTime(context.abandonedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      failureId: failure.failureId,
      targetRecordId: failure.targetRecordId,
      OrganizationId: failure.OrganizationId,
      SiteId: failure.SiteId,
      status: "Abandoned",
      correlationId: failure.correlationId,
      retryCount: failure.retryCount,
      lastAttemptAt: failure.lastAttemptAt,
      abandonedAt: context.abandonedAt,
      reasonCode: context.abandonedReason,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  return { ok: false, reason: "INVALID_TRANSITION" };
}
