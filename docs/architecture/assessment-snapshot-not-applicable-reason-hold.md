# AssessmentSnapshot — NOT_APPLICABLE reason HOLD 方針（AS-EC-1 Entry #6）

この文書は、**AS-EC-1 Entry #6** が要求する
サービス別 NOT_APPLICABLE reason code の正本、または HOLD 方針の正本である。

Human Acceptance:
[`decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md`](./decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md)

```text
Kind: NOT_APPLICABLE reason HOLD policy only
Status: Accepted as Entry #6 evidence
Implementation Start: HOLD
PR-J implementation: DO NOT START
FindingCode: HOLD
A-5: HOLD
```

## 1. 固定結論

```text
サービス別 NOT_APPLICABLE reason code 正本: 今は採択しない
Entry #6: HOLD方針として閉じる
値一覧発明: FORBIDDEN
```

Entry #6 は reason code カタログの採択ではなく、
**HOLD 方針の確定**によって充足する。

## 2. 維持する構造規則（再定義しない）

既存設計・変換契約を UNCHANGED で維持する。

| 規則 | 正本 |
|---|---|
| `NOT_APPLICABLE` は条件付きで保存可 | [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) Q4 |
| 保存時 `reasonCodes` **1件以上必須** | 同 Q5 / [`assessment-snapshot-result-conversion.md`](./assessment-snapshot-result-conversion.md) |
| 各要素は `isReasonCode` | Result 変換契約 |
| 自由記述本文を reason code へ格納しない | 設計 Q5 |
| サービス別正式 enum は別 Decision | 設計 Q4 |

```text
UNCHANGED:
  assessment-snapshot-result-design.md Q4 / Q5
  assessment-snapshot-result-conversion.md reasonCodes 規則
  toAssessmentSnapshotResultCandidate（PR #72）
```

## 3. HOLD 方針ルール

```text
MUST:
  Entry #6 を「サービス別 reason 正本は今採択しない」HOLD 方針で閉じる
  値一覧・サービス別 enum を発明しない
  PR-J / 型実装にサービス別 NOT_APPLICABLE enum を埋め込まない

MUST NOT:
  仮の reason code 一覧を正式正本として採択する
  Entry #7 / overall を本方針だけで閉じる
  Implementation Start / PR-J 実装を開始する
  FindingCode 値発明と混ぜる

MAY（将来・別 Human Decision）:
  サービス別 NOT_APPLICABLE reason code 正本を採択する
  （そのときは本 HOLD 方針を置き換える別 Acceptance が必要）
```

## 4. Entry Criteria への意味

```text
AS-EC-1 Entry #6 condition:
  サービス別NOT_APPLICABLE reason codeの正本またはHOLD方針が確定済み

Closed by:
  HOLD方針 = サービス別正本は今採択しない（本文書 + Acceptance）

NOT closed by this document:
  サービス別 reason code 値一覧
  Entry #7
  AS-EC-1 overall Entry satisfied
  Implementation Start / PR-J 実装
```

## 5. Explicit non-goals

```text
サービス別 reason enum 採択: DO NOT START
reason code 値発明: FORBIDDEN
TypeScript / validator / fixture / contract tests: DO NOT START
SharePoint / DTO: DO NOT START
FindingCode / A-5: HOLD
PR-J implementation: DO NOT START
src/** / tests/**: unchanged in this policy PR
```
