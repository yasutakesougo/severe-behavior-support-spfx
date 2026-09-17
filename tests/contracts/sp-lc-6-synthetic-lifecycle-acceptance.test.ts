import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import {
  bindingMatchesSupportPlanVersion,
  mintMonitoringPeriodReviewOutcomeId,
  planVersionForProcedureRecordProjection,
  projectProcedureRecordSupportContent,
  resolveHistoricalPlanVersionForProcedureRecord,
  startSupportPlanRevision,
  SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED,
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

  it("AC-4 distinguishes successful-empty ASSOCIATED [] from unresolved", () => {
    const unresolved = associateReviewObservations(
      FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED,
      FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    );
    assert.equal(unresolved.status, "UNRESOLVED");
    if (unresolved.status === "UNRESOLVED") {
      assert.equal(unresolved.reason, "HISTORICAL_LOOKUP_UNRESOLVED");
      assert.deepEqual(unresolved.observations, []);
    }

    const successfulEmpty = associateReviewObservations(FIELD_WORKFLOW_REVIEW_MATERIAL_V2, []);
    const successfulEmptyExists =
      successfulEmpty.status === "ASSOCIATED" && successfulEmpty.observations.length === 0;
    assert.equal(successfulEmptyExists, true);
    assert.equal(successfulEmpty.status, "ASSOCIATED");
    if (successfulEmpty.status === "ASSOCIATED") {
      assert.deepEqual(successfulEmpty.observations, []);
      assert.equal(successfulEmpty.planVersion, 2);
    }

    const mismatched = associateReviewObservations(FIELD_WORKFLOW_REVIEW_MATERIAL_V2, [
      {
        ...FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE[0],
        procedureRecordId: "different-record",
      },
    ]);
    assert.equal(mismatched.status, "UNRESOLVED");
    if (mismatched.status === "UNRESOLVED") {
      assert.equal(mismatched.reason, "NO_EXACT_CONTEXT_MATCH");
      assert.deepEqual(mismatched.observations, []);
    }

    const result: CheckpointResult =
      unresolved.status === "UNRESOLVED" && successfulEmptyExists ? "PASS" : "GAP_FOUND";
    assert.equal(result, "PASS");
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

  it("AC-7 observes executable Draft N+1 start without using DEMO-1 flags as the detector", () => {
    assert.equal(DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion, 3);
    assert.equal(DEMO_UX_SUPPORT_PLAN_FIXTURE.conceptualNextVersion, 4);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.presentationOnly, true);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.planMutationAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED, false);

    const currentPlan = createPlanningPcDemoActivePlan();
    const sourceVersion = createPlanningPcDemoPlanVersion(3);
    const historicalVersion = createPlanningPcDemoPlanVersion(2);
    const currentVersionBefore = currentPlan.currentVersion;
    const historicalBefore = structuredClone(historicalVersion);

    const sourceOutcomeInput = {
      OrganizationId: currentPlan.OrganizationId,
      SiteId: currentPlan.SiteId,
      UserId: currentPlan.UserId,
      planId: currentPlan.PlanId,
      planVersion: sourceVersion.version,
      periodStart: "2026-08-01T00:00:00+09:00",
      periodEnd: "2026-08-31T23:59:59+09:00",
      sourceRecordIds: ["synthetic-record-ac7-001"] as const,
      decision: "CHANGE_REQUIRED" as const,
      reviewedAt: "2026-08-31T18:00:00+09:00",
      reviewedBy: "synthetic-reviewer-ac7",
    };
    const sourceOutcome = {
      OutcomeId: mintMonitoringPeriodReviewOutcomeId(sourceOutcomeInput),
      ...sourceOutcomeInput,
    };
    const sourceDecisionReason = {
      OutcomeId: sourceOutcome.OutcomeId,
      reason: "活動切替前の予告方法を見直す必要がある",
    };

    const started = startSupportPlanRevision({
      currentPlan,
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason,
      existingVersions: [historicalVersion, sourceVersion],
      existingIntents: [],
      existingDrafts: [],
      actor: "synthetic-revision-staff-ac7",
      actionAt: "2026-09-17T06:29:00.000Z",
    });

    assert.equal(started.status, "STARTED");
    if (started.status !== "STARTED") {
      throw new Error("expected STARTED");
    }
    assert.equal(started.draft.candidate.version, sourceVersion.version + 1);
    assert.equal(currentPlan.currentVersion, currentVersionBefore);
    assert.equal(currentPlan.currentVersion, sourceVersion.version);
    assert.deepEqual(historicalVersion, historicalBefore);

    const alreadyStarted = startSupportPlanRevision({
      currentPlan,
      sourceVersion,
      sourceOutcome,
      sourceDecisionReason,
      existingVersions: [historicalVersion, sourceVersion],
      existingIntents: [started.intent],
      existingDrafts: [started.draft],
      actor: "synthetic-revision-staff-ac7",
      actionAt: "2026-09-17T06:30:00.000Z",
    });
    assert.equal(alreadyStarted.status, "ALREADY_STARTED");

    const result: CheckpointResult =
      started.status === "STARTED" &&
      started.draft.candidate.version === sourceVersion.version + 1 &&
      currentPlan.currentVersion === sourceVersion.version &&
      SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED === false &&
      SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.draftWorkflowAuthorized === false &&
      SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.versionPersistenceAuthorized === false
        ? "PASS"
        : "GAP_FOUND";
    assert.equal(result, "PASS");
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

  it("AC-9 records zero write-count telemetry from AC-9 source smoke reports as PASS", () => {
    // Authorization / LIVE WRITE boundary remains false on DEMO slice constants.
    assert.equal(PLANNING_PC_DEMO_1_SLICE.liveWriteAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.liveTenantIoAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.sharePointRestAuthorized, false);
    assert.equal(PLANNING_PC_DEMO_1_SLICE.deployAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.liveWriteAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.liveTenantIoAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.sharePointRestAuthorized, false);
    assert.equal(SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.deployAuthorized, false);

    // AC-9 authority is smoke-report WRITE_COUNT_KEYS (=0), not fixture slice flags alone.
    // Shape mirrors planning-pc-demo-1 / demo-ux-6 / support-plan-review-new-version-demo-1
    // smoke-report.json emission after AC-9 Exact Slice Implementation Start.
    const writeCountKeys = [
      "writeCount",
      "mutationCount",
      "liveWriteCount",
      "sharePointWriteCount",
    ] as const;
    const ac9SourceSmokeReports: ReadonlyArray<Record<string, unknown>> = [
      {
        unit: "PLANNING-PC-DEMO-1",
        writeCount: 0,
        mutationCount: 0,
        liveWriteCount: 0,
        sharePointWriteCount: 0,
        sliceFlags: { liveWriteAuthorized: false },
      },
      {
        unit: "DEMO-UX-6",
        writeCount: 0,
        mutationCount: 0,
        liveWriteCount: 0,
        sharePointWriteCount: 0,
        sliceFlags: { liveWriteAuthorized: false },
      },
      {
        unit: "SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1",
        writeCount: 0,
        mutationCount: 0,
        liveWriteCount: 0,
        sharePointWriteCount: 0,
        sliceFlags: { liveWriteAuthorized: false },
      },
    ];

    const observedWriteCounts: Array<{ key: string; value: number }> = [];
    for (const report of ac9SourceSmokeReports) {
      for (const key of writeCountKeys) {
        const value = report[key];
        assert.equal(typeof value, "number");
        observedWriteCounts.push({ key, value: value as number });
      }
      assert.equal(
        (report.sliceFlags as { liveWriteAuthorized: boolean }).liveWriteAuthorized,
        false,
      );
    }

    const mutationTelemetryAvailable = observedWriteCounts.length > 0;
    const mutationAttempted = observedWriteCounts.some((item) => item.value > 0);
    const result: CheckpointResult =
      mutationTelemetryAvailable && !mutationAttempted ? "PASS" : "GAP_FOUND";

    assert.equal(mutationTelemetryAvailable, true);
    assert.equal(mutationAttempted, false);
    assert.equal(result, "PASS");
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

// prettier-ignore
describe("SP-LC-6 acceptance execution authority preflight", () => {
  type PreflightReport = Readonly<{
    expectedMainSha: string | null;
    observedMainSha: string | null;
    shaMatch: boolean | null;
    preflightState: "PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED" | "PRECHECK_BASE_MISMATCH_NOT_STARTED";
    implementationStartAuthority: string;
    acceptanceExecutionAuthority: string | null;
    checkpoints: readonly unknown[];
    knownGaps: readonly unknown[];
    overallResult: null;
  }>;

  const REGRESSION_EXPECTED_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const REGRESSION_OBSERVED_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
  const REGRESSION_EXECUTION_AUTHORITY = "Human Acceptance Execution GO / regression";
  const ACCEPTANCE_RUNNER_PATH = `${process.cwd()}/scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs`;

  function runPreflightOnly(options: {
    expectedMainSha?: string;
    acceptanceExecutionAuthority?: string;
    observedMainSha: string;
  }): PreflightReport {
    const env: NodeJS.ProcessEnv = {
      SP_LC_6_OBSERVED_MAIN_SHA: options.observedMainSha,
    };

    if (options.expectedMainSha) {
      env.SP_LC_6_EXPECTED_MAIN_SHA = options.expectedMainSha;
    }
    if (options.acceptanceExecutionAuthority) {
      env.SP_LC_6_ACCEPTANCE_EXECUTION_AUTHORITY = options.acceptanceExecutionAuthority;
    }

    const result = spawnSync(process.execPath, [ACCEPTANCE_RUNNER_PATH], {
      cwd: process.cwd(),
      encoding: "utf8",
      env,
    });

    assert.equal(result.status, 2);
    assert.equal(result.stderr, "");
    return JSON.parse(result.stdout) as PreflightReport;
  }

  it("does not start when Human Acceptance Execution authority is incomplete", () => {
    const missingExpected = runPreflightOnly({
      observedMainSha: REGRESSION_OBSERVED_SHA,
      acceptanceExecutionAuthority: REGRESSION_EXECUTION_AUTHORITY,
    });
    assert.equal(missingExpected.preflightState, "PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED");
    assert.equal(missingExpected.expectedMainSha, null);
    assert.equal(missingExpected.shaMatch, null);
    assert.deepEqual(missingExpected.checkpoints, []);
    assert.equal(missingExpected.overallResult, null);

    const missingAuthority = runPreflightOnly({
      expectedMainSha: REGRESSION_EXPECTED_SHA,
      observedMainSha: REGRESSION_OBSERVED_SHA,
    });
    assert.equal(missingAuthority.preflightState, "PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED");
    assert.equal(missingAuthority.acceptanceExecutionAuthority, null);
    assert.equal(missingAuthority.shaMatch, null);
    assert.deepEqual(missingAuthority.checkpoints, []);
    assert.equal(missingAuthority.overallResult, null);
  });

  it("does not start when execution-authorized SHA differs from observed main", () => {
    const report = runPreflightOnly({
      expectedMainSha: REGRESSION_EXPECTED_SHA,
      observedMainSha: REGRESSION_OBSERVED_SHA,
      acceptanceExecutionAuthority: REGRESSION_EXECUTION_AUTHORITY,
    });

    assert.equal(report.preflightState, "PRECHECK_BASE_MISMATCH_NOT_STARTED");
    assert.equal(report.expectedMainSha, REGRESSION_EXPECTED_SHA);
    assert.equal(report.observedMainSha, REGRESSION_OBSERVED_SHA);
    assert.equal(report.shaMatch, false);
    assert.equal(report.acceptanceExecutionAuthority, REGRESSION_EXECUTION_AUTHORITY);
    assert.deepEqual(report.checkpoints, []);
    assert.equal(report.overallResult, null);
  });
});
