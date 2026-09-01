import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act, Simulate } from "react-dom/test-utils";
import { MonitoringView } from "./MonitoringView";
import { buildDemoMonitoringForVersion } from "./monitoring-fixture";
import type { MonitoringReadModel } from "../../sbs-domain/monitoring-read-model.bundle";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../users/support-plan-fixture";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

function resolvedMonitoringVersion(planVersion: number): MonitoringReadModel {
  const result = buildDemoMonitoringForVersion(planVersion);
  if (result.status !== "RESOLVED") {
    throw new Error(`expected RESOLVED monitoring fixture for version ${planVersion}`);
  }
  return result.value;
}

function withEvidenceRecordId(model: MonitoringReadModel, suffix: string): MonitoringReadModel {
  return {
    ...model,
    records: model.records.map((record) => ({
      ...record,
      RecordId: `${record.RecordId}-${suffix}`,
    })),
  };
}

function renderMonitoring(container: Element, model: MonitoringReadModel): void {
  ReactDOM.render(<MonitoringView model={model} personLabel="Aさん" />, container);
}

function enterReason(container: Element, value: string): void {
  const textarea = container.querySelector<HTMLTextAreaElement>(
    '[data-review-outcome-reason-input="true"]',
  );
  if (!textarea) throw new Error("expected reason textarea");
  textarea.value = value;
  Simulate.change(textarea);
}

function clickDecision(container: Element, decision: "NO_CHANGE" | "CHANGE_REQUIRED"): void {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-review-outcome-action="${decision}"]`,
  );
  if (!button) throw new Error(`expected ${decision} button`);
  button.click();
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
    expect(html).toContain("判断理由");
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

  it("R9-R10 binds session capture to current evidence and supports A-B-A recurrence", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const modelA = withEvidenceRecordId(resolvedMonitoringVersion(3), "A");
    const modelB = withEvidenceRecordId(resolvedMonitoringVersion(3), "B");

    act(() => renderMonitoring(container, modelA));
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();
    act(() => enterReason(container, "reason A"));
    act(() => clickDecision(container, "CHANGE_REQUIRED"));
    expect(container.textContent).toContain("デモ上の見直し結果: 変更が必要");
    expect(container.textContent).toContain("判断理由: reason A");
    expect(container.textContent).not.toContain("補足メモ:");

    act(() => renderMonitoring(container, modelB));
    expect(container.textContent).toContain("見直し結果: 未判断");
    expect(container.textContent).not.toContain("判断理由: reason A");
    expect(container.textContent).not.toContain("補足メモ:");
    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]')
        ?.value,
    ).toBe("");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();

    act(() => clickDecision(container, "NO_CHANGE"));
    expect(container.textContent).toContain("デモ上の見直し結果: 変更なし");
    expect(container.textContent).not.toContain("補足メモ:");
    expect(container.textContent).not.toContain("判断理由:");
    expect(
      container.querySelector<HTMLButtonElement>('[data-review-outcome-action="NO_CHANGE"]')
        ?.disabled,
    ).toBe(true);

    act(() => renderMonitoring(container, modelA));
    expect(container.textContent).toContain("見直し結果: 未判断");
    expect(container.textContent).not.toContain("補足メモ:");
    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]')
        ?.value,
    ).toBe("");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();

    act(() => enterReason(container, "reason renewed"));
    act(() => clickDecision(container, "CHANGE_REQUIRED"));
    expect(container.textContent).toContain("デモ上の見直し結果: 変更が必要");
    const reasonReadbacks = container.querySelectorAll(
      '[data-review-outcome-reason-readback="true"]',
    );
    const noteReadbacks = container.querySelectorAll('[data-review-outcome-note-readback="true"]');
    expect(reasonReadbacks).toHaveLength(1);
    expect(reasonReadbacks[0]?.textContent).toBe("判断理由: reason renewed");
    expect(noteReadbacks).toHaveLength(0);
    expect(container.textContent).not.toContain("判断理由: reason A");

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });
});
