/**
 * SPFx read-only ProcedureRecord bridge.
 *
 * The public surface is intentionally limited to binding validation and a
 * single-record lookup. The canonical repository is constructed internally
 * and is never returned or exported.
 */

import type { LookupResult } from "../../../contracts/types";
import type { ProcedureRecord } from "../../../domain/procedure-record";
import { bindProcedureRecordList, type ProcedureRecordListBinding } from "./list-binding";
import { createReadOnlyProcedureRecordRepository } from "./read-only-repository";
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

export type ReadOnlyProcedureRecordLookup = Readonly<{
  binding: ProcedureRecordListBinding;
  findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>>;
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

export function createReadOnlyProcedureRecordLookup(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordReadTransport,
): ReadOnlyProcedureRecordLookup {
  const internalTransport: ProcedureRecordLiveListTransport = {
    targetListGuid: transport.targetListGuid,
    getSchema: transport.getSchema ?? failClosedSchema,
    findByRecordId: (recordId: string) => transport.findByRecordId(recordId),
    findByIdempotencyKey: transport.findByIdempotencyKey ?? failClosedRead,
    createItem: failClosedCreate,
  };

  const repository = createReadOnlyProcedureRecordRepository(binding, internalTransport);

  return Object.freeze({
    binding: repository.binding,
    findByRecordId: (recordId: string) => repository.findByRecordId(recordId),
  });
}

export { bindProcedureRecordList };
export type { ProcedureRecordListBinding };
export type { LookupResult };
export type { ProcedureRecord };
