import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mutateHandoffState, validateHandoffState, type HandoffState } from "../../src/domain";

const pending: HandoffState = { status: "pending", requestedAt: "2026-08-07T09:00:00Z", requestedBy: "synthetic-planner-001" };
const included: HandoffState = { status: "included", requestedAt: "2026-08-07T09:00:00Z", requestedBy: "synthetic-planner-001", meetingId: "synthetic-meeting-001", includedAt: "2026-08-07T10:00:00Z", includedBy: "synthetic-planner-002" };
const acknowledged: HandoffState = { status: "acknowledged", requestedAt: "2026-08-07T09:00:00Z", requestedBy: "synthetic-planner-001", meetingId: "synthetic-meeting-001", includedAt: "2026-08-07T10:00:00Z", includedBy: "synthetic-planner-002", acknowledgedAt: "2026-08-07T11:00:00Z", acknowledgedBy: "synthetic-planner-003" };

describe("Handoff state mutation contract", () => {
  it("builds valid forward states", () => {
    const first = mutateHandoffState({ currentState: { status: "not_required" }, targetStatus: "pending", occurredAt: "2026-08-07T09:00:00Z", actorId: "synthetic-planner-001" });
    assert.deepEqual(first, { ok: true, state: pending });

    const second = mutateHandoffState({ currentState: pending, targetStatus: "included", occurredAt: "2026-08-07T10:00:00Z", actorId: "synthetic-planner-002", meetingId: "synthetic-meeting-001" });
    assert.deepEqual(second, { ok: true, state: included });

    const third = mutateHandoffState({ currentState: included, targetStatus: "acknowledged", occurredAt: "2026-08-07T11:00:00Z", actorId: "synthetic-planner-003" });
    assert.deepEqual(third, { ok: true, state: acknowledged });

    const fourth = mutateHandoffState({ currentState: acknowledged, targetStatus: "closed", occurredAt: "2026-08-07T12:00:00Z", actorId: "synthetic-service-manager-001" });
    assert.equal(fourth.ok, true);
    if (fourth.ok) assert.equal(validateHandoffState(fourth.state), true);
  });

  it("clears later fields on backward transitions", () => {
    assert.deepEqual(mutateHandoffState({ currentState: pending, targetStatus: "not_required", occurredAt: "2026-08-07T10:00:00Z", actorId: "synthetic-planner-001" }), { ok: true, state: { status: "not_required" } });
    assert.deepEqual(mutateHandoffState({ currentState: included, targetStatus: "pending", occurredAt: "2026-08-07T11:00:00Z", actorId: "synthetic-planner-001" }), { ok: true, state: pending });
    assert.deepEqual(mutateHandoffState({ currentState: acknowledged, targetStatus: "included", occurredAt: "2026-08-07T12:00:00Z", actorId: "synthetic-planner-001" }), { ok: true, state: included });
  });

  it("fails closed for invalid metadata, meetingId and chronology", () => {
    assert.deepEqual(mutateHandoffState({ currentState: pending, targetStatus: "included", occurredAt: "2026-08-07T10:00:00Z", actorId: "synthetic-planner-002" }), { ok: false, code: "MEETING_ID_REQUIRED" });
    assert.deepEqual(mutateHandoffState({ currentState: included, targetStatus: "acknowledged", occurredAt: "2026-08-07T11:00:00Z", actorId: "synthetic-planner-003", meetingId: "unexpected" }), { ok: false, code: "UNEXPECTED_MEETING_ID" });
    assert.deepEqual(mutateHandoffState({ currentState: pending, targetStatus: "included", occurredAt: "2026-08-07T08:59:59Z", actorId: "synthetic-planner-002", meetingId: "synthetic-meeting-001" }), { ok: false, code: "TIMESTAMP_REGRESSION" });
    assert.deepEqual(mutateHandoffState({ currentState: pending, targetStatus: "closed", occurredAt: "2026-08-07T12:00:00Z", actorId: "synthetic-service-manager-001" }), { ok: false, code: "INVALID_TRANSITION" });
    assert.deepEqual(mutateHandoffState({ currentState: { status: "pending" }, targetStatus: "included", occurredAt: "bad-date", actorId: "" }), { ok: false, code: "MALFORMED_INPUT" });
  });
});
