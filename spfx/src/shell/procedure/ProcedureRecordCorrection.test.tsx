import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { createInMemoryProcedureRecordCorrectionPersistencePort } from "../../sbs-domain/correction-persist.bundle";
import { KIOSK_RECORD_1, getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { ProcedureRecordCorrection } from "./ProcedureRecordCorrection";
import { buildProcedureCorrectionOriginalBinding } from "./procedure-correction-binding";
import { presentProcedureCorrection } from "./procedure-correction";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

function renderCorrection(
  container: HTMLElement,
  props: React.ComponentProps<typeof ProcedureRecordCorrection>,
): void {
  act(() => {
    ReactDOM.render(<ProcedureRecordCorrection {...props} />, container);
  });
}

describe("ProcedureRecordCorrection save wiring", () => {
  let container: HTMLDivElement;
  let items: ReturnType<typeof getKioskSyntheticTodaySupportItems>;
  let recorded: (typeof items)[number];
  let context: {
    userId: string;
    personLabel: string;
    organizationId: string;
    siteId: string;
    planId: string;
    planVersion: number;
    procedureId: string;
    procedureVersion: string;
    planPeriodLabel: string;
    occurrenceId: string;
  };
  let presentation: NonNullable<ReturnType<typeof presentProcedureCorrection>>;
  let originalBinding: NonNullable<ReturnType<typeof buildProcedureCorrectionOriginalBinding>>;

  beforeAll(() => {
    items = getKioskSyntheticTodaySupportItems();
    recorded = items.find((item) => item.effectiveStatus === "記録済み")!;
    context = {
      userId: recorded.userId,
      personLabel: recorded.personLabel,
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      planId: recorded.planId,
      planVersion: recorded.planVersion,
      procedureId: recorded.procedure.ProcedureId,
      procedureVersion: recorded.procedure.ProcedureVersion,
      planPeriodLabel: "合成期間",
      occurrenceId: recorded.occurrenceId,
    };
    presentation = presentProcedureCorrection(recorded, context)!;
    originalBinding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1)!;
  });

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

  it("disables save CTA when reason is blank", () => {
    renderCorrection(container, { presentation, originalBinding });
    const saveButton = container.querySelector(
      '[data-field-workflow="procedure-correction-save"]',
    ) as HTMLButtonElement;
    expect(saveButton).toBeTruthy();
    expect(saveButton.disabled).toBe(true);
  });

  it("transitions to saved on happy path against in-memory port", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const onSaveStateChange = jest.fn();
    renderCorrection(container, {
      presentation,
      originalBinding,
      persistPort: port,
      nowIso: () => "2026-08-17T21:10:00+09:00",
      onSaveStateChange,
      initialDraft: {
        result: "PERFORMED_AS_PLANNED",
        performedAtLocal: "2026-08-17T21:05",
        reason: "記録内容の訂正",
      },
    });

    const saveButton = container.querySelector(
      '[data-field-workflow="procedure-correction-save"]',
    ) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);

    await act(async () => {
      saveButton.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    const root = container.querySelector('[data-field-workflow="procedure-record-correction"]');
    expect(root?.getAttribute("data-field-workflow-save-state")).toBe("saved");
    expect(
      container.querySelector('[data-field-workflow="correction-submitted-summary"]'),
    ).toBeTruthy();
    expect(port.storage.appendCalls).toBe(1);
    expect(onSaveStateChange).toHaveBeenCalledWith("saved");
  });

  it("shows disabled-only save when originalBinding is absent", () => {
    renderCorrection(container, { presentation, originalBinding: undefined });
    expect(
      container.querySelector('[data-field-workflow="procedure-correction-save-disabled"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-field-workflow="procedure-correction-save"]')).toBeNull();
  });
});
