import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skillsRoot = path.join(root, ".agents", "skills");
const sharedDirectoryName = "_shared";
const requiredHeadings = [
  "## 目的",
  "## 使用する場面",
  "## 入力",
  "## 前提条件",
  "## 実行手順",
  "## 確認項目",
  "## 停止条件",
  "## 判定基準",
  "## 成果物",
  "## 禁止事項",
  "## 出力形式",
];
const requiredStatuses = ["PASS", "READY", "HOLD", "FAIL", "NOT APPLICABLE"];
const requiredSeverities = ["P0", "P1", "P2"];
const forbiddenOperations = [
  "merge",
  "push",
  "deploy",
  "SharePoint変更",
  "Microsoft 365変更",
  "Entra ID変更",
  "本番データ変更",
  "物理削除",
];
const requiredProcessFiles = [
  "docs/process/development-process.md",
  "docs/process/gate-definitions.md",
  "docs/process/skill-catalog.md",
  ".agents/skills/_shared/judgement-rules.md",
  ".agents/skills/_shared/output-format.md",
];

const failures = [];

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readMarkdownDirectories = async () => {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== sharedDirectoryName)
    .map((entry) => entry.name)
    .sort();
};

for (const relativePath of requiredProcessFiles) {
  if (!(await exists(path.join(root, relativePath)))) {
    failures.push(`Missing required process file: ${relativePath}`);
  }
}

const skillDirectories = await readMarkdownDirectories();
const skillNames = new Map();

for (const directoryName of skillDirectories) {
  const skillFileRelativePath = path.join(".agents", "skills", directoryName, "SKILL.md");
  const skillFileAbsolutePath = path.join(root, skillFileRelativePath);

  if (!(await exists(skillFileAbsolutePath))) {
    failures.push(`Missing SKILL.md: ${skillFileRelativePath}`);
    continue;
  }

  const content = await readFile(skillFileAbsolutePath, "utf8");
  const declaredName = content.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (!declaredName) {
    failures.push(`Missing skill title heading in ${skillFileRelativePath}`);
  } else if (skillNames.has(declaredName)) {
    failures.push(`Duplicate skill title "${declaredName}" in ${skillFileRelativePath} and ${skillNames.get(declaredName)}`);
  } else {
    skillNames.set(declaredName, skillFileRelativePath);
  }

  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      failures.push(`Missing heading "${heading}" in ${skillFileRelativePath}`);
    }
  }

  for (const status of requiredStatuses) {
    if (!content.includes(status)) {
      failures.push(`Missing status term "${status}" in ${skillFileRelativePath}`);
    }
  }

  const hasSeverityReference = requiredSeverities.some((severity) => content.includes(severity));
  if (!hasSeverityReference) {
    failures.push(`Missing severity reference (P0/P1/P2) in ${skillFileRelativePath}`);
  }

  for (const operation of forbiddenOperations) {
    if (!content.includes(operation)) {
      failures.push(`Missing forbidden operation reference "${operation}" in ${skillFileRelativePath}`);
    }
  }
}

const catalogRelativePath = "docs/process/skill-catalog.md";
const catalogAbsolutePath = path.join(root, catalogRelativePath);

if (await exists(catalogAbsolutePath)) {
  const catalogContent = await readFile(catalogAbsolutePath, "utf8");
  const catalogSkillLinks = [...catalogContent.matchAll(/\[[^\]]+\]\(([^)]+SKILL\.md)\)/g)].map((match) => match[1]);
  const expectedLinkedSkills = new Set(skillDirectories);

  for (const relativeLink of catalogSkillLinks) {
    const resolvedPath = path.resolve(path.dirname(catalogAbsolutePath), relativeLink);
    if (!(await exists(resolvedPath))) {
      failures.push(`Broken internal link in ${catalogRelativePath}: ${relativeLink}`);
    }
  }

  for (const directoryName of expectedLinkedSkills) {
    if (!catalogContent.includes(`(${`../../.agents/skills/${directoryName}/SKILL.md`})`)) {
      failures.push(`Skill catalog is missing entry for ${directoryName}`);
    }
  }
}

const sharedRulesPath = path.join(root, ".agents", "skills", "_shared", "judgement-rules.md");
if (await exists(sharedRulesPath)) {
  const sharedRulesContent = await readFile(sharedRulesPath, "utf8");
  for (const status of requiredStatuses) {
    if (!sharedRulesContent.includes(status)) {
      failures.push(`Shared judgement rules missing status term "${status}"`);
    }
  }
  for (const severity of requiredSeverities) {
    if (!sharedRulesContent.includes(severity)) {
      failures.push(`Shared judgement rules missing severity "${severity}"`);
    }
  }
}

if (failures.length > 0) {
  console.error("Skill verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Skill verification passed for ${skillDirectories.length} skills.`);
}
