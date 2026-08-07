# Tool Adapter: Codex

- 文書: `.agents/commands/adapters/codex.md`
- 位置づけ: Logical Command の Codex 向け Adapter
- 正本: Logical Command（`.agents/commands/*.md`）
- 対応表: `.agents/commands/adapter-matrix.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md`

## 対象ランタイム

- OpenAI Codex（または同等のコーディングエージェント）
- スラッシュコマンド形式（`/review-pr` 等）を Adapter 文字列として解釈する

## Logical Command 対応

| Logical Command | Codex Adapter 文字列 | Fallback |
|---|---|---|
| `new-feature` | `/new-feature` | `requirements-review` / `decision-review` |
| `review-pr` | `/review-pr` | `implementation-review` / `contracts-review` / `test-review` / 必要時 `merge-audit` |
| `audit` | `/audit` | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | `/release-check` | `release-review` + `handoff-builder` |

Adapter 文字列が未実装の環境では、Logical Command 名を通常プロンプトとして渡し、Skill Fallback を実行する。

## 入力契約

- Logical Command または `/command`
- 対象リポジトリ / ブランチ
- Issue / PR / SHA（該当時）
- 変更範囲と対象外

## 出力契約

- Skill 出力形式の Markdown
- Evidence と Findings を含む
- 投稿用文面を作る場合も「案」であることを明示する

## Evidence

- 使用した Adapter 文字列または Fallback Skill
- head SHA
- 検証コマンド結果
- 参照正本

## 停止条件

- `/command` だけを実行し Skill 正本を読まずに完了扱いにしようとしている
- 必要証跡不足
- 禁止操作の実行要求
- Review PASS なし Merge の要求

## 自動実行しないもの

- GitHub への投稿・Ready 化・マージ・deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更
- 承認なしの force-push（main / 保護ブランチは禁止。非保護自 branch も人の事前承認）

Codex 固有プラグインの必須化はしない。未整備時は Skill Fallback で継続する。
