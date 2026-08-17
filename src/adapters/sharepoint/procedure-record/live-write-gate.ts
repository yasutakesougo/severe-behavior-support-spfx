/**
 * LIVE WRITE remains a later Human GO.
 * Default runtime cannot mint a capability. A valid Human GO packet must
 * match the execution SHA, List GUID, and site binding before minting.
 * Callers cannot assign production flags. Opening does not add POST code.
 */

import type { ProcedureRecordCreateAttempt } from "../../../domain/procedure-record-persistence";
import { normalizeSharePointGuid } from "./list-binding";
import { PROCEDURE_RECORD_TEST_ONLY_LIST_GUID } from "./test-only-provisioned-list";

export const PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE = "procedure-record-first-create" as const;

const MAIN_SHA_RE = /^[0-9a-f]{40}$/;

export type ProcedureRecordLiveWriteGoPacket = Readonly<{
  purpose: typeof PROCEDURE_RECORD_LIVE_WRITE_GO_PURPOSE;
  humanLiveWriteGo: true;
  expectedMainSha: string;
  listGuid: string;
  itemCount: 0;
  logicalSiteId: string;
  organizationId: string;
}>;

export type ProcedureRecordLiveWriteExecutionBinding = Readonly<{
  authoritativeMainSha: string;
  listGuid: string;
  organizationId: string;
  logicalSiteId: string;
}>;

export type ProcedureRecordLiveWriteExecutionEvidence = Readonly<{
  authoritativeMainSha: string;
}>;

const LIVE_WRITE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "procedure-record-live-write-authorization",
);

export type ProcedureRecordLiveWriteAuthorization = Readonly<{
  readonly [LIVE_WRITE_AUTHORIZATION_BRAND]: true;
}>;

export function refuseUnauthorizedLiveCreate(): ProcedureRecordCreateAttempt {
  return { status: "DEFINITE_FAILURE" };
}

/**
 * Process-wide default remains closed. Run-scoped capability lives on the
 * LIVE WRITE execution repository constructed from a bound GO packet.
 */
export function isProcedureRecordLiveWriteAuthorized(): boolean {
  return false;
}

export function isProcedureRecordLiveWriteAuthorization(
  value: unknown,
): value is ProcedureRecordLiveWriteAuthorization {
  if (typeof value !== "object" || !value) {
    return false;
  }
  return (
    (value as { [LIVE_WRITE_AUTHORIZATION_BRAND]?: true })[LIVE_WRITE_AUTHORIZATION_BRAND] === true
  );
}

function normalizeMainSha(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  return MAIN_SHA_RE.test(normalized) ? normalized : undefined;
}

export function isProcedureRecordLiveWriteGoPacket(
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
  const listGuid = normalizeSharePointGuid(
    typeof packet.listGuid === "string" ? packet.listGuid : "",
  );
  if (listGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID) {
    return false;
  }
  if (packet.itemCount !== 0) {
    return false;
  }
  if (typeof packet.logicalSiteId !== "string" || packet.logicalSiteId.length === 0) {
    return false;
  }
  if (normalizeSharePointGuid(packet.logicalSiteId) !== null) {
    return false;
  }
  if (typeof packet.organizationId !== "string" || packet.organizationId.length === 0) {
    return false;
  }
  return true;
}

function isBoundLiveWriteExecution(
  packet: ProcedureRecordLiveWriteGoPacket,
  execution: unknown,
): boolean {
  if (typeof execution !== "object" || !execution) {
    return false;
  }
  const binding = execution as Partial<ProcedureRecordLiveWriteExecutionBinding>;
  if (typeof binding.authoritativeMainSha !== "string") {
    return false;
  }
  const packetSha = normalizeMainSha(packet.expectedMainSha);
  const executionSha = normalizeMainSha(binding.authoritativeMainSha);
  if (packetSha === undefined || executionSha === undefined || packetSha !== executionSha) {
    return false;
  }
  const packetListGuid = normalizeSharePointGuid(packet.listGuid);
  const executionListGuid = normalizeSharePointGuid(
    typeof binding.listGuid === "string" ? binding.listGuid : "",
  );
  if (
    packetListGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID ||
    executionListGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
  ) {
    return false;
  }
  if (binding.organizationId !== packet.organizationId) {
    return false;
  }
  if (binding.logicalSiteId !== packet.logicalSiteId) {
    return false;
  }
  return true;
}

/**
 * Default mint. Always null. Normal application runtime has no capability.
 */
export function createProcedureRecordLiveWriteAuthorization(): ProcedureRecordLiveWriteAuthorization | null {
  return null;
}

/**
 * Run-scoped mint for the LIVE WRITE execution runner.
 * Packet fields must equal the execution SHA, List GUID, and site binding.
 */
export function createProcedureRecordLiveWriteAuthorizationFromGoPacket(
  packet: unknown,
  execution: unknown,
): ProcedureRecordLiveWriteAuthorization | null {
  if (
    !isProcedureRecordLiveWriteGoPacket(packet) ||
    !isBoundLiveWriteExecution(packet, execution)
  ) {
    return null;
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

export function isProcedureRecordKioskLiveVerifyGoPacket(
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
  const listGuid = normalizeSharePointGuid(
    typeof packet.listGuid === "string" ? packet.listGuid : "",
  );
  if (listGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID) {
    return false;
  }
  if (typeof packet.logicalSiteId !== "string" || packet.logicalSiteId.length === 0) {
    return false;
  }
  if (normalizeSharePointGuid(packet.logicalSiteId) !== null) {
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
  if (typeof binding.authoritativeMainSha !== "string") {
    return false;
  }
  const packetSha = normalizeMainSha(packet.expectedMainSha);
  const executionSha = normalizeMainSha(binding.authoritativeMainSha);
  if (packetSha === undefined || executionSha === undefined || packetSha !== executionSha) {
    return false;
  }
  const packetListGuid = normalizeSharePointGuid(packet.listGuid);
  const executionListGuid = normalizeSharePointGuid(
    typeof binding.listGuid === "string" ? binding.listGuid : "",
  );
  if (
    packetListGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID ||
    executionListGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID
  ) {
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
 * Default runtime does not call this. Invalid or unbound packets return null.
 */
export function createProcedureRecordKioskLiveVerifyAuthorizationFromGoPacket(
  packet: unknown,
  execution: unknown,
): ProcedureRecordLiveWriteAuthorization | null {
  if (
    !isProcedureRecordKioskLiveVerifyGoPacket(packet) ||
    !isBoundKioskLiveVerifyExecution(packet, execution)
  ) {
    return null;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
