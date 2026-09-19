/**
 * SBS-PLANNER-PL-HTA-CORRECTION-1 browser smoke entry.
 * Product / Demo presentation only. No LIVE WRITE / auth / schema mutation.
 * Do NOT inject presentationRole: "PLANNER".
 * Do NOT use ?cycle= / initialPlannerCycle as D-PLAN / D-MONITOR bind proof.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../src/shell/ux/fixture";
import ScaffoldShell from "../../src/webparts/scaffoldShellWebPart/components/ScaffoldShell";
import type { IScaffoldShellProps } from "../../src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps";

const fixture = DEMO_1_FIELD_STAFF_FIXTURE;

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

const smokeProps = {
  description: "Synthetic PLANNER PL-HTA Correction-1 smoke",
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
} as IScaffoldShellProps;

ReactDOM.render(<ScaffoldShell {...smokeProps} />, root);
