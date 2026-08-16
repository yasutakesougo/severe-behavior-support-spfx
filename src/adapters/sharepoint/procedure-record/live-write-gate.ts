/**
 * LIVE WRITE remains a later Human GO.
 * This slice may implement createItem, but production constants stay closed.
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

export function isProcedureRecordItemCreateAuthorized(gate: ProcedureRecordWriteGate): boolean {
  return gate.itemCreateAuthorized === true;
}
