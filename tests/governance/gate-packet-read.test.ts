import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

import {
  applyLivePrOverrides,
  buildGatePacket,
} from "../../scripts/lib/gate-packet/read-gate-packet.mjs";
import {
  deriveNextHumanAction,
  normalizeGateState,
  parseAuthorizedPaths,
  parseCorrectionGeneration,
  parseGatesFromKeyValues,
  parseKeyValueLines,
  extractTextBlocks,
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
exact implementation HEAD = aaabbbbccccddddeeeeffffaaaabbbbccccddddeeeeffff
parent Product basis: main @ 1111222233334444555566667777888899990000aaaabbbb
\`\`\`
`;

describe("gate-packet parse-markdown-evidence", () => {
  it("extracts gate states from structured text blocks", () => {
    const blocks = extractTextBlocks(FIXTURE_EVIDENCE);
    const kv = parseKeyValueLines(blocks);
    const gates = parseGatesFromKeyValues(kv) as Record<string, string>;
    assert.equal(gates.ready, "NOT_RECEIVED");
    assert.equal(gates.merge, "NOT_RECEIVED");
    assert.equal(gates.actual_staff_value, "ELIGIBLE");
  });

  it("parses authorized paths from evidence section", () => {
    const paths = parseAuthorizedPaths(FIXTURE_EVIDENCE);
    assert.equal(paths.length, 3);
    assert.ok(paths.includes("ReviewOutcomeCaptureView.tsx"));
  });

  it("returns UNKNOWN for unrecognized gate values", () => {
    assert.equal(normalizeGateState("maybe later"), "UNKNOWN");
  });

  it("derives ACTUAL_STAFF_VALUE_CONFIRMED when staff gate open before ready", () => {
    const action = deriveNextHumanAction({
      actual_staff_value: "ELIGIBLE",
      ready: "NOT_RECEIVED",
      merge: "NOT_RECEIVED",
    });
    assert.equal(action, "ACTUAL_STAFF_VALUE_CONFIRMED");
  });

  it("does not treat index-only edits as GO (V-2): build output is read-time only", () => {
    const packet = buildGatePacket({
      issue: 552,
      pr: 563,
      evidenceMarkdown: FIXTURE_EVIDENCE,
      mainSha: "deadbeef",
    });
    assert.equal((packet.gates as Record<string, string>).ready, "NOT_RECEIVED");
    assert.notEqual((packet.gates as Record<string, string>).merge, "CONSUMED");
  });
});

describe("gate-packet live PR override", () => {
  it("applies merge CONSUMED when PR merged (GitHub live > stale doc)", () => {
    const gates = applyLivePrOverrides(
      { ready: "NOT_RECEIVED", merge: "NOT_RECEIVED" },
      { prState: "MERGED", prMerged: true },
    );
    assert.equal(gates.merge, "CONSUMED");
    assert.equal(gates.ready, "CONSUMED");
  });

  it("returns UNKNOWN next action when PR merged and issue closed", () => {
    const gates = applyLivePrOverrides(
      { ready: "NOT_RECEIVED", merge: "NOT_RECEIVED" },
      { prState: "MERGED", prMerged: true },
    );
    const next = deriveNextHumanAction(gates, { prMerged: true, issueClosed: true });
    assert.equal(next, "UNKNOWN");
  });
});

describe("gate-packet pilot #552 integration", () => {
  it("reads real evidence doc on disk without throwing", async () => {
    const rel = "docs/architecture/sbs-mgmt-loop-a-implementation-evidence.md";
    const markdown = await readFile(path.join(process.cwd(), rel), "utf8");
    const packet = buildGatePacket({
      issue: 552,
      pr: 563,
      evidenceMarkdown: markdown,
      supplementaryMarkdown: "Correction-2 + 3 + 4",
      mainSha: "2a604ed0808cb2514f3c47ba5e3d5ec44e235f23",
      prLive: { state: "MERGED", mergedAt: "2026-09-01T08:54:45Z" } as never,
    });

    assert.equal(packet.issue, 552);
    assert.equal(packet.pr, 563);
    assert.ok(packet.authorized_paths.length >= 5);
    assert.ok(packet.locked_heads.implementation?.length === 40);
    assert.equal((packet.gates as Record<string, string>).merge, "CONSUMED");
    assert.equal(packet.definition_generation, 4);
    assert.ok(packet.freshness.evidence_basis_sha);
  });

  it("parses correction generation from supplementary PR body pattern", () => {
    assert.equal(parseCorrectionGeneration("Scope Correction-1\nCorrection-2 + 3 + 4"), 4);
  });
});

describe("gate-packet fail-closed (V-3 / V-4)", () => {
  it("uses UNKNOWN when gates ambiguous for next action", () => {
    const next = deriveNextHumanAction({});
    assert.equal(next, "UNKNOWN");
  });
});
