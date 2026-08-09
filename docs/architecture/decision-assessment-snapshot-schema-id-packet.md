# AssessmentSnapshot Schema ID — Human Decision packet

この文書は、Eleventh residual substantive unit として選定済みの **AssessmentSnapshot Schema ID** について、次の Human Decision を行うための read-only / docs-only packet である。

```text
Decision kind: Schema ID decision packet only
Selected substantive unit: C — AssessmentSnapshot Schema ID
Implementation Start: HOLD
Schema ID assignment: HOLD / NOT STARTED
Schema ID value invention: FORBIDDEN
Schema / DTO / SharePoint / FindingCode / A-5: HOLD
```

## 1. 既に Accepted / 固定済みの前提

既存正本 `assessment-snapshot-schema-dto-versioning.md` / DEC-1 に従い、以下は再 Decision しない。

```text
Schema ID: 個別契約の安定識別子
Schema ID != SharePoint List name
Schema ID != TypeScript type name
Schema Version: SemVer
DTO Version: Schema Version と同一
AssessmentSnapshot 固有 Schema ID: 現在未採番
```

PR-J domain complete contract は main に実装済みだが、AssessmentSnapshot 固有 Schema ID は持たない。

## 2. 今回 Human が判断する問い

```text
Question:
  AssessmentSnapshot 固有 Schema ID の具体値・命名規則を決める Decision に進むか。
```

この問いは **実装開始の可否ではない**。

## 3. Options

### A — Schema ID value / naming Decision に進む

```text
Meaning:
  AssessmentSnapshot 固有 Schema ID の具体値・命名規則を決める次 Decision を許可する。

Does NOT authorize:
  concrete Schema ID assignment in this packet
  schemaVersion / dtoVersion initial value assignment
  TypeScript / validator / fixture / test changes
  DTO implementation
  SharePoint column mapping
  adapter implementation
  application save implementation
  FindingCode / A-5 work
  Deploy / real data
```

A が選択された場合も、具体値の候補提示・採択は別 Human Decision とする。
比較正本: [`decision-assessment-snapshot-schema-id-value-naming-packet.md`](./decision-assessment-snapshot-schema-id-value-naming-packet.md)（OPEN / NOT ACCEPTED）

### B — HOLD

```text
Meaning:
  AssessmentSnapshot 固有 Schema ID を未採番のまま維持する。
  命名規則・具体値 Decision を開始しない。
```

## 4. Explicit prohibitions

```text
Do NOT:
  invent a Schema ID string
  infer an ID from TypeScript type names
  infer an ID from SharePoint List names
  adopt example version values as canonical
  add schemaVersion / dtoVersion fields to domain types
  start DTO / SharePoint / adapter implementation
  start application save implementation
  reopen FindingCode / A-5
```

## 5. Current gate

```text
Human Decision required:
  A — proceed to Schema ID value / naming Decision
  B — HOLD

Until explicit Human A:
  Schema ID assignment: HOLD
  value invention: FORBIDDEN
  Implementation Start: HOLD
```
