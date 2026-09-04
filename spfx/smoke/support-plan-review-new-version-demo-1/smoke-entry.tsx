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
  isShellPrimaryNavigationId,
  isShellSiteSelection,
  parseShellPresentationRole,
  type ShellPresentationRole,
  type ShellPrimaryNavigationId,
  type ShellSaveState,
  type ShellSiteSelection,
  type ShellViewMode,
} from "../../src/shell/ux";
import { driveBeforeApplyPublicDom } from "../sbs-mgmt-loop-b/before-apply-dom-driver";

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

const ARRIVAL_TITLE: Record<"driving" | "ready" | "failed", string> = {
  driving: "【駆動中】適用前状態へ進めています",
  ready: "【適用待機】版 4 を適用開始する",
  failed: "【未到着】適用前状態へ進めませんでした",
};

const ARRIVAL_BANNER_STYLE: Record<"driving" | "ready" | "failed", React.CSSProperties> = {
  driving: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    margin: 0,
    padding: "12px 16px",
    background: "#1e3a5f",
    color: "#ffffff",
    fontWeight: 700,
  },
  ready: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    margin: 0,
    padding: "12px 16px",
    background: "#14532d",
    color: "#ffffff",
    fontWeight: 700,
  },
  failed: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    margin: 0,
    padding: "12px 16px",
    background: "#7f1d1d",
    color: "#ffffff",
    fontWeight: 700,
  },
};

const BeforeApplyArrivalBanner: React.FC<{ status: "driving" | "ready" | "failed" }> = ({
  status,
}) => {
  const text =
    status === "ready"
      ? "合成確認画面です。本番には保存されません。版3適用中 / 版4下書きです。⑥で「版 4 を適用開始する」を押せます。見直し結果が「変更なし」のままなら未到着です。"
      : status === "failed"
        ? "適用前状態へ進めませんでした。verification HEAD の serve-smoke を再起動し、URL に staffPlanTransition=beforeApply があるか確認してください。"
        : "合成確認: 適用前状態へ進めています（本番保存なし）。⑥の「次の版を作る」だけでは未到着です。";
  return (
    <p
      data-sbs-mgmt-plan-activation-c-staff-check={status}
      data-sbs-mgmt-plan-activation-c-staff-overlay="true"
      role="status"
      style={ARRIVAL_BANNER_STYLE[status]}
    >
      {text}
    </p>
  );
};

const BeforeApplyDomDriver: React.FC = () => {
  const [status, setStatus] = React.useState<"driving" | "ready" | "failed">("driving");
  React.useEffect(() => {
    const previousTitle = document.title;
    document.title = ARRIVAL_TITLE[status];
    return () => {
      document.title = previousTitle;
    };
  }, [status]);
  React.useEffect(() => {
    let cancelled = false;
    driveBeforeApplyPublicDom()
      .then(() => {
        if (!cancelled) {
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return <BeforeApplyArrivalBanner status={status} />;
};

const SmokeApp: React.FC = () => {
  const initial = parseParams();
  const [selectedDestination, setSelectedDestination] = React.useState<ShellPrimaryNavigationId>(
    initial.staffPlanTransition === "beforeApply" ? "users" : initial.selectedDestination,
  );

  return (
    <div
      data-shell-ux="smoke-root"
      data-sbs-mgmt-plan-activation-c-query={initial.staffPlanTransition ?? "none"}
      data-shell-ux-slice={SHELL_UX_SLICE.id}
      data-dashboard-ux-slice={DASHBOARD_UX_SLICE.id}
      data-demo-ux-slice={DEMO_UX_SLICE.id}
      data-demo-ux-3-slice={DEMO_UX_3_SLICE.id}
      data-demo-ux-4-slice={DEMO_UX_4_SLICE.id}
      data-planning-pc-demo-slice={PLANNING_PC_DEMO_1_SLICE.id}
      data-review-new-version-demo-slice={SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id}
    >
      {initial.staffPlanTransition === "beforeApply" ? <BeforeApplyDomDriver /> : null}
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
