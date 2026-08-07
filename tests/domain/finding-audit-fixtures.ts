import type {
  FindingIdentity,
  AuditEvent,
  SnapshotCorrection,
  HandoffState,
} from "../../src/domain";

export const SYNTHETIC_FINDING_ID_ORG = "synthetic-org-001";
export const SYNTHETIC_FINDING_ID_SITE = "synthetic-site-001";
export const SYNTHETIC_FINDING_ID_USER = "synthetic-user-001";

/**
 * FINDING-ID-FX-001: 正常なFindingIdentity
 */
export function createSyntheticFindingIdentity(
  overrides?: Partial<FindingIdentity>,
): FindingIdentity {
  return {
    OrganizationId: SYNTHETIC_FINDING_ID_ORG,
    SiteId: SYNTHETIC_FINDING_ID_SITE,
    UserId: SYNTHETIC_FINDING_ID_USER,
    FindingCode: "SYNTHETIC_FINDING_CODE_001",
    ruleSetVersion: "synthetic-v1.0.0",
    periodStart: "2026-08-01",
    periodEnd: "2026-08-31",
    ...overrides,
  };
}

/**
 * AUDIT-FX-001: 正常なsuccess AuditEvent
 */
export function createSyntheticAuditEventSuccess(overrides?: Partial<AuditEvent>): AuditEvent {
  return {
    auditEventId: "synthetic-audit-event-001",
    OrganizationId: SYNTHETIC_FINDING_ID_ORG,
    SiteId: SYNTHETIC_FINDING_ID_SITE,
    actorStaffId: "synthetic-staff-001",
    actionCode: "SYNTHETIC_ACTION_RECORD_CREATED",
    targetType: "HandoffState",
    targetRecordId: "synthetic-record-001",
    result: "success",
    occurredAt: "2026-08-06T10:00:00.000Z",
    correlationId: "synthetic-correlation-001",
    appVersion: "synthetic-app-1.0",
    ruleSetVersion: "synthetic-rule-1.0",
    ...overrides,
  };
}

/**
 * CORRECTION-FX-001: 正常な訂正対応 SnapshotCorrection
 */
export function createSyntheticSnapshotCorrection(
  overrides?: Partial<SnapshotCorrection>,
): SnapshotCorrection {
  return {
    correctionId: "synthetic-correction-001",
    originalSnapshotId: "synthetic-snapshot-001",
    replacementSnapshotId: "synthetic-snapshot-002",
    reasonCode: "SYNTHETIC_REASON_SCORE_CORRECTED",
    reasonText: "synthetic correction detail text",
    correctedAt: "2026-08-06T12:00:00.000Z",
    correctedBy: "synthetic-staff-001",
    ...overrides,
  };
}

/**
 * HANDOFF-FX-001 ~ 005: 正常な HandoffState 各状態
 */
export function createSyntheticHandoffNotRequired(): HandoffState {
  return {
    status: "not_required",
  };
}

export function createSyntheticHandoffPending(overrides?: Partial<HandoffState>): HandoffState {
  return {
    status: "pending",
    requestedAt: "2026-08-06T10:00:00.000Z",
    requestedBy: "synthetic-staff-001",
    ...overrides,
  } as HandoffState;
}

export function createSyntheticHandoffIncluded(overrides?: Partial<HandoffState>): HandoffState {
  return {
    status: "included",
    requestedAt: "2026-08-06T10:00:00.000Z",
    requestedBy: "synthetic-staff-001",
    meetingId: "synthetic-meeting-001",
    includedAt: "2026-08-06T11:00:00.000Z",
    includedBy: "synthetic-manager-001",
    ...overrides,
  } as HandoffState;
}

export function createSyntheticHandoffAcknowledged(
  overrides?: Partial<HandoffState>,
): HandoffState {
  return {
    status: "acknowledged",
    requestedAt: "2026-08-06T10:00:00.000Z",
    requestedBy: "synthetic-staff-001",
    meetingId: "synthetic-meeting-001",
    includedAt: "2026-08-06T11:00:00.000Z",
    includedBy: "synthetic-manager-001",
    acknowledgedAt: "2026-08-06T12:00:00.000Z",
    acknowledgedBy: "synthetic-admin-001",
    ...overrides,
  } as HandoffState;
}

export function createSyntheticHandoffClosed(overrides?: Partial<HandoffState>): HandoffState {
  return {
    status: "closed",
    requestedAt: "2026-08-06T10:00:00.000Z",
    requestedBy: "synthetic-staff-001",
    meetingId: "synthetic-meeting-001",
    includedAt: "2026-08-06T11:00:00.000Z",
    includedBy: "synthetic-manager-001",
    acknowledgedAt: "2026-08-06T12:00:00.000Z",
    acknowledgedBy: "synthetic-admin-001",
    closedAt: "2026-08-06T13:00:00.000Z",
    closedBy: "synthetic-admin-001",
    ...overrides,
  } as HandoffState;
}
