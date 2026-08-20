import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { CurrentProcedure } from "./CurrentProcedure";

function renderCurrent(
  container: HTMLElement,
  props: React.ComponentProps<typeof CurrentProcedure>,
): void {
  act(() => {
    ReactDOM.render(<CurrentProcedure {...props} />, container);
  });
}

describe("CurrentProcedure cancellation CTA", () => {
  let container: HTMLDivElement;

  const presentation = {
    heading: "現在の支援手順",
    summaryPrompt: "summary",
    context: {
      userId: "user-a",
      personLabel: "Aさん",
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      planId: "plan-001",
      planVersion: 1,
      procedureId: "proc-lunch",
      procedureVersion: "v1",
      planPeriodLabel: "合成期間",
      occurrenceId: "occ-001",
    },
    projection: {
      sceneLabel: "scene",
      performLabels: ["do"],
      avoidLabels: ["avoid"],
      noteLabel: "note",
    },
    canStartProcedureRecord: false,
    occurrenceStatus: "記録済み" as const,
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    document.body.removeChild(container);
  });

  it("shows cancellation CTA as primary when request handler exists", () => {
    const onCancellationRequest = jest.fn();
    renderCurrent(container, {
      presentation,
      onCancellationRequest,
      onCorrectionRequest: jest.fn(),
      onAbcObservationRequest: jest.fn(),
    });

    const button = container.querySelector(
      '[data-field-workflow="record-cancellation-cta"]',
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    act(() => {
      button.click();
    });
    expect(onCancellationRequest).toHaveBeenCalledTimes(1);
  });

  it("shows unavailable reason for uncancellable status", () => {
    renderCurrent(container, {
      presentation: { ...presentation, occurrenceStatus: "取消済み" },
      onAbcObservationRequest: jest.fn(),
    });

    const note = container.querySelector(
      '[data-field-workflow="record-cancellation-status-note"]',
    ) as HTMLElement;
    expect(note.textContent).toContain("取消済み");
    expect(container.querySelector('[data-field-workflow="record-cancellation-cta"]')).toBeNull();
  });
});
