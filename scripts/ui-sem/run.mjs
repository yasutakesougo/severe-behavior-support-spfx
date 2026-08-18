#!/usr/bin/env node
/**
 * UI-AGENT-IMPL-3 runner: ESLint UI-SEM rules + SCSS hex scan (UI-SEM-04).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { checkScssRawHex } from "./plugin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const listFilesRecursive = async (relativeDir, extensions) => {
  const abs = path.join(root, relativeDir);
  const out = [];
  const walk = async (dir) => {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (extensions.some((ext) => entry.name.endsWith(ext))) {
        out.push(path.relative(root, full).split(path.sep).join("/"));
      }
    }
  };
  await walk(abs);
  return out;
};

const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: path.join(root, "eslint.ui-sem.config.mjs"),
  errorOnUnmatchedPattern: false,
});

const results = await eslint.lintFiles(["spfx/src/shell/**/*.{ts,tsx}"]);
const formatter = await eslint.loadFormatter("stylish");
const eslintOutput = formatter.format(results);
if (eslintOutput) {
  console.log(eslintOutput);
}

let eslintErrors = 0;
for (const result of results) {
  eslintErrors += result.errorCount;
}

const scssFiles = await listFilesRecursive("spfx/src/shell", [".scss"]);
const scssFindings = [];
for (const relativePath of scssFiles) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  for (const finding of checkScssRawHex(relativePath, source)) {
    scssFindings.push({ relativePath, ...finding });
  }
}

if (scssFindings.length > 0) {
  console.error("UI-SEM-04 SCSS findings:");
  for (const finding of scssFindings) {
    console.error(`- ${finding.relativePath}:${finding.line} ${finding.message}`);
  }
}

if (eslintErrors > 0 || scssFindings.length > 0) {
  process.exit(1);
}

console.log(
  `UI semantic ESLint passed. files=${results.length} scss=${scssFiles.length} rules=UI-SEM-01..05`,
);
