import fs from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import {
  classifyBrowserRequest,
  createBrowserNetworkEvidenceCollector,
  NO_LIVE_WRITE_CHECK_ID,
} from "../../scripts/layer-a/browser-network-evidence.mjs";
import {
  CANONICAL_HARNESS_PATHS,
  CANONICAL_STEPS,
  LAYER_A_ENVIRONMENT_KIND,
  PRODUCT_RC_SHA,
  createProvenanceEntry,
  createEnvironmentIdentity,
  evaluateCanonicalSteps,
  evaluateProductWorktreeState,
  evaluateSt10BehaviorContract,
  validateEnvironmentIdentity,
  validateProvenanceEntry,
} from "../../scripts/layer-a/run-layer-a.mjs";

const request = (url: string, method = "GET", resourceType = "fetch") => ({
  url: () => url,
  method: () => method,
  resourceType: () => resourceType,
});

type ProductWorktreeStateInputForTest = {
  head: string;
  productRcAvailable: boolean;
  productRcAncestor: boolean;
  clean: boolean;
  changedPaths?: string[];
};

const evaluateProductWorktreeStateForTest = evaluateProductWorktreeState as unknown as (
  input: ProductWorktreeStateInputForTest,
) => ReturnType<typeof evaluateProductWorktreeState>;

test("network evidence redacts query strings and accepts local harness traffic", () => {
  const evidence = classifyBrowserRequest(
    request("http://127.0.0.1:4188/index.html?token=must-not-be-recorded", "GET", "document"),
  );

  assert.equal(evidence.target, "local-harness");
  assert.equal(evidence.purpose, "local-harness");
  assert.equal(evidence.applicationDataMutationCandidate, false);
  assert.equal(evidence.unknownMutationRisk, false);
  assert.equal(evidence.pathname, "/index.html");
  assert.equal("token" in evidence, false);
});

test("network evidence identifies app-owned SharePoint and Graph mutation targets", () => {
  const sharePoint = classifyBrowserRequest(
    request("https://tenant.sharepoint.com/sites/test/_api/web/lists(guid'fixture')/items", "POST"),
  );
  assert.equal(sharePoint.target, "sharepoint");
  assert.equal(sharePoint.purpose, "application-data-mutation");
  assert.equal(sharePoint.applicationDataMutationCandidate, true);
  assert.equal(sharePoint.unknownMutationRisk, false);

  const graph = classifyBrowserRequest(
    request("https://graph.microsoft.com/v1.0/sites/site/lists/list/items", "POST"),
  );
  assert.equal(graph.target, "graph");
  assert.equal(graph.purpose, "application-data-mutation");
  assert.equal(graph.applicationDataMutationCandidate, true);

  const configured = classifyBrowserRequest(
    request("https://fixture.example.invalid/persist", "POST"),
    { persistencePaths: ["/persist"] },
  );
  assert.equal(configured.applicationDataMutationCandidate, true);
});

test("framework, authentication, telemetry, and unknown traffic remain distinct", () => {
  const framework = classifyBrowserRequest(
    request("https://tenant.sharepoint.com/sites/test/_api/contextinfo", "POST"),
  );
  assert.equal(framework.purpose, "sharepoint-framework");
  assert.equal(framework.applicationDataMutationCandidate, false);
  assert.equal(framework.unknownMutationRisk, false);

  const authentication = classifyBrowserRequest(
    request("https://login.microsoftonline.com/common/oauth2/authorize", "POST"),
  );
  assert.equal(authentication.purpose, "authentication");
  assert.equal(authentication.applicationDataMutationCandidate, false);
  assert.equal(authentication.unknownMutationRisk, false);

  const telemetry = classifyBrowserRequest(
    request("https://telemetry.example.invalid/collect", "POST", "ping"),
  );
  assert.equal(telemetry.purpose, "telemetry");
  assert.equal(telemetry.applicationDataMutationCandidate, false);
  assert.equal(telemetry.unknownMutationRisk, false);

  const unknown = classifyBrowserRequest(
    request("https://unknown.example.invalid/mutate", "POST"),
  );
  assert.equal(unknown.purpose, "unknown-nonlocal-mutation");
  assert.equal(unknown.applicationDataMutationCandidate, false);
  assert.equal(unknown.unknownMutationRisk, true);

  const collector = createBrowserNetworkEvidenceCollector();
  const listeners: Array<(request: unknown) => void> = [];
  collector.attach({
    on(_event: string, listener: (request: unknown) => void) {
      listeners.push(listener);
    },
  });
  listeners[0](request("https://unknown.example.invalid/mutate", "POST"));
  assert.equal(collector.snapshot().noLiveWriteProof, false);
  assert.equal(collector.snapshot().applicationDataMutationRequests.length, 0);
  assert.equal(collector.snapshot().unknownMutationRiskRequests.length, 1);
});

test("product RC and harness revision are separate and product-path drift fails closed", () => {
  const harnessRevision = "b".repeat(40);
  const valid = evaluateProductWorktreeStateForTest({
    head: harnessRevision,
    productRcAvailable: true,
    productRcAncestor: true,
    clean: true,
    changedPaths: [CANONICAL_HARNESS_PATHS[0]],
  });
  assert.equal(valid.productRcSha, PRODUCT_RC_SHA);
  assert.equal(valid.harnessRevision, harnessRevision);
  assert.equal(valid.harnessRevisionDistinct, true);
  assert.equal(valid.productContentUnchanged, true);

  const productDrift = evaluateProductWorktreeStateForTest({
    head: harnessRevision,
    productRcAvailable: true,
    productRcAncestor: true,
    clean: true,
    changedPaths: ["src/domain/product-semantics.ts"],
  });
  assert.equal(productDrift.productContentUnchanged, false);
  assert.deepEqual(productDrift.unexpectedProductPaths, ["src/domain/product-semantics.ts"]);

  const productHead = evaluateProductWorktreeState({
    head: PRODUCT_RC_SHA,
    productRcAvailable: true,
    productRcAncestor: true,
    clean: true,
    changedPaths: [],
  });
  assert.equal(productHead.harnessRevisionDistinct, false);
});

test("environment identity requires explicit approved identity and synthetic kind", () => {
  const valid = {
    environment_id: "layer-a-fixture-mac-01",
    environment_kind: LAYER_A_ENVIRONMENT_KIND,
    runtime_identity: { node: "v22.23.1", platform: "darwin", arch: "arm64" },
  };
  assert.equal(validateEnvironmentIdentity(valid), true);
  assert.equal(validateEnvironmentIdentity({ ...valid, environment_id: "" }), false);
  assert.equal(validateEnvironmentIdentity({ ...valid, environment_kind: "unknown" }), false);
  const inferred = createEnvironmentIdentity({}, { LAYER_A_ENVIRONMENT_KIND });
  assert.equal(inferred.environment_id, "");
  assert.equal(validateEnvironmentIdentity(inferred), false);
});

test("provenance entries contain locked fields and both revision identities", () => {
  const harnessRevision = "c".repeat(40);
  const productWorktreeState = {
    product_rc_sha: PRODUCT_RC_SHA,
    harness_revision: harnessRevision,
    clean: true,
    product_content_unchanged: true,
  };
  const entry = createProvenanceEntry({
    evidenceId: "LAYER-A-shell-ux-1-report",
    evidencePath: "shell-ux-1/smoke-report.json",
    evidenceSha256: "a".repeat(64),
    executionTimestamp: "2026-08-24T00:00:00.000Z",
    environment: {
      environment_id: "layer-a-fixture-mac-01",
      environment_kind: LAYER_A_ENVIRONMENT_KIND,
      runtime_identity: { node: "v22.23.1" },
    },
    harnessRevision,
    productWorktreeState,
  });

  assert.equal(entry.product_rc_sha, PRODUCT_RC_SHA);
  assert.equal(entry.harness_revision, harnessRevision);
  assert.equal(validateProvenanceEntry(entry), true);
  assert.equal(validateProvenanceEntry({ ...entry, harness_revision: "" }), false);
  assert.equal(validateProvenanceEntry({ ...entry, product_rc_sha: "unknown" }), false);
});

test("canonical step evaluation requires every mandatory ST-02 check", () => {
  const st02Checks = [
    "tablet-portrait-today-support-primary",
    "tablet-landscape-today-support-primary",
    "desktop-regression-today-support-primary",
    "zoom-200-percent-cg-equivalent-today-support-primary",
  ];
  const reports = {
    "shell-ux-1": { checks: [{ name: "ready-unsaved", pass: true }] },
    "kiosk-ux-convergence": {
      checks: st02Checks.map((name) => ({ id: name, pass: true })),
    },
    "field-workflow-ui": { checks: [] },
    "shell-ux-5": { checks: [] },
  };

  let steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.length, 10);
  assert.deepEqual(
    steps.map((step) => step.step),
    CANONICAL_STEPS.map((step) => step.step),
  );
  assert.equal(steps.find((step) => step.step === "ST-01")?.status, "PASS");
  assert.equal(steps.find((step) => step.step === "ST-02")?.status, "PASS");

  reports["kiosk-ux-convergence"].checks[2].pass = false;
  steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.find((step) => step.step === "ST-02")?.status, "FAIL");

  reports["kiosk-ux-convergence"].checks.splice(2, 1);
  steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.find((step) => step.step === "ST-02")?.status, "FAIL");
});

test("ST-10 behavior contract is identity-independent and uses actual inquiry values", () => {
  const genericPass = evaluateSt10BehaviorContract({
    retrievalFailedRendered: true,
    readyRendered: false,
    inquiryRendered: true,
    copyControlRendered: true,
    errorCodeText: "ERR-GENERIC-001",
    correlationIdText: "corr-generic-001",
    copyText: "エラーコード: ERR-GENERIC-001\n相関ID: corr-generic-001",
    syntheticDataOnly: true,
    applicationDataMutationNone: true,
  });
  assert.equal(genericPass.pass, true);
  assert.deepEqual(genericPass.actualRenderedValues, {
    errorCode: "ERR-GENERIC-001",
    correlationId: "corr-generic-001",
    copyText: "エラーコード: ERR-GENERIC-001\n相関ID: corr-generic-001",
  });

  const emptyErrorCode = evaluateSt10BehaviorContract({
    ...genericPass.actualRenderedValues,
    retrievalFailedRendered: true,
    readyRendered: false,
    inquiryRendered: true,
    copyControlRendered: true,
    errorCodeText: "   ",
    correlationIdText: "corr-generic-001",
    syntheticDataOnly: true,
    applicationDataMutationNone: true,
  });
  assert.equal(emptyErrorCode.pass, false);
  assert.equal(emptyErrorCode.nonEmptyErrorCodePresented, false);

  const copiedValueMismatch = evaluateSt10BehaviorContract({
    retrievalFailedRendered: true,
    readyRendered: false,
    inquiryRendered: true,
    copyControlRendered: true,
    errorCodeText: "ERR-GENERIC-001",
    correlationIdText: "corr-generic-001",
    copyText: "エラーコード: STALE\n相関ID: stale",
    syntheticDataOnly: true,
    applicationDataMutationNone: true,
  });
  assert.equal(copiedValueMismatch.pass, false);
  assert.equal(copiedValueMismatch.copyInquiryBehaviorPreserved, false);
});

test("ST-10 aggregation requires its behavior checks and no application-data mutation", () => {
  const reports = {
    "shell-ux-5": {
      checks: [
        { id: "inquiry-on-retrieval-failed", pass: true },
        { id: "inquiry-on-access-denied", pass: true },
        { id: "ready-hides-inquiry", pass: true },
        { id: "application-data-mutation-none", pass: true },
      ],
    },
  };

  let steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.find((step) => step.step === "ST-10")?.status, "PASS");

  reports["shell-ux-5"].checks[3].pass = false;
  steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.find((step) => step.step === "ST-10")?.status, "FAIL");

  reports["shell-ux-5"].checks.splice(3, 1);
  steps = evaluateCanonicalSteps(reports);
  assert.equal(steps.find((step) => step.step === "ST-10")?.status, "FAIL");
});

test("kiosk runner keeps compiled CSS in an owned transient runtime directory", () => {
  const source = fs.readFileSync(
    path.resolve("spfx/smoke/kiosk-ux-convergence/run-smoke.mjs"),
    "utf8",
  );
  assert.match(
    source,
    /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "kiosk-ux-convergence-runtime-"\)\)/,
  );
  assert.match(source, /fs\.writeFileSync\(path\.join\(outDir, "smoke-production\.css"/);
  assert.match(source, /process\.once\("exit", cleanupRuntimeDir\)/);
  assert.match(source, /fs\.rmSync\(outDir, \{ recursive: true, force: true \}\)/);
  assert.doesNotMatch(source, /writeFileSync\(path\.join\(__dirname, "smoke-production\.css"/);
  assert.doesNotMatch(source, /rmSync\(\s*(?:repoRoot|__dirname)/);
});

test("normative no-live-write identity is not an old SharePoint-request absence claim", () => {
  assert.equal(NO_LIVE_WRITE_CHECK_ID, "application-data-mutation-none");
  assert.notEqual(NO_LIVE_WRITE_CHECK_ID, "sharepoint-requests-none");
  assert.notEqual(NO_LIVE_WRITE_CHECK_ID, "kp-sharepoint-requests-none");
});
