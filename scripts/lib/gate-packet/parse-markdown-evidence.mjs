import { GATE_LINE_ALIASES, GATE_STATES } from "./constants.mjs";

const TEXT_FENCE = /```text\n([\s\S]*?)```/g;

/** Formal gate tokens accepted verbatim (Correction-1 / fail-closed). */
const EXACT_GATE_ALIASES = new Map([
  ["CONSUMED", "CONSUMED"],
  ["ELIGIBLE", "ELIGIBLE"],
  ["NOT_RECEIVED", "NOT_RECEIVED"],
  ["NOT RECEIVED", "NOT_RECEIVED"],
  ["INVALIDATED", "INVALIDATED"],
  ["FORBIDDEN", "FORBIDDEN"],
]);

/** Extract all ```text blocks from markdown. */
export function extractTextBlocks(markdown) {
  const blocks = [];
  for (const match of markdown.matchAll(TEXT_FENCE)) {
    blocks.push(match[1]);
  }
  return blocks;
}

/** Parse `Key = VALUE` lines from text blocks into a flat map (last wins). */
export function parseKeyValueLines(textBlocks) {
  const map = new Map();
  for (const block of textBlocks) {
    for (const line of block.split("\n")) {
      const trimmed = line.trim();
      const eq = trimmed.match(/^([^=]+?)\s*=\s*(.+)$/);
      if (!eq) {
        continue;
      }
      map.set(eq[1].trim(), eq[2].trim());
    }
  }
  return map;
}

/**
 * Normalize gate state: exact formal token only; all other phrases → UNKNOWN.
 * Does not map HOLD/REQUIRED/PASS/VERIFIED/NOT ELIGIBLE to gate states.
 */
export function normalizeGateState(raw) {
  if (!raw) {
    return "UNKNOWN";
  }
  const trimmed = raw.trim();
  const upper = trimmed.toUpperCase();

  if (EXACT_GATE_ALIASES.has(upper)) {
    return EXACT_GATE_ALIASES.get(upper);
  }

  const underscored = upper.replace(/\s+/g, "_");
  if (GATE_STATES.has(underscored)) {
    return underscored;
  }

  return "UNKNOWN";
}

/** Map evidence-doc gate lines to structured gate subset. */
export function parseGatesFromKeyValues(keyValues) {
  const gates = {};
  for (const [label, gateKey] of Object.entries(GATE_LINE_ALIASES)) {
    if (keyValues.has(label)) {
      gates[gateKey] = normalizeGateState(keyValues.get(label));
    }
  }
  return gates;
}

/** Parse path lines from a ```text fence body. */
function parsePathLinesFromFence(fenceBody) {
  const paths = [];
  for (const line of fenceBody.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("Human GO:")) {
      continue;
    }
    const segments = trimmed
      .replace(/^-?\s*/, "")
      .split(/\s+\/\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const seg of segments) {
      if (/\.(tsx?|mjs|scss|md)$/.test(seg) || seg.includes("/")) {
        paths.push(seg);
      }
    }
  }
  return paths;
}

/** Parse authorized path list from evidence markdown (bullet lines under Authorized diff). */
export function parseAuthorizedDiffPaths(markdown) {
  const section = markdown.match(
    /Authorized diff:[^\n]*\n([\s\S]*?)(?:\n\n|\nProduct correction:|\n## )/,
  );
  if (!section) {
    return [];
  }
  return parsePathLinesFromFence(section[1]);
}

/**
 * Parse #548 canonical evidence: heading + bounded text fence after scope-start anchor.
 * Scope §5.2.2 — explicit source grammar only.
 */
export function parseAuthorizedSurfaceDelivered(markdown) {
  const headingMatch = markdown.match(
    /## 1\. Authorized surface delivered\s*\n([\s\S]*?)(?:\n## |\n---\s*\n|$)/,
  );
  if (!headingMatch) {
    return [];
  }
  const section = headingMatch[1];
  const anchorIdx = section.search(/Exact diff from scope start HEAD/i);
  if (anchorIdx === -1) {
    return [];
  }
  const afterAnchor = section.slice(anchorIdx);
  const fenceMatch = afterAnchor.match(/```text\n([\s\S]*?)```/);
  if (!fenceMatch) {
    return [];
  }
  return parsePathLinesFromFence(fenceMatch[1]);
}

/** Dispatch: Pilot #552 Authorized diff first; else #548 bounded heading grammar. */
export function parseAuthorizedPaths(markdown) {
  const fromDiff = parseAuthorizedDiffPaths(markdown);
  if (fromDiff.length > 0) {
    return fromDiff;
  }
  return parseAuthorizedSurfaceDelivered(markdown);
}

/** Parse pilot implementation / product locked HEAD SHAs from evidence content. */
export function parsePilotLockedHeads(markdown, keyValues) {
  const heads = {};
  const impl =
    markdown.match(/exact (?:corrected )?implementation HEAD\s*=\s*([0-9a-f]{40})/i)?.[1] ??
    keyValues.get("exact implementation HEAD")?.match(/([0-9a-f]{40})/i)?.[1];
  if (impl) {
    heads.implementation = impl;
  }
  const product =
    markdown.match(/parent Product basis:\s*main\s*@\s*([0-9a-f]{40})/i)?.[1] ??
    markdown.match(/Product ancestor:\s*`([0-9a-f]{40})`/i)?.[1];
  if (product) {
    heads.product_basis = product;
  }
  const evidenceHead = markdown.match(/evidence packet HEAD:\s*([0-9a-f]{40})/i)?.[1];
  if (evidenceHead) {
    heads.evidence = evidenceHead;
  }
  return heads;
}

/** Parse Slice-A parent Definition / Scope blob identity from bind readback artifact. */
/** @returns {Record<string, string>} */
export function parseSliceABindLockedHeads(markdown) {
  const heads = {};
  const definition = markdown.match(/Definition blob:\s*([0-9a-f]{40})/i)?.[1];
  if (definition) {
    heads.definition = definition;
  }
  const scope = markdown.match(/Scope blob:\s*([0-9a-f]{40})/i)?.[1];
  if (scope) {
    heads.scope = scope;
  }
  return heads;
}

/** Parse Second Pilot locked identity from selection record bounded section (Slice-B §5.2.3). */
/** @returns {Record<string, string>} */
export function parseSecondPilotLockedHeads(markdown) {
  const sectionMatch = markdown.match(
    /## Available locked identity\s*\n([\s\S]*?)(?:\n## |\n---\s*\n|$)/,
  );
  if (!sectionMatch) {
    return {};
  }
  const section = sectionMatch[1];
  const heads = {};
  const definition = section.match(/Definition blob\s*=\s*([0-9a-f]{40})/i)?.[1];
  if (definition) {
    heads.definition = definition;
  }
  const scope = section.match(/Scope blob\s*=\s*([0-9a-f]{40})/i)?.[1];
  if (scope) {
    heads.scope = scope;
  }
  const implementation = section.match(/exact implementation HEAD\s*=\s*([0-9a-f]{40})/i)?.[1];
  if (implementation) {
    heads.implementation = implementation;
  }
  return heads;
}

/** Merge pilot + bind locked heads (Slice-A colon bind or Slice-B bounded section). */
/** @returns {Record<string, string | undefined>} */
export function parseLockedHeads(pilotMarkdown, keyValues, sliceBindMarkdown = "") {
  const sliceA = parseSliceABindLockedHeads(sliceBindMarkdown);
  const bindHeads =
    sliceA.definition || sliceA.scope ? sliceA : parseSecondPilotLockedHeads(sliceBindMarkdown);
  return {
    ...bindHeads,
    ...parsePilotLockedHeads(pilotMarkdown, keyValues),
  };
}

/** Infer correction generation from PR body or evidence (supplementary). */
export function parseCorrectionGeneration(markdown) {
  const plus = markdown.match(/Correction-(\d+)\s*\+\s*(\d+)\s*\+\s*(\d+)/i);
  if (plus) {
    return Math.max(Number(plus[1]), Number(plus[2]), Number(plus[3]));
  }
  const single = markdown.match(/Definition Correction-(\d+)/gi);
  if (single?.length) {
    const nums = single.map((s) => Number(s.match(/\d+/)[0]));
    return Math.max(...nums);
  }
  const scopeCorr = markdown.match(/Scope Correction-(\d+)/gi);
  if (scopeCorr?.length) {
    const nums = scopeCorr.map((s) => Number(s.match(/\d+/)[0]));
    return Math.max(...nums);
  }
  return null;
}

/** Derive next_human_action from exact gate tokens only (Scope §9). Fail-closed to UNKNOWN. */
export function deriveNextHumanAction(gates) {
  if (gates.actual_staff_value === "ELIGIBLE") {
    if (gates.ready === "NOT_RECEIVED" && gates.merge === "NOT_RECEIVED") {
      return "ACTUAL_STAFF_VALUE_CONFIRMED";
    }
  }
  if (gates.ready === "ELIGIBLE") {
    if (gates.merge === "NOT_RECEIVED") {
      return "READY";
    }
  }
  if (gates.merge === "ELIGIBLE") {
    return "MERGE";
  }
  if (gates.implementation_start === "NOT_RECEIVED") {
    return "IMPLEMENTATION_START";
  }
  return "UNKNOWN";
}

/** Resolve live PR lifecycle fact (not Human GO state). */
export function resolvePrState(prLive) {
  if (!prLive) {
    return "UNKNOWN";
  }
  if (prLive.mergedAt) {
    return "MERGED";
  }
  return prLive.state ?? "UNKNOWN";
}
