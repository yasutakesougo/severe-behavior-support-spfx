# Logical Command: new-feature

- 文書: `.agents/commands/new-feature.md`
- 位置づけ: Logical Command 正本（実行実体の定義。ツール非依存）
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-2
- Adapter 対応: `.agents/commands/adapter-matrix.md`

## 目的

要件整理を開始する。Workflow の入口として Requirements Agent を起動する。

## 起動内容

1. Requirements Agent（`.agents/agents/requirements.md`）を参照する
2. 対応 Skill（requirements 系）を実行するか、未導入なら `HOLD` とする
3. 要件整理・未決 DEC・HOLD の列挙までで止まる

## 起動 Agent

- 主: Requirements
- 後続（本 Command の範囲外）: Architecture → Implementation（Workflow 順）

## 起動 Workflow

`docs/process/ai-workflow.md` / `docs/process/development-process.md` の先頭付近（要件整理）。

本 Command は **要件整理開始まで** とし、設計・実装・レビュー・マージ・deploy へ自動進行しない。

## Fallback（Adapter 未整備時）

1. Requirements Agent 定義を読む
2. `requirements-review` / `decision-review` を直接実行する
3. 未カタログ後続 Skill が必要な場合のみ HOLD

## 完了条件（本 Command）

- 要件整理の結果または HOLD 理由がローカル出力されている
- 次工程に進む前提（未決事項）が列挙されている
- SharePoint / Entra ID / Microsoft 365 / 本番変更手順が含まれていない

## 停止条件

- Out of Scope 操作が要求に含まれる
- 証跡不足を推測で補完する必要がある
- 未カタログ後続 Skill の完了を求められている

## 自動実行しないもの

本 Command は文書上の正本定義である。次を自動実行しない。

- GitHub への Issue / PR 投稿
- Ready 化
- マージ
- deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

Issue 案のローカル出力は可。投稿は人の事前承認後（DEC-AI-ORG-3）。
