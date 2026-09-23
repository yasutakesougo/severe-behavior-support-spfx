/**
 * SBS-MGMT-LOOP-A (#552) — synthetic rendered browser acceptance entry.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
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

const MODEL_A = modelForEvidenceSnapshot("record-a");
const MODEL_B = modelForEvidenceSnapshot("record-b");
const MODEL_ZERO: MonitoringReadModel = {
  ...SHARED_CONTEXT,
  recordCount: 0,
  records: [],
};

const MODELS = {
  A: MODEL_A,
  B: MODEL_B,
  ZERO: MODEL_ZERO,
} as const;

type SnapshotName = keyof typeof MODELS;

const SmokeApp: React.FC = () => {
  const [snapshot, setSnapshot] = React.useState<SnapshotName>("A");
  const model = MODELS[snapshot];

  return (
    <>
      <div role="group" aria-label="smoke evidence snapshot selector">
        {(Object.keys(MODELS) as SnapshotName[]).map((name) => (
          <button
            key={name}
            type="button"
            data-smoke-snapshot={name}
            onClick={() => setSnapshot(name)}
          >
            snapshot {name}
          </button>
        ))}
      </div>
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
if (!root) throw new Error("SBS-MGMT-LOOP-A smoke root missing");
ReactDOM.render(<SmokeApp />, root);
