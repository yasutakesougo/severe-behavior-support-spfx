# Tool Adapter: Cursor Agent

- 文書: `.agents/commands/adapters/cursor-agent.md`
- 位置づけ: Logical Command の Cursor Agent（Cloud / Background Agent）向け Adapter
- 正本: Logical Command（`.agents/commands/*.md`）
- 対応表: `.agents/commands/adapter-matrix.md`
- 実行契約: `docs/process/background-agent-contract.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md`

## 対象ランタイム

- Cursor Agent（Cloud Agent / Background Agent）
- リポジトリ内の `.agents/` 定義を読み、Logical Command または Skill Fallback を実行する

## Logical Command 対応

| Logical Command | Cursor Agent での起動 | Fallback |
|---|---|---|
| `new-feature` | プロンプトで `new-feature` を指定、または Requirements Agent を参照して開始 | `requirements-review` → `decision-review` |
| `review-pr` | プロンプトで `review-pr` と対象 PR / head SHA を指定 | `implementation-review` / `contracts-review` / `test-review` → 必要時 `merge-audit` |
| `audit` | プロンプトで `audit` と対象 PR / SHA を指定 | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | プロンプトで `release-check` を指定 | `release-review` + `handoff-builder` |

スラッシュコマンド文字列の必須化はしない。Logical Command 名または Agent / Skill 名での起動を許容する。

## 入力契約

最低限次を受け取る。不足時は推測せず `HOLD`。

- 対象リポジトリ
- Logical Command 名または起動 Agent / Skill
- 対象 Issue / PR（該当時）
- head SHA / base SHA（レビュー・監査時）
- 変更範囲と対象外
- 既知 HOLD / 禁止操作

## 出力契約

- Skill 出力形式に従った Markdown（ローカル成果物）
- Evidence（コマンド結果、SHA、CI 状態）
- Findings（P0 / P1 / P2）
- Next Actions
- 自動 handoff が必要な場合は `npm run handoff:auto` の結果、または同等内容

## Evidence

次を成果物または handoff に残す。

- 作業ブランチ名
- head SHA
- 実行した検証コマンドと結果
- 参照した正本パス
- PR 番号 / 状態（ある場合）

## 停止条件

- 必要入力（PR / SHA 等）が不明
- 呼び出し Skill が未導入で完了を求められている
- unresolved P0 / P1 があるのに PASS 相当を求められている
- merge / deploy / SharePoint / Entra / M365 / 本番データ変更の自動実行を求められている
- Background Agent 実行契約の停止条件に該当

## 自動実行しないもの

- GitHub への Issue / PR / レビュー投稿（案作成は可）
- Ready 化
- マージ
- deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

`git commit` と非保護 feature branch への通常 push は、実装開始承認済みかつ承認済み Issue 範囲内でのみ可（DEC-AI-ORG-3）。

## Origin（非正本）

Cursor Origin は GitHub の代替正本ではない。評価正本: `docs/architecture/origin-evaluation-1.md`。

- GitHub = authoritative repository / governance SSOT
- Origin enablement / mirror / Detach / Origin merge / force-push は Adapter 単独では認可しない
- Human GO・PR 番号・main SHA・CI 証跡の正本は GitHub に残す
