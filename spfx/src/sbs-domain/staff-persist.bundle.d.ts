/**
 * Typings for the esbuild bundle of src/domain/procedure-record-staff-save.ts.
 * Canonical persist remains src/domain. This bundle exists so SPFx isolated
 * rootDir can call persistProcedureRecord without compiling domain as es5.
 */

export type ProcedureRecordSaveOutcome = "saved" | "save_failed" | "save_outcome_unknown";

export type ProcedureRecordCreateAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

export interface ProcedureRecordPersistencePort {
  findByRecordId(recordId: string): Promise<unknown>;
  findByIdempotencyKey(idempotencyKey: string): Promise<unknown>;
  create(record: unknown): Promise<ProcedureRecordCreateAttempt>;
}

export type StaffProcedureRecordCreateInput = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  recordedBy: string;
  planId: string;
  planVersion: number;
  ProcedureId: string;
  ProcedureVersion: string;
  result: unknown;
  performedAtLocal: string;
  recordedAtIso?: string;
  nowIso: string;
}>;

export type StaffProcedureRecordSaveResult = Readonly<{
  saveState: ProcedureRecordSaveOutcome;
  record: unknown | null;
  persistCalled: boolean;
}>;

export function createLiveWriteHoldProcedureRecordPersistencePort(): ProcedureRecordPersistencePort;
export function persistProcedureRecord(
  record: unknown,
  port: ProcedureRecordPersistencePort,
): Promise<ProcedureRecordSaveOutcome>;
export function persistStaffProcedureRecord(
  input: StaffProcedureRecordCreateInput,
  port: ProcedureRecordPersistencePort,
): Promise<StaffProcedureRecordSaveResult>;
export function nowAsiaTokyoIsoDateTime(): string | undefined;
export function asiaTokyoDateTimeLocalToIso(local: string): string | null;
export function assembleProcedureRecordForCreate(input: StaffProcedureRecordCreateInput): unknown;
