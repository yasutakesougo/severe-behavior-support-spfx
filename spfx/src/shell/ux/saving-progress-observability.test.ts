import {
  DEMO_UX_14_SLICE,
  SAVING_INTERACTION_PAUSE_NOTE,
  isSavingInteractionPaused,
  isSavingProgressActive,
} from "./saving-progress-observability";
import { SHELL_SAVE_STATES, labelForShellSaveState } from "./save-state";

describe("DEMO-UX-14 saving progress observability (RPF-007)", () => {
  it("locks slice flags without authorizing save or live I/O", () => {
    expect(DEMO_UX_14_SLICE.id).toBe("DEMO-UX-14");
    expect(DEMO_UX_14_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_14_SLICE.saveProgressUiAuthorized).toBe(true);
    expect(DEMO_UX_14_SLICE.savingInteractionPauseAppearanceAuthorized).toBe(true);
    expect(DEMO_UX_14_SLICE.savingAutoCompleteAuthorized).toBe(false);
    expect(DEMO_UX_14_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
    expect(DEMO_UX_14_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_14_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_14_SLICE.liveTenantIoAuthorized).toBe(false);
  });

  it("activates progress cue only for saving", () => {
    for (const state of SHELL_SAVE_STATES) {
      expect(isSavingProgressActive(state)).toBe(state === "saving");
    }
  });

  it("activates interaction pause only for saving", () => {
    for (const state of SHELL_SAVE_STATES) {
      expect(isSavingInteractionPaused(state)).toBe(state === "saving");
    }
  });

  it("does not treat saving as saved success", () => {
    expect(labelForShellSaveState("saving")).toBe("保存中");
    expect(labelForShellSaveState("saving")).not.toBe(labelForShellSaveState("saved"));
    expect(isSavingProgressActive("saved")).toBe(false);
    expect(isSavingInteractionPaused("saved")).toBe(false);
  });

  it("exposes a synthetic pause note that states no live save", () => {
    expect(SAVING_INTERACTION_PAUSE_NOTE).toContain("保存中");
    expect(SAVING_INTERACTION_PAUSE_NOTE).toContain("一時停止");
    expect(SAVING_INTERACTION_PAUSE_NOTE).toContain("実保存なし");
    expect(SAVING_INTERACTION_PAUSE_NOTE).not.toContain("保存済み");
  });
});
