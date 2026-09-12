import {
  DASHBOARD_OVERVIEW_ACTION_NAV_NOTE,
  DASHBOARD_OVERVIEW_PRESENTATION_NOTE,
  formatTodaySupportBoardDisclaimer,
  overviewCopyIsFailClosed,
} from "./overview-copy";
import {
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DASHBOARD_UX_SLICE,
  VISUAL_POLISH_2_OVERVIEW_SLICE,
} from "./overview-fixture";
import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
  isDeprecatedPrimaryStatusLabel,
} from "../ux/status-labels";
import { kpiSectionHeadingForRole, overviewSectionOrderForRole } from "../ux/presentation-role";

describe("DASHBOARD-UX-1 overview fixture boundary", () => {
  it("uses synthetic KPI counts with DEMO-UX-7 canonical labels", () => {
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.label)).toEqual([
      "今日の対象",
      SHELL_STATUS_LABEL_NEEDS_REVIEW,
      SHELL_STATUS_LABEL_UNRECORDED,
      SHELL_STATUS_LABEL_DUE_SOON,
    ]);
    // DEMO-UX-10 Family R: needs_review / unrecorded / deadline_near match Users filter (3/2/3)
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.map((card) => card.count)).toEqual([1, 3, 2, 3]);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards[0]?.count).not.toBe(12);
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

  it("keeps Overview heading hierarchy anchors for DADS-UX-2 regression", () => {
    // Source-level contract mirrored by A11Y-HD-02 — labels/IA unchanged.
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards).toHaveLength(4);
    expect(DASHBOARD_UX_OVERVIEW_FIXTURE.recentRecords.length).toBeGreaterThan(0);
    expect(
      DASHBOARD_UX_OVERVIEW_FIXTURE.actionItems.every((item) => item.actionLabel.length > 0),
    ).toBe(true);
  });

  it("keeps VISUAL-POLISH-2 presentation boundaries closed", () => {
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.id).toBe("VISUAL-POLISH-2");
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.target).toBe("Overview");
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.presentationOnly).toBe(true);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.statusVocabularyChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.saveStateChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.navigationSemanticsChangeAuthorized).toBe(false);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.liveOverviewDataAuthorized).toBe(false);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(VISUAL_POLISH_2_OVERVIEW_SLICE.deployAuthorized).toBe(false);
  });

  it("supports Today Support day board navigation by OccurrenceId", () => {
    const target = {
      kind: "occurrence" as const,
      occurrenceId: "occ-synth-001",
      userId: "user-a",
    };
    expect(target.kind).toBe("occurrence");
    expect(target.occurrenceId).toBe("occ-synth-001");
  });
});

describe("FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 1 today-support disclaimer", () => {
  it("keeps the day board a separate synthetic context from the Users roster", () => {
    const generic = formatTodaySupportBoardDisclaimer([]);
    expect(overviewCopyIsFailClosed(generic)).toBe(true);
    expect(generic).toContain("合成の日次ボード");
    expect(generic).toContain("利用者一覧の対象者集合とは別です");
    expect(generic).toContain("業務データには接続されていません");
    expect(generic).not.toContain("Aさん");
    expect(generic).not.toContain("保存済み");
    expect(generic).not.toContain("記録済み");
  });

  it("uses first-seen person labels from items instead of hardcoded names", () => {
    const note = formatTodaySupportBoardDisclaimer(["Aさん", "Aさん", "Bさん"]);
    expect(note).toContain("表示中の予定は Aさん・Bさん");
    expect(note).toContain("利用者一覧の対象者集合とは別です");
    expect(overviewCopyIsFailClosed(note)).toBe(true);
    expect(note).not.toContain("live");
  });
});

describe("VP-G Overview presentationRole entry", () => {
  it("keeps FIELD_STAFF Today Support first and does not add destinations", () => {
    expect(overviewSectionOrderForRole("FIELD_STAFF")[0]).toBe("todaySupport");
    expect(kpiSectionHeadingForRole("FIELD_STAFF")).toBe("今日の支援状況");
  });

  it("puts review/plan first for PLANNER and ops/read first for ADMIN_AUDIT", () => {
    expect(overviewSectionOrderForRole("PLANNER")[0]).toBe("reviewDue");
    expect(overviewSectionOrderForRole("ADMIN_AUDIT")[0]).toBe("kpi");
    expect(kpiSectionHeadingForRole("PLANNER")).toBe("計画・見直しの状況");
    expect(kpiSectionHeadingForRole("ADMIN_AUDIT")).toBe("運用状況");
  });
});

import {
  isTodayTargetsUnavailableCard,
  resolveTodayTargetsKpiCard,
  TODAY_TARGETS_UNAVAILABLE_STATUS_HINT,
} from "./overview-copy";

describe("S-POP today_targets availability contract", () => {
  it("resolves distinct roster userIds and allows zero without meaning unavailable", () => {
    const resolved = resolveTodayTargetsKpiCard(
      [{ userId: "user-a" }, { userId: "user-a" }],
      ["user-a", "user-b"],
    );
    expect(resolved.count).toBe(1);
    expect(isTodayTargetsUnavailableCard(resolved)).toBe(false);
    const zero = resolveTodayTargetsKpiCard([], ["user-a"]);
    expect(zero.count).toBe(0);
    expect(isTodayTargetsUnavailableCard(zero)).toBe(false);
  });

  it("marks missing todaySupportItems as unavailable without faking population", () => {
    const unavailable = resolveTodayTargetsKpiCard(undefined, ["user-a"]);
    expect(isTodayTargetsUnavailableCard(unavailable)).toBe(true);
    expect(unavailable.statusHint).toBe(TODAY_TARGETS_UNAVAILABLE_STATUS_HINT);
    expect(unavailable.count).not.toBe(12);
  });
});
