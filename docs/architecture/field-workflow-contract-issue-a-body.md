## 目的

FIELD-WORKFLOW-1 assessment（PR #345 / main 正本）で判明した **CONTRACT GAP** のうち、最初に閉じるべき契約を定義する。

対象は **SupportProcedure（または同等）と SupportPlanVersion の固定リンク** に限定する。

本Issueは起票・設計境界の固定までとする。**契約実装・Deploy・SharePoint write・FIELD-WORKFLOW UI・#299 Close は含まない。**

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
assessment: docs/architecture/field-workflow-1-assessment.md
assessment merge: PR #345
observed main (post-merge tip at filing): 954d334…
FIELD-WORKFLOW-1 recommendation: B. HOLD — CONTRACT GAP
Target PR (when Human GO): support-procedure-contracts
```

## Why this Issue first

Assessment binding verdict:

```text
SupportPlan (EXISTS)
  └── SupportPlanVersion (EXISTS)
       ✗ no ProcedureId / procedure entity link

ApprovedProcedureReference (EXISTS: ProcedureId + ProcedureVersion)
  ✗ not linked to planId + planVersion
```

Issue #26 は SupportPlan / SupportPlanVersion のみ。#68 は「#26 に支援手順契約が含まれる」前提だが、支援手順エンティティは未着地。

FIELD-WORKFLOW UI（候補 C）および ProcedureRecord（候補 B）の前に、**計画版 ↔ 手順版の正本リンク**が必要。

## 担当範囲（Issue A only）

### Must decide (DOMAIN DECISION REQUIRED)

`contracts-v1.md` 現行:

> 支援手順は、手順本文ではなく、`APPROVED`状態の`ProcedureId`と`ProcedureVersion`だけを参照する。

FIELD-WORKFLOW-1 FW-01 は現場向けに:

```text
場面
↓
実施する支援
↓
避ける対応
↓
必要な補足
```

を要求する。

Human Decision が必要な分岐:

1. **Option A1** — SupportProcedure 契約に手順本文（場面 / 実施 / 避ける / 補足）を持つ
2. **Option A2** — 契約は id/version + plan link のみ。本文は presentation projection（例: plan `supportMethods` / `precautions`）とし、DEC で固定
3. **Option A3** — 別案（Human 提示）

本Issueでこの分岐を **推測で確定しない**。未決のまま実装開始しない。

### In scope after Human Decision

- `planId` + `planVersion` ↔ `ProcedureId` + `ProcedureVersion` の固定関連
- SupportProcedure（または同等の契約名・Schema ID）の型境界
- OrganizationId / SiteId / UserId 分離の維持
- APPROVED 参照との整合（既存 `ApprovedProcedureReference` を壊さない）
- Active plan uniqueness と procedure set の版関係の説明
- SharePoint 非依存の domain/contracts 境界
- 合成 fixture での user ↔ plan version ↔ procedure version グラフ（record は Issue B）

### Explicit OUT of scope

```text
ProcedureRecord / 支援手順記録本体
result vocabulary（手順どおり / 一部変更 / 実施できなかった）
performedAt / recordedAt dual clocks
historical binding 不変条件テスト（FW-05）— Issue B
FIELD-WORKFLOW UI / 「この手順を記録」導線
ABC / Observation 契約変更
live SharePoint list/column mutation
Deploy / App Catalog / production write
Issue #299 Close
生活介護個別支援計画ほか FIELD-WORKFLOW-1 out-of-scope 領域
```

## 正本境界

```text
本Issue（契約 Issue A）:
SupportProcedure（または同等）定義、plan-version link、Schema 境界案、DEC 候補

#26 support-plan-contracts:
SupportPlan / SupportPlanVersion（既存正本）

contracts-v1 ApprovedProcedureReference / ExecutionRecord:
既存 procedure id/version 参照（破壊しない）

契約 Issue B（未起票）:
ProcedureRecord binding + result + dual clocks + FW-05

#68 field-ui / FIELD-WORKFLOW UI:
A/B Human GO 後

#22 sharepoint-adapter:
本Issueでは触らない
```

## Dependencies

```text
Upstream:
- PR #345 / field-workflow-1-assessment.md（MERGED）
- #26 SupportPlan / SupportPlanVersion（COMPLETED）

Blocks:
- 契約 Issue B（ProcedureRecord…）
- FIELD-WORKFLOW UI 実装開始

Related (do not auto-close):
- #68 field-ui
- #69 recording-ui
```

## 必須成果（実装 GO 前でも固定するもの）

- [ ] procedure body の归属（A1 / A2 / A3）を Human Decision として記録
- [ ] `planId` + `planVersion` ↔ `ProcedureId` + `ProcedureVersion` の最小契約形を文書化
- [ ] 既存 `ApprovedProcedureReference` / `supportMethods: string[]` との関係を明示
- [ ] Schema ID / Schema Version 方針案（DEC-1 整合）を提示
- [ ] Issue B へ渡す前提（何が揃えば ProcedureRecord を定義できるか）を1段落で固定

## 実装開始条件（Human GO）

```text
Implementation Start: NO-GO until explicit Human GO on this Issue
SharePoint / M365 / Entra / Deploy / real data: NO-GO
FIELD-WORKFLOW UI: NO-GO
Ready / Merge of implementation PR: HUMAN-ONLY
```

## 完了条件（この Issue 自体）

- [ ] Human Decision（A1/A2/A3）が記録されている
- [ ] plan-version ↔ procedure-version link の契約境界が文書化されている
- [ ] Issue B 起票に必要な前提が欠けていない
- [ ] 本Issue範囲外（Record / UI / Deploy）に踏み込んでいない

実装 PR の完了条件は、Human GO 後の実装 Issue/PR で別途固定する。

## 現在判定

```text
Filing: THIS ISSUE
Design source: FIELD-WORKFLOW-1 assessment / PR #345
Domain Decision: REQUIRED (procedure body ownership)
Implementation: HOLD / NO-GO
Tests executed: 0
Production: NO-GO
Next after this Issue design lock: 契約 Issue B filing（別途）
```

## 禁止

- 未決のまま契約実装を開始すること
- presentation-only で procedure entity を偽装して FIELD-WORKFLOW 成功扱いにすること
- Issue B / UI を本Issueに混ぜること
- Deploy / SharePoint write / App Catalog / #299 Close
