import { SHELL_SAVE_STATES, isShellSaveState, labelForShellSaveState } from "./save-state";

describe("SHELL-UX-1 save-state presentation", () => {
  it("exposes exactly five save states", () => {
    expect(SHELL_SAVE_STATES).toEqual([
      "unsaved",
      "saving",
      "saved",
      "save_failed",
      "save_outcome_unknown",
    ]);
  });

  it("labels each save state in Japanese without inventing business meaning", () => {
    expect(labelForShellSaveState("unsaved")).toBe("未保存");
    expect(labelForShellSaveState("saving")).toBe("保存中");
    expect(labelForShellSaveState("saved")).toBe("保存済み");
    expect(labelForShellSaveState("save_failed")).toBe("保存失敗");
    expect(labelForShellSaveState("save_outcome_unknown")).toBe("保存結果不明");
  });

  it("rejects unknown save-state strings fail-closed", () => {
    expect(isShellSaveState("saved")).toBe(true);
    expect(isShellSaveState("demo")).toBe(false);
    expect(isShellSaveState("SUCCESS")).toBe(false);
  });
});
