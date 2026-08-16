/**
 * SPFx copy of the ProcedureRecord LIVE WRITE execution gate.
 * Packet rules must stay aligned with root live-write-gate.ts.
 * Default runtime cannot mint a capability. This module is not an index export
 * except through the dedicated live-write transport factory.
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
  if (typeof packet.expectedMainSha !== "string" || !MAIN_SHA_RE.test(packet.expectedMainSha)) {
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

/**
 * Run-scoped mint for the LIVE WRITE execution runner.
 * Returns undefined unless the exact Human GO packet is valid.
 */
export function createSpfxProcedureRecordLiveWriteAuthorizationFromGoPacket(
  packet: unknown,
): SpfxProcedureRecordLiveWriteAuthorization | undefined {
  if (!isSpfxProcedureRecordLiveWriteGoPacket(packet)) {
    return undefined;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
