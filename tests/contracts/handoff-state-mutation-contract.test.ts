import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mutateHandoffState,
  validateHandoffState,
  type HandoffState,
} from "../../src/domain";

const pending: HandoffState = {
  status: "pending",
  requestedAt: "2026-08-07T09:00:00Z",
  requestedBy: "synthetic-planner-001",
};

const included: HandoffState = {
  status: "included",
  requestedAt: "2026-08-07T09:00:00Z",
  requestedBy: "synthetic-planner-001",
  meetingId: "synthetic-meeting-001",
  includedAt: "2026-08-07T10:00:00Z",
  includedBy: "synthetic-planner-002",
};

const acknowledged: HandoffState = {
  status: "acknowledged",
  requestedAt: "2026-08-07T09:00:00Z",
  requestedBy: "synthetic-planner-001",
  meetingId: "synthetic-meeting-001",
  includedAt: "2026-08-07T10:00:00Z",
  includedBy: "synthetic-planner-002",
  acknowledgedAt: "2026-08-07T11:00:00Z",
  acknowledgedBy: "synthetic-planner-003",
};

describe("Handoff state mutation contract", () => {
  it("creates pending from not_required using current action metadata", () => {
    const result = mutateHandoffState({
      currentState: { status: "not_required" },
      targetStatus: "pending",
      occurredAt: "2026-08-07T09:00:00Z",
      actorId: "synthetic-planner-001",
    });

    assert.deepEqual(result, {
      ok: true,
      state: {
        status: "pending",
        requestedAt: "2026-08-07T09:00:00Z",
        requestedBy: "synthetic-planner-001",
      },
    });
    assert.equal(result.ok && validateHandoffState(result.state), true);
  });

  it("requires meetingId when moving pending to included", () => {
    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "included",
        occurredAt: "2026-08-07T10:00:00Z",
        actorId: "synthetic-planner-002",
      }),
      { ok: false, code: "MEETING_ID_REQUIRED" }
    );
  });

  it("creates included while preserving request metadata", () => {
    const result = mutateHandoffState({
      currentState: pending,
      targetStatus: "included",
      occurredAt: "2026-08-07T10:00:00Z",
      actorId: "synthetic-planner-002",
      meetingId: "synthetic-meeting-001",
    });

    assert.deepEqual(result, { ok: true, state: included });
    assert.equal(result.ok && validateHandoffState(result.state), true);
  });

  it("creates acknowledged and closed with monotonic timestamps", () => {
    const ackResult = mutateHandoffState({
      currentState: included,
      targetStatus: "acknowledged",
      occurredAt: "2026-08-07T11:00:00Z",
      actorId: "synthetic-planner-003",
    });
    assert.deepEqual(ackResult, { ok: true, state: acknowledged });

    const closedResult = mutateHandoffState({
      currentState: acknowledged,
      targetStatus: "closed",
      occurredAt: "2026-08-07T12:00:00Z",
      actorId: "synthetic-service-manager-001",
    });
    assert.equal(closedResult.ok, true);
    if (!closedResult.ok) return;
    assert.deepEqual(closedResult.state, {
      ...acknowledged,
      status: "closed",
      closedAt: "2026-08-07T12:00:00Z",
      closedBy: "synthetic-service-manager-001",
    });
    assert.equal(validateHandoffState(closedResult.state), true);
  });

  it("clears later fields when moving backward", () => {
    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "not_required",
        occurredAt: "2026-08-07T10:00:00Z",
        actorId: "synthetic-planner-001",
      }),
      { ok: true, state: { status: "not_required" } }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: included,
        targetStatus: "pending",
        occurredAt: "2026-08-07T11:00:00Z",
        actorId: "synthetic-planner-001",
      }),
      { ok: true, state: pending }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: acknowledged,
        targetStatus: "included",
        occurredAt: "2026-08-07T12:00:00Z",
        actorId: "synthetic-planner-001",
      }),
      { ok: true, state: included }
    );
  });

  it("rejects timestamp regression on forward transitions", () => {
    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "included",
        occurredAt: "2026-08-07T08:59:59Z",
        actorId: "synthetic-planner-002",
        meetingId: "synthetic-meeting-001",
      }),
      { ok: false, code: "TIMESTAMP_REGRESSION" }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: acknowledged,
        targetStatus: "closed",
        occurredAt: "2026-08-07T10:59:59Z",
        actorId: "synthetic-service-manager-001",
      }),
      { ok: false, code: "TIMESTAMP_REGRESSION" }
    );
  });

  it("rejects unexpected meetingId and malformed action metadata", () => {
    assert.deepEqual(
      mutateHandoffState({
        currentState: included,
        targetStatus: "acknowledged",
        occurredAt: "2026-08-07T11:00:00Z",
        actorId: "synthetic-planner-003",
        meetingId: "synthetic-meeting-002",
      }),
      { ok: false, code: "UNEXPECTED_MEETING_ID" }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "included",
        occurredAt: "bad-date",
        actorId: "synthetic-planner-002",
        meetingId: "synthetic-meeting-001",
      }),
      { ok: false, code: "MALFORMED_INPUT" }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "included",
        occurredAt: "2026-08-07T10:00:00Z",
        actorId: "   ",
        meetingId: "synthetic-meeting-001",
      }),
      { ok: false, code: "MALFORMED_INPUT" }
    );
  });

  it("rejects invalid current state and denied edges", () => {
    assert.deepEqual(
      mutateHandoffState({
        currentState: { status: "pending" },
        targetStatus: "included",
        occurredAt: "2026-08-07T10:00:00Z",
        actorId: "synthetic-planner-002",
        meetingId: "synthetic-meeting-001",
      }),
      { ok: false, code: "MALFORMED_INPUT" }
    );

    assert.deepEqual(
      mutateHandoffState({
        currentState: pending,
        targetStatus: "closed",
        occurredAt: "2026-08-07T12:00:00Z",
        actorId: "synthetic-service-manager-001",
      }),
      { ok: false, code: "INVALID_TRANSITION" }
    );
  });
});
