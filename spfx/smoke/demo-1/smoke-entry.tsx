/**
 * DEMO-1 browser smoke harness — synthetic fixture only.
 * Mirrors ScaffoldShellWebPart DEMO_1_FIELD_STAFF_FIXTURE entry.
 * No SharePoint / Deploy / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DEMO_1_FIELD_STAFF_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  parseShellPresentationRole,
  type ShellPresentationRole,
  type ShellPrimaryNavigationId,
  type ShellSiteSelection,
} from "../../src/shell/ux";

function parseParams(): {
  siteSelection: ShellSiteSelection;
  selectedDestination: ShellPrimaryNavigationId;
  presentationRole: ShellPresentationRole;
} {
  const params = new URLSearchParams(window.location.search);
  const siteRaw = params.get("siteSelection") ?? DEMO_1_FIELD_STAFF_FIXTURE.siteSelection;
  const destRaw = params.get("destination") ?? DEMO_1_FIELD_STAFF_FIXTURE.selectedDestination;
  const siteSelection = isShellSiteSelection(siteRaw)
    ? siteRaw
    : DEMO_1_FIELD_STAFF_FIXTURE.siteSelection;
  const selectedDestination = isShellPrimaryNavigationId(destRaw)
    ? destRaw
    : DEMO_1_FIELD_STAFF_FIXTURE.selectedDestination;
  return {
    siteSelection,
    selectedDestination,
    presentationRole: parseShellPresentationRole(
      params.get("presentationRole") ?? DEMO_1_FIELD_STAFF_FIXTURE.presentationRole,
    ),
  };
}

const SmokeApp: React.FC = () => {
  const initial = parseParams();
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.selectedDestination,
  );

  return (
    <div
      data-shell-ux="smoke-root"
      data-demo-1="field-staff-entry"
      data-demo-1-site={initial.siteSelection}
      data-demo-1-role={initial.presentationRole}
    >
      <AppShellChrome
        demoMode={DEMO_1_FIELD_STAFF_FIXTURE.demoMode}
        siteSelection={initial.siteSelection}
        saveState={DEMO_1_FIELD_STAFF_FIXTURE.saveState}
        viewMode={DEMO_1_FIELD_STAFF_FIXTURE.viewMode}
        selectedDestination={selectedDestination}
        onSelectedDestinationChange={setSelectedDestination}
        overviewPresentation={DASHBOARD_UX_OVERVIEW_FIXTURE}
        usersPresentation={DEMO_UX_USERS_FIXTURE}
        userDetailPresentation={DEMO_UX_USER_DETAIL_FIXTURE}
        correlationId={DEMO_1_FIELD_STAFF_FIXTURE.correlationId}
        errorCode={DEMO_1_FIELD_STAFF_FIXTURE.errorCode}
        userDisplayName="DEMO-1 Field Staff Synthetic"
        partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
        presentationRole={initial.presentationRole}
      />
    </div>
  );
};

ReactDOM.render(<SmokeApp />, document.getElementById("root"));
