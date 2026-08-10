/**
 * Concrete AssessmentSnapshot repository over a synthetic SharePoint-shaped store.
 * GO-SLICE-1: no live SharePoint / M365 / Entra / Deploy I/O.
 */

import { validateAssessmentSnapshot } from "../../../domain/assessment-snapshot";
import { decodePhysicalRow, encodePhysicalRow } from "./conversion";
import type {
  AssessmentSnapshotLookupResult,
  AssessmentSnapshotPersistencePort,
  AssessmentSnapshotSaveRequest,
  AssessmentSnapshotSaveResult,
} from "./persistence-port";
import { ASSESSMENT_SNAPSHOT_SAVE_INTENTS } from "./persistence-port";
import {
  buildCreateItemFields,
  buildUpdateItemFields,
  resolveUpdateSupersedesMode,
} from "./rest-body";
import type { SyntheticAssessmentSnapshotListStore } from "./synthetic-list-store";
import { SPFX_SPHTTPCLIENT_HOST_SEAM } from "./transport-seam";

export type SyntheticAssessmentSnapshotRepository = AssessmentSnapshotPersistencePort &
  Readonly<{
    /** Last REST field body prepared（synthetic inspection；no HTTP sent）. */
    lastPreparedFields: Readonly<Record<string, unknown>> | null;
    hostSeam: typeof SPFX_SPHTTPCLIENT_HOST_SEAM;
  }>;

export function createSyntheticAssessmentSnapshotRepository(
  store: SyntheticAssessmentSnapshotListStore,
): SyntheticAssessmentSnapshotRepository {
  let lastPreparedFields: Readonly<Record<string, unknown>> | null = null;

  return {
    hostSeam: SPFX_SPHTTPCLIENT_HOST_SEAM,

    get lastPreparedFields() {
      return lastPreparedFields;
    },

    async findBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotLookupResult> {
      const found = store.findBySnapshotId(snapshotId);
      if (found.kind === "forbidden" || found.kind === "transport_error") {
        return { kind: "PERSISTENCE_UNAVAILABLE" };
      }
      if (found.kind === "not_found") {
        return { kind: "NOT_FOUND" };
      }
      const decoded = decodePhysicalRow(found.row);
      if (!decoded.ok || found.row.ListItemId === undefined) {
        return { kind: "MALFORMED_PHYSICAL" };
      }
      return {
        kind: "FOUND",
        snapshot: decoded.snapshot,
        listItemId: found.row.ListItemId,
      };
    },

    async save(request: AssessmentSnapshotSaveRequest): Promise<AssessmentSnapshotSaveResult> {
      if (!(ASSESSMENT_SNAPSHOT_SAVE_INTENTS as readonly string[]).includes(request.intent)) {
        return { ok: false, code: "MALFORMED_INTENT" };
      }

      const validated = validateAssessmentSnapshot(request.snapshot);
      if (!validated.ok) {
        return { ok: false, code: "VALIDATION_FAILED" };
      }
      const snapshot = validated.snapshot;

      // SC-1: intent must agree with recordStatus（fail-closed；no silent coerce）.
      if (request.intent === "draft" && snapshot.recordStatus !== "draft") {
        return { ok: false, code: "VALIDATION_FAILED" };
      }
      if (
        (request.intent === "finalize" || request.intent === "correct-as-new-version") &&
        snapshot.recordStatus !== "finalized"
      ) {
        return { ok: false, code: "VALIDATION_FAILED" };
      }

      if (
        request.intent === "correct-as-new-version" &&
        snapshot.supersedesSnapshotId === undefined
      ) {
        return { ok: false, code: "VALIDATION_FAILED" };
      }

      const existing = store.findBySnapshotId(snapshot.snapshotId);
      if (existing.kind === "forbidden" || existing.kind === "transport_error") {
        return { ok: false, code: "PERSISTENCE_UNAVAILABLE" };
      }

      if (existing.kind === "row") {
        if (existing.row.recordStatus === "finalized") {
          return { ok: false, code: "OVERWRITE_FORBIDDEN" };
        }
        if (request.intent === "correct-as-new-version") {
          // correct-as-new-version must allocate a new snapshotId（DEC-009）.
          return { ok: false, code: "OVERWRITE_FORBIDDEN" };
        }

        const modeResolved = resolveUpdateSupersedesMode(
          snapshot,
          existing.row.supersedesSnapshotId,
        );
        if (!modeResolved.ok) {
          return { ok: false, code: "VALIDATION_FAILED" };
        }

        const body = buildUpdateItemFields(snapshot, modeResolved.mode);
        if (!body.ok) {
          return { ok: false, code: "VALIDATION_FAILED" };
        }
        lastPreparedFields = body.fields;

        const encoded = encodePhysicalRow(snapshot);
        if (!encoded.ok) {
          return { ok: false, code: "VALIDATION_FAILED" };
        }

        const physicalForUpdate: typeof encoded.row = { ...encoded.row };
        if (modeResolved.mode.kind === "clear") {
          (physicalForUpdate as { supersedesSnapshotId?: string | null }).supersedesSnapshotId =
            null;
        } else if (modeResolved.mode.kind === "omit") {
          delete (physicalForUpdate as { supersedesSnapshotId?: string | null })
            .supersedesSnapshotId;
        }

        const updated = store.update(snapshot.snapshotId, physicalForUpdate);
        if (updated.kind === "forbidden" || updated.kind === "transport_error") {
          return { ok: false, code: "PERSISTENCE_UNAVAILABLE" };
        }
        if (updated.kind === "not_found") {
          return { ok: false, code: "PERSISTENCE_UNAVAILABLE" };
        }
        return { ok: true, kind: "SAVED", listItemId: updated.listItemId };
      }

      // create
      const body = buildCreateItemFields(snapshot);
      if (!body.ok) {
        return { ok: false, code: "VALIDATION_FAILED" };
      }
      lastPreparedFields = body.fields;

      const encoded = encodePhysicalRow(snapshot);
      if (!encoded.ok) {
        return { ok: false, code: "VALIDATION_FAILED" };
      }

      const inserted = store.insert(encoded.row);
      if (inserted.kind === "forbidden" || inserted.kind === "transport_error") {
        return { ok: false, code: "PERSISTENCE_UNAVAILABLE" };
      }
      return { ok: true, kind: "SAVED", listItemId: inserted.listItemId };
    },
  };
}
