import {
  TODAY_SUPPORT_FIELD_PROCEDURE_LABEL,
  TODAY_SUPPORT_FIELD_RECORD_LABEL,
  todaySupportFieldUnrecordedSplitLabels,
  todaySupportOccurrenceActionLabel,
} from "./TodaySupportDayBoard";

describe("VP-G Today Support occurrence CTA presentation", () => {
  it("splits field unrecorded CTAs instead of combining record and procedure", () => {
    expect(todaySupportFieldUnrecordedSplitLabels("未実施", "field")).toEqual({
      procedureLabel: TODAY_SUPPORT_FIELD_PROCEDURE_LABEL,
      recordLabel: TODAY_SUPPORT_FIELD_RECORD_LABEL,
    });
    expect(todaySupportOccurrenceActionLabel("未実施", "field")).toBe("手順を表示");
    expect(todaySupportOccurrenceActionLabel("未実施", "field")).not.toContain("/");
    expect(todaySupportOccurrenceActionLabel("記録済み", "field")).toBe("記録を確認・再表示");
  });

  it("keeps record and procedure as separate field operations", () => {
    expect(TODAY_SUPPORT_FIELD_PROCEDURE_LABEL).toBe("手順を表示");
    expect(TODAY_SUPPORT_FIELD_RECORD_LABEL).toBe("この予定を記録");
    expect(TODAY_SUPPORT_FIELD_PROCEDURE_LABEL).not.toBe(TODAY_SUPPORT_FIELD_RECORD_LABEL);
  });

  it("de-emphasizes unrecorded occurrence CTAs for ADMIN confirm mode only", () => {
    expect(todaySupportFieldUnrecordedSplitLabels("未実施", "confirm")).toBeUndefined();
    expect(todaySupportOccurrenceActionLabel("未実施", "confirm")).toBe("予定を確認");
    expect(todaySupportOccurrenceActionLabel("記録済み", "confirm")).toBe("記録を確認・再表示");
    expect(todaySupportOccurrenceActionLabel("確認が必要", "confirm")).toBe(
      "確認が必要なため詳細のみ",
    );
  });
});
