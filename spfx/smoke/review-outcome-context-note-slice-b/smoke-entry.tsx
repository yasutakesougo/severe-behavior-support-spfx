/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B — synthetic rendered browser acceptance.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
 *
 * Snapshot A / B share the same review-context key; only evidence RecordId differs.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { MonitoringReadModel } from "../../src/sbs-domain/monitoring-read-model.bundle";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";
import {
  monitoringReviewInputForSmoke,
  reviewPresentationContextForReviewAuthority,
} from "../review-authority-fixture";

const SHARED_CONTEXT = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  UserId: "user-a",
  planId: "plan-a",
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
} as const;

function modelForEvidenceSnapshot(recordId: string): MonitoringReadModel {
  return {
    ...SHARED_CONTEXT,
    recordCount: 1,
    records: [
      {
        RecordId: recordId,
        Procedure: {
          ProcedureId: "procedure-1",
          ProcedureVersion: "v1",
          ApprovalState: "APPROVED",
        },
        result: "PERFORMED_AS_PLANNED",
        performedAt: "2026-08-10T10:00:00+09:00",
        recordedAt: "2026-08-10T10:05:00+09:00",
        planId: SHARED_CONTEXT.planId,
        planVersion: SHARED_CONTEXT.planVersion,
      },
    ],
  };
}

/** Evidence snapshot A = record-a */
const MODEL_A = modelForEvidenceSnapshot("record-a");
/** Evidence snapshot B = record-b (same review-context key) */
const MODEL_B = modelForEvidenceSnapshot("record-b");

const SmokeApp: React.FC = () => {
  const [snapshot, setSnapshot] = React.useState<"A" | "B">("A");
  const model = snapshot === "A" ? MODEL_A : MODEL_B;

  return (
    <>
      <button
        type="button"
        data-smoke-switch-context="true"
        onClick={() => setSnapshot((current) => (current === "A" ? "B" : "A"))}
      >
        evidence snapshot switch
      </button>
      <MonitoringView
        model={model}
        reviewInput={monitoringReviewInputForSmoke(model)}
        reviewPresentationContext={reviewPresentationContextForReviewAuthority(model)}
        personLabel="Aさん"
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
