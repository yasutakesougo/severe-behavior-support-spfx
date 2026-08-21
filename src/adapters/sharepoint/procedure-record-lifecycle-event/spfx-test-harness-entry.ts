/**
 * Narrow SPFx bridge entry for B2 isolated test-only harness.
 * Re-exports only binding + Slice E storage port + minimum types.
 * Does not copy Slice E logic. Does not authorize LIVE WRITE / Production Binding.
 */

export {
  bindProcedureRecordLifecycleEventList,
  isUsableProcedureRecordLifecycleEventListBinding,
  type ProcedureRecordLifecycleEventListBinding,
} from "./list-binding";
export {
  createProcedureRecordCancellationSharePointStoragePort,
  type ProcedureRecordCancellationSharePointStoragePort,
} from "./cancellation-storage-port";
export {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  type ProcedureRecordLifecycleEventPhysicalRow,
} from "./physical-columns";
export type {
  ProcedureRecordLifecycleEventListTransport,
  ProcedureRecordLifecycleEventItemCreateResult,
  ProcedureRecordLifecycleEventItemReadResult,
} from "./transport-seam";
