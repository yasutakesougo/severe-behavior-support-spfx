import { validateAuditEvent, type AuditEvent } from "./finding-audit";
import { isRecord } from "./validation";

/**
 * AuditEvent persistence write-result vocabulary.
 * Decision-AUD-ALIGN-1 / persistence technical contract: exactly these six values.
 */
export const AUDIT_EVENT_WRITE_RESULTS = [
  "SAVED",
  "VALIDATION_FAILED",
  "FORBIDDEN",
  "CONFLICT",
  "SAVE_FAILED",
  "SAVE_OUTCOME_UNKNOWN",
] as const;

export type AuditEventWriteResult = (typeof AUDIT_EVENT_WRITE_RESULTS)[number];

/**
 * Write-request envelope (Decision-AUD-IDEM-1).
 * IdempotencyKey is write-request metadata — not an AuditEvent domain field.
 * PayloadFingerprint is not used (Decision-AUD-REPLAY-1).
 */
export type AuditEventWriteRequest = Readonly<{
  auditEvent: AuditEvent;
  idempotencyKey: string;
}>;

/**
 * Logical persisted evidence for existing-result verification.
 * Physical repository metadata is intentionally excluded.
 */
export type PersistedAuditEventWrite = Readonly<{
  auditEvent: AuditEvent;
  idempotencyKey: string;
}>;

export type AuditEventExistingLookupResult =
  | Readonly<{
      kind: "FOUND";
      persisted: unknown;
    }>
  | Readonly<{
      kind: "NOT_FOUND";
    }>
  | Readonly<{
      kind: "FORBIDDEN";
    }>
  | Readonly<{
      kind: "RETRIEVAL_FAILED";
    }>;

/**
 * Existing-result lookup boundary.
 * Concrete repository / SharePoint implementation is out of scope.
 */
export interface AuditEventExistingResultPort {
  findByRecordId(recordId: string): Promise<AuditEventExistingLookupResult>;
  findByIdempotencyKey(idempotencyKey: string): Promise<AuditEventExistingLookupResult>;
}

/**
 * Logical AuditEvent persistence port.
 * No SharePoint / PnPjs / REST dependency.
 */
export interface AuditEventPersistencePort {
  save(request: AuditEventWriteRequest): Promise<AuditEventWriteResult>;
}

export type AuditEventExistingVerification =
  "SAME" | "CONFLICT" | "NOT_FOUND" | "FORBIDDEN" | "RETRIEVAL_FAILED" | "MALFORMED";

const AUDIT_EVENT_SEMANTIC_PAYLOAD_FIELDS = [
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
] as const satisfies ReadonlyArray<Exclude<keyof AuditEvent, "auditEventId">>;

function hasExactKeys(value: Record<string, unknown>, expectedKeys: readonly string[]): boolean {
  const keys = Object.keys(value);
  return keys.length === expectedKeys.length && keys.every((key) => expectedKeys.includes(key));
}

function isPersistedAuditEventWrite(value: unknown): value is PersistedAuditEventWrite {
  if (!isRecord(value) || !hasExactKeys(value, ["auditEvent", "idempotencyKey"])) {
    return false;
  }

  return typeof value.idempotencyKey === "string" && validateAuditEvent(value.auditEvent);
}

/**
 * Decision-AUD-REPLAY-1 semantic payload equality.
 * auditEventId is identity and is intentionally excluded from payload comparison.
 * No normalization / trimming / coercion / fingerprint is performed.
 */
export function hasSameAuditEventSemanticPayload(left: AuditEvent, right: AuditEvent): boolean {
  return AUDIT_EVENT_SEMANTIC_PAYLOAD_FIELDS.every((field) => left[field] === right[field]);
}

function hasSamePersistedAuditEventWrite(
  left: PersistedAuditEventWrite,
  right: PersistedAuditEventWrite,
): boolean {
  return (
    left.auditEvent.auditEventId === right.auditEvent.auditEventId &&
    left.idempotencyKey === right.idempotencyKey &&
    hasSameAuditEventSemanticPayload(left.auditEvent, right.auditEvent)
  );
}

type NormalizedLookupResult =
  | Readonly<{
      kind: "FOUND";
      persisted: PersistedAuditEventWrite;
    }>
  | Readonly<{
      kind: "NOT_FOUND" | "FORBIDDEN" | "RETRIEVAL_FAILED" | "MALFORMED";
    }>;

async function performLookup(
  lookup: () => Promise<AuditEventExistingLookupResult>,
): Promise<AuditEventExistingLookupResult | Readonly<{ kind: "RETRIEVAL_FAILED" }>> {
  try {
    return await lookup();
  } catch {
    return { kind: "RETRIEVAL_FAILED" };
  }
}

function normalizeLookupResult(result: unknown): NormalizedLookupResult {
  if (!isRecord(result) || typeof result.kind !== "string") {
    return { kind: "MALFORMED" };
  }

  if (result.kind === "FOUND") {
    if (!("persisted" in result) || !isPersistedAuditEventWrite(result.persisted)) {
      return { kind: "MALFORMED" };
    }
    return { kind: "FOUND", persisted: result.persisted };
  }

  if (
    result.kind === "NOT_FOUND" ||
    result.kind === "FORBIDDEN" ||
    result.kind === "RETRIEVAL_FAILED"
  ) {
    return { kind: result.kind };
  }

  return { kind: "MALFORMED" };
}

function classifyExistingLookupEvidence(
  request: AuditEventWriteRequest,
  byRecordId: NormalizedLookupResult,
  byIdempotencyKey: NormalizedLookupResult,
): AuditEventExistingVerification {
  if (byRecordId.kind === "FORBIDDEN" || byIdempotencyKey.kind === "FORBIDDEN") {
    return "FORBIDDEN";
  }

  if (byRecordId.kind === "RETRIEVAL_FAILED" || byIdempotencyKey.kind === "RETRIEVAL_FAILED") {
    return "RETRIEVAL_FAILED";
  }

  if (byRecordId.kind === "MALFORMED" || byIdempotencyKey.kind === "MALFORMED") {
    return "MALFORMED";
  }

  if (byRecordId.kind === "NOT_FOUND" && byIdempotencyKey.kind === "NOT_FOUND") {
    return "NOT_FOUND";
  }

  if (byRecordId.kind !== "FOUND" || byIdempotencyKey.kind !== "FOUND") {
    return "CONFLICT";
  }

  if (!hasSamePersistedAuditEventWrite(byRecordId.persisted, byIdempotencyKey.persisted)) {
    return "CONFLICT";
  }

  const persisted = byRecordId.persisted;
  if (
    persisted.auditEvent.auditEventId !== request.auditEvent.auditEventId ||
    persisted.idempotencyKey !== request.idempotencyKey ||
    !hasSameAuditEventSemanticPayload(persisted.auditEvent, request.auditEvent)
  ) {
    return "CONFLICT";
  }

  return "SAME";
}

/**
 * Dual lookup existing-result verification (Decision-AUD-REPLAY-1).
 * Both lookups are required; one-sided evidence never authorizes a new save.
 */
export async function verifyExistingAuditEventWrite(
  request: AuditEventWriteRequest,
  port: AuditEventExistingResultPort,
): Promise<AuditEventExistingVerification> {
  const [recordLookup, keyLookup] = await Promise.all([
    performLookup(() => port.findByRecordId(request.auditEvent.auditEventId)),
    performLookup(() => port.findByIdempotencyKey(request.idempotencyKey)),
  ]);

  return classifyExistingLookupEvidence(
    request,
    normalizeLookupResult(recordLookup),
    normalizeLookupResult(keyLookup),
  );
}

/**
 * Validation-before-write orchestration.
 * Invalid events return VALIDATION_FAILED without calling the port.
 * Port results are returned unchanged; no retry / no result remapping.
 */
export async function persistAuditEvent(
  request: AuditEventWriteRequest,
  port: AuditEventPersistencePort,
): Promise<AuditEventWriteResult> {
  if (!validateAuditEvent(request.auditEvent)) {
    return "VALIDATION_FAILED";
  }

  return port.save(request);
}

function mapPreSaveVerification(
  result: AuditEventExistingVerification,
): AuditEventWriteResult | null {
  switch (result) {
    case "SAME":
      return "SAVED";
    case "CONFLICT":
      return "CONFLICT";
    case "FORBIDDEN":
      return "FORBIDDEN";
    case "RETRIEVAL_FAILED":
    case "MALFORMED":
      return "SAVE_FAILED";
    case "NOT_FOUND":
      return null;
  }
}

function mapUnknownRecoveryVerification(
  result: AuditEventExistingVerification,
): AuditEventWriteResult {
  switch (result) {
    case "SAME":
      return "SAVED";
    case "CONFLICT":
      return "CONFLICT";
    case "NOT_FOUND":
    case "FORBIDDEN":
    case "RETRIEVAL_FAILED":
    case "MALFORMED":
      return "SAVE_OUTCOME_UNKNOWN";
  }
}

/**
 * Replay-aware logical persistence orchestration.
 *
 * - validates before lookup/write
 * - requires both lookups before a new save
 * - returns SAVED for confirmed safe replay without writing
 * - preserves fail-closed lookup failures
 * - verifies SAVE_OUTCOME_UNKNOWN without automatic/blind retry
 *
 * Retry eligibility/count/backoff and concrete repository behavior remain separate decisions.
 */
export async function persistAuditEventWithReplay(
  request: AuditEventWriteRequest,
  persistencePort: AuditEventPersistencePort,
  existingResultPort: AuditEventExistingResultPort,
): Promise<AuditEventWriteResult> {
  if (!validateAuditEvent(request.auditEvent)) {
    return "VALIDATION_FAILED";
  }

  const preSaveVerification = await verifyExistingAuditEventWrite(request, existingResultPort);
  const preSaveResult = mapPreSaveVerification(preSaveVerification);
  if (preSaveResult !== null) {
    return preSaveResult;
  }

  const saveResult = await persistencePort.save(request);
  if (saveResult !== "SAVE_OUTCOME_UNKNOWN") {
    return saveResult;
  }

  const recoveryVerification = await verifyExistingAuditEventWrite(request, existingResultPort);
  return mapUnknownRecoveryVerification(recoveryVerification);
}
