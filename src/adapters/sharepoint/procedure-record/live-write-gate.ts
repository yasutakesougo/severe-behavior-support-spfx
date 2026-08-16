/**
 * LIVE WRITE remains a later Human GO.
 * Production constants are the execution gate. Callers cannot override them.
 * Opening both flags does not add POST code; it unlocks the reviewed path.
 */

import type { ProcedureRecordCreateAttempt } from "../../../domain/procedure-record-persistence";

export type ProcedureRecordWriteGate = Readonly<{
  itemCreateAuthorized: boolean;
  liveTenantIoAuthorized: boolean;
}>;

export const PROCEDURE_RECORD_LIVE_WRITE_GATE: ProcedureRecordWriteGate = {
  itemCreateAuthorized: false,
  liveTenantIoAuthorized: false,
};

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
 * Production live create requires both flags.
 * itemCreateAuthorized alone is not sufficient.
 */
export function isProcedureRecordItemCreateAuthorized(gate: ProcedureRecordWriteGate): boolean {
  return gate.itemCreateAuthorized === true && gate.liveTenantIoAuthorized === true;
}

/**
 * Run-scoped token for the reviewed POST path.
 * Returns null until Human LIVE WRITE GO opens both production flags.
 * The token cannot be forged from caller booleans.
 */
export function createProcedureRecordLiveWriteAuthorization(): ProcedureRecordLiveWriteAuthorization | null {
  if (!isProcedureRecordItemCreateAuthorized(PROCEDURE_RECORD_LIVE_WRITE_GATE)) {
    return null;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
