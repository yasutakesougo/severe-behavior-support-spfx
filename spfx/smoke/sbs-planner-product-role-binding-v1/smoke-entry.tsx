/**
 * SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 browser smoke entry.
 * Product / Demo role-selection proof. No LIVE WRITE / auth / schema mutation.
 * Do NOT inject presentationRole: "PLANNER". Cycle query is smoke-only context.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../src/shell/ux/fixture";
import type { PlannerCyclePosition } from "../../src/shell/ux/planner-task-navigation";
import ScaffoldShell from "../../src/webparts/scaffoldShellWebPart/components/ScaffoldShell";
import type { IScaffoldShellProps } from "../../src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps";

const fixture = DEMO_1_FIELD_STAFF_FIXTURE;

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

const parseCycle = (raw: string | null): PlannerCyclePosition => {
  switch (raw) {
    case "①":
    case "②":
    case "③":
    case "④":
    case "⑤":
    case "⑥":
    case "unknown":
      return raw;
    case null:
    case "":
      return "unknown";
    default:
      throw new Error(`Unsupported smoke cycle query: ${raw}`);
  }
};

const cycle = parseCycle(new URLSearchParams(window.location.search).get("cycle"));

const smokeProps = {
  description: "Synthetic PLANNER Product / Demo role-binding smoke",
  isDarkTheme: false,
  environmentMessage: "Synthetic browser smoke",
  userDisplayName: "Synthetic Demo",
  demoMode: fixture.demoMode,
  siteSelection: fixture.siteSelection,
  saveState: "saved" as const,
  viewMode: fixture.viewMode,
  correlationId: fixture.correlationId,
  errorCode: fixture.errorCode,
  partialRetrieval: fixture.partialRetrieval,
  // Cycle fixture only. Not FE-F002 proof. Not a Product presentationRole prop.
  initialPlannerCycle: cycle,
} as IScaffoldShellProps;

ReactDOM.render(<ScaffoldShell {...smokeProps} />, root);
