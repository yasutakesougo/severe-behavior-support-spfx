/**
 * ProcedureRecord persistence port bound to a live List GUID transport.
 * CREATE-ONLY. Production create() is fail-closed until the production gate opens.
 */

import type { LookupResult } from "../../../contracts/types";
import type {
  ProcedureRecordCreateAttempt,
  ProcedureRecordPersistencePort,
} from "../../../domain/procedure-record-persistence";
import type { ProcedureRecord } from "../../../domain/procedure-record";
import { decodePhysicalRow } from "./conversion";
import {
  isUsableLiveListBinding,
  normalizeSharePointGuid,
  type ProcedureRecordListBinding,
} from "./list-binding";
import {
  createProcedureRecordLiveWriteAuthorization,
  isProcedureRecordItemCreateAuthorized,
  PROCEDURE_RECORD_LIVE_WRITE_GATE,
  refuseUnauthorizedLiveCreate,
} from "./live-write-gate";
import type { ProcedureRecordPhysicalRow } from "./physical-columns";
import {
  verifyProcedureRecordPhysicalSchema,
  type ProcedureRecordSchemaVerification,
} from "./physical-schema";
import { buildCreateItemFields } from "./rest-body";
import type {
  ProcedureRecordItemReadResult,
  ProcedureRecordLiveListTransport,
} from "./transport-seam";

export type ProcedureRecordListRepository = ProcedureRecordPersistencePort &
  Readonly<{
    binding: ProcedureRecordListBinding;
    liveWriteAuthorized: boolean;
    verifyPhysicalSchema(): Promise<ProcedureRecordSchemaVerification>;
  }>;

/** @deprecated Use ProcedureRecordListRepository. Production wiring remains fail-closed. */
export type ReadOnlyProcedureRecordRepository = ProcedureRecordListRepository;

const PHYSICAL_KEYS = [
  "prRecordId",
  "prIdempotencyKey",
  "prPayloadFingerprint",
  "prOrganizationId",
  "prSiteId",
  "prUserId",
  "prProcedureId",
  "prProcedureVersion",
  "prApprovalState",
  "prLocalDate",
  "prPlanId",
  "prPlanVersion",
  "prResult",
  "prPerformedAt",
  "prRecordedAt",
  "prRecordedBy",
] as const;

function physicalRowFromRestItem(
  item: Readonly<Record<string, unknown>>,
): ProcedureRecordPhysicalRow {
  const row: Record<string, unknown> = {};
  for (const key of PHYSICAL_KEYS) {
    row[key] = item[key];
  }
  if (typeof item.Id === "number") {
    row.ListItemId = item.Id;
  }
  if (typeof item.schemaId === "string") {
    row.schemaId = item.schemaId;
  }
  if (typeof item.schemaVersion === "string") {
    row.schemaVersion = item.schemaVersion;
  }
  if (typeof item.dtoVersion === "string") {
    row.dtoVersion = item.dtoVersion;
  }
  if (typeof item.TimeZone === "string") {
    row.TimeZone = item.TimeZone;
  }
  return row as ProcedureRecordPhysicalRow;
}

function lookupUnavailable(code: "FORBIDDEN" | "TRANSPORT_ERROR"): LookupResult<ProcedureRecord> {
  if (code === "FORBIDDEN") {
    return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
  }
  return { status: "FETCH_FAILED", code };
}

function classifyRows(
  binding: ProcedureRecordListBinding,
  result: ProcedureRecordItemReadResult,
): LookupResult<ProcedureRecord> {
  if (!result.ok) {
    return lookupUnavailable(result.failure);
  }
  if (result.rows.length === 0) {
    return { status: "EMPTY" };
  }
  if (result.rows.length >= 2) {
    return { status: "FETCH_FAILED", code: "MULTI_MATCH" };
  }

  const decoded = decodePhysicalRow(physicalRowFromRestItem(result.rows[0]));
  if (!decoded.ok) {
    return { status: "FETCH_FAILED", code: "MALFORMED_PHYSICAL" };
  }
  if (
    decoded.record.OrganizationId !== binding.organizationId ||
    decoded.record.SiteId !== binding.siteId
  ) {
    return { status: "FETCH_FAILED", code: "SITE_BINDING_MISMATCH" };
  }
  return { status: "FOUND", value: decoded.record };
}

function listBindingMatchesTransport(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordLiveListTransport,
): boolean {
  const bindingGuid = normalizeSharePointGuid(binding.listGuid);
  const targetGuid = normalizeSharePointGuid(transport.targetListGuid);
  return bindingGuid !== null && targetGuid !== null && bindingGuid === targetGuid;
}

function mapCreateFailure(failure: "FORBIDDEN" | "TRANSPORT_ERROR"): ProcedureRecordCreateAttempt {
  if (failure === "FORBIDDEN") {
    return { status: "DEFINITE_FAILURE" };
  }
  return { status: "INDETERMINATE" };
}

function createBoundProcedureRecordRepository(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordLiveListTransport,
): ProcedureRecordListRepository {
  async function lookup(
    query: (token: string) => Promise<ProcedureRecordItemReadResult>,
    token: string,
  ): Promise<LookupResult<ProcedureRecord>> {
    if (!isUsableLiveListBinding(binding)) {
      return { status: "FETCH_FAILED", code: "LIST_BINDING_MISSING" };
    }
    if (!listBindingMatchesTransport(binding, transport)) {
      return { status: "FETCH_FAILED", code: "LIST_BINDING_MISMATCH" };
    }
    try {
      return classifyRows(binding, await query(token));
    } catch {
      return { status: "FETCH_FAILED", code: "TRANSPORT_ERROR" };
    }
  }

  return {
    binding,
    liveWriteAuthorized: isProcedureRecordItemCreateAuthorized(PROCEDURE_RECORD_LIVE_WRITE_GATE),

    async findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>> {
      return lookup((token) => transport.findByRecordId(token), recordId);
    },

    async findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecord>> {
      return lookup((token) => transport.findByIdempotencyKey(token), idempotencyKey);
    },

    async create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt> {
      const authorization = createProcedureRecordLiveWriteAuthorization();
      if (authorization === null) {
        return refuseUnauthorizedLiveCreate();
      }
      if (!isUsableLiveListBinding(binding)) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (!listBindingMatchesTransport(binding, transport)) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (record.OrganizationId !== binding.organizationId || record.SiteId !== binding.siteId) {
        return { status: "DEFINITE_FAILURE" };
      }

      try {
        const schema = await transport.getSchema();
        if (!schema.ok) {
          return mapCreateFailure(schema.failure);
        }
        const physical = verifyProcedureRecordPhysicalSchema(
          binding.listGuid,
          schema.list,
          schema.fields,
        );
        if (!physical.ok) {
          return { status: "DEFINITE_FAILURE" };
        }

        const prepared = buildCreateItemFields(record);
        if (!prepared.ok) {
          return { status: "DEFINITE_FAILURE" };
        }

        const created = await transport.createItem(prepared.fields);
        if (!created.ok) {
          return mapCreateFailure(created.failure);
        }
        return { status: "CREATED" };
      } catch {
        return { status: "INDETERMINATE" };
      }
    },

    async verifyPhysicalSchema(): Promise<ProcedureRecordSchemaVerification> {
      if (!isUsableLiveListBinding(binding)) {
        return { ok: false, reasons: ["list-binding-missing"] };
      }
      if (!listBindingMatchesTransport(binding, transport)) {
        return { ok: false, reasons: ["transport-target-mismatch"] };
      }
      try {
        const schema = await transport.getSchema();
        if (!schema.ok) {
          return { ok: false, reasons: [`transport:${schema.failure}`] };
        }
        return verifyProcedureRecordPhysicalSchema(binding.listGuid, schema.list, schema.fields);
      } catch {
        return { ok: false, reasons: ["transport:TRANSPORT_ERROR"] };
      }
    },
  };
}

/**
 * Production wiring. Callers cannot pass a write-authorization flag.
 * Create reaches transport.createItem only after Human LIVE WRITE GO mints
 * run-scoped authorization from the production gate.
 */
export function createProcedureRecordRepository(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordLiveListTransport,
): ProcedureRecordListRepository {
  return createBoundProcedureRecordRepository(binding, transport);
}

export function createReadOnlyProcedureRecordRepository(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordLiveListTransport,
): ProcedureRecordListRepository {
  return createProcedureRecordRepository(binding, transport);
}
