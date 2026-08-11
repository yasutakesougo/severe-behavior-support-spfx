/**
 * C-F′ browser smoke harness — synthetic fixture only.
 * No navigation destinations, auth judgment, adapter, or live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
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
  const viewRaw = params.get("viewMode") ?? "ready";
  const saveRaw = params.get("saveState") ?? "saved";
  const siteRaw = params.get("siteSelection") ?? "SITE-ISG";
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : "ready";
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : "saved";
  const siteSelection = isShellSiteSelection(siteRaw) ? siteRaw : "SITE-ISG";
  return { viewMode, saveState, siteSelection };
}

const { viewMode, saveState, siteSelection } = parseParams();
const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(
  <div data-c-f-prime="primary-navigation">
    <AppShellChrome
      demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
      siteSelection={siteSelection}
      saveState={saveState}
      viewMode={viewMode}
      correlationId="c-f-prime-synth-corr"
      errorCode="C-F-PRIME-SYNTH-E001"
      userDisplayName="C-F′ Smoke Operator Sensitive Name"
      partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
    >
      <section data-shell-ux="shell-body">
        <h2>C-F′ smoke ready body</h2>
        <p>Primary navigation destinations are intentionally outside this slice.</p>
      </section>
    </AppShellChrome>
  </div>,
  root,
);
