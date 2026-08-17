import assert from "node:assert/strict";
import { test } from "node:test";
import { ASIA_TOKYO_TIME_ZONE, type LocalDate } from "../../src/contracts/types";
import {
  OBS_ACTION_CHIPS,
  OBS_MOOD_CHIPS,
  OBS_RESULT_CHIPS,
  SCHEDULE_ITEM_SCHEMA_VERSION,
  SCHEDULED_OCCURRENCE_SCHEMA_VERSION,
  mintLifecycleEventIdentity,
  mintOccurrenceId,
  resolveEffectiveOccurrenceState,
  validateProcedureObservation,
  validateProcedureRecordLifecycleEvent,
  validateProcedureRecordOccurrenceBinding,
  validateScheduleItem,
  validateScheduledOccurrence,
  type ObsMoodChip,
  type ProcedureObservation,
  type ProcedureRecordLifecycleEvent,
  type ProcedureRecordOccurrenceBinding,
  type ScheduleItem,
  type ScheduledOccurrence,
} from "../../src/domain/kiosk-contract";

test("Kiosk Contract 1: ScheduleItem validation", () => {
  const validItem: ScheduleItem = {
    schemaVersion: SCHEDULE_ITEM_SCHEMA_VERSION,
    ScheduleItemId: "sch-001",
    OrganizationId: "org-001",
    SiteId: "SITE-ISG",
    Procedure: {
      ProcedureId: "proc-001",
      ProcedureVersion: "1.0.0",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
    scheduledTime: "09:30",
    activityLabel: "朝の会",
    catalogOrder: 1,
  };

  assert.equal(validateScheduleItem(validItem), true);
  assert.equal(validateScheduleItem({ ...validItem, catalogOrder: 1.5 }), false);
  assert.equal(validateScheduleItem({ ...validItem, ScheduleItemId: "" }), false);
});

test("Kiosk Contract 1: ScheduledOccurrence minting & validation", () => {
  const occId = mintOccurrenceId({
    OrganizationId: "org-001",
    SiteId: "SITE-ISG",
    UserId: "user-a",
    LocalDate: "2026-08-17" as LocalDate,
    ScheduleItemId: "sch-001",
  });

  assert.equal(typeof occId, "string");
  assert.equal(occId.length, 64); // sha256 hex string

  const validOcc: ScheduledOccurrence = {
    schemaVersion: SCHEDULED_OCCURRENCE_SCHEMA_VERSION,
    OccurrenceId: occId,
    OrganizationId: "org-001",
    SiteId: "SITE-ISG",
    UserId: "user-a",
    LocalDate: "2026-08-17" as LocalDate,
    TimeZone: ASIA_TOKYO_TIME_ZONE,
    ScheduleItemId: "sch-001",
    Procedure: {
      ProcedureId: "proc-001",
      ProcedureVersion: "1.0.0",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  };

  assert.equal(validateScheduledOccurrence(validOcc), true);
  assert.equal(
    validateScheduledOccurrence({ ...validOcc, TimeZone: "UTC" as typeof ASIA_TOKYO_TIME_ZONE }),
    false,
  );
});

test("Kiosk Contract 1: ProcedureRecordOccurrenceBinding validation", () => {
  const binding: ProcedureRecordOccurrenceBinding = {
    schemaVersion: "1.0.0",
    OccurrenceId: "occ-001",
    RecordId: "rec-001",
  };

  assert.equal(validateProcedureRecordOccurrenceBinding(binding), true);
  assert.equal(validateProcedureRecordOccurrenceBinding({ ...binding, RecordId: "" }), false);
});

test("Kiosk Contract 2: ProcedureObservation vocabulary & optionality", () => {
  const obs: ProcedureObservation = {
    schemaVersion: "1.0.0",
    RecordId: "rec-001",
    condition: OBS_MOOD_CHIPS[0],
    response: OBS_ACTION_CHIPS[1],
    change: OBS_RESULT_CHIPS[0],
    memo: "様子良好",
  };

  assert.equal(validateProcedureObservation(obs), true);
  assert.equal(
    validateProcedureObservation({
      schemaVersion: "1.0.0",
      RecordId: "rec-001",
      condition: "unknown_chip" as ObsMoodChip,
    }),
    false,
  );

  // Must fail if all chip fields are absent/empty
  assert.equal(
    validateProcedureObservation({
      schemaVersion: "1.0.0",
      RecordId: "rec-001",
    }),
    false,
  );
});

test("Kiosk Contract 3: ProcedureRecordLifecycleEvent minting & validation", () => {
  const mint = mintLifecycleEventIdentity({
    eventType: "SUPERSEDE",
    targetRecordId: "rec-001",
    replacementRecordId: "rec-002",
    recordedAt: "2026-08-17T10:00:00Z",
    recordedBy: "staff-1",
  });

  const event: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    LifecycleEventId: mint.LifecycleEventId,
    LifecycleIdempotencyKey: mint.LifecycleIdempotencyKey,
    LifecyclePayloadFingerprint: mint.LifecyclePayloadFingerprint,
    eventType: "SUPERSEDE",
    targetRecordId: "rec-001",
    replacementRecordId: "rec-002",
    recordedAt: "2026-08-17T10:00:00Z",
    recordedBy: "staff-1",
  };

  assert.equal(validateProcedureRecordLifecycleEvent(event), true);

  // Same target and replacement in SUPERSEDE must fail
  assert.equal(
    validateProcedureRecordLifecycleEvent({
      ...event,
      replacementRecordId: "rec-001",
    }),
    false,
  );

  // CANCEL with replacementRecordId must fail
  assert.equal(
    validateProcedureRecordLifecycleEvent({
      ...event,
      eventType: "CANCEL",
      replacementRecordId: "rec-002",
    }),
    false,
  );
});

test("Kiosk Fail-Closed Effective Record Resolver (R1-R7)", () => {
  // R1: Single record, no events -> RECORDED
  assert.deepEqual(resolveEffectiveOccurrenceState(["rec-001"], []), {
    status: "RECORDED",
    effectiveRecordId: "rec-001",
  });

  // R2: SUPERSEDE A -> B -> RECORDED B
  const supersedeEv: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...mintLifecycleEventIdentity({
      eventType: "SUPERSEDE",
      targetRecordId: "rec-001",
      replacementRecordId: "rec-002",
      recordedAt: "2026-08-17T10:00:00Z",
      recordedBy: "staff-1",
    }),
    eventType: "SUPERSEDE",
    targetRecordId: "rec-001",
    replacementRecordId: "rec-002",
    recordedAt: "2026-08-17T10:00:00Z",
    recordedBy: "staff-1",
  };

  assert.deepEqual(resolveEffectiveOccurrenceState(["rec-001"], [supersedeEv]), {
    status: "RECORDED",
    effectiveRecordId: "rec-002",
  });

  // R4: CANCEL -> CANCELLED
  const cancelEv: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...mintLifecycleEventIdentity({
      eventType: "CANCEL",
      targetRecordId: "rec-001",
      recordedAt: "2026-08-17T10:00:00Z",
      recordedBy: "staff-1",
    }),
    eventType: "CANCEL",
    targetRecordId: "rec-001",
    recordedAt: "2026-08-17T10:00:00Z",
    recordedBy: "staff-1",
  };

  assert.deepEqual(resolveEffectiveOccurrenceState(["rec-001"], [cancelEv]), {
    status: "CANCELLED",
    targetRecordId: "rec-001",
  });

  // R5: Multiple SUPERSEDE for same target -> CONFLICT
  const supersedeEv2: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...mintLifecycleEventIdentity({
      eventType: "SUPERSEDE",
      targetRecordId: "rec-001",
      replacementRecordId: "rec-003",
      recordedAt: "2026-08-17T10:05:00Z",
      recordedBy: "staff-2",
    }),
    eventType: "SUPERSEDE",
    targetRecordId: "rec-001",
    replacementRecordId: "rec-003",
    recordedAt: "2026-08-17T10:05:00Z",
    recordedBy: "staff-2",
  };

  const r5Result = resolveEffectiveOccurrenceState(["rec-001"], [supersedeEv, supersedeEv2]);
  assert.equal(r5Result.status, "CONFLICT");

  // R6: Cycle A -> B -> A -> INVALID
  const cycleEv: ProcedureRecordLifecycleEvent = {
    schemaVersion: "1.0.0",
    ...mintLifecycleEventIdentity({
      eventType: "SUPERSEDE",
      targetRecordId: "rec-002",
      replacementRecordId: "rec-001",
      recordedAt: "2026-08-17T10:10:00Z",
      recordedBy: "staff-1",
    }),
    eventType: "SUPERSEDE",
    targetRecordId: "rec-002",
    replacementRecordId: "rec-001",
    recordedAt: "2026-08-17T10:10:00Z",
    recordedBy: "staff-1",
  };

  const r6Result = resolveEffectiveOccurrenceState(["rec-001"], [supersedeEv, cycleEv]);
  assert.equal(r6Result.status, "INVALID");
});
