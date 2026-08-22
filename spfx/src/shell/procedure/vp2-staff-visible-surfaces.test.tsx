import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { AbcObservationPresentation } from "./AbcObservationPresentation";
import { presentAbcObservation } from "./abc-presentation";
import { KIOSK_RECORD_1, getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { ProcedureRecordCancellation } from "./ProcedureRecordCancellation";
import { ProcedureRecordCorrection } from "./ProcedureRecordCorrection";
import { ProcedureRecordForm } from "./ProcedureRecordForm";
import { presentProcedureCancellation } from "./procedure-cancellation";
import { buildProcedureCorrectionOriginalBinding } from "./procedure-correction-binding";
import { presentProcedureCorrection } from "./procedure-correction";
import { findVp2StaffVisibleForbiddenTokens } from "./vp2-staff-visible-copy";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

function assertStaffVisibleTextIsClean(container: HTMLElement): void {
  const text = container.textContent ?? "";
  expect(findVp2StaffVisibleForbiddenTokens(text)).toEqual([]);
}

describe("VP-2 staff-visible surface purity", () => {
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

  it("Record Form keeps binding data-* while omitting technical ids from textContent", () => {
    act(() => {
      ReactDOM.render(
        <ProcedureRecordForm context={context} onBackToCurrentProcedure={() => undefined} />,
        container,
      );
    });

    const root = container.querySelector(
      '[data-field-workflow="procedure-record-form"]',
    ) as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute("data-field-workflow-plan-id")).toBe(context.planId);
    expect(root.getAttribute("data-field-workflow-occurrence-id")).toBe(context.occurrenceId);
    expect(container.textContent).toContain("再選択は不要です");
    expect(container.textContent).not.toContain("引き継いだ文脈");
    assertStaffVisibleTextIsClean(container);
  });

  it("Correction omits OccurrenceId / RecordId / opaque recorder from textContent", () => {
    const presentation = presentProcedureCorrection(recorded, context)!;
    const originalBinding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1)!;
    act(() => {
      ReactDOM.render(
        <ProcedureRecordCorrection presentation={presentation} originalBinding={originalBinding} />,
        container,
      );
    });

    const root = container.querySelector(
      '[data-field-workflow="procedure-record-correction"]',
    ) as HTMLElement;
    expect(root?.getAttribute("data-field-workflow-occurrence-id")).toBe(presentation.occurrenceId);
    expect(root?.getAttribute("data-field-workflow-record-id")).toBe(presentation.recordId);
    expect(container.textContent).toContain("予定");
    expect(container.textContent).not.toContain("記録者");
    assertStaffVisibleTextIsClean(container);
  });

  it("Cancellation omits technical ids and opaque recorder from textContent", () => {
    const presentation = presentProcedureCancellation(recorded, context)!;
    act(() => {
      ReactDOM.render(
        <ProcedureRecordCancellation
          presentation={presentation}
          onBackToCurrentProcedure={() => undefined}
        />,
        container,
      );
    });

    const root = container.querySelector(
      '[data-field-workflow="procedure-record-cancellation"]',
    ) as HTMLElement;
    expect(root?.getAttribute("data-field-workflow-occurrence-id")).toBe(presentation.occurrenceId);
    expect(root?.getAttribute("data-field-workflow-record-id")).toBe(presentation.recordId);
    expect(container.textContent).not.toContain("記録者");
    assertStaffVisibleTextIsClean(container);
  });

  it("ABC has no visible internal-id section and avoids forbidden tokens", () => {
    const presentation = presentAbcObservation(context)!;
    act(() => {
      ReactDOM.render(
        <AbcObservationPresentation
          presentation={presentation}
          onBackToCurrentProcedure={() => undefined}
        />,
        container,
      );
    });

    expect(container.querySelector('[data-field-workflow="abc-binding-context"]')).toBeNull();
    expect(container.textContent).toContain("ABC観察");
    expect(container.textContent).toContain("再選択は不要です");
    assertStaffVisibleTextIsClean(container);
  });
});
