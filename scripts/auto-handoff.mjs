#!/usr/bin/env node
/**
 * Auto handoff generator.
 *
 * Collects PR state, head SHA, CI-oriented verification, findings stub, and next action
 * into a handoff-builder compatible Markdown document.
 *
 * Does not post to GitHub. Local output only.
 *
 * Judgement rules (aligned with handoff-builder):
 * - Document READY only when SHA / Issue / PR / verification evidence are present and
 *   there are no OPEN findings from checks or SHA mismatch.
 * - Project READY only when document is READY, PR is not draft, checks passed, and
 *   merge approval is explicitly attested (HANDOFF_MERGE_APPROVED=1).
 * - Never maps failed checks or missing evidence to PASS.
 * - Verification lines use PASS/FAIL for command results only; Skill/Gate PASS is not implied.
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

let prState;
let prNumber = "NONE";
let prUrl = "NONE";
let prBody = "";
const prView = run(
  "gh",
  ["pr", "view", "--json", "number,url,state,isDraft,headRefOid,baseRefOid,title,body"],
  { allowFail: true },
);

let prHeadOid = null;
let prTitle = null;
let isDraft = false;
if (prView.ok && prView.stdout) {
  try {
    const pr = JSON.parse(prView.stdout);
    prNumber = String(pr.number ?? "NONE");
    prUrl = pr.url ?? "NONE";
    prTitle = pr.title ?? null;
    prHeadOid = pr.headRefOid ?? null;
    prBody = pr.body ?? "";
    isDraft = Boolean(pr.isDraft);
    prState = isDraft ? `DRAFT/${pr.state}` : String(pr.state ?? "UNKNOWN");
  } catch {
    prState = "PARSE_ERROR";
  }
} else {
  prState = "NO_PR_OR_GH_UNAVAILABLE";
}

const issueFromEnv = (process.env.HANDOFF_ISSUE || "").trim();
const issueFromBody =
  prBody.match(/\b(?:Closes|Close|Fixes|Fix|Resolves|Resolve)\s+#(\d+)\b/i)?.[1] ?? null;
const issueRef = issueFromEnv || (issueFromBody ? `#${issueFromBody}` : "");
const mergeApproved = process.env.HANDOFF_MERGE_APPROVED === "1";
const readyApproved = process.env.HANDOFF_READY_APPROVED === "1";

const verifications = [
  ["verify:skills", npmRun("verify:skills")],
  ["verify:ui-catalog", npmRun("verify:ui-catalog")],
  ["verify:ui-templates", npmRun("verify:ui-templates")],
  ["lint:ui-sem", npmRun("lint:ui-sem")],
  ["lint", npmRun("lint")],
  ["format:check", npmRun("format:check")],
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

const missingDocumentEvidence = [];
if (headSha === "UNKNOWN") {
  missingDocumentEvidence.push("作業ブランチ SHA 不明");
}
if (prNumber === "NONE" || prState.includes("NO_PR") || prState === "PARSE_ERROR") {
  missingDocumentEvidence.push("PR 未特定");
}
if (!issueRef) {
  missingDocumentEvidence.push("Issue 未特定");
}
for (const item of missingDocumentEvidence) {
  findings.push({
    id: `F-${String(findings.length + 1).padStart(3, "0")}`,
    severity: "P1",
    status: "OPEN",
    content: item,
    evidence: "handoff-builder READY 条件",
    action: item.includes("Issue")
      ? "HANDOFF_ISSUE を設定するか PR 本文に Closes #N を書く"
      : "不足証跡を揃える",
  });
}

const documentJudgement = findings.length === 0 ? "READY" : "HOLD";

const projectHoldReasons = [];
if (documentJudgement === "HOLD") {
  projectHoldReasons.push("引き継ぎ文書判定が HOLD");
}
if (failedChecks.length > 0) {
  projectHoldReasons.push(`検証失敗: ${failedChecks.join(", ")}`);
}
if (prState.includes("NO_PR") || prNumber === "NONE") {
  projectHoldReasons.push("PR なし");
}
if (isDraft || prState.startsWith("DRAFT/")) {
  projectHoldReasons.push("Draft 維持（Ready 化未承認）");
}
if (!readyApproved) {
  projectHoldReasons.push("Ready 化承認未取得");
}
if (!mergeApproved) {
  projectHoldReasons.push("merge 承認未取得");
}

const projectJudgement = projectHoldReasons.length === 0 ? "READY" : "HOLD";

const nextActions = [];
if (failedChecks.length > 0) {
  nextActions.push(`失敗チェックを修正する: ${failedChecks.join(", ")}`);
}
if (!issueRef) {
  nextActions.push("Issue を特定する（HANDOFF_ISSUE または Closes #N）");
}
if (prNumber === "NONE") {
  nextActions.push("必要なら Draft PR を作成する（投稿は人の事前承認）");
} else if (isDraft) {
  nextActions.push("同一 head の独立レビュー後、Ready 化は人の事前承認で判断する");
} else {
  nextActions.push("merge-audit 結果を確認し、merge は人の事前承認後のみ");
}
nextActions.push("merge / deploy / SharePoint変更は行わない");

const holdLines = [];
if (findings.length > 0) {
  holdLines.push(...findings.map((finding) => finding.content));
}
if (projectHoldReasons.length > 0) {
  holdLines.push(...projectHoldReasons);
}
const uniqueHoldLines = [...new Set(holdLines)];

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
- Issue: ${issueRef || "未特定"}
- PR: ${prNumber === "NONE" ? "なし" : `#${prNumber} (${prState}) ${prUrl}`}
- PR title: ${prTitle ?? "なし"}
- 正本リンク: docs/process/background-agent-contract.md

## Completed
- 完了事項: auto-handoff が PR状態 / head SHA / CI / findings / next action を収集

## Remaining
- 未完了事項: ${
  failedChecks.length > 0
    ? "検証失敗の解消"
    : projectJudgement === "HOLD"
      ? "人によるレビュー・Ready/Merge 承認判断"
      : "なし"
}

## HOLD
${uniqueHoldLines.length > 0 ? uniqueHoldLines.map((line) => `- ${line}`).join("\n") : "- なし"}

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
- note: Verification の PASS/FAIL はコマンド成否のみ。Gate PASS / Ready 化 / Merge 承認を意味しない

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
