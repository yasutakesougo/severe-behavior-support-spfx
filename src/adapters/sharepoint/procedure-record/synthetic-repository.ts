/**
 * Concrete ProcedureRecord repository over a synthetic SharePoint-shaped store.
 * CREATE-ONLY. No live SharePoint / M365 / Entra / Deploy I/O.
 */

import type { LookupResult } from "../../../contracts/types";
import type {
  ProcedureRecordCreateAttempt,
  ProcedureRecordPersistencePort,
} from "../../../domain/procedure-record-persistence";
import type { ProcedureRecord } from "../../../domain/procedure-record";
import { decodePhysicalRow, encodePhysicalRow } from "./conversion";
import { isUsableListBinding, type ProcedureRecordListBinding } from "./list-binding";
import { PROCEDURE_RECORD_LIST_DISPLAY_NAME } from "./physical-columns";
import { buildCreateItemFields } from "./rest-body";
import type { SyntheticProcedureRecordListStore } from "./synthetic-list-store";
import { SPFX_SPHTTPCLIENT_HOST_SEAM } from "./transport-seam";

export type SyntheticProcedureRecordRepository = ProcedureRecordPersistencePort &
  Readonly<{
    binding: ProcedureRecordListBinding;
    listDisplayName: typeof PROCEDURE_RECORD_LIST_DISPLAY_NAME;
    lastPreparedFields: Readonly<Record<string, unknown>> | null;
    hostSeam: typeof SPFX_SPHTTPCLIENT_HOST_SEAM;
  }>;

function lookupUnavailable(code: "FORBIDDEN" | "TRANSPORT_ERROR"): LookupResult<ProcedureRecord> {
  if (code === "FORBIDDEN") {
    return { status: "UNKNOWN", reason: "NOT_AUTHORIZED" };
  }
  return { status: "FETCH_FAILED", code };
}

export function createSyntheticProcedureRecordRepository(
  binding: ProcedureRecordListBinding,
  store: SyntheticProcedureRecordListStore,
): SyntheticProcedureRecordRepository {
  let lastPreparedFields: Readonly<Record<string, unknown>> | null = null;

  function lookupRows(
    query: SyntheticProcedureRecordListStore["findByRecordId"],
    token: string,
  ): LookupResult<ProcedureRecord> {
    if (!isUsableListBinding(binding)) {
      return { status: "FETCH_FAILED", code: "LIST_BINDING_MISSING" };
    }
    const result = query.call(store, token);
    if (result.kind === "forbidden") {
      return lookupUnavailable("FORBIDDEN");
    }
    if (result.kind === "transport_error") {
      return lookupUnavailable("TRANSPORT_ERROR");
    }
    if (result.rows.length === 0) {
      return { status: "EMPTY" };
    }
    if (result.rows.length >= 2) {
      return { status: "FETCH_FAILED", code: "MULTI_MATCH" };
    }

    const decoded = decodePhysicalRow(result.rows[0]);
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

  return {
    binding,
    listDisplayName: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
    hostSeam: SPFX_SPHTTPCLIENT_HOST_SEAM,

    get lastPreparedFields() {
      return lastPreparedFields;
    },

    async findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>> {
      return lookupRows(store.findByRecordId, recordId);
    },

    async findByIdempotencyKey(idempotencyKey: string): Promise<LookupResult<ProcedureRecord>> {
      return lookupRows(store.findByIdempotencyKey, idempotencyKey);
    },

    async create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt> {
      if (!isUsableListBinding(binding)) {
        return { status: "DEFINITE_FAILURE" };
      }
      if (record.OrganizationId !== binding.organizationId || record.SiteId !== binding.siteId) {
        return { status: "DEFINITE_FAILURE" };
      }

      const encoded = encodePhysicalRow(record);
      if (!encoded.ok) {
        return { status: "DEFINITE_FAILURE" };
      }

      const prepared = buildCreateItemFields(record);
      if (!prepared.ok) {
        return { status: "DEFINITE_FAILURE" };
      }
      lastPreparedFields = prepared.fields;

      const insertResult = store.insert(encoded.row);
      switch (insertResult.kind) {
        case "inserted":
          return { status: "CREATED" };
        case "unique_collision":
          return { status: "INDETERMINATE" };
        case "forbidden":
          return { status: "DEFINITE_FAILURE" };
        case "transport_error":
          return { status: "INDETERMINATE" };
      }
    },
  };
}
