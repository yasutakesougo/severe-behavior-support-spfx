/**
 * Concrete AuditEvent repository over a synthetic SharePoint-shaped store.
 *
 * Implements Accepted #29 mapping + Decision-AUD-REPO-1 port contracts.
 * No real SharePoint / Microsoft 365 / Entra / Deploy I/O.
 */

import type {
  AuditEventExistingLookupResult,
  AuditEventExistingResultPort,
  AuditEventPersistencePort,
  AuditEventWriteRequest,
  AuditEventWriteResult,
} from "../../../domain/audit-event-persistence";
import { computeIdempotencyIdentityKey, computeRecordIdentityKey } from "./identity-keys";
import { buildPhysicalRow, readPhysicalRow } from "./physical-mapper";
import type { SyntheticAuditEventListStore } from "./synthetic-list-store";

export type SyntheticAuditEventRepository = AuditEventPersistencePort &
  AuditEventExistingResultPort &
  Readonly<{
    boundOrganizationId: string;
  }>;

export function createSyntheticAuditEventRepository(
  boundOrganizationId: string,
  store: SyntheticAuditEventListStore,
): SyntheticAuditEventRepository {
  async function lookupByKey(
    rowsResult: ReturnType<SyntheticAuditEventListStore["findByRecordIdentityKey"]>,
    lookup:
      | Readonly<{ kind: "recordId"; token: string }>
      | Readonly<{ kind: "idempotencyKey"; token: string }>,
  ): Promise<AuditEventExistingLookupResult> {
    if (rowsResult.kind === "forbidden") {
      return { kind: "FORBIDDEN" };
    }
    if (rowsResult.kind === "transport_error") {
      return { kind: "RETRIEVAL_FAILED" };
    }

    const { rows } = rowsResult;
    if (rows.length === 0) {
      return { kind: "NOT_FOUND" };
    }
    if (rows.length >= 2) {
      return { kind: "RETRIEVAL_FAILED" };
    }

    const converted = readPhysicalRow(rows[0], boundOrganizationId, lookup);
    if (converted.kind === "RETRIEVAL_FAILED") {
      return { kind: "RETRIEVAL_FAILED" };
    }
    if (converted.kind === "MALFORMED_LOGICAL") {
      // REPLAY-1 MALFORMED boundary: FOUND with unusable persisted evidence.
      return { kind: "FOUND", persisted: converted.persisted };
    }
    return { kind: "FOUND", persisted: converted.persisted };
  }

  return {
    boundOrganizationId,

    async findByRecordId(recordId: string): Promise<AuditEventExistingLookupResult> {
      const key = computeRecordIdentityKey(boundOrganizationId, recordId);
      return lookupByKey(store.findByRecordIdentityKey(key), {
        kind: "recordId",
        token: recordId,
      });
    },

    async findByIdempotencyKey(idempotencyKey: string): Promise<AuditEventExistingLookupResult> {
      const key = computeIdempotencyIdentityKey(boundOrganizationId, idempotencyKey);
      return lookupByKey(store.findByIdempotencyIdentityKey(key), {
        kind: "idempotencyKey",
        token: idempotencyKey,
      });
    },

    async save(request: AuditEventWriteRequest): Promise<AuditEventWriteResult> {
      const built = buildPhysicalRow(request, boundOrganizationId);
      if (!built.ok) {
        return "SAVE_FAILED";
      }

      const insertResult = store.insert(built.row);
      switch (insertResult.kind) {
        case "inserted":
          return "SAVED";
        case "unique_collision":
          // Accepted #29 / REPO-1: collision → SAVE_OUTCOME_UNKNOWN → REPLAY dual verification
          return "SAVE_OUTCOME_UNKNOWN";
        case "forbidden":
          return "FORBIDDEN";
        case "transport_error":
          return "SAVE_FAILED";
      }
    },
  };
}
