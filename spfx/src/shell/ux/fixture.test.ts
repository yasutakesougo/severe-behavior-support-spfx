import {
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
} from "./fixture";
import { hasPartialRetrievalFailure } from "./partial-retrieval";
import { isShellSaveState } from "./save-state";
import { isShellViewMode } from "./shell-view-mode";
import { isShellSiteSelection, isSiteUnselected } from "./site-selection";

describe("SHELL-UX fixture boundary", () => {
  it("keeps demo mode on and starts with unselected display site", () => {
    expect(SHELL_UX_DEFAULT_FIXTURE.demoMode).toBe(true);
    expect(isSiteUnselected(SHELL_UX_DEFAULT_FIXTURE.siteSelection)).toBe(true);
    expect(SHELL_UX_DEFAULT_FIXTURE.siteOptions.map((o) => o.siteId)).toEqual([
      "SITE-ISG",
      "SITE-HOM",
    ]);
  });

  it("uses only presentation save/view/site vocabularies", () => {
    expect(isShellSaveState(SHELL_UX_DEFAULT_FIXTURE.saveState)).toBe(true);
    expect(isShellViewMode(SHELL_UX_DEFAULT_FIXTURE.viewMode)).toBe(true);
    expect(isShellSiteSelection(SHELL_UX_DEFAULT_FIXTURE.siteSelection)).toBe(true);
  });

  it("keeps partial-retrieval fixture separated and failure-bearing", () => {
    expect(hasPartialRetrievalFailure(SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE)).toBe(true);
    expect(SHELL_UX_DEFAULT_FIXTURE.partialRetrieval).toEqual(SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE);
  });

  it("does not authorize live I/O, REST, binder, membership, fetch, or judgment", () => {
    expect(SHELL_UX_SLICE.id).toBe("SHELL-UX-4");
    expect(SHELL_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.membershipLookupAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.adapterFetchAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.outcomeJudgmentAuthorized).toBe(false);
  });
});
