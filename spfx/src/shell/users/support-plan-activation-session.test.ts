/**
 * #583 activation session orchestration tests — synthetic/session-only.
 */
import { humanReviewResultForSyntheticVersion } from "../monitoring/human-review-fixture";
import { assembleSyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import {
  EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION,
  SUPPORT_PLAN_ACTIVATION_SESSION_LIVE_WRITE_AUTHORIZED,
  applySyntheticPlanningPcActivation,
  createSyntheticSupportPlanCasRepository,
} from "./support-plan-activation-session";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import {
  SBS_MGMT_LOOP_B_REVISION_FIXTURE,
} from "./support-plan-revision-fixture";
import {
  EMPTY_SUPPORT_PLAN_REVISION_SESSION,
  startSyntheticPlanningPcRevision,
} from "./support-plan-revision-start";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

async function startDraft() {
  const materials = humanReviewResultForSyntheticVersion(
    SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
  );
  expect(materials.status).toBe("RESOLVED");
  if (materials.status !== "RESOLVED") {
    throw new Error("expected RESOLVED");
  }
  const captured = assembleSyntheticCapturedReview(
    materials.value,
    "CHANGE_REQUIRED",
    "活動切替前の予告方法を見直す必要がある",
    "",
    SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
  );
  expect(captured.status).toBe("CAPTURED");
  if (captured.status !== "CAPTURED") {
    throw new Error("expected CAPTURED");
  }
  const started = startSyntheticPlanningPcRevision({
    presentation: DEMO_UX_SUPPORT_PLAN_FIXTURE,
    capturedReview: captured.captured,
    session: EMPTY_SUPPORT_PLAN_REVISION_SESSION,
    actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
    actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
  });
  expect(started.status).toBe("STARTED");
  if (started.status !== "STARTED") {
    throw new Error("expected STARTED");
  }
  return started.draft;
}

describe("SBS-MGMT-PLAN-ACTIVATION-C session orchestration", () => {
  it("applies draft via CAS and emits session receipt without LIVE WRITE", async () => {
    expect(SUPPORT_PLAN_ACTIVATION_SESSION_LIVE_WRITE_AUTHORIZED).toBe(false);
    const draft = await startDraft();
    const result = await applySyntheticPlanningPcActivation({
      draft,
      session: EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    });
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") {
      return;
    }
    expect(result.session.currentPlan.currentVersion).toBe(4);
    expect(result.session.currentPlan.version).toBe(2);
    expect(result.session.currentPlan.approvedBy).toBe(
      EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION.currentPlan.approvedBy,
    );
    expect(result.receipt.activatedVersion).toBe(4);
    expect(result.receipt.fromVersion).toBe(3);
  });

  it("duplicate exact Apply returns ALREADY_APPLIED without advancing again", async () => {
    const draft = await startDraft();
    const first = await applySyntheticPlanningPcActivation({
      draft,
      session: EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    });
    expect(first.status).toBe("SUCCESS");
    if (first.status !== "SUCCESS") {
      return;
    }
    const second = await applySyntheticPlanningPcActivation({
      draft,
      session: first.session,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: "2026-09-03T12:05:00+09:00",
    });
    expect(second.status).toBe("ALREADY_APPLIED");
    if (second.status === "ALREADY_APPLIED") {
      expect(second.session.currentPlan.currentVersion).toBe(4);
      expect(second.session.currentPlan.version).toBe(2);
    }
  });

  it("CAS conflict leaves prior session state", async () => {
    const draft = await startDraft();
    const repo = createSyntheticSupportPlanCasRepository(
      EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION.currentPlan,
    );
    // Force conflict by advancing row version underneath.
    await repo.save(
      { ...EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION.currentPlan, currentVersion: 3 },
      1,
    );
    const result = await applySyntheticPlanningPcActivation({
      draft,
      session: EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
      savePlan: repo.save,
    });
    expect(result.status).toBe("CONFLICT");
  });
});
