/**
 * SBS-PLANNER-TOP-LEVEL-IA-V1 browser smoke harness.
 * Synthetic PLANNER role/cycle fixtures only. No live I/O or authorization inference.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE } from "../../src/shell/ux";
import ScaffoldShell from "../../src/webparts/scaffoldShellWebPart/components/ScaffoldShell";

const SmokeApp: React.FC = () => (
  <ScaffoldShell
    description="Synthetic PLANNER Task-First smoke"
    isDarkTheme={false}
    environmentMessage="synthetic"
    userDisplayName="Planner Smoke Synthetic"
    demoMode={true}
    siteSelection="SITE-ISG"
    saveState="saved"
    viewMode="ready"
    correlationId="planner-top-level-smoke"
    errorCode=""
    partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
  />
);

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(<SmokeApp />, root);
