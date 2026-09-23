/**
 * MONITORING-REVIEW-AUTHORITY-HANDOFF — Correction-3 rendered smoke.
 * Synthetic TEST / SMOKE fixtures only. No LIVE I/O / Deploy / SharePoint.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import type {
  MonitoringReadModel,
  ReviewPresentationContext,
} from "../../src/sbs-domain/monitoring-read-model.bundle";
import { MonitoringView } from "../../src/shell/monitoring/MonitoringView";
import {
  monitoringQueryForReviewAuthority,
  monitoringReviewInputForSmoke,
  reviewPresentationContextForReviewAuthority,
} from "../review-authority-fixture";
import { buildMonitoringReviewInput } from "../../src/shell/monitoring/monitoring-review-input";

const SHARED_CONTEXT = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  UserId: "user-a",
  planId: "plan-a",
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
} as const;

function modelFor(
  planVersion: number,
  records: MonitoringReadModel["records"],
): MonitoringReadModel {
  return {
    ...SHARED_CONTEXT,
    planVersion,
    recordCount: records.length,
    records,
  };
}

function performedRecord(planVersion: number, recordId: string) {
  return {
    RecordId: recordId,
    Procedure: {
      ProcedureId: "procedure-1",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED" as const,
    },
    result: "PERFORMED_AS_PLANNED" as const,
    performedAt: "2026-08-10T10:00:00+09:00",
    recordedAt: "2026-08-10T10:05:00+09:00",
    planId: "plan-a",
    planVersion,
  };
}

const BASE_MODEL = modelFor(3, [performedRecord(3, "record-1")]);
const HISTORICAL_MODEL = modelFor(2, [performedRecord(2, "record-historical-v2")]);
const ZERO_MODEL = modelFor(1, []);
const NOT_PERFORMED_MODEL = modelFor(3, [
  {
    ...performedRecord(3, "record-not-performed"),
    result: "NOT_PERFORMED" as const,
  },
]);
const MULTIPLE_VISIBLE_MODEL = modelFor(3, [
  performedRecord(3, "record-visible-a"),
  performedRecord(3, "record-visible-b"),
]);

type SmokeCase = Readonly<{
  id: string;
  label: string;
  model: MonitoringReadModel;
  reviewInput?: ReturnType<typeof monitoringReviewInputForSmoke>;
  reviewPresentationContext?: ReviewPresentationContext;
}>;

const mismatchContext = (model: MonitoringReadModel): ReviewPresentationContext => ({
  ...reviewPresentationContextForReviewAuthority(model),
  planVersion: model.planVersion + 1,
});

const unresolvedInput = buildMonitoringReviewInput(
  { status: "NOT_FOUND" },
  monitoringQueryForReviewAuthority(BASE_MODEL),
  BASE_MODEL,
);

const cases: readonly SmokeCase[] = [
  {
    id: "RBA-1",
    label: "valid authority and exact context",
    model: BASE_MODEL,
    reviewInput: monitoringReviewInputForSmoke(BASE_MODEL),
    reviewPresentationContext: reviewPresentationContextForReviewAuthority(BASE_MODEL),
  },
  {
    id: "RBA-2",
    label: "missing person resolution",
    model: BASE_MODEL,
    reviewInput: unresolvedInput,
    reviewPresentationContext: reviewPresentationContextForReviewAuthority(BASE_MODEL),
  },
  {
    id: "RBA-3",
    label: "valid authority with mismatched presentation context",
    model: HISTORICAL_MODEL,
    reviewInput: monitoringReviewInputForSmoke(HISTORICAL_MODEL),
    reviewPresentationContext: mismatchContext(HISTORICAL_MODEL),
  },
  {
    id: "RBA-4-exact",
    label: "historical plan version preserved",
    model: HISTORICAL_MODEL,
    reviewInput: monitoringReviewInputForSmoke(HISTORICAL_MODEL),
    reviewPresentationContext: reviewPresentationContextForReviewAuthority(HISTORICAL_MODEL),
  },
  {
    id: "RBA-4-mismatch",
    label: "historical model cannot be relabeled as current",
    model: HISTORICAL_MODEL,
    reviewInput: monitoringReviewInputForSmoke(HISTORICAL_MODEL),
    reviewPresentationContext: mismatchContext(HISTORICAL_MODEL),
  },
  {
    id: "RBA-5",
    label: "model-only caller fails closed",
    model: MULTIPLE_VISIBLE_MODEL,
  },
  {
    id: "RBA-6",
    label: "authority without display context fails closed",
    model: BASE_MODEL,
    reviewInput: monitoringReviewInputForSmoke(BASE_MODEL),
  },
  {
    id: "RBA-7",
    label: "zero records remain resolved",
    model: ZERO_MODEL,
    reviewInput: monitoringReviewInputForSmoke(ZERO_MODEL),
    reviewPresentationContext: reviewPresentationContextForReviewAuthority(ZERO_MODEL),
  },
  {
    id: "RBA-8",
    label: "not performed is distinct from zero records",
    model: NOT_PERFORMED_MODEL,
    reviewInput: monitoringReviewInputForSmoke(NOT_PERFORMED_MODEL),
    reviewPresentationContext: reviewPresentationContextForReviewAuthority(NOT_PERFORMED_MODEL),
  },
];

function procedureLabelContext(model: MonitoringReadModel) {
  return {
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
  };
}

const root = document.getElementById("root");
if (!root) throw new Error("monitoring review authority smoke root missing");

ReactDOM.render(
  <main>
    <h1>Monitoring review authority handoff</h1>
    {cases.map((testCase) => (
      <article key={testCase.id} data-rba={testCase.id}>
        <h2>
          {testCase.id}: {testCase.label}
        </h2>
        <MonitoringView
          model={testCase.model}
          reviewInput={testCase.reviewInput}
          reviewPresentationContext={testCase.reviewPresentationContext}
          personLabel="Aさん"
          procedureLabelContext={procedureLabelContext(testCase.model)}
        />
      </article>
    ))}
  </main>,
  root,
);
