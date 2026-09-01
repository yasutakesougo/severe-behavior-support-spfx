import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  deriveNextHumanAction,
  extractTextBlocks,
  parseAuthorizedPaths,
  parseCorrectionGeneration,
  parseGatesFromKeyValues,
  parseKeyValueLines,
  parseLockedHeads,
  resolvePrState,
} from "./parse-markdown-evidence.mjs";
import { getPilot } from "./pilots.mjs";

/** Build structured gate packet from pilot config + file contents + optional live PR. */
export function buildGatePacket({
  issue,
  pr,
  evidenceMarkdown,
  sliceBindMarkdown = "",
  supplementaryMarkdown = "",
  mainSha = "UNKNOWN",
  prLive = null,
  githubLivePr = "NOT_REQUESTED",
  evidenceCheckedAt = new Date().toISOString(),
}) {
  const combined = `${evidenceMarkdown}\n${supplementaryMarkdown}`;
  const textBlocks = extractTextBlocks(combined);
  const keyValues = parseKeyValueLines(textBlocks);

  const gates = parseGatesFromKeyValues(keyValues);
  const authorized_paths = parseAuthorizedPaths(evidenceMarkdown);
  const locked_heads = parseLockedHeads(evidenceMarkdown, keyValues, sliceBindMarkdown);
  const definition_generation = parseCorrectionGeneration(combined);
  const next_human_action = deriveNextHumanAction(gates);

  const pr_state = githubLivePr === "AVAILABLE" ? resolvePrState(prLive) : "UNKNOWN";

  const primary = ["locked_architecture_artifacts"];
  if (githubLivePr === "AVAILABLE") {
    primary.unshift("github_live_pr");
  }

  return {
    issue,
    pr: pr ?? null,
    authorized_paths,
    locked_heads,
    gates,
    live: {
      pr_state,
      github_live_pr: githubLivePr,
    },
    definition_generation: definition_generation ?? "UNKNOWN",
    next_human_action,
    freshness: {
      evidence_checked_at: evidenceCheckedAt,
      evidence_basis_sha: mainSha,
    },
    sources: {
      primary,
      github_live_pr: githubLivePr,
      pilot_evidence_paths: [],
      slice_bind_paths: [],
    },
  };
}

export async function readGatePacketForIssue(issueNumber, { root, runGh, mainSha }) {
  const pilot = getPilot(issueNumber);
  if (!pilot) {
    throw new Error(`No pilot configured for issue ${issueNumber}`);
  }

  const evidenceParts = [];
  for (const rel of pilot.evidencePaths) {
    const abs = path.join(root, rel);
    evidenceParts.push(await readFile(abs, "utf8"));
  }
  const evidenceMarkdown = evidenceParts.join("\n");

  let sliceBindMarkdown = "";
  for (const rel of pilot.sliceBindPaths ?? []) {
    const abs = path.join(root, rel);
    sliceBindMarkdown += `${await readFile(abs, "utf8")}\n`;
  }

  let prLive = null;
  let supplementaryMarkdown = "";
  let githubLivePr = pilot.supplementaryPr ? "UNAVAILABLE" : "NOT_REQUESTED";

  if (pilot.supplementaryPr && runGh) {
    try {
      const raw = runGh([
        "pr",
        "view",
        String(pilot.supplementaryPr),
        "--json",
        "number,state,mergedAt,headRefOid,body",
      ]);
      if (raw) {
        prLive = JSON.parse(raw);
        supplementaryMarkdown = prLive.body ?? "";
        githubLivePr = "AVAILABLE";
      }
    } catch {
      prLive = null;
      githubLivePr = "UNAVAILABLE";
    }
  }

  const packet = buildGatePacket({
    issue: pilot.issue,
    pr: pilot.pr,
    evidenceMarkdown,
    sliceBindMarkdown,
    supplementaryMarkdown,
    mainSha,
    prLive,
    githubLivePr,
  });
  packet.sources.pilot_evidence_paths = pilot.evidencePaths;
  packet.sources.slice_bind_paths = pilot.sliceBindPaths ?? [];
  return packet;
}
