import type { AuthorizationContext, LookupResult, Role } from "../contracts";
import { evaluateAuthorizationAccess } from "../contracts/decisions";
import {
  resolveEffectiveOccurrenceState,
  type ProcedureRecordLifecycleEvent,
} from "./kiosk-contract";
import {
  freezeProcedureRecordCorrectionPayload,
  mintProcedureRecordCorrectionIdentity,
  orderProcedureRecordCorrections,
  validateProcedureRecordCorrection,
  type ProcedureRecordCorrection,
} from "./procedure-record-correction";
import type { ProcedureRecord, ProcedureRecordResult } from "./procedure-record";
import { validateProcedureRecord } from "./procedure-record";
import { sha256Hex } from "./sha256";
import { isNonEmptyString, isRecord } from "./validation";

/** CANCEL-SLICE-A only: semantic validation. No event or persistence authority. */
export const PROCEDURE_RECORD_CANCELLATION_SEMANTICS_VERSION = "1.0.0" as const;
export const PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED = false as const;

/** Human-locked cancellation-specific authority from Option B. */
export const PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES = [
  "SUPPORTER",
  "SERVICE_MANAGER",
] as const satisfies readonly Role[];

export type ProcedureRecordCancellationRole =
  (typeof PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES)[number];

export type ProcedureRecordCancellationProjection = "ORIGINAL" | "CORRECTED_EFFECTIVE";

export type ProcedureRecordCancellationFrozenCorrection = Readonly<{
  CorrectionId: string;
  IdempotencyKey: string;
  originalRecordId: string;
  result: ProcedureRecordResult;
  performedAt: string;
  reason: string;
  correctedAt: string;
  correctedBy: string;
}>;

/** Derived facts only; effective eligibility is not client input. */
export type ProcedureRecordCancellationFrozenContext = Readonly<{
  targetRecordId: string;
  originalRecordId: string;
  originalRecordFingerprint: string;
  occurrenceContextFingerprint: string;
  reason: string;
  effectiveState: "RECORDED";
  occurrence: "CURRENT";
  lineage: "CURRENT";
  projection: ProcedureRecordCancellationProjection;
  correctionOriginalRecordId?: string;
  correctionId?: string;
  correction?: ProcedureRecordCancellationFrozenCorrection;
  actorSubject: string;
  actorUserId: string;
  actorRoles: readonly Role[];
  organizationId: string;
  siteId: string;
  selectedSiteId: string;
}>;

export type ProcedureRecordCancellationSemanticInput = Readonly<{
  operation: "CANCEL";
  targetRecordId: string;
  originalRecord: ProcedureRecord;
  reason: string;
  /** Authoritative occurrence binding, not a client-provided occurrence state. */
  boundRecordIds: readonly string[];
  /** Authoritative lifecycle events used by resolveEffectiveOccurrenceState. */
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[];
  /** Authoritative append-only correction collection for originalRecord. */
  corrections: readonly ProcedureRecordCorrection[];
  /** System-composed principal + explicit site selection + site memberships. */
  authorization: LookupResult<AuthorizationContext>;
}>;

export const PROCEDURE_RECORD_CANCELLATION_SEMANTICS = {
  version: PROCEDURE_RECORD_CANCELLATION_SEMANTICS_VERSION,
  operation: "CANCEL",
  lifecycleEventType: "CANCEL",
  storage: "APPEND_ONLY_LIFECYCLE_EVENT",
  originalRecord: "IMMUTABLE",
  result: "UNCHANGED",
  replacementRecordId: "FORBIDDEN",
  reason: "REQUIRED",
  target: "CURRENT_EFFECTIVE_RECORDED_ONLY",
  effectiveStateAuthority: "OCCURRENCE_BINDING_AND_LIFECYCLE_RESOLVER",
  rolePolicy: "SUPPORTER_OR_SERVICE_MANAGER_ONLY",
  siteAuthority: "EXPLICIT_SELECTED_SITE_MEMBERSHIP",
  correctionAuthority: "VALIDATED_APPEND_ONLY_COLLECTION",
  cancelled: "DENY",
  unrecorded: "DENY",
  conflict: "DENY",
  invalid: "DENY",
  superseded: "DENY",
  historical: "DENY",
  corrected: "EFFECTIVE_CORRECTED_PROJECTION_ONLY",
  replay: "EXACT_FROZEN_CONTEXT_REPLAY_OR_CONFLICT",
} as const;

export type ProcedureRecordCancellationSemanticResult =
  | Readonly<{
      status: "VALID";
      contract: typeof PROCEDURE_RECORD_CANCELLATION_SEMANTICS;
      operation: "CANCEL";
      lifecycleEventType: "CANCEL";
      targetRecordId: string;
      originalRecord: ProcedureRecord;
      reason: string;
      frozenContext: ProcedureRecordCancellationFrozenContext;
      submissionFingerprint: string;
    }>
  | Readonly<{
      status: "INVALID";
      reason:
        | "INVALID_SHAPE"
        | "UNSUPPORTED_MUTATION_FIELD"
        | "INVALID_OPERATION"
        | "INVALID_TARGET_RECORD_ID"
        | "INVALID_ORIGINAL_RECORD"
        | "INVALID_BOUND_RECORD_IDS"
        | "TARGET_NOT_BOUND"
        | "TARGET_NOT_CURRENT"
        | "TARGET_NOT_EFFECTIVE"
        | "REASON_REQUIRED"
        | "INVALID_EFFECTIVE_STATE"
        | "TARGET_SUPERSEDED"
        | "CORRECTION_INVALID"
        | "CORRECTION_CONFLICT"
        | "CORRECTION_BINDING_REQUIRED"
        | "CORRECTION_TARGET_MISMATCH"
        | "UNAUTHORIZED"
        | "TARGET_CONTEXT_MISMATCH";
    }>;

export type ProcedureRecordCancellationReplayResult =
  | Readonly<{ status: "NEW" }>
  | Readonly<{ status: "REPLAY"; submissionFingerprint: string }>
  | Readonly<{ status: "REPLAY_CONFLICT"; submissionFingerprint: string }>;

const ALLOWED_INPUT_KEYS = new Set([
  "operation",
  "targetRecordId",
  "originalRecord",
  "reason",
  "boundRecordIds",
  "lifecycleEvents",
  "corrections",
  "authorization",
]);

function hasOnlyAllowedInputKeys(value: Record<string, unknown>): boolean {
  return Object.keys(value).every((key) => ALLOWED_INPUT_KEYS.has(key));
}

function hasUnsupportedControlCharacters(value: string): boolean {
  // eslint-disable-next-line no-control-regex -- identity/reason input is fail-closed
  return /[\u0000-\u001F\u007F-\u009F]/.test(value);
}

function requiredText(value: unknown): string | null {
  if (
    !isNonEmptyString(value) ||
    value !== value.trim() ||
    hasUnsupportedControlCharacters(value)
  ) {
    return null;
  }
  return value;
}

function isRecordIdCollection(value: unknown): value is readonly string[] {
  if (!Array.isArray(value)) return false;
  const seen = new Set<string>();
  for (const recordId of value) {
    if (!isNonEmptyString(recordId) || recordId !== recordId.trim() || seen.has(recordId)) {
      return false;
    }
    seen.add(recordId);
  }
  return true;
}

function sameProcedure(
  left: ProcedureRecord["Procedure"],
  right: ProcedureRecord["Procedure"],
): boolean {
  return (
    left.ProcedureId === right.ProcedureId &&
    left.ProcedureVersion === right.ProcedureVersion &&
    left.ApprovalState === right.ApprovalState
  );
}

function correctionMatchesOriginalRecord(
  correction: ProcedureRecordCorrection,
  record: ProcedureRecord,
): boolean {
  return (
    correction.originalRecordId === record.RecordId &&
    correction.OrganizationId === record.OrganizationId &&
    correction.SiteId === record.SiteId &&
    correction.UserId === record.UserId &&
    sameProcedure(correction.Procedure, record.Procedure) &&
    correction.planId === record.planId &&
    correction.planVersion === record.planVersion &&
    correction.originalRecordedAt === record.recordedAt &&
    correction.originalRecordedBy === record.recordedBy &&
    correction.originalLocalDate === record.LocalDate
  );
}

function correctionIdentityMatchesPayload(correction: ProcedureRecordCorrection): boolean {
  const frozenPayload = freezeProcedureRecordCorrectionPayload({
    result: correction.result,
    performedAt: correction.performedAt,
    reason: correction.reason,
    correctedAt: correction.correctedAt,
    correctedBy: correction.correctedBy,
  });
  const expected = mintProcedureRecordCorrectionIdentity(
    correction.originalRecordId,
    frozenPayload,
  );
  return (
    expected.CorrectionId === correction.CorrectionId &&
    expected.IdempotencyKey === correction.IdempotencyKey
  );
}

function frozenCorrection(
  correction: ProcedureRecordCorrection,
): ProcedureRecordCancellationFrozenCorrection {
  return {
    CorrectionId: correction.CorrectionId,
    IdempotencyKey: correction.IdempotencyKey,
    originalRecordId: correction.originalRecordId,
    result: correction.result,
    performedAt: correction.performedAt,
    reason: correction.reason,
    correctedAt: correction.correctedAt,
    correctedBy: correction.correctedBy,
  };
}

function frozenContextFingerprint(context: ProcedureRecordCancellationFrozenContext): string {
  return sha256Hex(
    JSON.stringify([
      context.targetRecordId,
      context.originalRecordId,
      context.originalRecordFingerprint,
      context.occurrenceContextFingerprint,
      context.reason,
      context.effectiveState,
      context.occurrence,
      context.lineage,
      context.projection,
      context.correctionOriginalRecordId ?? "",
      context.correctionId ?? "",
      context.correction ?? null,
      context.actorSubject,
      context.actorUserId,
      context.actorRoles,
      context.organizationId,
      context.siteId,
      context.selectedSiteId,
    ]),
  );
}

function originalRecordFingerprint(record: ProcedureRecord): string {
  return sha256Hex(
    JSON.stringify([
      record.OrganizationId,
      record.SiteId,
      record.UserId,
      record.TimeZone,
      record.RecordId,
      record.IdempotencyKey,
      record.PayloadFingerprint,
      record.Procedure,
      record.LocalDate,
      record.planId,
      record.planVersion,
      record.result,
      record.performedAt,
      record.recordedAt,
      record.recordedBy,
    ]),
  );
}

function occurrenceContextFingerprint(
  boundRecordIds: readonly string[],
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[],
): string {
  const events = lifecycleEvents
    .map((event) => [
      event.LifecycleEventId,
      event.LifecycleIdempotencyKey,
      event.LifecyclePayloadFingerprint,
      event.eventType,
      event.targetRecordId,
      event.replacementRecordId ?? "",
      event.recordedAt,
      event.recordedBy,
      event.reason ?? "",
    ])
    .sort((left, right) => left[0].localeCompare(right[0]));
  return sha256Hex(JSON.stringify([[...boundRecordIds].sort(), events]));
}

function invalid(
  reason: Extract<ProcedureRecordCancellationSemanticResult, { status: "INVALID" }>["reason"],
) {
  return { status: "INVALID", reason } as const;
}

function resolveCorrectionProjection(
  corrections: readonly ProcedureRecordCorrection[],
  originalRecord: ProcedureRecord,
):
  | Readonly<{ projection: "ORIGINAL" }>
  | Readonly<{
      projection: "CORRECTED_EFFECTIVE";
      correction: ProcedureRecordCancellationFrozenCorrection;
    }>
  | Readonly<{
      invalid: "CORRECTION_INVALID" | "CORRECTION_CONFLICT" | "CORRECTION_TARGET_MISMATCH";
    }> {
  const correctionIds = new Set<string>();
  const idempotencyKeys = new Set<string>();
  const validated: ProcedureRecordCorrection[] = [];

  for (const correction of corrections) {
    if (
      !validateProcedureRecordCorrection(correction) ||
      !correctionIdentityMatchesPayload(correction)
    ) {
      return { invalid: "CORRECTION_INVALID" };
    }
    if (!correctionMatchesOriginalRecord(correction, originalRecord)) {
      return { invalid: "CORRECTION_TARGET_MISMATCH" };
    }
    if (
      correctionIds.has(correction.CorrectionId) ||
      idempotencyKeys.has(correction.IdempotencyKey) ||
      correction.CorrectionId === originalRecord.RecordId ||
      correction.IdempotencyKey === originalRecord.RecordId
    ) {
      return { invalid: "CORRECTION_CONFLICT" };
    }
    correctionIds.add(correction.CorrectionId);
    idempotencyKeys.add(correction.IdempotencyKey);
    validated.push(correction);
  }

  if (validated.length === 0) {
    return { projection: "ORIGINAL" };
  }

  const ordered = orderProcedureRecordCorrections(validated);
  const latest = ordered[ordered.length - 1];
  if (latest === undefined) {
    return { invalid: "CORRECTION_CONFLICT" };
  }
  return { projection: "CORRECTED_EFFECTIVE", correction: frozenCorrection(latest) };
}

export function assembleProcedureRecordCancellationSemantics(
  value: unknown,
): ProcedureRecordCancellationSemanticResult {
  if (!isRecord(value)) return invalid("INVALID_SHAPE");
  if (!hasOnlyAllowedInputKeys(value)) return invalid("UNSUPPORTED_MUTATION_FIELD");
  if (value.operation !== "CANCEL") return invalid("INVALID_OPERATION");
  if (!isNonEmptyString(value.targetRecordId)) return invalid("INVALID_TARGET_RECORD_ID");
  if (!validateProcedureRecord(value.originalRecord)) return invalid("INVALID_ORIGINAL_RECORD");
  if (value.targetRecordId !== value.originalRecord.RecordId) {
    return invalid("TARGET_NOT_BOUND");
  }
  if (!isRecordIdCollection(value.boundRecordIds)) return invalid("INVALID_BOUND_RECORD_IDS");
  if (!Array.isArray(value.lifecycleEvents) || !Array.isArray(value.corrections)) {
    return invalid("INVALID_SHAPE");
  }
  if (!isRecord(value.authorization)) return invalid("UNAUTHORIZED");

  const boundRecordIds = value.boundRecordIds;
  const resolved = resolveEffectiveOccurrenceState(boundRecordIds, value.lifecycleEvents);
  if (resolved.status !== "RECORDED") {
    return invalid("INVALID_EFFECTIVE_STATE");
  }
  if (!boundRecordIds.includes(value.originalRecord.RecordId)) {
    return invalid("TARGET_NOT_BOUND");
  }
  if (resolved.effectiveRecordId !== value.targetRecordId) {
    return invalid("TARGET_NOT_EFFECTIVE");
  }

  const reason = requiredText(value.reason);
  if (reason === null) return invalid("REASON_REQUIRED");

  const authorization = value.authorization as LookupResult<AuthorizationContext>;
  const access = evaluateAuthorizationAccess({
    authorization,
    requiredRoles: PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES,
  });
  if (access.decision !== "ALLOW" || authorization.status !== "FOUND") {
    return invalid("UNAUTHORIZED");
  }

  const selectedSiteId = authorization.value.SiteContext.SelectedSiteId;
  if (selectedSiteId === null || selectedSiteId.trim().length === 0) {
    return invalid("UNAUTHORIZED");
  }
  const selectedMembership = authorization.value.SiteContext.Memberships.find(
    (membership) => membership.SiteId === selectedSiteId,
  );
  if (selectedMembership === undefined) {
    return invalid("UNAUTHORIZED");
  }
  if (
    authorization.value.OrganizationId !== value.originalRecord.OrganizationId ||
    selectedSiteId !== value.originalRecord.SiteId
  ) {
    return invalid("TARGET_CONTEXT_MISMATCH");
  }

  const correctionProjection = resolveCorrectionProjection(value.corrections, value.originalRecord);
  if ("invalid" in correctionProjection) {
    return invalid(correctionProjection.invalid);
  }

  const frozenContext: ProcedureRecordCancellationFrozenContext = {
    targetRecordId: value.targetRecordId,
    originalRecordId: value.originalRecord.RecordId,
    originalRecordFingerprint: originalRecordFingerprint(value.originalRecord),
    occurrenceContextFingerprint: occurrenceContextFingerprint(
      boundRecordIds,
      value.lifecycleEvents,
    ),
    reason,
    // These values are derived from the resolver above; they are not client authority.
    effectiveState: "RECORDED",
    occurrence: "CURRENT",
    lineage: "CURRENT",
    projection: correctionProjection.projection,
    ...(correctionProjection.projection === "CORRECTED_EFFECTIVE"
      ? {
          correctionOriginalRecordId: correctionProjection.correction.originalRecordId,
          correctionId: correctionProjection.correction.CorrectionId,
          correction: correctionProjection.correction,
        }
      : {}),
    actorSubject: authorization.value.Subject,
    actorUserId: authorization.value.UserId,
    actorRoles: [...selectedMembership.Roles].sort() as readonly Role[],
    organizationId: authorization.value.OrganizationId,
    siteId: selectedSiteId,
    selectedSiteId,
  };
  const submissionFingerprint = frozenContextFingerprint(frozenContext);

  return {
    status: "VALID",
    contract: PROCEDURE_RECORD_CANCELLATION_SEMANTICS,
    operation: "CANCEL",
    lifecycleEventType: "CANCEL",
    targetRecordId: value.targetRecordId,
    originalRecord: value.originalRecord,
    reason,
    frozenContext,
    submissionFingerprint,
  };
}

export function classifyProcedureRecordCancellationReplay(
  previous: Pick<
    Extract<ProcedureRecordCancellationSemanticResult, { status: "VALID" }>,
    "submissionFingerprint"
  >,
  current: Pick<
    Extract<ProcedureRecordCancellationSemanticResult, { status: "VALID" }>,
    "submissionFingerprint"
  >,
): ProcedureRecordCancellationReplayResult {
  if (previous.submissionFingerprint === current.submissionFingerprint) {
    return { status: "REPLAY", submissionFingerprint: current.submissionFingerprint };
  }
  return {
    status: "REPLAY_CONFLICT",
    submissionFingerprint: current.submissionFingerprint,
  };
}
