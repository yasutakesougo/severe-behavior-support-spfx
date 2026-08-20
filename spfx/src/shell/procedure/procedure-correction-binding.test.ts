import { KIOSK_RECORD_1 } from "./kiosk-today-support-fixture";
import { buildProcedureCorrectionOriginalBinding } from "./procedure-correction-binding";

describe("procedure-correction-binding", () => {
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

  it("builds binding from bound record and context", () => {
    const binding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1);
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

  it("fail-closes when bound record is missing", () => {
    expect(buildProcedureCorrectionOriginalBinding(context, undefined)).toBeUndefined();
    expect(buildProcedureCorrectionOriginalBinding(undefined, KIOSK_RECORD_1)).toBeUndefined();
  });

  it("fail-closes when required binding fields are absent", () => {
    expect(
      buildProcedureCorrectionOriginalBinding({ ...context, planId: "" }, KIOSK_RECORD_1),
    ).toBeUndefined();
  });
});
