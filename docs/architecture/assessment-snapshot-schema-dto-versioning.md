# AssessmentSnapshot — Schema / DTO versioning 方針（AS-EC-1 Entry #7）

この文書は、**AS-EC-1 Entry #7** が要求する
Schema ID・schemaVersion・DTO versioning 方針の正本である。

Human Acceptance:
[`decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md`](./decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md)

```text
Kind: Schema / DTO versioning policy only
Status: Accepted as Entry #7 evidence
Implementation Start: HOLD
PR-J implementation: DO NOT START
FindingCode: HOLD
A-5: HOLD
```

## 1. 固定結論

```text
AssessmentSnapshot 完全契約の Schema / DTO versioning は DEC-1 に従う
Schema ID: 安定識別子（SharePoint List名 / TypeScript 型名と同一視しない）
Schema Version: SemVer
DTO Version: Schema Version と同一
AssessmentSnapshot 固有 Schema ID 文字列の採番: 今は行わない
```

Entry #7 は **versioning 方針**の確定で閉じる。
具体 Schema ID 値の採番・物理列写像は本段階の対象外とする。

## 2. DEC-1 マップ（再定義しない）

共通正本: [`contracts-v1.md`](./contracts-v1.md)

| 項目 | 方針 |
|---|---|
| Schema ID | 個別契約の安定識別子 |
| Schema Version | SemVer |
| DTO Version | Schema Version と同一 |
| 非同一視 | Schema ID ≠ SharePoint List名 ≠ TypeScript 型名 |

```text
UNCHANGED:
  docs/architecture/contracts-v1.md（DEC-1）
  SupportPlan 既存 Schema ID 採番（本 Entry で触らない）
```

## 3. AssessmentSnapshot 固有値

```text
MUST:
  AssessmentSnapshot 完全契約が将来 Schema を持つ場合、DEC-1 に従う
  Entry #7 を versioning 方針として閉じる

MUST NOT now:
  AssessmentSnapshot 固有 Schema ID 文字列を発明・採番する
  schemaVersion / dtoVersion の仮値を正式採択する
  SharePoint 列写像・DTO 実装を開始する
  Entry Criteria 以外の DEC を再定義する

MAY（将来・別 Human Decision / Implementation Start）:
  AssessmentSnapshot 用 Schema ID を採番する
  初回 schemaVersion（例: 1.0.0）を採択する
```

## 4. Entry Criteria への意味

```text
AS-EC-1 Entry #7 condition:
  Schema ID・schemaVersion・DTO versioning方針が確定済み

Closed by:
  versioning 方針 = DEC-1 準拠（本文書 + Acceptance）
  固有 Schema ID 採番 = 今は行わない（方針の一部）

NOT closed by this document:
  AssessmentSnapshot Schema ID 具体値
  SharePoint / DTO 実装
  AS-EC-1 overall Entry satisfied
  Implementation Start / PR-J 実装
```

## 5. Explicit non-goals

```text
AssessmentSnapshot Schema ID 採番: DO NOT START
SharePoint / DTO 実装: DO NOT START
TypeScript / validator / fixture / contract tests: DO NOT START
FindingCode / A-5: HOLD
PR-J implementation: DO NOT START
src/** / tests/**: unchanged in this policy PR
```
