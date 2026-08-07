# requirements-review sample

## Summary
- 判定: HOLD
- 対象機能: 支援計画ステータス遷移の要件整理
- 対象リポジトリ: severe-behavior-support-spfx

## Checklist
- 対象利用者: 事業所職員（確定）
- 入力: 計画 ID、遷移先ステータス（確定）
- 出力: 遷移結果 / 拒否理由（確定）
- 保存先: 未確定（Contracts のみ）
- 権限: Domain ロール境界は確定、SharePoint 実装は対象外
- 正常時動作: 許可遷移のみ成功
- 失敗時動作: 拒否理由コードを返す
- 受入条件: 契約テストで遷移表を検証

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN | 保存先が未確定 | 正本に永続化先なし | HOLD |

## HOLD
- 保存先（永続化）は後続設計まで HOLD

## Scope
- 実装可能範囲: Domain 純粋関数と契約テスト
- 実装禁止範囲: SharePoint変更、deploy、本番データ変更

## Approvals
- 必要な承認: なし（要件整理段階）
- 承認状態: N/A

## Next Actions
1. decision-review で未決 DEC を列挙する
2. domain-design へ渡す前提を固定する
