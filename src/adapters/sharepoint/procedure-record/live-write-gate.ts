/**
 * LIVE WRITE remains a later Human GO.
 * Gate flags are module-private. Callers cannot read or assign them.
 * Opening both flags does not add POST code; it unlocks the reviewed path.
 */

import type { ProcedureRecordCreateAttempt } from "../../../domain/procedure-record-persistence";

const ITEM_CREATE_AUTHORIZED: boolean = false;
const LIVE_TENANT_IO_AUTHORIZED: boolean = false;

const LIVE_WRITE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "procedure-record-live-write-authorization",
);

export type ProcedureRecordLiveWriteAuthorization = Readonly<{
  readonly [LIVE_WRITE_AUTHORIZATION_BRAND]: true;
}>;

export function refuseUnauthorizedLiveCreate(): ProcedureRecordCreateAttempt {
  return { status: "DEFINITE_FAILURE" };
}

function isProductionLiveWriteOpen(): boolean {
  return ITEM_CREATE_AUTHORIZED === true && LIVE_TENANT_IO_AUTHORIZED === true;
}

export function isProcedureRecordLiveWriteAuthorized(): boolean {
  return isProductionLiveWriteOpen();
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

/**
 * Run-scoped token for the reviewed POST path.
 * Returns null until Human LIVE WRITE GO opens both private production flags.
 * The token cannot be forged from caller booleans.
 */
export function createProcedureRecordLiveWriteAuthorization(): ProcedureRecordLiveWriteAuthorization | null {
  if (!isProductionLiveWriteOpen()) {
    return null;
  }
  return { [LIVE_WRITE_AUTHORIZATION_BRAND]: true };
}
