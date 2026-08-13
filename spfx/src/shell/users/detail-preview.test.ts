import {
  collectSyntheticDetailPreviewUserIds,
  DEMO_UX_13_SLICE,
  isSyntheticDetailPreviewEnabled,
} from "./detail-preview";
import { DEMO_UX_USER_DETAIL_C_FIXTURE, DEMO_UX_USER_DETAIL_FIXTURE } from "./user-detail-fixture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import { filterUserRowsByStatusChip, USERS_FILTER_CHIP_NEEDS_REVIEW } from "./users-filter";

describe("DEMO-UX-13 detail-preview enablement (DUX7-P2-1)", () => {
  const previewIds = collectSyntheticDetailPreviewUserIds(DEMO_UX_USER_DETAIL_FIXTURE, [
    DEMO_UX_USER_DETAIL_C_FIXTURE,
  ]);

  it("locks slice flags without authorizing live detail or support-plan expansion", () => {
    expect(DEMO_UX_13_SLICE.id).toBe("DEMO-UX-13");
    expect(DEMO_UX_13_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_13_SLICE.detailPreviewExpansionAuthorized).toBe(true);
    expect(DEMO_UX_13_SLICE.fixtureBackedDetailPreviewOnly).toBe(true);
    expect(DEMO_UX_13_SLICE.newEightUserDetailCatalogAuthorized).toBe(false);
    expect(DEMO_UX_13_SLICE.supportPlanExpansionAuthorized).toBe(false);
    expect(DEMO_UX_13_SLICE.liveUserDetailNavigationAuthorized).toBe(false);
    expect(DEMO_UX_13_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_13_SLICE.sharePointWriteAuthorized).toBe(false);
  });

  it("collects A and C from default synthetic fixtures only", () => {
    expect(previewIds).toEqual(["user-a", "user-c"]);
  });

  it("enables A and C; keeps B and D–H disabled", () => {
    expect(isSyntheticDetailPreviewEnabled("user-a", previewIds)).toBe(true);
    expect(isSyntheticDetailPreviewEnabled("user-c", previewIds)).toBe(true);
    for (const id of ["user-b", "user-d", "user-e", "user-f", "user-g", "user-h"]) {
      expect(isSyntheticDetailPreviewEnabled(id, previewIds)).toBe(false);
    }
  });

  it("does not enable unknown ids without a fixture", () => {
    expect(isSyntheticDetailPreviewEnabled("user-z", previewIds)).toBe(false);
    expect(isSyntheticDetailPreviewEnabled("user-b", undefined)).toBe(false);
    expect(isSyntheticDetailPreviewEnabled("user-a", [])).toBe(false);
  });

  it("keeps the same availability rule after DEMO-UX-8 needs_review filter", () => {
    const filtered = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_NEEDS_REVIEW,
    );
    expect(filtered.map((row) => row.id)).toEqual(["user-a", "user-c", "user-f"]);
    expect(isSyntheticDetailPreviewEnabled("user-a", previewIds)).toBe(true);
    expect(isSyntheticDetailPreviewEnabled("user-c", previewIds)).toBe(true);
    expect(isSyntheticDetailPreviewEnabled("user-f", previewIds)).toBe(false);
  });

  it("keeps support-plan fixture A-only (C is detail preview only)", () => {
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.userId).toBe("user-a");
    expect(DEMO_UX_SUPPORT_PLAN_FIXTURE.userId).not.toBe("user-c");
    expect(DEMO_UX_13_SLICE.supportPlanExpansionAuthorized).toBe(false);
  });
});
