/**
 * Typings for the esbuild bundle of src/domain/kiosk-today-support-spfx-entry.ts.
 * Canonical read-model remains src/domain. This bundle is READ-ONLY:
 * no persistProcedureRecord / persistStaffProcedureRecord / live-write port /
 * audit-event persistence / handoff mutation.
 */

export type LocalDate = string & { readonly __brand: "LocalDate" };

export type ApprovedProcedureReference = Readonly<{
  ProcedureId: string;
  ProcedureVersion: string;
  ApprovalState: "APPROVED";
}>;

export type ScheduleItem = Readonly<{
  schemaVersion: "1.0.0";
  ScheduleItemId: string;
  OrganizationId: string;
  SiteId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
  scheduledTime: string;
  activityLabel: string;
  catalogOrder: number;
}>;

export type ScheduledOccurrence = Readonly<{
  schemaVersion: "1.0.0";
  OccurrenceId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  LocalDate: LocalDate;
  TimeZone: "Asia/Tokyo";
  ScheduleItemId: string;
  Procedure: ApprovedProcedureReference;
  planId: string;
  planVersion: number;
}>;

export type ProcedureRecordOccurrenceBinding = Readonly<{
  schemaVersion: "1.0.0";
  OccurrenceId: string;
  RecordId: string;
}>;

export type ProcedureObservation = Readonly<{
  schemaVersion: "1.0.0";
  RecordId: string;
  OccurrenceId?: string;
  condition?: "落ち着いていた" | "不安そう" | "拒否あり" | "興奮あり" | "切り替え困難";
  response?: "見守り" | "声かけ" | "環境調整" | "活動変更" | "距離を取る" | "クールダウン";
  change?: "改善した" | "変化なし" | "悪化した" | "途中で落ち着いた";
  memo?: string;
}>;

export type ProcedureRecordLifecycleEvent = Readonly<{
  schemaVersion: "1.0.0";
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
  eventType: "SUPERSEDE" | "CANCEL";
  targetRecordId: string;
  replacementRecordId?: string;
  recordedAt: string;
  recordedBy: string;
  reason?: string;
}>;

export type ProcedureRecord = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  TimeZone: "Asia/Tokyo";
  RecordId: string;
  IdempotencyKey: string;
  PayloadFingerprint: string;
  Procedure: ApprovedProcedureReference;
  LocalDate: LocalDate;
  planId: string;
  planVersion: number;
  result: "PERFORMED_AS_PLANNED" | "PERFORMED_WITH_ADAPTATION" | "NOT_PERFORMED";
  performedAt: string;
  recordedAt: string;
  recordedBy: string;
}>;

export type OccurrenceResolverResult =
  | Readonly<{ status: "UNRECORDED" }>
  | Readonly<{ status: "RECORDED"; effectiveRecordId: string }>
  | Readonly<{ status: "CANCELLED"; targetRecordId: string }>
  | Readonly<{ status: "CONFLICT"; reason: string }>
  | Readonly<{ status: "INVALID"; reason: string }>;

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
): readonly TodaySupportItem[];

export function mintOccurrenceId(
  input: Readonly<{
    OrganizationId: string;
    SiteId: string;
    UserId: string;
    LocalDate: LocalDate;
    ScheduleItemId: string;
  }>,
): string;

export function mintLifecycleEventIdentity(
  input: Readonly<{
    eventType: "SUPERSEDE" | "CANCEL";
    targetRecordId: string;
    replacementRecordId?: string;
    recordedAt: string;
    recordedBy: string;
    reason?: string;
  }>,
): Readonly<{
  LifecycleEventId: string;
  LifecycleIdempotencyKey: string;
  LifecyclePayloadFingerprint: string;
}>;
