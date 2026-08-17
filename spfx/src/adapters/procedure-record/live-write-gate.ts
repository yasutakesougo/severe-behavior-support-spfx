/**
 * SPFx copy of the ProcedureRecord LIVE WRITE execution gate.
 * Packet rules must stay aligned with root live-write-gate.ts.
 * Packet List GUID and expectedMainSha must equal the transport target
 * and the runner-confirmed main SHA. Opening does not add POST code.
 */

export const PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE = "procedure-record-first-create" as const;

const EXPECTED_LIST_GUID = "b971ff03-799e-41ac-b037-8becb9f4ff4b";
const MAIN_SHA_RE = /^[0-9a-f]{40}$/;
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type ProcedureRecordLiveWriteGoPacket = Readonly<{
  purpose: typeof PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE;
  humanLiveWriteGo: true;
  expectedMainSha: string;
  listGuid: string;
  itemCount: 0;
  logicalSiteId: string;
  organizationId: string;
}>;

export type ProcedureRecordLiveWriteTransportExecutionBinding = Readonly<{
  authoritativeMainSha: string;
  listGuid: string;
}>;

const LIVE_WRITE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "spfx-procedure-record-live-write-authorization",
);

export type SpfxProcedureRecordLiveWriteAuthorization = Readonly<{
  readonly [LIVE_WRITE_AUTHORIZATION_BRAND]: true;
}>;

function normalizeListGuid(value: string): string | undefined {
  const normalized = value
    .trim()
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  return GUID_RE.test(normalized) ? normalized : undefined;
}

function normalizeMainSha(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  return MAIN_SHA_RE.test(normalized) ? normalized : undefined;
}

export function isSpfxProcedureRecordLiveWriteAuthorization(
  value: unknown,
): value is SpfxProcedureRecordLiveWriteAuthorization {
  if (typeof value !== "object" || !value) {
    return false;
  }
  return (
    (value as { [LIVE_WRITE_AUTHORIZATION_BRAND]?: true })[LIVE_WRITE_AUTHORIZATION_BRAND] === true
  );
}

export function isSpfxProcedureRecordLiveWriteGoPacket(
  value: unknown,
): value is ProcedureRecordLiveWriteGoPacket {
  if (typeof value !== "object" || !value) {
    return false;
  }
  const packet = value as Partial<ProcedureRecordLiveWriteGoPacket>;
  if (packet.purpose !== PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE) {
    return false;
  }
  if (packet.humanLiveWriteGo !== true) {
    return false;
  }
  if (typeof packet.expectedMainSha !== "string" || !normalizeMainSha(packet.expectedMainSha)) {
    return false;
  }
  const listGuid =
    typeof packet.listGuid === "string" ? normalizeListGuid(packet.listGuid) : undefined;
  if (listGuid !== EXPECTED_LIST_GUID) {
    return false;
  }
  if (packet.itemCount !== 0) {
    return false;
  }
  if (typeof packet.logicalSiteId !== "string" || packet.logicalSiteId.length === 0) {
    return false;
  }
  if (normalizeListGuid(packet.logicalSiteId) !== undefined) {
    return false;
  }
  if (typeof packet.organizationId !== "string" || packet.organizationId.length === 0) {
    return false;
  }
  return true;
}

function isBoundTransportExecution(
  packet: ProcedureRecordLiveWriteGoPacket,
  execution: unknown,
): boolean {
  if (typeof execution !== "object" || !execution) {
    return false;
  }
  const binding = execution as Partial<ProcedureRecordLiveWriteTransportExecutionBinding>;
  if (typeof binding.authoritativeMainSha !== "string" || typeof binding.listGuid !== "string") {
    return false;
  }
  const packetSha = normalizeMainSha(packet.expectedMainSha);
  const executionSha = normalizeMainSha(binding.authoritativeMainSha);
  if (packetSha === undefined || executionSha === undefined || packetSha !== executionSha) {
    return false;
  }
  const packetListGuid = normalizeListGuid(packet.listGuid);
  const executionListGuid = normalizeListGuid(binding.listGuid);
  return packetListGuid === EXPECTED_LIST_GUID && executionListGuid === EXPECTED_LIST_GUID;
}

/**
 * Run-scoped mint for the LIVE WRITE execution runner.
 * Returns undefined unless the packet SHA and List GUID equal the transport target.
 */
export function createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket(
  packet: unknown,
  execution: unknown,
): SpfxProcedureRecordLiveWriteAuthorization | undefined {
  if (
    !isSpfxProcedureRecordLiveWriteGoPacket(packet) ||
    !isBoundTransportExecution(packet, execution)
  ) {
    return undefined;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}

/**
 * KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1 only.
 * Does not replace procedure-record-first-create. Does not authorize generic CREATE.
 */
export const PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE =
  "kiosk-spfx-persistence-live-verify-1" as const;

export const PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET = {
  create: 1,
  update: 0,
  delete: 0,
  retryPost: 0,
} as const;

export type ProcedureRecordKioskLiveVerifyMutationBudget =
  typeof PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET;

const IDENTITY_DIGEST_RE = /^[0-9a-f]{64}$/;

export type ProcedureRecordKioskLiveVerifyGoPacket = Readonly<{
  purpose: typeof PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE;
  humanLiveWriteGo: true;
  expectedMainSha: string;
  listGuid: string;
  logicalSiteId: string;
  organizationId: string;
  recordId: string;
  idempotencyKey: string;
  payloadFingerprint: string;
  mutationBudget: ProcedureRecordKioskLiveVerifyMutationBudget;
}>;

export type ProcedureRecordKioskLiveVerifyExecutionBinding = Readonly<{
  authoritativeMainSha: string;
  listGuid: string;
  organizationId: string;
  logicalSiteId: string;
  recordId: string;
  idempotencyKey: string;
  payloadFingerprint: string;
}>;

function normalizeIdentityDigest(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  return IDENTITY_DIGEST_RE.test(normalized) ? normalized : undefined;
}

function isExactKioskMutationBudget(
  value: unknown,
): value is ProcedureRecordKioskLiveVerifyMutationBudget {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const budget = value as Record<string, unknown>;
  const keys = Object.keys(budget);
  if (keys.length !== 4) {
    return false;
  }
  return (
    budget.create === PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET.create &&
    budget.update === PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET.update &&
    budget.delete === PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET.delete &&
    budget.retryPost === PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_MUTATION_BUDGET.retryPost
  );
}

export function isSpfxProcedureRecordKioskLiveVerifyGoPacket(
  value: unknown,
): value is ProcedureRecordKioskLiveVerifyGoPacket {
  if (typeof value !== "object" || !value) {
    return false;
  }
  const packet = value as Partial<ProcedureRecordKioskLiveVerifyGoPacket>;
  if (packet.purpose !== PROCEDURE_RECORD_KIOSK_LIVE_VERIFY_GO_PURPOSE) {
    return false;
  }
  if (packet.humanLiveWriteGo !== true) {
    return false;
  }
  if (typeof packet.expectedMainSha !== "string" || !normalizeMainSha(packet.expectedMainSha)) {
    return false;
  }
  const listGuid =
    typeof packet.listGuid === "string" ? normalizeListGuid(packet.listGuid) : undefined;
  if (listGuid !== EXPECTED_LIST_GUID) {
    return false;
  }
  if (typeof packet.logicalSiteId !== "string" || packet.logicalSiteId.length === 0) {
    return false;
  }
  if (normalizeListGuid(packet.logicalSiteId) !== undefined) {
    return false;
  }
  if (typeof packet.organizationId !== "string" || packet.organizationId.length === 0) {
    return false;
  }
  if (typeof packet.recordId !== "string" || !normalizeIdentityDigest(packet.recordId)) {
    return false;
  }
  if (
    typeof packet.idempotencyKey !== "string" ||
    !normalizeIdentityDigest(packet.idempotencyKey)
  ) {
    return false;
  }
  if (
    typeof packet.payloadFingerprint !== "string" ||
    !normalizeIdentityDigest(packet.payloadFingerprint)
  ) {
    return false;
  }
  if (!isExactKioskMutationBudget(packet.mutationBudget)) {
    return false;
  }
  return true;
}

function isBoundKioskLiveVerifyExecution(
  packet: ProcedureRecordKioskLiveVerifyGoPacket,
  execution: unknown,
): boolean {
  if (typeof execution !== "object" || !execution) {
    return false;
  }
  const binding = execution as Partial<ProcedureRecordKioskLiveVerifyExecutionBinding>;
  if (typeof binding.authoritativeMainSha !== "string" || typeof binding.listGuid !== "string") {
    return false;
  }
  const packetSha = normalizeMainSha(packet.expectedMainSha);
  const executionSha = normalizeMainSha(binding.authoritativeMainSha);
  if (packetSha === undefined || executionSha === undefined || packetSha !== executionSha) {
    return false;
  }
  const packetListGuid = normalizeListGuid(packet.listGuid);
  const executionListGuid = normalizeListGuid(binding.listGuid);
  if (packetListGuid !== EXPECTED_LIST_GUID || executionListGuid !== EXPECTED_LIST_GUID) {
    return false;
  }
  if (binding.organizationId !== packet.organizationId) {
    return false;
  }
  if (binding.logicalSiteId !== packet.logicalSiteId) {
    return false;
  }
  const packetRecordId = normalizeIdentityDigest(packet.recordId);
  const executionRecordId =
    typeof binding.recordId === "string" ? normalizeIdentityDigest(binding.recordId) : undefined;
  const packetIdempotencyKey = normalizeIdentityDigest(packet.idempotencyKey);
  const executionIdempotencyKey =
    typeof binding.idempotencyKey === "string"
      ? normalizeIdentityDigest(binding.idempotencyKey)
      : undefined;
  const packetFingerprint = normalizeIdentityDigest(packet.payloadFingerprint);
  const executionFingerprint =
    typeof binding.payloadFingerprint === "string"
      ? normalizeIdentityDigest(binding.payloadFingerprint)
      : undefined;
  return (
    packetRecordId !== undefined &&
    packetRecordId === executionRecordId &&
    packetIdempotencyKey !== undefined &&
    packetIdempotencyKey === executionIdempotencyKey &&
    packetFingerprint !== undefined &&
    packetFingerprint === executionFingerprint
  );
}

/**
 * Run-scoped mint for KIOSK-SPFX-PERSISTENCE-LIVE-VERIFY-1.
 * Default runtime does not call this. Invalid or unbound packets return undefined.
 */
export function createSpfxProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket(
  packet: unknown,
  execution: unknown,
): SpfxProcedureRecordLiveWriteAuthorization | undefined {
  if (
    !isSpfxProcedureRecordKioskLiveVerifyGoPacket(packet) ||
    !isBoundKioskLiveVerifyExecution(packet, execution)
  ) {
    return undefined;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
