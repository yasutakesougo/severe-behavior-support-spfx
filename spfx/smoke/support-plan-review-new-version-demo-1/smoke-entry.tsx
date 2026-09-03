/**
 * SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 browser smoke harness — synthetic fixture only.
 * No version persistence / Draft workflow / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
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
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
  SHELL_DEFAULT_DESTINATION,
  SHELL_SAVE_STATES,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
  SHELL_VIEW_MODES,
  SupportPlan,
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  parseShellPresentationRole,
  type ShellPresentationRole,
  type ShellPrimaryNavigationId,
  type ShellSaveState,
  type ShellSiteSelection,
  type ShellViewMode,
} from "../../src/shell/ux";
import { createBeforeApplyStaffTransitionArrival } from "../../src/shell/users/support-plan-revision-start";

function parseParams(): {
  viewMode: ShellViewMode;
  saveState: ShellSaveState;
  siteSelection: ShellSiteSelection;
  selectedDestination: ShellPrimaryNavigationId;
  presentationRole: ShellPresentationRole;
  staffPlanTransition: string | null;
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
    staffPlanTransition: params.get("staffPlanTransition"),
  };
}

const StaffBeforeApplyApp: React.FC = () => {
  const arrival = React.useMemo(() => createBeforeApplyStaffTransitionArrival(), []);
  if (arrival === null) {
    return (
      <p role="alert" data-sbs-mgmt-plan-activation-c-staff-check="arrival-failed">
        適用前の合成状態を作れませんでした。
      </p>
    );
  }
  return (
    <div data-sbs-mgmt-plan-activation-c-staff-check="before-apply">
      <p data-sbs-mgmt-plan-activation-c-staff-check-note="true">
        合成確認画面です。本番には保存されません。現在適用中は版3、次版は版4の下書きです。⑥で「版
        4 を適用開始する」を押せます。
      </p>
      <SupportPlan
        presentation={DEMO_UX_SUPPORT_PLAN_FIXTURE}
        presentationRole="PLANNER"
        initialRevisionSession={arrival.session}
        initialCapturedReview={arrival.capturedReview}
        nextVersionConceptHighlighted
        focusNextVersionOnMount
      />
    </div>
  );
};

const ChromeSmokeApp: React.FC<{
  initial: ReturnType<typeof parseParams>;
}> = ({ initial }) => {
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
      data-review-new-version-demo-slice={SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id}
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

const SmokeApp: React.FC = () => {
  const initial = parseParams();
  if (initial.staffPlanTransition === "beforeApply") {
    return <StaffBeforeApplyApp />;
  }
  return <ChromeSmokeApp initial={initial} />;
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(<SmokeApp />, root);
