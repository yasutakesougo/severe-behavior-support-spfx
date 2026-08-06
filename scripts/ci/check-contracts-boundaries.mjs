import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targetDirectories = ["src/contracts", "tests/contracts"];
const supportedExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"]);

const forbiddenPatterns = [
  { label: "React dependency", pattern: /(?:from\s+["']react["']|require\(["']react["']\))/g },
  { label: "SPFx dependency", pattern: /@microsoft\/sp-[a-z0-9-]+/gi },
  { label: "PnP dependency", pattern: /@pnp\//gi },
  { label: "SharePoint REST endpoint", pattern: /\/_api\//g },
  { label: "browser global", pattern: /\b(?:window|document|localStorage|sessionStorage)\b/g },
  { label: "environment secret access", pattern: /\bprocess\.env\b/g },
  { label: "deprecated SiteId", pattern: /\b(?:SITE-MCD|SITE-MACHIDA|MCD)\b/g },
  { label: "deprecated SharePoint path", pattern: /\/sites\/sbs-machida\b/g },
  { label: "deprecated Entra group", pattern: /\bSBS-(?:MCD|MACHIDA)-[A-Z0-9-]+\b/g },
  { label: "GitHub token", pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]+\b/g },
  { label: "OpenAI-style secret", pattern: /\bsk-[A-Za-z0-9_-]{16,}\b/g },
  { label: "Bearer credential", pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/gi },
  { label: "client secret assignment", pattern: /client[_-]?secret\s*[:=]\s*["'][^"']+["']/gi },
  { label: "email address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { label: "Japanese postal code", pattern: /\b\d{3}-\d{4}\b/g },
  { label: "Japanese phone number", pattern: /(?:^|\D)0\d{1,4}-\d{1,4}-\d{3,4}(?:\D|$)/g },
];

const syntheticIdentifierPattern =
  /\b(?:OrganizationId|SiteId|UserId|Subject|ProcedureId|ProcedureVersion|RecordId|IdempotencyKey|PayloadFingerprint)\s*:\s*["']((?!synthetic-)[^"']+)["']/g;

const listFiles = async (directory) => {
  const absoluteDirectory = path.join(root, directory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(relativePath)));
      continue;
    }
    if (entry.isFile() && supportedExtensions.has(path.extname(entry.name))) files.push(relativePath);
  }

  return files;
};

const findings = [];

for (const directory of targetDirectories) {
  for (const file of await listFiles(directory)) {
    const content = await readFile(path.join(root, file), "utf8");

    for (const { label, pattern } of forbiddenPatterns) {
      pattern.lastIndex = 0;
      for (const match of content.matchAll(pattern)) {
        findings.push({ file, label, value: match[0].trim() });
      }
    }

    if (file.endsWith("fixtures.ts")) {
      syntheticIdentifierPattern.lastIndex = 0;
      for (const match of content.matchAll(syntheticIdentifierPattern)) {
        findings.push({ file, label: "non-synthetic fixture identifier", value: match[1] });
      }
    }
  }
}

if (findings.length > 0) {
  console.error("Contracts boundary inspection failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.label}: ${finding.value}`);
  }
  process.exitCode = 1;
} else {
  console.log("Contracts boundary inspection passed.");
}
