import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { LocalDate } from "../../src/contracts/types";
import {
  buildTodaySupportReadModel,
  type BuildTodaySupportReadModelInput,
} from "../../src/domain/kiosk-today-support-read-model";
import {
  mintLifecycleEventIdentity,
  mintOccurrenceId,
  type ProcedureObservation,
  type ProcedureRecordLifecycleEvent,
  type ProcedureRecordOccurrenceBinding,
  type ScheduleItem,
} from "../../src/domain/kiosk-contract";

import type { ProcedureRecord } from "../../src/domain/procedure-record";

describe("Kiosk Today Support Read Model Domain Unit", () => {
  const orgId = "org-synth-001";
  const siteId = "SITE-ISG";
  const userId = "user-a";
  const localDate = "2026-08-17" as LocalDate;

  const schItem1: ScheduleItem = {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-001",
    OrganizationId: orgId,
    SiteId: siteId,
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "12:00",
    activityLabel: "昼食準備・見守り",
    catalogOrder: 1,
  };

  const schItem2: ScheduleItem = {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-002",
    OrganizationId: orgId,
    SiteId: siteId,
    Procedure: {
      ProcedureId: "proc-snack",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "15:00",
    activityLabel: "おやつ活動",
    catalogOrder: 2,
  };

  // Repeated ProcedureId fixture case (D)
  const schItem3Repeated: ScheduleItem = {
    schemaVersion: "1.0.0",
    ScheduleItemId: "sch-003-repeated",
    OrganizationId: orgId,
    SiteId: siteId,
    Procedure: {
      ProcedureId: "proc-lunch", // Same procedureId as schItem1
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "17:00",
    activityLabel: "夕食前準備",
    catalogOrder: 3,
  };

  const occ1Id = mintOccurrenceId({
    OrganizationId: orgId,
    SiteId: siteId,
    UserId: userId,
    LocalDate: localDate,
    ScheduleItemId: schItem1.ScheduleItemId,
  });

  const occ2Id = mintOccurrenceId({
    OrganizationId: orgId,
    SiteId: siteId,
    UserId: userId,
    LocalDate: localDate,
    ScheduleItemId: schItem2.ScheduleItemId,
  });

  const occ3Id = mintOccurrenceId({
    OrganizationId: orgId,
    SiteId: siteId,
    UserId: userId,
    LocalDate: localDate,
    ScheduleItemId: schItem3Repeated.ScheduleItemId,
  });

  const record1: ProcedureRecord = {
    RecordId: "rec-001-sha256-hash-val-placeholder-64-chars-0000000000000000000",
    IdempotencyKey: "idemp-001",
    PayloadFingerprint: "fingerprint-001",
    OrganizationId: orgId,
    SiteId: siteId,
    UserId: userId,
    TimeZone: "Asia/Tokyo",
    LocalDate: localDate,
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    result: "PERFORMED_AS_PLANNED",
    performedAt: "2026-08-17T12:10:00.000Z",
    recordedAt: "2026-08-17T12:15:00.000Z",
    recordedBy: "staff-1",
  };

  const binding1: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: occ1Id,
    RecordId: record1.RecordId,
  };

  const obs1: ProcedureObservation = {
    schemaVersion: "1.0.0",
    RecordId: record1.RecordId,
    OccurrenceId: occ1Id,
    condition: "落ち着いていた",
    response: "見守り",
    change: "変化なし",
    memo: "問題なく終了",
  };

  const cancelIdent = mintLifecycleEventIdentity({
    eventType: "CANCEL",
    targetRecordId: record1.RecordId,
    recordedAt: "2026-08-17T12:30:00.000Z",
    recordedBy: "staff-lead",
    reason: "体調不良のため取りやめ",
  });

  const cancelEvent: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...cancelIdent,
    eventType: "CANCEL",
    targetRecordId: record1.RecordId,
    recordedAt: "2026-08-17T12:30:00.000Z",
    recordedBy: "staff-lead",
    reason: "体調不良のため取りやめ",
  };

  it("projects Unrecorded, Recorded, and Cancelled states with distinct OccurrenceIds for repeated procedures", () => {
    const input: BuildTodaySupportReadModelInput = {
      userId,
      personLabel: "Aさん",
      localDate,
      scheduleItems: [schItem1, schItem2, schItem3Repeated],
      occurrences: [],
      bindings: [binding1],
      procedureRecords: [record1],
      lifecycleEvents: [],
      observations: [obs1],
    };

    const items = buildTodaySupportReadModel(input);
    assert.equal(items.length, 3);

    // Item 1: Recorded
    assert.equal(items[0].occurrenceId, occ1Id);
    assert.equal(items[0].effectiveStatus, "記録済み");
    assert.equal(items[0].boundRecord?.RecordId, record1.RecordId);
    assert.equal(items[0].observation?.condition, "落ち着いていた");

    // Item 2: Unrecorded
    assert.equal(items[1].occurrenceId, occ2Id);
    assert.equal(items[1].effectiveStatus, "未実施");
    assert.equal(items[1].observation, undefined);

    // Item 3: Repeated procedureId, distinct OccurrenceId!
    assert.equal(items[2].occurrenceId, occ3Id);
    assert.notEqual(items[2].occurrenceId, items[0].occurrenceId);
    assert.equal(items[2].effectiveStatus, "未実施");
  });

  it("correctly resolves 取消済み state when CANCEL lifecycle event is present", () => {
    const input: BuildTodaySupportReadModelInput = {
      userId,
      personLabel: "Aさん",
      localDate,
      scheduleItems: [schItem1],
      occurrences: [],
      bindings: [binding1],
      procedureRecords: [record1],
      lifecycleEvents: [cancelEvent],
      observations: [obs1],
    };

    const items = buildTodaySupportReadModel(input);
    assert.equal(items.length, 1);
    assert.equal(items[0].effectiveStatus, "取消済み");
    assert.equal(items[0].boundRecord?.RecordId, record1.RecordId);
  });

  it("handles fail-closed CONFLICT state gracefully as 確認が必要", () => {
    const record2Conflict: ProcedureRecord = {
      ...record1,
      RecordId: "rec-002-sha256-hash-val-placeholder-64-chars-0000000000000000000",
    };

    const binding2Conflict: ProcedureRecordOccurrenceBinding = {
      schemaVersion: "1.0.0",
      OccurrenceId: occ1Id,
      RecordId: record2Conflict.RecordId,
    };

    const input: BuildTodaySupportReadModelInput = {
      userId,
      personLabel: "Aさん",
      localDate,
      scheduleItems: [schItem1],
      occurrences: [],
      bindings: [binding1, binding2Conflict], // Conflicting double active binding
      procedureRecords: [record1, record2Conflict],
      lifecycleEvents: [],
      observations: [],
    };

    const items = buildTodaySupportReadModel(input);
    assert.equal(items.length, 1);
    assert.equal(items[0].effectiveStatus, "確認が必要");
    assert.equal(items[0].rawResolverResult.status, "CONFLICT");
  });
});

describe("Kiosk Today Support SPFx entry (read-only)", () => {
  it("exports projection helpers and does not export persistence authority", async () => {
    const entry = await import("../../src/domain/kiosk-today-support-spfx-entry");
    assert.equal(typeof entry.buildTodaySupportReadModel, "function");
    assert.equal(typeof entry.mintOccurrenceId, "function");
    assert.equal(typeof entry.mintLifecycleEventIdentity, "function");
    assert.equal("persistProcedureRecord" in entry, false);
    assert.equal("persistStaffProcedureRecord" in entry, false);
    assert.equal("createLiveWriteHoldProcedureRecordPersistencePort" in entry, false);
  });
});
