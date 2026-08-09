# AssessmentSnapshot — Finding / findingIds 参照境界（AS-EC-1 Entry #5）

この文書は、**AS-EC-1 Entry #5** が要求する
AssessmentSnapshot における Finding / findingIds 参照境界の正本である。

Human Acceptance:
[`decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md`](./decision-as-ec-1-entry-5-finding-ids-boundary-acceptance.md)

```text
Kind: findingIds reference boundary only
Status: Accepted as Entry #5 evidence
Implementation Start: HOLD
PR-J implementation: DO NOT START
FindingCode: HOLD
A-5: HOLD
```

## 1. 固定結論

```text
AssessmentSnapshot は Finding / findingIds を必須参照しない。
findingIds: NOT REQUIRED
完全 Finding 契約: Entry #5 充足のために要求しない
```

AssessmentSnapshot の Result / 保存境界は、Finding 集合の完全契約や
`findingIds` 配列の必須同梱に依存しない。

## 2. 参照境界ルール

```text
MUST:
  AssessmentSnapshot 完全契約面で findingIds を REQUIRED にしない
  Finding 不在・未生成・未確定を、Snapshot 必須欠落として扱わない
  Result 変換（永続なし）の既存境界を再定義しない

MAY（将来・別 Decision）:
  任意の相関・追跡のために findingIds を OPTIONAL で持つ設計を検討する
  （本 Acceptance は OPTIONAL 採用を強制しない）

MUST NOT:
  完全 Finding 契約の先行実装を Entry #5 で開始する
  FindingCode 値を発明する
  findingIds 必須化を PR-J 実装条件として持ち込む
  Entry #6 / #7 / overall を本境界だけで閉じる
```

## 3. 既存契約との関係

| 正本 | 関係 |
|---|---|
| [`assessment-snapshot-result-conversion.md`](./assessment-snapshot-result-conversion.md) | UNCHANGED。findingIds 必須化・完全 Finding = OUT を維持 |
| [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) | Entry #5 を本境界で閉じる。設計の Result 意味は再定義しない |
| Decision-FC-1〜FC-6 | UNCHANGED。FindingCode catalog 論理契約。本境界と混ぜない |
| SEV / 完全 Finding | 完全 Finding は別 HOLD。Entry #5 では要求しない |

## 4. Entry Criteria への意味

```text
AS-EC-1 Entry #5 condition:
  完全なFinding契約またはfindingIds参照境界が確定済み

Closed by:
  findingIds 参照境界 = NOT REQUIRED（本文書 + Acceptance）

NOT closed by this document:
  完全 Finding 実装
  FindingCode 値一覧
  Entry #6 / #7
  AS-EC-1 overall Entry satisfied
  Implementation Start / PR-J 実装
```

## 5. Explicit non-goals

```text
TypeScript / validator / fixture / contract tests: DO NOT START
SharePoint / DTO: DO NOT START
FindingCode values: DO NOT INVENT
A-5: HOLD
PR-J implementation: DO NOT START
src/** / tests/**: unchanged in this boundary PR
```
