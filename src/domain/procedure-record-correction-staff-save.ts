/**
 * Staff UI → ProcedureRecordCorrection submit mapping.
 * Reuses domain assemble + persistence port. No SharePoint I/O.
 */

import {
  asiaTokyoDateTimeLocalToIso,
  nowAsiaTokyoIsoDateTime,
} from "./procedure-record-staff-save";
import type {
  FieldStaffCorrectionAuthContext,
  ProcedureRecordCorrection,
  ProcedureRecordCorrectionOriginalBinding,
} from "./procedure-record-correction";
import {
  createInMemoryProcedureRecordCorrectionPersistencePort,
  type ProcedureRecordCorrectionPersistencePort,
  type ProcedureRecordCorrectionSaveOutcome,
} from "./procedure-record-correction-persistence";
import { toAsiaTokyoCalendarDay } from "./support-plan";

export type StaffProcedureRecordCorrectionSaveInput = Readonly<{
  originalBinding: ProcedureRecordCorrectionOriginalBinding;
  result: unknown;
  performedAtLocal: string;
  reason: string;
  correctedBy: string;
  /** Frozen from the first attempt of this payload; retry must reuse it. */
  correctedAtIso?: string;
  nowIso: string;
  /** Injectable auth override for unit tests. Default: AUTHORIZED + correctedBy. */
  auth?: FieldStaffCorrectionAuthContext;
}>;

export type StaffProcedureRecordCorrectionSaveResult = Readonly<{
  saveState: ProcedureRecordCorrectionSaveOutcome;
  correction: ProcedureRecordCorrection | null;
  appendCalled: boolean;
}>;

export function isCorrectionPerformedAtSameLocalDate(
  performedAtLocal: string,
  originalLocalDate: string,
): boolean {
  const performedAt = asiaTokyoDateTimeLocalToIso(performedAtLocal);
  if (performedAt === null) {
    return false;
  }
  const localDay = toAsiaTokyoCalendarDay(performedAt);
  return localDay === originalLocalDate;
}

export async function persistStaffProcedureRecordCorrection(
  input: StaffProcedureRecordCorrectionSaveInput,
  port: ProcedureRecordCorrectionPersistencePort,
): Promise<StaffProcedureRecordCorrectionSaveResult> {
  const performedAt = asiaTokyoDateTimeLocalToIso(input.performedAtLocal);
  if (performedAt === null) {
    return { saveState: "save_failed", correction: null, appendCalled: false };
  }

  const auth: FieldStaffCorrectionAuthContext = input.auth ?? {
    status: "AUTHORIZED",
    correctedBy: input.correctedBy,
  };

  const client = {
    originalRecordId: input.originalBinding.originalRecordId,
    result: input.result,
    performedAt,
    reason: input.reason.trim(),
  };

  const result = await port.submitCorrection(
    {
      client,
      originalBinding: input.originalBinding,
      correctedAtIso: input.correctedAtIso,
      nowIso: input.nowIso,
    },
    auth,
  );

  return {
    saveState: result.saveState,
    correction: result.correction,
    appendCalled: result.appendCalled,
  };
}

export {
  asiaTokyoDateTimeLocalToIso,
  createInMemoryProcedureRecordCorrectionPersistencePort,
  nowAsiaTokyoIsoDateTime,
  toAsiaTokyoCalendarDay,
  type ProcedureRecordCorrectionPersistencePort,
  type ProcedureRecordCorrectionSaveOutcome,
};
