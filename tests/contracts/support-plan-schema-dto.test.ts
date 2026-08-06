import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUPPORT_PLAN_SCHEMA_ID,
  SUPPORT_PLAN_SCHEMA_VERSION,
  SUPPORT_PLAN_VERSION_SCHEMA_ID,
  SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
  toSupportPlanDto,
  toSupportPlanVersionDto,
  validateSupportPlanDto,
  validateSupportPlanVersionDto,
} from "../../src/domain/support-plan";
import {
  createSyntheticDraftPlan,
  createSyntheticPlanVersion1,
} from "../domain/support-plan-fixtures";

describe("SupportPlan Schema/DTO metadata (Issue #42 PR-A1)", () => {
  it("exposes canonical Schema ID and Version for SupportPlan", () => {
    assert.equal(SUPPORT_PLAN_SCHEMA_ID, "severe-behavior-support.support-plan.plan");
    assert.equal(SUPPORT_PLAN_SCHEMA_VERSION, "1.0.0");
  });

  it("exposes canonical Schema ID and Version for SupportPlanVersion", () => {
    assert.equal(
      SUPPORT_PLAN_VERSION_SCHEMA_ID,
      "severe-behavior-support.support-plan.plan-version",
    );
    assert.equal(SUPPORT_PLAN_VERSION_SCHEMA_VERSION, "1.0.0");
  });

  it("builds DTO envelopes with dtoVersion equal to schemaVersion", () => {
    const planDto = toSupportPlanDto(createSyntheticDraftPlan());
    assert.equal(planDto.schemaId, SUPPORT_PLAN_SCHEMA_ID);
    assert.equal(planDto.schemaVersion, SUPPORT_PLAN_SCHEMA_VERSION);
    assert.equal(planDto.dtoVersion, planDto.schemaVersion);
    assert.equal(planDto.data.PlanId, "synthetic-plan-001");

    const versionDto = toSupportPlanVersionDto(createSyntheticPlanVersion1());
    assert.equal(versionDto.schemaId, SUPPORT_PLAN_VERSION_SCHEMA_ID);
    assert.equal(versionDto.schemaVersion, SUPPORT_PLAN_VERSION_SCHEMA_VERSION);
    assert.equal(versionDto.dtoVersion, versionDto.schemaVersion);
    assert.equal(versionDto.data.planId, "synthetic-plan-001");
  });

  it("accepts valid DTO envelopes and rejects schema mismatches", () => {
    const validPlan = toSupportPlanDto(createSyntheticDraftPlan());
    assert.equal(validateSupportPlanDto(validPlan), true);
    assert.equal(
      validateSupportPlanDto({
        ...validPlan,
        schemaId: "severe-behavior-support.support-plan.other",
      }),
      false,
    );
    assert.equal(
      validateSupportPlanDto({
        ...validPlan,
        schemaVersion: "2.0.0",
        dtoVersion: "2.0.0",
      }),
      false,
    );

    const validVersion = toSupportPlanVersionDto(createSyntheticPlanVersion1());
    assert.equal(validateSupportPlanVersionDto(validVersion), true);
    assert.equal(
      validateSupportPlanVersionDto({
        ...validVersion,
        schemaId: SUPPORT_PLAN_SCHEMA_ID,
      }),
      false,
    );
  });

  it("keeps PlanId and planId naming differences explicit across contracts", () => {
    const plan = createSyntheticDraftPlan();
    const version = createSyntheticPlanVersion1();
    assert.equal("PlanId" in plan, true);
    assert.equal("planId" in plan, false);
    assert.equal("planId" in version, true);
    assert.equal("PlanId" in version, false);
  });
});
