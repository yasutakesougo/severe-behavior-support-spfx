/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — synthetic rendered browser acceptance.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { MonitoringReadModel } from "../../src/sbs-domain/monitoring-read-model.bundle";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";

function modelFor(userId: string, planVersion: number): MonitoringReadModel {
  return {
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: userId,
    planId: "plan-a",
    planVersion,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    recordCount: 1,
    records: [
      {
        RecordId: `record-${userId}-v${planVersion}`,
        Procedure: {
          ProcedureId: "procedure-1",
          ProcedureVersion: "v1",
          ApprovalState: "APPROVED",
        },
        result: "PERFORMED_AS_PLANNED",
        performedAt: "2026-08-10T10:00:00+09:00",
        recordedAt: "2026-08-10T10:05:00+09:00",
        planId: "plan-a",
        planVersion,
      },
    ],
  };
}

/** Snapshot A: user-a on plan version 3 */
const MODEL_A = modelFor("user-a", 3);
/** Snapshot B: user-b on plan version 4 — same org/site/period base, different review context */
const MODEL_B = modelFor("user-b", 4);

const SmokeApp: React.FC = () => {
  const [snapshot, setSnapshot] = React.useState<"A" | "B">("A");
  const model = snapshot === "A" ? MODEL_A : MODEL_B;
  const personLabel = snapshot === "A" ? "Aさん" : "Bさん";

  return (
    <>
      <button
        type="button"
        data-smoke-switch-context="true"
        onClick={() => setSnapshot((current) => (current === "A" ? "B" : "A"))}
      >
        verification context switch
      </button>
      <MonitoringView
        model={model}
        personLabel={personLabel}
        procedureLabelContext={{
          userId: model.UserId,
          planId: model.planId,
          currentVersion: model.planVersion,
          currentProcedures: [
            {
              procedureId: "procedure-1",
              procedureVersion: "v1",
              planVersion: model.planVersion,
              sceneLabel: "朝の活動前",
            },
          ],
        }}
      />
    </>
  );
};

const root = document.getElementById("root");
if (!root) throw new Error("review outcome note smoke root missing");
ReactDOM.render(<SmokeApp />, root);
