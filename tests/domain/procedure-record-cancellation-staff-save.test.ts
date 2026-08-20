import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assembleProcedureRecordCancellationSemantics,
  PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES,
} from "../../src/domain/procedure-record-cancellation";
import {
  buildProcedureRecordCancellationSubmitRequest,
  createInMemoryProcedureRecordCancellationPersistencePort,
  persistStaffProcedureRecordCancellation,
  resubmitFrozenProcedureRecordCancellation,
} from "../../src/domain/procedure-record-cancellation-staff-save";
import type { AuthorizationContext, LookupResult, Role, SiteMembership } from "../../src/contracts";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

const ORG = "synthetic-org-001";
const SITE = "SITE-ISG" as const;
const FROZEN_RECORDED_AT = "2026-08-20T12:00:00.000Z";

function siteMembership(siteId: typeof SITE, roles: readonly Role[]): SiteMembership {
  return { SiteId: siteId, Roles: roles };
}

function foundAuthorization(
  roles: readonly Role[] = ["SERVICE_MANAGER"],
): LookupResult<AuthorizationContext> {
  return {
    status: "FOUND",
    value: {
      Subject: "synthetic-cancellation-subject-001",
      UserId: "synthetic-user-001",
      OrganizationId: ORG,
      SiteContext: {
        Memberships: [siteMembership(SITE, roles)],
        SelectedSiteId: SITE,
      },
    },
  };
}

describe("CANCEL-SLICE-D staff-save mapping", () => {
  it("submits through Slice C fake and returns saved + event", async () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
      UserId: "user-a",
    });
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        targetRecordId: record.RecordId,
        originalRecord: record,
        reason: "体調不良のため中止",
        boundRecordIds: [record.RecordId],
        lifecycleEvents: [],
        corrections: [],
        authorization: foundAuthorization(),
        recordedAtIso: FROZEN_RECORDED_AT,
      },
      port,
    );
    assert.equal(result.saveState, "saved");
    assert.ok(result.event);
    assert.equal(result.event?.eventType, "CANCEL");
    assert.equal(result.event?.targetRecordId, record.RecordId);
    assert.deepEqual(PROCEDURE_RECORD_CANCELLATION_ALLOWED_ROLES, ["SUPPORTER", "SERVICE_MANAGER"]);
  });

  it("maps definite append failure to save_failed without append success semantics", async () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
    });
    const port = createInMemoryProcedureRecordCancellationPersistencePort({
      appendMode: "definite_failure",
    });
    const input = {
      targetRecordId: record.RecordId,
      originalRecord: record,
      reason: "失敗確認",
      boundRecordIds: [record.RecordId],
      lifecycleEvents: [],
      corrections: [],
      authorization: foundAuthorization(),
      recordedAtIso: FROZEN_RECORDED_AT,
    };
    const result = await persistStaffProcedureRecordCancellation(input, port);
    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, true);
    assert.ok(result.event);
    assert.equal(result.request.recordedAtIso, FROZEN_RECORDED_AT);
    assert.equal(port.storage.byLifecycleEventId.size, 0);
    // Retry must reuse the same frozen recordedAtIso (no new identity clock).
    const retry = await persistStaffProcedureRecordCancellation(
      { ...input, recordedAtIso: result.request.recordedAtIso },
      createInMemoryProcedureRecordCancellationPersistencePort(),
    );
    assert.equal(retry.request.recordedAtIso, FROZEN_RECORDED_AT);
    assert.equal(retry.event?.LifecycleEventId, result.event?.LifecycleEventId);
  });

  it("fail-closes when Slice A rejects unauthorized role — no append", async () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
    });
    const authorization = foundAuthorization(["VIEWER"]);
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics({
        operation: "CANCEL",
        targetRecordId: record.RecordId,
        originalRecord: record,
        reason: "権限なし",
        boundRecordIds: [record.RecordId],
        lifecycleEvents: [],
        corrections: [],
        authorization,
      }),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );

    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        targetRecordId: record.RecordId,
        originalRecord: record,
        reason: "権限なし",
        boundRecordIds: [record.RecordId],
        lifecycleEvents: [],
        corrections: [],
        authorization,
        recordedAtIso: FROZEN_RECORDED_AT,
      },
      port,
    );
    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(result.event, null);
    assert.equal(port.storage.appendCalls, 0);
  });

  it("fail-closes when authorization LookupResult is UNKNOWN — no append", async () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
    });
    const authorization: LookupResult<AuthorizationContext> = {
      status: "UNKNOWN",
      reason: "INDETERMINATE",
    };
    assert.deepEqual(
      assembleProcedureRecordCancellationSemantics({
        operation: "CANCEL",
        targetRecordId: record.RecordId,
        originalRecord: record,
        reason: "判定不能",
        boundRecordIds: [record.RecordId],
        lifecycleEvents: [],
        corrections: [],
        authorization,
      }),
      { status: "INVALID", reason: "UNAUTHORIZED" },
    );

    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        targetRecordId: record.RecordId,
        originalRecord: record,
        reason: "判定不能",
        boundRecordIds: [record.RecordId],
        lifecycleEvents: [],
        corrections: [],
        authorization,
        recordedAtIso: FROZEN_RECORDED_AT,
      },
      port,
    );
    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(result.event, null);
    assert.equal(port.storage.appendCalls, 0);
  });

  it("reuses frozen request on outcome confirm without new identity", async () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
    });
    const port = createInMemoryProcedureRecordCancellationPersistencePort({
      appendMode: "indeterminate",
    });
    const input = {
      targetRecordId: record.RecordId,
      originalRecord: record,
      reason: "確認用",
      boundRecordIds: [record.RecordId],
      lifecycleEvents: [],
      corrections: [],
      authorization: foundAuthorization(["SUPPORTER"]),
      recordedAtIso: "2026-08-20T12:30:00.000Z",
    };
    const first = await persistStaffProcedureRecordCancellation(input, port);
    assert.equal(first.saveState, "save_outcome_unknown");
    assert.ok(first.event);
    port.storage.appendMode = "created";
    port.storage.byLifecycleEventId.set(first.event!.LifecycleEventId, first.event!);
    port.storage.byLifecycleIdempotencyKey.set(first.event!.LifecycleIdempotencyKey, first.event!);
    const second = await resubmitFrozenProcedureRecordCancellation(first.request, port);
    assert.equal(second.saveState, "saved");
    assert.equal(second.event?.LifecycleEventId, first.event?.LifecycleEventId);
  });

  it("builds semanticsInput that Slice A accepts", () => {
    const record = createSyntheticProcedureRecord({
      OrganizationId: ORG,
      SiteId: SITE,
    });
    const request = buildProcedureRecordCancellationSubmitRequest({
      targetRecordId: record.RecordId,
      originalRecord: record,
      reason: "理由",
      boundRecordIds: [record.RecordId],
      lifecycleEvents: [],
      corrections: [],
      authorization: foundAuthorization(),
      recordedAtIso: "2026-08-20T13:00:00.000Z",
    });
    const semantics = assembleProcedureRecordCancellationSemantics(request.semanticsInput);
    assert.equal(semantics.status, "VALID");
  });
});
