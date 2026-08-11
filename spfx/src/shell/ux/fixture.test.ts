import { SHELL_UX_DEFAULT_FIXTURE, SHELL_UX_SLICE } from "./fixture";
import { isShellSaveState } from "./save-state";
import { isShellViewMode } from "./shell-view-mode";

describe("SHELL-UX-1 fixture boundary", () => {
  it("keeps demo mode on and uses display-only site labels", () => {
    expect(SHELL_UX_DEFAULT_FIXTURE.demoMode).toBe(true);
    expect(SHELL_UX_DEFAULT_FIXTURE.currentSite.siteId).toBe("SITE-ISG");
    expect(SHELL_UX_DEFAULT_FIXTURE.currentSite.displayName.length).toBeGreaterThan(0);
  });

  it("uses only presentation save/view vocabularies", () => {
    expect(isShellSaveState(SHELL_UX_DEFAULT_FIXTURE.saveState)).toBe(true);
    expect(isShellViewMode(SHELL_UX_DEFAULT_FIXTURE.viewMode)).toBe(true);
  });

  it("does not authorize live tenant I/O, REST, or binder host wiring", () => {
    expect(SHELL_UX_SLICE.id).toBe("SHELL-UX-1");
    expect(SHELL_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.binderHostWiringAuthorized).toBe(false);
  });
});
