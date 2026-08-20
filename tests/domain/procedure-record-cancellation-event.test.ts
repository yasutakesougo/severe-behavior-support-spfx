import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AuthorizationContext, LookupResult, Role, SiteMembership } from "../../src/contracts";
import {
  mintLifecycleEventIdentity,
  resolveEffectiveOccurrenceState,
  type ProcedureRecordLifecycleEvent,
} from "../../src/domain/kiosk-contract";
import {
  assembleProcedureRecordCancellationLifecycleEvent,
  classifyProcedureRecordCancellationLifecycleEventReplay,
  PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED,
  PROCEDURE_RECORD_CANCELLATION_EVENT_VERSION,
} from "../../src/domain/procedure-record-cancellation-event";
import {
  assembleProcedureRecordCancellationSemantics,
  PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED,
} from "../../src/domain/procedure-record-cancellation";
import {
  assembleProcedureRecordCorrection,
  type ProcedureRecordCorrection,
} from "../../src/domain/procedure-record-correction";
import type { ProcedureRecord, ProcedureRecordResult } from "../../src/domain/procedure-record";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

const ORG = "synthetic-org-001";
const SITE = "SITE-ISG" as const;
const OTHER_SITE = "SITE-HOM" as const;
const FROZEN_RECORDED_AT = "2026-08-20T12:00:00.000Z";
type AuthorizedSite = "SITE-ISG" | "SITE-HOM";

function siteMembership(siteId: AuthorizedSite, roles: readonly Role[]): SiteMembership {
  return { SiteId: siteId, Roles: roles };
}

function foundAuthorization(
  options: {
    subject?: string;
    userId?: string;
    organizationId?: string;
    selectedSiteId?: AuthorizedSite | null;
    memberships?: readonly SiteMembership[];
    roles?: readonly Role[];
  } = {},
): LookupResult<AuthorizationContext> {
  const selectedSiteId = options.selectedSiteId === undefined ? SITE : options.selectedSiteId;
  return {
    status: "FOUND",
    value: {
      Subject: options.subject ?? "synthetic-cancellation-subject-001",
      UserId: options.userId ?? "synthetic-user-001",
      OrganizationId: options.organizationId ?? ORG,
      SiteContext: {
        Memberships: options.memberships ?? [
          siteMembership(selectedSiteId ?? SITE, options.roles ?? ["SERVICE_MANAGER"]),
        ],
        SelectedSiteId: selectedSiteId,
      },
    },
  };
}

function lifecycleEvent(
  input: Pick<ProcedureRecordLifecycleEvent, "eventType" | "targetRecordId"> &
    Partial<Pick<ProcedureRecordLifecycleEvent, "replacementRecordId" | "reason" | "recordedAt">>,
): ProcedureRecordLifecycleEvent {
  const recordedAt = input.recordedAt ?? "2026-08-20T10:00:00.000Z";
  const recordedBy = "synthetic-cancellation-subject-001";
  const identity = mintLifecycleEventIdentity({
    eventType: input.eventType,
    targetRecordId: input.targetRecordId,
    replacementRecordId: input.replacementRecordId,
    recordedAt,
    recordedBy,
    reason: input.reason,
  });
  return {
    schemaVersion: "1.0.0",
    ...identity,
    eventType: input.eventType,
    targetRecordId: input.targetRecordId,
    ...(input.replacementRecordId === undefined
      ? {}
      : { replacementRecordId: input.replacementRecordId }),
    recordedAt,
    recordedBy,
    ...(input.reason === undefined ? {} : { reason: input.reason }),
  };
}

function createCorrection(
  record: ProcedureRecord,
  overrides: Partial<{
    result: ProcedureRecordResult;
    performedAt: string;
    reason: string;
    correctedAt: string;
    correctedBy: string;
  }> = {},
): ProcedureRecordCorrection {
  const assembled = assembleProcedureRecordCorrection({
    client: {
      originalRecordId: record.RecordId,
      result: overrides.result ?? "PERFORMED_WITH_ADAPTATION",
      performedAt: overrides.performedAt ?? record.performedAt,
      reason: overrides.reason ?? "synthetic correction reason",
    },
    originalBinding: {
      originalRecordId: record.RecordId,
      OrganizationId: record.OrganizationId,
      SiteId: record.SiteId,
      UserId: record.UserId,
      Procedure: record.Procedure,
      planId: record.planId,
      planVersion: record.planVersion,
      originalRecordedAt: record.recordedAt,
      originalRecordedBy: record.recordedBy,
      originalLocalDate: record.LocalDate,
    },
    auth: {
      status: "AUTHORIZED",
      correctedBy: overrides.correctedBy ?? "synthetic-correction-actor-001",
    },
    nowIso: overrides.correctedAt ?? "2026-08-20T11:00:00.000Z",
    correctedAtIso: overrides.correctedAt ?? "2026-08-20T11:00:00.000Z",
  });
  assert.equal(assembled.ok, true);
  if (!assembled.ok) throw new Error("synthetic correction assembly failed");
  return assembled.correction;
}

function validSemanticsInput(overrides: Record<string, unknown> = {}) {
  const originalRecord =
    (overrides.originalRecord as ProcedureRecord | undefined) ??
    createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
  return {
    operation: "CANCEL" as const,
    targetRecordId: originalRecord.RecordId,
    originalRecord,
    reason: "required synthetic cancellation reason",
    boundRecordIds: [originalRecord.RecordId],
    lifecycleEvents: [],
    corrections: [],
    authorization: foundAuthorization({
      organizationId: originalRecord.OrganizationId,
      selectedSiteId: originalRecord.SiteId as AuthorizedSite,
    }),
    ...overrides,
  };
}

function assembleEvent(
  overrides: {
    semanticsInput?: Record<string, unknown>;
    recordedAtIso?: string;
  } = {},
) {
  return assembleProcedureRecordCancellationLifecycleEvent({
    semanticsInput: overrides.semanticsInput ?? validSemanticsInput(),
    recordedAtIso: overrides.recordedAtIso ?? FROZEN_RECORDED_AT,
  });
}

describe("CANCEL-SLICE-B lifecycle event creation", () => {
  it("locks Slice B version and keeps persistence / LIVE WRITE unauthorized", () => {
    assert.equal(PROCEDURE_RECORD_CANCELLATION_EVENT_VERSION, "1.0.0");
    assert.equal(PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED, false);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED, false);
  });

  it("creates a deterministically identifiable CANCEL lifecycle event from Slice A semantics", () => {
    const semanticsInput = validSemanticsInput();
    const first = assembleEvent({ semanticsInput, recordedAtIso: FROZEN_RECORDED_AT });
    const second = assembleEvent({ semanticsInput, recordedAtIso: FROZEN_RECORDED_AT });

    assert.equal(first.status, "CREATED");
    assert.equal(second.status, "CREATED");
    if (first.status !== "CREATED" || second.status !== "CREATED") return;

    assert.equal(first.event.eventType, "CANCEL");
    assert.equal(first.event.targetRecordId, first.semantics.targetRecordId);
    assert.equal(first.event.reason, first.semantics.reason);
    assert.equal(first.event.recordedAt, FROZEN_RECORDED_AT);
    assert.equal(first.event.recordedBy, first.semantics.frozenContext.actorSubject);
    assert.equal(first.event.replacementRecordId, undefined);

    const expected = mintLifecycleEventIdentity({
      eventType: "CANCEL",
      targetRecordId: first.event.targetRecordId,
      recordedAt: first.event.recordedAt,
      recordedBy: first.event.recordedBy,
      reason: first.event.reason,
    });
    assert.equal(first.event.LifecycleEventId, expected.LifecycleEventId);
    assert.equal(first.event.LifecycleIdempotencyKey, expected.LifecycleIdempotencyKey);
    assert.equal(first.event.LifecyclePayloadFingerprint, expected.LifecyclePayloadFingerprint);
    assert.deepEqual(first.event, second.event);
    assert.equal(
      classifyProcedureRecordCancellationLifecycleEventReplay(first.event, second.event).status,
      "REPLAY",
    );
  });

  it("same-logical retry reuses identities only when recordedAt stays frozen", () => {
    const semanticsInput = validSemanticsInput();
    const first = assembleEvent({ semanticsInput, recordedAtIso: FROZEN_RECORDED_AT });
    const drifted = assembleEvent({
      semanticsInput,
      recordedAtIso: "2026-08-20T12:00:01.000Z",
    });

    assert.equal(first.status, "CREATED");
    assert.equal(drifted.status, "CREATED");
    if (first.status !== "CREATED" || drifted.status !== "CREATED") return;

    assert.notEqual(first.event.LifecycleEventId, drifted.event.LifecycleEventId);
    assert.equal(
      classifyProcedureRecordCancellationLifecycleEventReplay(first.event, drifted.event).status,
      "REPLAY_CONFLICT",
    );
  });

  it("fail-closes unauthorized, cross-site, cross-organization, malformed, and ambiguous requests", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          authorization: foundAuthorization({ roles: ["VIEWER"] }),
        }),
      }),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          authorization: foundAuthorization({
            organizationId: record.OrganizationId,
            selectedSiteId: OTHER_SITE,
            memberships: [siteMembership(OTHER_SITE, ["SERVICE_MANAGER"])],
          }),
        }),
      }),
      { status: "INVALID", reason: "TARGET_CONTEXT_MISMATCH" },
    );

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          authorization: foundAuthorization({
            organizationId: "synthetic-other-org",
            selectedSiteId: SITE,
          }),
        }),
      }),
      { status: "INVALID", reason: "TARGET_CONTEXT_MISMATCH" },
    );

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          reason: "   ",
        }),
      }),
      { status: "INVALID", reason: "REASON_REQUIRED" },
    );

    assert.deepEqual(assembleProcedureRecordCancellationLifecycleEvent({}), {
      status: "INVALID",
      reason: "INVALID_SHAPE",
    });

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({ originalRecord: record }),
        recordedAtIso: "not-an-iso-datetime",
      }),
      { status: "INVALID", reason: "INVALID_RECORDED_AT" },
    );
  });

  it("fail-closes duplicate and invalid transitions via authoritative lifecycle resolver", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const alreadyCancelled = lifecycleEvent({
      eventType: "CANCEL",
      targetRecordId: record.RecordId,
      reason: "prior cancel",
    });

    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          lifecycleEvents: [alreadyCancelled],
        }),
      }),
      { status: "INVALID", reason: "INVALID_EFFECTIVE_STATE" },
    );

    const replacement = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
      RecordId: "synthetic-replacement-record-001",
    });
    const superseded = lifecycleEvent({
      eventType: "SUPERSEDE",
      targetRecordId: record.RecordId,
      replacementRecordId: replacement.RecordId,
    });
    assert.deepEqual(
      assembleEvent({
        semanticsInput: validSemanticsInput({
          originalRecord: record,
          boundRecordIds: [record.RecordId, replacement.RecordId],
          lifecycleEvents: [superseded],
        }),
      }),
      { status: "INVALID", reason: "TARGET_NOT_EFFECTIVE" },
    );
  });

  it("creates events only from defined cancellation semantics and preserves the original record", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const before = structuredClone(record);
    const correction = createCorrection(record);
    const semanticsInput = validSemanticsInput({
      originalRecord: record,
      corrections: [correction],
    });

    const semanticOnly = assembleProcedureRecordCancellationSemantics(semanticsInput);
    const created = assembleEvent({ semanticsInput });

    assert.equal(semanticOnly.status, "VALID");
    assert.equal(created.status, "CREATED");
    if (semanticOnly.status !== "VALID" || created.status !== "CREATED") return;

    assert.equal(created.semantics.submissionFingerprint, semanticOnly.submissionFingerprint);
    assert.equal(created.semantics.contract.lifecycleEventType, "CANCEL");
    assert.equal(created.semantics.frozenContext.projection, "CORRECTED_EFFECTIVE");
    assert.deepEqual(record, before);
    assert.equal(created.event.eventType, "CANCEL");
    assert.equal(Object.hasOwn(created.event, "replacementRecordId"), false);
  });

  it("documents that uncertain outcome must not auto-mint a second event identity", () => {
    const semanticsInput = validSemanticsInput();
    const firstAttempt = assembleEvent({
      semanticsInput,
      recordedAtIso: FROZEN_RECORDED_AT,
    });
    assert.equal(firstAttempt.status, "CREATED");
    if (firstAttempt.status !== "CREATED") return;

    // After save_outcome_unknown, callers reuse the frozen recordedAt — they must not
    // mint a second identity by advancing the clock.
    const retryAfterUnknown = assembleEvent({
      semanticsInput,
      recordedAtIso: FROZEN_RECORDED_AT,
    });
    assert.equal(retryAfterUnknown.status, "CREATED");
    if (retryAfterUnknown.status !== "CREATED") return;

    assert.deepEqual(firstAttempt.event, retryAfterUnknown.event);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED, false);

    const forbiddenSecondMint = assembleEvent({
      semanticsInput,
      recordedAtIso: "2026-08-20T12:05:00.000Z",
    });
    assert.equal(forbiddenSecondMint.status, "CREATED");
    if (forbiddenSecondMint.status !== "CREATED") return;
    assert.equal(
      classifyProcedureRecordCancellationLifecycleEventReplay(
        firstAttempt.event,
        forbiddenSecondMint.event,
      ).status,
      "REPLAY_CONFLICT",
    );
  });

  it("resolver moves to CANCELLED only after the created event is supplied authoritatively", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const created = assembleEvent({
      semanticsInput: validSemanticsInput({ originalRecord: record }),
    });
    assert.equal(created.status, "CREATED");
    if (created.status !== "CREATED") return;

    assert.deepEqual(resolveEffectiveOccurrenceState([record.RecordId], []), {
      status: "RECORDED",
      effectiveRecordId: record.RecordId,
    });
    assert.deepEqual(resolveEffectiveOccurrenceState([record.RecordId], [created.event]), {
      status: "CANCELLED",
      targetRecordId: record.RecordId,
    });
  });
});
