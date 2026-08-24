#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { promises as fsp } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PRODUCT_RC_SHA = "7944cea0fad20783f178ec613080283b98b5cca5";

export const CANONICAL_HARNESS_PATHS = Object.freeze([
  "spfx/smoke/field-workflow-ui/run-smoke.mjs",
  "spfx/smoke/kiosk-ux-convergence/run-smoke.mjs",
  "spfx/smoke/shell-ux-1/run-smoke.mjs",
  "spfx/smoke/shell-ux-5/run-smoke.mjs",
  "scripts/layer-a/browser-network-evidence.mjs",
  "scripts/layer-a/run-layer-a.mjs",
  "tests/layer-a/layer-a-readiness.test.ts",
  "docs/architecture/current-rc-layer-a-execution-readiness-1.md",
]);

export const LAYER_A_ENVIRONMENT_KIND = "synthetic-local";

export const SPFX_DEPENDENCY_REQUIREMENTS = Object.freeze([
  {
    name: "react",
    manifestSection: "dependencies",
    packageJsonPath: "spfx/node_modules/react/package.json",
  },
  {
    name: "react-dom",
    manifestSection: "dependencies",
    packageJsonPath: "spfx/node_modules/react-dom/package.json",
  },
  {
    name: "@microsoft/spfx-web-build-rig",
    manifestSection: "devDependencies",
    packageJsonPath: "spfx/node_modules/@microsoft/spfx-web-build-rig/package.json",
    requiredPaths: [
      "spfx/node_modules/@microsoft/spfx-web-build-rig/profiles/default/tsconfig-base.json",
    ],
  },
]);

export const CANONICAL_STEPS = Object.freeze([
  { step: "ST-01", name: "App Entry", runner: "shell-ux-1" },
  { step: "ST-02", name: "Today / Workflow Entry", runner: "kiosk-ux-convergence" },
  { step: "ST-03", name: "Support Procedure Display", runner: "field-workflow-ui" },
  { step: "ST-04", name: "Record Entry", runner: "field-workflow-ui" },
  { step: "ST-05", name: "Save-state Presentation", runner: "shell-ux-1" },
  { step: "ST-06", name: "Correction Flow", runner: "kiosk-ux-convergence" },
  { step: "ST-07", name: "Cancelled Read-state", runner: "kiosk-ux-convergence" },
  { step: "ST-08", name: "Review / Confirmation", runner: "field-workflow-ui" },
  { step: "ST-09", name: "Navigation", runner: "kiosk-ux-convergence" },
  { step: "ST-10", name: "Error-state Presentation", runner: "shell-ux-5" },
]);

const RUNNER_SPECS = Object.freeze([
  {
    id: "field-workflow-ui",
    script: "spfx/smoke/field-workflow-ui/run-smoke.mjs",
    report: "smoke-report.json",
    artifactsEnv: "FW_ARTIFACTS_DIR",
    env: {
      esbuild: "FW_ESBUILD_PATH",
      puppeteer: "FW_PUPPETEER_PATH",
      sass: "FW_SASS_PATH",
      chrome: "FW_CHROME_PATH",
    },
  },
  {
    id: "kiosk-ux-convergence",
    script: "spfx/smoke/kiosk-ux-convergence/run-smoke.mjs",
    report: "smoke-report.json",
    artifactsEnv: "KIOSK_ARTIFACTS_DIR",
    env: {
      esbuild: "KIOSK_ESBUILD_PATH",
      puppeteer: "KIOSK_PUPPETEER_PATH",
      sass: "KIOSK_SASS_PATH",
      chrome: "KIOSK_CHROME_PATH",
    },
  },
  {
    id: "shell-ux-1",
    script: "spfx/smoke/shell-ux-1/run-smoke.mjs",
    report: "smoke-report.json",
    artifactsEnv: "SHELL_UX_1_ARTIFACTS_DIR",
    env: {
      esbuild: "SHELL_UX_1_ESBUILD_PATH",
      puppeteer: "SHELL_UX_1_PUPPETEER_PATH",
      chrome: "SHELL_UX_1_CHROME_PATH",
    },
  },
  {
    id: "shell-ux-5",
    script: "spfx/smoke/shell-ux-5/run-smoke.mjs",
    report: "smoke-report.json",
    artifactsEnv: "SHELL_UX_5_ARTIFACTS_DIR",
    env: {
      esbuild: "SHELL_UX_5_ESBUILD_PATH",
      puppeteer: "SHELL_UX_5_PUPPETEER_PATH",
      chrome: "SHELL_UX_5_CHROME_PATH",
    },
  },
]);

const STEP_REQUIREMENTS = Object.freeze({
  "ST-01": [{ runner: "shell-ux-1", checks: ["ready-unsaved"] }],
  "ST-02": [
    {
      runner: "kiosk-ux-convergence",
      checks: [
        "tablet-portrait-today-support-primary",
        "tablet-landscape-today-support-primary",
        "desktop-regression-today-support-primary",
        "zoom-200-percent-cg-equivalent-today-support-primary",
      ],
    },
  ],
  "ST-03": [{ runner: "field-workflow-ui", checks: ["fw01-current-procedure-visible"] }],
  "ST-04": [{ runner: "field-workflow-ui", checks: ["fw02-context-handoff-no-reselect"] }],
  "ST-05": [
    {
      runner: "shell-ux-1",
      checks: ["ready-unsaved", "loading", "access-denied", "retrieval-failed"],
    },
  ],
  "ST-06": [{ runner: "kiosk-ux-convergence", checks: ["recorded-correction-path"] }],
  "ST-07": [
    {
      runner: "kiosk-ux-convergence",
      checks: ["cancelled-correction-path", "cancelled-read-state"],
    },
  ],
  "ST-08": [{ runner: "field-workflow-ui", checks: ["fw07-review-v2-projection"] }],
  "ST-09": [
    {
      runner: "kiosk-ux-convergence",
      checks: ["keyboard-logical-order", "occurrence-id-round-trip"],
    },
  ],
  "ST-10": [
    {
      runner: "shell-ux-5",
      checks: [
        "inquiry-on-retrieval-failed",
        "inquiry-on-access-denied",
        "ready-hides-inquiry",
        "application-data-mutation-none",
      ],
    },
  ],
});

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, "../..");

export function evidenceIdForPath(relativePath) {
  return `LAYER-A-${relativePath.replace(/[^A-Za-z0-9/_-]/g, "-")}`;
}

function firstExisting(paths) {
  return paths.find((candidate) => candidate && fs.existsSync(candidate));
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function createTransientRuntimeDirectory(prefix) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const cleanup = () => {
    if (fs.existsSync(directory)) {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  };
  process.once("exit", cleanup);
  return { directory, cleanup };
}

export function resolveExecutionTools(env = process.env) {
  return {
    esbuildPath: firstExisting([env.LAYER_A_ESBUILD_PATH, "/tmp/node_modules/esbuild/lib/main.js"]),
    puppeteerPath: firstExisting([
      env.LAYER_A_PUPPETEER_PATH,
      "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js",
      "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js",
    ]),
    sassPath: firstExisting([env.LAYER_A_SASS_PATH, "/tmp/node_modules/sass/sass.node.mjs"]),
    chromePath: firstExisting([
      env.LAYER_A_CHROME_PATH,
      "/usr/bin/google-chrome-stable",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ]),
  };
}

export function inspectSpfxDependencyReadiness(root = REPOSITORY_ROOT) {
  const manifestPath = path.join(root, "spfx/package.json");
  const manifest = readJsonFile(manifestPath);
  const checks = SPFX_DEPENDENCY_REQUIREMENTS.map((requirement) => {
    const expectedVersion = manifest?.[requirement.manifestSection]?.[requirement.name] ?? null;
    const packageJsonPath = path.join(root, requirement.packageJsonPath);
    const installed = readJsonFile(packageJsonPath);
    const missingRequiredPaths = (requirement.requiredPaths ?? []).filter(
      (requiredPath) => !fs.existsSync(path.join(root, requiredPath)),
    );
    let status = "PASS";
    if (!expectedVersion) {
      status = "MISSING_AUTHORITY";
    } else if (!installed) {
      status = "MISSING";
    } else if (installed.version !== expectedVersion) {
      status = "VERSION_MISMATCH";
    } else if (missingRequiredPaths.length > 0) {
      status = "MISSING_ENTRYPOINT";
    }
    return {
      name: requirement.name,
      expectedVersion,
      installedVersion: installed?.version ?? null,
      packageJsonPath: requirement.packageJsonPath,
      missingRequiredPaths,
      status,
    };
  });
  const blockers = checks
    .filter((check) => check.status !== "PASS")
    .map(
      (check) => `SPFx dependency readiness failed: ${check.name} (${check.status.toLowerCase()})`,
    );
  return {
    ready: Boolean(manifest) && blockers.length === 0,
    manifestPath: "spfx/package.json",
    checks,
    blockers: manifest ? blockers : ["SPFx dependency authority manifest is missing or invalid"],
  };
}

function runGit(root, args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function requireGit(root, args) {
  const result = runGit(root, args);
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

function gitHasAncestor(root, ancestor, descendant) {
  return runGit(root, ["merge-base", "--is-ancestor", ancestor, descendant]).status === 0;
}

export function evaluateProductWorktreeState({
  head,
  productRcAvailable,
  productRcAncestor,
  clean,
  changedPaths = [],
}) {
  const unexpectedProductPaths = changedPaths.filter(
    (changedPath) => !CANONICAL_HARNESS_PATHS.includes(changedPath),
  );
  const harnessRevision = clean && head !== PRODUCT_RC_SHA ? head : null;
  const productContentUnchanged =
    productRcAvailable && productRcAncestor && unexpectedProductPaths.length === 0;

  return {
    head,
    productRcSha: PRODUCT_RC_SHA,
    productRcAvailable,
    productRcAncestor,
    harnessRevision,
    harnessRevisionDistinct: harnessRevision !== null,
    productContentUnchanged,
    changedPaths,
    unexpectedProductPaths,
    clean,
    dirtyPaths: clean ? [] : ["<dirty>"],
    productWorktreeState: {
      product_rc_sha: PRODUCT_RC_SHA,
      harness_revision: harnessRevision,
      clean,
      product_content_unchanged: productContentUnchanged,
      changed_paths: changedPaths,
      unexpected_product_paths: unexpectedProductPaths,
    },
  };
}

export function inspectExecutionBasis(root = REPOSITORY_ROOT) {
  const head = requireGit(root, ["rev-parse", "HEAD"]);
  const dirty = requireGit(root, ["status", "--porcelain"]);
  const productRcAvailable =
    runGit(root, ["cat-file", "-e", `${PRODUCT_RC_SHA}^{commit}`]).status === 0;
  const productRcAncestor = productRcAvailable && gitHasAncestor(root, PRODUCT_RC_SHA, head);
  const changedPaths =
    productRcAvailable && productRcAncestor && head !== PRODUCT_RC_SHA
      ? requireGit(root, ["diff", "--name-only", `${PRODUCT_RC_SHA}..${head}`])
          .split("\n")
          .filter(Boolean)
      : [];
  const clean = dirty.length === 0;
  return {
    ...evaluateProductWorktreeState({
      head,
      productRcAvailable,
      productRcAncestor,
      clean,
      changedPaths,
    }),
    dirtyPaths: clean ? [] : dirty.split("\n"),
  };
}

export function buildPreflight({ root = REPOSITORY_ROOT, env = process.env } = {}) {
  const worktree = inspectExecutionBasis(root);
  const tools = resolveExecutionTools(env);
  const environment = createEnvironmentIdentity(tools, env);
  const spfxDependencyReadiness = inspectSpfxDependencyReadiness(root);
  const missingScripts = RUNNER_SPECS.filter(
    (spec) => !fs.existsSync(path.join(root, spec.script)),
  ).map((spec) => spec.script);
  const blockers = [];

  if (!worktree.productRcAvailable) {
    blockers.push(`Product RC ${PRODUCT_RC_SHA} is not available locally`);
  }
  if (!worktree.productRcAncestor) {
    blockers.push(`Product RC ${PRODUCT_RC_SHA} must be an ancestor of harness_revision`);
  }
  if (!worktree.harnessRevisionDistinct) {
    blockers.push("harness_revision must be a clean revision distinct from Product RC");
  }
  if (!worktree.clean) {
    blockers.push("worktree must be clean");
  }
  if (!worktree.productContentUnchanged) {
    blockers.push("Product source/content must match the Product RC basis");
  }
  if (missingScripts.length > 0) {
    blockers.push(`missing runner scripts: ${missingScripts.join(", ")}`);
  }
  for (const [name, value] of Object.entries(tools)) {
    if (!value) {
      blockers.push(`missing execution dependency: ${name}`);
    }
  }
  blockers.push(...spfxDependencyReadiness.blockers);
  if (!validateEnvironmentIdentity(environment)) {
    blockers.push(
      `approved environment identity is required: ${
        env.LAYER_A_ENVIRONMENT_ID
          ? "invalid environment kind"
          : "LAYER_A_ENVIRONMENT_ID is missing"
      }`,
    );
  }

  return {
    ready: blockers.length === 0,
    productRcSha: PRODUCT_RC_SHA,
    harnessRevision: worktree.harnessRevision,
    productWorktreeState: worktree.productWorktreeState,
    worktree,
    tools,
    environment,
    spfxDependencyReadiness,
    missingScripts,
    blockers,
  };
}

export function createEnvironmentIdentity(tools, env = process.env) {
  return {
    environment_id: String(env.LAYER_A_ENVIRONMENT_ID ?? "").trim(),
    environment_kind: String(env.LAYER_A_ENVIRONMENT_KIND ?? "").trim(),
    runtime_identity: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      runnerHost: env.CI ? "ci" : "local",
      chromeExecutable: tools.chromePath ? path.basename(tools.chromePath) : "UNKNOWN",
      esbuildModule: tools.esbuildPath ? path.basename(tools.esbuildPath) : "UNKNOWN",
      puppeteerModule: tools.puppeteerPath ? path.basename(tools.puppeteerPath) : "UNKNOWN",
      sassModule: tools.sassPath ? path.basename(tools.sassPath) : "UNKNOWN",
    },
  };
}

export function validateEnvironmentIdentity(environment) {
  return (
    environment !== null &&
    typeof environment === "object" &&
    typeof environment.environment_id === "string" &&
    environment.environment_id.length > 0 &&
    typeof environment.environment_kind === "string" &&
    environment.environment_kind === LAYER_A_ENVIRONMENT_KIND &&
    environment.runtime_identity !== null &&
    typeof environment.runtime_identity === "object" &&
    !Array.isArray(environment.runtime_identity)
  );
}

export async function sha256File(filePath) {
  const hash = createHash("sha256");
  hash.update(await fsp.readFile(filePath));
  return hash.digest("hex");
}

export function createProvenanceEntry({
  evidenceId,
  evidencePath,
  evidenceSha256,
  executionTimestamp,
  environment,
  harnessRevision,
  productWorktreeState,
  productRcSha = PRODUCT_RC_SHA,
  syntheticDataOnly = true,
  liveWritePerformed = false,
  productionBound = false,
}) {
  return {
    evidence_id: evidenceId,
    evidence_path: evidencePath,
    evidence_sha256: evidenceSha256,
    product_rc_sha: productRcSha,
    harness_revision: harnessRevision,
    product_worktree_state: productWorktreeState,
    execution_timestamp: executionTimestamp,
    environment,
    synthetic_data_only: syntheticDataOnly,
    live_write_performed: liveWritePerformed,
    production_bound: productionBound,
  };
}

export function validateProvenanceEntry(entry) {
  const required = [
    "evidence_id",
    "evidence_path",
    "evidence_sha256",
    "product_rc_sha",
    "harness_revision",
    "product_worktree_state",
    "execution_timestamp",
    "environment",
    "synthetic_data_only",
    "live_write_performed",
    "production_bound",
  ];
  const sha256 = /^[0-9a-f]{64}$/;
  const objectEntry = entry !== null && typeof entry === "object";
  const hasRequiredFields = objectEntry && required.every((field) => Object.hasOwn(entry, field));
  const validTimestamp =
    objectEntry &&
    typeof entry.execution_timestamp === "string" &&
    !Number.isNaN(Date.parse(entry.execution_timestamp));
  const validEnvironment = objectEntry && validateEnvironmentIdentity(entry.environment);
  const validProductWorktreeState =
    objectEntry &&
    entry.product_worktree_state !== null &&
    typeof entry.product_worktree_state === "object" &&
    entry.product_worktree_state.product_rc_sha === PRODUCT_RC_SHA &&
    typeof entry.product_worktree_state.harness_revision === "string" &&
    entry.product_worktree_state.harness_revision === entry.harness_revision &&
    entry.product_worktree_state.harness_revision.length > 0 &&
    entry.product_worktree_state.clean === true &&
    entry.product_worktree_state.product_content_unchanged === true;

  return (
    hasRequiredFields &&
    typeof entry.evidence_id === "string" &&
    entry.evidence_id.length > 0 &&
    typeof entry.evidence_path === "string" &&
    entry.evidence_path.length > 0 &&
    typeof entry.evidence_sha256 === "string" &&
    sha256.test(entry.evidence_sha256) &&
    entry.product_rc_sha === PRODUCT_RC_SHA &&
    typeof entry.harness_revision === "string" &&
    entry.harness_revision.length > 0 &&
    validProductWorktreeState &&
    validTimestamp &&
    validEnvironment &&
    entry.synthetic_data_only === true &&
    entry.live_write_performed === false &&
    entry.production_bound === false
  );
}

function checkMap(report) {
  return new Map((report?.checks ?? []).map((check) => [check.id ?? check.name, check]));
}

/**
 * @param {{ missingRunnerReports?: string[], applicationDataMutation?: string }} input
 */
export function classifyExecutionFailure({ missingRunnerReports = [], applicationDataMutation }) {
  if (missingRunnerReports.length > 0) {
    return {
      code: "RUNNER_REPORT_MISSING",
      applicationDataMutation: "UNVERIFIED",
      provenance: "WITHHELD",
      message:
        `runner reports were not generated (${missingRunnerReports.join(", ")}); ` +
        "application-data mutation is UNVERIFIED; compliant provenance manifest was not minted",
    };
  }
  if (applicationDataMutation === "OBSERVED") {
    return {
      code: "APPLICATION_DATA_MUTATION_OBSERVED",
      applicationDataMutation: "OBSERVED",
      provenance: "WITHHELD",
      message:
        "application-data mutation evidence observed; compliant provenance manifest was not minted",
    };
  }
  if (applicationDataMutation !== "NONE") {
    return {
      code: "NO_LIVE_WRITE_PROOF_FAILED",
      applicationDataMutation: applicationDataMutation ?? "UNVERIFIED",
      provenance: "WITHHELD",
      message:
        `no-live-write proof was not established (${applicationDataMutation ?? "UNVERIFIED"}); ` +
        "compliant provenance manifest was not minted",
    };
  }
  return null;
}

export function evaluateSt10BehaviorContract({
  retrievalFailedRendered,
  readyRendered,
  inquiryRendered,
  copyControlRendered,
  errorCodeText,
  correlationIdText,
  copyText,
  syntheticDataOnly,
  applicationDataMutationNone,
}) {
  const errorCode = typeof errorCodeText === "string" ? errorCodeText.trim() : "";
  const correlationId = typeof correlationIdText === "string" ? correlationIdText.trim() : "";
  const inquiryCopy = typeof copyText === "string" ? copyText : "";
  const checks = {
    retrievalFailedRendered: Boolean(retrievalFailedRendered),
    readyStateNotRendered: readyRendered !== true,
    inquiryPresentationAvailable: Boolean(inquiryRendered),
    nonEmptyErrorCodePresented: errorCode.length > 0,
    nonEmptyCorrelationIdPresented: correlationId.length > 0,
    copyInquiryBehaviorPreserved:
      Boolean(copyControlRendered) &&
      inquiryCopy.includes("エラーコード:") &&
      inquiryCopy.includes(errorCode) &&
      inquiryCopy.includes("相関ID:") &&
      inquiryCopy.includes(correlationId),
    syntheticOnlyExecution: syntheticDataOnly === true,
    applicationDataMutationNone: applicationDataMutationNone === true,
  };

  return {
    ...checks,
    pass: Object.values(checks).every(Boolean),
    actualRenderedValues: {
      errorCode,
      correlationId,
      copyText: inquiryCopy,
    },
  };
}

export function evaluateCanonicalSteps(reports) {
  return CANONICAL_STEPS.map((definition) => {
    const requirements = STEP_REQUIREMENTS[definition.step] ?? [];
    const evidence = requirements.map((requirement) => {
      const report = reports[requirement.runner];
      const checks = checkMap(report);
      const requiredChecks = requirement.checks ?? [];
      const exactChecks = requiredChecks.map((id) => checks.get(id));
      const selected = exactChecks;
      return {
        runner: requirement.runner,
        evidence_id: evidenceIdForPath(`${requirement.runner}/smoke-report.json`),
        evidence_path: `${requirement.runner}/smoke-report.json`,
        checks: selected.map((check) => check?.id ?? check?.name ?? "MISSING"),
        pass: selected.length > 0 && selected.every((check) => check?.pass === true),
      };
    });
    return {
      step: definition.step,
      name: definition.name,
      runner: definition.runner,
      status: evidence.length > 0 && evidence.every((item) => item.pass) ? "PASS" : "FAIL",
      evidence,
    };
  });
}

function parseArgs(argv) {
  const options = { execute: false, artifactsDir: "/opt/cursor/artifacts/current-rc-layer-a" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--execute") {
      options.execute = true;
    } else if (argument === "--artifacts-dir") {
      const artifactsDir = argv[++index];
      if (!artifactsDir) {
        throw new Error("--artifacts-dir requires a path");
      }
      options.artifactsDir = artifactsDir;
    } else if (argument === "--preflight") {
      options.execute = false;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

async function appendLog(logPath, event) {
  await fsp.appendFile(logPath, `${JSON.stringify(event)}\n`, "utf8");
}

async function ensureEmptyDirectory(directory) {
  if (fs.existsSync(directory)) {
    const existing = await fsp.readdir(directory);
    if (existing.length > 0) {
      throw new Error(`artifacts directory must be empty: ${directory}`);
    }
  } else {
    await fsp.mkdir(directory, { recursive: true });
  }
}

function runRunner({ root, spec, environment, tools, outputDir, logPath }) {
  const scriptPath = path.join(root, spec.script);
  const childEnv = {
    ...process.env,
    [spec.artifactsEnv]: outputDir,
    [spec.env.esbuild]: tools.esbuildPath,
    [spec.env.puppeteer]: tools.puppeteerPath,
    [spec.env.chrome]: tools.chromePath,
  };
  if (spec.env.sass) {
    childEnv[spec.env.sass] = tools.sassPath;
  }

  return new Promise((resolve, reject) => {
    const pendingLogWrites = [];
    const child = spawn(process.execPath, [scriptPath], {
      cwd: root,
      env: childEnv,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const onChunk = (stream, chunk) => {
      pendingLogWrites.push(
        appendLog(logPath, {
          timestamp: new Date().toISOString(),
          runner: spec.id,
          stream,
          text: chunk.toString(),
        }),
      );
    };
    child.stdout.on("data", (chunk) => onChunk("stdout", chunk));
    child.stderr.on("data", (chunk) => onChunk("stderr", chunk));
    child.on("error", reject);
    child.on("close", (code, signal) => {
      Promise.all(pendingLogWrites)
        .then(() => resolve({ runner: spec.id, script: spec.script, code, signal, environment }))
        .catch(reject);
    });
  });
}

async function listEvidenceFiles(root) {
  const entries = [];
  async function visit(current) {
    for (const entry of await fsp.readdir(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(filePath);
      } else if (entry.name !== "provenance-manifest.json") {
        entries.push(filePath);
      }
    }
  }
  await visit(root);
  return entries.sort();
}

async function writeManifest({
  artifactsDir,
  executionTimestamp,
  environment,
  harnessRevision,
  productWorktreeState,
}) {
  const files = await listEvidenceFiles(artifactsDir);
  const entries = [];
  for (const filePath of files) {
    const relative = path.relative(artifactsDir, filePath).split(path.sep).join("/");
    entries.push(
      createProvenanceEntry({
        evidenceId: evidenceIdForPath(relative),
        evidencePath: relative,
        evidenceSha256: await sha256File(filePath),
        executionTimestamp,
        environment,
        harnessRevision,
        productWorktreeState,
      }),
    );
  }
  if (!entries.every(validateProvenanceEntry)) {
    throw new Error("provenance manifest validation failed");
  }
  const manifest = {
    schema: "CURRENT-RC-LAYER-A-PROVENANCE-MANIFEST-1",
    product_rc_sha: PRODUCT_RC_SHA,
    harness_revision: harnessRevision,
    product_worktree_state: productWorktreeState,
    execution_timestamp: executionTimestamp,
    environment,
    entries,
  };
  await fsp.writeFile(
    path.join(artifactsDir, "provenance-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  return manifest;
}

async function executeLayerA({ root, artifactsDir, preflight }) {
  const executionTimestamp = new Date().toISOString();
  const environment = preflight.environment;
  await ensureEmptyDirectory(artifactsDir);
  const logPath = path.join(artifactsDir, "raw-execution-log.jsonl");
  await fsp.writeFile(logPath, "", "utf8");
  const runnerResults = [];
  const reports = {};

  for (const spec of RUNNER_SPECS) {
    const outputDir = path.join(artifactsDir, spec.id);
    await fsp.mkdir(outputDir, { recursive: true });
    const result = await runRunner({
      root,
      spec,
      environment,
      tools: preflight.tools,
      outputDir,
      logPath,
    });
    runnerResults.push(result);
    const reportPath = path.join(outputDir, spec.report);
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(await fsp.readFile(reportPath, "utf8"));
      reports[spec.id] = report;
      if (report.networkEvidence) {
        await fsp.writeFile(
          path.join(outputDir, "network-evidence.json"),
          `${JSON.stringify(report.networkEvidence, null, 2)}\n`,
          "utf8",
        );
      }
    }
  }

  const steps = evaluateCanonicalSteps(reports);
  const missingRunnerReports = RUNNER_SPECS.filter((spec) => !reports[spec.id]).map(
    (spec) => spec.id,
  );
  const runnerNoLiveWrite =
    missingRunnerReports.length === 0 &&
    Object.values(reports).every((report) => report.networkEvidence?.noLiveWriteProof === true);
  const applicationDataMutation = runnerNoLiveWrite
    ? "NONE"
    : missingRunnerReports.length > 0
      ? "UNVERIFIED"
      : "OBSERVED";
  const executionFailure = classifyExecutionFailure({
    missingRunnerReports,
    applicationDataMutation,
  });
  const summary = {
    schema: "CURRENT-RC-LAYER-A-EXECUTION-SUMMARY-1",
    productRcSha: PRODUCT_RC_SHA,
    harnessRevision: preflight.harnessRevision,
    productWorktreeState: preflight.productWorktreeState,
    executionTimestamp,
    environment,
    runnerResults,
    steps,
    noLiveWrite: {
      status: runnerNoLiveWrite ? "PASS" : "FAIL",
      applicationDataMutation,
      runnerReports: Object.keys(reports),
      missingRunnerReports,
    },
    failureClassification: executionFailure
      ? {
          code: executionFailure.code,
          applicationDataMutation: executionFailure.applicationDataMutation,
          provenance: executionFailure.provenance,
        }
      : null,
    pass:
      runnerResults.every((result) => result.code === 0) &&
      steps.every((step) => step.status === "PASS") &&
      runnerNoLiveWrite,
  };
  await fsp.writeFile(
    path.join(artifactsDir, "execution-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  if (executionFailure) {
    throw new Error(executionFailure.message);
  }
  const manifest = await writeManifest({
    artifactsDir,
    executionTimestamp,
    environment,
    harnessRevision: preflight.harnessRevision,
    productWorktreeState: preflight.productWorktreeState,
  });
  return { summary, manifest };
}

export async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const preflight = buildPreflight();
  if (!preflight.ready) {
    console.log(
      JSON.stringify({ mode: options.execute ? "execute" : "preflight", preflight }, null, 2),
    );
    process.exitCode = 1;
    return;
  }
  if (!options.execute) {
    console.log(JSON.stringify({ mode: "preflight", preflight }, null, 2));
    return;
  }
  const result = await executeLayerA({
    root: REPOSITORY_ROOT,
    artifactsDir: path.resolve(options.artifactsDir),
    preflight,
  });
  console.log(JSON.stringify(result.summary, null, 2));
  process.exitCode = result.summary.pass ? 0 : 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
