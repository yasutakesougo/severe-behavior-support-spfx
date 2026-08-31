import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID,
  SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION,
  toSupportPlanVersionMonitoringPeriodReviewBindingDto,
  validateSupportPlanVersionMonitoringPeriodReviewBindingDto,
  type SupportPlanVersionMonitoringPeriodReviewBinding,
} from "../../src/domain/support-plan-version-monitoring-period-review-binding";

const binding: SupportPlanVersionMonitoringPeriodReviewBinding = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  UserId: "synthetic-user-001",
  planId: "synthetic-plan-001",
  planVersion: 3,
  reviewedPlanVersion: 2,
  sourceOutcomeId: "synthetic-outcome-001",
  boundAt: "2026-08-31T19:00:00+09:00",
  boundBy: "synthetic-staff-001",
};

describe("SupportPlanVersionMonitoringPeriodReviewBinding contract", () => {
  it("locks schema identity and DTO version", () => {
    assert.equal(
      SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.version-outcome-binding",
    );
    assert.equal(SUPPORT_PLAN_VERSION_MONITORING_PERIOD_REVIEW_BINDING_SCHEMA_VERSION, "1.0.0");
    const dto = toSupportPlanVersionMonitoringPeriodReviewBindingDto(binding);
    assert.equal(validateSupportPlanVersionMonitoringPeriodReviewBindingDto(dto), true);
    assert.equal(dto.dtoVersion, dto.schemaVersion);
  });

  it("rejects schema drift and malformed N to N+1 direction", () => {
    const dto = toSupportPlanVersionMonitoringPeriodReviewBindingDto(binding);
    assert.equal(
      validateSupportPlanVersionMonitoringPeriodReviewBindingDto({
        ...dto,
        schemaId: "severe-behavior-support.monitoring-period-review.other-binding",
      }),
      false,
    );
    assert.equal(
      validateSupportPlanVersionMonitoringPeriodReviewBindingDto({
        ...dto,
        data: { ...binding, planVersion: binding.reviewedPlanVersion },
      }),
      false,
    );
  });
});
