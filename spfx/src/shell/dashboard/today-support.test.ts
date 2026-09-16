import { todaySupportOccurrenceActionLabel } from "./TodaySupportDayBoard";

describe("VP-G Today Support occurrence CTA presentation", () => {
  it("keeps field record labels for FIELD_STAFF/PLANNER", () => {
    expect(todaySupportOccurrenceActionLabel("未実施", "field")).toBe("この予定を記録 / 手順表示");
    expect(todaySupportOccurrenceActionLabel("未実施", "task-first")).toBe("対象の支援を始める");
    expect(todaySupportOccurrenceActionLabel("記録済み", "field")).toBe("記録を確認・再表示");
  });

  it("de-emphasizes unrecorded occurrence CTAs for ADMIN confirm mode only", () => {
    expect(todaySupportOccurrenceActionLabel("未実施", "confirm")).toBe("予定を確認");
    expect(todaySupportOccurrenceActionLabel("記録済み", "confirm")).toBe("記録を確認・再表示");
    expect(todaySupportOccurrenceActionLabel("確認が必要", "confirm")).toBe(
      "確認が必要なため詳細のみ",
    );
  });
});
