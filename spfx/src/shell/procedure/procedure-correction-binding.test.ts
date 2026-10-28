if (typeof globalThis.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.TextEncoder = require("util").TextEncoder;
}
import { KIOSK_RECORD_1, getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { buildProcedureCorrectionOriginalBinding } from "./procedure-correction-binding";

describe("procedure-correction-binding", () => {
  const items = getKioskSyntheticTodaySupportItems();
  const recordedItem = items.find((item) => item.effectiveStatus === "記録済み")!;

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
    occurrenceId: recordedItem.occurrenceId,
  };

  it("builds binding from bound record, context, and valid occurrenceSource (synthetic TodaySupportItem)", () => {
    const binding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, recordedItem);
    expect(binding).toEqual({
      originalRecordId: KIOSK_RECORD_1.RecordId,
      OrganizationId: KIOSK_RECORD_1.OrganizationId,
      SiteId: KIOSK_RECORD_1.SiteId,
      UserId: KIOSK_RECORD_1.UserId,
      Procedure: {
        ProcedureId: context.procedureId,
        ProcedureVersion: context.procedureVersion,
        ApprovalState: "APPROVED",
      },
      planId: context.planId,
      planVersion: context.planVersion,
      originalRecordedAt: KIOSK_RECORD_1.recordedAt,
      originalRecordedBy: KIOSK_RECORD_1.recordedBy,
      originalLocalDate: KIOSK_RECORD_1.LocalDate,
    });
  });

  it("fail-closes when occurrenceSource is omitted or undefined", () => {
    expect(buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1)).toBeUndefined();
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, undefined),
    ).toBeUndefined();
  });

  it("fail-closes when context.occurrenceId is missing or mismatched", () => {
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, occurrenceId: undefined },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, occurrenceId: "" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, occurrenceId: "mismatched-occ" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();
  });

  it("fail-closes when bound record is missing", () => {
    expect(
      buildProcedureCorrectionOriginalBinding(context, undefined, recordedItem),
    ).toBeUndefined();
    expect(
      buildProcedureCorrectionOriginalBinding(undefined, KIOSK_RECORD_1, recordedItem),
    ).toBeUndefined();
  });

  it("fail-closes when required binding fields are absent", () => {
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, planId: "" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();
  });

  it("fail-closes when context and bound record metadata mismatch (SBS-U6-A cross-check)", () => {
    // userId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, userId: "other-user" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // organizationId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, organizationId: "other-org" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // siteId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, siteId: "other-site" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // planId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, planId: "other-plan" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // planVersion mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, planVersion: 99 },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // procedureId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, procedureId: "other-proc" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();

    // procedureVersion mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(
        { ...context, procedureVersion: "v99" },
        KIOSK_RECORD_1,
        recordedItem,
      ),
    ).toBeUndefined();
  });

  it("validates independent occurrenceSource and rejects LocalDate or RecordId mismatch (Fix 2)", () => {
    const validRecordedSource = {
      occurrenceId: recordedItem.occurrenceId,
      localDate: KIOSK_RECORD_1.LocalDate,
      rawResolverResult: {
        status: "RECORDED",
        effectiveRecordId: KIOSK_RECORD_1.RecordId,
      },
    };

    // Valid RECORDED source
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, validRecordedSource),
    ).toBeDefined();

    // LocalDate mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, {
        ...validRecordedSource,
        localDate: "2099-01-01",
      }),
    ).toBeUndefined();

    // OccurrenceId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, {
        ...validRecordedSource,
        occurrenceId: "other-occ-id",
      }),
    ).toBeUndefined();

    // RECORDED effectiveRecordId mismatch
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, {
        ...validRecordedSource,
        rawResolverResult: {
          status: "RECORDED",
          effectiveRecordId: "tampered-record-id",
        },
      }),
    ).toBeUndefined();

    // CANCELLED status with matching targetRecordId
    const validCancelledSource = {
      occurrenceId: recordedItem.occurrenceId,
      localDate: KIOSK_RECORD_1.LocalDate,
      rawResolverResult: {
        status: "CANCELLED",
        targetRecordId: KIOSK_RECORD_1.RecordId,
      },
    };
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, validCancelledSource),
    ).toBeDefined();

    // CANCELLED status with mismatched targetRecordId
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, {
        ...validCancelledSource,
        rawResolverResult: {
          status: "CANCELLED",
          targetRecordId: "other-target-id",
        },
      }),
    ).toBeUndefined();

    // CONFLICT or INVALID status
    expect(
      buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1, {
        ...validRecordedSource,
        rawResolverResult: {
          status: "CONFLICT",
        },
      }),
    ).toBeUndefined();
  });
});
