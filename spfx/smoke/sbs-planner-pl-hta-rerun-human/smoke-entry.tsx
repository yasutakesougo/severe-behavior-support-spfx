/**
 * SBS-PLANNER Human PL-HTA Re-Run judgment harness.
 * Pins actual D-MONITOR product body for STATE A (v1 / 0件) and STATE B (v2 / NOT_PERFORMED).
 * Synthetic / presentation only. No LIVE WRITE / Deploy / auth / schema mutation.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { buildDemoMonitoringForVersion, monitoringQueryForVersion } from "../../src/shell/monitoring";
import { buildMonitoringReviewInput } from "../../src/shell/monitoring/monitoring-review-input";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../../src/shell/users";
import { AppShellChrome } from "../../src/shell/ux/AppShellChrome";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../src/shell/ux/fixture";
import { PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT } from "../../src/shell/ux/planner-task-navigation";

type PlHtaState = "a" | "b";

function resolveState(): PlHtaState {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path.endsWith("/state-b") || path.endsWith("/state-b/index.html")) return "b";
  if (path.endsWith("/state-a") || path.endsWith("/state-a/index.html")) return "a";
  const params = new URLSearchParams(window.location.search);
  return params.get("state") === "b" ? "b" : "a";
}

const reviewModelV2Result = buildDemoMonitoringForVersion(2);
if (reviewModelV2Result.status !== "RESOLVED") {
  throw new Error("expected resolved v2 monitoring fixture for PL-HTA re-run harness");
}

const syntheticReviewAuthority = {
  status: "FOUND" as const,
  MappingKey: {
    SourceSystem: "synthetic-smoke",
    OrganizationId: "synthetic-org-001",
    SourceScope: "synthetic-monitoring-smoke",
    LegacyKeyType: "UserId",
    LegacyKeyValue: "user-a",
  },
};

const reviewInputV2 = buildMonitoringReviewInput(
  syntheticReviewAuthority,
  monitoringQueryForVersion(2),
  reviewModelV2Result.value,
);
const reviewContextV2 = monitoringQueryForVersion(2);

const state = resolveState();
const planVersion = state === "a" ? 1 : 2;
const query = monitoringQueryForVersion(planVersion);

const root = document.getElementById("root");
if (!root) {
  throw new Error("PL-HTA re-run harness root missing");
}

ReactDOM.render(
  <div
    data-pl-hta-rerun-harness="true"
    data-pl-hta-state={state === "a" ? "STATE-A" : "STATE-B"}
    data-pl-hta-bound-head="4647223e82d175e35748a5107bef6e322f316935"
  >
    <aside
      data-pl-hta-harness-meta="true"
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "12px",
        lineHeight: 1.45,
        padding: "10px 14px",
        borderBottom: "1px solid #cbd5e1",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <strong>Human PL-HTA Re-Run harness</strong>
      {" · "}
      {state === "a" ? "STATE A" : "STATE B"}
      {" · destination D-MONITOR · HARNESS READY (technical only ≠ PL-HTA PASS)"}
      <br />
      person Aさん / user-a · plan {query.planId} · Organization / Site {query.OrganizationId} /{" "}
      {query.SiteId} · period 2026-08-01〜2026-08-31 · planVersion {planVersion}
      <br />
      review authority seed FOUND · HumanReview expected RESOLVED after D-MONITOR rebind
    </aside>
    <AppShellChrome
      demoMode={DEMO_1_FIELD_STAFF_FIXTURE.demoMode}
      siteSelection={DEMO_1_FIELD_STAFF_FIXTURE.siteSelection}
      saveState="saved"
      viewMode={DEMO_1_FIELD_STAFF_FIXTURE.viewMode}
      correlationId={DEMO_1_FIELD_STAFF_FIXTURE.correlationId}
      errorCode={DEMO_1_FIELD_STAFF_FIXTURE.errorCode}
      userDisplayName="Synthetic Demo"
      presentationRole="PLANNER"
      selectedDestination="users"
      supportPlanPresentation={{
        ...DEMO_UX_SUPPORT_PLAN_FIXTURE,
        currentVersion: planVersion,
      }}
      monitoringReviewInput={reviewInputV2}
      monitoringReviewPresentationContext={reviewContextV2}
      plannerTaskDestination="D-MONITOR"
      plannerPersonPlanContext={PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT}
    />
  </div>,
  root,
);
