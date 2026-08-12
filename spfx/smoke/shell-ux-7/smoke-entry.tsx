/**
 * SHELL-UX-7 browser smoke harness — synthetic fixture only.
 * No business UI / auth judgment / adapter / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_DEFAULT_DESTINATION,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
  SHELL_VIEW_MODES,
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  type ShellPrimaryNavigationId,
  type ShellSaveState,
  type ShellSiteSelection,
  type ShellViewMode,
} from "../../src/shell/ux";

function parseParams(): {
  viewMode: ShellViewMode;
  saveState: ShellSaveState;
  siteSelection: ShellSiteSelection;
  selectedDestination: ShellPrimaryNavigationId;
} {
  const params = new URLSearchParams(window.location.search);
  const viewRaw = params.get("viewMode") ?? "ready";
  const saveRaw = params.get("saveState") ?? "saved";
  const siteRaw = params.get("siteSelection") ?? "SITE-ISG";
  const destRaw = params.get("destination") ?? SHELL_DEFAULT_DESTINATION;
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : "ready";
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : "saved";
  const siteSelection = isShellSiteSelection(siteRaw) ? siteRaw : "SITE-ISG";
  const selectedDestination = isShellPrimaryNavigationId(destRaw)
    ? destRaw
    : SHELL_DEFAULT_DESTINATION;
  return { viewMode, saveState, siteSelection, selectedDestination };
}

const SmokeApp: React.FC = () => {
  const initial = parseParams();
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.selectedDestination,
  );

  return (
    <div data-shell-ux="smoke-root" data-shell-ux-slice={SHELL_UX_SLICE.id}>
      <AppShellChrome
        demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
        siteSelection={initial.siteSelection}
        saveState={initial.saveState}
        viewMode={initial.viewMode}
        selectedDestination={selectedDestination}
        onSelectedDestinationChange={setSelectedDestination}
        correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
        errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
        userDisplayName="Smoke Operator Synthetic"
        partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
      />
    </div>
  );
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(<SmokeApp />, root);
