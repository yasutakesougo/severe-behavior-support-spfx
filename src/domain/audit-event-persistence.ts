import { validateAuditEvent, type AuditEvent } from "./finding-audit";

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
 * PayloadFingerprint is deferred and not included in this unit.
 */
export type AuditEventWriteRequest = Readonly<{
  auditEvent: AuditEvent;
  idempotencyKey: string;
}>;

/**
 * Logical AuditEvent persistence port.
 * No SharePoint / PnPjs / REST dependency.
 */
export interface AuditEventPersistencePort {
  save(request: AuditEventWriteRequest): Promise<AuditEventWriteResult>;
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
