import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  bindingMatchesSupportPlanVersion,
  evaluateActivePlanUniqueness,
  planVersionForProcedureRecordProjection,
  projectProcedureRecordSupportContent,
  resolveHistoricalPlanVersionForProcedureRecord,
  validateProcedureRecord,
  validateSupportPlan,
  validateSupportPlanVersion,
  validateSupportPlanVersionProcedureBinding,
} from "../../src/domain";
import {
  createPlanningPcDemoActivePlan,
  createPlanningPcDemoHistoricalProcedureRecord,
  createPlanningPcDemoPlanVersion,
  createPlanningPcDemoV2Binding,
  createPlanningPcDemoV3Binding,
  PLANNING_PC_DEMO_CURRENT_VERSION,
  PLANNING_PC_DEMO_PLAN_ID,
  PLANNING_PC_DEMO_SITE_ID,
  PLANNING_PC_DEMO_USER_ID,
} from "../domain/planning-pc-demo-graph-fixtures";

describe("PLANNING-PC-DEMO-1 synthetic graph (Schema 1.0.0 reuse)", () => {
  it("accepts Active v3 plan with required approvedBy metadata kept off UI meaning", () => {
    const plan = createPlanningPcDemoActivePlan();
    assert.equal(validateSupportPlan(plan), true);
    assert.equal(plan.status, "Active");
    assert.equal(plan.currentVersion, PLANNING_PC_DEMO_CURRENT_VERSION);
    assert.equal(plan.PlanId, PLANNING_PC_DEMO_PLAN_ID);
    assert.equal(plan.UserId, PLANNING_PC_DEMO_USER_ID);
    assert.equal(plan.SiteId, PLANNING_PC_DEMO_SITE_ID);
    assert.equal(typeof plan.approvedBy, "string");
    assert.equal(evaluateActivePlanUniqueness([plan]), "UNIQUE");
  });

  it("accepts historical and current SupportPlanVersion rows", () => {
    const v1 = createPlanningPcDemoPlanVersion(1);
    const v2 = createPlanningPcDemoPlanVersion(2);
    const v3 = createPlanningPcDemoPlanVersion(3);
    assert.equal(validateSupportPlanVersion(v1), true);
    assert.equal(validateSupportPlanVersion(v2), true);
    assert.equal(validateSupportPlanVersion(v3), true);
    assert.equal(v3.version, 3);
    assert.equal(v2.version, 2);
  });

  it("binds current procedure to v3 and historical procedure to v2", () => {
    const v2 = createPlanningPcDemoPlanVersion(2);
    const v3 = createPlanningPcDemoPlanVersion(3);
    const v2Binding = createPlanningPcDemoV2Binding();
    const v3Binding = createPlanningPcDemoV3Binding();
    assert.equal(validateSupportPlanVersionProcedureBinding(v2Binding), true);
    assert.equal(validateSupportPlanVersionProcedureBinding(v3Binding), true);
    assert.equal(bindingMatchesSupportPlanVersion(v2Binding, v2), true);
    assert.equal(bindingMatchesSupportPlanVersion(v3Binding, v3), true);
    assert.equal(bindingMatchesSupportPlanVersion(v2Binding, v3), false);
  });

  it("keeps historical ProcedureRecord on planVersion 2 and refuses v3 fallback", () => {
    const record = createPlanningPcDemoHistoricalProcedureRecord();
    const v2 = createPlanningPcDemoPlanVersion(2);
    const v3 = createPlanningPcDemoPlanVersion(3);
    assert.equal(validateProcedureRecord(record), true);
    assert.equal(planVersionForProcedureRecordProjection(record), 2);
    assert.equal(record.planVersion, 2);

    const resolved = resolveHistoricalPlanVersionForProcedureRecord(record, {
      status: "FOUND",
      value: v2,
    });
    assert.equal(resolved.status, "RESOLVED");

    const mismatched = resolveHistoricalPlanVersionForProcedureRecord(record, {
      status: "FOUND",
      value: v3,
    });
    assert.equal(mismatched.status, "UNRESOLVED");
    if (mismatched.status === "UNRESOLVED") {
      assert.equal(mismatched.reason, "VERSION_MISMATCH");
    }

    assert.equal(projectProcedureRecordSupportContent(record, v3), null);
    const projected = projectProcedureRecordSupportContent(record, v2);
    assert.ok(projected);
    assert.equal(projected?.planVersion, 2);
  });
});
