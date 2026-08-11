/**
 * SHELL-UX-3 browser smoke harness — synthetic fixture only.
 * No SharePoint REST / binder / membership lookup / liveTenant I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
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
  const viewRaw = params.get("viewMode") ?? SHELL_UX_DEFAULT_FIXTURE.viewMode;
  const saveRaw = params.get("saveState") ?? SHELL_UX_DEFAULT_FIXTURE.saveState;
  const siteRaw = params.get("siteSelection") ?? SHELL_UX_DEFAULT_FIXTURE.siteSelection;
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : SHELL_UX_DEFAULT_FIXTURE.viewMode;
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : SHELL_UX_DEFAULT_FIXTURE.saveState;
  const siteSelection = isShellSiteSelection(siteRaw)
    ? siteRaw
    : SHELL_UX_DEFAULT_FIXTURE.siteSelection;
  return { viewMode, saveState, siteSelection };
}

const { viewMode, saveState, siteSelection } = parseParams();

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

function SmokeApp(): React.ReactElement {
  const [selection, setSelection] = React.useState<ShellSiteSelection>(siteSelection);

  return (
    <div data-shell-ux="smoke-root" data-shell-ux-slice={SHELL_UX_SLICE.id}>
      <AppShellChrome
        demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
        siteSelection={selection}
        saveState={saveState}
        viewMode={viewMode}
        correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
        errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
        userDisplayName="Smoke Operator"
        onSiteSelectionChange={setSelection}
      >
        <section data-shell-ux="shell-body">
          <h2>SHELL-UX-3 smoke ready body</h2>
          <p>Fixture-driven multi-site presentation only.</p>
        </section>
      </AppShellChrome>
    </div>
  );
}

ReactDOM.render(<SmokeApp />, root);
