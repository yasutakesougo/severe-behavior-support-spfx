# Gate 定義

## 目的

この文書は、`severe-behavior-support-spfx`で使用する主要 Gate の通過条件を固定します。

Gate は実装の自動許可ではなく、次工程へ進んでよいかを判断するための停止点です。

## 共通ルール

- 判定語は `PASS` / `READY` / `HOLD` / `FAIL` / `NOT APPLICABLE` に限定する
- `HOLD` は保留であり、通過ではない
- `P0` が残っている場合は `FAIL`
- 承認証跡が不足している場合は `PASS` にしない
- 未確認事項を推測で埋めない

## Architecture Gate

### 目的

要件、DEC、設計の整合性を確認し、実装が設計崩れなしに開始できるかを判断します。

### 通過条件

- Domain が SharePoint 実装に依存していない
- Contracts が Domain の意味を表現している
- SharePoint 列と Contracts の対応が定義されている
- UI が未確認情報を確定値として表示しない
- 権限制御が UI だけに依存していない
- DEC / ADR が主要判断を記録している

### HOLD 条件

- 未決 DEC が実装をブロックしている
- データ境界または権限境界が説明できない
- SharePoint 依存が Domain に混入している
- 失敗時挙動が未定義

### 判定

- すべて満たす: `PASS`
- 情報不足または承認待ち: `HOLD`
- 重大な矛盾あり: `FAIL`

## Implementation Gate

### 目的

着手前に、実装計画が Issue、PR、テスト、対象外を含めて分解済みかを確認します。

### 通過条件

- 要件が確定している
- DEC が確定している
- 設計が存在する
- Contracts が定義されている、または対象外理由がある
- Issue 分割が存在する
- PR 境界が明確である
- テスト計画が存在する
- HOLD 項目が明示されている
- 対象外が明示されている

### HOLD 条件

- 受入条件をテストへ変換できない
- PR 境界が曖昧
- 変更対象と対象外が混在
- 実装前提の承認が未取得

### 判定

- 着手可能: `PASS`
- 実装は可能だが前提不足: `HOLD`
- P0 / P1 のブロッカーあり: `FAIL`

## Merge Gate

### 目的

PR をマージ候補へ進めてよいかを、実装者とは別視点で監査します。

### 通過条件

- 対象 PR と head SHA / base SHA が固定されている
- 変更範囲と対象外変更が識別されている
- CI 結果が記録されている（SUCCESS）
- 未実行テストがあれば理由が記録されている
- `P0` が 0 件
- `P1` が 0 件
- 新規失敗が 0 件
- Fresh Review = PASS（Solo development 既定）
- mergeable = clean
- 必要な証跡が揃っている
- `HOLD` が PASS 扱いされていない
- 明示 Human Merge GO がある（expected head SHA 拘束）

### Solo development（既定）— 非必須

- submitted GitHub Review PASS は必須としない（正本: `docs/decisions/DEC-AI-ORG-003.md`）
- Human が複数人レビューを要求した場合のみ、同一 head SHA の Review PASS を追加必須とする

### FAIL 条件

- `P0` が 1 件以上ある
- `P1` が 1 件以上ある
- 新規失敗を既知失敗として偽装している
- head SHA が監査対象と一致しない

### HOLD 条件

- Human Merge GO 待ち
- CI 未完了 / 非 SUCCESS
- Fresh Review 未完了 / 非 PASS
- （複数人レビュー要求時）未解決レビューあり
- 根拠不足で重大度を判定できない

### 判定

- マージ可能: `PASS`
- 追加確認待ち: `HOLD`
- マージ不可: `FAIL`

### 自己参照 stale

マージ前に当該 PR 自身のライブ状態（`Merge: NO` / `NOT RUN` / `Next: Merge GO` 等）を repository docs へ書いた結果として残る stale は、Merge Gate failure にしない。

正本: `docs/process/self-referential-gate-policy.md`（Self-Referential Gate Policy v1）

- 分類: `EXPECTED_P2` / `NON_BLOCKING`
- 専用 sync PR: `NO_DEDICATED_SYNC_PR`
- 修正: 次の substantive PR が同文書を自然に触るときのみ opportunistic に更新
- Live gate（`Ready` / `Merge pending` / `Next`）は PR body / Issue comment に限定し、repository docs へ横断複製しない

## Release Gate

### 目的

マージ後に、deploy へ進めてよいかを判定します。

### 通過条件

- main 基準 SHA が固定されている
- 対象リリースと成果物が定義されている
- 環境差分が明示されている
- 権限影響が確認されている
- ロールバック手順が存在する
- 受入条件の達成証跡がある
- deploy 承認と本番承認がある

### HOLD 条件

- deploy 承認がない
- 本番承認がない
- ロールバック未確認
- 環境差分未整理

### 判定

- リリース可能: `PASS`
- 承認または証跡待ち: `HOLD`
- リリース不可: `FAIL`
