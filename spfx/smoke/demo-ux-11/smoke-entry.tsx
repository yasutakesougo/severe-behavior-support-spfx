/**
 * DEMO-UX-11 browser smoke harness — synthetic fixture only.
 * DEMO note consolidation. No save / SharePoint write.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DASHBOARD_UX_SLICE,
  DEMO_UX_3_SLICE,
  DEMO_UX_4_SLICE,
  DEMO_UX_5_SLICE,
  DEMO_UX_6_SLICE,
  DEMO_UX_7_SLICE,
  DEMO_UX_8_SLICE,
  DEMO_UX_9_SLICE,
  DEMO_UX_10_SLICE,
  DEMO_UX_11_SLICE,
  DEMO_UX_DAILY_RECORD_FIXTURE,
  DEMO_UX_REVIEW_DUE_FIXTURE,
  DEMO_UX_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
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
    ? (destRaw as ShellPrimaryNavigationId)
    : SHELL_DEFAULT_DESTINATION;
  return { viewMode, saveState, siteSelection, selectedDestination };
}

const SmokeApp: React.FC = () => {
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
      data-demo-ux-5-slice={DEMO_UX_5_SLICE.id}
      data-demo-ux-6-slice={DEMO_UX_6_SLICE.id}
      data-demo-ux-7-slice={DEMO_UX_7_SLICE.id}
      data-demo-ux-8-slice={DEMO_UX_8_SLICE.id}
      data-demo-ux-9-slice={DEMO_UX_9_SLICE.id}
      data-demo-ux-10-slice={DEMO_UX_10_SLICE.id}
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
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
        additionalUserDetailPresentations={[DEMO_UX_USER_DETAIL_C_FIXTURE]}
        supportPlanPresentation={DEMO_UX_SUPPORT_PLAN_FIXTURE}
        dailyRecordPresentation={DEMO_UX_DAILY_RECORD_FIXTURE}
        reviewDueStatePresentation={DEMO_UX_REVIEW_DUE_FIXTURE}
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
