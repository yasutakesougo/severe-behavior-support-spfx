/**
 * HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1 — synthetic rendered acceptance.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";
import { buildDemoMonitoringForVersion } from "../../src/shell/monitoring/monitoring-fixture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../../src/shell/users/support-plan-fixture";
import {
  monitoringReviewInputForSmoke,
  reviewPresentationContextForReviewAuthority,
} from "../review-authority-fixture";

function selectedModel() {
  const testCase = new URLSearchParams(window.location.search).get("case") ?? "v3";
  const planVersion = testCase === "v1" ? 1 : testCase === "v2" ? 2 : 3;
  const monitoring = buildDemoMonitoringForVersion(planVersion);
  if (monitoring.status !== "RESOLVED") {
    throw new Error(`expected RESOLVED monitoring for ${testCase}`);
  }
  return monitoring.value;
}

const root = document.getElementById("root");
if (!root) throw new Error("ia-clarity smoke root missing");
const model = selectedModel();

ReactDOM.render(
  <MonitoringView
    model={model}
    reviewInput={monitoringReviewInputForSmoke(model)}
    reviewPresentationContext={reviewPresentationContextForReviewAuthority(model)}
    personLabel="Aさん"
    procedureLabelContext={{
      userId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
      planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
      currentVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
      currentProcedures: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures,
    }}
  />,
  root,
);
