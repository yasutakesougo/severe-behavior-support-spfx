import { DASHBOARD_OVERVIEW_ACTION_NAV_NOTE } from "../dashboard/overview-copy";
import { DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE } from "../records/daily-record-copy";
import { DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE } from "../review/review-due-copy";
import { DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE } from "../users/support-plan-copy";
import { DEMO_USERS_FILTER_HINT_CONSOLIDATED, DEMO_UX_11_SLICE } from "./demo-note-consolidation";
import { DEMO_KPI_FAMILY_A_NOTE, DEMO_KPI_FAMILY_R_NOTE } from "./kpi-review-count";

describe("DEMO-UX-11 DEMO note consolidation", () => {
  it("keeps consolidation flags presentation-only and safety-closed", () => {
    expect(DEMO_UX_11_SLICE.id).toBe("DEMO-UX-11");
    expect(DEMO_UX_11_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_11_SLICE.demoNoteConsolidationAuthorized).toBe(true);
    expect(DEMO_UX_11_SLICE.screenLevelSyntheticBandAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.globalDemoBannerRemovalAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.mutationBoundaryRemovalAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.familyMetricNoteRemovalAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.failClosedSemanticsChangeAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_11_SLICE.saveBadgeEmphasisChangeAuthorized).toBe(false);
  });

  it("keeps consolidated users filter hint operable and non-live", () => {
    expect(DEMO_USERS_FILTER_HINT_CONSOLIDATED).toContain("絞り込みできます");
    expect(DEMO_USERS_FILTER_HINT_CONSOLIDATED).toContain("合成データ内");
    expect(DEMO_USERS_FILTER_HINT_CONSOLIDATED).toContain("業務検索には未接続");
    expect(DEMO_USERS_FILTER_HINT_CONSOLIDATED).toContain("概要の要確認/未記録/期限接近と同じ定義");
    expect(DEMO_USERS_FILTER_HINT_CONSOLIDATED.toLowerCase().indexOf("live sharepoint")).toBe(-1);
  });

  it("keeps required mutation and Family metric boundaries", () => {
    expect(DASHBOARD_OVERVIEW_ACTION_NAV_NOTE).toContain("画面間移動のみ");
    expect(DASHBOARD_OVERVIEW_ACTION_NAV_NOTE).toContain("保存");
    expect(DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE).toContain("実保存なし");
    expect(DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE).toContain("実行できません");
    expect(DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE).toContain("表示専用");
    expect(DEMO_KPI_FAMILY_R_NOTE).toContain("利用者一覧の状態バッジ件数と同じ定義");
    expect(DEMO_KPI_FAMILY_A_NOTE).toContain("確認対象一覧と同じ母集団");
  });
});
