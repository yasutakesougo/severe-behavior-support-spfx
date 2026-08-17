import type { ApprovedProcedureReference, LocalDate } from "../contracts/types";
import {
  mintOccurrenceId,
  resolveEffectiveOccurrenceState,
  type OccurrenceResolverResult,
  type ProcedureObservation,
  type ProcedureRecordLifecycleEvent,
  type ProcedureRecordOccurrenceBinding,
  type ScheduledOccurrence,
  type ScheduleItem,
} from "./kiosk-contract";
import type { ProcedureRecord } from "./procedure-record";

/**
 * Staff-facing occurrence status as required by Kiosk contract.
 * Exactly 3 staff-facing states (no invented states).
 */
export type StaffOccurrenceStatus = "未実施" | "記録済み" | "取消済み" | "確認が必要";

export type TodaySupportItem = Readonly<{
  occurrenceId: string;
  scheduleItemId: string;
  scheduledTime: string;
  activityLabel: string;
  catalogOrder: number;
  userId: string;
  personLabel: string;
  localDate: LocalDate;
  procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  effectiveStatus: StaffOccurrenceStatus;
  rawResolverResult: OccurrenceResolverResult;
  boundRecord?: ProcedureRecord;
  observation?: ProcedureObservation;
}>;

export type BuildTodaySupportReadModelInput = Readonly<{
  userId: string;
  personLabel: string;
  localDate: LocalDate;
  scheduleItems: readonly ScheduleItem[];
  occurrences: readonly ScheduledOccurrence[];
  bindings: readonly ProcedureRecordOccurrenceBinding[];
  procedureRecords: readonly ProcedureRecord[];
  lifecycleEvents: readonly ProcedureRecordLifecycleEvent[];
  observations: readonly ProcedureObservation[];
}>;

export function buildTodaySupportReadModel(
  input: BuildTodaySupportReadModelInput,
): readonly TodaySupportItem[] {
  const {
    userId,
    personLabel,
    localDate,
    scheduleItems,
    occurrences,
    bindings,
    procedureRecords,
    lifecycleEvents,
    observations,
  } = input;

  // Filter schedule items & occurrences relevant to this user + date, or derive occurrences
  const recordMap = new Map<string, ProcedureRecord>();
  for (const r of procedureRecords) {
    recordMap.set(r.RecordId, r);
  }

  const observationMap = new Map<string, ProcedureObservation>();
  for (const obs of observations) {
    if (obs.OccurrenceId) {
      observationMap.set(obs.OccurrenceId, obs);
    } else if (obs.RecordId) {
      observationMap.set(obs.RecordId, obs);
    }
  }

  // Sort schedule items chronologically by catalogOrder / scheduledTime
  const sortedScheduleItems = [...scheduleItems].sort((a, b) => {
    if (a.catalogOrder !== b.catalogOrder) {
      return a.catalogOrder - b.catalogOrder;
    }
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  const result: TodaySupportItem[] = [];

  for (const sch of sortedScheduleItems) {
    // Find matching occurrence or derive mint
    const foundOcc = occurrences.find(
      (o) =>
        o.ScheduleItemId === sch.ScheduleItemId && o.UserId === userId && o.LocalDate === localDate,
    );

    const occurrenceId =
      foundOcc?.OccurrenceId ??
      mintOccurrenceId({
        OrganizationId: sch.OrganizationId,
        SiteId: sch.SiteId,
        UserId: userId,
        LocalDate: localDate,
        ScheduleItemId: sch.ScheduleItemId,
      });

    // Find bindings for this occurrence
    const occBindings = bindings.filter((b) => b.OccurrenceId === occurrenceId);
    const boundRecordIds = occBindings.map((b) => b.RecordId);

    // Resolve lifecycle effective state
    const resolverResult = resolveEffectiveOccurrenceState(boundRecordIds, lifecycleEvents);

    let effectiveStatus: StaffOccurrenceStatus;
    let boundRecord: ProcedureRecord | undefined = undefined;

    if (resolverResult.status === "UNRECORDED") {
      effectiveStatus = "未実施";
    } else if (resolverResult.status === "RECORDED") {
      effectiveStatus = "記録済み";
      boundRecord = recordMap.get(resolverResult.effectiveRecordId);
    } else if (resolverResult.status === "CANCELLED") {
      effectiveStatus = "取消済み";
      if (boundRecordIds.length > 0) {
        boundRecord = recordMap.get(boundRecordIds[0]);
      }
    } else {
      // CONFLICT / INVALID fail-closed -> 確認が必要
      effectiveStatus = "確認が必要";
    }

    const obs =
      observationMap.get(occurrenceId) ??
      (boundRecord ? observationMap.get(boundRecord.RecordId) : undefined);

    result.push({
      occurrenceId,
      scheduleItemId: sch.ScheduleItemId,
      scheduledTime: sch.scheduledTime,
      activityLabel: sch.activityLabel,
      catalogOrder: sch.catalogOrder,
      userId,
      personLabel,
      localDate,
      procedure: sch.Procedure,
      planId: sch.planId,
      planVersion: sch.planVersion,
      effectiveStatus,
      rawResolverResult: resolverResult,
      boundRecord,
      observation: obs,
    });
  }

  return result;
}
