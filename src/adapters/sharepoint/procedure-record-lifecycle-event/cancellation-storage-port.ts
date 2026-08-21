/**
 * CANCEL-SLICE-E SharePoint-shaped physical storage adapter.
 *
 * Implements the existing Slice C storage port without redefining:
 * - cancellation semantics (Slice A)
 * - lifecycle identity (Slice B)
 * - dual-lookup/read-back save-state semantics (Slice C)
 *
 * No concrete SPFx LIVE transport is provided here. The transport seam requires
 * `liveTenantIoAuthorized: false`, so this implementation is synthetic/test-only
 * until a separate LIVE WRITE / Production Binding authorization changes that boundary.
 */

import type { LookupResult } from "../../../contracts/types";
import {
  validateProcedureRecordLifecycleEvent,
  type ProcedureRecordLifecycleEvent,
} from "../../../domain/kiosk-contract";
import type {
  ProcedureRecordCancellationAppendAttempt,
  ProcedureRecordCancellationStoragePort,
} from "../../../domain/procedure-record-cancellation-persistence";
import {
  isUsableProcedureRecordLifecycleEventListBinding,
  normalizeLifecycleEventSharePointGuid,
  type ProcedureRecordLifecycleEventListBinding,
} from "./list-binding";
import {
  decodeProcedureRecordLifecycleEventPhysicalRow,
  encodeProcedureRecordLifecycleEventPhysicalRow,
} from "./physical-mapper";
import type { ProcedureRecordLifecycleEventPhysicalRow } from "./physical-columns";
import {
  verifyProcedureRecordLifecycleEventPhysicalSchema,
  type ProcedureRecordLifecycleEventSchemaVerification,
} from "./physical-schema";
import type {
  ProcedureRecordLifecycleEventItemCreateResult,
  ProcedureRecordLifecycleEventItemReadResult,
  ProcedureRecordLifecycleEventListTransport,
} from "./transport-seam";

export type ProcedureRecordCancellationSharePointStoragePort =
  ProcedureRecordCancellationStoragePort &
    Readonly<{
      binding: ProcedureRecordLifecycleEventListBinding;
      liveWriteAuthorized: false;
      verifyPhysicalSchema(): Promise<ProcedureRecordLifecycleEventSchemaVerification>;
    }>;

const PHYSICAL_KEYS = [
  "lifeSchemaVersion",
  "lifeLifecycleEventId",
  "lifeLifecycleIdempotencyKey",
  "lifeLifecyclePayloadFingerprint",
  "lifeEventType",
  "lifeTargetRecordId",
  "lifeReplacementRecordId",
  "lifeRecordedAt",
  "lifeRecordedBy",
  "lifeReason",
] as const;

function physicalRowFromRestItem(
  item: Readonly<Record<string, unknown>>,
): ProcedureRecordLifecycleEventPhysicalRow {
  const row: Record<string, unknown> = {};
  for (const key of PHYSICAL_KEYS) {
    row[key] = item[key];
  }
  if (typeof item.Id === "number") {
    row.ListItemId = item.Id;
  }
  return row as ProcedureRecordLifecycleEventPhysicalRow;
}

function bindingMatchesTransport(
  binding: ProcedureRecordLifecycleEventListBinding,
  transport: ProcedureRecordLifecycleEventListTransport,
): "MATCH" | "SITE_MISMATCH" | "LIST_MISMATCH" {
  if (binding.siteIdentity !== transport.targetSiteIdentity) {
    return "SITE_MISMATCH";
  }
  const bindingGuid = normalizeLifecycleEventSharePointGuid(binding.listGuid);
  const transportGuid = normalizeLifecycleEventSharePointGuid(transport.targetListGuid);
  if (bindingGuid === null || transportGuid === null || bindingGuid !== transportGuid) {
    return "LIST_MISMATCH";
  }
  return "MATCH";
}

function unavailableLookup(
  failure: "FORBIDDEN" | "TRANSPORT_ERROR",
): LookupResult<ProcedureRecordLifecycleEvent> {
  if (failure === "FORBIDDEN") {
    return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
  }
  return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
}

function classifySingleRow(
  result: ProcedureRecordLifecycleEventItemReadResult,
  expected:
    | Readonly<{ kind: "eventId"; token: string }>
    | Readonly<{ kind: "idempotencyKey"; token: string }>,
): LookupResult<ProcedureRecordLifecycleEvent> {
  if (!result.ok) {
    return unavailableLookup(result.failure);
  }
  if (result.rows.length === 0) {
    return { status: "EMPTY" };
  }
  if (result.rows.length > 1) {
    return { status: "FETCH_FAILED", code: "MULTI_MATCH" };
  }

  const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(
    physicalRowFromRestItem(result.rows[0]),
  );
  if (!decoded.ok) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  if (
    (expected.kind === "eventId" && decoded.event.LifecycleEventId !== expected.token) ||
    (expected.kind === "idempotencyKey" &&
      decoded.event.LifecycleIdempotencyKey !== expected.token)
  ) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  return { status: "FOUND", value: decoded.event };
}

function mapCreateFailure(
  result: ProcedureRecordLifecycleEventItemCreateResult,
): ProcedureRecordCancellationAppendAttempt {
  if (result.ok) {
    return { status: "CREATED" };
  }
  if (result.failure === "FORBIDDEN") {
    return { status: "DEFINITE_FAILURE" };
  }
  return { status: "INDETERMINATE" };
}

export function createProcedureRecordCancellationSharePointStoragePort(
  binding: ProcedureRecordLifecycleEventListBinding,
  transport: ProcedureRecordLifecycleEventListTransport,
): ProcedureRecordCancellationSharePointStoragePort {
  async function lookup(
    query: (token: string) => Promise<ProcedureRecordLifecycleEventItemReadResult>,
    expected:
      | Readonly<{ kind: "eventId"; token: string }>
      | Readonly<{ kind: "idempotencyKey"; token: string }>,
  ): Promise<LookupResult<ProcedureRecordLifecycleEvent>> {
    if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
      return { status: "FETCH_FAILED", code: "LIST_BINDING_MISSING" };
    }
    const match = bindingMatchesTransport(binding, transport);
    if (match === "SITE_MISMATCH") {
      return { status: "FETCH_FAILED", code: "SITE_BINDING_MISMATCH" };
    }
    if (match === "LIST_MISMATCH") {
      return { status: "FETCH_FAILED", code: "LIST_BINDING_MISMATCH" };
    }
    try {
      return classifySingleRow(await query(expected.token), expected);
    } catch {
      return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
    }
  }

  return {
    binding,
    liveWriteAuthorized: false,

    async findByLifecycleEventId(
      lifecycleEventId: string,
    ): Promise<LookupResult<ProcedureRecordLifecycleEvent>> {
      return lookup((token) => transport.findByLifecycleEventId(token), {
        kind: "eventId",
        token: lifecycleEventId,
      });
    },

    async findByLifecycleIdempotencyKey(
      lifecycleIdempotencyKey: string,
    ): Promise<LookupResult<ProcedureRecordLifecycleEvent>> {
      return lookup((token) => transport.findByLifecycleIdempotencyKey(token), {
        kind: "idempotencyKey",
        token: lifecycleIdempotencyKey,
      });
    },

    async append(
      event: ProcedureRecordLifecycleEvent,
    ): Promise<ProcedureRecordCancellationAppendAttempt> {
      if (
        !validateProcedureRecordLifecycleEvent(event) ||
        event.eventType !== "CANCEL" ||
        event.replacementRecordId !== undefined
      ) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (transport.liveTenantIoAuthorized !== false) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (bindingMatchesTransport(binding, transport) !== "MATCH") {
        return { status: "DEFINITE_FAILURE" };
      }

      try {
        const schema = await transport.getSchema();
        if (!schema.ok) {
          return schema.failure === "FORBIDDEN"
            ? { status: "DEFINITE_FAILURE" }
            : { status: "INDETERMINATE" };
        }
        const verified = verifyProcedureRecordLifecycleEventPhysicalSchema(
          binding.listGuid,
          schema.list,
          schema.fields,
        );
        if (!verified.ok) {
          return { status: "DEFINITE_FAILURE" };
        }

        const physical = encodeProcedureRecordLifecycleEventPhysicalRow(event);
        if (!physical.ok) {
          return { status: "DEFINITE_FAILURE" };
        }
        return mapCreateFailure(await transport.createItem(physical.row));
      } catch {
        return { status: "INDETERMINATE" };
      }
    },

    async listByTargetRecordId(
      targetRecordId: string,
    ): Promise<readonly ProcedureRecordLifecycleEvent[]> {
      if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
        throw new Error("LIST_BINDING_MISSING");
      }
      const match = bindingMatchesTransport(binding, transport);
      if (match === "SITE_MISMATCH") {
        throw new Error("SITE_BINDING_MISMATCH");
      }
      if (match === "LIST_MISMATCH") {
        throw new Error("LIST_BINDING_MISMATCH");
      }

      let result: ProcedureRecordLifecycleEventItemReadResult;
      try {
        result = await transport.listByTargetRecordId(targetRecordId);
      } catch {
        throw new Error("TRANSPORT_ERROR");
      }
      if (!result.ok) {
        throw new Error(result.failure);
      }

      const events: ProcedureRecordLifecycleEvent[] = [];
      const eventIds = new Set<string>();
      const idempotencyKeys = new Set<string>();

      for (const item of result.rows) {
        const decoded = decodeProcedureRecordLifecycleEventPhysicalRow(
          physicalRowFromRestItem(item),
        );
        if (!decoded.ok || decoded.event.targetRecordId !== targetRecordId) {
          throw new Error("MALFORMED_PHYSICAL");
        }
        if (
          eventIds.has(decoded.event.LifecycleEventId) ||
          idempotencyKeys.has(decoded.event.LifecycleIdempotencyKey)
        ) {
          throw new Error("MULTI_MATCH");
        }
        eventIds.add(decoded.event.LifecycleEventId);
        idempotencyKeys.add(decoded.event.LifecycleIdempotencyKey);
        events.push(decoded.event);
      }

      return events.sort((left, right) =>
        left.LifecycleEventId.localeCompare(right.LifecycleEventId),
      );
    },

    async verifyPhysicalSchema(): Promise<ProcedureRecordLifecycleEventSchemaVerification> {
      if (!isUsableProcedureRecordLifecycleEventListBinding(binding)) {
        return { ok: false, reasons: ["list-binding-missing"] };
      }
      const match = bindingMatchesTransport(binding, transport);
      if (match === "SITE_MISMATCH") {
        return { ok: false, reasons: ["site-binding-mismatch"] };
      }
      if (match === "LIST_MISMATCH") {
        return { ok: false, reasons: ["transport-target-mismatch"] };
      }
      try {
        const schema = await transport.getSchema();
        if (!schema.ok) {
          return { ok: false, reasons: [`transport:${schema.failure}`] };
        }
        return verifyProcedureRecordLifecycleEventPhysicalSchema(
          binding.listGuid,
          schema.list,
          schema.fields,
        );
      } catch {
        return { ok: false, reasons: ["transport:TRANSPORT_ERROR"] };
      }
    },
  };
}
