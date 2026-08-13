import { DEMO_UX_12_SLICE } from "./save-badge-hierarchy";
import {
  SHELL_SAVE_STATES,
  SHELL_SAVE_STATE_DESCRIPTIONS,
  ariaLiveForShellSaveState,
  descriptionForShellSaveState,
  emphasisForShellSaveState,
  isSaveStateDescriptionVisible,
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

describe("DEMO-UX-12 save badge hierarchy (RPF-005)", () => {
  it("locks slice flags without authorizing save or live I/O", () => {
    expect(DEMO_UX_12_SLICE.id).toBe("DEMO-UX-12");
    expect(DEMO_UX_12_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_12_SLICE.saveBadgeHierarchyAuthorized).toBe(true);
    expect(DEMO_UX_12_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.saveProgressUiAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.liveTenantIoAuthorized).toBe(false);
  });

  it("marks saved and unsaved as QUIET", () => {
    expect(emphasisForShellSaveState("saved")).toBe("quiet");
    expect(emphasisForShellSaveState("unsaved")).toBe("quiet");
    expect(isSaveStateDescriptionVisible("saved")).toBe(false);
    expect(isSaveStateDescriptionVisible("unsaved")).toBe(false);
  });

  it("marks saving, save_failed, and save_outcome_unknown as EMPHASIZED", () => {
    expect(emphasisForShellSaveState("saving")).toBe("emphasized");
    expect(emphasisForShellSaveState("save_failed")).toBe("emphasized");
    expect(emphasisForShellSaveState("save_outcome_unknown")).toBe("emphasized");
    expect(isSaveStateDescriptionVisible("saving")).toBe(true);
    expect(isSaveStateDescriptionVisible("save_failed")).toBe(true);
    expect(isSaveStateDescriptionVisible("save_outcome_unknown")).toBe(true);
  });

  it("does not treat saving as saved success", () => {
    expect(labelForShellSaveState("saving")).not.toBe(labelForShellSaveState("saved"));
    expect(emphasisForShellSaveState("saving")).toBe("emphasized");
    expect(emphasisForShellSaveState("saved")).toBe("quiet");
  });

  it("keeps saving description presentation-only and non-success", () => {
    const saving = descriptionForShellSaveState("saving");
    expect(saving).toContain("保存処理を表示中");
    expect(saving).toContain("実保存なし");
    expect(saving).not.toContain("保存済み");
  });
});
