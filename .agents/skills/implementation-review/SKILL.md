# implementation-review

## 目的

実装開始前に、計画が着手可能かを判定します。

要件、DEC、設計、Contracts、Issue 分割、PR 境界、テスト計画、HOLD が揃わないまま実装に入ることを防ぎます。

## 使用する場面

- 実装開始直前
- 大きな方針変更後の再着手判定
- 担当者交代後の着手可否確認

## 入力

- 要件定義
- DEC / ADR
- 設計文書
- Contracts 定義または対象外理由
- implementation-plan の結果
- Issue 分割
- PR 分割
- テスト計画
- HOLD 一覧

## 前提条件

- 実装計画が存在する
- 正本資料への参照がある
- 対象外が明示されている

## 実行手順

1. 要件の確定有無を確認する
2. DEC の確定有無を確認する
3. 設計の存在を確認する
4. Contracts の定義または対象外理由を確認する
5. Issue 分割を確認する
6. PR 境界の明確さを確認する
7. テスト計画の存在を確認する
8. HOLD 項目を確認する
9. 対象外が書かれているか確認する
10. Implementation Gate の判定を出す

## 確認項目

- 要件が確定している
- DEC が確定している
- 設計が存在する
- Contracts が定義されている、または対象外理由がある
- Issue が分割されている
- PR 境界が明確である
- テスト計画が存在する
- HOLD 項目が明示されている
- 対象外が明示されている

## 停止条件

- 要件が未確定
- 未決 DEC が実装をブロック
- 設計不在
- PR 境界が曖昧
- テスト計画がない
- 対象外が未定義

## 判定基準

- `PASS`: Implementation Gate の通過条件を満たし、着手ブロッカーがない
- `READY`: この Skill では原則使用しない。補助的な準備完了表現は `PASS` より弱い状態としてのみ扱う
- `HOLD`: 情報不足、承認待ち、未決事項により着手可否を確定できない
- `FAIL`: P0 または P1 の着手ブロッカーがある
- `NOT APPLICABLE`: 実装開始判定を要しない作業

## 成果物

- Gate 判定
- 着手可否
- 未着手条件
- ブロッカー一覧
- 必要承認
- 次の推奨アクション

## 禁止事項

- 要件未確定を軽微として扱うこと
- `HOLD` を `PASS` と同義にすること
- 承認待ちのまま着手許可を出すこと
- merge、push、deploy、本番変更を実施手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要として扱うこと
- 本番データ変更や物理削除を許可すること

## 出力形式

```md
# implementation-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- Gate: Implementation Gate
- 着手可否:

## Checklist
- 要件:
- DEC:
- 設計:
- Contracts:
- Issue 分割:
- PR 境界:
- テスト計画:
- HOLD 明示:
- 対象外:

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN |  |  |  |

## HOLD
- なし / または列挙

## Approvals
- 必要な承認:
- 承認状態:

## Next Actions
1.
2.
```
