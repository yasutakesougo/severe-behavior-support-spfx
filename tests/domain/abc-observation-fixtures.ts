import type { AbcRecord, Observation, LinkFailure } from "../../src/domain";

export const SYNTHETIC_ORG_ID = "synthetic-org-001";
export const SYNTHETIC_SITE_ID = "synthetic-site-001";
export const SYNTHETIC_USER_ID = "synthetic-user-001";
export const SYNTHETIC_PLAN_ID = "synthetic-plan-001";

export function createSyntheticAbcRecord(
  overrides?: Partial<AbcRecord>
): AbcRecord {
  return {
    OrganizationId: SYNTHETIC_ORG_ID,
    SiteId: SYNTHETIC_SITE_ID,
    UserId: SYNTHETIC_USER_ID,
    RecordId: "synthetic-rec-abc-001",
    IdempotencyKey: "synthetic-idem-abc-001",
    PayloadFingerprint: "synthetic-sha256-abc-001",
    occurredAt: "2026-08-06T10:00:00.000Z",
    antecedent: "synthetic antecedent prompt",
    behavior: "synthetic target behavior",
    aftermath: "synthetic consequence aftermath",
    intensity: {
      scaleCode: "SYNTHETIC_BEHAVIOR_INTENSITY_SCALE",
      value: 3,
    },
    recordedBy: "synthetic-staff-001",
    planId: SYNTHETIC_PLAN_ID,
    saveState: {
      status: "Saved",
    },
    linkState: {
      status: "Pending",
      sourceContext: {
        sourceType: "synthetic-external-app",
        sourceReferenceId: "synthetic-ext-ref-001",
      },
    },
    version: 1,
    ...overrides,
  };
}

export function createSyntheticObservation(
  overrides?: Partial<Observation>
): Observation {
  const base = {
    OrganizationId: SYNTHETIC_ORG_ID,
    SiteId: SYNTHETIC_SITE_ID,
    UserId: SYNTHETIC_USER_ID,
    RecordId: "synthetic-rec-obs-001",
    observedAt: "2026-08-06T11:00:00.000Z",
    observedBy: "synthetic-staff-001",
    content: "synthetic observation content note",
    planId: SYNTHETIC_PLAN_ID,
    version: 1,
  };

  if (overrides && overrides.correctionOf && overrides.correctionReason) {
    return {
      ...base,
      correctionOf: overrides.correctionOf,
      correctionReason: overrides.correctionReason,
      ...overrides,
    } as Observation;
  }

  return {
    ...base,
    ...overrides,
  } as Observation;
}

export function createSyntheticLinkFailure(
  overrides?: Partial<LinkFailure>
): LinkFailure {
  return {
    failureId: "synthetic-fail-001",
    targetRecordId: "synthetic-rec-abc-001",
    OrganizationId: SYNTHETIC_ORG_ID,
    SiteId: SYNTHETIC_SITE_ID,
    status: "Open",
    correlationId: "synthetic-corr-001",
    retryCount: 0,
    version: 1,
    ...overrides,
  };
}
