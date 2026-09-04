/**
 * SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 browser smoke harness — synthetic fixture only.
 * No live plan mutation / auth judgment / adapter / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ManagementHome } from "../../src/shell/users/ManagementHome";
import {
  MANAGEMENT_HOME_MISMATCH_FIXTURE,
  MANAGEMENT_HOME_RESOLVED_FIXTURE,
  MANAGEMENT_HOME_UNAVAILABLE_FIXTURE,
} from "../../src/shell/users/management-home-fixture";
import { buildManagementHomeReadModel } from "../../src/shell/users/management-home-read-model";
import {
  AppShellChrome,
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DASHBOARD_UX_SLICE,
  DEMO_UX_3_SLICE,
  DEMO_UX_4_SLICE,
  DEMO_UX_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
  PLANNING_PC_DEMO_1_SLICE,
  SHELL_DEFAULT_DESTINATION,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
  SHELL_VIEW_MODES,
  SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE,
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  parseShellPresentationRole,
  type ShellPresentationRole,
  type ShellPrimaryNavigationId,
  type ShellSaveState,
  type ShellSiteSelection,
  type ShellViewMode,
} from "../../src/shell/ux";

type ManagementHomeCase = "resolved" | "unavailable" | "mismatch";

function managementHomeCase(): ManagementHomeCase | null {
  const value = new URLSearchParams(window.location.search).get("managementHome");
  return value === "resolved" || value === "unavailable" || value === "mismatch" ? value : null;
}

function parseParams(): {
  viewMode: ShellViewMode;
  saveState: ShellSaveState;
  siteSelection: ShellSiteSelection;
  selectedDestination: ShellPrimaryNavigationId;
  presentationRole: ShellPresentationRole;
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
    ? (destRaw as ShellPrimaryNavigationId)
    : SHELL_DEFAULT_DESTINATION;
  return {
    viewMode,
    saveState,
    siteSelection,
    selectedDestination,
    presentationRole: parseShellPresentationRole(params.get("presentationRole") ?? "PLANNER"),
  };
}

const SmokeApp: React.FC = () => {
  const homeCase = managementHomeCase();
  if (homeCase) {
    const fixture =
      homeCase === "resolved"
        ? MANAGEMENT_HOME_RESOLVED_FIXTURE
        : homeCase === "mismatch"
          ? MANAGEMENT_HOME_MISMATCH_FIXTURE
          : MANAGEMENT_HOME_UNAVAILABLE_FIXTURE;
    return (
      <div data-shell-ux="smoke-root" data-management-home-case={homeCase}>
        <ManagementHome presentation={buildManagementHomeReadModel(fixture)} />
      </div>
    );
  }

  const initial = parseParams();
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.selectedDestination,
  );

  return (
    <div
      data-shell-ux="smoke-root"
      data-shell-ux-slice={SHELL_UX_SLICE.id}
      data-dashboard-ux-slice={DASHBOARD_UX_SLICE.id}
      data-demo-ux-slice={DEMO_UX_SLICE.id}
      data-demo-ux-3-slice={DEMO_UX_3_SLICE.id}
      data-demo-ux-4-slice={DEMO_UX_4_SLICE.id}
      data-planning-pc-demo-slice={PLANNING_PC_DEMO_1_SLICE.id}
      data-support-plan-mgmt-demo-slice={SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id}
    >
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
        supportPlanPresentation={DEMO_UX_SUPPORT_PLAN_FIXTURE}
        correlationId={SHELL_UX_DEFAULT_FIXTURE.correlationId}
        errorCode={SHELL_UX_DEFAULT_FIXTURE.errorCode}
        userDisplayName="Smoke Operator Synthetic"
        partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
        presentationRole={initial.presentationRole}
      />
    </div>
  );
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(<SmokeApp />, root);
