import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { MonitoringPeriodReviewOutcome } from "../../src/domain/monitoring-period-review-outcome";
import {
  bindingMatchesMonitoringPeriodReviewOutcome,
  findBindingForOutcome,
  findBindingForPlanVersion,
  isRevisionPending,
  type SupportPlanVersionMonitoringPeriodReviewBinding,
  validateMonitoringPeriodReviewBindingSet,
  validateSupportPlanVersionMonitoringPeriodReviewBinding,
} from "../../src/domain/support-plan-version-monitoring-period-review-binding";

function outcome(
  overrides: Partial<MonitoringPeriodReviewOutcome> = {},
): MonitoringPeriodReviewOutcome {
  return {
    OutcomeId: "synthetic-outcome-001",
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: "synthetic-user-001",
    planId: "synthetic-plan-001",
    planVersion: 2,
    periodStart: "2026-08-01T00:00:00+09:00",
    periodEnd: "2026-08-31T23:59:59+09:00",
    sourceRecordIds: ["synthetic-record-001"],
    decision: "CHANGE_REQUIRED",
    reviewedAt: "2026-08-31T18:00:00+09:00",
    reviewedBy: "synthetic-staff-001",
    ...overrides,
  };
}

function binding(
  overrides: Partial<SupportPlanVersionMonitoringPeriodReviewBinding> = {},
): SupportPlanVersionMonitoringPeriodReviewBinding {
  return {
    OrganizationId: "synthetic-org-001",
    SiteId: "synthetic-site-001",
    UserId: "synthetic-user-001",
    planId: "synthetic-plan-001",
    planVersion: 3,
    reviewedPlanVersion: 2,
    sourceOutcomeId: "synthetic-outcome-001",
    boundAt: "2026-08-31T19:00:00+09:00",
    boundBy: "synthetic-staff-001",
    ...overrides,
  };
}

describe("SupportPlanVersionMonitoringPeriodReviewBinding domain", () => {
  it("allows CHANGE_REQUIRED to remain Revision Pending before N+1 binding exists", () => {
    const source = outcome();
    assert.equal(isRevisionPending(source, []), true);
    assert.equal(validateMonitoringPeriodReviewBindingSet([source], []), true);
  });

  it("clears derived Revision Pending once one valid binding exists", () => {
    const source = outcome();
    const link = binding();
    assert.equal(bindingMatchesMonitoringPeriodReviewOutcome(link, source), true);
    assert.equal(isRevisionPending(source, [link]), false);
    assert.equal(findBindingForOutcome(source.OutcomeId, [link]), link);
    assert.equal(findBindingForPlanVersion(source.planId, 3, [link]), link);
  });

  it("requires N+1 to be greater than reviewed version N", () => {
    assert.equal(validateSupportPlanVersionMonitoringPeriodReviewBinding(binding()), true);
    assert.equal(
      validateSupportPlanVersionMonitoringPeriodReviewBinding(
        binding({ planVersion: 2, reviewedPlanVersion: 2 }),
      ),
      false,
    );
  });

  it("rejects a binding for NO_CHANGE", () => {
    const source = outcome({ decision: "NO_CHANGE" });
    const link = binding();
    assert.equal(bindingMatchesMonitoringPeriodReviewOutcome(link, source), false);
    assert.equal(validateMonitoringPeriodReviewBindingSet([source], [link]), false);
    assert.equal(isRevisionPending(source, []), false);
  });

  it("enforces U1 one sourceOutcomeId to at most one binding", () => {
    const source = outcome();
    const first = binding();
    const second = binding({ planVersion: 4, boundAt: "2026-08-31T20:00:00+09:00" });
    assert.equal(validateMonitoringPeriodReviewBindingSet([source], [first, second]), false);
    assert.equal(findBindingForOutcome(source.OutcomeId, [first, second]), null);
  });

  it("enforces U2 one scoped created plan version to at most one binding", () => {
    const sourceA = outcome();
    const sourceB = outcome({ OutcomeId: "synthetic-outcome-002" });
    const first = binding();
    const second = binding({ sourceOutcomeId: sourceB.OutcomeId });
    assert.equal(validateMonitoringPeriodReviewBindingSet([sourceA, sourceB], [first, second]), false);
  });

  it("fails closed when source outcome identity/context does not match", () => {
    const source = outcome();
    assert.equal(
      bindingMatchesMonitoringPeriodReviewOutcome(binding({ UserId: "synthetic-user-002" }), source),
      false,
    );
    assert.equal(
      bindingMatchesMonitoringPeriodReviewOutcome(binding({ reviewedPlanVersion: 1 }), source),
      false,
    );
  });
});
