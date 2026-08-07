#!/usr/bin/env node
/**
 * Auto handoff generator.
 *
 * Collects PR state, head SHA, CI-oriented verification, findings stub, and next action
 * into a handoff-builder compatible Markdown document.
 *
 * Does not post to GitHub. Local output only.
 */
import { execFileSync } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outArgIndex = process.argv.indexOf("--out");
const outPath =
  outArgIndex >= 0
    ? process.argv[outArgIndex + 1]
    : path.join(root, "artifacts", "auto-handoff.md");

const run = (command, args, { allowFail = false } = {}) => {
  try {
    return {
      ok: true,
      stdout: execFileSync(command, args, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    };
  } catch (error) {
    if (!allowFail) {
      return {
        ok: false,
        stdout: "",
        stderr: error.stderr?.toString?.() ?? String(error),
        status: error.status ?? 1,
      };
    }
    return {
      ok: false,
      stdout: error.stdout?.toString?.().trim?.() ?? "",
      stderr: error.stderr?.toString?.() ?? String(error),
      status: error.status ?? 1,
    };
  }
};

const git = (args, options) => run("git", args, options);
const npmRun = (script) => run("npm", ["run", script], { allowFail: true });

const headSha = git(["rev-parse", "HEAD"]).stdout || "UNKNOWN";
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout || "UNKNOWN";
const mainShaResult = git(["rev-parse", "origin/main"], { allowFail: true });
const mainSha = mainShaResult.ok ? mainShaResult.stdout : "UNKNOWN";

const remote = git(["remote", "get-url", "origin"], { allowFail: true }).stdout || "";
const repoMatch = remote.match(/github\.com[:/](.+?)(?:\.git)?$/i);
const repo = repoMatch?.[1] ?? "UNKNOWN";

let prState = "UNKNOWN";
let prNumber = "NONE";
let prUrl = "NONE";
const prView = run(
  "gh",
  [
    "pr",
    "view",
    "--json",
    "number,url,state,isDraft,headRefOid,baseRefOid,title",
  ],
  { allowFail: true },
);

let prHeadOid = null;
let prTitle = null;
if (prView.ok && prView.stdout) {
  try {
    const pr = JSON.parse(prView.stdout);
    prNumber = String(pr.number ?? "NONE");
    prUrl = pr.url ?? "NONE";
    prTitle = pr.title ?? null;
    prHeadOid = pr.headRefOid ?? null;
    prState = pr.isDraft ? `DRAFT/${pr.state}` : String(pr.state ?? "UNKNOWN");
  } catch {
    prState = "PARSE_ERROR";
  }
} else {
  prState = "NO_PR_OR_GH_UNAVAILABLE";
}

const verifications = [
  ["verify:skills", npmRun("verify:skills")],
  ["typecheck", npmRun("typecheck")],
  ["test", npmRun("test")],
  ["check:contracts-boundaries", npmRun("check:contracts-boundaries")],
  ["check:scope", npmRun("check:scope")],
];

const verificationLines = verifications.map(([name, result]) => {
  const status = result.ok ? "PASS" : "FAIL";
  return `- ${name}: ${status}`;
});

const failedChecks = verifications.filter(([, result]) => !result.ok).map(([name]) => name);

const findings = [];
if (prHeadOid && prHeadOid !== headSha) {
  findings.push({
    id: "F-001",
    severity: "P1",
    status: "OPEN",
    content: "PR head SHA とローカル HEAD が不一致",
    evidence: `PR=${prHeadOid} local=${headSha}`,
    action: "同一 SHA に揃えて再検証する",
  });
}
for (const name of failedChecks) {
  findings.push({
    id: `F-${String(findings.length + 1).padStart(3, "0")}`,
    severity: "P1",
    status: "OPEN",
    content: `${name} が失敗`,
    evidence: "npm run 結果",
    action: "失敗を解消して再実行する",
  });
}

const documentJudgement =
  findings.length === 0 && headSha !== "UNKNOWN" ? "READY" : "HOLD";
const projectJudgement =
  failedChecks.length > 0 || prState.includes("NO_PR") ? "HOLD" : documentJudgement;

const nextActions = [];
if (failedChecks.length > 0) {
  nextActions.push(`失敗チェックを修正する: ${failedChecks.join(", ")}`);
}
if (prNumber === "NONE") {
  nextActions.push("必要なら Draft PR を作成する（投稿は人の事前承認）");
} else {
  nextActions.push("merge-audit / release-review が必要か判断する（実行は承認後）");
}
nextActions.push("merge / deploy / SharePoint変更は行わない");

const findingsTable =
  findings.length === 0
    ? "| — | — | — | なし |  |  |"
    : findings
        .map(
          (finding) =>
            `| ${finding.id} | ${finding.severity} | ${finding.status} | ${finding.content} | ${finding.evidence} | ${finding.action} |`,
        )
        .join("\n");

const markdown = `# handoff-builder

## Summary
- 引き継ぎ文書判定: ${documentJudgement}
- プロジェクト進行判定: ${projectJudgement}
- 対象リポジトリ: ${repo}
- main SHA: ${mainSha}
- 作業ブランチ SHA: ${headSha}
- 作業ブランチ: ${branch}

## References
- Issue: （入力があれば追記）
- PR: ${prNumber === "NONE" ? "なし" : `#${prNumber} (${prState}) ${prUrl}`}
- PR title: ${prTitle ?? "なし"}
- 正本リンク: docs/process/background-agent-contract.md

## Completed
- 完了事項: auto-handoff が PR状態 / head SHA / CI / findings / next action を収集

## Remaining
- 未完了事項: ${failedChecks.length > 0 ? "検証失敗の解消" : "人によるレビュー・承認判断"}

## HOLD
- ${findings.length > 0 ? findings.map((f) => f.content).join(" / ") : "なし（文書判定）"}
- merge 承認は未実施（自動実行しない）

## Forbidden Actions
- merge
- push（保護ブランチ / 承認外）
- deploy
- 本番変更
- SharePoint変更
- Microsoft 365変更
- Entra ID変更
- 本番データ変更
- 物理削除

## Verification
${verificationLines.join("\n")}

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
${findingsTable}

## Next Actions
${nextActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}
`;

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${markdown}\n`, "utf8");
console.log(`Wrote auto handoff: ${outPath}`);
console.log(`documentJudgement=${documentJudgement} projectJudgement=${projectJudgement}`);
if (failedChecks.length > 0) {
  process.exitCode = 1;
}
