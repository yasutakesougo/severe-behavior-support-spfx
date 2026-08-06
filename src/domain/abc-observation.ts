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
  status: LinkFailureStatus;
  correlationId: string;
  retryCount: number;
  lastAttemptAt?: string;
  resolvedAt?: string;
  abandonedAt?: string;
  reasonCode?: string;
  version: number;
}>;

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
    /^[A-Z][A-Z0-9_]{1,63}$/.test(value)
  );
}

// ==========================================
// Runtime Validators
// ==========================================

export function validateAbcRecord(value: unknown): value is AbcRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.OrganizationId !== "string" ||
    record.OrganizationId.trim() === "" ||
    typeof record.SiteId !== "string" ||
    record.SiteId.trim() === "" ||
    typeof record.UserId !== "string" ||
    record.UserId.trim() === "" ||
    typeof record.RecordId !== "string" ||
    record.RecordId.trim() === "" ||
    typeof record.IdempotencyKey !== "string" ||
    record.IdempotencyKey.trim() === "" ||
    typeof record.PayloadFingerprint !== "string" ||
    record.PayloadFingerprint.trim() === "" ||
    !isValidIsoDateTime(record.occurredAt) ||
    typeof record.antecedent !== "string" ||
    record.antecedent.trim() === "" ||
    typeof record.behavior !== "string" ||
    record.behavior.trim() === "" ||
    typeof record.aftermath !== "string" ||
    record.aftermath.trim() === "" ||
    typeof record.recordedBy !== "string" ||
    record.recordedBy.trim() === "" ||
    typeof record.version !== "number" ||
    !Number.isInteger(record.version) ||
    record.version < 1
  ) {
    return false;
  }

  // Validate AbcIntensity object structure
  if (typeof record.intensity !== "object" || record.intensity === null) {
    return false;
  }
  const intensity = record.intensity as Record<string, unknown>;
  if (
    typeof intensity.scaleCode !== "string" ||
    intensity.scaleCode.trim() === "" ||
    typeof intensity.value !== "number" ||
    !Number.isFinite(intensity.value)
  ) {
    return false;
  }

  if (record.planId !== undefined && typeof record.planId !== "string") {
    return false;
  }

  // Validate SaveState
  if (typeof record.saveState !== "object" || record.saveState === null) {
    return false;
  }
  const saveState = record.saveState as Record<string, unknown>;
  if (saveState.status === "Saved") {
    if (
      saveState.deletedBy !== undefined ||
      saveState.deletedAt !== undefined ||
      saveState.deletionReason !== undefined
    ) {
      return false;
    }
  } else if (saveState.status === "Deleted") {
    if (
      typeof saveState.deletedBy !== "string" ||
      saveState.deletedBy.trim() === "" ||
      !isValidIsoDateTime(saveState.deletedAt) ||
      typeof saveState.deletionReason !== "string" ||
      saveState.deletionReason.trim() === ""
    ) {
      return false;
    }
  } else {
    return false;
  }

  // Validate LinkState
  if (typeof record.linkState !== "object" || record.linkState === null) {
    return false;
  }
  const linkState = record.linkState as Record<string, unknown>;
  if (linkState.status === "NotRequired") {
    if (linkState.sourceContext !== undefined) {
      return false;
    }
  } else if (
    linkState.status === "Pending" ||
    linkState.status === "Linked" ||
    linkState.status === "Failed"
  ) {
    if (
      typeof linkState.sourceContext !== "object" ||
      linkState.sourceContext === null
    ) {
      return false;
    }
    const sc = linkState.sourceContext as Record<string, unknown>;
    if (
      typeof sc.sourceType !== "string" ||
      sc.sourceType.trim() === "" ||
      typeof sc.sourceReferenceId !== "string" ||
      sc.sourceReferenceId.trim() === ""
    ) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export function validateObservation(value: unknown): value is Observation {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obs = value as Record<string, unknown>;

  if (
    typeof obs.OrganizationId !== "string" ||
    obs.OrganizationId.trim() === "" ||
    typeof obs.SiteId !== "string" ||
    obs.SiteId.trim() === "" ||
    typeof obs.UserId !== "string" ||
    obs.UserId.trim() === "" ||
    typeof obs.RecordId !== "string" ||
    obs.RecordId.trim() === "" ||
    !isValidIsoDateTime(obs.observedAt) ||
    typeof obs.observedBy !== "string" ||
    obs.observedBy.trim() === "" ||
    typeof obs.content !== "string" ||
    obs.content.trim() === "" ||
    typeof obs.version !== "number" ||
    !Number.isInteger(obs.version) ||
    obs.version < 1
  ) {
    return false;
  }

  if (obs.planId !== undefined && typeof obs.planId !== "string") {
    return false;
  }

  const hasCorrectionOf = obs.correctionOf !== undefined;
  const hasCorrectionReason = obs.correctionReason !== undefined;

  if (hasCorrectionOf !== hasCorrectionReason) {
    return false;
  }

  if (hasCorrectionOf) {
    if (
      typeof obs.correctionOf !== "string" ||
      obs.correctionOf.trim() === "" ||
      typeof obs.correctionReason !== "string" ||
      obs.correctionReason.trim() === ""
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
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const keys = Object.keys(value);
  for (const key of keys) {
    if (!LINK_FAILURE_ALLOWED_KEYS.has(key)) {
      return false; // Rejects unallowed properties (e.g. PII, secrets, support text)
    }
  }

  const failure = value as Record<string, unknown>;

  if (
    typeof failure.failureId !== "string" ||
    failure.failureId.trim() === "" ||
    typeof failure.targetRecordId !== "string" ||
    failure.targetRecordId.trim() === "" ||
    typeof failure.OrganizationId !== "string" ||
    failure.OrganizationId.trim() === "" ||
    typeof failure.SiteId !== "string" ||
    failure.SiteId.trim() === "" ||
    typeof failure.correlationId !== "string" ||
    failure.correlationId.trim() === "" ||
    typeof failure.retryCount !== "number" ||
    !Number.isInteger(failure.retryCount) ||
    failure.retryCount < 0 ||
    typeof failure.version !== "number" ||
    !Number.isInteger(failure.version) ||
    failure.version < 1
  ) {
    return false;
  }

  if (!["Open", "Retrying", "Resolved", "Abandoned"].includes(failure.status as string)) {
    return false;
  }

  if (failure.lastAttemptAt !== undefined && !isValidIsoDateTime(failure.lastAttemptAt)) {
    return false;
  }
  if (failure.resolvedAt !== undefined && !isValidIsoDateTime(failure.resolvedAt)) {
    return false;
  }
  if (failure.abandonedAt !== undefined && !isValidIsoDateTime(failure.abandonedAt)) {
    return false;
  }
  if (failure.reasonCode !== undefined && !isReasonCode(failure.reasonCode)) {
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
  context: Readonly<{
    deletedBy?: string;
    deletedAt?: string;
    deletionReason?: string;
    expectedVersion: unknown;
  }>
): TransitionResult<AbcRecord> {
  if (!validateAbcRecord(record)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
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
      !context.deletedBy ||
      context.deletedBy.trim() === "" ||
      !context.deletedAt ||
      !isValidIsoDateTime(context.deletedAt) ||
      !context.deletionReason ||
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
  context: Readonly<{
    expectedVersion: unknown;
  }>
): TransitionResult<AbcRecord> {
  if (!validateAbcRecord(record)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
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
  context: Readonly<{
    OrganizationId: string;
    SiteId: string;
    expectedVersion: unknown;
    attemptedAt?: string;
    resolvedAt?: string;
    abandonedAt?: string;
    abandonedReason?: string;
  }>
): TransitionResult<LinkFailure> {
  if (!validateLinkFailure(failure)) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    typeof context.expectedVersion !== "number" ||
    !Number.isInteger(context.expectedVersion) ||
    context.expectedVersion < 1
  ) {
    return { ok: false, reason: "MALFORMED_INPUT" };
  }

  if (
    failure.OrganizationId !== context.OrganizationId ||
    failure.SiteId !== context.SiteId
  ) {
    return { ok: false, reason: "CONTEXT_MISMATCH" };
  }

  if (failure.version !== context.expectedVersion) {
    return { ok: false, reason: "VERSION_CONFLICT" };
  }

  const currentStatus = failure.status;

  if (currentStatus === "Open" && targetStatus === "Retrying") {
    const attemptedAt = context.attemptedAt || new Date().toISOString();
    if (!isValidIsoDateTime(attemptedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      ...failure,
      status: "Retrying",
      lastAttemptAt: attemptedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Retrying" && targetStatus === "Resolved") {
    const resolvedAt = context.resolvedAt || new Date().toISOString();
    if (!isValidIsoDateTime(resolvedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      ...failure,
      status: "Resolved",
      resolvedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Retrying" && targetStatus === "Open") {
    const attemptedAt = context.attemptedAt || new Date().toISOString();
    if (!isValidIsoDateTime(attemptedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      ...failure,
      status: "Open",
      retryCount: failure.retryCount + 1,
      lastAttemptAt: attemptedAt,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  if (currentStatus === "Open" && targetStatus === "Abandoned") {
    if (!context.abandonedReason || !isReasonCode(context.abandonedReason)) {
      return { ok: false, reason: "MISSING_REASON" };
    }
    const abandonedAt = context.abandonedAt || new Date().toISOString();
    if (!isValidIsoDateTime(abandonedAt)) {
      return { ok: false, reason: "MALFORMED_INPUT" };
    }
    const updated: LinkFailure = {
      ...failure,
      status: "Abandoned",
      abandonedAt,
      reasonCode: context.abandonedReason,
      version: failure.version + 1,
    };
    return { ok: true, value: updated };
  }

  return { ok: false, reason: "INVALID_TRANSITION" };
}
