/**
 * LIVE WRITE remains a later Human GO.
 * Production constants are the enforcement gate, not caller-overridable flags.
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
