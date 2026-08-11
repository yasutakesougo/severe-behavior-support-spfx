import {
  SHELL_SAVE_STATES,
  SHELL_SAVE_STATE_DESCRIPTIONS,
  ariaLiveForShellSaveState,
  descriptionForShellSaveState,
  isShellSaveState,
  labelForShellSaveState,
} from "./save-state";

describe("SHELL-UX save-state presentation", () => {
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

  it("provides presentation descriptions for all five states", () => {
    for (const state of SHELL_SAVE_STATES) {
      expect(descriptionForShellSaveState(state)).toBe(SHELL_SAVE_STATE_DESCRIPTIONS[state]);
      expect(descriptionForShellSaveState(state).length).toBeGreaterThan(0);
    }
  });

  it("keeps 保存結果不明 independent from 保存失敗 and 保存済み", () => {
    const unknown = descriptionForShellSaveState("save_outcome_unknown");
    expect(unknown).toContain("丸めません");
    expect(unknown).not.toContain("保存失敗");
    expect(unknown).not.toContain("保存済み");
    expect(labelForShellSaveState("save_outcome_unknown")).not.toBe(
      labelForShellSaveState("save_failed"),
    );
    expect(labelForShellSaveState("save_outcome_unknown")).not.toBe(
      labelForShellSaveState("saved"),
    );
  });

  it("maps assertive live regions only for fail / unknown presentation", () => {
    expect(ariaLiveForShellSaveState("unsaved")).toBe("polite");
    expect(ariaLiveForShellSaveState("saving")).toBe("polite");
    expect(ariaLiveForShellSaveState("saved")).toBe("polite");
    expect(ariaLiveForShellSaveState("save_failed")).toBe("assertive");
    expect(ariaLiveForShellSaveState("save_outcome_unknown")).toBe("assertive");
  });

  it("rejects unknown save-state strings fail-closed", () => {
    expect(isShellSaveState("saved")).toBe(true);
    expect(isShellSaveState("demo")).toBe(false);
    expect(isShellSaveState("SUCCESS")).toBe(false);
  });
});
