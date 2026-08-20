/**
 * Typings for the esbuild bundle of src/domain/procedure-record-cancellation-staff-save.ts.
 * Canonical persist remains src/domain. This bundle exists so SPFx isolated
 * rootDir can call submitCancellation without compiling domain as es5.
 */

export type ProcedureRecordCancellationSaveOutcome =
  | "saved"
  | "save_failed"
  | "save_outcome_unknown";

export type ProcedureRecordLifecycleEvent = Readonly<{
  schemaVersion: "1.0.0";
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
  eventType: "CANCEL";
  targetRecordId: string;
  recordedAt: string;
  recordedBy: string;
  reason?: string;
}>;

export interface ProcedureRecordCancellationPersistencePort {
  readonly liveWriteAuthorized: false;
  submitCancellation(request: {
    semanticsInput: unknown;
    recordedAtIso: string;
  }): Promise<{
    saveState: ProcedureRecordCancellationSaveOutcome;
    event: ProcedureRecordLifecycleEvent | null;
    appendCalled: boolean;
  }>;
  listCancellations(targetRecordId: string): Promise<unknown>;
}

export type StaffProcedureRecordCancellationSaveInput = Readonly<{
  semanticsInput: unknown;
  recordedAtIso?: string;
  nowIso: string;
}>;

export type StaffProcedureRecordCancellationSaveResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  event: ProcedureRecordLifecycleEvent | null;
  appendCalled: boolean;
}>;

export function createInMemoryProcedureRecordCancellationPersistencePort(
  options?: Readonly<{
    appendMode?: "created" | "definite_failure" | "indeterminate" | "created_without_readback";
  }>,
): ProcedureRecordCancellationPersistencePort & {
  readonly storage: {
    appendCalls: number;
    appendMode: string;
  };
};

export function persistStaffProcedureRecordCancellation(
  input: StaffProcedureRecordCancellationSaveInput,
  port: ProcedureRecordCancellationPersistencePort,
): Promise<StaffProcedureRecordCancellationSaveResult>;

export function nowAsiaTokyoIsoDateTime(): string | null;
