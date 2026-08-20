/**
 * ProcedureRecordCorrection persistence port + orchestration
 * (FIELD-STAFF-CORRECTION-PERSISTENCE-DOMAIN-CONTRACT-FAKE-PORT-1).
 *
 * Append-only only. No Correction UPDATE/DELETE.
 * No ProcedureRecord UPDATE/DELETE/replacement.
 * No lifecycle / cancellation methods (C7=A).
 * liveWriteAuthorized remains false (C9=B).
 */

import type { LookupResult } from "../contracts/types";
import {
  assembleProcedureRecordCorrection,
  copyProcedureRecordCorrection,
  orderProcedureRecordCorrections,
  PROCEDURE_RECORD_CORRECTION_LIVE_WRITE_AUTHORIZED,
  validateProcedureRecordCorrection,
  type AssembleProcedureRecordCorrectionInput,
  type FieldStaffCorrectionAuthContext,
  type ProcedureRecordCorrection,
  type ProcedureRecordCorrectionClientInput,
  type ProcedureRecordCorrectionOriginalBinding,
} from "./procedure-record-correction";
import { isRecord } from "./validation";

export const PROCEDURE_RECORD_CORRECTION_SAVE_OUTCOMES = [
  "saved",
  "save_failed",
  "save_outcome_unknown",
] as const;

export type ProcedureRecordCorrectionSaveOutcome =
  (typeof PROCEDURE_RECORD_CORRECTION_SAVE_OUTCOMES)[number];

/**
 * Physical append attempt only. Orchestration owns dual lookup and read-back.
 * v1 has no update / delete.
 */
export type ProcedureRecordCorrectionAppendAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

/**
 * Low-level append-only storage port.
 * Intentionally omits update/delete and ProcedureRecord mutation methods.
 */
export interface ProcedureRecordCorrectionStoragePort {
  findByCorrectionId(correctionId: string): Promise<LookupResult<ProcedureRecordCorrection>>;
  findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecordCorrection>>;
  append(correction: ProcedureRecordCorrection): Promise<ProcedureRecordCorrectionAppendAttempt>;
  listByOriginalRecordId(originalRecordId: string): Promise<readonly ProcedureRecordCorrection[]>;
}

export type ProcedureRecordCorrectionHistory = Readonly<{
  originalRecordId: string;
  corrections: readonly ProcedureRecordCorrection[];
}>;

export type ProcedureRecordCorrectionSubmitRequest = Readonly<{
  client: ProcedureRecordCorrectionClientInput;
  originalBinding: ProcedureRecordCorrectionOriginalBinding;
  /** Frozen from the first attempt of this payload; retry must reuse it. */
  correctedAtIso?: string;
  nowIso: string;
}>;

export type ProcedureRecordCorrectionSubmitResult = Readonly<{
  saveState: ProcedureRecordCorrectionSaveOutcome;
  correction: ProcedureRecordCorrection | null;
  appendCalled: boolean;
}>;

/**
 * Domain port surface from the exact slice:
 * submitCorrection + listCorrections only.
 */
export interface ProcedureRecordCorrectionPersistencePort {
  readonly liveWriteAuthorized: false;
  submitCorrection(
    request: ProcedureRecordCorrectionSubmitRequest,
    authenticatedFieldStaffContext: FieldStaffCorrectionAuthContext,
  ): Promise<ProcedureRecordCorrectionSubmitResult>;
  listCorrections(originalRecordId: string): Promise<ProcedureRecordCorrectionHistory>;
}

export type ProcedureRecordCorrectionLookupClassification =
  | Readonly<{ kind: "ACCEPT_NEW" }>
  | Readonly<{ kind: "REPLAY"; persisted: ProcedureRecordCorrection }>
  | Readonly<{ kind: "CONFLICT" }>
  | Readonly<{ kind: "DEFINITE_FAILURE" }>
  | Readonly<{ kind: "LOOKUP_UNAVAILABLE"; reason: "UNKNOWN" | "FETCH_FAILED" }>;

export const CORRECTION_DEFINITE_LOOKUP_FAILURE_CODES = [
  "MALFORMED_PHYSICAL",
  "MULTI_MATCH",
  "SITE_BINDING_MISMATCH",
  "LIST_BINDING_MISSING",
  "LIST_BINDING_MISMATCH",
  "INVALID_LOOKUP_RESULT",
] as const;

export type CorrectionDefiniteLookupFailureCode =
  (typeof CORRECTION_DEFINITE_LOOKUP_FAILURE_CODES)[number];

export function isCorrectionDefiniteLookupFailureCode(
  code: string,
): code is CorrectionDefiniteLookupFailureCode {
  return (CORRECTION_DEFINITE_LOOKUP_FAILURE_CODES as readonly string[]).includes(code);
}

function sameProcedure(
  left: ProcedureRecordCorrection["Procedure"],
  right: ProcedureRecordCorrection["Procedure"],
): boolean {
  return (
    left.ProcedureId === right.ProcedureId &&
    left.ProcedureVersion === right.ProcedureVersion &&
    left.ApprovalState === right.ApprovalState
  );
}

function sameCorrection(
  left: ProcedureRecordCorrection,
  right: ProcedureRecordCorrection,
): boolean {
  return (
    left.CorrectionId === right.CorrectionId &&
    left.IdempotencyKey === right.IdempotencyKey &&
    left.originalRecordId === right.originalRecordId &&
    left.OrganizationId === right.OrganizationId &&
    left.SiteId === right.SiteId &&
    left.UserId === right.UserId &&
    sameProcedure(left.Procedure, right.Procedure) &&
    left.planId === right.planId &&
    left.planVersion === right.planVersion &&
    left.originalRecordedAt === right.originalRecordedAt &&
    left.originalRecordedBy === right.originalRecordedBy &&
    left.originalLocalDate === right.originalLocalDate &&
    left.result === right.result &&
    left.performedAt === right.performedAt &&
    left.reason === right.reason &&
    left.correctedAt === right.correctedAt &&
    left.correctedBy === right.correctedBy
  );
}

function isLookupResult(value: unknown): value is LookupResult<ProcedureRecordCorrection> {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }
  if (value.status === "EMPTY") {
    return true;
  }
  if (value.status === "FOUND") {
    return validateProcedureRecordCorrection(value.value);
  }
  if (value.status === "UNKNOWN") {
    return (
      value.reason === "NOT_AUTHENTICATED" ||
      value.reason === "NOT_AUTHORIZED" ||
      value.reason === "INDETERMINATE"
    );
  }
  if (value.status === "FETCH_FAILED") {
    return typeof value.code === "string";
  }
  return false;
}

async function performLookup(
  lookup: () => Promise<LookupResult<ProcedureRecordCorrection>>,
): Promise<LookupResult<ProcedureRecordCorrection>> {
  try {
    const result = await lookup();
    if (!isLookupResult(result)) {
      return { status: "FETCH_FAILED", code: "INVALID_LOOKUP_RESULT" };
    }
    return result;
  } catch {
    return { status: "FETCH_FAILED", code: "LOOKUP_THREW" };
  }
}

function isDefiniteLookupFailure(result: LookupResult<ProcedureRecordCorrection>): boolean {
  if (result.status === "UNKNOWN") {
    return result.reason === "NOT_AUTHORIZED" || result.reason === "NOT_AUTHENTICATED";
  }
  return result.status === "FETCH_FAILED" && isCorrectionDefiniteLookupFailureCode(result.code);
}

function isIndeterminateLookupFailure(result: LookupResult<ProcedureRecordCorrection>): boolean {
  if (result.status === "UNKNOWN") {
    return result.reason === "INDETERMINATE";
  }
  return result.status === "FETCH_FAILED" && !isCorrectionDefiniteLookupFailureCode(result.code);
}

export function classifyProcedureRecordCorrectionLookups(
  incoming: ProcedureRecordCorrection,
  byCorrectionId: LookupResult<ProcedureRecordCorrection>,
  byIdempotencyKey: LookupResult<ProcedureRecordCorrection>,
): ProcedureRecordCorrectionLookupClassification {
  if (isDefiniteLookupFailure(byCorrectionId) || isDefiniteLookupFailure(byIdempotencyKey)) {
    return { kind: "DEFINITE_FAILURE" };
  }
  if (
    isIndeterminateLookupFailure(byCorrectionId) ||
    isIndeterminateLookupFailure(byIdempotencyKey)
  ) {
    return {
      kind: "LOOKUP_UNAVAILABLE",
      reason:
        byCorrectionId.status === "UNKNOWN" || byIdempotencyKey.status === "UNKNOWN"
          ? "UNKNOWN"
          : "FETCH_FAILED",
    };
  }

  if (byCorrectionId.status === "EMPTY" && byIdempotencyKey.status === "EMPTY") {
    return { kind: "ACCEPT_NEW" };
  }

  if (byCorrectionId.status !== "FOUND" || byIdempotencyKey.status !== "FOUND") {
    return { kind: "CONFLICT" };
  }

  if (!sameCorrection(byCorrectionId.value, byIdempotencyKey.value)) {
    return { kind: "CONFLICT" };
  }

  const persisted = byCorrectionId.value;
  if (sameCorrection(persisted, incoming)) {
    return { kind: "REPLAY", persisted };
  }

  return { kind: "CONFLICT" };
}

function matchesSavedReadBack(
  incoming: ProcedureRecordCorrection,
  persisted: ProcedureRecordCorrection,
): boolean {
  return sameCorrection(incoming, persisted);
}

async function savedAfterGetByCorrectionId(
  incoming: ProcedureRecordCorrection,
  storage: ProcedureRecordCorrectionStoragePort,
): Promise<ProcedureRecordCorrectionSaveOutcome> {
  const readBack = await performLookup(() => storage.findByCorrectionId(incoming.CorrectionId));
  if (isDefiniteLookupFailure(readBack)) {
    return "save_failed";
  }
  if (readBack.status === "UNKNOWN" || readBack.status === "FETCH_FAILED") {
    return "save_outcome_unknown";
  }
  if (readBack.status !== "FOUND") {
    return "save_outcome_unknown";
  }
  if (!matchesSavedReadBack(incoming, readBack.value)) {
    return "save_failed";
  }
  return "saved";
}

/**
 * Reconcile after indeterminate append. Never auto-creates a new identity.
 */
async function reconcileAfterUnknown(
  incoming: ProcedureRecordCorrection,
  storage: ProcedureRecordCorrectionStoragePort,
): Promise<ProcedureRecordCorrectionSaveOutcome> {
  const [byCorrectionId, byIdempotencyKey] = await Promise.all([
    performLookup(() => storage.findByCorrectionId(incoming.CorrectionId)),
    performLookup(() => storage.findByIdempotencyKey(incoming.IdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordCorrectionLookups(
    incoming,
    byCorrectionId,
    byIdempotencyKey,
  );
  if (classified.kind === "REPLAY") {
    return savedAfterGetByCorrectionId(incoming, storage);
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  return "save_outcome_unknown";
}

/**
 * Dual-lookup APPEND-ONLY persistence.
 * GET-by-CorrectionId is required before `saved`.
 * `save_outcome_unknown` never automatically retries append with a new identity.
 */
export async function persistProcedureRecordCorrection(
  correction: ProcedureRecordCorrection,
  storage: ProcedureRecordCorrectionStoragePort,
): Promise<ProcedureRecordCorrectionSaveOutcome> {
  if (!validateProcedureRecordCorrection(correction)) {
    return "save_failed";
  }

  const [byCorrectionId, byIdempotencyKey] = await Promise.all([
    performLookup(() => storage.findByCorrectionId(correction.CorrectionId)),
    performLookup(() => storage.findByIdempotencyKey(correction.IdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordCorrectionLookups(
    correction,
    byCorrectionId,
    byIdempotencyKey,
  );

  if (classified.kind === "LOOKUP_UNAVAILABLE") {
    return "save_outcome_unknown";
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  if (classified.kind === "REPLAY") {
    return savedAfterGetByCorrectionId(correction, storage);
  }

  const created = await storage.append(correction);
  if (created.status === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  if (created.status === "INDETERMINATE") {
    return reconcileAfterUnknown(correction, storage);
  }

  return savedAfterGetByCorrectionId(correction, storage);
}

export type InMemoryProcedureRecordCorrectionStorageOptions = Readonly<{
  appendMode?: "created" | "definite_failure" | "indeterminate" | "created_without_readback";
}>;

/**
 * In-memory / fake append-only storage for domain tests.
 * No SharePoint I/O. liveWriteAuthorized remains false.
 */
export function createInMemoryProcedureRecordCorrectionStoragePort(
  options: InMemoryProcedureRecordCorrectionStorageOptions = {},
): ProcedureRecordCorrectionStoragePort & {
  readonly byCorrectionId: Map<string, ProcedureRecordCorrection>;
  readonly byIdempotencyKey: Map<string, ProcedureRecordCorrection>;
  appendCalls: number;
  appendMode: NonNullable<InMemoryProcedureRecordCorrectionStorageOptions["appendMode"]>;
} {
  const byCorrectionId = new Map<string, ProcedureRecordCorrection>();
  const byIdempotencyKey = new Map<string, ProcedureRecordCorrection>();
  const state = {
    appendCalls: 0,
    appendMode: options.appendMode ?? ("created" as const),
  };

  return {
    byCorrectionId,
    byIdempotencyKey,
    get appendCalls() {
      return state.appendCalls;
    },
    set appendCalls(value: number) {
      state.appendCalls = value;
    },
    get appendMode() {
      return state.appendMode;
    },
    set appendMode(value) {
      state.appendMode = value;
    },
    async findByCorrectionId(correctionId) {
      const found = byCorrectionId.get(correctionId);
      if (found === undefined) {
        return { status: "EMPTY" };
      }
      return { status: "FOUND", value: copyProcedureRecordCorrection(found) };
    },
    async findByIdempotencyKey(idempotencyKey) {
      const found = byIdempotencyKey.get(idempotencyKey);
      if (found === undefined) {
        return { status: "EMPTY" };
      }
      return { status: "FOUND", value: copyProcedureRecordCorrection(found) };
    },
    async append(correction) {
      state.appendCalls += 1;
      if (state.appendMode === "definite_failure") {
        return { status: "DEFINITE_FAILURE" };
      }
      if (state.appendMode === "indeterminate") {
        return { status: "INDETERMINATE" };
      }
      if (state.appendMode === "created_without_readback") {
        return { status: "CREATED" };
      }
      const stored = copyProcedureRecordCorrection(correction);
      byCorrectionId.set(stored.CorrectionId, stored);
      byIdempotencyKey.set(stored.IdempotencyKey, stored);
      return { status: "CREATED" };
    },
    async listByOriginalRecordId(originalRecordId) {
      const items = [...byCorrectionId.values()]
        .filter((item) => item.originalRecordId === originalRecordId)
        .map((item) => copyProcedureRecordCorrection(item));
      return orderProcedureRecordCorrections(items);
    },
  };
}

/**
 * LIVE WRITE HOLD default. Lookups EMPTY; append DEFINITE_FAILURE.
 * No SharePoint I/O.
 */
export function createLiveWriteHoldProcedureRecordCorrectionStoragePort(): ProcedureRecordCorrectionStoragePort {
  return {
    findByCorrectionId: async () => ({ status: "EMPTY" }),
    findByIdempotencyKey: async () => ({ status: "EMPTY" }),
    append: async () => ({ status: "DEFINITE_FAILURE" }),
    listByOriginalRecordId: async () => [],
  };
}

export function createProcedureRecordCorrectionPersistencePort(
  storage: ProcedureRecordCorrectionStoragePort,
): ProcedureRecordCorrectionPersistencePort {
  return {
    liveWriteAuthorized: PROCEDURE_RECORD_CORRECTION_LIVE_WRITE_AUTHORIZED,
    async submitCorrection(request, authenticatedFieldStaffContext) {
      const assembleInput: AssembleProcedureRecordCorrectionInput = {
        client: request.client,
        originalBinding: request.originalBinding,
        auth: authenticatedFieldStaffContext,
        correctedAtIso: request.correctedAtIso,
        nowIso: request.nowIso,
      };
      const assembled = assembleProcedureRecordCorrection(assembleInput);
      if (!assembled.ok) {
        return { saveState: "save_failed", correction: null, appendCalled: false };
      }

      const saveState = await persistProcedureRecordCorrection(assembled.correction, storage);
      return {
        saveState,
        correction: assembled.correction,
        appendCalled: true,
      };
    },
    async listCorrections(originalRecordId) {
      const corrections = await storage.listByOriginalRecordId(originalRecordId);
      return {
        originalRecordId,
        corrections: orderProcedureRecordCorrections(
          corrections.map((item) => copyProcedureRecordCorrection(item)),
        ),
      };
    },
  };
}

/**
 * In-memory / fake domain port (exact-slice surface).
 */
export function createInMemoryProcedureRecordCorrectionPersistencePort(
  options: InMemoryProcedureRecordCorrectionStorageOptions = {},
): ProcedureRecordCorrectionPersistencePort & {
  readonly storage: ReturnType<typeof createInMemoryProcedureRecordCorrectionStoragePort>;
} {
  const storage = createInMemoryProcedureRecordCorrectionStoragePort(options);
  const port = createProcedureRecordCorrectionPersistencePort(storage);
  return Object.assign(port, { storage });
}
