import {
  createInMemoryProcedureRecordCorrectionPersistencePort,
} from "../../sbs-domain/correction-persist.bundle";
import { KIOSK_RECORD_1 } from "./kiosk-today-support-fixture";
import { buildProcedureCorrectionOriginalBinding } from "./procedure-correction-binding";
import {
  buildStaffProcedureRecordCorrectionSaveInput,
  persistStaffProcedureRecordCorrectionFromForm,
} from "./procedure-correction-persist";
import { FIELD_WORKFLOW_RECORDER_SUBJECT_ID } from "./procedure-fixture";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

describe("procedure-correction-persist", () => {
  const context = {
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
  };

  const originalBinding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1)!;

  it("maps staff form input to saved against in-memory port", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const result = await persistStaffProcedureRecordCorrectionFromForm(
      buildStaffProcedureRecordCorrectionSaveInput({
        originalBinding,
        draft: {
          result: "PERFORMED_WITH_ADAPTATION",
          performedAtLocal: "2026-08-17T21:05",
          reason: "実施結果の訂正",
        },
        correctedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-17T21:10:00+09:00",
      }),
      port,
    );
    expect(result.appendCalled).toBe(true);
    expect(result.saveState).toBe("saved");
    expect(result.correction?.reason).toBe("実施結果の訂正");
    expect(port.storage.appendCalls).toBe(1);
  });

  it("returns save_failed without append for cross-date performedAt", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const result = await persistStaffProcedureRecordCorrectionFromForm(
      buildStaffProcedureRecordCorrectionSaveInput({
        originalBinding,
        draft: {
          result: "PERFORMED_AS_PLANNED",
          performedAtLocal: "2026-08-18T09:00",
          reason: "日付をまたぐ訂正",
        },
        correctedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-17T21:10:00+09:00",
      }),
      port,
    );
    expect(result.saveState).toBe("save_failed");
    expect(port.storage.appendCalls).toBe(0);
  });

  it("returns save_failed for NOT_AUTHORIZED auth override", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const result = await persistStaffProcedureRecordCorrectionFromForm(
      buildStaffProcedureRecordCorrectionSaveInput({
        originalBinding,
        draft: {
          result: "PERFORMED_AS_PLANNED",
          performedAtLocal: "2026-08-17T21:05",
          reason: "権限なし",
        },
        correctedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
        nowIso: "2026-08-17T21:10:00+09:00",
        auth: { status: "NOT_AUTHORIZED" },
      }),
      port,
    );
    expect(result.saveState).toBe("save_failed");
    expect(result.correction).toBeNull();
    expect(port.storage.appendCalls).toBe(0);
  });

  it("replays identical submit without second append", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const input = buildStaffProcedureRecordCorrectionSaveInput({
      originalBinding,
      draft: {
        result: "PERFORMED_AS_PLANNED",
        performedAtLocal: "2026-08-17T21:05",
        reason: "再試行テスト",
      },
      correctedBy: FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
      correctedAtIso: "2026-08-17T21:10:00+09:00",
      nowIso: "2026-08-17T21:10:00+09:00",
    });
    const first = await persistStaffProcedureRecordCorrectionFromForm(input, port);
    const second = await persistStaffProcedureRecordCorrectionFromForm(input, port);
    expect(first.saveState).toBe("saved");
    expect(second.saveState).toBe("saved");
    expect(port.storage.appendCalls).toBe(1);
  });
});
