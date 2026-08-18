#!/usr/bin/env node
/**
 * Verify Product UI Contract Screen Templates v1.
 *
 * Checks:
 * - template file exists
 * - six required template ids with template-meta
 * - required field headings per entry
 * - implementation paths exist
 * - generator / Plop / Storybook are not claimed as SSOT
 * - host vs destination, empty vs fail-closed, plan vs procedure remain distinct
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const templatesRelativePath = "docs/architecture/ui-screen-templates-v1.md";

const requiredIds = [
  "ShellHost",
  "DestinationOverview",
  "DestinationList",
  "DestinationDetail",
  "RecordEditor",
  "PlanDocument",
];

const allowedStatuses = new Set(["EXISTS", "PATTERN", "KEEP", "GAP"]);

const requiredFieldHeadings = [
  "#### Domain meaning",
  "#### Layout skeleton",
  "#### Catalog slots",
  "#### Forbidden substitutions",
  "#### Required a11y channel",
  "#### Smoke hooks",
  "#### Good examples",
  "#### Bad examples",
  "#### Adoption surfaces",
];

const requiredPhrases = [
  "Storybook を新 SSOT にしない",
  "generator / Plop = Later",
  "要確認",
  "未記録",
  "save_failed",
  "save_outcome_unknown",
  "CurrentProcedure",
  "lint:ui-sem",
  "presentationRole",
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

const parseTemplateMetaBlocks = (content) => {
  const blocks = [];
  const pattern = /```template-meta\n([\s\S]*?)```/g;
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

if (!(await exists(templatesRelativePath))) {
  failures.push(`Missing templates: ${templatesRelativePath}`);
} else {
  const content = await readFile(path.join(root, templatesRelativePath), "utf8");

  for (const phrase of requiredPhrases) {
    if (!content.includes(phrase)) {
      failures.push(`Templates missing required phrase: ${phrase}`);
    }
  }

  if (
    /Storybook[^\n]{0,40}SSOT/.test(content) &&
    !content.includes("Storybook を新 SSOT にしない")
  ) {
    failures.push("Templates must not treat Storybook as SSOT");
  }

  if (/\bPlop\b/.test(content) && !content.includes("generator / Plop = Later")) {
    failures.push("Templates must keep generator / Plop as Later");
  }

  const blocks = parseTemplateMetaBlocks(content);
  const blockIds = blocks.map((block) => block.id).filter(Boolean);

  for (const id of requiredIds) {
    if (!blockIds.includes(id)) {
      failures.push(`Templates missing template-meta for ${id}`);
    }
    if (!content.includes(`### ${id}`)) {
      failures.push(`Templates missing heading ### ${id}`);
    }
  }

  for (const id of blockIds) {
    if (!requiredIds.includes(id)) {
      failures.push(`Templates has unexpected template-meta id: ${id}`);
    }
  }

  if (new Set(blockIds).size !== blockIds.length) {
    failures.push("Templates template-meta ids must be unique");
  }

  for (const block of blocks) {
    if (!block.id) {
      failures.push("template-meta missing id");
      continue;
    }
    if (!allowedStatuses.has(block.status ?? "")) {
      failures.push(`${block.id}: invalid status "${block.status ?? ""}"`);
    }
    if (block.status === "GAP" || block.status === "PATTERN" || block.status === "KEEP") {
      failures.push(`${block.id}: v1 allows EXISTS only (document later status in a new GO)`);
    }
    if (!block.paths.length) {
      failures.push(`${block.id}: template-meta needs at least one path`);
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

  const host = entrySection(content, "ShellHost") ?? "";
  if (!host.includes("非見出し") || !host.includes("EmptyNotice")) {
    failures.push("ShellHost must keep host status non-heading and forbid EmptyNotice fail-closed");
  }

  const overview = entrySection(content, "DestinationOverview") ?? "";
  if (!overview.includes("presentationRole") || !overview.includes("destination")) {
    failures.push("DestinationOverview must keep presentationRole from selecting destinations");
  }

  const list = entrySection(content, "DestinationList") ?? "";
  if (!list.includes("EmptyNotice") || !list.includes("StatusPanelFamily")) {
    failures.push("DestinationList must distinguish EmptyNotice from StatusPanelFamily");
  }
  if (!list.includes("要確認") || !list.includes("未記録")) {
    failures.push("DestinationList must distinguish 要確認 and 未記録");
  }

  const detail = entrySection(content, "DestinationDetail") ?? "";
  if (!detail.includes("支援計画") || !detail.includes("支援手順")) {
    failures.push("DestinationDetail must distinguish 支援計画 and 支援手順");
  }
  if (!detail.includes("CurrentProcedure") || !detail.includes("historical")) {
    failures.push("DestinationDetail must distinguish CurrentProcedure from historical procedure");
  }

  const editor = entrySection(content, "RecordEditor") ?? "";
  if (!editor.includes("save_failed") || !editor.includes("save_outcome_unknown")) {
    failures.push("RecordEditor must distinguish save_failed and save_outcome_unknown");
  }

  const plan = entrySection(content, "PlanDocument") ?? "";
  if (!plan.includes("支援計画") || !plan.includes("支援手順")) {
    failures.push("PlanDocument must distinguish 支援計画 and 支援手順");
  }
}

if (failures.length > 0) {
  console.error("UI templates verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `UI templates verification passed. entries=${requiredIds.length} file=${templatesRelativePath}`,
);
