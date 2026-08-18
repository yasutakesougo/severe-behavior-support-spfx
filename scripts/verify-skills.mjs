import { access, readdir, readFile, stat } from "node:fs/promises";
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

const expectedAgents = ["requirements", "architecture", "implementation", "review", "audit"];
const expectedLogicalCommands = ["new-feature", "review-pr", "audit", "release-check"];
const expectedInstalledSkills = [
  "requirements-review",
  "decision-review",
  "domain-design",
  "sharepoint-design",
  "schema-design",
  "architecture-review",
  "design-context",
  "design-review",
  "implementation-plan",
  "implementation-review",
  "contracts-review",
  "test-review",
  "severe-behavior-cycle-review",
  "merge-audit",
  "release-review",
  "handoff-builder",
  "project-status",
];
const expectedToolAdapters = ["cursor-agent", "cursor-cli", "codex"];
const handoffBuilderOwnerAgent = "audit";

const requiredProcessFiles = [
  "docs/process/development-process.md",
  "docs/process/gate-definitions.md",
  "docs/process/skill-catalog.md",
  "docs/process/skill-migration-ledger.md",
  "docs/process/ai-role.md",
  "docs/process/ai-governance.md",
  "docs/process/ai-workflow.md",
  "docs/process/background-agent-contract.md",
  ".agents/skills/_shared/judgement-rules.md",
  ".agents/skills/_shared/output-format.md",
  ".agents/commands/adapter-matrix.md",
  ".agents/mcp/permission-matrix.md",
  "scripts/ci/check-scope.mjs",
  "scripts/auto-handoff.mjs",
  ...expectedAgents.map((name) => `.agents/agents/${name}.md`),
  ...expectedLogicalCommands.map((name) => `.agents/commands/${name}.md`),
  ...expectedToolAdapters.map((name) => `.agents/commands/adapters/${name}.md`),
];

/** Files allowed to mention legacy `skills/` paths for migration / history only. */
const legacySkillsMentionAllowlist = new Set([
  "docs/process/skill-catalog.md",
  "docs/process/skill-migration-ledger.md",
  "docs/process/ai-org-onboarding-implementation-plan.md",
  "docs/decisions/ADR-AI-ORG-001.md",
  "scripts/verify-skills.mjs",
]);

/** Directories scanned for forbidden legacy execution references. */
const legacyScanRoots = [
  ".agents/agents",
  ".agents/commands",
  ".agents/mcp",
  ".agents/skills",
  "docs/process",
];

const approvalBoundaryRequiredPhrases = {
  ".agents/mcp/permission-matrix.md": ["人の事前承認", "禁止", "Fail Closed", "マージ", "deploy"],
  "docs/process/ai-governance.md": ["Fresh Review PASS なし Merge 禁止", "人の事前承認"],
  ".agents/agents/audit.md": ["Fresh Review PASS なし Merge", "マージ"],
};

const secretLikePatterns = [
  { name: "GitHub PAT", regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g },
  { name: "GitHub fine-grained PAT", regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { name: "OpenAI-like key", regex: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "AWS access key id", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  {
    name: "Assigned secret-like value",
    regex:
      /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|passwd|secret|credential)\b\s*[:=]\s*['"`]?[^\s'"`]{12,}/gi,
  },
  {
    name: "SharePoint / Entra site or tenant URL with value",
    regex: /https?:\/\/[a-z0-9-]+\.(?:sharepoint\.com|microsoftonline\.com)\/[^\s)`"']+/gi,
  },
];

const secretScanTargets = [
  ".agents",
  "docs/process",
  "docs/decisions/DEC-AI-ORG-001.md",
  "docs/decisions/DEC-AI-ORG-002.md",
  "docs/decisions/DEC-AI-ORG-003.md",
  "docs/decisions/ADR-AI-ORG-001.md",
  "scripts/verify-skills.mjs",
];

const failures = [];

const toPosix = (relativePath) => relativePath.split(path.sep).join("/");

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readText = async (absolutePath) => readFile(absolutePath, "utf8");

const getSectionContent = (content, heading) => {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sectionPattern = new RegExp(`^${escapedHeading}\\n([\\s\\S]*?)(?=^##\\s|\\Z)`, "m");
  return content.match(sectionPattern)?.[1] ?? "";
};

const listMarkdownFilesRecursive = async (relativeDir) => {
  const absoluteDir = path.join(root, relativeDir);
  if (!(await exists(absoluteDir))) {
    return [];
  }

  const results = [];
  const walk = async (currentAbsolute, currentRelative) => {
    const entries = await readdir(currentAbsolute, { withFileTypes: true });
    for (const entry of entries) {
      const nextAbsolute = path.join(currentAbsolute, entry.name);
      const nextRelative = toPosix(path.join(currentRelative, entry.name));
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") {
          continue;
        }
        await walk(nextAbsolute, nextRelative);
        continue;
      }
      if (entry.isFile() && /\.(md|mjs|json|ya?ml|txt)$/i.test(entry.name)) {
        results.push(nextRelative);
      }
    }
  };

  const dirStat = await stat(absoluteDir);
  if (dirStat.isFile()) {
    return [toPosix(relativeDir)];
  }

  await walk(absoluteDir, relativeDir);
  return results.sort();
};

const readMarkdownDirectories = async () => {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== sharedDirectoryName)
    .map((entry) => entry.name)
    .sort();
};

const listMarkdownBasenames = async (relativeDir, { exclude = [] } = {}) => {
  const absoluteDir = path.join(root, relativeDir);
  if (!(await exists(absoluteDir))) {
    return [];
  }
  const excluded = new Set(exclude);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !excluded.has(entry.name))
    .map((entry) => entry.name.replace(/\.md$/, ""))
    .sort();
};

const assertExactSet = (label, actualValues, expectedValues) => {
  const actual = [...new Set(actualValues)].sort();
  const expected = [...new Set(expectedValues)].sort();
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);

  for (const value of expected) {
    if (!actualSet.has(value)) {
      failures.push(`${label}: missing expected entry "${value}"`);
    }
  }
  for (const value of actual) {
    if (!expectedSet.has(value)) {
      failures.push(`${label}: unexpected extra entry "${value}"`);
    }
  }
};

const extractMarkdownLinks = (content) =>
  [...content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => match[1].trim())
    .filter((link) => link && !link.startsWith("#") && !/^[a-z]+:/i.test(link));

const parseCatalogInstalledSkills = (catalogContent) => {
  const installed = [];
  for (const line of catalogContent.split("\n")) {
    if (!line.includes("|") || !line.includes("導入済み")) {
      continue;
    }
    if (/^\|\s*-+\s*\|/.test(line) || line.includes("正式Skill名")) {
      continue;
    }
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);
    if (cells.length < 3) {
      continue;
    }
    const statusIndex = cells.findIndex((cell) => cell === "導入済み");
    if (statusIndex < 1) {
      continue;
    }
    const nameCell = cells[0];
    const agentCell = cells[statusIndex + 1] ?? "";
    const name =
      nameCell.match(/\[`?([^\]`]+)`?\]/)?.[1]?.trim() ?? nameCell.replace(/`/g, "").trim();
    if (!name || name === "正式Skill名") {
      continue;
    }
    installed.push({
      name,
      agent: agentCell.replace(/\*\*/g, "").trim(),
      line: line.trim(),
    });
  }
  return installed;
};

const findInstalledSkillRowsInAgent = (agentContent, skillName) => {
  const rows = [];
  for (const line of agentContent.split("\n")) {
    if (!line.includes("|") || !line.includes(skillName) || !line.includes("導入済み")) {
      continue;
    }
    rows.push(line.trim());
  }
  return rows;
};

const hasUnsafeAutoMergeOrDeployLanguage = (content, relativePath) => {
  const normalized = content.replace(/\s+/g, " ");
  const unsafePatterns = [
    /AI単独[^\n|]{0,40}(?:マージ|merge|deploy|Ready\s*化)/i,
    /(?:マージ|merge|deploy|Ready\s*化)[^\n|]{0,40}AI単独/i,
    /自動(?:で)?(?:マージ|merge|deploy)/i,
    /(?:マージ|merge|deploy)を(?:自動実行|AIが単独で実施)/i,
  ];

  // Negation / prohibition statements are allowed.
  const isNegated = (snippet) =>
    /(?:しない|禁止|認めない|不可|必須|人の事前承認|自動実行しない|含めない)/.test(snippet);

  for (const pattern of unsafePatterns) {
    const matches = normalized.matchAll(new RegExp(pattern.source, pattern.flags + "g"));
    for (const match of matches) {
      const start = Math.max(0, match.index - 40);
      const end = Math.min(normalized.length, match.index + match[0].length + 40);
      const window = normalized.slice(start, end);
      if (!isNegated(window)) {
        failures.push(
          `Unapproved merge/deploy permission language in ${relativePath}: "${match[0].trim()}"`,
        );
      }
    }
  }
};

for (const relativePath of requiredProcessFiles) {
  if (!(await exists(path.join(root, relativePath)))) {
    failures.push(`Missing required process file: ${relativePath}`);
  }
}

const skillDirectories = await readMarkdownDirectories();
const skillNames = new Map();

assertExactSet(
  "Installed skill directories (.agents/skills, excluding _shared)",
  skillDirectories,
  expectedInstalledSkills,
);

const actualAgents = await listMarkdownBasenames(".agents/agents");
assertExactSet("Agents (.agents/agents)", actualAgents, expectedAgents);

const actualLogicalCommands = await listMarkdownBasenames(".agents/commands", {
  exclude: ["adapter-matrix.md"],
});
assertExactSet(
  "Logical Commands (.agents/commands, excluding adapter-matrix.md)",
  actualLogicalCommands,
  expectedLogicalCommands,
);

for (const directoryName of skillDirectories) {
  const skillFileRelativePath = path.join(".agents", "skills", directoryName, "SKILL.md");
  const skillFileAbsolutePath = path.join(root, skillFileRelativePath);

  if (!(await exists(skillFileAbsolutePath))) {
    failures.push(`Missing SKILL.md: ${skillFileRelativePath}`);
    continue;
  }

  const content = await readText(skillFileAbsolutePath);
  const declaredName = content.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (!declaredName) {
    failures.push(`Missing skill title heading in ${skillFileRelativePath}`);
  } else if (skillNames.has(declaredName)) {
    failures.push(
      `Duplicate skill title "${declaredName}" in ${skillFileRelativePath} and ${skillNames.get(declaredName)}`,
    );
  } else {
    skillNames.set(declaredName, skillFileRelativePath);
  }

  if (declaredName && declaredName !== directoryName) {
    failures.push(
      `Skill title "${declaredName}" does not match directory name "${directoryName}" in ${skillFileRelativePath}`,
    );
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

  const hasAllSeverityReferences = requiredSeverities.every((severity) =>
    content.includes(severity),
  );
  if (!hasAllSeverityReferences) {
    failures.push(`Missing severity reference (P0/P1/P2) in ${skillFileRelativePath}`);
  }

  const forbiddenSection = getSectionContent(content, "## 禁止事項");
  if (!forbiddenSection.trim()) {
    failures.push(`Missing forbidden section content in ${skillFileRelativePath}`);
  }
  for (const operation of forbiddenOperations) {
    if (!forbiddenSection.includes(operation)) {
      failures.push(
        `Missing forbidden operation reference "${operation}" in ${skillFileRelativePath}`,
      );
    }
  }
}

const catalogRelativePath = "docs/process/skill-catalog.md";
const catalogAbsolutePath = path.join(root, catalogRelativePath);
let catalogInstalledSkills = [];

if (await exists(catalogAbsolutePath)) {
  const catalogContent = await readText(catalogAbsolutePath);
  const catalogSkillLinks = [...catalogContent.matchAll(/\[[^\]]+\]\(([^)]+SKILL\.md)\)/g)].map(
    (match) => match[1],
  );
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

  catalogInstalledSkills = parseCatalogInstalledSkills(catalogContent);
  const catalogInstalledNames = catalogInstalledSkills.map((entry) => entry.name);

  assertExactSet("Skill catalog 導入済み set", catalogInstalledNames, expectedInstalledSkills);

  for (const entry of catalogInstalledSkills) {
    const skillPath = path.join(root, ".agents", "skills", entry.name, "SKILL.md");
    if (!(await exists(skillPath))) {
      failures.push(
        `Catalog marks non-existent skill as 導入済み: ${entry.name} (expected .agents/skills/${entry.name}/SKILL.md)`,
      );
    }
  }

  const handoffEntries = catalogInstalledSkills.filter((entry) => entry.name === "handoff-builder");
  if (handoffEntries.length === 0) {
    failures.push("Skill catalog is missing 導入済み entry for handoff-builder");
  } else {
    for (const entry of handoffEntries) {
      if (!entry.agent.includes("Audit")) {
        failures.push(
          `handoff-builder Audit ownership broken in catalog: agent cell is "${entry.agent}"`,
        );
      }
    }
  }

  if (!catalogContent.includes("docs/process/skill-migration-ledger.md")) {
    failures.push("Skill catalog is missing reference to skill-migration-ledger.md");
  }
}

const ledgerRelativePath = "docs/process/skill-migration-ledger.md";
const ledgerAbsolutePath = path.join(root, ledgerRelativePath);
if (await exists(ledgerAbsolutePath)) {
  const ledgerContent = await readText(ledgerAbsolutePath);
  for (const requiredPhrase of [
    "参照専用",
    "移行済み",
    "skills/requirements-review/",
    "skills/design-review/",
    "新規 Skill 作成は禁止",
    ".agents/skills/",
  ]) {
    if (!ledgerContent.includes(requiredPhrase)) {
      failures.push(`Skill migration ledger missing required phrase: ${requiredPhrase}`);
    }
  }
}

for (const agentName of expectedAgents) {
  const relativePath = `.agents/agents/${agentName}.md`;
  const absolutePath = path.join(root, relativePath);
  if (!(await exists(absolutePath))) {
    continue;
  }
  const content = await readText(absolutePath);
  if (!content.includes(`.agents/agents/${agentName}.md`)) {
    failures.push(`Agent file missing self path reference: ${relativePath}`);
  }
  if (!content.includes("DEC-AI-ORG-003") && !content.includes("DEC-AI-ORG-3")) {
    failures.push(`Agent file missing DEC-AI-ORG-3 reference: ${relativePath}`);
  }

  const handoffRows = findInstalledSkillRowsInAgent(content, "handoff-builder");
  if (agentName === handoffBuilderOwnerAgent) {
    if (handoffRows.length === 0) {
      failures.push("handoff-builder Audit ownership broken: audit agent missing 導入済み row");
    }
  } else if (handoffRows.length > 0) {
    failures.push(
      `handoff-builder Audit ownership broken: ${relativePath} lists handoff-builder as 導入済み`,
    );
  }
}

for (const commandName of expectedLogicalCommands) {
  const relativePath = `.agents/commands/${commandName}.md`;
  const absolutePath = path.join(root, relativePath);
  if (!(await exists(absolutePath))) {
    continue;
  }
  const content = await readText(absolutePath);
  if (!content.includes("Logical Command")) {
    failures.push(`Logical Command file missing title marker: ${relativePath}`);
  }
  if (!content.includes(".agents/commands/adapter-matrix.md")) {
    failures.push(`Logical Command missing adapter-matrix reference: ${relativePath}`);
  }
  if (!content.includes("自動実行しない") && !content.includes("自動実行")) {
    failures.push(`Logical Command missing auto-execution boundary section: ${relativePath}`);
  }
}

const adapterRelativePath = ".agents/commands/adapter-matrix.md";
const adapterAbsolutePath = path.join(root, adapterRelativePath);
if (await exists(adapterAbsolutePath)) {
  const adapterContent = await readText(adapterAbsolutePath);
  for (const commandName of expectedLogicalCommands) {
    if (!adapterContent.includes(`\`${commandName}\``)) {
      failures.push(`Adapter matrix missing Logical Command: ${commandName}`);
    }
    if (!adapterContent.includes(`.agents/commands/${commandName}.md`)) {
      failures.push(`Adapter matrix missing command path for: ${commandName}`);
    }
  }
  for (const phrase of [
    "Skill Fallback",
    "マージ",
    "deploy",
    "Cursor Agent",
    "Cursor CLI",
    "Codex",
  ]) {
    if (!adapterContent.includes(phrase)) {
      failures.push(`Adapter matrix missing required phrase: ${phrase}`);
    }
  }
  for (const adapterName of expectedToolAdapters) {
    if (!adapterContent.includes(`.agents/commands/adapters/${adapterName}.md`)) {
      failures.push(`Adapter matrix missing tool adapter path: ${adapterName}`);
    }
  }
}

const actualToolAdapters = await listMarkdownBasenames(".agents/commands/adapters");
assertExactSet(
  "Tool Adapters (.agents/commands/adapters)",
  actualToolAdapters,
  expectedToolAdapters,
);

for (const adapterName of expectedToolAdapters) {
  const relativePath = `.agents/commands/adapters/${adapterName}.md`;
  const absolutePath = path.join(root, relativePath);
  if (!(await exists(absolutePath))) {
    continue;
  }
  const content = await readText(absolutePath);
  for (const phrase of ["入力契約", "出力契約", "Evidence", "停止条件", "自動実行しないもの"]) {
    if (!content.includes(phrase)) {
      failures.push(`Tool adapter missing required section phrase "${phrase}" in ${relativePath}`);
    }
  }
  hasUnsafeAutoMergeOrDeployLanguage(content, relativePath);
}

const backgroundContractRelativePath = "docs/process/background-agent-contract.md";
const backgroundContractAbsolutePath = path.join(root, backgroundContractRelativePath);
if (await exists(backgroundContractAbsolutePath)) {
  const content = await readText(backgroundContractAbsolutePath);
  for (const phrase of [
    "## 入力",
    "## 出力",
    "## Evidence",
    "## 停止条件",
    "PR 状態",
    "head SHA",
    "findings",
    "next action",
  ]) {
    if (!content.includes(phrase)) {
      failures.push(`Background agent contract missing required phrase: ${phrase}`);
    }
  }
  hasUnsafeAutoMergeOrDeployLanguage(content, backgroundContractRelativePath);
}

const packageJsonRelativePath = "package.json";
const packageJsonAbsolutePath = path.join(root, packageJsonRelativePath);
if (await exists(packageJsonAbsolutePath)) {
  const packageJson = JSON.parse(await readText(packageJsonAbsolutePath));
  const scripts = packageJson.scripts ?? {};
  for (const scriptName of [
    "verify:skills",
    "verify:ui-catalog",
    "typecheck",
    "test",
    "check:contracts-boundaries",
    "check:scope",
    "handoff:auto",
    "verify:ci",
  ]) {
    if (!scripts[scriptName]) {
      failures.push(`package.json missing script: ${scriptName}`);
    }
  }
}

const workflowRelativePath = ".github/workflows/contracts-ci.yml";
const workflowAbsolutePath = path.join(root, workflowRelativePath);
if (await exists(workflowAbsolutePath)) {
  const workflowContent = await readText(workflowAbsolutePath);
  for (const phrase of [
    "npm run verify:skills",
    "npm run verify:ui-catalog",
    "npm run typecheck",
    "npm test",
    "npm run check:contracts-boundaries",
    "npm run check:scope",
  ]) {
    if (!workflowContent.includes(phrase)) {
      failures.push(`CI workflow missing step command: ${phrase}`);
    }
  }
}

const permissionRelativePath = ".agents/mcp/permission-matrix.md";
const permissionAbsolutePath = path.join(root, permissionRelativePath);
if (await exists(permissionAbsolutePath)) {
  const permissionContent = await readText(permissionAbsolutePath);
  for (const phrase of [
    "AI単独",
    "人の事前承認",
    "禁止",
    "Fail Closed",
    "DEC-AI-ORG-003.md",
    "MCP 接続・認証・OAuth・コネクタ設定を行わない",
  ]) {
    if (!permissionContent.includes(phrase)) {
      failures.push(`MCP permission matrix missing required phrase: ${phrase}`);
    }
  }

  const mergeRow = permissionContent
    .split("\n")
    .find((line) => line.includes("|") && /^\|\s*マージ\s*\|/.test(line));
  if (!mergeRow) {
    failures.push("MCP permission matrix missing マージ operation row");
  } else if (!mergeRow.includes("人の事前承認")) {
    failures.push("MCP permission matrix must classify マージ as 人の事前承認");
  }

  const productionDeployRow = permissionContent
    .split("\n")
    .find((line) => line.includes("|") && line.includes("本番環境への deploy"));
  if (!productionDeployRow) {
    failures.push("MCP permission matrix missing 本番環境への deploy row");
  } else if (!productionDeployRow.includes("禁止")) {
    failures.push("MCP permission matrix must classify 本番環境への deploy as 禁止");
  }
}

for (const [relativePath, phrases] of Object.entries(approvalBoundaryRequiredPhrases)) {
  const absolutePath = path.join(root, relativePath);
  if (!(await exists(absolutePath))) {
    continue;
  }
  const content = await readText(absolutePath);
  for (const phrase of phrases) {
    if (!content.includes(phrase)) {
      failures.push(`Approval boundary phrase missing in ${relativePath}: ${phrase}`);
    }
  }
  hasUnsafeAutoMergeOrDeployLanguage(content, relativePath);
}

for (const commandName of expectedLogicalCommands) {
  const relativePath = `.agents/commands/${commandName}.md`;
  const absolutePath = path.join(root, relativePath);
  if (await exists(absolutePath)) {
    hasUnsafeAutoMergeOrDeployLanguage(await readText(absolutePath), relativePath);
  }
}

for (const agentName of expectedAgents) {
  const relativePath = `.agents/agents/${agentName}.md`;
  const absolutePath = path.join(root, relativePath);
  if (await exists(absolutePath)) {
    hasUnsafeAutoMergeOrDeployLanguage(await readText(absolutePath), relativePath);
  }
}

const sharedRulesPath = path.join(root, ".agents", "skills", "_shared", "judgement-rules.md");
if (await exists(sharedRulesPath)) {
  const sharedRulesContent = await readText(sharedRulesPath);
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

const canonicalReferenceFiles = [
  "docs/process/ai-role.md",
  "docs/process/ai-governance.md",
  "docs/process/ai-workflow.md",
  "docs/process/skill-catalog.md",
  "docs/process/skill-migration-ledger.md",
  ".agents/commands/adapter-matrix.md",
  ".agents/mcp/permission-matrix.md",
  ...expectedAgents.map((name) => `.agents/agents/${name}.md`),
  ...expectedLogicalCommands.map((name) => `.agents/commands/${name}.md`),
];

for (const relativePath of canonicalReferenceFiles) {
  const absolutePath = path.join(root, relativePath);
  if (!(await exists(absolutePath))) {
    continue;
  }
  const content = await readText(absolutePath);
  for (const link of extractMarkdownLinks(content)) {
    const resolvedPath = path.resolve(path.dirname(absolutePath), link.split("#")[0]);
    if (!(await exists(resolvedPath))) {
      failures.push(`Broken canonical reference in ${relativePath}: ${link}`);
    }
  }
}

const legacyPathPattern = /(?<!\.agents\/)skills\/[A-Za-z0-9_-]+/g;
for (const scanRoot of legacyScanRoots) {
  const files = await listMarkdownFilesRecursive(scanRoot);
  for (const relativePath of files) {
    if (legacySkillsMentionAllowlist.has(relativePath)) {
      continue;
    }
    if (relativePath.endsWith("/sample-output.md")) {
      continue;
    }
    const content = await readText(path.join(root, relativePath));
    const matches = content.match(legacyPathPattern) ?? [];
    for (const match of matches) {
      failures.push(`Forbidden legacy skills/ execution reference in ${relativePath}: ${match}`);
    }
  }
}

for (const scanTarget of secretScanTargets) {
  const files = await listMarkdownFilesRecursive(scanTarget);
  for (const relativePath of files) {
    const content = await readText(path.join(root, relativePath));
    for (const { name, regex } of secretLikePatterns) {
      regex.lastIndex = 0;
      const matches = content.match(regex) ?? [];
      for (const match of matches) {
        // Allow documentation that only names the forbidden field without assigning a value.
        if (
          name === "Assigned secret-like value" &&
          /(?:記録しない|含めない|記載しない|行わない|禁止|しない)/.test(
            content.slice(
              Math.max(0, content.indexOf(match) - 80),
              content.indexOf(match) + match.length + 80,
            ),
          )
        ) {
          continue;
        }
        failures.push(
          `Possible credential/secret literal in ${relativePath} (${name}): ${match.slice(0, 48)}`,
        );
      }
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
  console.log(
    [
      "Skill verification passed.",
      `skills=${skillDirectories.length}`,
      `agents=${expectedAgents.length}`,
      `commands=${expectedLogicalCommands.length}`,
      `catalogInstalled=${catalogInstalledSkills.length}`,
    ].join(" "),
  );
}
