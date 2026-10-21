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
import {
  createInternalProcedureRecordReadTransport,
  type ProcedureRecordReadTransport,
} from "./spfx-read-internal-transport";

export type ReadOnlyProcedureRecordLookup = Readonly<{
  binding: ProcedureRecordListBinding;
  findByRecordId(recordId: string): Promise<LookupResult<ProcedureRecord>>;
}>;

export function createReadOnlyProcedureRecordLookup(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordReadTransport,
): ReadOnlyProcedureRecordLookup {
  const frozenBinding: ProcedureRecordListBinding = Object.freeze({
    organizationId: binding.organizationId,
    siteId: binding.siteId,
    listGuid: binding.listGuid,
  });

  const repository = createReadOnlyProcedureRecordRepository(
    frozenBinding,
    createInternalProcedureRecordReadTransport(transport),
  );

  return Object.freeze({
    binding: frozenBinding,
    findByRecordId: (recordId: string) => repository.findByRecordId(recordId),
  });
}

export { bindProcedureRecordList };
export type { ProcedureRecordListBinding };
export type { ProcedureRecordReadTransport };
export type { LookupResult };
export type { ProcedureRecord };
