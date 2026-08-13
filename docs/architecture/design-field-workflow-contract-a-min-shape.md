# FIELD-WORKFLOW Contract Issue A — Minimal contract shape design lock

```text
repository: yasutakesougo/severe-behavior-support-spfx
Design ID: Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1
Kind: Design lock（Issue #347 / Option A2）
Status: DESIGN LOCKED（docs-only）
Date: 2026-08-13
Issue: #347
Upstream Selection:
  Decision-FIELD-WORKFLOW-CONTRACT-A-OPTION-A2-1 = SELECTED / LOCKED
  docs/architecture/decision-field-workflow-contract-a-option-a2-selection.md
Baseline main tip:
  c98232e（Merge PR #348）

Implementation Start: NOT AUTHORIZED
Contract / schema / domain code mutation: NOT AUTHORIZED
Issue B filing: NOT AUTHORIZED by this design lock alone
FIELD-WORKFLOW UI: NOT AUTHORIZED
Deploy / SharePoint write / App Catalog / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

Option A2 のもとで、Issue #347 の **最小契約形** を実装前に固定する。

本文書は設計正本であり、コード実装許可ではない。

## 2. Minimal contract shape（LOCKED）

### 2.1 Working type name

```text
SupportPlanVersionProcedureBinding
```

意味:

- SupportPlanVersion に、APPROVED 手順参照を結びつける **binding**。
- A2 のため、手順本文エンティティ（SupportProcedure body）ではない。
- TypeScript 型名・SharePoint List 名と Schema ID を同一視しない（DEC-1）。

### 2.2 Required fields

```text
OrganizationId: string          // non-empty
SiteId: string                  // non-empty; authorized site token boundary unchanged
UserId: string                  // non-empty; must match linked SupportPlanVersion.UserId
planId: string                  // non-empty; aligns with SupportPlanVersion.planId
planVersion: number             // integer >= 1; aligns with SupportPlanVersion.version
Procedure: ApprovedProcedureReference
  ProcedureId: string
  ProcedureVersion: string
  ApprovalState: "APPROVED"     // only APPROVED allowed
```

論理リンク:

```text
planId + planVersion  ↔  Procedure.ProcedureId + Procedure.ProcedureVersion
```

### 2.3 Explicitly excluded fields

```text
場面 / 実施する支援 / 避ける対応 / 補足（本文）
supportMethods / precautions の複製
result vocabulary
performedAt / recordedAt / recordedBy
RecordId / IdempotencyKey / PayloadFingerprint
LocalDate
SharePoint list/column names
```

本文表示は A2 Selection の presentation projection 規則に従う（契約値にしない）。

### 2.4 Identity / uniqueness（design）

同一 `OrganizationId` + `SiteId` 内で、次を一意候補とする。

```text
(planId, planVersion, Procedure.ProcedureId, Procedure.ProcedureVersion)
```

規則:

- 同一 planVersion に複数 Procedure を結び付けてよい（手順セット）。
- 同一キーの重複 binding は受理しない（実装時 fail-closed）。
- `UserId` はリンク先 `SupportPlanVersion.UserId` と一致必須。
- `planId` / `planVersion` が存在しない・照会失敗のとき、成功へ丸めない。

### 2.5 Cardinality（design）

```text
SupportPlanVersion (1) ──binding── (*) ApprovedProcedureReference
```

- Binding は planVersion 側から手順参照へ張る。
- `ExecutionRecord.Procedure` を置き換えない（後述）。

## 3. Relation to ApprovedProcedureReference（LOCKED）

```text
Reuse: YES
Replace: NO
Extend with body fields: NO
```

| Existing | Relation |
|---|---|
| `ApprovedProcedureReference` | Binding の `Procedure` フィールドとして **そのまま再利用** |
| `ExecutionRecord.Procedure` | 既存の実施記録参照。本 binding で破壊・再定義しない |
| `contracts-v1.md`「手順本文ではなく id/version のみ」 | **維持** |

追加規則:

1. Binding は `ApprovalState = "APPROVED"` 以外を持たない（型上 `ApprovedProcedureReference` を使う）。
2. Binding は Procedure 本文・承認ワークフロー・新 ApprovalState 語彙を導入しない。
3. 現場の「この計画版の実施手順」解決は Binding 経由とし、ProcedureId だけで最新計画本文へ再解決しない（A2 §3.4）。

## 4. Schema ID / Schema Version 方針（LOCKED design values）

DEC-1 に従う。

```text
Schema ID（安定識別子）:
  severe-behavior-support.support-plan.version-procedure-binding

Schema Version（SemVer）:
  1.0.0

DTO Version:
  = Schema Version
  = 1.0.0
```

命名理由:

- `support-plan.` 配下: planVersion への付帯 binding であり、手順本文エンティティではない（A2）。
- `version-procedure-binding`: plan version ↔ procedure 参照の結合を示す。
- SharePoint List 名 / TS 型名と同一視しない。

DTO envelope（実装時の形・いまは設計のみ）:

```text
{
  schemaId: "severe-behavior-support.support-plan.version-procedure-binding"
  schemaVersion: "1.0.0"
  dtoVersion: "1.0.0"
  data: SupportPlanVersionProcedureBinding
}
```

本方針のコード定数追加は **Implementation GO 後**。

## 5. Alignment with existing plan/version contracts

| Field | Aligns with |
|---|---|
| `planId` | `SupportPlanVersion.planId`, `SupportRecordTraceRef.planId` |
| `planVersion` | `SupportPlanVersion.version`（integer >= 1） |
| `UserId` | `SupportPlanVersion.UserId` / plan scope |
| `OrganizationId` / `SiteId` | 既存契約の組織・事業所分離 |
| `Procedure.*` | `ApprovedProcedureReference` |

`SupportPlan.PlanId`（PascalCase）との表記差は既存 Issue #42 境界を踏襲し、本 binding は **version 側の `planId`** に合わせる。

## 6. Prerequisites handed to Issue B（LOCKED）

Issue B（ProcedureRecord binding + result + dual clocks + historical binding）は、次を前提にしてよい。

### 6.1 Must already be true（design）

1. A2 SELECTED / LOCKED（本文は presentation projection）。
2. 本最小契約形: record が参照すべき四値は

   ```text
   planId
   planVersion
   ProcedureId
   ProcedureVersion
   ```

   （OrganizationId / SiteId / UserId も記録スコープに必要）。
3. 表示本文は **記録または手順解決に使った planVersion** から投影し、最新版へ付け替えない（FW-05）。
4. `ApprovedProcedureReference` を壊さない。

### 6.2 Issue B must still decide（not fixed here）

```text
ProcedureRecord の正式型名 / Schema ID
result vocabulary（手順どおり / 一部変更 / 実施できなかった）
performedAt vs recordedAt の採用と意味
recordedBy
ExecutionRecord / SupportRecordTraceRef / AbcRecord との合成 or 新規
idempotency / save 5-state 接続
FW-05 不変条件テストの具体 fixture
```

### 6.3 Issue B filing gate

```text
Issue B 起票: 別 Human GO
Issue B は本 design lock を入力にしてよい
ただし本 design lock ≠ Issue A 実装完了 ≠ Issue B 実装認可
```

## 7. Validation sketch（implementation later）

実装 GO 後に契約テストへ落とす想定（いまはコードなし）:

- 必須フィールド欠落を拒否
- `planVersion < 1` または非整数を拒否
- `ApprovalState !== "APPROVED"` を拒否
- 空文字の id を拒否
- 同一 uniqueness key の重複を拒否
- schemaId / schemaVersion / dtoVersion 不一致を拒否
- UserId と planVersion.UserId の不一致を拒否（repository 規則として）

## 8. Explicit OUT

```text
OUT:
  契約・domain・schema のコード実装
  SharePoint mapping / adapter
  SupportProcedure body schema（A1）
  ProcedureRecord（Issue B）
  FIELD-WORKFLOW UI
  synthetic fixture グラフの本番コード投入（実装 GO 後）
  Deploy / production write
  #347 Close / #299 Close
```

## 9. Next gates

```text
1. Human review of this design lock（Fresh Review / Ready → Merge）
2. Issue #347 に design lock 参照を記録（Human comment; agent issue write may be 403）
3. Issue A 契約実装 GO — 別 Human GO
4. Issue B filing GO — 別 Human GO
5. FIELD-WORKFLOW UI — A/B 後
```

## 10. Stop condition

```text
Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1
= DESIGN LOCKED（docs-only）

HOLD:
  Implementation Start = separate Human GO
  Issue B = separate filing GO
  UI / Deploy / SharePoint / #299 = NO-GO
```
