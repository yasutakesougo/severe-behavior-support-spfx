/**
 * FIELD-WORKFLOW UI (#356) browser smoke harness — synthetic fixture only.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
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
import { FIELD_WORKFLOW_UI_SLICE } from "../../src/shell/procedure";

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
  const destRaw = params.get("destination") ?? "users";
  const viewMode = (SHELL_VIEW_MODES as readonly string[]).includes(viewRaw)
    ? (viewRaw as ShellViewMode)
    : "ready";
  const saveState = (SHELL_SAVE_STATES as readonly string[]).includes(saveRaw)
    ? (saveRaw as ShellSaveState)
    : "unsaved";
  const siteSelection = isShellSiteSelection(siteRaw) ? siteRaw : "SITE-ISG";
  const selectedDestination = isShellPrimaryNavigationId(destRaw) ? destRaw : "users";
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
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.selectedDestination,
  );

  return (
    <div data-shell-ux="smoke-root" data-field-workflow-slice={FIELD_WORKFLOW_UI_SLICE.id}>
      <AppShellChrome
        demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
        siteSelection={initial.siteSelection}
        saveState={initial.saveState}
        viewMode={initial.viewMode}
        selectedDestination={selectedDestination}
        onSelectedDestinationChange={setSelectedDestination}
        overviewPresentation={DASHBOARD_UX_OVERVIEW_FIXTURE}
        usersPresentation={DEMO_UX_USERS_FIXTURE}
        userDetailPresentation={DEMO_UX_USER_DETAIL_FIXTURE}
        correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
        errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
        userDisplayName="Field Workflow Smoke Synthetic"
        partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
        presentationRole={initial.presentationRole}
      />
    </div>
  );
};

ReactDOM.render(<SmokeApp />, document.getElementById("root"));
