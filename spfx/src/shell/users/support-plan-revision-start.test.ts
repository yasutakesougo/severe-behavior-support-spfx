/**
 * B2 orchestration unit tests — canonical revision fixture ↔ Planning-PC start.
 * Synthetic / session-only. No LIVE WRITE.
 */
import { humanReviewResultForSyntheticVersion } from "../monitoring/human-review-fixture";
import { assembleSyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import {
  SBS_MGMT_LOOP_B_REVISION_FIXTURE,
  assertOutcomeMatchesRevisionFixture,
  assertPresentationMatchesRevisionFixture,
} from "./support-plan-revision-fixture";
import {
  EMPTY_SUPPORT_PLAN_REVISION_SESSION,
  SUPPORT_PLAN_REVISION_SESSION_LIVE_WRITE_AUTHORIZED,
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

describe("SBS-MGMT-LOOP-B B2 revision orchestration", () => {
  it("canonical fixture identity matches Planning-PC presentation + monitoring", () => {
    expect(assertPresentationMatchesRevisionFixture(DEMO_UX_SUPPORT_PLAN_FIXTURE)).toBe(true);
    const materials = humanReviewResultForSyntheticVersion(
      SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
    );
    expect(materials.status).toBe("RESOLVED");
    if (materials.status !== "RESOLVED") {
      return;
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
      return;
    }
    expect(assertOutcomeMatchesRevisionFixture(captured.captured.outcome)).toBe(true);
  });

  it("B2 start yields exact N+1 session draft without LIVE WRITE", () => {
    expect(SUPPORT_PLAN_REVISION_SESSION_LIVE_WRITE_AUTHORIZED).toBe(false);
    const materials = humanReviewResultForSyntheticVersion(
      SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
    );
    expect(materials.status).toBe("RESOLVED");
    if (materials.status !== "RESOLVED") {
      return;
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
      return;
    }

    const result = startSyntheticPlanningPcRevision({
      presentation: DEMO_UX_SUPPORT_PLAN_FIXTURE,
      capturedReview: captured.captured,
      session: EMPTY_SUPPORT_PLAN_REVISION_SESSION,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    });

    expect(result.status).toBe("STARTED");
    if (result.status !== "STARTED" && result.status !== "ALREADY_STARTED") {
      return;
    }
    expect(result.draft.candidate.version).toBe(4);
    expect(result.draft.reviewBinding.reviewedPlanVersion).toBe(3);
    expect(result.draft.reviewBinding.planVersion).toBe(4);
    expect(result.intent.sourcePlanVersion).toBe(3);
    expect(result.intent.status).toBe("CONSUMED");
  });

  it("rejects mismatched presentation/orchestration identity", () => {
    const materials = humanReviewResultForSyntheticVersion(
      SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
    );
    if (materials.status !== "RESOLVED") {
      return;
    }
    const captured = assembleSyntheticCapturedReview(
      materials.value,
      "CHANGE_REQUIRED",
      "活動切替前の予告方法を見直す必要がある",
      "",
      SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    );
    if (captured.status !== "CAPTURED") {
      return;
    }
    const mismatched = {
      ...DEMO_UX_SUPPORT_PLAN_FIXTURE,
      planId: "synthetic-plan-other",
    };
    const result = startSyntheticPlanningPcRevision({
      presentation: mismatched,
      capturedReview: captured.captured,
      session: EMPTY_SUPPORT_PLAN_REVISION_SESSION,
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    });
    expect(result.status).toBe("INVALID");
  });
});
