import type { LocalDate } from "../../sbs-domain/kiosk-read-model.bundle";
import {
  buildTodaySupportReadModel,
  mintLifecycleEventIdentity,
  mintOccurrenceId,
  type ProcedureObservation,
  type ProcedureRecord,
  type ProcedureRecordLifecycleEvent,
  type ProcedureRecordOccurrenceBinding,
  type ScheduleItem,
  type TodaySupportItem,
} from "../../sbs-domain/kiosk-read-model.bundle";

export const KIOSK_FIXTURE_ORG_ID = "synthetic-org-001";
export const KIOSK_FIXTURE_SITE_ID = "SITE-ISG";
export const KIOSK_FIXTURE_USER_ID = "user-a";
export const KIOSK_FIXTURE_USER_LABEL = "Aさん";
export const KIOSK_FIXTURE_LOCAL_DATE = "2026-08-17" as LocalDate;

/**
 * Fixture ScheduleItems:
 * 1. Morning activity (sch-001)
 * 2. Lunch preparation (sch-002) - proc-lunch
 * 3. Afternoon creation (sch-003) - proc-creation
 * 4. Evening snack / prep (sch-004) - proc-lunch (REPEATED SAME PROCEDURE)
 * 5. End-of-day check (sch-005-conflict) - CONFLICT / 確認が必要
 */
export const KIOSK_SYNTHETIC_SCHEDULE_ITEMS: readonly ScheduleItem[] = [
  {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-001",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    Procedure: {
      ProcedureId: "proc-morning",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "09:30",
    activityLabel: "朝の朝礼・視覚スケジュールの確認",
    catalogOrder: 1,
  },
  {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-002",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "12:00",
    activityLabel: "昼食準備・配膳見守り",
    catalogOrder: 2,
  },
  {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-003",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    Procedure: {
      ProcedureId: "proc-creation",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "14:00",
    activityLabel: "午後創作・個別課題",
    catalogOrder: 3,
  },
  {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-004-repeated",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    Procedure: {
      ProcedureId: "proc-lunch", // REPEATED PROCEDURE ID (Case D)
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "17:00",
    activityLabel: "夕食前片付け・整理",
    catalogOrder: 4,
  },
  {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-005-conflict",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    Procedure: {
      ProcedureId: "proc-conflict",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "18:00",
    activityLabel: "終了前の状態確認（確認が必要）",
    catalogOrder: 5,
  },
];

export const KIOSK_RECORD_1: ProcedureRecord = {
  RecordId: "rec-synth-001-sha256-hash-value-placeholder-64-characters-0000000",
  IdempotencyKey: "idemp-001",
  PayloadFingerprint: "fingerprint-001",
  OrganizationId: KIOSK_FIXTURE_ORG_ID,
  SiteId: KIOSK_FIXTURE_SITE_ID,
  UserId: KIOSK_FIXTURE_USER_ID,
  TimeZone: "Asia/Tokyo",
  LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
  Procedure: {
    ProcedureId: "proc-lunch",
    ProcedureVersion: "v1",
    ApprovalState: "APPROVED",
  },
  planId: "plan-001",
  planVersion: 1,
  result: "PERFORMED_AS_PLANNED",
  performedAt: "2026-08-17T12:05:00.000Z",
  recordedAt: "2026-08-17T12:10:00.000Z",
  recordedBy: "staff-1",
};

export const KIOSK_RECORD_CANCELLED: ProcedureRecord = {
  RecordId: "rec-synth-003-sha256-hash-value-placeholder-64-characters-0000000",
  IdempotencyKey: "idemp-003",
  PayloadFingerprint: "fingerprint-003",
  OrganizationId: KIOSK_FIXTURE_ORG_ID,
  SiteId: KIOSK_FIXTURE_SITE_ID,
  UserId: KIOSK_FIXTURE_USER_ID,
  TimeZone: "Asia/Tokyo",
  LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
  Procedure: {
    ProcedureId: "proc-creation",
    ProcedureVersion: "v1",
    ApprovalState: "APPROVED",
  },
  planId: "plan-001",
  planVersion: 1,
  result: "NOT_PERFORMED",
  performedAt: "2026-08-17T14:00:00.000Z",
  recordedAt: "2026-08-17T14:05:00.000Z",
  recordedBy: "staff-2",
};

export const KIOSK_RECORD_CONFLICT_A: ProcedureRecord = {
  RecordId: "rec-synth-005a-sha256-hash-value-placeholder-64-characters-00000",
  IdempotencyKey: "idemp-005a",
  PayloadFingerprint: "fingerprint-005a",
  OrganizationId: KIOSK_FIXTURE_ORG_ID,
  SiteId: KIOSK_FIXTURE_SITE_ID,
  UserId: KIOSK_FIXTURE_USER_ID,
  TimeZone: "Asia/Tokyo",
  LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
  Procedure: {
    ProcedureId: "proc-conflict",
    ProcedureVersion: "v1",
    ApprovalState: "APPROVED",
  },
  planId: "plan-001",
  planVersion: 1,
  result: "PERFORMED_AS_PLANNED",
  performedAt: "2026-08-17T18:00:00.000Z",
  recordedAt: "2026-08-17T18:05:00.000Z",
  recordedBy: "staff-3",
};

export const KIOSK_RECORD_CONFLICT_B: ProcedureRecord = {
  RecordId: "rec-synth-005b-sha256-hash-value-placeholder-64-characters-00000",
  IdempotencyKey: "idemp-005b",
  PayloadFingerprint: "fingerprint-005b",
  OrganizationId: KIOSK_FIXTURE_ORG_ID,
  SiteId: KIOSK_FIXTURE_SITE_ID,
  UserId: KIOSK_FIXTURE_USER_ID,
  TimeZone: "Asia/Tokyo",
  LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
  Procedure: {
    ProcedureId: "proc-conflict",
    ProcedureVersion: "v1",
    ApprovalState: "APPROVED",
  },
  planId: "plan-001",
  planVersion: 1,
  result: "PERFORMED_WITH_ADAPTATION",
  performedAt: "2026-08-17T18:02:00.000Z",
  recordedAt: "2026-08-17T18:06:00.000Z",
  recordedBy: "staff-4",
};

function mintFixtureOccurrenceId(scheduleItemId: string): string {
  return mintOccurrenceId({
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    ScheduleItemId: scheduleItemId,
  });
}

/**
 * Returns the synthetic Today Support items covering fixture Cases A through G.
 * Occurrence minting is deferred so Jest jsdom can import this module before
 * TextEncoder is polyfilled.
 */
export function getKioskSyntheticTodaySupportItems(): readonly TodaySupportItem[] {
  const occurrenceId2 = mintFixtureOccurrenceId("sch-002");
  const occurrenceId3 = mintFixtureOccurrenceId("sch-003");
  const occurrenceId5 = mintFixtureOccurrenceId("sch-005-conflict");
  const cancelIdent = mintLifecycleEventIdentity({
    eventType: "CANCEL",
    targetRecordId: KIOSK_RECORD_CANCELLED.RecordId,
    recordedAt: "2026-08-17T14:15:00.000Z",
    recordedBy: "staff-lead",
    reason: "熱感あり静養のため中止",
  });

  const binding2: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: occurrenceId2,
    RecordId: KIOSK_RECORD_1.RecordId,
  };
  const binding3: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: occurrenceId3,
    RecordId: KIOSK_RECORD_CANCELLED.RecordId,
  };
  const binding5a: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: occurrenceId5,
    RecordId: KIOSK_RECORD_CONFLICT_A.RecordId,
  };
  const binding5b: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: occurrenceId5,
    RecordId: KIOSK_RECORD_CONFLICT_B.RecordId,
  };
  const observation2: ProcedureObservation = {
    schemaVersion: "1.0.0",
    RecordId: KIOSK_RECORD_1.RecordId,
    OccurrenceId: occurrenceId2,
    condition: "落ち着いていた",
    response: "見守り",
    change: "変化なし",
    memo: "自分で食具を準備して静かに食事ができた。",
  };
  const cancelEvent: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...cancelIdent,
    eventType: "CANCEL",
    targetRecordId: KIOSK_RECORD_CANCELLED.RecordId,
    recordedAt: "2026-08-17T14:15:00.000Z",
    recordedBy: "staff-lead",
    reason: "熱感あり静養のため中止",
  };

  return buildTodaySupportReadModel({
    userId: KIOSK_FIXTURE_USER_ID,
    personLabel: KIOSK_FIXTURE_USER_LABEL,
    localDate: KIOSK_FIXTURE_LOCAL_DATE,
    scheduleItems: KIOSK_SYNTHETIC_SCHEDULE_ITEMS,
    occurrences: [],
    bindings: [binding2, binding3, binding5a, binding5b],
    procedureRecords: [
      KIOSK_RECORD_1,
      KIOSK_RECORD_CANCELLED,
      KIOSK_RECORD_CONFLICT_A,
      KIOSK_RECORD_CONFLICT_B,
    ],
    lifecycleEvents: [cancelEvent],
    observations: [observation2],
  });
}
