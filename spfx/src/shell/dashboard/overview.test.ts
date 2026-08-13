import {
  DASHBOARD_OVERVIEW_ACTION_NAV_NOTE,
  DASHBOARD_OVERVIEW_PRESENTATION_NOTE,
  overviewCopyIsFailClosed,
} from "./overview-copy";
import { DASHBOARD_UX_OVERVIEW_FIXTURE, DASHBOARD_UX_SLICE } from "./overview-fixture";
import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
  isDeprecatedPrimaryStatusLabel,
} from "../ux/status-labels";

describe("DASHBOARD-UX-1 overview fixture boundary", () => {
  it("uses synthetic KPI counts with DEMO-UX-7 canonical labels", () => {
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.label)).toEqual([
      "今日の対象",
      SHELL_STATUS_LABEL_NEEDS_REVIEW,
      SHELL_STATUS_LABEL_UNRECORDED,
      SHELL_STATUS_LABEL_DUE_SOON,
    ]);
    // DEMO-UX-10 Family R: needs_review / unrecorded / deadline_near match Users filter (3/2/3)
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.count)).toEqual([12, 3, 2, 3]);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.every((card) => card.statusHint.length > 0)).toBe(
      true,
    );
    expect(
      DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.some((card) =>
        isDeprecatedPrimaryStatusLabel(card.label),
      ),
    ).toBe(false);
  });

  it("includes today-action navigation targets without authorizing save/live execution", () => {
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.actionItems).toHaveLength(3);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.actionItems.map((item) => item.navigation)).toEqual([
      { kind: "records" },
      { kind: "review_due" },
      { kind: "user_detail", userId: "user-c" },
    ]);
    expect(DASHBOARD_OVERVIEW_ACTION_NAV_NOTE).toContain("画面間移動のみ");
    expect(DASHBOARD_OVERVIEW_ACTION_NAV_NOTE).toContain("保存");
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
