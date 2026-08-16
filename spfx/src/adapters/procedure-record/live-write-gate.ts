/**
 * SPFx copy of the ProcedureRecord LIVE WRITE execution gate.
 * Private flags must stay aligned with root live-write-gate.ts.
 * Callers cannot read or assign the flags. This module is not an index export.
 * Opening both flags does not add POST code; it unlocks the reviewed path.
 */

const ITEM_CREATE_AUTHORIZED: boolean = false;
const LIVE_TENANT_IO_AUTHORIZED: boolean = false;

const LIVE_WRITE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "spfx-procedure-record-live-write-authorization",
);

export type SpfxProcedureRecordLiveWriteAuthorization = Readonly<{
  readonly [LIVE_WRITE_AUTHORIZATION_BRAND]: true;
}>;

function isProductionLiveWriteOpen(): boolean {
  return ITEM_CREATE_AUTHORIZED === true && LIVE_TENANT_IO_AUTHORIZED === true;
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

/**
 * Run-scoped token for the reviewed SPFx POST path.
 * Returns undefined until Human LIVE WRITE GO opens both private production flags.
 */
export function createSpfxProcedureRecordLiveWriteAuthorization():
  SpfxProcedureRecordLiveWriteAuthorization | undefined {
  if (!isProductionLiveWriteOpen()) {
    return undefined;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
