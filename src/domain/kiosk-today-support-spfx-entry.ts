/**
 * Narrow SPFx read-model bridge entry.
 *
 * Canonical implementation remains:
 * - src/domain/kiosk-today-support-read-model.ts
 * - src/domain/kiosk-contract.ts
 *
 * This module re-exports only the projection/read-model surface consumed by
 * TodaySupportDayBoard, OverviewDashboard, CurrentProcedure, and the synthetic
 * SPFx fixture. It has no write / persistence / handoff mutation authority.
 */
export type { ApprovedProcedureReference, LocalDate } from "../contracts/types";
export type { ProcedureRecord } from "./procedure-record";
export {
  mintLifecycleEventIdentity,
  mintOccurrenceId,
  type OccurrenceResolverResult,
  type ProcedureObservation,
  type ProcedureRecordLifecycleEvent,
  type ProcedureRecordOccurrenceBinding,
  type ScheduleItem,
  type ScheduledOccurrence,
} from "./kiosk-contract";
export {
  buildTodaySupportReadModel,
  type BuildTodaySupportReadModelInput,
  type StaffOccurrenceStatus,
  type TodaySupportItem,
} from "./kiosk-today-support-read-model";
