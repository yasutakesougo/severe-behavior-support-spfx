/**
 * SHELL-UX-2 browser smoke harness — synthetic fixture only.
 * No SharePoint REST / binder / liveTenant I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_SLICE,
  SHELL_VIEW_MODES,
  type ShellSaveState,
  type ShellViewMode,
} from "../../src/shell/ux";

function parseParams(): { viewMode: ShellViewMode; saveState: ShellSaveState } {
  const params = new URLSearchParams(window.location.search);
  const viewRaw = params.get("viewMode") ?? SHELL_UX_DEFAULT_FIXTURE.viewMode;
  const saveRaw = params.get("saveState") ?? SHELL_UX_DEFAULT_FIXTURE.saveState;
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : SHELL_UX_DEFAULT_FIXTURE.viewMode;
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : SHELL_UX_DEFAULT_FIXTURE.saveState;
  return { viewMode, saveState };
}

const { viewMode, saveState } = parseParams();

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(
  <div data-shell-ux="smoke-root" data-shell-ux-slice={SHELL_UX_SLICE.id}>
    <AppShellChrome
      demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
      siteSelection="SITE-ISG"
      saveState={saveState}
      viewMode={viewMode}
      correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
      errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
      userDisplayName="Smoke Operator"
    >
      <section data-shell-ux="shell-body">
        <h2>SHELL-UX-2 smoke ready body</h2>
        <p>Fixture-driven save-state presentation only.</p>
      </section>
    </AppShellChrome>
  </div>,
  root,
);
