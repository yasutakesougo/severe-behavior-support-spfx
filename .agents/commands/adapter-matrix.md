# Adapter Matrix

- 文書: `.agents/commands/adapter-matrix.md`
- 位置づけ: Logical Command とツール別 Adapter の対応表
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-6
- 正本: Logical Command（`.agents/commands/*.md`）。本表は Adapter 対応のみ
- Background Agent 契約: `docs/process/background-agent-contract.md`

## 原則

- 正本は Logical Command 名（スラッシュなし）とする
- ツール別の `/command` 文字列や Rule は Adapter とする
- Adapter が未整備でも、Logical Command 定義と Skill Fallback で工程を進められる
- 特定ツールの必須化はしない
- Tool Adapter 実体は `.agents/commands/adapters/` に置く

## 対応表

| Logical Command | 正本 | 起動 Agent | Codex Adapter | Cursor Agent Adapter | Cursor CLI Adapter | Skill Fallback |
|---|---|---|---|---|---|---|
| `new-feature` | `.agents/commands/new-feature.md` | Requirements | `/new-feature`（`.agents/commands/adapters/codex.md`） | `.agents/commands/adapters/cursor-agent.md` | `.agents/commands/adapters/cursor-cli.md` | `requirements-review` / `decision-review` |
| `review-pr` | `.agents/commands/review-pr.md` | Review（→ Audit） | `/review-pr`（`.agents/commands/adapters/codex.md`） | `.agents/commands/adapters/cursor-agent.md` | `.agents/commands/adapters/cursor-cli.md` | `implementation-review` / `contracts-review` / `test-review` / UI 差分時 `design-review` / 必要時 `merge-audit` |
| `audit` | `.agents/commands/audit.md` | Audit | `/audit`（`.agents/commands/adapters/codex.md`） | `.agents/commands/adapters/cursor-agent.md` | `.agents/commands/adapters/cursor-cli.md` | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | `.agents/commands/release-check.md` | Audit | `/release-check`（`.agents/commands/adapters/codex.md`） | `.agents/commands/adapters/cursor-agent.md` | `.agents/commands/adapters/cursor-cli.md` | `release-review` + `handoff-builder` |

Claude Code Adapter は当面未整備可。Fallback は Skill 直接実行。

## Specialist Subagent Runtime Support

Gemini via agy と Bonsai via Pi は主担当 Agent を置き換えず、既存 Logical Command の補助 runtime として使う。

| Logical Command | Gemini via agy | Bonsai via Pi |
|---|---|---|
| `new-feature` | requirements / decision second opinion | bounded repository evidence collection |
| `review-pr` | diff / contract / test / scope second opinion | bounded diff / file / test preflight |
| `audit` | evidence / authority / boundary second opinion | focused evidence / boundary check |
| `release-check` | release evidence second opinion | focused artifact / evidence presence check |

共通制約:

- Specialist Subagent output は Human approval、Review PASS、Ready / Merge / Deploy authority を付与しない
- Formal Independent Review が必要な Gate を置換しない
- canonical handoff は `.agents/orchestration/handoff-format.md` を使う
- runtime 固有の権限制約は各 Adapter に従う

## Tool Adapter 実体

| Adapter | 正本 |
|---|---|
| Cursor Agent | `.agents/commands/adapters/cursor-agent.md` |
| Cursor CLI | `.agents/commands/adapters/cursor-cli.md` |
| Codex | `.agents/commands/adapters/codex.md` |
| Gemini via agy | `.agents/commands/adapters/agy-gemini.md` |
| Bonsai via Pi | `.agents/commands/adapters/pi-bonsai.md` |

各 Adapter は次を定義する。

- 入力契約
- 出力契約
- Evidence
- 停止条件
- 自動実行しないもの

## Fallback 手順（共通）

```text
Logical Command 名を特定する
  ↓
.agents/commands/<name>.md を読む
  ↓
起動 Agent（.agents/agents/）を読む
  ↓
対象ランタイムの Tool Adapter があればそれに従う
  ↓
Skill Fallback を直接実行する
  ↓
Skill 未導入なら HOLD（推測で補完しない）
```

## Adapter 未整備時の扱い

- Claude Code 等の欠落は P0 ではない
- Logical Command 正本と Skill Fallback が文書上存在すれば工程継続可
- 追加ランタイム用 Adapter は別承認・別実装単位

## 自動実行境界

Adapter・Fallback のいずれも、次を自動実行する実装を含めてはならない。

- GitHub への Issue / PR / レビュー投稿
- Ready 化
- マージ
- deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

案作成（ローカル出力）と投稿・反映を混同しない（DEC-AI-ORG-3）。

## 関連正本

| 主題 | 正本 |
|---|---|
| Workflow | `docs/process/ai-workflow.md` |
| Background Agent 契約 | `docs/process/background-agent-contract.md` |
| Agents | `.agents/agents/` |
| Commands | `.agents/commands/` |
| Skills | `.agents/skills/` / `docs/process/skill-catalog.md` |
| 権限境界 | `docs/decisions/DEC-AI-ORG-003.md` |
| auto-handoff | `scripts/auto-handoff.mjs` |
