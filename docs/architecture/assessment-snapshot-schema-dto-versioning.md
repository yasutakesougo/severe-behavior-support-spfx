# AssessmentSnapshot — Schema / DTO versioning 方針（AS-EC-1 Entry #7）

この文書は、**AS-EC-1 Entry #7** が要求する
Schema ID・schemaVersion・DTO versioning 方針の正本である。

Human Acceptance:
[`decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md`](./decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md)

```text
Kind: Schema / DTO versioning policy only
Status: Accepted as Entry #7 evidence
AssessmentSnapshot Schema ID string:
  Accepted / LOCKED via Decision-AS-SCHEMA-ID-1
  = severe-behavior-support.assessment-snapshot.snapshot
schemaVersion / dtoVersion: HOLD / NOT DECIDED
Implementation Start: HOLD
PR-J Schema/DTO implementation: DO NOT START
FindingCode: HOLD
A-5: HOLD
```

## 1. 固定結論

```text
AssessmentSnapshot 完全契約の Schema / DTO versioning は DEC-1 に従う
Schema ID: 安定識別子（SharePoint List名 / TypeScript 型名と同一視しない）
Schema Version: SemVer
DTO Version: Schema Version と同一
AssessmentSnapshot 固有 Schema ID 文字列:
  Accepted / LOCKED
  = severe-behavior-support.assessment-snapshot.snapshot
  （Decision-AS-SCHEMA-ID-1 / NR-1 / ID-1）
schemaVersion / dtoVersion:
  HOLD / NOT DECIDED（SV-HOLD）
```

Entry #7 は **versioning 方針**の確定で閉じた。
Schema ID 具体文字列は Decision-AS-SCHEMA-ID-1 で Accepted。
初回 schemaVersion / 物理列写像 / DTO 実装は別 Decision のまま HOLD。

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
LOCKED（Decision-AS-SCHEMA-ID-1）:
  Naming rule = NR-1 — {product}.{aggregate}.{artifact}
  Schema ID = severe-behavior-support.assessment-snapshot.snapshot

HOLD / NOT DECIDED:
  schemaVersion / dtoVersion（SV-HOLD）

MUST:
  AssessmentSnapshot 完全契約が Schema を持つ場合、DEC-1 に従う
  Accepted Schema ID 文字列を別文字列へ変更しない

MUST NOT now:
  schemaVersion / dtoVersion を 1.0.0 等で補完・正式採択する
  TypeScript 型へ schemaId を追加する
  SharePoint 列写像・DTO 実装を開始する
  Entry Criteria 以外の DEC を再定義する

MAY（将来・別 Human Decision / Implementation Start）:
  初回 schemaVersion（例: 1.0.0）を採択する
  DTO / SharePoint 写像を開始する
```

Acceptance 正本:
[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)

## 4. Entry Criteria への意味

```text
AS-EC-1 Entry #7 condition:
  Schema ID・schemaVersion・DTO versioning方針が確定済み

Closed by Entry #7:
  versioning 方針 = DEC-1 準拠（本文書 + Entry #7 Acceptance）

Closed later by Decision-AS-SCHEMA-ID-1（別 Decision）:
  AssessmentSnapshot Schema ID 具体文字列
  = severe-behavior-support.assessment-snapshot.snapshot

NOT closed:
  schemaVersion / dtoVersion 具体値（SV-HOLD）
  SharePoint / DTO 実装
  AS-EC-1 overall 以外の実装着手（overall は別途 MET）
  Implementation Start / Schema・DTO コード実装
```

## 5. Explicit non-goals

```text
AssessmentSnapshot Schema ID code assignment / DTO: DO NOT START
schemaVersion / dtoVersion adoption: HOLD / NOT DECIDED
SharePoint / DTO 実装: DO NOT START
TypeScript / validator / fixture / contract tests（Schema/DTO）: DO NOT START
FindingCode / A-5: HOLD
PR-J Schema/DTO implementation: DO NOT START
src/** / tests/**: unchanged in this policy sync
```
