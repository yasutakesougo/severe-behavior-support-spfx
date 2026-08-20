/**
 * Typings for the esbuild bundle of src/domain/procedure-record-correction-staff-save.ts.
 * Canonical persist remains src/domain. This bundle exists so SPFx isolated
 * rootDir can call submitCorrection without compiling domain as es5.
 */

export type ProcedureRecordCorrectionSaveOutcome = "saved" | "save_failed" | "save_outcome_unknown";

export type FieldStaffCorrectionAuthContext =
  | Readonly<{ status: "AUTHORIZED"; correctedBy: string }>
  | Readonly<{ status: "NOT_AUTHENTICATED" }>
  | Readonly<{ status: "NOT_AUTHORIZED" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export type ProcedureRecordCorrectionOriginalBinding = Readonly<{
  originalRecordId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  Procedure: Readonly<{
    ProcedureId: string;
    ProcedureVersion: string;
    ApprovalState: "APPROVED";
  }>;
  planId: string;
  planVersion: number;
  originalRecordedAt: string;
  originalRecordedBy: string;
  originalLocalDate: string;
}>;

export type ProcedureRecordCorrection = Readonly<{
  CorrectionId: string;
  IdempotencyKey: string;
  originalRecordId: string;
  result: string;
  performedAt: string;
  reason: string;
  correctedAt: string;
  correctedBy: string;
}>;

export interface ProcedureRecordCorrectionPersistencePort {
  readonly liveWriteAuthorized: false;
  submitCorrection(
    request: unknown,
    authenticatedFieldStaffContext: FieldStaffCorrectionAuthContext,
  ): Promise<{
    saveState: ProcedureRecordCorrectionSaveOutcome;
    correction: ProcedureRecordCorrection | null;
    appendCalled: boolean;
  }>;
  listCorrections(originalRecordId: string): Promise<unknown>;
}

export type StaffProcedureRecordCorrectionSaveInput = Readonly<{
  originalBinding: ProcedureRecordCorrectionOriginalBinding;
  result: unknown;
  performedAtLocal: string;
  reason: string;
  correctedBy: string;
  correctedAtIso?: string;
  nowIso: string;
  auth?: FieldStaffCorrectionAuthContext;
}>;

export type StaffProcedureRecordCorrectionSaveResult = Readonly<{
  saveState: ProcedureRecordCorrectionSaveOutcome;
  correction: ProcedureRecordCorrection | null;
  appendCalled: boolean;
}>;

export function createInMemoryProcedureRecordCorrectionPersistencePort(
  options?: Readonly<{
    appendMode?: "created" | "definite_failure" | "indeterminate" | "created_without_readback";
  }>,
): ProcedureRecordCorrectionPersistencePort & {
  readonly storage: {
    appendCalls: number;
    appendMode: string;
  };
};

export function persistStaffProcedureRecordCorrection(
  input: StaffProcedureRecordCorrectionSaveInput,
  port: ProcedureRecordCorrectionPersistencePort,
): Promise<StaffProcedureRecordCorrectionSaveResult>;

export function asiaTokyoDateTimeLocalToIso(local: string): string | null;
export function isCorrectionPerformedAtSameLocalDate(
  performedAtLocal: string,
  originalLocalDate: string,
): boolean;
export function toAsiaTokyoCalendarDay(isoDateTime: string): string | null;
export function nowAsiaTokyoIsoDateTime(): string | null;
