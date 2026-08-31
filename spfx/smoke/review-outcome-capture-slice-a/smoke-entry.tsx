/**
 * REVIEW-OUTCOME-CAPTURE-SLICE-A — synthetic rendered browser acceptance.
 * Verification surface only. No LIVE I/O / Deploy / SharePoint.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import type { MonitoringReadModel } from "../../src/sbs-domain/monitoring-read-model.bundle";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";

const model: MonitoringReadModel = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  UserId: "user-a",
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

const root = document.getElementById("root");
if (!root) throw new Error("review outcome smoke root missing");

ReactDOM.render(
  <MonitoringView
    model={model}
    personLabel="Aさん"
    procedureLabelContext={{
      userId: "user-a",
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
  />,
  root,
);
