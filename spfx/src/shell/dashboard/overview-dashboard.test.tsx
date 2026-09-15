import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { renderToStaticMarkup } from "react-dom/server";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import { DEMO_UX_USERS_FIXTURE } from "../users/users-fixture";
import {
  isTodayTargetsUnavailableCard,
  TODAY_TARGETS_UNAVAILABLE_STATUS_HINT,
} from "./overview-copy";
import { OverviewDashboard } from "./OverviewDashboard";
import { DASHBOARD_UX_OVERVIEW_FIXTURE } from "./overview-fixture";
import { TodaySupportDayBoard } from "./TodaySupportDayBoard";

function stubTodayItem(
  overrides: Pick<TodaySupportItem, "occurrenceId" | "userId"> &
    Partial<Pick<TodaySupportItem, "personLabel" | "canStartProcedureRecord" | "effectiveStatus">>,
): TodaySupportItem {
  return {
    occurrenceId: overrides.occurrenceId,
    scheduleItemId: `sched-${overrides.occurrenceId}`,
    scheduledTime: "10:00",
    activityLabel: "合成活動",
    catalogOrder: 1,
    userId: overrides.userId,
    personLabel: overrides.personLabel ?? "Aさん",
    localDate: "2026-09-12" as TodaySupportItem["localDate"],
    procedure: {
      ProcedureId: "proc-1",
      ProcedureVersion: "1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-1",
    planVersion: 1,
    effectiveStatus: overrides.effectiveStatus ?? "未実施",
    canStartProcedureRecord: overrides.canStartProcedureRecord ?? true,
    rawResolverResult: { status: "UNRECORDED" },
  };
}

function todayTargetsCardMarkup(html: string): string {
  const match = html.match(
    /<li[^>]*data-dashboard-ux-kpi="today_targets"[^>]*>[\s\S]*?<\/li>/,
  );
  return match ? match[0] : "";
}

describe("S-POP Overview rendered today_targets wiring", () => {
  it("keeps fixture today_targets unavailable until items are passed", () => {
    const fixtureCard = DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards.find(
      (card) => card.id === "today_targets",
    );
    expect(isTodayTargetsUnavailableCard(fixtureCard!)).toBe(true);

    const html = renderToStaticMarkup(
      <OverviewDashboard presentation={DASHBOARD_UX_OVERVIEW_FIXTURE} />,
    );
    const cardHtml = todayTargetsCardMarkup(html);
    expect(cardHtml.length).toBeGreaterThan(0);
    expect(cardHtml).toContain('data-demo-ux-kpi-unavailable="true"');
    expect(cardHtml).toContain(TODAY_TARGETS_UNAVAILABLE_STATUS_HINT);
    expect(cardHtml).not.toContain("data-demo-ux-kpi-count=");
  });

  it("renders distinct roster intersection from passed todaySupportItems", () => {
    const html = renderToStaticMarkup(
      <OverviewDashboard
        presentation={DASHBOARD_UX_OVERVIEW_FIXTURE}
        todaySupportItems={[
          stubTodayItem({ occurrenceId: "occ-1", userId: "user-a" }),
          stubTodayItem({ occurrenceId: "occ-2", userId: "user-a" }),
          stubTodayItem({
            occurrenceId: "occ-3",
            userId: "user-z",
            personLabel: "Zさん",
          }),
        ]}
      />,
    );
    const rosterIds = DEMO_UX_USERS_FIXTURE.rows.map((row) => row.id);
    expect(rosterIds.indexOf("user-a") >= 0).toBe(true);
    expect(rosterIds.indexOf("user-z") >= 0).toBe(false);
    const cardHtml = todayTargetsCardMarkup(html);
    expect(cardHtml).toContain('data-demo-ux-kpi-count="1"');
    expect(cardHtml).not.toContain('data-demo-ux-kpi-unavailable="true"');
    expect(cardHtml).toContain("本日の支援対象");
  });

  it("treats an empty resolved item list as zero people, not unavailable", () => {
    const html = renderToStaticMarkup(
      <OverviewDashboard presentation={DASHBOARD_UX_OVERVIEW_FIXTURE} todaySupportItems={[]} />,
    );
    const cardHtml = todayTargetsCardMarkup(html);
    expect(cardHtml).toContain('data-demo-ux-kpi-count="0"');
    expect(cardHtml).not.toContain('data-demo-ux-kpi-unavailable="true"');
  });
});

describe("S-CTA occurrence action wiring", () => {
  it("binds procedure view and record start to distinct callbacks", () => {
    const html = renderToStaticMarkup(
      <TodaySupportDayBoard
        items={[stubTodayItem({ occurrenceId: "occ-wire", userId: "user-a" })]}
        onSelectOccurrence={() => undefined}
        onStartProcedureRecord={() => undefined}
      />,
    );
    expect(html).toContain("手順を表示");
    expect(html).toContain("この予定を記録");
    expect(html).toContain('data-kiosk-occurrence-cta="procedure"');
    expect(html).toContain('data-kiosk-occurrence-cta="record"');
    expect(html).not.toContain("この予定を記録 / 手順表示");
  });

  it("invokes occurrence view vs record start separately", () => {
    const viewed: string[] = [];
    const recorded: string[] = [];
    const container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      ReactDOM.render(
        <TodaySupportDayBoard
          items={[stubTodayItem({ occurrenceId: "occ-wire", userId: "user-a" })]}
          onSelectOccurrence={(id) => {
            viewed.push(id);
          }}
          onStartProcedureRecord={(id) => {
            recorded.push(id);
          }}
        />,
        container,
      );
    });
    const procedure = container.querySelector(
      '[data-kiosk-occurrence-cta="procedure"]',
    ) as HTMLButtonElement;
    const record = container.querySelector(
      '[data-kiosk-occurrence-cta="record"]',
    ) as HTMLButtonElement;
    act(() => {
      procedure.click();
    });
    act(() => {
      record.click();
    });
    expect(viewed).toEqual(["occ-wire"]);
    expect(recorded).toEqual(["occ-wire"]);
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    document.body.removeChild(container);
  });
});
