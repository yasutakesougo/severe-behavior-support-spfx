/**
 * Test-only write seam. Not part of the production ProcedureRecord package export.
 */

import {
  buildCreateItemFields,
  createProcedureRecordRepository,
  isUsableLiveListBinding,
  normalizeSharePointGuid,
  verifyProcedureRecordPhysicalSchema,
  type ProcedureRecordListBinding,
  type ProcedureRecordListRepository,
  type ProcedureRecordLiveListTransport,
} from "../../../../src/adapters/sharepoint/procedure-record";
import type { ProcedureRecord } from "../../../../src/domain/procedure-record";
import type { ProcedureRecordCreateAttempt } from "../../../../src/domain/procedure-record-persistence";

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

export function createSyntheticAuthorizedProcedureRecordRepository(
  binding: ProcedureRecordListBinding,
  transport: ProcedureRecordLiveListTransport,
): ProcedureRecordListRepository {
  const production = createProcedureRecordRepository(binding, transport);
  return {
    binding,
    liveWriteAuthorized: true,
    findByRecordId: (recordId) => production.findByRecordId(recordId),
    findByIdempotencyKey: (idempotencyKey) => production.findByIdempotencyKey(idempotencyKey),
    verifyPhysicalSchema: () => production.verifyPhysicalSchema(),
    async create(record: ProcedureRecord): Promise<ProcedureRecordCreateAttempt> {
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
  };
}
