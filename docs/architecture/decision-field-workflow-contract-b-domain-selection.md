# FIELD-WORKFLOW Contract Issue B — Domain Decision Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-WORKFLOW-CONTRACT-B-DOMAIN-1
Kind: Human Selection packet（Issue #352 Domain Decisions）
Status: READY FOR HUMAN SELECTION GO（NOT LOCKED）
Issue: #352（契約 Issue B 正本）
Date: 2026-08-13

Upstream:
  Issue A #347 / A2 SELECTED / LOCKED
  SupportPlanVersionProcedureBinding MERGED（PR #350）
  Issue B filing packet MERGED（PR #351）
  Issue #352 body = filing packet full text

Baseline main tip at packet creation:
  7c11600（Merge PR #351）

Recommended package ID: B-PKG-1（下記）
Agent auto-select / auto-lock: FORBIDDEN
Implementation Start: NOT AUTHORIZED
FIELD-WORKFLOW UI / Deploy / SharePoint / #299 / #347 Close: NOT AUTHORIZED
```

## 0. How to lock

Human が次のいずれかで Selection GO すること。

```text
Issue #352 — Domain Decision Selection GO（B-PKG-1）
```

または個別 Decision 単位の明示 GO。

GO 前は **NOT LOCKED**。本パケットは固定候補の整理であり、採択そのものではない。

---

## 1. Decision units（must fix）

| ID | Unit |
|---|---|
| D1 | 正式型名 / Schema ID / Schema Version |
| D2 | 既存契約との合成方針（新規 vs 合成） |
| D3 | result vocabulary |
| D4 | performedAt / recordedAt / recordedBy |
| D5 | FW-05 historical binding 不変条件 |
| D6 | idempotency / save 5-state 接続境界（関連） |

---

## 2. Recommended package — B-PKG-1

第一候補パッケージ（A2 / Issue A / contracts-v1 非破壊を優先）。

### D1 — 型名 / Schema（候補）

```text
Formal type name: ProcedureRecord
Schema ID:       severe-behavior-support.support-procedure.record
Schema Version:  1.0.0
DTO Version:     = Schema Version = 1.0.0
```

理由:

- filing / assessment の作業名 `ProcedureRecord` と一致。
- Schema は `support-procedure.record`（手順実施記録）。Issue A の `support-plan.version-procedure-binding` と名前空間を分離。
- DEC-1: Schema ID ≠ TS 型名 ≠ SharePoint List 名。

代替（NOT recommended as first）:

- `SupportProcedureRecord`（より冗長）
- Schema を `support-plan.*` 配下に置く（plan binding と記録を混同しやすい）

### D2 — 合成方針（候補）

```text
B-COMP-NEW — SELECT as first candidate
```

**新規契約型 `ProcedureRecord` を導入する。**  
既存型を破壊的に拡張しない。意味・フィールド名は既存契約へ **整列（align）** する。

| Existing | Relation under B-COMP-NEW |
|---|---|
| `ApprovedProcedureReference` | `Procedure` フィールドとして **reuse**（Issue A と同じ） |
| `SupportPlanVersionProcedureBinding` | 記録の四値は binding 解決と矛盾してはならない（参照整合） |
| `SupportRecordTraceRef` | `planId` / `planVersion` / `recordedAt` / `recordedBy` / `RecordId` の命名・意味を整列。TraceRef 自体は置換しない |
| `ExecutionRecord` | 破壊しない。idempotency パターンを **参考再利用**（同一型へのマージはしない） |
| `AbcRecord` | 拡張しない（ABC 意味と支援手順記録を混同しない） |

却下候補:

| ID | Meaning | Why not first |
|---|---|---|
| B-COMP-EXEC | `ExecutionRecord` を拡張して plan/result/clocks を足す | plan 欠落・LocalDate のみ・破壊的変更が大きい |
| B-COMP-ABC | `AbcRecord` を拡張 | 強度行動障害の手順記録を ABC 事象記録へ同一視する |
| B-COMP-WRAP | ExecutionRecord + TraceRef の薄い wrapper のみ | result / dual clocks を載せる場所が曖昧で DEC が増える |

### D3 — result vocabulary（候補）

契約 enum（英語安定コード）。失敗・懲戒意味を持たない。

```text
AS_DESIGNED   // 手順どおり実施
MODIFIED      // 一部変更して実施
NOT_PERFORMED // 実施できなかった
```

規則:

- 3値はいずれも正当な事実記録。
- `MODIFIED` / `NOT_PERFORMED` を error / failed / violation ステータスへ写像しない。
- 表示ラベル（日本語）は presentation。契約正本は上記コード。
- 自由記述の必須化はしない。補足 `note` は **任意**（作文強制を避ける）。

### D4 — dual clocks / recordedBy（候補）

```text
performedAt: required ISO-8601 datetime   // 支援実施日時
recordedAt:  required ISO-8601 datetime   // 記録作成日時
recordedBy:  required non-empty string    // 記録者識別子（role 語彙を新設しない）
```

規則:

- 両時計は別概念（FW-06）。`LocalDate` 単独で `performedAt` の代用にしない。
- 既存 `AbcRecord.occurredAt` / `ExecutionRecord.LocalDate` と同一視しない（整列・変換が必要なら別 DEC）。
- `recordedAt` と `performedAt` の前後関係ハード制約は、根拠不足のため **いまは課さない**（両方が valid datetime であることのみ）。
- TimeZone 意味は既存と同様 `Asia/Tokyo` 基準で解釈する（フィールド追加は必須としない）。

### D5 — FW-05（候補）

不変条件:

```text
ProcedureRecord に保存された planId + planVersion（および ProcedureId + ProcedureVersion）
は、後から Active 計画が新版になっても書き換え・再解決しない。
```

受け入れシナリオ（fixture 設計用）:

```text
FX-FW05-001
  Support Plan v2 Active: effective 2026-06-01 .. 2026-08-14
  Record R2: planVersion=2, performedAt within v2 window
  Support Plan v3 Active from 2026-08-15
  After v3 activation: R2 still validates/resolves as planVersion=2
  Forbidden: R2 appears as v3 / rebound to currentVersion
```

読取時に Active plan の `currentVersion` へフォールバックしない（fail-closed）。

### D6 — idempotency / save 5-state（候補）

```text
Contract record SHOULD carry:
  RecordId
  IdempotencyKey
  PayloadFingerprint
aligned with ExecutionRecord / contracts-v1 submit decisions.

Shell save 5-state vocabulary remains presentation chrome.
This Issue must not weaken fail-closed or collapse save_outcome_unknown.
Live adapter wiring: OUT（別ゲート）
```

### B-PKG-1 minimal field sketch（設計候補・未実装）

```text
OrganizationId
SiteId
UserId
RecordId
IdempotencyKey
PayloadFingerprint
planId
planVersion
Procedure: ApprovedProcedureReference
result: AS_DESIGNED | MODIFIED | NOT_PERFORMED
note?: string                 // optional only
performedAt
recordedAt
recordedBy
```

本文（場面/実施/避ける/補足）は **含めない**（A2 維持）。

---

## 3. Options matrix（summary）

| Unit | First candidate | Alternatives |
|---|---|---|
| D1 | `ProcedureRecord` + `...support-procedure.record` @ 1.0.0 | SupportProcedureRecord; plan.* namespace |
| D2 | B-COMP-NEW（新規型・整列） | EXEC 拡張 / ABC 拡張 / WRAP |
| D3 | AS_DESIGNED / MODIFIED / NOT_PERFORMED | 日本語キーを契約正本にする（非推奨） |
| D4 | performedAt + recordedAt + recordedBy すべて必須 | performedAt 任意; LocalDate のみ |
| D5 | 不変四値 + FX-FW05-001 | 読取時 currentVersion 再解決（禁止候補） |
| D6 | RecordId/Idempotency/Fingerprint 整列 | idempotency なし（非推奨） |

---

## 4. Explicit OUT（unchanged）

```text
OUT until later gates:
  Issue B 契約コード実装
  FIELD-WORKFLOW UI
  SharePoint / Deploy / production write
  #352 Close / #347 Close / #299 Close
  A1 procedure body schema
```

---

## 5. Next gates

```text
1. Human Selection GO on B-PKG-1（or amended package）→ SELECTED / LOCKED
2. Optional: design-lock doc for ProcedureRecord min shape（mirror Issue A）
3. Issue #352 契約実装 GO — separate
4. FIELD-WORKFLOW UI — after A+B contracts allow
```

## 6. Stop condition（this packet）

```text
Decision-FIELD-WORKFLOW-CONTRACT-B-DOMAIN-1
= READY FOR HUMAN SELECTION GO
≠ SELECTED / LOCKED
≠ Implementation Start
```
