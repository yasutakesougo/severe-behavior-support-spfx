import {
  asiaTokyoIsoToDateTimeLocal,
  canRetryCorrectionSave,
  createCorrectionDraftFromRecord,
  isCorrectionDraftReadyToSave,
  retainCorrectionDraftAfterSaveFailed,
} from "./procedure-correction-draft";

describe("procedure-correction-draft", () => {
  const originalLocalDate = "2026-08-17";

  it("seeds draft from bound record result and performedAt", () => {
    const draft = createCorrectionDraftFromRecord({
      result: "PERFORMED_AS_PLANNED",
      performedAt: "2026-08-17T12:05:00.000Z",
    });
    expect(draft.result).toBe("PERFORMED_AS_PLANNED");
    expect(draft.reason).toBe("");
    expect(asiaTokyoIsoToDateTimeLocal("2026-08-17T12:05:00.000Z")).toBe(draft.performedAtLocal);
  });

  it("requires result, performedAtLocal, reason, and same-local-date", () => {
    const ready = {
      result: "PERFORMED_AS_PLANNED" as const,
      performedAtLocal: "2026-08-17T21:05",
      reason: "記録時刻の訂正",
    };
    expect(isCorrectionDraftReadyToSave(ready, originalLocalDate)).toBe(true);
    expect(isCorrectionDraftReadyToSave({ ...ready, reason: "   " }, originalLocalDate)).toBe(
      false,
    );
    expect(isCorrectionDraftReadyToSave({ ...ready, result: undefined }, originalLocalDate)).toBe(
      false,
    );
    expect(
      isCorrectionDraftReadyToSave(
        { ...ready, performedAtLocal: "2026-08-18T09:00" },
        originalLocalDate,
      ),
    ).toBe(false);
  });

  it("mirrors procedure-record retry rules", () => {
    expect(canRetryCorrectionSave("unsaved")).toBe(true);
    expect(canRetryCorrectionSave("save_failed")).toBe(true);
    expect(canRetryCorrectionSave("saving")).toBe(false);
    expect(canRetryCorrectionSave("saved")).toBe(false);
    expect(canRetryCorrectionSave("save_outcome_unknown")).toBe(false);
  });

  it("retains draft on save_failed", () => {
    const draft = {
      result: "NOT_PERFORMED" as const,
      performedAtLocal: "2026-08-17T21:05",
      reason: "keep-me",
    };
    expect(retainCorrectionDraftAfterSaveFailed(draft)).toEqual(draft);
  });
});
