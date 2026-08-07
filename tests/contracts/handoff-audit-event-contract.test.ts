import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildHandoffStatusChangedAuditEventCandidate,
  HANDOFF_STATUS_CHANGED_ACTION_CODE,
  validateAuditEvent,
} from "../../src/domain";

const baseInput = {
  auditEventId: "synthetic-audit-001",
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  actorStaffId: "synthetic-planner-001",
  targetRecordId: "synthetic-handoff-001",
  currentStatus: "pending",
  targetStatus: "included",
  occurredAt: "2026-08-07T10:00:00Z",
  correlationId: "synthetic-correlation-001",
} as const;

describe("Handoff AuditEvent candidate contract", () => {
  it("builds a valid successful AuditEvent for an allowed edge", () => {
    const result = buildHandoffStatusChangedAuditEventCandidate(baseInput);
    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.event.actionCode, HANDOFF_STATUS_CHANGED_ACTION_CODE);
    assert.equal(result.event.targetType, "HandoffState");
    assert.equal(result.event.result, "success");
    assert.equal(result.event.reasonCode, "HANDOFF_PENDING_TO_INCLUDED");
    assert.equal(validateAuditEvent(result.event), true);
  });

  it("records a backward edge with the same actionCode and directional reasonCode", () => {
    const result = buildHandoffStatusChangedAuditEventCandidate({
      ...baseInput,
      currentStatus: "included",
      targetStatus: "pending",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.equal(result.event.actionCode, "HANDOFF_STATUS_CHANGED");
    assert.equal(result.event.reasonCode, "HANDOFF_INCLUDED_TO_PENDING");
  });

  it("rejects denied and malformed transitions", () => {
    assert.deepEqual(
      buildHandoffStatusChangedAuditEventCandidate({
        ...baseInput,
        targetStatus: "closed",
      }),
      { ok: false, code: "INVALID_TRANSITION" },
    );

    assert.deepEqual(
      buildHandoffStatusChangedAuditEventCandidate({
        ...baseInput,
        currentStatus: "unknown",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("rejects malformed audit metadata", () => {
    for (const override of [
      { auditEventId: "" },
      { OrganizationId: "" },
      { SiteId: "" },
      { actorStaffId: "" },
      { targetRecordId: "" },
      { occurredAt: "bad-date" },
      { correlationId: "" },
      { appVersion: "" },
      { ruleSetVersion: "" },
    ]) {
      assert.deepEqual(
        buildHandoffStatusChangedAuditEventCandidate({
          ...baseInput,
          ...override,
        }),
        { ok: false, code: "MALFORMED_INPUT" },
      );
    }
  });

  it("does not include support or meeting content fields", () => {
    const result = buildHandoffStatusChangedAuditEventCandidate(baseInput);
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const keys = Object.keys(result.event);
    assert.equal(keys.includes("supportPlan"), false);
    assert.equal(keys.includes("observation"), false);
    assert.equal(keys.includes("meetingId"), false);
    assert.equal(keys.includes("message"), false);
  });
});
