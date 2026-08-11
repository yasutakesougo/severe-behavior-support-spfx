import {
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
} from "./fixture";
import { hasPartialRetrievalFailure } from "./partial-retrieval";
import { isShellSaveState } from "./save-state";
import { isShellViewMode, isUnauthenticatedViewMode } from "./shell-view-mode";
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
    expect(isUnauthenticatedViewMode("unauthenticated")).toBe(true);
  });

  it("keeps partial-retrieval fixture separated and failure-bearing", () => {
    expect(hasPartialRetrievalFailure(SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE)).toBe(true);
    expect(SHELL_UX_DEFAULT_FIXTURE.partialRetrieval).toEqual(SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE);
  });

  it("carries synthetic errorCode + correlationId for inquiry display", () => {
    expect(SHELL_UX_DEFAULT_FIXTURE.errorCode).toBe("SHELL-UX-6-SYNTH-E001");
    expect(SHELL_UX_DEFAULT_FIXTURE.correlationId).toBe("shell-ux-6-synth-corr");
  });

  it("does not authorize live I/O, REST, binder, auth judgment, or redirect", () => {
    expect(SHELL_UX_SLICE.id).toBe("SHELL-UX-6");
    expect(SHELL_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.membershipLookupAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.adapterFetchAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.outcomeJudgmentAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.errorCodeGenerationAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.adapterFailureClassificationAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.telemetryBackendAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.authJudgmentAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.entraTokenHandlingAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.roleResolutionAuthorized).toBe(false);
    expect(SHELL_UX_SLICE.redirectSignInOrchestrationAuthorized).toBe(false);
  });
});
