/**
 * Root-only internal transport compatibility factory for the SPFx read bridge.
 *
 * This module is bundled into the browser bridge but is not re-exported by
 * spfx-read-entry.ts. Root tests import it directly to prove fail-closed
 * behavior without exposing the factory through the public bridge.
 */

import type {
  ProcedureRecordItemCreateResult,
  ProcedureRecordItemReadResult,
  ProcedureRecordLiveListTransport,
  ProcedureRecordSchemaReadResult,
} from "./transport-seam";

export type ProcedureRecordReadTransport = Readonly<{
  targetListGuid: string;
  getSchema?(): Promise<ProcedureRecordSchemaReadResult>;
  findByRecordId(recordId: string): Promise<ProcedureRecordItemReadResult>;
  findByIdempotencyKey?(idempotencyKey: string): Promise<ProcedureRecordItemReadResult>;
}>;

const failClosedSchema = async (): Promise<ProcedureRecordSchemaReadResult> => ({
  ok: false,
  failure: "FORBIDDEN",
});

const failClosedRead = async (): Promise<ProcedureRecordItemReadResult> => ({
  ok: false,
  failure: "FORBIDDEN",
});

const failClosedCreate = async (): Promise<ProcedureRecordItemCreateResult> => ({
  ok: false,
  failure: "FORBIDDEN",
});

export function createInternalProcedureRecordReadTransport(
  input: ProcedureRecordReadTransport,
): ProcedureRecordLiveListTransport {
  return {
    targetListGuid: input.targetListGuid,
    getSchema: input.getSchema ?? failClosedSchema,
    findByRecordId: (recordId: string) => input.findByRecordId(recordId),
    findByIdempotencyKey: input.findByIdempotencyKey ?? failClosedRead,
    createItem: failClosedCreate,
  };
}
