#!/usr/bin/env node
/**
 * Verify Product UI Contract Component Catalog v1.
 *
 * Checks:
 * - catalog file exists
 * - six required entry ids with catalog-meta
 * - required field headings per entry
 * - implementation paths exist
 * - Storybook is not claimed as SSOT
 * - semantic vocabulary (要確認 / 未記録 / save 5-state) remains distinct
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalogRelativePath = "docs/architecture/ui-component-catalog-v1.md";

const requiredIds = [
  "StatusBadge",
  "EmptyNotice",
  "SaveStateNotice",
  "UserSummary",
  "ProcedureSummary",
  "StatusPanelFamily",
];

const allowedStatuses = new Set(["EXISTS", "PATTERN", "KEEP", "GAP"]);

const requiredFieldHeadings = [
  "#### Domain meaning",
  "#### Allowed props / states",
  "#### Forbidden substitutions",
  "#### Required a11y channel",
  "#### Good examples",
  "#### Bad examples",
  "#### Related smoke / a11y gate IDs",
  "#### Adoption surfaces",
];

const requiredPhrases = [
  "Storybook を新 SSOT にしない",
  "要確認",
  "未記録",
  "save_failed",
  "save_outcome_unknown",
  "CurrentProcedure",
];

const failures = [];

const exists = async (relativePath) => {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
};

const parseCatalogMetaBlocks = (content) => {
  const blocks = [];
  const pattern = /```catalog-meta\n([\s\S]*?)```/g;
  for (const match of content.matchAll(pattern)) {
    const body = match[1];
    const id = body.match(/^id:\s+(\S+)/m)?.[1];
    const status = body.match(/^status:\s+(\S+)/m)?.[1];
    const paths = [...body.matchAll(/^path:\s+(\S+)/gm)].map((item) => item[1]);
    blocks.push({ id, status, paths, raw: body });
  }
  return blocks;
};

const entrySection = (content, id) => {
  const heading = `### ${id}`;
  const start = content.indexOf(heading);
  if (start < 0) {
    return null;
  }
  const after = start + heading.length;
  const next = content.slice(after).search(/\n### [A-Z]/);
  return next < 0 ? content.slice(start) : content.slice(start, after + next);
};

if (!(await exists(catalogRelativePath))) {
  failures.push(`Missing catalog: ${catalogRelativePath}`);
} else {
  const content = await readFile(path.join(root, catalogRelativePath), "utf8");

  for (const phrase of requiredPhrases) {
    if (!content.includes(phrase)) {
      failures.push(`Catalog missing required phrase: ${phrase}`);
    }
  }

  if (
    /Storybook[^\n]{0,40}SSOT/.test(content) &&
    !content.includes("Storybook を新 SSOT にしない")
  ) {
    failures.push("Catalog must not treat Storybook as SSOT");
  }

  const blocks = parseCatalogMetaBlocks(content);
  const blockIds = blocks.map((block) => block.id).filter(Boolean);

  for (const id of requiredIds) {
    if (!blockIds.includes(id)) {
      failures.push(`Catalog missing catalog-meta for ${id}`);
    }
    if (!content.includes(`### ${id}`)) {
      failures.push(`Catalog missing heading ### ${id}`);
    }
  }

  for (const id of blockIds) {
    if (!requiredIds.includes(id)) {
      failures.push(`Catalog has unexpected catalog-meta id: ${id}`);
    }
  }

  if (new Set(blockIds).size !== blockIds.length) {
    failures.push("Catalog catalog-meta ids must be unique");
  }

  for (const block of blocks) {
    if (!block.id) {
      failures.push("catalog-meta missing id");
      continue;
    }
    if (!allowedStatuses.has(block.status ?? "")) {
      failures.push(`${block.id}: invalid status "${block.status ?? ""}"`);
    }
    if (block.status === "GAP") {
      failures.push(`${block.id}: GAP is not allowed in Catalog v1 (document PATTERN/EXISTS/KEEP)`);
    }
    if (!block.paths.length) {
      failures.push(`${block.id}: catalog-meta needs at least one path`);
    }
    for (const relativePath of block.paths) {
      if (!(await exists(relativePath))) {
        failures.push(`${block.id}: implementation path missing: ${relativePath}`);
      }
    }

    const section = entrySection(content, block.id);
    if (!section) {
      continue;
    }
    for (const heading of requiredFieldHeadings) {
      if (!section.includes(heading)) {
        failures.push(`${block.id}: missing ${heading}`);
      }
    }
  }

  const statusBadge = entrySection(content, "StatusBadge") ?? "";
  if (!statusBadge.includes("要確認") || !statusBadge.includes("未記録")) {
    failures.push("StatusBadge must distinguish 要確認 and 未記録");
  }

  const saveNotice = entrySection(content, "SaveStateNotice") ?? "";
  if (!saveNotice.includes("save_failed") || !saveNotice.includes("save_outcome_unknown")) {
    failures.push("SaveStateNotice must distinguish save_failed and save_outcome_unknown");
  }

  const procedure = entrySection(content, "ProcedureSummary") ?? "";
  if (!procedure.includes("historical") && !procedure.includes("historical procedure")) {
    failures.push("ProcedureSummary must distinguish CurrentProcedure from historical procedure");
  }

  const emptyNotice = entrySection(content, "EmptyNotice") ?? "";
  const statusPanel = entrySection(content, "StatusPanelFamily") ?? "";
  if (!emptyNotice.includes("StatusPanel") || !statusPanel.includes("EmptyNotice")) {
    failures.push("EmptyNotice and StatusPanelFamily must mutually forbid substitution");
  }
}

if (failures.length > 0) {
  console.error("UI catalog verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `UI catalog verification passed. entries=${requiredIds.length} file=${catalogRelativePath}`,
);
