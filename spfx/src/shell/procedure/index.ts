export { CurrentProcedure, type CurrentProcedureProps } from "./CurrentProcedure";
export { ProcedureRecordForm, type ProcedureRecordFormProps } from "./ProcedureRecordForm";
export {
  FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE,
  FIELD_WORKFLOW_HISTORICAL_UNRESOLVED_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_NO_AUTO_JUDGE_NOTE,
  FIELD_WORKFLOW_PRESENTATION_NOTE,
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
  PROCEDURE_RECORD_RESULT_HINTS,
  PROCEDURE_RECORD_RESULT_LABELS,
  hintForProcedureRecordResult,
  labelForProcedureRecordResult,
  procedureResultCopyIsNonFailure,
} from "./procedure-copy";
export {
  FIELD_WORKFLOW_CURRENT_USER_A,
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
  FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
  FIELD_WORKFLOW_UI_SLICE,
  VP4_WORKFLOW_SLICE,
} from "./procedure-fixture";
export { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
export {
  projectionUsesRecordPlanVersion,
  resolveProcedureReviewProjection,
  type HistoricalProjectionView,
} from "./procedure-projection";
export {
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
  createProcedureRecordSaveInFlightGuard,
  defaultTokyoPerformedAtLocal,
  isProcedureRecordDraftReadyToSave,
  retainDraftAfterSaveFailed,
} from "./procedure-record-draft";
export {
  buildStaffProcedureRecordCreateInput,
  persistStaffProcedureRecordFromForm,
  STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT,
} from "./procedure-record-persist";
export type {
  CurrentProcedureProjection,
  HistoricalLookupStatus,
  ProcedureBindingContext,
  ProcedureRecordDraft,
  ProcedureRecordFormSaveSnapshot,
  ProcedureRecordResultValue,
  ShellCurrentProcedurePresentation,
  ShellProcedureReviewMaterial,
  ShellProcedureWorkflowPresentation,
} from "./procedure-types";
export { PROCEDURE_RECORD_RESULT_VALUES } from "./procedure-types";
