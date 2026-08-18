import {
  DEMO_USERS_DETAIL_DISABLED_NOTE,
  DEMO_USERS_FILTER_EMPTY_NOTE,
  DEMO_USERS_FILTER_NOTE,
  DEMO_USERS_PRESENTATION_NOTE,
  formatUsersDetailPreviewNote,
  personLabelsForDetailPreview,
  usersCopyIsFailClosed,
} from "./users-copy";
import { DEMO_UX_SLICE, DEMO_UX_USERS_FIXTURE, VISUAL_POLISH_3_USERS_SLICE } from "./users-fixture";
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

describe("DADS-UX-3 users list presentation contracts", () => {
  it("keeps filter empty copy as zero-result (INV-17; not facility-empty)", () => {
    expect(DEMO_USERS_FILTER_EMPTY_NOTE).toContain("合成データ内に該当する利用者はありません");
    expect(DEMO_USERS_FILTER_EMPTY_NOTE).toContain(
      "事業所に利用者がいないことを示すものではありません",
    );
  });

  it("keeps Users fixture status vocabulary for ADAPT presentation (INV-05/12)", () => {
    expect(DEMO_UX_USERS_FIXTURE.rows).toHaveLength(8);
    expect(formatUsersFilterSummaryLabel(8, USERS_FILTER_CHIP_ALL, 8)).toBe("全8名（合成データ）");
  });
});

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 1 users detail copy", () => {
  it("formats generic copy when no preview labels are supplied", () => {
    const note = formatUsersDetailPreviewNote([]);
    expect(note).toBe(DEMO_USERS_DETAIL_DISABLED_NOTE);
    expect(note).toContain("合成詳細プレビューがある利用者のみ");
    expect(note).toContain("業務データの詳細画面には接続されていません");
    expect(note).not.toContain("Aさん");
    expect(note).not.toContain("Cさん");
    expect(note).not.toContain("全8名");
  });

  it("formats one and many labels without implying a full-roster detail path", () => {
    expect(formatUsersDetailPreviewNote(["Xさん"])).toBe(
      "合成詳細プレビューがある利用者のみ一覧から表示できます（現在は Xさん）。業務データの詳細画面には接続されていません。",
    );
    expect(formatUsersDetailPreviewNote(["Xさん", "Yさん"])).toContain("現在は Xさん・Yさん");
    expect(formatUsersDetailPreviewNote(["Xさん", "Yさん"])).not.toContain("全8名");
  });

  it("does not infer A/C when preview ids are missing or unknown", () => {
    expect(personLabelsForDetailPreview(DEMO_UX_USERS_FIXTURE.rows, undefined)).toEqual([]);
    expect(personLabelsForDetailPreview(DEMO_UX_USERS_FIXTURE.rows, [])).toEqual([]);
    expect(personLabelsForDetailPreview(DEMO_UX_USERS_FIXTURE.rows, ["user-missing"])).toEqual([]);
    expect(
      formatUsersDetailPreviewNote(
        personLabelsForDetailPreview(DEMO_UX_USERS_FIXTURE.rows, undefined),
      ),
    ).not.toContain("Aさん");
  });

  it("resolves current 8-row fixture preview ids in collect order", () => {
    const labels = personLabelsForDetailPreview(DEMO_UX_USERS_FIXTURE.rows, ["user-a", "user-c"]);
    expect(labels).toEqual(["Aさん", "Cさん"]);
    expect(formatUsersDetailPreviewNote(labels)).toContain("現在は Aさん・Cさん");
  });
});

describe("VISUAL-POLISH-3 Users presentation boundary", () => {
  it("keeps Users polish presentation-only and downstream work closed", () => {
    expect(VISUAL_POLISH_3_USERS_SLICE.id).toBe("VISUAL-POLISH-3");
    expect(VISUAL_POLISH_3_USERS_SLICE.target).toBe("Users");
    expect(VISUAL_POLISH_3_USERS_SLICE.presentationOnly).toBe(true);
    expect(VISUAL_POLISH_3_USERS_SLICE.businessMeaningChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.statusVocabularyChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.navigationSemanticsChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.permissionsChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.failClosedChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.saveStateChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.syntheticFixtureBoundaryPreserved).toBe(true);
    expect(VISUAL_POLISH_3_USERS_SLICE.liveUsersDataAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.recordsImplementationAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.reviewImplementationAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.supportPlanImplementationAuthorized).toBe(false);
    expect(VISUAL_POLISH_3_USERS_SLICE.deployAuthorized).toBe(false);
  });
});
