/**
 * SHELL-UX-5 browser smoke harness — synthetic fixture only.
 * No SharePoint REST / error-code generation / failure classification / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
  SHELL_VIEW_MODES,
  isShellSiteSelection,
  type ShellSaveState,
  type ShellSiteSelection,
  type ShellViewMode,
} from "../../src/shell/ux";

function parseParams(): {
  viewMode: ShellViewMode;
  saveState: ShellSaveState;
  siteSelection: ShellSiteSelection;
} {
  const params = new URLSearchParams(window.location.search);
  const viewRaw = params.get("viewMode") ?? "retrieval_failed";
  const saveRaw = params.get("saveState") ?? SHELL_UX_DEFAULT_FIXTURE.saveState;
  const siteRaw = params.get("siteSelection") ?? "SITE-ISG";
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : "retrieval_failed";
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : SHELL_UX_DEFAULT_FIXTURE.saveState;
  const siteSelection = isShellSiteSelection(siteRaw) ? siteRaw : "SITE-ISG";
  return { viewMode, saveState, siteSelection };
}

const { viewMode, saveState, siteSelection } = parseParams();

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(
  <div data-shell-ux="smoke-root" data-shell-ux-slice={SHELL_UX_SLICE.id}>
    <AppShellChrome
      demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
      siteSelection={siteSelection}
      saveState={saveState}
      viewMode={viewMode}
      correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
      errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
      userDisplayName="Smoke Operator"
      partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
    >
      <section data-shell-ux="shell-body">
        <h2>SHELL-UX-5 smoke ready body</h2>
        <p>Should stay hidden under retrieval_failed / access_denied.</p>
      </section>
    </AppShellChrome>
  </div>,
  root,
);
