import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { MonitoringPeriodReviewDecisionReason } from "../../src/domain/monitoring-period-review-decision-reason";
import type { MonitoringPeriodReviewOutcome } from "../../src/domain/monitoring-period-review-outcome";
import type { SupportPlan, SupportPlanVersion } from "../../src/domain/support-plan";
import {
  SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED,
  applySupportPlanActivation,
  mintDraftSnapshotId,
  type ActivationReceipt,
} from "../../src/domain/support-plan-activation";
import {
  consumeRevisionIntentToDraft,
  createRevisionIntent,
  type SupportPlanRevisionDraftCandidate,
} from "../../src/domain/support-plan-revision";

const plan: SupportPlan = {
  PlanId: "synthetic-plan-583",
  OrganizationId: "synthetic-org-583",
  SiteId: "synthetic-site-583",
  UserId: "synthetic-user-583",
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
  OutcomeId: "synthetic-outcome-583",
  OrganizationId: plan.OrganizationId,
  SiteId: plan.SiteId,
  UserId: plan.UserId,
  planId: plan.PlanId,
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  sourceRecordIds: ["synthetic-record-583"],
  decision: "CHANGE_REQUIRED",
  reviewedAt: "2026-08-31T18:00:00+09:00",
  reviewedBy: "synthetic-reviewer",
};

const sourceReason: MonitoringPeriodReviewDecisionReason = {
  OutcomeId: sourceOutcome.OutcomeId,
  reason: "活動切替前の予告方法を見直す必要がある",
};

const actor = "synthetic-activation-staff";
const actionAt = "2026-09-03T12:00:00+09:00";

function createDraft(): SupportPlanRevisionDraftCandidate {
  const intentResult = createRevisionIntent({
    currentPlan: plan,
    sourceVersion,
    sourceOutcome,
    sourceDecisionReason: sourceReason,
    createdBy: actor,
    createdAt: actionAt,
  });
  assert.equal(intentResult.status, "CREATED");
  if (intentResult.status !== "CREATED") {
    throw new Error("expected CREATED");
  }
  const draftResult = consumeRevisionIntentToDraft({
    intent: intentResult.intent,
    sourceVersion,
    sourceOutcome,
    existingVersions: [sourceVersion],
    existingDrafts: [],
    draftCreatedBy: actor,
    draftCreatedAt: actionAt,
  });
  assert.equal(draftResult.status, "CREATED");
  if (draftResult.status !== "CREATED") {
    throw new Error("expected CREATED");
  }
  return draftResult.draft;
}

describe("SBS-MGMT-PLAN-ACTIVATION-C support-plan activation domain", () => {
  it("A: without a prepared Apply request there is no SUCCESS transition helper misuse", () => {
    assert.equal(SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED, false);
    const draft = createDraft();
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft,
      confirmedDraftSnapshotId: "",
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "INVALID");
  });

  it("K/B/C/J: successful Apply advances currentVersion only and preserves approval metadata", () => {
    const draft = createDraft();
    const snapshotId = mintDraftSnapshotId(draft);
    const sourceCopy = structuredClone(sourceVersion);
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft,
      confirmedDraftSnapshotId: snapshotId,
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "SUCCESS");
    if (result.status !== "SUCCESS") {
      throw new Error("expected SUCCESS");
    }
    assert.equal(result.nextPlan.currentVersion, 4);
    assert.equal(result.nextPlan.version, plan.version);
    assert.equal(result.nextPlan.approvedBy, plan.approvedBy);
    assert.equal(result.nextPlan.approvedAt, plan.approvedAt);
    assert.equal(result.nextPlan.effectiveFrom, plan.effectiveFrom);
    assert.equal(result.receipt.activatedVersion, 4);
    assert.equal(result.receipt.fromVersion, 3);
    assert.equal(result.receipt.DraftSnapshotId, snapshotId);
    assert.deepEqual(sourceVersion, sourceCopy);
  });

  it("D: stale expectedCurrentVersion HOLD", () => {
    const draft = createDraft();
    const result = applySupportPlanActivation({
      currentPlan: { ...plan, currentVersion: 4, version: 2 },
      draft,
      confirmedDraftSnapshotId: mintDraftSnapshotId(draft),
      expectedCurrentVersion: 3,
      expectedRowVersion: 2,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "STALE_CURRENT_VERSION");
    }
  });

  it("E: duplicate exact Apply with existing receipt is ALREADY_APPLIED", () => {
    const draft = createDraft();
    const snapshotId = mintDraftSnapshotId(draft);
    const first = applySupportPlanActivation({
      currentPlan: plan,
      draft,
      confirmedDraftSnapshotId: snapshotId,
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(first.status, "SUCCESS");
    if (first.status !== "SUCCESS") {
      throw new Error("expected SUCCESS");
    }
    const receipt: ActivationReceipt = first.receipt;
    const second = applySupportPlanActivation({
      currentPlan: first.nextPlan,
      draft,
      confirmedDraftSnapshotId: snapshotId,
      expectedCurrentVersion: 4,
      expectedRowVersion: 2,
      actor,
      actionAt: "2026-09-03T12:05:00+09:00",
      existingReceipt: receipt,
    });
    assert.equal(second.status, "ALREADY_APPLIED");
    if (second.status === "ALREADY_APPLIED") {
      assert.equal(second.receipt.DraftSnapshotId, snapshotId);
      assert.equal(second.currentPlan.currentVersion, 4);
    }
  });

  it("F: identity mismatch HOLD", () => {
    const draft = createDraft();
    const result = applySupportPlanActivation({
      currentPlan: { ...plan, UserId: "other-user" },
      draft,
      confirmedDraftSnapshotId: mintDraftSnapshotId(draft),
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "IDENTITY_MISMATCH");
    }
  });

  it("G: DraftSnapshotId mismatch HOLD", () => {
    const draft = createDraft();
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft,
      confirmedDraftSnapshotId: "not-the-real-snapshot",
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "DRAFT_SNAPSHOT_MISMATCH");
    }
  });

  it("H: row-version mismatch HOLD (CAS precondition)", () => {
    const draft = createDraft();
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft,
      confirmedDraftSnapshotId: mintDraftSnapshotId(draft),
      expectedCurrentVersion: 3,
      expectedRowVersion: 99,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "ROW_VERSION_MISMATCH");
    }
  });

  it("I: targetVersion != N+1 HOLD", () => {
    const draft = createDraft();
    const badDraft: SupportPlanRevisionDraftCandidate = {
      ...draft,
      candidate: { ...draft.candidate, version: 5 },
      reviewBinding: { ...draft.reviewBinding, planVersion: 5 },
    };
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft: badDraft,
      confirmedDraftSnapshotId: mintDraftSnapshotId(badDraft),
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "TARGET_VERSION_NOT_N_PLUS_1");
    }
  });

  it("L: forged RevisionIntentId with a matching snapshot still fails closed", () => {
    const draft = createDraft();
    const forgedDraft: SupportPlanRevisionDraftCandidate = {
      ...draft,
      RevisionIntentId: "forged-revision-intent",
    };
    const result = applySupportPlanActivation({
      currentPlan: plan,
      draft: forgedDraft,
      confirmedDraftSnapshotId: mintDraftSnapshotId(forgedDraft),
      expectedCurrentVersion: 3,
      expectedRowVersion: 1,
      actor,
      actionAt,
    });
    assert.equal(result.status, "HOLD");
    if (result.status === "HOLD") {
      assert.equal(result.reason, "REVISION_INTENT_MISMATCH");
    }
  });

  it("mintDraftSnapshotId is deterministic for the same draft", () => {
    const draft = createDraft();
    assert.equal(mintDraftSnapshotId(draft), mintDraftSnapshotId(draft));
  });
});
