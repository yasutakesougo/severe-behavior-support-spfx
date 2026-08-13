import { DEMO_UX_12_SLICE } from "./save-badge-hierarchy";
import { SHELL_SAVE_STATES, emphasisForShellSaveState } from "./save-state";

describe("DEMO-UX-12 save-badge-hierarchy module", () => {
  it("covers every ShellSaveState with quiet or emphasized", () => {
    const covered = SHELL_SAVE_STATES.map((state) => emphasisForShellSaveState(state));
    expect(covered).toEqual(["quiet", "emphasized", "quiet", "emphasized", "emphasized"]);
  });

  it("keeps DEMO-UX-12 presentation-only boundary", () => {
    expect(DEMO_UX_12_SLICE.visualRedesignAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.detailPreviewExpansionAuthorized).toBe(false);
    expect(DEMO_UX_12_SLICE.sharePointRestAuthorized).toBe(false);
  });
});
