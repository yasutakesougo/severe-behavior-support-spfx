import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bindingMatchesSupportPlanVersion,
  planVersionForProcedureRecordProjection,
  projectProcedureRecordSupportContent,
  resolveHistoricalPlanVersionForProcedureRecord,
  validateProcedureRecord,
  validateSupportPlanVersion,
  validateSupportPlanVersionProcedureBinding,
} from "../../src/domain";
import type { ReviewObservationEvidenceInput } from "../../spfx/src/shell/procedure/review-observation-association";
import * as reviewObservationAssociationModule from "../../spfx/src/shell/procedure/review-observation-association";
import * as procedureFixtureModule from "../../spfx/src/shell/procedure/procedure-fixture";
import * as reviewDueSemanticsModule from "../../spfx/src/shell/review/review-due-semantics";
import * as supportPlanFixtureModule from "../../spfx/src/shell/users/support-plan-fixture";
import {
  createPlanningPcDemoActivePlan,
  createPlanningPcDemoHistoricalProcedureRecord,
  createPlanningPcDemoPlanVersion,
  createPlanningPcDemoV2Binding,
  createPlanningPcDemoV3Binding,
  PLANNING_PC_DEMO_CURRENT_VERSION,
  PLANNING_PC_DEMO_PLAN_ID,
} from "../domain/planning-pc-demo-graph-fixtures";

type CheckpointResult = "PASS" | "GAP_FOUND" | "ENVIRONMENT_BLOCKED";

/**
 * Root `tsx --test` loads `spfx/` as CJS (nested package.json has no "type": "module").
 * Named ESM imports then fail at instantiate time; unwrap the CJS default when present.
 */
function runtimeExports<T extends object>(mod: T): T {
  const candidate = mod as T & { default?: T };
  if (!candidate.default || typeof candidate.default !== "object") {
    return mod;
  }
  const named = candidate as Record<string, unknown>;
  const hasNamedRuntimeValue = Object.keys(candidate).some(
    (key) => key !== "default" && key !== "__esModule" && named[key] !== undefined,
  );
  return hasNamedRuntimeValue ? mod : candidate.default;
}

const { associateReviewObservations } = runtimeExports(reviewObservationAssociationModule);
const {
  FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
  FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
  FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
} = runtimeExports(procedureFixtureModule);
const { SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE, presentReviewDueSemanticBasis } =
  runtimeExports(reviewDueSemanticsModule);
const {
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  PLANNING_PC_DEMO_1_SLICE,
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
} = runtimeExports(supportPlanFixtureModule);

function aggregateCheckpointResults(results: readonly CheckpointResult[]): CheckpointResult {
  if (results.includes("ENVIRONMENT_BLOCKED")) {
    return "ENVIRONMENT_BLOCKED";
  }
  if (results.includes("GAP_FOUND")) {
    return "GAP_FOUND";
  }
  return "PASS";
}

describe("SP-LC-6 synthetic lifecycle acceptance contract", () => {
  it("AC-1 keeps SupportPlanVersion v2 -> Procedure p2 binding separate from Active v3", () => {
    const v2 = createPlanningPcDemoPlanVersion(2);
    const v3 = createPlanningPcDemoPlanVersion(3);
    const v2Binding = createPlanningPcDemoV2Binding();
    const v3Binding = createPlanningPcDemoV3Binding();

    assert.equal(validateSupportPlanVersion(v2), true);
    assert.equal(validateSupportPlanVersion(v3), true);
    assert.equal(validateSupportPlanVersionProcedureBinding(v2Binding), true);
    assert.equal(validateSupportPlanVersionProcedureBinding(v3Binding), true);
    assert.equal(bindingMatchesSupportPlanVersion(v2Binding, v2), true);
    assert.equal(bindingMatchesSupportPlanVersion(v2Binding, v3), false);
    assert.equal(bindingMatchesSupportPlanVersion(v3Binding, v3), true);
  });

  it("AC-2 keeps the historical ProcedureRecord on planVersion 2 and refuses v3 fallback", () => {
    const record = createPlanningPcDemoHistoricalProcedureRecord();
    const v2 = createPlanningPcDemoPlanVersion(2);
    const v3 = createPlanningPcDemoPlanVersion(3);

    assert.equal(validateProcedureRecord(record), true);
    assert.equal(record.planId, PLANNING_PC_DEMO_PLAN_ID);
    assert.equal(record.planVersion, 2);
    assert.equal(planVersionForProcedureRecordProjection(record), 2);

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
    assert.equal(projectProcedureRecordSupportContent(record, v3), null);
    assert.ok(projectProcedureRecordSupportContent(record, v2));
  });

  it("AC-3 associates only Observation evidence from the exact historical record context", () => {
    const association = associateReviewObservations(
      FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );

    assert.equal(association.status, "ASSOCIATED");
    assert.equal(association.procedureRecordId, "synthetic-proc-rec-v2-001");
    assert.equal(association.planId, PLANNING_PC_DEMO_PLAN_ID);
    assert.equal(association.planVersion, 2);
    assert.deepEqual(
      association.observations.map((item) => item.observationRecordId),
      ["synthetic-observation-v2-001", "synthetic-observation-v2-002"],
    );
  });

  it("AC-4 keeps unresolved distinct and records missing successful-empty as GAP_FOUND", () => {
    const unresolved = associateReviewObservations(
      FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );
    assert.equal(unresolved.status, "UNRESOLVED");
    if (unresolved.status === "UNRESOLVED") {
      assert.equal(unresolved.reason, "HISTORICAL_LOOKUP_UNRESOLVED");
      assert.deepEqual(unresolved.observations, []);
    }

    const zeroMatch = associateReviewObservations(FIELD_WORKFLOW_REVIEW_MATERIAL_V2, []);
    const successfulEmptyExists =
      zeroMatch.status === "ASSOCIATED" && zeroMatch.observations.length === 0;
    assert.equal(successfulEmptyExists, false);
    assert.notEqual(zeroMatch.status, "ASSOCIATED");
    assert.equal(zeroMatch.status, "UNRESOLVED");
    if (zeroMatch.status === "UNRESOLVED") {
      assert.equal(zeroMatch.reason, "NO_EXACT_CONTEXT_MATCH");
      assert.deepEqual(zeroMatch.observations, []);
    }

    const result: CheckpointResult =
      unresolved.status === "UNRESOLVED" && successfulEmptyExists ? "PASS" : "GAP_FOUND";
    assert.equal(result, "GAP_FOUND");
  });

  it("AC-5 preserves D5 review timing semantics without fixed 90-day invalidation", () => {
    const first = presentReviewDueSemanticBasis(true);
    const subsequent = presentReviewDueSemanticBasis(false);

    assert.equal(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.fixedNinetyDaysAuthorized, false);
    assert.equal(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.hardOverdueAuthorized, false);
    assert.equal(SP_LC_3_REVIEW_DUE_ORIGIN_1_SLICE.callerSuppliedDueAuthorized, true);
    assert.match(first.originLabel, /支援計画の有効開始日/);
    assert.match(subsequent.originLabel, /前回見直し日/);
    assert.match(first.approachingLabel, /暦月/);
    assert.match(first.dueLabel, /固定90日や自動失効には変換しません/);
  });

  it("AC-6 observes continuation as a no-mutation invariant rather than a dedicated command", () => {
    const activePlanBefore = createPlanningPcDemoActivePlan();
    const historicalVersionBefore = createPlanningPcDemoPlanVersion(2);
    const historicalRecordBefore = createPlanningPcDemoHistoricalProcedureRecord();
    const snapshot = structuredClone({
      activePlan: activePlanBefore,
      historicalVersion: historicalVersionBefore,
      historicalRecord: historicalRecordBefore,
    });

    associateReviewObservations(
      FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );
    presentReviewDueSemanticBasis(false);

    assert.equal(activePlanBefore.currentVersion, PLANNING_PC_DEMO_CURRENT_VERSION);
    assert.equal(historicalVersionBefore.version, 2);
    assert.equal(historicalRecordBefore.planVersion, 2);
    assert.deepEqual(
      {
        activePlan: activePlanBefore,
        historicalVersion: historicalVersionBefore,
        historicalRecord: historicalRecordBefore,
      },
      snapshot,
    );
  });

  it("AC-7 preserves missing executable new-version behavior as GAP_FOUND", () => {
    assert.equal(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion, 3);
    assert.equal(DEMO_UX_SUPPORT_PLAN_FIXTURE.conceptualNextVersion, 4);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.presentationOnly, true);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.planMutationAuthorized, false);

    const result: CheckpointResult =
      SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized ||
      SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized
        ? "PASS"
        : "GAP_FOUND";
    assert.equal(result, "GAP_FOUND");
  });

  it("AC-8 rejects identity/version mismatch instead of falling forward to a later Active version", () => {
    const v2Binding = createPlanningPcDemoV2Binding();
    const v3 = createPlanningPcDemoPlanVersion(3);
    assert.equal(bindingMatchesSupportPlanVersion(v2Binding, v3), false);

    const mismatchedEvidence: readonly ReviewObservationEvidenceInput[] =
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE.map((item) => ({
        ...item,
        planVersion: 3,
      }));
    const association = associateReviewObservations(
      FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
      mismatchedEvidence,
    );
    assert.equal(association.status, "UNRESOLVED");
    if (association.status === "UNRESOLVED") {
      assert.equal(association.reason, "NO_EXACT_CONTEXT_MATCH");
    }
  });

  it("AC-9 records missing execution-time mutation telemetry as GAP_FOUND", () => {
    assert.equal(PLANNING_PC_DEMO_1_SLICE.liveWriteAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.liveTenantIoAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.sharePointRestAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.deployAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.liveWriteAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.liveTenantIoAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.sharePointRestAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.deployAuthorized, false);

    const observedSlices: ReadonlyArray<Record<string, unknown>> = [
      PLANNING_PC_DEMO_1_SLICE,
      SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
    ];
    const mutationCountKeys = [
      "mutationCount",
      "liveWriteCount",
      "sharePointWriteCount",
      "writeCount",
    ];
    const mutationCountTelemetryAvailable = observedSlices.some((slice) =>
      mutationCountKeys.some((key) => key in slice && typeof slice[key] === "number"),
    );
    const result: CheckpointResult = mutationCountTelemetryAvailable ? "PASS" : "GAP_FOUND";
    assert.equal(mutationCountTelemetryAvailable, false);
    assert.equal(result, "GAP_FOUND");
  });

  it("uses deterministic acceptance precedence ENVIRONMENT_BLOCKED > GAP_FOUND > PASS", () => {
    assert.equal(aggregateCheckpointResults(["PASS", "PASS"]), "PASS");
    assert.equal(aggregateCheckpointResults(["PASS", "GAP_FOUND"]), "GAP_FOUND");
    assert.equal(
      aggregateCheckpointResults(["PASS", "GAP_FOUND", "ENVIRONMENT_BLOCKED"]),
      "ENVIRONMENT_BLOCKED",
    );
  });
});
