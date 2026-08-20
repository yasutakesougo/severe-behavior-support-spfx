import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AuthorizationContext, LookupResult, Role, SiteMembership } from "../../src/contracts";
import {
  mintLifecycleEventIdentity,
  type ProcedureRecordLifecycleEvent,
} from "../../src/domain/kiosk-contract";
import {
  assembleProcedureRecordCancellationSemantics,
  classifyProcedureRecordCancellationReplay,
  PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES,
  PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED,
  PROCEDURE_RECORD_CANCELLATION_SEMANTICS,
} from "../../src/domain/procedure-record-cancellation";
import {
  assembleProcedureRecordCorrection,
  orderProcedureRecordCorrections,
  type ProcedureRecordCorrection,
} from "../../src/domain/procedure-record-correction";
import type { ProcedureRecord, ProcedureRecordResult } from "../../src/domain/procedure-record";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

const ORG = "synthetic-org-001";
const SITE = "SITE-ISG" as const;
const OTHER_SITE = "SITE-HOM" as const;
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
    Partial<Pick<ProcedureRecordLifecycleEvent, "replacementRecordId" | "reason">>,
): ProcedureRecordLifecycleEvent {
  const recordedAt = "2026-08-20T10:00:00.000Z";
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
    auth: { status: "AUTHORIZED", correctedBy: overrides.correctedBy ?? "synthetic-staff-001" },
    correctedAtIso: overrides.correctedAt ?? "2026-08-20T11:00:00.000Z",
    nowIso: "2026-08-20T11:00:00.000Z",
  });
  assert.equal(assembled.ok, true);
  if (!assembled.ok) throw new Error("synthetic correction assembly failed");
  return assembled.correction;
}

function validInput(overrides: Record<string, unknown> = {}) {
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

describe("CANCEL-SLICE-A P1 remediation", () => {
  it("locks the remediation contract and Human-selected roles", () => {
    assert.equal(PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED, false);
    assert.deepEqual(PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES, ["SUPPORTER", "SERVICE_MANAGER"]);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_SEMANTICS.target, "CURRENT_EFFECTIVE_RECORDED_ONLY");
    assert.equal(
      PROCEDURE_RECORD_CANCELLATION_SEMANTICS.effectiveStateAuthority,
      "OCCURRENCE_BINDING_AND_LIFECYCLE_RESOLVER",
    );
    assert.equal(
      PROCEDURE_RECORD_CANCELLATION_SEMANTICS.rolePolicy,
      "SUPPORTER_OR_SERVICE_MANAGER_ONLY",
    );
    assert.equal(
      PROCEDURE_RECORD_CANCELLATION_SEMANTICS.corrected,
      "EFFECTIVE_CORRECTED_PROJECTION_ONLY",
    );
    assert.equal(
      PROCEDURE_RECORD_CANCELLATION_SEMANTICS.replay,
      "EXACT_FROZEN_CONTEXT_REPLAY_OR_CONFLICT",
    );
  });

  it("allows only SUPPORTER and SERVICE_MANAGER through explicit membership", () => {
    for (const role of ["SUPPORTER", "SERVICE_MANAGER"] as const) {
      const result = assembleProcedureRecordCancellationSemantics(
        validInput({ authorization: foundAuthorization({ roles: [role] }) }),
      );
      assert.equal(result.status, "VALID");
    }

    for (const role of ["PLANNER", "SITE_ADMIN", "ORG_ADMIN", "SYSTEM_ADMIN", "VIEWER"] as const) {
      assert.deepEqual(
        assembleProcedureRecordCancellationSemantics(
          validInput({ authorization: foundAuthorization({ roles: [role] }) }),
        ),
        { status: "INVALID", reason: "UNAUTHORIZED" },
      );
    }

    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          authorization: foundAuthorization({
            roles: ["UNLISTED_ROLE" as unknown as Role],
          }),
        }),
      ),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );
  });

  it("derives effective eligibility from the authoritative occurrence resolver", () => {
    const original = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
      RecordId: "synthetic-record-original",
    });
    const replacement = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
      RecordId: "synthetic-record-replacement",
    });
    const supersede = lifecycleEvent({
      eventType: "SUPERSEDE",
      targetRecordId: original.RecordId,
      replacementRecordId: replacement.RecordId,
    });

    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          originalRecord: original,
          boundRecordIds: [original.RecordId, replacement.RecordId],
          lifecycleEvents: [supersede],
        }),
      ),
      { status: "INVALID", reason: "TARGET_NOT_EFFECTIVE" },
    );

    const accepted = assembleProcedureRecordCancellationSemantics(
      validInput({
        originalRecord: replacement,
        boundRecordIds: [original.RecordId, replacement.RecordId],
        lifecycleEvents: [supersede],
      }),
    );
    assert.equal(accepted.status, "VALID");

    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(validInput({ boundRecordIds: [] })),
      { status: "INVALID", reason: "INVALID_EFFECTIVE_STATE" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          lifecycleEvents: [
            lifecycleEvent({
              eventType: "CANCEL",
              targetRecordId: "synthetic-procedure-record-001",
            }),
          ],
        }),
      ),
      { status: "INVALID", reason: "INVALID_EFFECTIVE_STATE" },
    );

    const conflicting = lifecycleEvent({
      eventType: "SUPERSEDE",
      targetRecordId: original.RecordId,
      replacementRecordId: "synthetic-record-other-replacement",
    });
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          originalRecord: original,
          boundRecordIds: [original.RecordId, replacement.RecordId],
          lifecycleEvents: [supersede, conflicting],
        }),
      ),
      { status: "INVALID", reason: "INVALID_EFFECTIVE_STATE" },
    );

    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          effectiveState: "RECORDED",
          occurrence: "CURRENT",
          lineage: "CURRENT",
        }),
      ),
      { status: "INVALID", reason: "UNSUPPORTED_MUTATION_FIELD" },
    );
  });

  it("rejects unbound and malformed authoritative inputs fail-closed", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ originalRecord: record, boundRecordIds: ["other-record"] }),
      ),
      { status: "INVALID", reason: "TARGET_NOT_BOUND" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ lifecycleEvents: [{} as ProcedureRecordLifecycleEvent] }),
      ),
      { status: "INVALID", reason: "INVALID_EFFECTIVE_STATE" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ authorization: { status: "UNKNOWN", reason: "INDETERMINATE" } }),
      ),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );
  });

  it("requires a non-blank reason and never trusts whitespace-only input", () => {
    assert.deepEqual(assembleProcedureRecordCancellationSemantics(validInput({ reason: "" })), {
      status: "INVALID",
      reason: "REASON_REQUIRED",
    });
    assert.deepEqual(assembleProcedureRecordCancellationSemantics(validInput({ reason: "   " })), {
      status: "INVALID",
      reason: "REASON_REQUIRED",
    });
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(validInput({ reason: " padded " })),
      { status: "INVALID", reason: "REASON_REQUIRED" },
    );
  });

  it("fails closed on missing selected site, missing membership, and org/site mismatch", () => {
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          authorization: foundAuthorization({
            selectedSiteId: null,
            memberships: [siteMembership(SITE, ["SERVICE_MANAGER"])],
          }),
        }),
      ),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          authorization: foundAuthorization({
            selectedSiteId: SITE,
            memberships: [siteMembership(OTHER_SITE, ["SERVICE_MANAGER"])],
          }),
        }),
      ),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          authorization: foundAuthorization({
            organizationId: "other-org",
            selectedSiteId: SITE,
          }),
        }),
      ),
      { status: "INVALID", reason: "TARGET_CONTEXT_MISMATCH" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          authorization: foundAuthorization({
            selectedSiteId: OTHER_SITE,
            memberships: [siteMembership(OTHER_SITE, ["SERVICE_MANAGER"])],
          }),
        }),
      ),
      { status: "INVALID", reason: "TARGET_CONTEXT_MISMATCH" },
    );
  });

  it("never treats CorrectionId as a lifecycle cancellation target", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const correction = createCorrection(record);
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({
          originalRecord: record,
          targetRecordId: correction.CorrectionId,
          boundRecordIds: [correction.CorrectionId],
          corrections: [correction],
        }),
      ),
      { status: "INVALID", reason: "TARGET_NOT_BOUND" },
    );
  });

  it("resolves and validates the actual append-only correction collection", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const correction = createCorrection(record);
    const accepted = assembleProcedureRecordCancellationSemantics(
      validInput({ corrections: [correction] }),
    );
    assert.equal(accepted.status, "VALID");
    if (accepted.status !== "VALID") return;
    assert.equal(accepted.frozenContext.projection, "CORRECTED_EFFECTIVE");
    assert.equal(accepted.frozenContext.correction?.CorrectionId, correction.CorrectionId);
    assert.equal(accepted.frozenContext.correctionOriginalRecordId, record.RecordId);

    const later = createCorrection(record, {
      reason: "later synthetic correction",
      correctedAt: "2026-08-20T12:00:00.000Z",
    });
    const latest = assembleProcedureRecordCancellationSemantics(
      validInput({ corrections: [later, correction] }),
    );
    assert.equal(latest.status, "VALID");
    if (latest.status !== "VALID") return;
    assert.equal(latest.frozenContext.correction?.CorrectionId, later.CorrectionId);

    const sameTimeFirst = createCorrection(record, {
      reason: "same timestamp first",
      correctedAt: "2026-08-20T13:00:00.000Z",
    });
    const sameTimeSecond = createCorrection(record, {
      reason: "same timestamp second",
      result: "NOT_PERFORMED",
      correctedAt: "2026-08-20T13:00:00.000Z",
    });
    const expectedLatest = orderProcedureRecordCorrections([sameTimeFirst, sameTimeSecond]).at(-1);
    const sameTime = assembleProcedureRecordCancellationSemantics(
      validInput({ corrections: [sameTimeSecond, sameTimeFirst] }),
    );
    assert.equal(sameTime.status, "VALID");
    if (sameTime.status !== "VALID" || expectedLatest === undefined) return;
    assert.equal(sameTime.frozenContext.correction?.CorrectionId, expectedLatest.CorrectionId);

    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ corrections: [{ ...correction, result: "INVALID" } as never] }),
      ),
      { status: "INVALID", reason: "CORRECTION_INVALID" },
    );
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ corrections: [correction, correction] }),
      ),
      { status: "INVALID", reason: "CORRECTION_CONFLICT" },
    );

    const otherContextRecord = createSyntheticProcedureRecord({
      OrganizationId: "other-org",
      SiteId: SITE,
      RecordId: record.RecordId,
    });
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics(
        validInput({ corrections: [createCorrection(otherContextRecord)] }),
      ),
      { status: "INVALID", reason: "CORRECTION_TARGET_MISMATCH" },
    );
  });

  it("freezes actor, target, reason, organization, site, selection, and projection for replay", () => {
    const first = assembleProcedureRecordCancellationSemantics(validInput());
    const same = assembleProcedureRecordCancellationSemantics(validInput());
    assert.equal(first.status, "VALID");
    assert.equal(same.status, "VALID");
    if (first.status !== "VALID" || same.status !== "VALID") return;
    assert.deepEqual(classifyProcedureRecordCancellationReplay(first, same), {
      status: "REPLAY",
      submissionFingerprint: first.submissionFingerprint,
    });

    const changedReason = assembleProcedureRecordCancellationSemantics(
      validInput({ reason: "changed frozen reason" }),
    );
    const changedActor = assembleProcedureRecordCancellationSemantics(
      validInput({ authorization: foundAuthorization({ subject: "different-actor" }) }),
    );
    const changedTargetRecord = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
      RecordId: "synthetic-record-different-target",
    });
    const changedTarget = assembleProcedureRecordCancellationSemantics(
      validInput({ originalRecord: changedTargetRecord }),
    );
    const changedSiteRecord = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: OTHER_SITE,
      RecordId: "synthetic-record-different-site",
    });
    const changedSite = assembleProcedureRecordCancellationSemantics(
      validInput({
        originalRecord: changedSiteRecord,
        authorization: foundAuthorization({
          selectedSiteId: OTHER_SITE,
          memberships: [siteMembership(OTHER_SITE, ["SERVICE_MANAGER"])],
        }),
      }),
    );
    const changedOrganizationRecord = createSyntheticProcedureRecord({
      OrganizationId: "other-org",
      SiteId: SITE,
      RecordId: "synthetic-record-different-organization",
    });
    const changedOrganization = assembleProcedureRecordCancellationSemantics(
      validInput({
        originalRecord: changedOrganizationRecord,
        authorization: foundAuthorization({ organizationId: "other-org" }),
      }),
    );
    const changedProjection = assembleProcedureRecordCancellationSemantics(
      validInput({
        corrections: [
          createCorrection(createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE })),
        ],
      }),
    );

    for (const changed of [
      changedReason,
      changedActor,
      changedTarget,
      changedSite,
      changedOrganization,
      changedProjection,
    ]) {
      assert.equal(changed.status, "VALID");
      if (changed.status !== "VALID") continue;
      assert.equal(
        classifyProcedureRecordCancellationReplay(first, changed).status,
        "REPLAY_CONFLICT",
      );
    }
  });

  it("keeps cancellation semantic-only and preserves the original record", () => {
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const before = structuredClone(record);
    const result = assembleProcedureRecordCancellationSemantics(
      validInput({ originalRecord: record }),
    );
    assert.equal(result.status, "VALID");
    assert.deepEqual(record, before);
    if (result.status !== "VALID") return;
    assert.equal(result.lifecycleEventType, "CANCEL");
    assert.equal(result.contract.storage, "APPEND_ONLY_LIFECYCLE_EVENT");
    assert.equal(result.contract.replacementRecordId, "FORBIDDEN");
  });
});
