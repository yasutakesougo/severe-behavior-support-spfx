# Logical Command: audit

- 文書: `.agents/commands/audit.md`
- 位置づけ: Logical Command 正本（実行実体の定義。ツール非依存）
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-2
- Adapter 対応: `.agents/commands/adapter-matrix.md`

## 目的

監査を開始する。Audit Agent を起動し、マージ可否または現状監査の結果案を出す。

## 起動内容

1. Audit Agent（`.agents/agents/audit.md`）を参照する
2. 主に `merge-audit` を実行する
3. 必要に応じて `handoff-builder` で現状引き継ぎを併記する
4. 監査結果案をローカル出力する（マージは実行しない）

## 起動 Agent

- 主: Audit

## 起動 Workflow

`docs/process/development-process.md` の merge-audit / handoff-builder 付近。
Merge Gate（`docs/process/gate-definitions.md`）を参照する。

## Fallback（Adapter 未整備時）

1. Audit Agent 定義を読む
2. `merge-audit` を直接実行する
3. 引き継ぎが必要なら `handoff-builder` を直接実行する

## 完了条件（本 Command）

- 対象 PR / head SHA（または監査対象）が固定されている
- P0 / P1 / P2 / HOLD とマージ可否の判定案が出力されている
- Review PASS なし Merge を推奨していない
- マージ・deploy を実行していない

## 停止条件

- 対象 SHA 不明
- Review PASS と expected head SHA の不一致
- unresolved P0 / P1 あり
- 承認証跡不足

## 自動実行しないもの

本 Command は文書上の正本定義である。次を自動実行しない。

- マージ
- Ready 化
- deploy
- GitHub への監査結果投稿
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

監査結果案のローカル出力は可。投稿・反映は人の事前承認後（DEC-AI-ORG-3）。
