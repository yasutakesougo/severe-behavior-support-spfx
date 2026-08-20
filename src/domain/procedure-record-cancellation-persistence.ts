/**
 * CANCEL-SLICE-C: cancellation lifecycle-event persistence port + fake.
 *
 * Append-only only. No lifecycle UPDATE/DELETE.
 * No ProcedureRecord UPDATE/DELETE.
 * No SharePoint I/O. No LIVE WRITE / Production Binding / UI authority.
 */

import type { LookupResult } from "../contracts/types";
import {
  validateProcedureRecordLifecycleEvent,
  type ProcedureRecordLifecycleEvent,
} from "./kiosk-contract";
import {
  assembleProcedureRecordCancellationLifecycleEvent,
  PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED,
} from "./procedure-record-cancellation-event";
import { PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED } from "./procedure-record-cancellation";
import { isRecord } from "./validation";

export const PROCEDURE_RECORD_CANCELLATION_SAVE_OUTCOMES = [
  "saved",
  "save_failed",
  "save_outcome_unknown",
] as const;

export type ProcedureRecordCancellationSaveOutcome =
  (typeof PROCEDURE_RECORD_CANCELLATION_SAVE_OUTCOMES)[number];

/** Slice C does not authorize LIVE WRITE. */
export const PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED = false as const;

/**
 * Physical append attempt only. Orchestration owns dual lookup and read-back.
 * v1 has no update / delete.
 */
export type ProcedureRecordCancellationAppendAttempt =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "DEFINITE_FAILURE" }>
  | Readonly<{ status: "INDETERMINATE" }>;

/**
 * Low-level append-only storage port for CANCEL lifecycle events.
 * Intentionally omits update/delete and SharePoint methods.
 */
export interface ProcedureRecordCancellationStoragePort {
  findByLifecycleEventId(
    lifecycleEventId: string,
  ): Promise<LookupResult<ProcedureRecordLifecycleEvent>>;
  findByLifecycleIdempotencyKey(
    lifecycleIdempotencyKey: string,
  ): Promise<LookupResult<ProcedureRecordLifecycleEvent>>;
  append(event: ProcedureRecordLifecycleEvent): Promise<ProcedureRecordCancellationAppendAttempt>;
  listByTargetRecordId(targetRecordId: string): Promise<readonly ProcedureRecordLifecycleEvent[]>;
}

export type ProcedureRecordCancellationHistory = Readonly<{
  targetRecordId: string;
  events: readonly ProcedureRecordLifecycleEvent[];
}>;

export type ProcedureRecordCancellationSubmitRequest = Readonly<{
  /** Same authoritative input as CANCEL-SLICE-A / B. */
  semanticsInput: unknown;
  /**
   * Frozen recordedAt for deterministic LifecycleEvent identity.
   * Same-logical retry / uncertain-outcome retry MUST reuse this value.
   */
  recordedAtIso: string;
}>;

export type ProcedureRecordCancellationSubmitResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  event: ProcedureRecordLifecycleEvent | null;
  appendCalled: boolean;
}>;

export type ProcedureRecordCancellationPersistResult = Readonly<{
  saveState: ProcedureRecordCancellationSaveOutcome;
  appendCalled: boolean;
}>;

/**
 * Domain port surface for Slice C:
 * submitCancellation + listCancellations only.
 */
export interface ProcedureRecordCancellationPersistencePort {
  readonly liveWriteAuthorized: false;
  submitCancellation(
    request: ProcedureRecordCancellationSubmitRequest,
  ): Promise<ProcedureRecordCancellationSubmitResult>;
  listCancellations(targetRecordId: string): Promise<ProcedureRecordCancellationHistory>;
}

export type ProcedureRecordCancellationLookupClassification =
  | Readonly<{ kind: "ACCEPT_NEW" }>
  | Readonly<{ kind: "REPLAY"; persisted: ProcedureRecordLifecycleEvent }>
  | Readonly<{ kind: "CONFLICT" }>
  | Readonly<{ kind: "DEFINITE_FAILURE" }>
  | Readonly<{ kind: "LOOKUP_UNAVAILABLE"; reason: "UNKNOWN" | "FETCH_FAILED" }>;

export const CANCELLATION_DEFINITE_LOOKUP_FAILURE_CODES = [
  "MALFORMED_PHYSICAL",
  "MULTI_MATCH",
  "SITE_BINDING_MISMATCH",
  "LIST_BINDING_MISSING",
  "LIST_BINDING_MISMATCH",
  "INVALID_LOOKUP_RESULT",
] as const;

export type CancellationDefiniteLookupFailureCode =
  (typeof CANCELLATION_DEFINITE_LOOKUP_FAILURE_CODES)[number];

export function isCancellationDefiniteLookupFailureCode(
  code: string,
): code is CancellationDefiniteLookupFailureCode {
  return (CANCELLATION_DEFINITE_LOOKUP_FAILURE_CODES as readonly string[]).includes(code);
}

export function copyProcedureRecordLifecycleEvent(
  event: ProcedureRecordLifecycleEvent,
): ProcedureRecordLifecycleEvent {
  return {
    schemaVersion: event.schemaVersion,
    LifecycleEventId: event.LifecycleEventId,
    LifecycleIdempotencyKey: event.LifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: event.LifecyclePayloadFingerprint,
    eventType: event.eventType,
    targetRecordId: event.targetRecordId,
    ...(event.replacementRecordId === undefined
      ? {}
      : { replacementRecordId: event.replacementRecordId }),
    recordedAt: event.recordedAt,
    recordedBy: event.recordedBy,
    ...(event.reason === undefined ? {} : { reason: event.reason }),
  };
}

function sameCancellationEvent(
  left: ProcedureRecordLifecycleEvent,
  right: ProcedureRecordLifecycleEvent,
): boolean {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.LifecycleEventId === right.LifecycleEventId &&
    left.LifecycleIdempotencyKey === right.LifecycleIdempotencyKey &&
    left.LifecyclePayloadFingerprint === right.LifecyclePayloadFingerprint &&
    left.eventType === right.eventType &&
    left.targetRecordId === right.targetRecordId &&
    left.replacementRecordId === right.replacementRecordId &&
    left.recordedAt === right.recordedAt &&
    left.recordedBy === right.recordedBy &&
    left.reason === right.reason
  );
}

function isCancelLifecycleEvent(value: unknown): value is ProcedureRecordLifecycleEvent {
  return (
    validateProcedureRecordLifecycleEvent(value) &&
    value.eventType === "CANCEL" &&
    value.replacementRecordId === undefined
  );
}

function isLookupResult(value: unknown): value is LookupResult<ProcedureRecordLifecycleEvent> {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }
  if (value.status === "EMPTY") {
    return true;
  }
  if (value.status === "FOUND") {
    return isCancelLifecycleEvent(value.value);
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
  lookup: () => Promise<LookupResult<ProcedureRecordLifecycleEvent>>,
): Promise<LookupResult<ProcedureRecordLifecycleEvent>> {
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

function isDefiniteLookupFailure(result: LookupResult<ProcedureRecordLifecycleEvent>): boolean {
  if (result.status === "UNKNOWN") {
    return result.reason === "NOT_AUTHORIZED" || result.reason === "NOT_AUTHENTICATED";
  }
  return result.status === "FETCH_FAILED" && isCancellationDefiniteLookupFailureCode(result.code);
}

function isIndeterminateLookupFailure(
  result: LookupResult<ProcedureRecordLifecycleEvent>,
): boolean {
  if (result.status === "UNKNOWN") {
    return result.reason === "INDETERMINATE";
  }
  return result.status === "FETCH_FAILED" && !isCancellationDefiniteLookupFailureCode(result.code);
}

export function classifyProcedureRecordCancellationLookups(
  incoming: ProcedureRecordLifecycleEvent,
  byLifecycleEventId: LookupResult<ProcedureRecordLifecycleEvent>,
  byLifecycleIdempotencyKey: LookupResult<ProcedureRecordLifecycleEvent>,
): ProcedureRecordCancellationLookupClassification {
  if (
    isDefiniteLookupFailure(byLifecycleEventId) ||
    isDefiniteLookupFailure(byLifecycleIdempotencyKey)
  ) {
    return { kind: "DEFINITE_FAILURE" };
  }
  if (
    isIndeterminateLookupFailure(byLifecycleEventId) ||
    isIndeterminateLookupFailure(byLifecycleIdempotencyKey)
  ) {
    return {
      kind: "LOOKUP_UNAVAILABLE",
      reason:
        byLifecycleEventId.status === "UNKNOWN" || byLifecycleIdempotencyKey.status === "UNKNOWN"
          ? "UNKNOWN"
          : "FETCH_FAILED",
    };
  }

  if (byLifecycleEventId.status === "EMPTY" && byLifecycleIdempotencyKey.status === "EMPTY") {
    return { kind: "ACCEPT_NEW" };
  }

  if (byLifecycleEventId.status !== "FOUND" || byLifecycleIdempotencyKey.status !== "FOUND") {
    return { kind: "CONFLICT" };
  }

  if (!sameCancellationEvent(byLifecycleEventId.value, byLifecycleIdempotencyKey.value)) {
    return { kind: "CONFLICT" };
  }

  const persisted = byLifecycleEventId.value;
  if (sameCancellationEvent(persisted, incoming)) {
    return { kind: "REPLAY", persisted };
  }

  return { kind: "CONFLICT" };
}

async function savedAfterGetByLifecycleEventId(
  incoming: ProcedureRecordLifecycleEvent,
  storage: ProcedureRecordCancellationStoragePort,
): Promise<ProcedureRecordCancellationSaveOutcome> {
  const readBack = await performLookup(() =>
    storage.findByLifecycleEventId(incoming.LifecycleEventId),
  );
  if (isDefiniteLookupFailure(readBack)) {
    return "save_failed";
  }
  if (readBack.status === "UNKNOWN" || readBack.status === "FETCH_FAILED") {
    return "save_outcome_unknown";
  }
  if (readBack.status !== "FOUND") {
    return "save_outcome_unknown";
  }
  if (!sameCancellationEvent(incoming, readBack.value)) {
    return "save_failed";
  }
  return "saved";
}

/**
 * Reconcile after indeterminate append. Never auto-creates a new identity.
 */
async function reconcileAfterUnknown(
  incoming: ProcedureRecordLifecycleEvent,
  storage: ProcedureRecordCancellationStoragePort,
): Promise<ProcedureRecordCancellationSaveOutcome> {
  const [byLifecycleEventId, byLifecycleIdempotencyKey] = await Promise.all([
    performLookup(() => storage.findByLifecycleEventId(incoming.LifecycleEventId)),
    performLookup(() => storage.findByLifecycleIdempotencyKey(incoming.LifecycleIdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordCancellationLookups(
    incoming,
    byLifecycleEventId,
    byLifecycleIdempotencyKey,
  );
  if (classified.kind === "REPLAY") {
    return savedAfterGetByLifecycleEventId(incoming, storage);
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return "save_failed";
  }
  return "save_outcome_unknown";
}

/**
 * Dual-lookup APPEND-ONLY persistence for CANCEL lifecycle events.
 * GET-by-LifecycleEventId is required before `saved`.
 * `save_outcome_unknown` never automatically retries append with a new identity.
 */
export async function persistProcedureRecordCancellation(
  event: ProcedureRecordLifecycleEvent,
  storage: ProcedureRecordCancellationStoragePort,
): Promise<ProcedureRecordCancellationPersistResult> {
  if (!isCancelLifecycleEvent(event)) {
    return { saveState: "save_failed", appendCalled: false };
  }
  if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
    return { saveState: "save_failed", appendCalled: false };
  }
  if (PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED !== false) {
    return { saveState: "save_failed", appendCalled: false };
  }

  const [byLifecycleEventId, byLifecycleIdempotencyKey] = await Promise.all([
    performLookup(() => storage.findByLifecycleEventId(event.LifecycleEventId)),
    performLookup(() => storage.findByLifecycleIdempotencyKey(event.LifecycleIdempotencyKey)),
  ]);
  const classified = classifyProcedureRecordCancellationLookups(
    event,
    byLifecycleEventId,
    byLifecycleIdempotencyKey,
  );

  if (classified.kind === "LOOKUP_UNAVAILABLE") {
    return { saveState: "save_outcome_unknown", appendCalled: false };
  }
  if (classified.kind === "CONFLICT" || classified.kind === "DEFINITE_FAILURE") {
    return { saveState: "save_failed", appendCalled: false };
  }
  if (classified.kind === "REPLAY") {
    return {
      saveState: await savedAfterGetByLifecycleEventId(event, storage),
      appendCalled: false,
    };
  }

  const created = await storage.append(event);
  if (created.status === "DEFINITE_FAILURE") {
    return { saveState: "save_failed", appendCalled: true };
  }
  if (created.status === "INDETERMINATE") {
    return {
      saveState: await reconcileAfterUnknown(event, storage),
      appendCalled: true,
    };
  }

  return {
    saveState: await savedAfterGetByLifecycleEventId(event, storage),
    appendCalled: true,
  };
}

export type InMemoryProcedureRecordCancellationStorageOptions = Readonly<{
  appendMode?: "created" | "definite_failure" | "indeterminate" | "created_without_readback";
}>;

/**
 * In-memory / fake append-only storage for domain tests.
 * No SharePoint I/O. liveWriteAuthorized remains false.
 */
export function createInMemoryProcedureRecordCancellationStoragePort(
  options: InMemoryProcedureRecordCancellationStorageOptions = {},
): ProcedureRecordCancellationStoragePort & {
  readonly byLifecycleEventId: Map<string, ProcedureRecordLifecycleEvent>;
  readonly byLifecycleIdempotencyKey: Map<string, ProcedureRecordLifecycleEvent>;
  appendCalls: number;
  appendMode: NonNullable<InMemoryProcedureRecordCancellationStorageOptions["appendMode"]>;
} {
  const byLifecycleEventId = new Map<string, ProcedureRecordLifecycleEvent>();
  const byLifecycleIdempotencyKey = new Map<string, ProcedureRecordLifecycleEvent>();
  const state = {
    appendCalls: 0,
    appendMode: options.appendMode ?? ("created" as const),
  };

  return {
    byLifecycleEventId,
    byLifecycleIdempotencyKey,
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
    async findByLifecycleEventId(lifecycleEventId) {
      const found = byLifecycleEventId.get(lifecycleEventId);
      if (found === undefined) {
        return { status: "EMPTY" };
      }
      return { status: "FOUND", value: copyProcedureRecordLifecycleEvent(found) };
    },
    async findByLifecycleIdempotencyKey(lifecycleIdempotencyKey) {
      const found = byLifecycleIdempotencyKey.get(lifecycleIdempotencyKey);
      if (found === undefined) {
        return { status: "EMPTY" };
      }
      return { status: "FOUND", value: copyProcedureRecordLifecycleEvent(found) };
    },
    async append(event) {
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
      const stored = copyProcedureRecordLifecycleEvent(event);
      byLifecycleEventId.set(stored.LifecycleEventId, stored);
      byLifecycleIdempotencyKey.set(stored.LifecycleIdempotencyKey, stored);
      return { status: "CREATED" };
    },
    async listByTargetRecordId(targetRecordId) {
      return [...byLifecycleEventId.values()]
        .filter((item) => item.targetRecordId === targetRecordId)
        .map((item) => copyProcedureRecordLifecycleEvent(item))
        .sort((left, right) => left.LifecycleEventId.localeCompare(right.LifecycleEventId));
    },
  };
}

/**
 * LIVE WRITE HOLD default. Lookups EMPTY; append DEFINITE_FAILURE.
 * No SharePoint I/O.
 */
export function createLiveWriteHoldProcedureRecordCancellationStoragePort(): ProcedureRecordCancellationStoragePort {
  return {
    findByLifecycleEventId: async () => ({ status: "EMPTY" }),
    findByLifecycleIdempotencyKey: async () => ({ status: "EMPTY" }),
    append: async () => ({ status: "DEFINITE_FAILURE" }),
    listByTargetRecordId: async () => [],
  };
}

export function createProcedureRecordCancellationPersistencePort(
  storage: ProcedureRecordCancellationStoragePort,
): ProcedureRecordCancellationPersistencePort {
  return {
    liveWriteAuthorized: PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED,
    async submitCancellation(request) {
      // Assembly remains non-authorizing for persistence elevation (Slice B constant stays false).
      if (PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED !== false) {
        return { saveState: "save_failed", event: null, appendCalled: false };
      }
      if (PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED !== false) {
        return { saveState: "save_failed", event: null, appendCalled: false };
      }

      const assembled = assembleProcedureRecordCancellationLifecycleEvent({
        semanticsInput: request.semanticsInput,
        recordedAtIso: request.recordedAtIso,
      });
      if (assembled.status !== "CREATED") {
        return { saveState: "save_failed", event: null, appendCalled: false };
      }

      const persisted = await persistProcedureRecordCancellation(assembled.event, storage);
      return {
        saveState: persisted.saveState,
        event: assembled.event,
        appendCalled: persisted.appendCalled,
      };
    },
    async listCancellations(targetRecordId) {
      const events = await storage.listByTargetRecordId(targetRecordId);
      return {
        targetRecordId,
        events: events.map((item) => copyProcedureRecordLifecycleEvent(item)),
      };
    },
  };
}

/**
 * In-memory / fake domain port (exact-slice surface).
 */
export function createInMemoryProcedureRecordCancellationPersistencePort(
  options: InMemoryProcedureRecordCancellationStorageOptions = {},
): ProcedureRecordCancellationPersistencePort & {
  readonly storage: ReturnType<typeof createInMemoryProcedureRecordCancellationStoragePort>;
} {
  const storage = createInMemoryProcedureRecordCancellationStoragePort(options);
  const port = createProcedureRecordCancellationPersistencePort(storage);
  return Object.assign(port, { storage });
}
