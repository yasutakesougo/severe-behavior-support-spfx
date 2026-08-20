import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AuthorizationContext, LookupResult, Role, SiteMembership } from "../../src/contracts";
import type { ProcedureRecord } from "../../src/domain/procedure-record";
import { createSyntheticProcedureRecord } from "./procedure-record-fixtures";
import {
  createInMemoryProcedureRecordCancellationPersistencePort,
  persistStaffProcedureRecordCancellation,
} from "../../src/domain/procedure-record-cancellation-staff-save";

const ORG = "synthetic-org-001";
const SITE = "SITE-ISG" as const;
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

describe("procedure-record-cancellation-staff-save", () => {
  it("submits cancellation with nowIso when recordedAtIso is omitted", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        semanticsInput: validSemanticsInput(),
        nowIso: "2026-08-20T12:00:00.000Z",
      },
      port,
    );

    assert.equal(result.saveState, "saved");
    assert.equal(result.appendCalled, true);
    assert.equal(result.event?.recordedAt, "2026-08-20T12:00:00.000Z");
  });

  it("fails closed when recordedAt is invalid", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        semanticsInput: validSemanticsInput(),
        recordedAtIso: "invalid",
        nowIso: "also-invalid",
      },
      port,
    );

    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(result.event, null);
  });

  it("replays with frozen recordedAt without second append", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const input = {
      semanticsInput: validSemanticsInput(),
      recordedAtIso: "2026-08-20T13:00:00.000Z",
      nowIso: "2026-08-20T13:00:00.000Z",
    };

    const first = await persistStaffProcedureRecordCancellation(input, port);
    const second = await persistStaffProcedureRecordCancellation(input, port);

    assert.equal(first.saveState, "saved");
    assert.equal(second.saveState, "saved");
    assert.equal(port.storage.appendCalls, 1);
    assert.deepEqual(first.event, second.event);
  });

  it("keeps reason unchanged (trim-only difference remains invalid)", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellation(
      {
        semanticsInput: validSemanticsInput({ reason: " padded " }),
        recordedAtIso: "2026-08-20T13:30:00.000Z",
        nowIso: "2026-08-20T13:30:00.000Z",
      },
      port,
    );

    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(result.event, null);
  });
});
