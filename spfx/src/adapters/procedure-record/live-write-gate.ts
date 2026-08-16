/**
 * SPFx copy of the ProcedureRecord LIVE WRITE execution gate.
 * Must stay aligned with PROCEDURE_RECORD_LIVE_WRITE_GATE in root src/.
 * Callers cannot pass write flags into the host factory.
 * Opening both flags does not add POST code; it unlocks the reviewed path.
 */

const LIVE_WRITE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "spfx-procedure-record-live-write-authorization",
);

export type SpfxProcedureRecordLiveWriteAuthorization = Readonly<{
  readonly [LIVE_WRITE_AUTHORIZATION_BRAND]: true;
}>;

export const SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE: {
  itemCreateAuthorized: boolean;
  liveTenantIoAuthorized: boolean;
} = {
  itemCreateAuthorized: false,
  liveTenantIoAuthorized: false,
};

export function isSpfxProcedureRecordItemCreateAuthorized(): boolean {
  return (
    SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE.itemCreateAuthorized === true &&
    SPFX_PROCEDURE_RECORD_LIVE_WRITE_GATE.liveTenantIoAuthorized === true
  );
}

/**
 * Run-scoped token for the reviewed SPFx POST path.
 * Returns undefined until Human LIVE WRITE GO opens both production flags.
 */
export function createSpfxProcedureRecordLiveWriteAuthorization():
  SpfxProcedureRecordLiveWriteAuthorization | undefined {
  if (!isSpfxProcedureRecordItemCreateAuthorized()) {
    return undefined;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
