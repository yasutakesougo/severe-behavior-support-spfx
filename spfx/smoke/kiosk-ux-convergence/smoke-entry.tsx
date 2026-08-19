/**
 * Kiosk UX convergence browser smoke — synthetic fixture only.
 * No SharePoint / Deploy / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
  FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_VIEW_MODES,
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  parseShellPresentationRole,
  type ShellPresentationRole,
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
  presentationRole: ShellPresentationRole;
} {
  const params = new URLSearchParams(window.location.search);
  const viewRaw = params.get("viewMode") ?? "ready";
  const saveRaw = params.get("saveState") ?? "unsaved";
  const siteRaw = params.get("siteSelection") ?? "SITE-ISG";
  const destRaw = params.get("destination") ?? "overview";
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : "ready";
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : "unsaved";
  const siteSelection = isShellSiteSelection(siteRaw) ? siteRaw : "SITE-ISG";
  const selectedDestination = isShellPrimaryNavigationId(destRaw) ? destRaw : "overview";
  return {
    viewMode,
    saveState,
    siteSelection,
    selectedDestination,
    presentationRole: parseShellPresentationRole(params.get("presentationRole") ?? undefined),
  };
}

const SmokeApp: React.FC = () => {
  const initial = parseParams();
  const scaleScenario = new URLSearchParams(window.location.search).get("scale") === "18";
  const usersPresentation = scaleScenario
    ? FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE
    : DEMO_UX_USERS_FIXTURE;
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.selectedDestination,
  );

  return (
    <div
      data-shell-ux="smoke-root"
      data-kiosk-ux="convergence-smoke"
      data-field-staff-scale-scenario={scaleScenario ? "18" : "default"}
    >
      <AppShellChrome
        demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
        siteSelection={initial.siteSelection}
        saveState={initial.saveState}
        viewMode={initial.viewMode}
        selectedDestination={selectedDestination}
        onSelectedDestinationChange={setSelectedDestination}
        overviewPresentation={DASHBOARD_UX_OVERVIEW_FIXTURE}
        usersPresentation={usersPresentation}
        userDetailPresentation={DEMO_UX_USER_DETAIL_FIXTURE}
        correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
        errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
        userDisplayName="Kiosk UX Convergence Smoke Synthetic"
        partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
        presentationRole={initial.presentationRole}
      />
    </div>
  );
};

ReactDOM.render(<SmokeApp />, document.getElementById("root"));
