# AssessmentSnapshot Schema ID — Human Decision packet

この文書は、Eleventh residual substantive unit として選定済みの **AssessmentSnapshot Schema ID** について、次の Human Decision を行うための read-only / docs-only packet である。

```text
Decision kind: Schema ID decision packet only
Selected substantive unit: C — AssessmentSnapshot Schema ID
Status: CONSUMED（Human A → Decision-AS-SCHEMA-ID-1 Accepted / LOCKED）
Implementation Start: HOLD
Schema ID naming / concrete value: Accepted / LOCKED
  （decision-assessment-snapshot-schema-id-value-naming-acceptance.md）
schemaVersion / dtoVersion: HOLD / NOT DECIDED
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
Schema ID value invention beyond Accepted ID-1: FORBIDDEN
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
AssessmentSnapshot 固有 Schema ID 文字列:
  Accepted / LOCKED
  = severe-behavior-support.assessment-snapshot.snapshot
  （Decision-AS-SCHEMA-ID-1）
schemaVersion / dtoVersion: HOLD / NOT DECIDED
```

PR-J domain complete contract は main に実装済みだが、domain 型へ schemaId / schemaVersion / dtoVersion はまだ持たない。

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

A は選択済み（CONSUMED）。具体値の比較・採択は Decision-AS-SCHEMA-ID-1 で完了。

- 比較正本: [`decision-assessment-snapshot-schema-id-value-naming-packet.md`](./decision-assessment-snapshot-schema-id-value-naming-packet.md)（CONSUMED）
- Acceptance 正本: [`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)（Accepted / LOCKED）

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
Human Decision on this packet: A — CONSUMED
Decision-AS-SCHEMA-ID-1: Accepted / LOCKED
  Naming rule = NR-1
  Schema ID = severe-behavior-support.assessment-snapshot.snapshot
  schemaVersion = HOLD / NOT DECIDED

Still HOLD:
  Schema ID assignment into code / DTO / SharePoint
  Implementation Start
  Schema / DTO / SharePoint / adapter / application save
  FindingCode / A-5
```
