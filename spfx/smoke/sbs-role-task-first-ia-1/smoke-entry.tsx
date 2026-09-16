/**
 * CORR-1F browser smoke entry.
 * Synthetic FIELD_STAFF fixture only. No LIVE WRITE / auth / schema mutation.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../src/shell/ux/fixture";
import ScaffoldShell from "../../src/webparts/scaffoldShellWebPart/components/ScaffoldShell";

const fixture = DEMO_1_FIELD_STAFF_FIXTURE;

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(
  <ScaffoldShell
    description="Synthetic CORR-1F task-first smoke"
    isDarkTheme={false}
    environmentMessage="Synthetic browser smoke"
    userDisplayName="Synthetic FIELD_STAFF"
    demoMode={fixture.demoMode}
    siteSelection={fixture.siteSelection}
    saveState="saved"
    viewMode={fixture.viewMode}
    correlationId={fixture.correlationId}
    errorCode={fixture.errorCode}
    partialRetrieval={fixture.partialRetrieval}
  />,
  root,
);
