import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MonitoringView } from "./MonitoringView";
import { buildDemoMonitoringForVersion } from "./monitoring-fixture";
import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../users/support-plan-fixture";

function resolvedMonitoringVersion(planVersion: number): MonitoringReadModel {
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

  it("elevates person identity and exposes at-a-glance summary vs materials role cues", () => {
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

    expect(html).toContain('data-monitoring-person-identity="true"');
    expect(html).toContain('data-monitoring-role-cue="summary"');
    expect(html).toContain("期間の件数確認");
    expect(html).toContain('data-human-review-person-identity="true"');
    expect(html).toContain('data-human-review-role-cue="materials"');
    expect(html).toContain("個別の事実資料");
    expect(html).toContain("評価・承認・変更要否の判断は人が行います");
    expect(html.indexOf("Aさん")).toBeLessThan(html.indexOf("計画版 3"));
    expect(html.indexOf("期間の件数確認")).toBeLessThan(html.indexOf("個別の事実資料"));
    expect(html).not.toContain("版管理");
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
    expect(html).toContain('data-monitoring-person-identity="true"');
    expect(html).toContain('data-monitoring-role-cue="summary"');
    expect(html).not.toContain("data-monitoring-record-id=");
    expect(html).not.toContain("data-human-review-record-id=");
  });
});
