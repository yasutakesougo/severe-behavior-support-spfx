# Logical Command: release-check

- 文書: `.agents/commands/release-check.md`
- 位置づけ: Logical Command 正本（実行実体の定義。ツール非依存）
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-2
- Adapter 対応: `.agents/commands/adapter-matrix.md`

## 目的

リリース判定を開始する。Audit Agent を起動し、リリース可否の確認と引き継ぎを行う。

## 起動内容

1. Audit Agent（`.agents/agents/audit.md`）を参照する
2. `release-review` が導入済みなら実行する。未導入なら `HOLD`
3. `handoff-builder` で現状・禁止操作・検証結果を引き継ぐ
4. リリース判定案をローカル出力する（deploy は実行しない）

## 起動 Agent

- 主: Audit

## 起動 Workflow

`docs/process/development-process.md` の release-review / handoff-builder 付近。
Release Gate（`docs/process/gate-definitions.md`）を参照する。

## Fallback（Adapter 未整備時）

1. Audit Agent 定義を読む
2. `release-review` を直接実行する（未導入なら HOLD を明示）
3. `handoff-builder` を直接実行する

## 完了条件（本 Command）

- リリース判定案または HOLD（`release-review` 未導入）が出力されている
- handoff に禁止操作（本番 deploy / SharePoint / Entra / M365 / 本番データ変更等）が含まれる
- deploy を実行していない

## 停止条件

- `release-review` 未導入のままリリース完了を求められている
- Merge 未完了または Review PASS 不整合
- 本番変更が工程に含まれている

## 自動実行しないもの

本 Command は文書上の正本定義である。次を自動実行しない。

- 本番 / 検証環境への deploy
- SharePoint App Catalog 登録・更新
- Ready 化・マージ
- GitHub 投稿の自動実行
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

判定案・handoff のローカル出力は可。deploy および投稿は人の事前承認または別プロセス（DEC-AI-ORG-3）。
