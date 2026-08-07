import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SUPPORT_PLAN_STATUSES,
  SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS,
  isSupportPlanStatus,
  transitionSupportPlanStatus,
  type SupportPlanStatus,
} from "../../src/domain";

describe("SupportPlan status transition contract (Issue #24 / PR-I)", () => {
  it("許可表定数が Accepted 5 辺と一致する", () => {
    assert.deepEqual(
      SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS.map(([from, to]) => [from, to]),
      [
        ["Draft", "PendingReview"],
        ["PendingReview", "Returned"],
        ["Returned", "Draft"],
        ["PendingReview", "Active"],
        ["Active", "Closed"],
      ],
    );
  });

  it("許可 5 辺を受理する", () => {
    assert.deepEqual(transitionSupportPlanStatus("Draft", "PendingReview"), {
      ok: true,
      status: "PendingReview",
    });
    assert.deepEqual(transitionSupportPlanStatus("PendingReview", "Returned"), {
      ok: true,
      status: "Returned",
    });
    assert.deepEqual(transitionSupportPlanStatus("Returned", "Draft"), {
      ok: true,
      status: "Draft",
    });
    assert.deepEqual(transitionSupportPlanStatus("PendingReview", "Active"), {
      ok: true,
      status: "Active",
    });
    assert.deepEqual(transitionSupportPlanStatus("Active", "Closed"), {
      ok: true,
      status: "Closed",
    });
  });

  it("明示禁止辺と自己遷移を INVALID_TRANSITION で拒否する", () => {
    const forbidden: ReadonlyArray<readonly [SupportPlanStatus, SupportPlanStatus]> = [
      ["Draft", "Active"],
      ["Draft", "Returned"],
      ["Draft", "Closed"],
      ["Draft", "Draft"],
      ["PendingReview", "Draft"],
      ["PendingReview", "Closed"],
      ["PendingReview", "PendingReview"],
      ["Returned", "Active"],
      ["Returned", "PendingReview"],
      ["Returned", "Closed"],
      ["Returned", "Returned"],
      ["Active", "Draft"],
      ["Active", "PendingReview"],
      ["Active", "Returned"],
      ["Active", "Active"],
      ["Closed", "Draft"],
      ["Closed", "PendingReview"],
      ["Closed", "Returned"],
      ["Closed", "Active"],
      ["Closed", "Closed"],
    ];

    for (const [from, to] of forbidden) {
      assert.deepEqual(
        transitionSupportPlanStatus(from, to),
        { ok: false, code: "INVALID_TRANSITION" },
        `${from} → ${to}`,
      );
    }
  });

  it("Closed からの任意遷移を拒否する", () => {
    for (const to of SUPPORT_PLAN_STATUSES) {
      assert.deepEqual(transitionSupportPlanStatus("Closed", to), {
        ok: false,
        code: "INVALID_TRANSITION",
      });
    }
  });

  it("不正入力を MALFORMED_INPUT で fail-closed する", () => {
    assert.deepEqual(transitionSupportPlanStatus(null, "PendingReview"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionSupportPlanStatus("Draft", undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionSupportPlanStatus("draft", "PendingReview"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionSupportPlanStatus("Draft", "pendingReview"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionSupportPlanStatus("Unknown", "Active"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionSupportPlanStatus(1, "Active"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("全 status 組合せで許可表と結果が一致する", () => {
    for (const from of SUPPORT_PLAN_STATUSES) {
      for (const to of SUPPORT_PLAN_STATUSES) {
        const allowed = SUPPORT_PLAN_STATUS_ALLOWED_TRANSITIONS.some(
          ([allowedFrom, allowedTo]) => allowedFrom === from && allowedTo === to,
        );
        const result = transitionSupportPlanStatus(from, to);
        if (allowed) {
          assert.deepEqual(result, { ok: true, status: to });
        } else {
          assert.deepEqual(result, { ok: false, code: "INVALID_TRANSITION" });
        }
      }
    }
  });

  it("isSupportPlanStatus は合法値のみ受理する", () => {
    for (const status of SUPPORT_PLAN_STATUSES) {
      assert.equal(isSupportPlanStatus(status), true);
    }
    assert.equal(isSupportPlanStatus("draft"), false);
    assert.equal(isSupportPlanStatus(""), false);
    assert.equal(isSupportPlanStatus(null), false);
  });
});
