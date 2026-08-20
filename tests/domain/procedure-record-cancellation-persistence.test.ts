import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AuthorizationContext, LookupResult, Role, SiteMembership } from "../../src/contracts";
import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  createLiveWriteHoldProcedureRecordCancellationStoragePort,
  persistProcedureRecordCancellation,
  PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED,
  PROCEDURE_RECORD_CANCELLATION_SAVE_OUTCOMES,
} from "../../src/domain/procedure-record-cancellation-persistence";
import { PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED } from "../../src/domain/procedure-record-cancellation";
import { PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED } from "../../src/domain/procedure-record-cancellation-event";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";

const ORG = "synthetic-org-001";
const SITE = "SITE-ISG" as const;
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

describe("CANCEL-SLICE-C persistence port / fake", () => {
  it("locks save outcomes and keeps LIVE WRITE / SharePoint unauthorized", () => {
    assert.deepEqual([...PROCEDURE_RECORD_CANCELLATION_SAVE_OUTCOMES], [
      "saved",
      "save_failed",
      "save_outcome_unknown",
    ]);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_PERSISTENCE_LIVE_WRITE_AUTHORIZED, false);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_LIVE_WRITE_AUTHORIZED, false);
    assert.equal(PROCEDURE_RECORD_CANCELLATION_EVENT_PERSISTENCE_AUTHORIZED, false);
  });

  it("appends a CANCEL lifecycle event through the in-memory fake and returns saved", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const record = createSyntheticProcedureRecord({ OrganizationId: ORG, SiteId: SITE });
    const result = await port.submitCancellation({
      semanticsInput: validSemanticsInput({ originalRecord: record }),
      recordedAtIso: FROZEN_RECORDED_AT,
    });

    assert.equal(result.saveState, "saved");
    assert.equal(result.appendCalled, true);
    assert.ok(result.event);
    assert.equal(result.event?.eventType, "CANCEL");
    assert.equal(result.event?.recordedBy, "synthetic-user-001");
    assert.equal(result.event?.replacementRecordId, undefined);
    assert.equal(port.storage.appendCalls, 1);
    assert.equal(port.liveWriteAuthorized, false);

    const listed = await port.listCancellations(record.RecordId);
    assert.equal(listed.events.length, 1);
    assert.equal(listed.events[0]?.LifecycleEventId, result.event?.LifecycleEventId);
  });

  it("replays the same frozen identity without a second append", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const request = {
      semanticsInput: validSemanticsInput(),
      recordedAtIso: FROZEN_RECORDED_AT,
    };

    const first = await port.submitCancellation(request);
    const second = await port.submitCancellation(request);

    assert.equal(first.saveState, "saved");
    assert.equal(second.saveState, "saved");
    assert.equal(first.appendCalled, true);
    assert.equal(second.appendCalled, false);
    assert.deepEqual(first.event, second.event);
    assert.equal(port.storage.appendCalls, 1);
  });

  it("maps definite append failure to save_failed", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort({
      appendMode: "definite_failure",
    });
    const result = await port.submitCancellation({
      semanticsInput: validSemanticsInput(),
      recordedAtIso: FROZEN_RECORDED_AT,
    });

    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, true);
    assert.ok(result.event);
    assert.equal(port.storage.appendCalls, 1);
    assert.equal(port.storage.byLifecycleEventId.size, 0);
  });

  it("maps indeterminate append without committed row to save_outcome_unknown without minting a new identity", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort({
      appendMode: "indeterminate",
    });
    const request = {
      semanticsInput: validSemanticsInput(),
      recordedAtIso: FROZEN_RECORDED_AT,
    };

    const first = await port.submitCancellation(request);
    const second = await port.submitCancellation(request);

    assert.equal(first.saveState, "save_outcome_unknown");
    assert.equal(second.saveState, "save_outcome_unknown");
    assert.deepEqual(first.event, second.event);
    assert.equal(port.storage.byLifecycleEventId.size, 0);
  });

  it("reconciles indeterminate append to saved when the row later appears, without a new identity", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort({
      appendMode: "indeterminate",
    });
    const request = {
      semanticsInput: validSemanticsInput(),
      recordedAtIso: FROZEN_RECORDED_AT,
    };

    const first = await port.submitCancellation(request);
    assert.equal(first.saveState, "save_outcome_unknown");
    assert.ok(first.event);

    port.storage.byLifecycleEventId.set(
      first.event.LifecycleEventId,
      structuredClone(first.event),
    );
    port.storage.byLifecycleIdempotencyKey.set(
      first.event.LifecycleIdempotencyKey,
      structuredClone(first.event),
    );

    const reconciled = await port.submitCancellation(request);
    assert.equal(reconciled.saveState, "saved");
    assert.equal(reconciled.appendCalled, false);
    assert.deepEqual(reconciled.event, first.event);
  });

  it("keeps save_failed and save_outcome_unknown distinguishable on the LIVE WRITE HOLD port", async () => {
    const hold = createLiveWriteHoldProcedureRecordCancellationStoragePort();
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    // Use hold storage via direct persist after assembling through submit path helper:
    const assembled = await port.submitCancellation({
      semanticsInput: validSemanticsInput(),
      recordedAtIso: FROZEN_RECORDED_AT,
    });
    assert.equal(assembled.saveState, "saved");
    assert.ok(assembled.event);

    const holdResult = await persistProcedureRecordCancellation(assembled.event, hold);
    assert.equal(holdResult.saveState, "save_failed");
    assert.equal(holdResult.appendCalled, true);

    const unavailable = createInMemoryProcedureRecordCancellationPersistencePort();
    unavailable.storage.findByLifecycleEventId = async () => ({
      status: "UNKNOWN",
      reason: "INDETERMINATE",
    });
    unavailable.storage.findByLifecycleIdempotencyKey = async () => ({
      status: "UNKNOWN",
      reason: "INDETERMINATE",
    });
    const unknown = await unavailable.submitCancellation({
      semanticsInput: validSemanticsInput({
        originalRecord: createSyntheticProcedureRecord({
          OrganizationId: ORG,
          SiteId: SITE,
          RecordId: "synthetic-procedure-record-unknown-001",
        }),
      }),
      recordedAtIso: FROZEN_RECORDED_AT,
    });
    assert.equal(unknown.saveState, "save_outcome_unknown");
    assert.equal(unknown.appendCalled, false);
    assert.notEqual(holdResult.saveState, unknown.saveState);
  });

  it("fail-closes invalid semantic assembly without calling append", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await port.submitCancellation({
      semanticsInput: validSemanticsInput({ reason: "   " }),
      recordedAtIso: FROZEN_RECORDED_AT,
    });

    assert.equal(result.saveState, "save_failed");
    assert.equal(result.event, null);
    assert.equal(result.appendCalled, false);
    assert.equal(port.storage.appendCalls, 0);
  });

  it("does not expose update/delete and does not import SharePoint", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const storage = port.storage as unknown as Record<string, unknown>;
    assert.equal("update" in storage, false);
    assert.equal("delete" in storage, false);
    assert.equal("createItem" in storage, false);

    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(
        new URL("../../src/domain/procedure-record-cancellation-persistence.ts", import.meta.url),
        "utf8",
      ),
    );
    assert.equal(/^import .*sharepoint/im.test(source), false);
    assert.equal(/^import .*@microsoft/im.test(source), false);
    assert.equal(/from ["'][^"']*sharepoint/i.test(source), false);
  });
});
