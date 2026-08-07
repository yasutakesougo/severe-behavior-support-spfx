#!/usr/bin/env node
/**
 * Scope check for CI / local verification.
 *
 * Evidence-oriented: prints changed files and fails on forbidden paths.
 * Optional allowlist via SCOPE_ALLOWLIST (comma-separated path prefixes).
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const forbiddenPathPatterns = [
  /(^|\/)\.env(\.|$)/i,
  /(^|\/)secrets?\//i,
  /\.pem$/i,
  /\.p12$/i,
  /\.key$/i,
  /(^|\/)id_rsa$/i,
  /sharepoint\.config\./i,
  /appcatalog/i,
];

const forbiddenContentHints = [
  { label: "GitHub PAT", regex: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/ },
  { label: "OpenAI-like key", regex: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { label: "Private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

const git = (args, { quiet = false } = {}) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", quiet ? "pipe" : "pipe"],
  }).trim();

const resolveRange = () => {
  if (process.env.SCOPE_BASE && process.env.SCOPE_HEAD) {
    return `${process.env.SCOPE_BASE}...${process.env.SCOPE_HEAD}`;
  }
  if (process.env.GITHUB_EVENT_NAME === "pull_request") {
    const base = process.env.GITHUB_BASE_SHA || process.env.PR_BASE_SHA;
    const head = process.env.GITHUB_HEAD_SHA || process.env.PR_HEAD_SHA;
    if (base && head) {
      return `${base}...${head}`;
    }
  }
  try {
    const upstream = execFileSync("git", ["rev-parse", "--abbrev-ref", "@{upstream}"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (upstream) {
      return `${upstream}...HEAD`;
    }
  } catch {
    // no upstream
  }
  try {
    const main = git(["merge-base", "HEAD", "origin/main"]);
    return `${main}...HEAD`;
  } catch {
    return null;
  }
};

const range = resolveRange();
if (!range) {
  console.error("Scope check failed: could not resolve diff range");
  process.exitCode = 1;
  process.exit();
}

const changedSet = new Set(
  git(["diff", "--name-only", range])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
);

const includeWorktree =
  process.env.SCOPE_INCLUDE_WORKTREE === "1" ||
  (!process.env.GITHUB_ACTIONS && process.env.SCOPE_INCLUDE_WORKTREE !== "0");

if (includeWorktree) {
  for (const args of [["diff", "--name-only"], ["diff", "--name-only", "--cached"]]) {
    for (const file of git(args)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)) {
      changedSet.add(file);
    }
  }
  try {
    for (const file of git(["ls-files", "--others", "--exclude-standard"])
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)) {
      changedSet.add(file);
    }
  } catch {
    // ignore
  }
}

const changed = [...changedSet].sort();

console.log(`Scope check range: ${range}`);
console.log(`Changed files (${changed.length}):`);
for (const file of changed) {
  console.log(`- ${file}`);
}

const failures = [];

const allowlist = (process.env.SCOPE_ALLOWLIST || "")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

if (allowlist.length > 0) {
  for (const file of changed) {
    const posix = file.split(path.sep).join("/");
    const allowed = allowlist.some(
      (prefix) => posix === prefix || posix.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`) || posix.startsWith(prefix),
    );
    if (!allowed) {
      failures.push(`File outside SCOPE_ALLOWLIST: ${posix}`);
    }
  }
}

for (const file of changed) {
  const posix = file.split(path.sep).join("/");
  for (const pattern of forbiddenPathPatterns) {
    if (pattern.test(posix)) {
      failures.push(`Forbidden path changed: ${posix}`);
    }
  }
}

for (const file of changed) {
  let content = "";
  try {
    content = readFileSync(path.join(root, file), "utf8");
  } catch {
    try {
      content = git(["show", `${range.split("...")[1] || "HEAD"}:${file}`]);
    } catch {
      try {
        content = git(["show", `HEAD:${file}`]);
      } catch {
        continue;
      }
    }
  }
  for (const { label, regex } of forbiddenContentHints) {
    regex.lastIndex = 0;
    if (regex.test(content)) {
      failures.push(`Forbidden content hint (${label}) in ${file}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Scope check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Scope check passed.");
}
