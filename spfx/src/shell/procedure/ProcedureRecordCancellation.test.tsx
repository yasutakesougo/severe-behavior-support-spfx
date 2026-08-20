import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { createInMemoryProcedureRecordCancellationPersistencePort } from "../../sbs-domain/cancellation-persist.bundle";
import { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { ProcedureRecordCancellation } from "./ProcedureRecordCancellation";
import { presentProcedureCancellation } from "./procedure-cancellation";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

function renderCancellation(
  container: HTMLElement,
  props: React.ComponentProps<typeof ProcedureRecordCancellation>,
): void {
  act(() => {
    ReactDOM.render(<ProcedureRecordCancellation {...props} />, container);
  });
}

describe("ProcedureRecordCancellation", () => {
  let container: HTMLDivElement;
  const item = getKioskSyntheticTodaySupportItems().find((x) => x.effectiveStatus === "記録済み")!;
  const presentation = presentProcedureCancellation(item, {
    userId: item.userId,
    personLabel: item.personLabel,
    organizationId: "synthetic-org-001",
    siteId: "SITE-ISG",
    planId: item.planId,
    planVersion: item.planVersion,
    procedureId: item.procedure.ProcedureId,
    procedureVersion: item.procedure.ProcedureVersion,
    planPeriodLabel: "合成期間",
    occurrenceId: item.occurrenceId,
  })!;

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

  it("requires valid reason before first action", () => {
    renderCancellation(container, { presentation });
    const beginButton = container.querySelector(
      '[data-field-workflow="procedure-cancellation-open-confirm"]',
    ) as HTMLButtonElement;
    expect(beginButton.disabled).toBe(true);
  });

  it("saves with two-step confirmation and reports cancelled", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const onCancelled = jest.fn();
    const onSaveStateChange = jest.fn();

    renderCancellation(container, {
      presentation,
      persistPort: port,
      nowIso: () => "2026-08-20T14:30:00.000Z",
      onCancelled,
      onSaveStateChange,
    });

    const reason = container.querySelector(
      '[data-field-workflow="procedure-cancellation-reason-input"]',
    ) as HTMLTextAreaElement;
    const beginButton = container.querySelector(
      '[data-field-workflow="procedure-cancellation-open-confirm"]',
    ) as HTMLButtonElement;
    const submitButton = container.querySelector(
      '[data-field-workflow="procedure-cancellation-confirm-submit"]',
    ) as HTMLButtonElement;

    act(() => {
      reason.value = "取り消し理由";
      reason.dispatchEvent(new Event("input", { bubbles: true }));
      reason.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(beginButton.disabled).toBe(false);

    act(() => {
      beginButton.click();
    });

    expect(submitButton.disabled).toBe(false);

    await act(async () => {
      submitButton.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    const root = container.querySelector('[data-field-workflow="procedure-record-cancellation"]');
    expect(root?.getAttribute("data-field-workflow-save-state")).toBe("saved");
    expect(
      container.querySelector('[data-field-workflow="procedure-cancellation-submitted-summary"]'),
    ).toBeTruthy();
    expect(onCancelled).toHaveBeenCalledWith(presentation.occurrenceId);
    expect(onSaveStateChange).toHaveBeenCalledWith("saved");
    expect(port.storage.appendCalls).toBe(1);
  });

  it("keeps confirm submit disabled when save state is unknown", () => {
    renderCancellation(container, {
      presentation,
      initialSaveState: "save_outcome_unknown",
    });
    const submitButton = container.querySelector(
      '[data-field-workflow="procedure-cancellation-confirm-submit"]',
    ) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });
});
