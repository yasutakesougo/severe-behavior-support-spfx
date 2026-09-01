import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

import { buildGatePacket } from "../../scripts/lib/gate-packet/read-gate-packet.mjs";
import {
  deriveNextHumanAction,
  normalizeGateState,
  parseAuthorizedPaths,
  parseAuthorizedSurfaceDelivered,
  parseCorrectionGeneration,
  parseGatesFromKeyValues,
  parseKeyValueLines,
  parseLockedHeads,
  parseSecondPilotLockedHeads,
  parseSliceABindLockedHeads,
  extractTextBlocks,
  resolvePrState,
} from "../../scripts/lib/gate-packet/parse-markdown-evidence.mjs";

const FIXTURE_EVIDENCE = `# Evidence

\`\`\`text
Human Ready GO = NOT RECEIVED / NOT ELIGIBLE
Human Merge GO = NOT RECEIVED
Actual Staff Value Check = HOLD / REQUIRED
\`\`\`

## 2. Implementation Correction

\`\`\`text
Authorized diff: 7 files only
  ReviewOutcomeCaptureView.tsx
  HumanReviewView.test.tsx
  spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs
\`\`\`

\`\`\`text
exact implementation HEAD = aaabbbbccccddddeeeeffffaaaabbbbccccdddd0
parent Product basis: main @ 1111222233334444555566667777888899990000aaaabbbb
\`\`\`
`;

const SLICE_BIND = `# Bind

\`\`\`text
Definition blob: 25443455fad9d0ccb76a84a4ebdc94c4ac242442
Scope blob: 2b0b934a977bfe5192ecb6087fda67215c79a366
\`\`\`
`;

describe("gate-packet normalizeGateState (Correction-1)", () => {
  it("accepts exact formal gate tokens only", () => {
    assert.equal(normalizeGateState("CONSUMED"), "CONSUMED");
    assert.equal(normalizeGateState("ELIGIBLE"), "ELIGIBLE");
    assert.equal(normalizeGateState("NOT_RECEIVED"), "NOT_RECEIVED");
    assert.equal(normalizeGateState("NOT RECEIVED"), "NOT_RECEIVED");
    assert.equal(normalizeGateState("INVALIDATED"), "INVALIDATED");
    assert.equal(normalizeGateState("FORBIDDEN"), "FORBIDDEN");
  });

  it("maps HOLD / REQUIRED / PASS / VERIFIED / NOT ELIGIBLE to UNKNOWN", () => {
    assert.equal(normalizeGateState("HOLD / REQUIRED"), "UNKNOWN");
    assert.equal(normalizeGateState("PASS / VERIFIED"), "UNKNOWN");
    assert.equal(normalizeGateState("NOT RECEIVED / NOT ELIGIBLE"), "UNKNOWN");
    assert.equal(normalizeGateState("NOT ELIGIBLE"), "UNKNOWN");
  });
});

describe("gate-packet parse-markdown-evidence", () => {
  it("extracts gate states fail-closed from non-formal phrases", () => {
    const blocks = extractTextBlocks(FIXTURE_EVIDENCE);
    const kv = parseKeyValueLines(blocks);
    const gates = parseGatesFromKeyValues(kv) as Record<string, string>;
    assert.equal(gates.ready, "UNKNOWN");
    assert.equal(gates.merge, "NOT_RECEIVED");
    assert.equal(gates.actual_staff_value, "UNKNOWN");
  });

  it("does not derive ACTUAL_STAFF_VALUE from HOLD / REQUIRED text", () => {
    const blocks = extractTextBlocks(FIXTURE_EVIDENCE);
    const gates = parseGatesFromKeyValues(parseKeyValueLines(blocks)) as Record<string, string>;
    assert.equal(deriveNextHumanAction(gates), "UNKNOWN");
  });

  it("parses authorized paths from evidence section", () => {
    const paths = parseAuthorizedPaths(FIXTURE_EVIDENCE);
    assert.equal(paths.length, 3);
    assert.ok(paths.includes("ReviewOutcomeCaptureView.tsx"));
  });

  it("parses definition and scope locked heads from slice bind artifact (B-5)", () => {
    const heads = parseSliceABindLockedHeads(SLICE_BIND);
    assert.equal(heads.definition, "25443455fad9d0ccb76a84a4ebdc94c4ac242442");
    assert.equal(heads.scope, "2b0b934a977bfe5192ecb6087fda67215c79a366");
  });

  it("merges slice bind + pilot locked heads", () => {
    const blocks = extractTextBlocks(FIXTURE_EVIDENCE);
    const heads = parseLockedHeads(FIXTURE_EVIDENCE, parseKeyValueLines(blocks), SLICE_BIND);
    assert.equal(heads.definition, "25443455fad9d0ccb76a84a4ebdc94c4ac242442");
    assert.equal(heads.scope, "2b0b934a977bfe5192ecb6087fda67215c79a366");
    assert.equal(heads.implementation, "aaabbbbccccddddeeeeffffaaaabbbbccccdddd0");
  });
});

describe("gate-packet PR lifecycle vs Human GO (Correction-1)", () => {
  it("keeps pr_state MERGED without mutating Human GO gates", () => {
    const packet = buildGatePacket({
      issue: 552,
      pr: 563,
      evidenceMarkdown: FIXTURE_EVIDENCE,
      sliceBindMarkdown: SLICE_BIND,
      mainSha: "deadbeef",
      prLive: { state: "MERGED", mergedAt: "2026-09-01T08:54:45Z" } as never,
      githubLivePr: "AVAILABLE",
    });
    assert.equal(packet.live.pr_state, "MERGED");
    assert.equal((packet.gates as Record<string, string>).merge, "NOT_RECEIVED");
    assert.equal((packet.gates as Record<string, string>).ready, "UNKNOWN");
  });

  it("resolvePrState returns MERGED only as lifecycle fact", () => {
    assert.equal(resolvePrState({ state: "MERGED", mergedAt: "2026-09-01" }), "MERGED");
    assert.equal(resolvePrState(null), "UNKNOWN");
  });
});

describe("gate-packet live unavailable provenance (P2-1)", () => {
  it("marks github_live_pr UNAVAILABLE and pr_state UNKNOWN", () => {
    const packet = buildGatePacket({
      issue: 552,
      pr: 563,
      evidenceMarkdown: FIXTURE_EVIDENCE,
      sliceBindMarkdown: SLICE_BIND,
      githubLivePr: "UNAVAILABLE",
    });
    assert.equal(packet.live.github_live_pr, "UNAVAILABLE");
    assert.equal(packet.live.pr_state, "UNKNOWN");
    assert.equal(packet.sources.github_live_pr, "UNAVAILABLE");
    assert.deepEqual(packet.sources.primary, ["locked_architecture_artifacts"]);
  });
});

describe("gate-packet pilot #552 integration", () => {
  it("reads real evidence doc with definition/scope locked heads", async () => {
    const rel = "docs/architecture/sbs-mgmt-loop-a-implementation-evidence.md";
    const bindRel =
      "docs/architecture/asana-style-delegation-slice-a-implementation-start-readback-1.md";
    const markdown = await readFile(path.join(process.cwd(), rel), "utf8");
    const bindMarkdown = await readFile(path.join(process.cwd(), bindRel), "utf8");
    const packet = buildGatePacket({
      issue: 552,
      pr: 563,
      evidenceMarkdown: markdown,
      sliceBindMarkdown: bindMarkdown,
      supplementaryMarkdown: "Correction-2 + 3 + 4",
      mainSha: "2a604ed0808cb2514f3c47ba5e3d5ec44e235f23",
      prLive: { state: "MERGED", mergedAt: "2026-09-01T08:54:45Z" } as never,
      githubLivePr: "AVAILABLE",
    });

    assert.equal(packet.issue, 552);
    assert.ok(packet.authorized_paths.length >= 5);
    assert.equal(packet.locked_heads.definition, "25443455fad9d0ccb76a84a4ebdc94c4ac242442");
    assert.equal(packet.locked_heads.scope, "2b0b934a977bfe5192ecb6087fda67215c79a366");
    assert.ok(packet.locked_heads.implementation?.length === 40);
    assert.equal((packet.gates as Record<string, string>).merge, "NOT_RECEIVED");
    assert.equal(packet.live.pr_state, "MERGED");
    assert.equal(packet.definition_generation, 4);
  });

  it("parses correction generation from supplementary PR body pattern", () => {
    assert.equal(parseCorrectionGeneration("Scope Correction-1\nCorrection-2 + 3 + 4"), 4);
  });
});

describe("gate-packet fail-closed (V-3 / V-4)", () => {
  it("uses UNKNOWN when gates ambiguous for next action", () => {
    assert.equal(deriveNextHumanAction({}), "UNKNOWN");
  });
});

const PILOT_548_EVIDENCE_REL =
  "docs/architecture/review-to-plan-revision-relationship-implementation-evidence.md";
const PILOT_548_SELECTION_REL =
  "docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md";

const EXPECTED_548_PATHS = [
  "src/domain/index.ts",
  "src/domain/monitoring-period-review-outcome.ts",
  "src/domain/support-plan-version-monitoring-period-review-binding.ts",
  "tests/domain/monitoring-period-review-outcome.test.ts",
  "tests/domain/support-plan-version-monitoring-period-review-binding.test.ts",
  "tests/contracts/monitoring-period-review-outcome-contract.test.ts",
  "tests/contracts/support-plan-version-monitoring-period-review-binding-contract.test.ts",
];

describe("gate-packet Slice-B #548 bounded parsers (PORTABLE-B)", () => {
  it("parseAuthorizedSurfaceDelivered reads heading + bounded text fence (V-B5)", async () => {
    const markdown = await readFile(path.join(process.cwd(), PILOT_548_EVIDENCE_REL), "utf8");
    const paths = parseAuthorizedSurfaceDelivered(markdown);
    assert.equal(paths.length, 7);
    assert.deepEqual(paths, EXPECTED_548_PATHS);
  });

  it("parseAuthorizedPaths dispatches to surface delivered when Authorized diff absent", async () => {
    const markdown = await readFile(path.join(process.cwd(), PILOT_548_EVIDENCE_REL), "utf8");
    const paths = parseAuthorizedPaths(markdown);
    assert.deepEqual(paths, EXPECTED_548_PATHS);
  });

  it("parseSecondPilotLockedHeads reads Available locked identity section only (V-B6)", async () => {
    const selection = await readFile(path.join(process.cwd(), PILOT_548_SELECTION_REL), "utf8");
    const heads = parseSecondPilotLockedHeads(selection);
    assert.equal(heads.definition, "2ec766c97b1e1a09bb7fc4de85118eaf8dd73264");
    assert.equal(heads.scope, "0a863e693a5fc42359200081a1b3659aa2227bce");
    assert.equal(heads.implementation, "1cf450fb1718ace2b437e8414a481071058abe7e");
    assert.notEqual(heads.definition, "d107e855eccd7ebdf3b7733bd1e6860b9871e1a0");
  });

  it("does not return Slice-B parent Definition blob as pilot lineage definition", async () => {
    const selection = await readFile(path.join(process.cwd(), PILOT_548_SELECTION_REL), "utf8");
    const heads = parseSecondPilotLockedHeads(selection);
    assert.notEqual(heads.definition, "d107e855eccd7ebdf3b7733bd1e6860b9871e1a0");
  });
});

describe("gate-packet pilot #548 integration (Slice-B)", () => {
  it("reads real evidence with 7 authorized paths and pilot lineage locked heads", async () => {
    const markdown = await readFile(path.join(process.cwd(), PILOT_548_EVIDENCE_REL), "utf8");
    const bindMarkdown = await readFile(path.join(process.cwd(), PILOT_548_SELECTION_REL), "utf8");
    const packet = buildGatePacket({
      issue: 548,
      pr: 548,
      evidenceMarkdown: markdown,
      sliceBindMarkdown: bindMarkdown,
      mainSha: "426fddb7914df7d3fbf41739add91e852bf35b02",
      prLive: { state: "MERGED", mergedAt: "2026-01-01T00:00:00Z" } as never,
      githubLivePr: "AVAILABLE",
    });

    assert.equal(packet.issue, 548);
    assert.equal(packet.pr, 548);
    assert.deepEqual(packet.authorized_paths, EXPECTED_548_PATHS);
    assert.equal(packet.locked_heads.definition, "2ec766c97b1e1a09bb7fc4de85118eaf8dd73264");
    assert.equal(packet.locked_heads.scope, "0a863e693a5fc42359200081a1b3659aa2227bce");
    assert.equal(packet.locked_heads.implementation, "1cf450fb1718ace2b437e8414a481071058abe7e");
    assert.equal(packet.live.pr_state, "MERGED");
    assert.equal((packet.gates as Record<string, string>).merge, undefined);
    assert.equal((packet.gates as Record<string, string>).ready, undefined);
    assert.equal(packet.next_human_action, "UNKNOWN");
  });

  it("keeps live MERGED separate from Human merge gate inference (§5.6 / V-B4)", () => {
    const packet = buildGatePacket({
      issue: 548,
      pr: 548,
      evidenceMarkdown: "",
      sliceBindMarkdown: "",
      prLive: { state: "MERGED", mergedAt: "2026-01-01T00:00:00Z" } as never,
      githubLivePr: "AVAILABLE",
    });
    assert.equal(packet.live.pr_state, "MERGED");
    assert.notEqual((packet.gates as Record<string, string>).merge, "CONSUMED");
    assert.equal(packet.next_human_action, "UNKNOWN");
  });
});
