import { DASHBOARD_OVERVIEW_PRESENTATION_NOTE, overviewCopyIsFailClosed } from "./overview-copy";
import { DASHBOARD_UX_OVERVIEW_FIXTURE, DASHBOARD_UX_SLICE } from "./overview-fixture";

describe("DASHBOARD-UX-1 overview fixture boundary", () => {
  it("uses synthetic KPI counts aligned with DESIGN-4 prototype", () => {
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.label)).toEqual([
      "今日の対象",
      "要確認",
      "未記録",
      "期限間近",
    ]);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.count)).toEqual([12, 3, 2, 2]);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.every((card) => card.statusHint.length > 0)).toBe(
      true,
    );
  });

  it("includes action and recent record rows without live identifiers", () => {
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.actionItems).toHaveLength(3);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.recentRecords).toHaveLength(2);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.actionItems[0]?.personLabel).toBe("Aさん");
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.recentRecords[0]?.recordType).toBe("支援記録");
  });

  it("keeps presentation copy fail-closed", () => {
    expect(overviewCopyIsFailClosed(DASHBOARD_OVERVIEW_PRESENTATION_NOTE)).toBe(true);
    expect(DASHBOARD_OVERVIEW_PRESENTATION_NOTE).toContain("業務データには接続されていません");
    expect(overviewCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("does not authorize live I/O, adapter fetch, auth judgment, or action execution", () => {
    expect(DASHBOARD_UX_SLICE.id).toBe("DASHBOARD-UX-1");
    expect(DASHBOARD_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.authJudgmentAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.liveOverviewDataAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.kpiNavigationAuthorized).toBe(false);
    expect(DASHBOARD_UX_SLICE.actionExecutionAuthorized).toBe(false);
  });
});
