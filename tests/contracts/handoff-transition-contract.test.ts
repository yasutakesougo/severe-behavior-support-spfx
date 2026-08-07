import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HANDOFF_STATUS_ALLOWED_TRANSITIONS,
  isHandoffStatus,
  transitionHandoffStatus,
} from "../../src/domain";

describe("Handoff status transition contract", () => {
  it("fixes the accepted seven-edge allowlist", () => {
    assert.deepEqual(
      [...HANDOFF_STATUS_ALLOWED_TRANSITIONS],
      [
        ["not_required", "pending"],
        ["pending", "not_required"],
        ["pending", "included"],
        ["included", "pending"],
        ["included", "acknowledged"],
        ["acknowledged", "included"],
        ["acknowledged", "closed"],
      ],
    );
  });

  it("accepts every allowed edge", () => {
    for (const [from, to] of HANDOFF_STATUS_ALLOWED_TRANSITIONS) {
      assert.deepEqual(transitionHandoffStatus(from, to), {
        ok: true,
        status: to,
      });
    }
  });

  it("rejects self transitions and skipped transitions", () => {
    const denied = [
      ["not_required", "not_required"],
      ["not_required", "included"],
      ["pending", "pending"],
      ["pending", "closed"],
      ["included", "included"],
      ["included", "closed"],
      ["acknowledged", "acknowledged"],
      ["acknowledged", "pending"],
    ] as const;

    for (const [from, to] of denied) {
      assert.deepEqual(transitionHandoffStatus(from, to), {
        ok: false,
        code: "INVALID_TRANSITION",
      });
    }
  });

  it("treats closed as terminal", () => {
    const targets = ["not_required", "pending", "included", "acknowledged", "closed"] as const;

    for (const target of targets) {
      assert.deepEqual(transitionHandoffStatus("closed", target), {
        ok: false,
        code: "INVALID_TRANSITION",
      });
    }
  });

  it("rejects malformed status inputs without throwing", () => {
    const invalidValues: unknown[] = [null, undefined, 0, {}, [], "unknown", "Pending", "CLOSED"];

    for (const invalid of invalidValues) {
      assert.equal(isHandoffStatus(invalid), false);
      assert.deepEqual(transitionHandoffStatus(invalid, "pending"), {
        ok: false,
        code: "MALFORMED_INPUT",
      });
      assert.deepEqual(transitionHandoffStatus("pending", invalid), {
        ok: false,
        code: "MALFORMED_INPUT",
      });
    }
  });
});
