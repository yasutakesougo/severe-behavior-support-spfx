# Adapter Matrix

- 文書: `.agents/commands/adapter-matrix.md`
- 位置づけ: Logical Command とツール別 Adapter の対応表
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-2
- 正本: Logical Command（`.agents/commands/*.md`）。本表は Adapter 対応のみ

## 原則

- 正本は Logical Command 名（スラッシュなし）とする
- ツール別の `/command` 文字列は Adapter とする
- Adapter が未整備でも、Logical Command 定義と Skill Fallback で工程を進められる
- 特定ツールの必須化はしない
- Adapter 実装そのもの（プラグイン・Rule 実体）は本単位の対象外

## 対応表

| Logical Command | 正本 | 起動 Agent | Codex Adapter | Claude Code Adapter | Cursor Adapter | Skill Fallback |
|---|---|---|---|---|---|---|
| `new-feature` | `.agents/commands/new-feature.md` | Requirements | `/new-feature`（未整備可） | `/new-feature`（未整備可） | Rule または Command 対応（未整備可） | requirements 系 Skill 直接実行。未導入なら HOLD |
| `review-pr` | `.agents/commands/review-pr.md` | Review（→ Audit） | `/review-pr`（未整備可） | `/review-pr`（未整備可） | Rule または Command 対応（未整備可） | `implementation-review` / review 系 / 必要時 `merge-audit` |
| `audit` | `.agents/commands/audit.md` | Audit | `/audit`（未整備可） | `/audit`（未整備可） | Rule または Command 対応（未整備可） | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | `.agents/commands/release-check.md` | Audit | `/release-check`（未整備可） | `/release-check`（未整備可） | Rule または Command 対応（未整備可） | `release-review`（未導入なら HOLD）+ `handoff-builder` |

## Fallback 手順（共通）

```text
Logical Command 名を特定する
  ↓
.agents/commands/<name>.md を読む
  ↓
起動 Agent（.agents/agents/）を読む
  ↓
Adapter があればそれに従う（未整備ならスキップ）
  ↓
Skill Fallback を直接実行する
  ↓
Skill 未導入なら HOLD（推測で補完しない）
```

## Adapter 未整備時の扱い

- 欠落は P0 ではない
- Logical Command 正本と Skill Fallback が文書上存在すれば工程継続可
- ツール固有ファイルの追加は別承認・別実装単位

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
| Agents | `.agents/agents/` |
| Commands | `.agents/commands/` |
| Skills | `.agents/skills/` / `docs/process/skill-catalog.md` |
| 権限境界 | `docs/decisions/DEC-AI-ORG-003.md` |
