/**
 * LIVE WRITE remains a later Human GO.
 * Default runtime cannot mint a capability. A valid Human GO packet is the
 * only run-scoped input that opens the reviewed create path.
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
 * LIVE WRITE execution repository constructed from a valid GO packet.
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
  if (typeof packet.expectedMainSha !== "string" || !MAIN_SHA_RE.test(packet.expectedMainSha)) {
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

/**
 * Default mint. Always null. Normal application runtime has no capability.
 */
export function createProcedureRecordLiveWriteAuthorization(): ProcedureRecordLiveWriteAuthorization | null {
  return null;
}

/**
 * Run-scoped mint for the LIVE WRITE execution runner.
 * Requires the exact Human GO packet; caller booleans are not sufficient.
 */
export function createProcedureRecordLiveWriteAuthorizationFromGoPacket(
  packet: unknown,
): ProcedureRecordLiveWriteAuthorization | null {
  if (!isProcedureRecordLiveWriteGoPacket(packet)) {
    return null;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
