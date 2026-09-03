import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { MonitoringPeriodReviewDecisionReason } from "../../src/domain/monitoring-period-review-decision-reason";
import type { MonitoringPeriodReviewOutcome } from "../../src/domain/monitoring-period-review-outcome";
import type { SupportPlan, SupportPlanVersion } from "../../src/domain/support-plan";
import { validateSupportPlanVersion } from "../../src/domain/support-plan";
import { validateSupportPlanVersionMonitoringPeriodReviewBinding } from "../../src/domain/support-plan-version-monitoring-period-review-binding";
import {
  consumeRevisionIntentToDraft,
  createRevisionIntent,
  mintRevisionIntentId,
  revisionDraftMatchesIntent,
  startSupportPlanRevision,
  validateRevisionIntent,
  validateSupportPlanRevisionDraftCandidate,
  type RevisionIntent,
  type SupportPlanRevisionDraftCandidate,
} from "../../src/domain/support-plan-revision";

const plan: SupportPlan = {
  PlanId: "synthetic-plan-553",
  OrganizationId: "synthetic-org-553",
  SiteId: "synthetic-site-553",
  UserId: "synthetic-user-553",
  currentVersion: 3,
  createdBy: "synthetic-author",
  createdAt: "2026-01-01T09:00:00+09:00",
  version: 1,
  status: "Active",
  submittedBy: "synthetic-submitter",
  submittedAt: "2026-01-02T09:00:00+09:00",
  approvedBy: "synthetic-approver",
  approvedAt: "2026-01-03T09:00:00+09:00",
  effectiveFrom: "2026-01-04T00:00:00+09:00",
};

const sourceVersion: SupportPlanVersion = {
  planId: plan.PlanId,
  OrganizationId: plan.OrganizationId,
  SiteId: plan.SiteId,
  UserId: plan.UserId,
  version: 3,
  goals: ["落ち着いて活動へ移動できる"],
  supportMethods: ["予定を短い言葉とカードで伝える"],
  precautions: ["急な切替を避ける"],
  reviewCriteria: ["移動時の支援記録を見直す"],
  versionCreatedBy: "synthetic-author",
  versionCreatedAt: "2026-05-01T09:00:00+09:00",
};

const sourceOutcome: MonitoringPeriodReviewOutcome = {
  OutcomeId: "synthetic-outcome-553",
  OrganizationId: plan.OrganizationId,
  SiteId: plan.SiteId,
  UserId: plan.UserId,
  planId: plan.PlanId,
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  sourceRecordIds: ["synthetic-record-553"],
  decision: "CHANGE_REQUIRED",
  reviewedAt: "2026-08-31T18:00:00+09:00",
  reviewedBy: "synthetic-reviewer",
};

const sourceReason: MonitoringPeriodReviewDecisionReason = {
  OutcomeId: sourceOutcome.OutcomeId,
  reason: "活動切替前の予告方法を見直す必要がある",
};

const actor = "synthetic-revision-staff";
const actionAt = "2026-09-01T09:00:00+09:00";

function openIntent(): RevisionIntent {
  const result = createRevisionIntent({
    currentPlan: plan,
    sourceVersion,
    sourceOutcome,
    sourceDecisionReason: sourceReason,
    createdBy: actor,
    createdAt: actionAt,
  });
  assert.equal(result.status, "CREATED");
  if (result.status !== "CREATED") throw new Error("expected CREATED");
  return result.intent;
}

function createdAggregate(): { intent: RevisionIntent; draft: SupportPlanRevisionDraftCandidate } {
  const result = consumeRevisionIntentToDraft({
    intent: openIntent(),
    sourceVersion,
    sourceOutcome,
    existingVersions: [sourceVersion],
    existingDrafts: [],
    draftCreatedBy: actor,
    draftCreatedAt: actionAt,
  });
  assert.equal(result.status, "CREATED");
  if (result.status !== "CREATED") throw new Error("expected CREATED");
  return { intent: result.intent, draft: result.draft };
}

describe("SBS-MGMT-LOOP-B support-plan revision domain", () => {
  it("B1 rejects NO_CHANGE as a revision-start source", () => {
    const result = createRevisionIntent({
      currentPlan: plan,
      sourceVersion,
      sourceOutcome: { ...sourceOutcome, decision: "NO_CHANGE" },
      sourceDecisionReason: sourceReason,
      createdBy: actor,
      createdAt: actionAt,
    });
    assert.equal(result.status, "INVALID");
  });

  it("B3/B4 mints one deterministic intent identity from the exact source review", () => {
    const first = openIntent();
    const second = createRevisionIntent({
      currentPlan: plan,
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason: sourceReason,
      createdBy: "synthetic-other-actor",
      createdAt: "2026-09-01T10:00:00+09:00",
    });
    assert.equal(second.status, "CREATED");
    if (second.status !== "CREATED") throw new Error("expected CREATED");
    assert.equal(second.intent.RevisionIntentId, first.RevisionIntentId);
    assert.equal(
      first.RevisionIntentId,
      mintRevisionIntentId({
        OrganizationId: plan.OrganizationId,
        SiteId: plan.SiteId,
        UserId: plan.UserId,
        planId: plan.PlanId,
        sourcePlanVersion: 3,
        sourceReviewOutcomeId: sourceOutcome.OutcomeId,
      }),
    );
  });

  it("B5 fails closed for source context or decision-reason mismatch", () => {
    assert.equal(
      createRevisionIntent({
        currentPlan: plan,
        sourceVersion: { ...sourceVersion, UserId: "synthetic-other-user" },
        sourceOutcome,
        sourceDecisionReason: sourceReason,
        createdBy: actor,
        createdAt: actionAt,
      }).status,
      "INVALID",
    );
    assert.equal(
      createRevisionIntent({
        currentPlan: plan,
        sourceVersion,
        sourceOutcome,
        sourceDecisionReason: { ...sourceReason, OutcomeId: "synthetic-other-outcome" },
        createdBy: actor,
        createdAt: actionAt,
      }).status,
      "INVALID",
    );
  });

  it("B6 rejects a stale review after currentVersion has advanced and never falls back to N+2", () => {
    const result = createRevisionIntent({
      currentPlan: { ...plan, currentVersion: 4 },
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason: sourceReason,
      createdBy: actor,
      createdAt: actionAt,
    });
    assert.equal(result.status, "INVALID");
  });

  it("B7 creates exactly the source N+1 draft candidate and review binding", () => {
    const { intent, draft } = createdAggregate();
    assert.equal(intent.status, "CONSUMED");
    assert.equal(draft.candidate.version, 4);
    assert.equal(draft.reviewBinding.reviewedPlanVersion, 3);
    assert.equal(draft.reviewBinding.planVersion, 4);
    assert.equal(draft.reviewBinding.sourceOutcomeId, sourceOutcome.OutcomeId);
    assert.equal(revisionDraftMatchesIntent(draft, intent), true);
  });

  it("B7a validates candidate and review binding with domain validators", () => {
    const { intent, draft } = createdAggregate();
    assert.equal(validateSupportPlanVersion(draft.candidate), true);
    assert.equal(
      validateSupportPlanVersionMonitoringPeriodReviewBinding(draft.reviewBinding),
      true,
    );
    assert.equal(validateRevisionIntent(intent), true);
    assert.equal(validateSupportPlanRevisionDraftCandidate(draft), true);
  });

  it("B8 holds when N+1 already exists and leaves the intent OPEN", () => {
    const existingN4: SupportPlanVersion = { ...sourceVersion, version: 4 };
    const intent = openIntent();
    const result = consumeRevisionIntentToDraft({
      intent,
      sourceVersion,
      sourceOutcome,
      existingVersions: [sourceVersion, existingN4],
      existingDrafts: [],
      draftCreatedBy: actor,
      draftCreatedAt: actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status !== "HOLD") throw new Error("expected HOLD");
    assert.equal(result.intent.status, "OPEN");
  });

  it("B9 copies source content without mutating or reusing source arrays", () => {
    const before = JSON.stringify(sourceVersion);
    const { draft } = createdAggregate();
    assert.equal(JSON.stringify(sourceVersion), before);
    assert.deepEqual(draft.candidate.goals, sourceVersion.goals);
    assert.deepEqual(draft.candidate.supportMethods, sourceVersion.supportMethods);
    assert.notEqual(draft.candidate.goals, sourceVersion.goals);
    assert.notEqual(draft.candidate.supportMethods, sourceVersion.supportMethods);
    assert.equal(draft.candidate.versionCreatedBy, actor);
    assert.equal(draft.candidate.versionCreatedAt, actionAt);
  });

  it("B9a keeps source provenance immutable while candidate uses actor/time", () => {
    const sourceBefore = {
      versionCreatedBy: sourceVersion.versionCreatedBy,
      versionCreatedAt: sourceVersion.versionCreatedAt,
      goals: [...sourceVersion.goals],
      supportMethods: [...sourceVersion.supportMethods],
      precautions: [...sourceVersion.precautions],
      reviewCriteria: [...sourceVersion.reviewCriteria],
    };
    const { draft } = createdAggregate();
    assert.equal(sourceVersion.versionCreatedBy, sourceBefore.versionCreatedBy);
    assert.equal(sourceVersion.versionCreatedAt, sourceBefore.versionCreatedAt);
    assert.deepEqual([...sourceVersion.goals], sourceBefore.goals);
    assert.deepEqual([...sourceVersion.supportMethods], sourceBefore.supportMethods);
    assert.deepEqual([...sourceVersion.precautions], sourceBefore.precautions);
    assert.deepEqual([...sourceVersion.reviewCriteria], sourceBefore.reviewCriteria);
    assert.equal(draft.candidate.versionCreatedBy, actor);
    assert.equal(draft.candidate.versionCreatedAt, actionAt);
    assert.notEqual(draft.candidate.versionCreatedBy, sourceVersion.versionCreatedBy);
  });

  it("B10 returns consumed intent, candidate and binding as one successful aggregate", () => {
    const { intent, draft } = createdAggregate();
    assert.equal(intent.status, "CONSUMED");
    assert.equal(draft.RevisionIntentId, intent.RevisionIntentId);
    assert.equal(revisionDraftMatchesIntent(draft, intent), true);
  });

  it("B10a aligns intent/candidate/binding actor and time", () => {
    const { intent, draft } = createdAggregate();
    assert.equal(intent.createdBy, actor);
    assert.equal(intent.createdAt, actionAt);
    assert.equal(draft.candidate.versionCreatedBy, actor);
    assert.equal(draft.candidate.versionCreatedAt, actionAt);
    assert.equal(draft.reviewBinding.boundBy, actor);
    assert.equal(draft.reviewBinding.boundAt, actionAt);
  });

  it("B11 leaves the current SupportPlan status/currentVersion untouched", () => {
    const before = JSON.stringify(plan);
    createdAggregate();
    assert.equal(JSON.stringify(plan), before);
    assert.equal(plan.status, "Active");
    assert.equal(plan.currentVersion, 3);
  });

  it("B4 composed repeated action returns the same consumed aggregate without a second draft", () => {
    const first = startSupportPlanRevision({
      currentPlan: plan,
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason: sourceReason,
      existingVersions: [sourceVersion],
      existingIntents: [],
      existingDrafts: [],
      actor,
      actionAt,
    });
    assert.equal(first.status, "STARTED");
    if (first.status !== "STARTED") throw new Error("expected STARTED");

    const repeated = startSupportPlanRevision({
      currentPlan: plan,
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason: sourceReason,
      existingVersions: [sourceVersion, first.draft.candidate],
      existingIntents: [first.intent],
      existingDrafts: [first.draft],
      actor,
      actionAt: "2026-09-01T10:00:00+09:00",
    });
    assert.equal(repeated.status, "ALREADY_STARTED");
    if (repeated.status !== "ALREADY_STARTED") throw new Error("expected ALREADY_STARTED");
    assert.equal(repeated.intent.RevisionIntentId, first.intent.RevisionIntentId);
    assert.equal(repeated.draft.candidate.version, 4);
  });
});
