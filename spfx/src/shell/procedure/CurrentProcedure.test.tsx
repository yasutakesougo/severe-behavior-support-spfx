import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { CurrentProcedure, type CurrentProcedureProps } from "./CurrentProcedure";
import type { AnyShellCurrentProcedurePresentation } from "./procedure-types";

describe("CurrentProcedure Component (A2 / W2-A presentation integration)", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  const baseResolvedPresentation: AnyShellCurrentProcedurePresentation = {
    heading: "現在の支援手順",
    summaryPrompt: "昼食準備の手順を確認します。",
    lookupStatus: "RESOLVED",
    canStartProcedureRecord: true,
    occurrenceStatus: "未実施",
    context: {
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      userId: "user-a",
      personLabel: "Aさん",
      procedureId: "proc-lunch",
      procedureVersion: "v1",
      planId: "plan-001",
      planVersion: 1,
      planPeriodLabel: "第1版",
      occurrenceId: "occ-123",
    },
    projection: {
      sceneLabel: "昼食準備・配膳見守り",
      performLabels: ["食具の配置を確認する", "落ち着いた声かけを行う"],
      avoidLabels: ["急かすような促しを避ける"],
      noteLabel: "食事前の手洗いを促す",
    },
  };

  it("TC-REG-01: UserDetail path (readOnly: false / omitted) completely preserves existing CTA buttons and DOM headings", () => {
    const onRecordProcedureRequest = jest.fn();
    const onAbcObservationRequest = jest.fn();
    const onBackToUserDetail = jest.fn();

    const props: CurrentProcedureProps = {
      presentation: baseResolvedPresentation,
      backLabel: "← 利用者詳細",
      readOnly: false,
      onBackToUserDetail,
      onRecordProcedureRequest,
      onAbcObservationRequest,
    };

    act(() => {
      ReactDOM.render(<CurrentProcedure {...props} />, container);
    });

    // Verify procedure flow body is rendered
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
    expect(container.querySelector('[data-field-workflow="procedure-scene"]')?.textContent).toBe(
      "昼食準備・配膳見守り",
    );

    // Verify record CTA heading and buttons exist
    const heading = document.getElementById("field-workflow-record-cta-heading");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("この手順を記録");

    const recordBtn = container.querySelector(
      '[data-field-workflow="record-procedure-cta"]',
    ) as HTMLButtonElement | null;
    expect(recordBtn).not.toBeNull();
    expect(recordBtn?.disabled).toBe(false);

    act(() => {
      recordBtn?.click();
    });
    expect(onRecordProcedureRequest).toHaveBeenCalledTimes(1);

    const abcBtn = container.querySelector(
      '[data-field-workflow="abc-observation-cta"]',
    ) as HTMLButtonElement | null;
    expect(abcBtn).not.toBeNull();

    act(() => {
      abcBtn?.click();
    });
    expect(onAbcObservationRequest).toHaveBeenCalledTimes(1);
  });

  it("TC-READONLY-DOM-01: Overview path (readOnly: true) strictly omits all operation CTA sections from DOM", () => {
    const onBackToUserDetail = jest.fn();

    const props: CurrentProcedureProps = {
      presentation: {
        ...baseResolvedPresentation,
        canStartProcedureRecord: false, // U6-A invariant
      },
      backLabel: "← 今日の支援",
      readOnly: true, // Overview read-only path
      onBackToUserDetail,
      onRecordProcedureRequest: undefined,
      onCorrectionRequest: undefined,
      onCancellationRequest: undefined,
      onAbcObservationRequest: undefined,
    };

    act(() => {
      ReactDOM.render(<CurrentProcedure {...props} />, container);
    });

    // 1. Procedure body is displayed cleanly
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
    expect(container.querySelector('[data-field-workflow="procedure-scene"]')?.textContent).toBe(
      "昼食準備・配膳見守り",
    );

    // 2. All operation headings and CTA buttons are completely absent (toBeNull)
    expect(document.getElementById("field-workflow-record-cta-heading")).toBeNull();
    expect(document.getElementById("field-workflow-cancellation-cta-heading")).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-procedure-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-correction-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="record-cancellation-cta"]')).toBeNull();
    expect(container.querySelector('[data-field-workflow="abc-observation-cta"]')).toBeNull();

    // 3. Back button remains functional
    const backBtn = container.querySelector(
      '[data-field-workflow="current-procedure-back"]',
    ) as HTMLButtonElement | null;
    expect(backBtn).not.toBeNull();
    expect(backBtn?.textContent).toBe("← 今日の支援");

    act(() => {
      backBtn?.click();
    });
    expect(onBackToUserDetail).toHaveBeenCalledTimes(1);
  });

  it("TC-CONFLICT-01: Occurrence with '確認が必要' renders procedure-conflict-warning banner above body", () => {
    const props: CurrentProcedureProps = {
      presentation: {
        ...baseResolvedPresentation,
        occurrenceStatus: "確認が必要",
        canStartProcedureRecord: false,
      },
      readOnly: true,
    };

    act(() => {
      ReactDOM.render(<CurrentProcedure {...props} />, container);
    });

    const warningBanner = container.querySelector(
      '[data-field-workflow="procedure-conflict-warning"]',
    );
    expect(warningBanner).not.toBeNull();
    expect(warningBanner?.getAttribute("role")).toBe("alert");
    expect(warningBanner?.textContent).toContain("確認が必要");
    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).not.toBeNull();
  });

  it("TC-LOADING-DOM-01: lookupStatus === 'LOADING' displays loading skeleton and hides procedure body", () => {
    const props: CurrentProcedureProps = {
      presentation: {
        ...baseResolvedPresentation,
        lookupStatus: "LOADING",
        projection: undefined,
        canStartProcedureRecord: false,
      },
      readOnly: true,
    };

    act(() => {
      ReactDOM.render(<CurrentProcedure {...props} />, container);
    });

    expect(container.querySelector('[data-field-workflow="procedure-flow"]')).toBeNull();
    const loadingSection = container.querySelector(
      '[data-field-workflow="procedure-loading-section"]',
    );
    expect(loadingSection).not.toBeNull();
    expect(loadingSection?.getAttribute("role")).toBe("status");
    expect(loadingSection?.getAttribute("aria-busy")).toBe("true");
  });
});
