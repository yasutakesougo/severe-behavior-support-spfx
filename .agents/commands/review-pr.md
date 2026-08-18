# Logical Command: review-pr

- 文書: `.agents/commands/review-pr.md`
- 位置づけ: Logical Command 正本（実行実体の定義。ツール非依存）
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-2
- Adapter 対応: `.agents/commands/adapter-matrix.md`

## 目的

PR レビューを開始する。Review Agent を起動し、必要に応じて Audit Agent へ引き渡す。

## 起動内容

1. Review Agent（`.agents/agents/review.md`）を参照する
2. 導入済みの `implementation-review`、実装後なら `contracts-review` / `test-review` を用いる
3. UI / presentation 差分がある場合は `design-review` を追加する（非 UI は `NOT APPLICABLE`）
4. 強度行動障害支援サイクルの実操作レビューが必要な場合は、必須観点ではなく `severe-behavior-cycle-review` を直接実行する
5. レビューコメント案・Review PASS 記録案をローカル出力する
6. マージ可否の監査が必要なら Audit Agent（`merge-audit`）へ引き渡す

## 起動 Agent

- 主: Review
- 引き渡し: Audit（マージ監査が必要な場合）

## 起動 Workflow

`docs/process/development-process.md` の implementation-review / contracts-review / test-review / merge-audit 付近。

## Fallback（Adapter 未整備時）

1. Review Agent 定義を読む
2. `implementation-review` を直接実行する（着手判定）
3. 実装後なら `contracts-review` / `test-review` を直接実行する
4. UI 差分があれば `design-review` を直接実行する。なければ `NOT APPLICABLE`
5. マージ監査が必要なら `merge-audit` を直接実行する（Audit Agent）

## 完了条件（本 Command）

- 対象 PR と review 対象 head SHA が固定されている
- Gate 判定とブロッカー一覧が出力されている
- Review PASS を出す場合、head SHA 拘束が記録されている
- レビュー投稿・Ready 化・マージは実行していない

## 停止条件

- head SHA 不明
- unresolved P0 / P1 が残っている（PASS 不可）
- Review PASS なしで Merge を求められている
- 後続の未カタログ Skill（security/ui 等）の完了を求められている

## 自動実行しないもの

本 Command は文書上の正本定義である。次を自動実行しない。

- PR レビュー投稿
- ラベル更新
- Ready 化
- マージ
- deploy
- SharePoint / Entra ID / Microsoft 365 / 本番データ変更

レビューコメント案・Review PASS 記録案のローカル出力は可。投稿・反映は人の事前承認後（DEC-AI-ORG-3）。
