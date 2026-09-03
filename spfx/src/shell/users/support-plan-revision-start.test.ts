/**
 * B2 orchestration unit tests — canonical revision fixture ↔ Planning-PC start.
 * Synthetic / session-only. No LIVE WRITE.
 */
import { humanReviewResultForSyntheticVersion } from "../monitoring/human-review-fixture";
import { assembleSyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import {
  SBS_MGMT_LOOP_B_CURRENT_PLAN,
  SBS_MGMT_LOOP_B_EXISTING_VERSIONS,
  SBS_MGMT_LOOP_B_EXISTING_VERSIONS_WITH_CONFLICT,
  SBS_MGMT_LOOP_B_REVISION_FIXTURE,
  SBS_MGMT_LOOP_B_SOURCE_VERSION,
  assertOutcomeMatchesRevisionFixture,
  assertPresentationMatchesRevisionFixture,
} from "./support-plan-revision-fixture";
import {
  EMPTY_SUPPORT_PLAN_REVISION_SESSION,
  SUPPORT_PLAN_REVISION_SESSION_LIVE_WRITE_AUTHORIZED,
  createBeforeApplyStaffTransitionArrival,
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
    expect(SBS_MGMT_LOOP_B_CURRENT_PLAN.currentVersion).toBe(3);
    expect(SBS_MGMT_LOOP_B_SOURCE_VERSION.version).toBe(3);
    expect(SBS_MGMT_LOOP_B_EXISTING_VERSIONS).toEqual([SBS_MGMT_LOOP_B_SOURCE_VERSION]);
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

  it("B2 start uses canonical provenance and yields exact N+1 session draft", () => {
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
    expect(result.draft.candidate.goals).toEqual(SBS_MGMT_LOOP_B_SOURCE_VERSION.goals);
    expect(result.draft.candidate.supportMethods).toEqual(
      SBS_MGMT_LOOP_B_SOURCE_VERSION.supportMethods,
    );
    expect(result.draft.reviewBinding.reviewedPlanVersion).toBe(3);
    expect(result.draft.reviewBinding.planVersion).toBe(4);
    expect(result.intent.sourcePlanVersion).toBe(3);
    expect(result.intent.status).toBe("CONSUMED");
  });

  it("B2 supplies existingVersions so N+1 conflict holds", () => {
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
    const result = startSyntheticPlanningPcRevision({
      presentation: DEMO_UX_SUPPORT_PLAN_FIXTURE,
      capturedReview: captured.captured,
      session: {
        intents: [],
        drafts: [],
        existingVersions: SBS_MGMT_LOOP_B_EXISTING_VERSIONS_WITH_CONFLICT,
      },
      actor: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actor,
      actionAt: SBS_MGMT_LOOP_B_REVISION_FIXTURE.actionAt,
    });
    expect(result.status).toBe("HOLD");
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

  it("staff before-apply arrival exposes Draft v4 without applying", () => {
    const arrival = createBeforeApplyStaffTransitionArrival();
    expect(arrival).not.toBeNull();
    if (arrival === null) {
      return;
    }
    expect(arrival.session.drafts).toHaveLength(1);
    expect(arrival.session.drafts[0]?.candidate.version).toBe(4);
    expect(arrival.session.drafts[0]?.reviewBinding.reviewedPlanVersion).toBe(3);
    expect(SBS_MGMT_LOOP_B_CURRENT_PLAN.currentVersion).toBe(3);
    expect(SUPPORT_PLAN_REVISION_SESSION_LIVE_WRITE_AUTHORIZED).toBe(false);
  });
});
