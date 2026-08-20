import { createInMemoryProcedureRecordCancellationPersistencePort } from "../../sbs-domain/cancellation-persist.bundle";
import { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { presentProcedureCancellation } from "./procedure-cancellation";
import {
  buildStaffProcedureRecordCancellationSaveInput,
  persistStaffProcedureRecordCancellationFromForm,
} from "./procedure-cancellation-persist";
import { FIELD_WORKFLOW_RECORDER_SUBJECT_ID } from "./procedure-fixture";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

describe("procedure-cancellation-persist", () => {
  const item = getKioskSyntheticTodaySupportItems().find((x) => x.effectiveStatus === "記録済み")!;
  const context = {
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
  };
  const presentation = presentProcedureCancellation(item, context)!;

  it("maps form input to submitCancellation against in-memory port", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const result = await persistStaffProcedureRecordCancellationFromForm(
      buildStaffProcedureRecordCancellationSaveInput({
        presentation,
        reason: "記録取り消しテスト",
        cancelledBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-20T14:00:00.000Z",
      }),
      port,
    );

    expect(result.saveState).toBe("saved");
    expect(result.appendCalled).toBe(true);
    expect(result.event?.targetRecordId).toBe(presentation.recordId);
    expect(port.storage.appendCalls).toBe(1);
  });

  it("keeps same frozen submission on retry and avoids second append", async () => {
    const port = createInMemoryProcedureRecordCancellationPersistencePort();
    const input = buildStaffProcedureRecordCancellationSaveInput({
      presentation,
      reason: "同一再試行",
      cancelledBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
      recordedAtIso: "2026-08-20T14:10:00.000Z",
      nowIso: "2026-08-20T14:10:00.000Z",
    });

    const first = await persistStaffProcedureRecordCancellationFromForm(input, port);
    const second = await persistStaffProcedureRecordCancellationFromForm(input, port);

    expect(first.saveState).toBe("saved");
    expect(second.saveState).toBe("saved");
    expect(port.storage.appendCalls).toBe(1);
  });
});
