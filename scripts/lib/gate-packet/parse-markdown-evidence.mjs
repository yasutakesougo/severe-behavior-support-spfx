import { GATE_LINE_ALIASES, GATE_STATES } from "./constants.mjs";

const TEXT_FENCE = /```text\n([\s\S]*?)```/g;

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

/** Normalize gate state token from free-form value (first recognized token). */
export function normalizeGateState(raw) {
  if (!raw) {
    return "UNKNOWN";
  }
  const upper = raw.toUpperCase();
  if (upper.includes("NOT RECEIVED") || upper.includes("NOT YET")) {
    return "NOT_RECEIVED";
  }
  if (upper.includes("NOT ELIGIBLE")) {
    return "NOT_RECEIVED";
  }
  if (upper.includes("INVALIDATED")) {
    return "INVALIDATED";
  }
  if (upper.includes("FORBIDDEN")) {
    return "FORBIDDEN";
  }
  for (const state of GATE_STATES) {
    if (upper.includes(state)) {
      return state;
    }
  }
  if (upper.includes("RECEIVED") || upper.includes("CONSUMED")) {
    return "CONSUMED";
  }
  if (upper.includes("HOLD") || upper.includes("REQUIRED")) {
    return "ELIGIBLE";
  }
  if (upper.includes("PASS") && upper.includes("VERIFIED")) {
    return "CONSUMED";
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

/** Parse authorized path list from evidence markdown (bullet lines under Authorized diff). */
export function parseAuthorizedPaths(markdown) {
  const paths = [];
  const section = markdown.match(
    /Authorized diff:[^\n]*\n([\s\S]*?)(?:\n\n|\nProduct correction:|\n## )/,
  );
  if (!section) {
    return paths;
  }
  for (const line of section[1].split("\n")) {
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

/** Parse locked HEAD SHAs from evidence content. */
export function parseLockedHeads(markdown, keyValues) {
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

/** Derive next_human_action from gate subset (Scope §9). Fail-closed to UNKNOWN. */
export function deriveNextHumanAction(gates, { prMerged = false, issueClosed = false } = {}) {
  if (prMerged && issueClosed) {
    return "UNKNOWN";
  }
  if (gates.actual_staff_value === "ELIGIBLE" || gates.actual_staff_value === "NOT_RECEIVED") {
    if (gates.ready === "NOT_RECEIVED" && gates.merge === "NOT_RECEIVED") {
      return "ACTUAL_STAFF_VALUE_CONFIRMED";
    }
  }
  if (gates.ready === "ELIGIBLE" || gates.ready === "NOT_RECEIVED") {
    if (gates.merge === "NOT_RECEIVED") {
      return "READY";
    }
  }
  if (gates.merge === "ELIGIBLE" || gates.merge === "NOT_RECEIVED") {
    return "MERGE";
  }
  if (gates.implementation_start === "NOT_RECEIVED") {
    return "IMPLEMENTATION_START";
  }
  return "UNKNOWN";
}
