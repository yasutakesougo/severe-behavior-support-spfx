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
} from "./parse-markdown-evidence.mjs";
import { getPilot } from "./pilots.mjs";

/**
 * Apply GitHub live PR state over doc-derived gates (Evidence priority §4.1).
 * Does not infer GO from CI or review chronology.
 */
export function applyLivePrOverrides(gates, { prState, prMerged }) {
  const next = { ...gates };
  if (prMerged) {
    next.merge = "CONSUMED";
    if (next.ready === "NOT_RECEIVED" || next.ready === "ELIGIBLE" || next.ready === "UNKNOWN") {
      next.ready = "CONSUMED";
    }
  } else if (prState === "OPEN" && !prMerged) {
    if (next.merge === undefined) {
      next.merge = "NOT_RECEIVED";
    }
  }
  return next;
}

/** Build structured gate packet from pilot config + file contents + optional live PR. */
export function buildGatePacket({
  issue,
  pr,
  evidenceMarkdown,
  supplementaryMarkdown = "",
  mainSha = "UNKNOWN",
  prLive = null,
  evidenceCheckedAt = new Date().toISOString(),
}) {
  const combined = `${evidenceMarkdown}\n${supplementaryMarkdown}`;
  const textBlocks = extractTextBlocks(combined);
  const keyValues = parseKeyValueLines(textBlocks);

  let gates = parseGatesFromKeyValues(keyValues);
  const prMerged = Boolean(prLive?.mergedAt);
  gates = applyLivePrOverrides(gates, {
    prState: prLive?.state ?? "UNKNOWN",
    prMerged,
  });

  const authorized_paths = parseAuthorizedPaths(evidenceMarkdown);
  const locked_heads = parseLockedHeads(evidenceMarkdown, keyValues);
  const definition_generation = parseCorrectionGeneration(combined);

  const next_human_action = deriveNextHumanAction(gates, {
    prMerged,
    issueClosed: prLive?.issueClosed ?? false,
  });

  return {
    issue,
    pr: pr ?? null,
    authorized_paths,
    locked_heads,
    gates,
    definition_generation: definition_generation ?? "UNKNOWN",
    next_human_action,
    freshness: {
      evidence_checked_at: evidenceCheckedAt,
      evidence_basis_sha: mainSha,
    },
    sources: {
      primary: ["github_live_pr", "locked_architecture_artifacts"],
      pilot_evidence_paths: [],
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

  let prLive = null;
  let supplementaryMarkdown = "";
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
        prLive.issueClosed = undefined;
      }
    } catch {
      prLive = null;
    }
  }

  const packet = buildGatePacket({
    issue: pilot.issue,
    pr: pilot.pr,
    evidenceMarkdown,
    supplementaryMarkdown,
    mainSha,
    prLive,
  });
  packet.sources.pilot_evidence_paths = pilot.evidencePaths;
  return packet;
}
