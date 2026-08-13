## 目的

FIELD-WORKFLOW-1 assessment（PR #345）および契約 Issue A（#347）完了後に残る **CONTRACT GAP** のうち、

**ProcedureRecord binding + result vocabulary + dual clocks + historical binding（FW-05）**

を Issue A と分離して定義・実装するための契約 Issue とする。

本Issueは起票・設計境界の固定から開始する。**起票時点では契約実装・FIELD-WORKFLOW UI・Deploy・SharePoint write・#299 Close・#347 Close は含まない。**

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
assessment: docs/architecture/field-workflow-1-assessment.md
Issue A: #347
Issue A Selection: Decision-FIELD-WORKFLOW-CONTRACT-A-OPTION-A2-1 = SELECTED / LOCKED
Issue A design: Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1 = DESIGN LOCKED
Issue A implementation: SupportPlanVersionProcedureBinding MERGED（PR #350）
Schema (A): severe-behavior-support.support-plan.version-procedure-binding @ 1.0.0
observed main (post-#350 tip at filing design): 423eba2…
FIELD-WORKFLOW-1 recommendation (remaining): CONTRACT GAP for ProcedureRecord path
Target PR (when Human GO): procedure-record-contracts
```

## Why this Issue next

Issue A で固定・実装済み:

```text
planId + planVersion  ↔  ProcedureId + ProcedureVersion
（SupportPlanVersionProcedureBinding / ApprovedProcedureReference reuse）
```

未充足（FIELD-WORKFLOW success criteria）:

```text
支援手順記録が実施時点の plan + procedure に結び付く
結果（手順どおり / 一部変更 / 実施できなかった）を作文なしで残せる
performedAt と recordedAt を混同しない
計画版が進んでも過去記録を新版へ付け替えない（FW-05）
```

これらは Issue A の binding だけでは閉じない。**別 Issue B** で扱う。

## Upstream prerequisites（must already be true）

1. A2 SELECTED / LOCKED — 手順本文は presentation projection。
2. `SupportPlanVersionProcedureBinding` が存在する（四値 + org/site/user scope）。
3. 表示本文は記録または手順解決に使った `planVersion` から投影し、最新版へ付け替えない。
4. `ApprovedProcedureReference` を壊さない。
5. `ExecutionRecord.Procedure` を本Issueで再定義しない（合成するなら明示 DEC）。

## 担当範囲（Issue B only）

### Must decide（DOMAIN DECISION REQUIRED — 推測で確定しない）

1. **正式型名 / Schema ID**
   - 作業名候補: `ProcedureRecord`（未ロック）
   - Schema ID / Schema Version（DEC-1）は Human Decision 後に固定
2. **既存契約との関係**
   - 新規型 vs `ExecutionRecord` + `SupportRecordTraceRef` 合成 vs `AbcRecord` 拡張
   - 合成する場合、破壊的変更を避ける互換方針
3. **result vocabulary**
   - 候補: 手順どおり / 一部変更 / 実施できなかった
   - 「一部変更」「実施できなかった」を職員失敗として扱わないこと（UI は後続。契約意味を先に固定）
4. **dual clocks**
   - `performedAt`（支援実施）と `recordedAt`（記録作成）の採用・型・必須/任意
   - 既存 `ExecutionRecord.LocalDate` / `AbcRecord.occurredAt` / `SupportRecordTraceRef.recordedAt` との関係
5. **recordedBy** の識別子境界（role 語彙を新設しない）
6. **FW-05 不変条件**の具体テスト（v2 期間の記録が v3 Active 後も v2 に bind）
7. **idempotency / save 5-state** 接続境界（既存 fail-closed を弱めない）

### In scope after Human Decisions

- ProcedureRecord（または同等）の契約型・DTO・validator
- 必須参照: OrganizationId / SiteId / UserId / planId / planVersion / ProcedureId / ProcedureVersion
- result vocabulary の契約表現
- performedAt / recordedAt（採用する場合）と recordedBy
- FW-05 historical binding 不変条件の契約テスト / synthetic fixtures
- Issue A binding との整合（record の四値が binding 解決と矛盾しないこと）

### Explicit OUT of scope

```text
SupportPlanVersionProcedureBinding の再設計（Issue A 正本）
手順本文の契約昇格（A1）— A2 維持
FIELD-WORKFLOW UI / 「この手順を記録」導線
ABC / Observation の業務意味変更（明示 DEC なしに拡張しない）
live SharePoint list/column mutation
Deploy / App Catalog / production write
Issue #347 Close / Issue #299 Close
生活介護個別支援計画ほか FIELD-WORKFLOW-1 out-of-scope 領域
```

## 正本境界

```text
本Issue（契約 Issue B）:
ProcedureRecord（または同等）、result、dual clocks、FW-05、Schema 方針

#347 / Issue A:
SupportPlanVersionProcedureBinding（既存正本）

contracts-v1 ApprovedProcedureReference / ExecutionRecord:
破壊しない。合成する場合は互換 DEC 必須

SupportRecordTraceRef / HD-RA-02:
plan version 追跡意図との整合を確認（同一視はしない）

FIELD-WORKFLOW UI（候補 C）:
A/B 後の別ゲート

#68 / #69:
関連 UI Issue。本Issueで auto-close しない
```

## Dependencies

```text
Upstream:
- PR #345 assessment（MERGED）
- #347 Issue A + A2 Selection + min-shape design + PR #350 binding implementation（MERGED）

Blocks:
- FIELD-WORKFLOW UI 実装開始（候補 C）
- FW-03/04/05/06 success criteria の契約完了

Related (do not auto-close):
- #68 field-ui
- #69 recording-ui
- #347 Contract Issue A
```

## 必須成果（実装 GO 前でも固定するもの）

- [ ] 正式型名 / Schema ID / Schema Version 方針（DEC-1）
- [ ] 新規 vs 合成（ExecutionRecord / TraceRef / AbcRecord）の Human Decision
- [ ] result vocabulary の契約値
- [ ] performedAt / recordedAt / recordedBy の採用と意味
- [ ] FW-05 不変条件の受け入れシナリオ（fixture ID 付き）
- [ ] Issue A binding との参照整合ルールを1段落で固定
- [ ] UI（候補 C）へ渡す前提を1段落で固定

## 実装開始条件（Human GO）

```text
Implementation Start: NO-GO until explicit Human GO on this Issue
Design lock of type/result/clocks: required before implementation
SharePoint / M365 / Entra / Deploy / real data: NO-GO
FIELD-WORKFLOW UI: NO-GO
#347 Close / #299 Close: NO-GO
Ready / Merge of implementation PR: HUMAN-ONLY
```

## 完了条件（この Issue 自体・段階的）

### Filing / design stage

- [ ] Human Decisions（型・合成方針・result・clocks）が記録されている
- [ ] FW-05 受け入れシナリオが文書化されている
- [ ] Issue A 正本を壊す変更を含まない
- [ ] UI / Deploy / SharePoint に踏み込んでいない

### Implementation stage（別 Human GO 後）

- [ ] 契約型・validator・DTO・tests が MERGED
- [ ] FW-05 不変条件テストが PASS
- [ ] 既存 ExecutionRecord / ApprovedProcedureReference 境界が維持されている

## 現在判定

```text
Filing design: THIS PACKET / ISSUE
Design source: FIELD-WORKFLOW-1 assessment + Issue A handoff §6
Domain Decision: REQUIRED（type / composition / result / clocks）
Implementation: HOLD / NO-GO
Tests executed: 0（Issue B）
Production: NO-GO
Next after design lock: 契約実装 GO（別途）→ その後 FIELD-WORKFLOW UI
```

## 禁止

- Issue A binding を破壊・本文付き SupportProcedure へ戻すこと
- 未決のまま ProcedureRecord 実装を開始すること
- 「一部変更」「実施できなかった」を失敗ステータスとして契約化すること
- FIELD-WORKFLOW UI / Deploy / SharePoint / #299 / #347 Close を本Issueに混ぜること
