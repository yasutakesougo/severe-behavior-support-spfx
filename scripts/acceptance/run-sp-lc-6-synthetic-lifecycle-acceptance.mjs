#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const spfxRoot = path.join(repoRoot, "spfx");

const UNIT = "SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-IMPLEMENTATION-1";
const DEFINITION = "SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1";
const DEFINITION_BASELINE_MAIN_SHA = "4dd41c4ff27265dba09b6872727cc782244715b6";
const IMPLEMENTATION_START_AUTHORITY =
  "Human Implementation Start GO / #445 / D1=B D2=B D3=B D4=A D5=B D6=A";

const CHECKPOINT_IDS = ["AC-1", "AC-2", "AC-3", "AC-4", "AC-5", "AC-6", "AC-7", "AC-8", "AC-9"];
const ENVIRONMENT_BLOCK_PATTERN =
  /ENOENT|ERR_MODULE_NOT_FOUND|Cannot find module|command not found|google-chrome|puppeteer|esbuild|sass/i;

function envValue(name) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function gitRevParse(ref) {
  const result = spawnSync("git", ["rev-parse", ref], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

function resolveObservedMainSha() {
  if (process.env.SP_LC_6_OBSERVED_MAIN_SHA) {
    return process.env.SP_LC_6_OBSERVED_MAIN_SHA.trim();
  }

  for (const ref of ["refs/remotes/origin/main", "main"]) {
    const sha = gitRevParse(ref);
    if (sha) {
      return sha;
    }
  }
  return null;
}

function classifyExecution(result) {
  if (result.status === 0) {
    return "PASS";
  }
  const combined = `${result.error?.message ?? ""}\n${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  return result.status === null || ENVIRONMENT_BLOCK_PATTERN.test(combined)
    ? "ENVIRONMENT_BLOCKED"
    : "GAP_FOUND";
}

function parseNodeTestCount(output) {
  const match = /# tests\s+(\d+)/.exec(output);
  return match ? Number(match[1]) : null;
}

function runCommand(name, cwd, command, args) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  return {
    name,
    command: [command, ...args].join(" "),
    cwd: path.relative(repoRoot, cwd) || ".",
    status: result.status,
    result: classifyExecution(result),
    testCount: parseNodeTestCount(stdout),
    stdoutTail: stdout.slice(-4000),
    stderrTail: stderr.slice(-4000),
  };
}

function mergeResults(results) {
  if (results.includes("ENVIRONMENT_BLOCKED")) {
    return "ENVIRONMENT_BLOCKED";
  }
  if (results.includes("GAP_FOUND")) {
    return "GAP_FOUND";
  }
  return "PASS";
}

function commandResult(executions, name) {
  const execution = executions.find((item) => item.name === name);
  if (!execution) {
    throw new Error(`Missing required execution result: ${name}`);
  }
  return execution.result;
}

const WRITE_COUNT_KEYS = ["writeCount", "mutationCount", "liveWriteCount", "sharePointWriteCount"];

function parseLastJsonObject(text) {
  const start = text.lastIndexOf("{");
  if (start < 0) {
    return null;
  }
  try {
    return JSON.parse(text.slice(start));
  } catch {
    return null;
  }
}

function readSmokeReport(execution) {
  const parsed = parseLastJsonObject(execution.stdoutTail ?? "");
  const artifactsDir = typeof parsed?.artifactsDir === "string" ? parsed.artifactsDir : null;
  const reportPath = artifactsDir ? path.join(artifactsDir, "smoke-report.json") : null;
  if (!reportPath || !fs.existsSync(reportPath)) {
    return { name: execution.name, executionResult: execution.result, report: null };
  }
  try {
    return {
      name: execution.name,
      executionResult: execution.result,
      report: JSON.parse(fs.readFileSync(reportPath, "utf8")),
    };
  } catch {
    return { name: execution.name, executionResult: execution.result, report: null };
  }
}

function collectWriteCounts(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectWriteCounts(item, found);
    }
    return found;
  }
  if (!value || typeof value !== "object") {
    return found;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (WRITE_COUNT_KEYS.includes(key) && typeof nested === "number") {
      found.push({ key, value: nested });
    } else {
      collectWriteCounts(nested, found);
    }
  }
  return found;
}

function gapUnlessEnvironmentBlocked(sourceResult) {
  return sourceResult === "ENVIRONMENT_BLOCKED" ? "ENVIRONMENT_BLOCKED" : "GAP_FOUND";
}

function emit(report, exitCode) {
  const serialized = JSON.stringify(report, null, 2);
  if (process.env.SP_LC_6_REPORT_PATH) {
    fs.writeFileSync(path.resolve(process.env.SP_LC_6_REPORT_PATH), `${serialized}\n`, "utf8");
  }
  console.log(serialized);
  process.exit(exitCode);
}

const expectedMainSha = envValue("SP_LC_6_EXPECTED_MAIN_SHA");
const acceptanceExecutionAuthority = envValue("SP_LC_6_ACCEPTANCE_EXECUTION_AUTHORITY");
const observedMainSha = resolveObservedMainSha();

if (!expectedMainSha || !acceptanceExecutionAuthority) {
  emit(
    {
      unit: UNIT,
      definition: DEFINITION,
      definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
      expectedMainSha,
      observedMainSha,
      shaMatch: null,
      preflightState: "PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED",
      implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
      acceptanceExecutionAuthority,
      checkpoints: [],
      knownGaps: [],
      overallResult: null,
      mutationAttempted: null,
      liveWriteAuthorized: null,
    },
    2,
  );
}

if (!observedMainSha) {
  emit(
    {
      unit: UNIT,
      definition: DEFINITION,
      definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
      expectedMainSha,
      observedMainSha: null,
      shaMatch: false,
      preflightState: "PRECHECK_BASE_MISMATCH_NOT_STARTED",
      implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
      acceptanceExecutionAuthority,
      checkpoints: [],
      knownGaps: [],
      overallResult: null,
      runnerError: "OBSERVED_MAIN_SHA_UNRESOLVED",
      mutationAttempted: null,
      liveWriteAuthorized: null,
    },
    2,
  );
}

const shaMatch = observedMainSha === expectedMainSha;
if (!shaMatch) {
  emit(
    {
      unit: UNIT,
      definition: DEFINITION,
      definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
      expectedMainSha,
      observedMainSha,
      shaMatch,
      preflightState: "PRECHECK_BASE_MISMATCH_NOT_STARTED",
      implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
      acceptanceExecutionAuthority,
      checkpoints: [],
      knownGaps: [],
      overallResult: null,
      mutationAttempted: null,
      liveWriteAuthorized: null,
    },
    2,
  );
}

const rootTsx = path.join(repoRoot, "node_modules", ".bin", "tsx");
const executions = [
  runCommand("root-focused-acceptance", repoRoot, rootTsx, [
    "--test",
    "tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts",
  ]),
  runCommand("root-planning-graph", repoRoot, rootTsx, [
    "--test",
    "tests/contracts/planning-pc-demo-graph-contract.test.ts",
    "tests/contracts/support-plan-version-procedure-binding-contract.test.ts",
    "tests/contracts/procedure-record-contract.test.ts",
  ]),
  runCommand("spfx-heft", spfxRoot, "npm", ["run", "_phase:test"]),
  runCommand("planning-pc-demo-1-smoke", repoRoot, "node", [
    "spfx/smoke/planning-pc-demo-1/run-smoke.mjs",
  ]),
  runCommand("demo-ux-6-smoke", repoRoot, "node", ["spfx/smoke/demo-ux-6/run-smoke.mjs"]),
  runCommand("support-plan-review-new-version-demo-1-smoke", repoRoot, "node", [
    "spfx/smoke/support-plan-review-new-version-demo-1/run-smoke.mjs",
  ]),
];

const focused = commandResult(executions, "root-focused-acceptance");
const planning = commandResult(executions, "root-planning-graph");
const heft = commandResult(executions, "spfx-heft");
const planningSmoke = commandResult(executions, "planning-pc-demo-1-smoke");
const reviewSmoke = commandResult(executions, "demo-ux-6-smoke");
const nextVersionSmoke = commandResult(executions, "support-plan-review-new-version-demo-1-smoke");
const smokeExecutions = executions.filter((item) => item.name.endsWith("-smoke"));
const mutationObservations = smokeExecutions.map(readSmokeReport);
const observedWriteCounts = mutationObservations.flatMap((item) => collectWriteCounts(item.report));
const observedLiveWriteFlags = mutationObservations
  .map((item) => item.report?.sliceFlags?.liveWriteAuthorized)
  .filter((value) => value === true || value === false);
const mutationTelemetryAvailable = observedWriteCounts.length > 0;
const mutationAttempted = mutationTelemetryAvailable
  ? observedWriteCounts.some((item) => item.value > 0)
  : null;
const liveWriteAuthorized = observedLiveWriteFlags.includes(true)
  ? true
  : observedLiveWriteFlags.includes(false)
    ? false
    : null;

const checkpoints = [
  {
    id: "AC-1",
    result: mergeResults([focused, planning]),
    source: ["root-focused-acceptance", "root-planning-graph"],
  },
  {
    id: "AC-2",
    result: mergeResults([focused, planning]),
    source: ["root-focused-acceptance", "root-planning-graph"],
  },
  {
    id: "AC-3",
    result: mergeResults([focused, heft, reviewSmoke]),
    source: ["root-focused-acceptance", "spfx-heft", "demo-ux-6-smoke"],
  },
  {
    id: "AC-4",
    result: mergeResults([focused, heft, reviewSmoke]),
    source: ["root-focused-acceptance", "spfx-heft", "demo-ux-6-smoke"],
    note: "AC-4 is bound to current-main successful-empty ASSOCIATED [] (distinct from UNRESOLVED). Forced gapUnlessEnvironmentBlocked residual removed; product+contract successful-empty from #654 is capability authority.",
  },
  {
    id: "AC-5",
    result: mergeResults([focused, heft, reviewSmoke]),
    source: ["root-focused-acceptance", "spfx-heft", "demo-ux-6-smoke"],
  },
  {
    id: "AC-6",
    result: mergeResults([focused, planningSmoke]),
    source: ["root-focused-acceptance", "planning-pc-demo-1-smoke"],
  },
  {
    id: "AC-7",
    result: focused,
    source: ["root-focused-acceptance"],
    note: "AC-7 is bound to current-main startSupportPlanRevision (CHANGE_REQUIRED → RevisionIntent → Draft vN+1). DEMO-1 draftWorkflowAuthorized=false remains a presentation-only observation, not the capability detector.",
    smokeObservation: nextVersionSmoke,
  },
  {
    id: "AC-8",
    result: mergeResults([focused, planning, reviewSmoke]),
    source: ["root-focused-acceptance", "root-planning-graph", "demo-ux-6-smoke"],
  },
  {
    id: "AC-9",
    result: mutationTelemetryAvailable
      ? mergeResults([
          focused,
          planningSmoke,
          reviewSmoke,
          nextVersionSmoke,
          observedWriteCounts.some((item) => item.value > 0) ? "GAP_FOUND" : "PASS",
        ])
      : gapUnlessEnvironmentBlocked(
          mergeResults([focused, planningSmoke, reviewSmoke, nextVersionSmoke]),
        ),
    source: [
      "root-focused-acceptance",
      "planning-pc-demo-1-smoke",
      "demo-ux-6-smoke",
      "support-plan-review-new-version-demo-1-smoke",
    ],
    note: "AC-9 binds to smoke-report WRITE_COUNT_KEYS (writeCount|mutationCount|liveWriteCount|sharePointWriteCount). PASS requires telemetry present and all counts == 0. liveWriteAuthorized flags remain boundary evidence, not a substitute for write-count telemetry.",
    mutationTelemetryAvailable,
  },
];

if (checkpoints.map((item) => item.id).join(",") !== CHECKPOINT_IDS.join(",")) {
  throw new Error("Acceptance checkpoint set drifted from AC-1 through AC-9");
}

const knownGaps = checkpoints
  .filter((item) => item.result === "GAP_FOUND")
  .map((item) => ({ id: item.id, note: item.note ?? null }));
const overallResult = mergeResults(checkpoints.map((item) => item.result));
const browserSmokeResult = Object.fromEntries(
  executions.filter((item) => item.name.endsWith("-smoke")).map((item) => [item.name, item.result]),
);

emit(
  {
    unit: UNIT,
    definition: DEFINITION,
    definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
    expectedMainSha,
    observedMainSha,
    shaMatch,
    preflightState: "PRECHECK_BASE_MATCH",
    implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
    acceptanceExecutionAuthority,
    checkpoints,
    executions,
    testCount: Object.fromEntries(executions.map((item) => [item.name, item.testCount])),
    browserSmokeResult,
    mutationObservations: mutationObservations.map((item) => ({
      name: item.name,
      executionResult: item.executionResult,
      reportFound: Boolean(item.report),
      liveWriteAuthorized: item.report?.sliceFlags?.liveWriteAuthorized ?? null,
      liveTenantIoAuthorized: item.report?.sliceFlags?.liveTenantIoAuthorized ?? null,
      sharePointRestAuthorized: item.report?.sliceFlags?.sharePointRestAuthorized ?? null,
    })),
    observedWriteCounts,
    mutationAttempted,
    liveWriteAuthorized,
    knownGaps,
    overallResult,
  },
  overallResult === "PASS" ? 0 : 1,
);
