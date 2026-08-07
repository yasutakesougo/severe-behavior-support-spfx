import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateActivePlanUniqueness,
  evaluateActivePlanUniquenessUnknown,
  toAsiaTokyoCalendarDay,
  type SupportPlan,
} from "../../src/domain";
import {
  createSyntheticActivePlan,
  createSyntheticClosedPlan,
  createSyntheticDraftPlan,
  createSyntheticPendingReviewPlan,
  createSyntheticReturnedPlan,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
} from "../domain/support-plan-fixtures";

const active = (
  planId: string,
  effectiveFrom: string,
  effectiveTo?: string,
  overrides: {
    OrganizationId?: string;
    SiteId?: string;
    UserId?: string;
  } = {},
): SupportPlan => {
  const base = createSyntheticActivePlan({
    PlanId: planId,
    effectiveFrom,
    ...(effectiveTo === undefined ? {} : { effectiveTo }),
    ...overrides,
  } as Parameters<typeof createSyntheticActivePlan>[0]);
  return base;
};

describe("Active plan uniqueness contract (Issue #24)", () => {
  it("Active 0件（空配列）→ UNIQUE", () => {
    assert.equal(evaluateActivePlanUniqueness([]), "UNIQUE");
  });

  it("Active 1件 → UNIQUE", () => {
    assert.equal(
      evaluateActivePlanUniqueness([active("synthetic-plan-a", "2026-08-06T14:00:00.000Z")]),
      "UNIQUE",
    );
  });

  it("同一判定単位で非重複Active 2件（東京暦日が隣接しない）→ UNIQUE", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-a", "2026-01-01T00:00:00.000Z", "2026-01-10T23:59:59.000Z"),
        active("synthetic-plan-b", "2026-01-20T00:00:00.000Z", "2026-01-31T23:59:59.000Z"),
      ]),
      "UNIQUE",
    );
  });

  it("同一判定単位で隣接する非共有暦日は UNIQUE", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-a", "2026-01-01T15:00:00.000Z", "2026-01-10T14:59:59.000Z"),
        active("synthetic-plan-b", "2026-01-11T00:00:00.000Z", "2026-01-20T00:00:00.000Z"),
      ]),
      "UNIQUE",
    );
  });

  it("同一判定単位で完全一致Active 2件 → CONFLICT", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-a", "2026-03-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z"),
        active("synthetic-plan-b", "2026-03-01T00:00:00.000Z", "2026-03-31T00:00:00.000Z"),
      ]),
      "CONFLICT",
    );
  });

  it("同一判定単位で部分重複Active 2件 → CONFLICT", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-a", "2026-03-01T00:00:00.000Z", "2026-03-20T00:00:00.000Z"),
        active("synthetic-plan-b", "2026-03-10T00:00:00.000Z", "2026-03-31T00:00:00.000Z"),
      ]),
      "CONFLICT",
    );
  });

  it("一方の effectiveTo と他方の effectiveFrom の東京暦日が同日 → CONFLICT（瞬間非重複でも可）", () => {
    // 2026-03-10T10:00Z and 2026-03-10T14:00Z are the same Tokyo calendar day (03-10).
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-a", "2026-03-01T00:00:00.000Z", "2026-03-10T10:00:00.000Z"),
        active("synthetic-plan-b", "2026-03-10T14:00:00.000Z", "2026-03-31T00:00:00.000Z"),
      ]),
      "CONFLICT",
    );
  });

  it("effectiveTo 未設定Activeと後続Activeが東京暦日で重複 → CONFLICT", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-open", "2026-02-01T00:00:00.000Z"),
        active("synthetic-plan-later", "2026-06-01T00:00:00.000Z", "2026-06-30T00:00:00.000Z"),
      ]),
      "CONFLICT",
    );
  });

  it("複数判定単位を含み、1単位だけ CONFLICT → 配列全体 CONFLICT", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-user-a-1", "2026-01-01T00:00:00.000Z", "2026-01-31T00:00:00.000Z", {
          UserId: "synthetic-user-a",
        }),
        active("synthetic-plan-user-a-2", "2026-01-15T00:00:00.000Z", "2026-02-15T00:00:00.000Z", {
          UserId: "synthetic-user-a",
        }),
        active("synthetic-plan-user-b-1", "2026-01-01T00:00:00.000Z", "2026-01-31T00:00:00.000Z", {
          UserId: "synthetic-user-b",
        }),
      ]),
      "CONFLICT",
    );
  });

  it("複数判定単位を含み、全単位 UNIQUE、かつ不正なし → 配列全体 UNIQUE", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-user-a-1", "2026-01-01T00:00:00.000Z", "2026-01-31T00:00:00.000Z", {
          UserId: "synthetic-user-a",
        }),
        active("synthetic-plan-user-b-1", "2026-01-01T00:00:00.000Z", "2026-01-31T00:00:00.000Z", {
          UserId: "synthetic-user-b",
        }),
      ]),
      "UNIQUE",
    );
  });

  it("複数判定単位を含み、1件でも MALFORMED → 配列全体 MALFORMED_INPUT（CONFLICT より優先）", () => {
    assert.equal(
      evaluateActivePlanUniquenessUnknown([
        active("synthetic-plan-user-a-1", "2026-01-01T00:00:00.000Z", "2026-01-31T00:00:00.000Z", {
          UserId: "synthetic-user-a",
        }),
        active("synthetic-plan-user-a-2", "2026-01-15T00:00:00.000Z", "2026-02-15T00:00:00.000Z", {
          UserId: "synthetic-user-a",
        }),
        {
          PlanId: "synthetic-plan-broken",
          OrganizationId: SYNTHETIC_PLAN_ORG_ID,
          SiteId: SYNTHETIC_PLAN_SITE_ID,
          UserId: "synthetic-user-b",
          status: "Active",
          effectiveFrom: "not-a-date",
        },
      ]),
      "MALFORMED_INPUT",
    );
  });

  it("UserIdが同じでもSiteIdが異なる → 相互に競合させない", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-site-a", "2026-04-01T00:00:00.000Z", "2026-04-30T00:00:00.000Z", {
          SiteId: "synthetic-site-a",
        }),
        active("synthetic-plan-site-b", "2026-04-01T00:00:00.000Z", "2026-04-30T00:00:00.000Z", {
          SiteId: "synthetic-site-b",
        }),
      ]),
      "UNIQUE",
    );
  });

  it("SiteIdが同じでもOrganizationIdが異なる → 相互に競合させない", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-org-a", "2026-04-01T00:00:00.000Z", "2026-04-30T00:00:00.000Z", {
          OrganizationId: "synthetic-org-a",
        }),
        active("synthetic-plan-org-b", "2026-04-01T00:00:00.000Z", "2026-04-30T00:00:00.000Z", {
          OrganizationId: "synthetic-org-b",
        }),
      ]),
      "UNIQUE",
    );
  });

  it("Draft / PendingReview / Returned / Closed は競合数へ含めない", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        createSyntheticDraftPlan({ PlanId: "synthetic-draft" }),
        createSyntheticPendingReviewPlan({ PlanId: "synthetic-pending" }),
        createSyntheticReturnedPlan({ PlanId: "synthetic-returned" }),
        createSyntheticClosedPlan({ PlanId: "synthetic-closed" }),
        active("synthetic-active-only", "2026-05-01T00:00:00.000Z", "2026-05-31T00:00:00.000Z"),
      ]),
      "UNIQUE",
    );
  });

  it("必須識別子欠損 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateActivePlanUniquenessUnknown([
        {
          PlanId: "synthetic-plan-missing-user",
          OrganizationId: SYNTHETIC_PLAN_ORG_ID,
          SiteId: SYNTHETIC_PLAN_SITE_ID,
          UserId: "   ",
          status: "Draft",
        },
      ]),
      "MALFORMED_INPUT",
    );
  });

  it("不正日付 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateActivePlanUniquenessUnknown([
        {
          PlanId: "synthetic-plan-bad-date",
          OrganizationId: SYNTHETIC_PLAN_ORG_ID,
          SiteId: SYNTHETIC_PLAN_SITE_ID,
          UserId: SYNTHETIC_PLAN_USER_ID,
          status: "Active",
          effectiveFrom: "2026-13-40T00:00:00.000Z",
        },
      ]),
      "MALFORMED_INPUT",
    );
  });

  it("effectiveFrom の東京暦日が effectiveTo の東京暦日より後 → MALFORMED_INPUT", () => {
    assert.equal(
      evaluateActivePlanUniqueness([
        active("synthetic-plan-reversed", "2026-06-10T00:00:00.000Z", "2026-06-01T00:00:00.000Z"),
      ]),
      "MALFORMED_INPUT",
    );
  });

  it("不正status等の壊れた入力をUNIQUEへ倒さない", () => {
    assert.equal(
      evaluateActivePlanUniquenessUnknown([
        {
          PlanId: "synthetic-plan-bad-status",
          OrganizationId: SYNTHETIC_PLAN_ORG_ID,
          SiteId: SYNTHETIC_PLAN_SITE_ID,
          UserId: SYNTHETIC_PLAN_USER_ID,
          status: "NotAStatus",
        },
      ]),
      "MALFORMED_INPUT",
    );
    assert.equal(evaluateActivePlanUniquenessUnknown(null), "MALFORMED_INPUT");
    assert.equal(evaluateActivePlanUniquenessUnknown("not-an-array"), "MALFORMED_INPUT");
  });

  it("UTC瞬間が前日でも Asia/Tokyo 暦日へ変換する", () => {
    // 2026-08-05T16:00:00.000Z == 2026-08-06T01:00:00+09:00
    assert.equal(toAsiaTokyoCalendarDay("2026-08-05T16:00:00.000Z"), "2026-08-06");
  });
});
