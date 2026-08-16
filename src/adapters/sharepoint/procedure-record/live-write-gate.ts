/**
 * LIVE WRITE remains a later Human GO. This binder slice must not create items.
 */

import type { ProcedureRecordCreateAttempt } from "../../../domain/procedure-record-persistence";

export const PROCEDURE_RECORD_LIVE_WRITE_GATE = {
  itemCreateAuthorized: false,
  liveTenantIoAuthorized: false,
} as const;

export function refuseUnauthorizedLiveCreate(): ProcedureRecordCreateAttempt {
  return { status: "DEFINITE_FAILURE" };
}
