import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MonitoringView } from "./MonitoringView";
import { buildDemoMonitoringForVersion } from "./monitoring-fixture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../users/support-plan-fixture";

function resolvedMonitoringVersion(planVersion: number) {
  const result = buildDemoMonitoringForVersion(planVersion);
  if (result.status !== "RESOLVED") {
    throw new Error(`expected RESOLVED monitoring fixture for version ${planVersion}`);
  }
  return result.value;
}

describe("MonitoringView", () => {
  it("keeps Monitoring summary-only while Human Review owns RecordId-bound detail", () => {
    const html = renderToStaticMarkup(
      <MonitoringView
        model={resolvedMonitoringVersion(3)}
        personLabel="Aさん"
        procedureLabelContext={{
          userId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
          planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
          currentVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
          currentProcedures: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures,
        }}
      />,
    );

    expect(html).toContain('data-monitoring-summary-only="true"');
    expect(html).toContain("期間モニタリング（概要）");
    expect(html).not.toContain("data-monitoring-record-id=");
    expect(html).not.toContain("data-monitoring-record-list=");
    expect(html.match(/data-human-review-record-id=/g)).toHaveLength(1);
    expect(html).toContain('data-human-review-scene-label="true"');
    expect(html).toContain(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures[0].sceneLabel);
    expect(html).toContain("synthetic-procedure-p3");
  });

  it("retains zero-record factual semantics without creating per-record detail", () => {
    const html = renderToStaticMarkup(
      <MonitoringView
        model={resolvedMonitoringVersion(1)}
        personLabel="Aさん"
        procedureLabelContext={{
          userId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
          planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
          currentVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
          currentProcedures: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures,
        }}
      />,
    );

    expect(html).toContain('data-monitoring-empty="true"');
    expect(html).toContain("この期間・計画版に一致する実施記録はありません。");
    expect(html).toContain("0件であることは、「実施できなかった」という結果を意味しません。");
    expect(html).not.toContain("data-monitoring-record-id=");
    expect(html).not.toContain("data-human-review-record-id=");
  });
});
