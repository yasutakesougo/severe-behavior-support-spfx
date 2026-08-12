import {
  DEMO_USERS_FILTER_EMPTY_NOTE,
  DEMO_USERS_FILTER_NOTE,
  DEMO_USERS_PRESENTATION_NOTE,
  usersCopyIsFailClosed,
} from "./users-copy";
import { DEMO_UX_SLICE, DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import {
  DEMO_UX_8_SLICE,
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_DUE_SOON,
  USERS_FILTER_CHIP_NEEDS_REVIEW,
  USERS_FILTER_CHIP_UNRECORDED,
  filterUserRowsByStatusChip,
  formatUsersFilterSummaryLabel,
  matchKeyForUsersFilterChip,
} from "./users-filter";

describe("DEMO-UX-2 users list fixture boundary", () => {
  it("uses synthetic rows for responsible-person review density", () => {
    expect(DEMO_UX_USERS_FIXTURE.summaryLabel).toBe("全8名（合成データ）");
    expect(DEMO_UX_USERS_FIXTURE.rows).toHaveLength(8);
    expect(DEMO_UX_USERS_FIXTURE.rows.map((row) => row.personLabel)).toEqual([
      "Aさん",
      "Bさん",
      "Cさん",
      "Dさん",
      "Eさん",
      "Fさん",
      "Gさん",
      "Hさん",
    ]);
  });

  it("includes textual status badges without live identifiers", () => {
    const badgeLabels: string[] = [];
    for (const row of DEMO_UX_USERS_FIXTURE.rows) {
      for (const badge of row.statusBadges) {
        badgeLabels.push(badge.label);
      }
    }
    expect(badgeLabels).toContain("要確認");
    expect(badgeLabels).toContain("未記録");
    expect(badgeLabels).toContain("期限接近");
    expect(badgeLabels).not.toContain("期限間近");
    expect(badgeLabels).not.toContain("確認待ち");
    expect(badgeLabels).not.toContain("確認対象");
    expect(badgeLabels).toContain("通常");
    expect(DEMO_UX_USERS_FIXTURE.rows[0]?.attentionNote).toBe("支援記録が未入力");
  });

  it("keeps presentation copy fail-closed", () => {
    expect(usersCopyIsFailClosed(DEMO_USERS_PRESENTATION_NOTE)).toBe(true);
    expect(DEMO_USERS_PRESENTATION_NOTE).toContain("業務データには接続されていません");
    expect(usersCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
    expect(DEMO_USERS_FILTER_NOTE).toContain("合成データ内の状態で絞り込みできます");
    expect(DEMO_USERS_FILTER_NOTE).toContain("業務データの検索には接続されていません");
    expect(DEMO_USERS_FILTER_EMPTY_NOTE).toContain(
      "事業所に利用者がいないことを示すものではありません",
    );
  });

  it("does not authorize live I/O, adapter fetch, auth judgment, or detail navigation", () => {
    expect(DEMO_UX_SLICE.id).toBe("DEMO-UX-2");
    expect(DEMO_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.authJudgmentAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.liveUsersDataAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.userDetailNavigationAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.filterExecutionAuthorized).toBe(true);
  });
});

describe("DEMO-UX-8 users list status filter", () => {
  it("locks chip match keys to badge.id categories", () => {
    expect(matchKeyForUsersFilterChip(USERS_FILTER_CHIP_ALL)).toBeUndefined();
    expect(matchKeyForUsersFilterChip(USERS_FILTER_CHIP_NEEDS_REVIEW)).toBe("needs_review");
    expect(matchKeyForUsersFilterChip(USERS_FILTER_CHIP_UNRECORDED)).toBe("unrecorded");
    expect(matchKeyForUsersFilterChip(USERS_FILTER_CHIP_DUE_SOON)).toBe("deadline_near");
  });

  it("filters the unchanged 8-row fixture with ANY badge.id semantics", () => {
    const all = filterUserRowsByStatusChip(DEMO_UX_USERS_FIXTURE.rows, USERS_FILTER_CHIP_ALL);
    const needsReview = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_NEEDS_REVIEW,
    );
    const unrecorded = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_UNRECORDED,
    );
    const dueSoon = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_DUE_SOON,
    );

    expect(DEMO_UX_USERS_FIXTURE.rows).toHaveLength(8);
    expect(all.map((row) => row.id)).toEqual([
      "user-a",
      "user-b",
      "user-c",
      "user-d",
      "user-e",
      "user-f",
      "user-g",
      "user-h",
    ]);
    expect(needsReview.map((row) => row.id)).toEqual(["user-a", "user-c", "user-f"]);
    expect(unrecorded.map((row) => row.id)).toEqual(["user-a", "user-e"]);
    expect(dueSoon.map((row) => row.id)).toEqual(["user-b", "user-e", "user-h"]);
  });

  it("formats summary labels for default, filtered, and empty results", () => {
    expect(formatUsersFilterSummaryLabel(8, USERS_FILTER_CHIP_ALL, 8)).toBe("全8名（合成データ）");
    expect(formatUsersFilterSummaryLabel(3, USERS_FILTER_CHIP_NEEDS_REVIEW, 8)).toBe(
      "3名（要確認・合成データ）",
    );
    expect(formatUsersFilterSummaryLabel(2, USERS_FILTER_CHIP_UNRECORDED, 8)).toBe(
      "2名（未記録・合成データ）",
    );
    expect(formatUsersFilterSummaryLabel(3, USERS_FILTER_CHIP_DUE_SOON, 8)).toBe(
      "3名（期限接近・合成データ）",
    );
    expect(formatUsersFilterSummaryLabel(0, USERS_FILTER_CHIP_NEEDS_REVIEW, 8)).toBe(
      "0名（要確認・合成データ内で該当なし）",
    );
  });

  it("authorizes synthetic filter only and keeps mutation / live I/O out", () => {
    expect(DEMO_UX_8_SLICE.id).toBe("DEMO-UX-8");
    expect(DEMO_UX_8_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_8_SLICE.filterExecutionAuthorized).toBe(true);
    expect(DEMO_UX_8_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.multiSelectFilterAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.detailPreviewExpansionAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.recordFlowRedesignAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.businessRuleCalculationAuthorized).toBe(false);
    expect(DEMO_UX_8_SLICE.failClosedSemanticsChangeAuthorized).toBe(false);
  });
});
