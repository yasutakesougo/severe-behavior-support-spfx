import { getKioskSyntheticTodaySupportItems, KIOSK_RECORD_1 } from "./kiosk-today-support-fixture";
import {
  presentProcedureCancellation,
  reasonWhyCancellationHidden,
} from "./procedure-cancellation";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

describe("procedure-cancellation presentation", () => {
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

  it("presents cancellable target only for RECORDED + 記録済み + effective binding match", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み")!;
    const presented = presentProcedureCancellation(recorded, {
      ...context,
      occurrenceId: recorded.occurrenceId,
    });

    expect(presented?.recordId).toBe(recorded.boundRecord?.RecordId);
    expect(presented?.occurrenceStatus).toBe("記録済み");
    expect(presented?.boundRecord.RecordId).toBe(KIOSK_RECORD_1.RecordId);
  });

  it("hides for UNRECORDED/CANCELLED/CONFLICT and returns status reason", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const unrecorded = items.find((item) => item.effectiveStatus === "未実施")!;
    const cancelled = items.find((item) => item.effectiveStatus === "取消済み")!;
    const conflict = items.find((item) => item.effectiveStatus === "確認が必要")!;

    expect(presentProcedureCancellation(unrecorded, context)).toBeUndefined();
    expect(presentProcedureCancellation(cancelled, context)).toBeUndefined();
    expect(presentProcedureCancellation(conflict, context)).toBeUndefined();

    expect(reasonWhyCancellationHidden(unrecorded.rawResolverResult)).toContain("未実施");
    expect(reasonWhyCancellationHidden(cancelled.rawResolverResult)).toContain("取消済み");
    expect(reasonWhyCancellationHidden(conflict.rawResolverResult)).toContain("確認が必要");
  });

  it("fails closed when effective record binding is missing or mismatched", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み")!;
    expect(
      presentProcedureCancellation(
        {
          ...recorded,
          boundRecord: undefined,
        },
        context,
      ),
    ).toBeUndefined();

    expect(
      presentProcedureCancellation(
        {
          ...recorded,
          boundRecord: {
            ...recorded.boundRecord!,
            RecordId: "other-record",
          },
        },
        context,
      ),
    ).toBeUndefined();
  });
});
