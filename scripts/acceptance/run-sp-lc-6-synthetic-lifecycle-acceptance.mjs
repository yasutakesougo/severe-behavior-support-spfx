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
const EXPECTED_MAIN_SHA = "e8261761e4cff29babfa49c59c4f7de89373e48c";
const IMPLEMENTATION_START_AUTHORITY =
  "Human Implementation Start GO / #445 / D1=B D2=B D3=B D4=A D5=B D6=A";

const CHECKPOINT_IDS = ["AC-1", "AC-2", "AC-3", "AC-4", "AC-5", "AC-6", "AC-7", "AC-8", "AC-9"];
const ENVIRONMENT_BLOCK_PATTERN =
  /ENOENT|ERR_MODULE_NOT_FOUND|Cannot find module|command not found|google-chrome|puppeteer|esbuild|sass/i;

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

function emit(report, exitCode) {
  const serialized = JSON.stringify(report, null, 2);
  if (process.env.SP_LC_6_REPORT_PATH) {
    fs.writeFileSync(path.resolve(process.env.SP_LC_6_REPORT_PATH), `${serialized}\n`, "utf8");
  }
  console.log(serialized);
  process.exit(exitCode);
}

const observedMainSha = resolveObservedMainSha();
if (!observedMainSha) {
  emit(
    {
      unit: UNIT,
      definition: DEFINITION,
      definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
      expectedMainSha: EXPECTED_MAIN_SHA,
      observedMainSha: null,
      shaMatch: null,
      preflightState: null,
      implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
      overallResult: null,
      runnerError: "OBSERVED_MAIN_SHA_UNRESOLVED",
      mutationAttempted: false,
      liveWriteAuthorized: false,
    },
    2,
  );
}

const shaMatch = observedMainSha === EXPECTED_MAIN_SHA;
if (!shaMatch) {
  emit(
    {
      unit: UNIT,
      definition: DEFINITION,
      definitionBaselineMainSha: DEFINITION_BASELINE_MAIN_SHA,
      expectedMainSha: EXPECTED_MAIN_SHA,
      observedMainSha,
      shaMatch,
      preflightState: "PRECHECK_BASE_MISMATCH_NOT_STARTED",
      implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
      checkpoints: [],
      knownGaps: [],
      overallResult: null,
      mutationAttempted: false,
      liveWriteAuthorized: false,
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
    result: nextVersionSmoke === "ENVIRONMENT_BLOCKED" ? "ENVIRONMENT_BLOCKED" : "GAP_FOUND",
    source: ["root-focused-acceptance", "support-plan-review-new-version-demo-1-smoke"],
    note: "Current authorized main exposes concept-only next-version presentation; persistence/draft workflow remain unauthorized.",
    smokeObservation: nextVersionSmoke,
  },
  {
    id: "AC-8",
    result: mergeResults([focused, planning, reviewSmoke]),
    source: ["root-focused-acceptance", "root-planning-graph", "demo-ux-6-smoke"],
  },
  {
    id: "AC-9",
    result: focused,
    source: ["root-focused-acceptance", "runner-boundary"],
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
    expectedMainSha: EXPECTED_MAIN_SHA,
    observedMainSha,
    shaMatch,
    preflightState: "PRECHECK_BASE_MATCH",
    implementationStartAuthority: IMPLEMENTATION_START_AUTHORITY,
    checkpoints,
    executions,
    testCount: Object.fromEntries(executions.map((item) => [item.name, item.testCount])),
    browserSmokeResult,
    mutationAttempted: false,
    liveWriteAuthorized: false,
    knownGaps,
    overallResult,
  },
  overallResult === "PASS" ? 0 : 1,
);
