# FIELD-WORKFLOW Contract Issue B — B-PKG-1 Domain Decision

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1
Kind: Human Selection（Issue #352 Domain Decisions）
Status: SELECTED / LOCKED
Human Decision: SELECT B-PKG-1
Date: 2026-08-13
Issue: #352（契約 Issue B 正本）

Upstream:
  Issue A #347 / A2 SELECTED / LOCKED
  SupportPlanVersionProcedureBinding MERGED（PR #350）
  Issue B filing packet MERGED（PR #351）
  Issue #352 body = filing packet full text
  Selection packet: docs/architecture/decision-field-workflow-contract-b-domain-selection.md
    （候補整理。本 Decision が正本）

GitHub Issue comment recording: NOT written by agent（blocked）
Canonical recording: THIS DOCUMENT

Implementation Start: NOT AUTHORIZED（separate Human GO）
FIELD-WORKFLOW UI / Deploy / SharePoint / #299 / #347 / #352 Close: NOT AUTHORIZED
```

## 1. Selected package

```text
B-PKG-1 — SELECTED / LOCKED
```

| Decision | SELECTED / LOCKED |
|---|---|
| 正式型名 | `ProcedureRecord` |
| Schema ID | `severe-behavior-support.procedure-record.record` |
| Schema Version | `1.0.0`（DTO Version = Schema Version） |
| 合成方針 | 新規 first-class type。`ExecutionRecord` は変更せず identity / idempotency / `ApprovedProcedureReference` の意味を再利用 |
| ABC / Observation | 拡張しない |
| TraceRef | 二重正本にしない。必要なら `ProcedureRecord` から導出 |
| result | `PERFORMED_AS_PLANNED` / `PERFORMED_WITH_ADAPTATION` / `NOT_PERFORMED` |
| clocks | `performedAt` + `recordedAt` を必須 ISO 日時 |
| recordedBy | 認証主体識別子。支援対象 `UserId` や Role とは分離 |
| FW-05 | 歴史的 plan/procedure version を固定。最新版 fallback 禁止 |

## 2. Why this package

- 既存 `ExecutionRecord` はすでに `RecordId` / `IdempotencyKey` / `Procedure` / `LocalDate` / `PayloadFingerprint` を持つ。破壊せず意味を再利用するのが最小変更。
- `AbcRecord` は antecedent / behavior / aftermath 等を持つ別業務契約のため、`ProcedureRecord` へ流用しない。
- Issue A（A2）の「手順本文は契約へ昇格しない」を維持する。

## 3. Locked contract shape（min fields）

`ProcedureRecord` は少なくとも次を保持する。

```text
OrganizationId
SiteId
UserId
TimeZone
RecordId
IdempotencyKey
PayloadFingerprint
Procedure          // ApprovedProcedureReference（本文なし）
LocalDate
planId
planVersion
result
performedAt
recordedAt
recordedBy
```

### 3.1 Procedure / Issue A alignment

- `Procedure` は既存 `ApprovedProcedureReference` をそのまま使う。
- 手順本文は持たない（A2 維持）。
- Issue A binding が固定する org/site/user + plan/version + approved procedure reference と、記録側の対応値は **完全一致** させる。

### 3.2 result vocabulary（LOCKED）

```text
PERFORMED_AS_PLANNED       // 手順どおり実施
PERFORMED_WITH_ADAPTATION  // 一部変更して実施
NOT_PERFORMED              // 実施できなかった
```

規則:

- 3値はいずれも正当な事実記録。職員の成功/失敗 status ではない。
- `FAILED` 等への変換は **禁止**。
- presentation が赤警告・失敗扱いだけに頼らないこと（UI は後続ゲート）。

### 3.3 clocks / LocalDate / recordedBy（LOCKED）

```text
performedAt: required ISO-8601 datetime
  // 現場側イベント時刻
  // NOT_PERFORMED の場合 = その手順を実施できないことが現場で確定した時刻

recordedAt: required ISO-8601 datetime
  // 記録作成時刻
  // recordedAt >= performedAt を要求

LocalDate: Asia/Tokyo 暦日
  // performedAt の Asia/Tokyo 暦日と一致させる
  // 既存 ExecutionRecord.LocalDate と同じ基準

recordedBy: required non-empty string
  // 記録行為者の認証主体 ID
  // 支援対象 UserId / 表示名 / メール / Role と同一視しない
  // SupportRecordTraceRef.recordedBy 意味に整列
```

### 3.4 idempotency / PayloadFingerprint（LOCKED）

- `RecordId` / `IdempotencyKey` / `PayloadFingerprint` は既存 `ExecutionRecord` / contracts-v1 の意味を再利用する。
- 別の idempotency 体系は作らない。
- `PayloadFingerprint` の拘束対象は少なくとも次を含む:

```text
planId / planVersion
ProcedureId / ProcedureVersion（Procedure 参照）
result
performedAt
recordedAt
recordedBy
```

- Shell save 5-state を弱めない。`save_outcome_unknown` を成功/失敗へ丸めない。

## 4. FW-05 fixtures（LOCKED）

### FW05-HIST-01

```text
plan v2 + procedure P2 に紐づく記録を作成する。
その後 v3 / P3 が Active になっても、当該記録は v2 / P2 のまま。
Review の本文投影も v2 から行う（最新版へ付け替えない）。
```

### FW05-HIST-02

```text
historical v2 の plan / binding 取得が EMPTY / UNKNOWN / FETCH_FAILED の場合、
v3 へ fallback しない。
unresolved / fail-closed とする。
```

## 5. TraceRef relation（LOCKED）

- `SupportRecordTraceRef` を `ProcedureRecord` と二重正本にしない。
- 必要なら `ProcedureRecord` から TraceRef 形を **導出**する。
- TraceRef を ProcedureRecord 本体の代替にしない。

## 6. Explicit OUT / still NOT AUTHORIZED

```text
OUT:
  ProcedureRecord 契約コード実装
  FIELD-WORKFLOW UI
  SharePoint adapter / list / column mutation
  Deploy / App Catalog / production write
  #352 Close / #347 Close / #299 Close
  A1 procedure body schema
  AbcRecord / Observation 拡張
  ExecutionRecord 破壊的変更
```

## 7. Next gates

```text
1. This Decision docs PR — Fresh Review → Ready → Merge
2. Optional: min-shape design lock mirror（if needed before code）
3. Issue #352 契約実装 GO — separate Human GO
4. FIELD-WORKFLOW UI — after A+B contracts allow
```

## 8. Stop condition

```text
Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO
  UI / Deploy / SharePoint / closes = NO-GO
```
