/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — synthetic rendered browser acceptance.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { MonitoringReadModel } from "../../src/sbs-domain/monitoring-read-model.bundle";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";

function modelFor(userId: string): MonitoringReadModel {
  return {
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: userId,
    planId: "plan-a",
    planVersion: 3,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    recordCount: 1,
    records: [
      {
        RecordId: "record-1",
        Procedure: {
          ProcedureId: "procedure-1",
          ProcedureVersion: "v1",
          ApprovalState: "APPROVED",
        },
        result: "PERFORMED_AS_PLANNED",
        performedAt: "2026-08-10T10:00:00+09:00",
        recordedAt: "2026-08-10T10:05:00+09:00",
        planId: "plan-a",
        planVersion: 3,
      },
    ],
  };
}

const SmokeApp: React.FC = () => {
  const [person, setPerson] = React.useState<"A" | "B">("A");
  const userId = person === "A" ? "user-a" : "user-b";
  const personLabel = person === "A" ? "Aさん" : "Bさん";

  return (
    <>
      <button type="button" data-smoke-switch-context="true" onClick={() => setPerson("B")}>
        Bさんへ切替
      </button>
      <MonitoringView
        model={modelFor(userId)}
        personLabel={personLabel}
        procedureLabelContext={{
          userId,
          planId: "plan-a",
          currentVersion: 3,
          currentProcedures: [
            {
              procedureId: "procedure-1",
              procedureVersion: "v1",
              planVersion: 3,
              sceneLabel: "朝の活動前",
            },
          ],
        }}
      />
    </>
  );
};

const root = document.getElementById("root");
if (!root) throw new Error("review outcome context note smoke root missing");
ReactDOM.render(<SmokeApp />, root);
