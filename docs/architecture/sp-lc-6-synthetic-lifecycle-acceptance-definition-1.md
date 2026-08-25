# SP-LC-6 SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445
Unit: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1
Kind: acceptance exact-slice definition only
Definition baseline main: 4dd41c4ff27265dba09b6872727cc782244715b6
Definition Start GO: RECEIVED
Implementation / acceptance execution: NOT AUTHORIZED
Code / fixture / schema mutation: NOT AUTHORIZED
Issue mutation: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. このDefinitionが固定する問い

現在のmainに既に存在するSupportPlan lifecycleの部品を、一つの完全合成identity graphとして最後まで追跡できるかを検証する。

検証対象は、新機能の追加ではなく、既存実装が同じ履歴文脈を保ったまま接続されていることのacceptanceである。

```text
SupportPlanVersion
  ↓
Procedure
  ↓
ProcedureRecord
  ↓
Observation
  ↓
Review
  ↓
continue
  or
new-version outcome
```

このDefinitionは、acceptanceで不足が見つかった場合に、その不足をテスト用fixtureだけで埋めてPASSへ変換することを禁止する。

不足がproduct/domain behaviorにある場合は`GAP_FOUND`として停止し、別Exact Slice候補へ分離する。

## 2. Authorityとcurrent-main補正

Parent lifecycle authorityは`#419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1`である。

Locked selectionは次のとおりである。

```text
D1=B
D2=B
D3=B
D4=A
D5=B
D6=A
```

このacceptanceはD1-D6を再決定しない。

特に次を維持する。

```text
D4:
過去SupportPlanVersionを上書きしない。
変更は新versionとして扱う。
Procedure / ProcedureRecordのhistorical bindingを保持する。

D5:
約3か月は固定90日失効ではない。
期限超過だけで計画を無効化しない。

D6:
Observation / ProcedureRecordをSupportPlanVersionのReview材料として関連付ける。
観察不足だけで計画を自動無効化しない。
```

Issue #445本文の`#443 D6 OPEN / NOT CONSUMED`は現在mainに対してstaleである。

D6はPR #457でMERGED済みであり、historical ProcedureRecord identity、planId、planVersion、Observation evidenceのfail-closed associationがmainに存在する。

D5 semantic evidenceもPR #456でMERGED済みである。

Planning-PCの主要残余も既存reassessmentでlist、KPI、detail、section navigationがCONSUMEDとして整理されている。

したがって本Definitionでは、これらを再実装対象にしない。

## 3. Acceptanceに使用する既存証跡

### 3.1 Planning identity graph

`planning-pc-demo-1-fixture-catalog.md`は、次のsynthetic graphを既に持つ。

```text
OrganizationId: synthetic-org-001
SiteId: SITE-ISG
UserId: user-a
PlanId: synthetic-plan-001
Current version: 3
Historical version: 2
Historical procedure: synthetic-procedure-p2 / synthetic-procedure-p2-v1
Historical record: synthetic-proc-rec-v2-001
```

Historical recordはplanVersion 2へ固定され、current Active version 3へ付け替えない。

### 3.2 Review due evidence

`SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1`は、初回anchor、継続anchor、caller-supplied reviewDueDate、calendar-month noticeを既に検証している。

このacceptanceでは固定90日やhard overdueを追加しない。

### 3.3 Observation -> Review evidence

`SP-LC-4 D6 Observation -> Review Association`は、historical ProcedureRecord、planId、planVersionを一致条件としてObservation evidenceをReviewへ投影する。

Missing、unknown、fetch-failed、identity mismatch、version mismatchはunresolvedのままfail-closedにする。

Later Active versionへのfallbackは禁止されている。

### 3.4 Review -> next-version presentation evidence

`SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1`は、Review材料から次版の考え方へ到達するpresentation evidenceを持つ。

ただし既存証跡は明示的に`versionPersistenceAuthorized=false`かつ`draftWorkflowAuthorized=false`である。

したがって、次版の概念表示だけを「新version作成が実装済み」と数えてはならない。

## 4. Acceptance result model

結果は次の3状態だけとする。

```text
PASS
GAP_FOUND
ENVIRONMENT_BLOCKED
```

`PASS`は、全必須checkpointを既存production/pure-domain behaviorまたは既存presentation projectionを通して再現できた場合だけ許可する。

`GAP_FOUND`は、必要なproduct/domain behaviorが存在しない、またはidentity chainを既存behaviorだけで証明できない場合に使用する。

`ENVIRONMENT_BLOCKED`は、必要なローカルtest/browser実行環境が利用できず、checkpoint自体を観測できない場合に使用する。

Skipped、未実行、fixture-onlyの作り込みをPASSへ変換しない。

## 5. 必須Acceptance checkpoints

### AC-1 SupportPlanVersion -> Procedure

Historical planVersion 2とProcedure p2のbindingを同じidentity graphで確認する。

Later Active version 3へbindingを変更しない。

### AC-2 Procedure -> ProcedureRecord

ProcedureRecord `synthetic-proc-rec-v2-001`が実行時のhistorical plan/procedure versionへ固定されていることを確認する。

Current Active planへの再bindingを禁止する。

### AC-3 ProcedureRecord -> Observation

D6 associationを使用して、同じhistorical record contextに属するObservationだけがReview materialになることを確認する。

RecordId、planId、planVersionの不一致はfail-closedにする。

### AC-4 Observation -> Review

Review surfaceまたはReview projectionが、associated Observationをhistorical context付きで表示できることを確認する。

Unresolvedとsuccessful-emptyを同一表示にしない。

### AC-5 Review timing semantics

Review materialとreview timing presentationがD5 accepted semanticsを維持することを確認する。

固定90日失効、観察不足による自動無効化、hard dueを導入しない。

### AC-6 Continue outcome

Review後に「継続」を選ぶ場合の意味が、既存versionの履歴を上書きせず、不要な新versionを作成したと見せないことを確認する。

継続結果を表現する既存product/domain behaviorがない場合は`GAP_FOUND`とする。

Acceptance用fixtureだけで継続機能を発明してはならない。

### AC-7 New-version outcome

Review後に「変更」を選ぶ場合、旧SupportPlanVersionを保持したまま新versionへ進むbehaviorを既存product/domain pathで証明できることを確認する。

次版の概念表示だけではAC-7 PASSとしない。

テスト専用v4 fixtureを追加しただけでもAC-7 PASSとしない。

既存mainに実行可能なnew-version behaviorが存在しない場合は`GAP_FOUND`として、後続の別Exact Sliceへ切り出す。

### AC-8 Fail-closed chain

次のいずれかが欠損または不一致なら、後段へ正常成功として流さない。

```text
OrganizationId
SiteId
UserId
PlanId
planVersion
ProcedureId
ProcedureVersion
ProcedureRecord RecordId
Observation identity/context
```

### AC-9 No mutation boundary

Acceptance実行中のSharePoint、M365、Entra、App Catalog、LIVE WRITEは0件であることを確認する。

Production Bindingを有効化しない。

## 6. Future implementation exact changed-area

別Human `Implementation Start GO`が与えられた場合でも、acceptance layerの追加だけを許可する。

変更可能範囲を次に固定する。

```text
tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
```

既存product、domain、fixture、SPFx presentation、smoke harnessはread-only inputとして利用する。

既存smoke runnerは次を再利用候補とする。

```text
spfx/smoke/planning-pc-demo-1/run-smoke.mjs
spfx/smoke/demo-ux-6/run-smoke.mjs
spfx/smoke/support-plan-review-new-version-demo-1/run-smoke.mjs
```

Acceptance runnerは既存runnerの結果とroot graph contractを集約して、checkpointごとのprovenanceを出力する。

既存runnerやproduct codeを変更しなければacceptanceできない場合は、その事実を`GAP_FOUND`とする。

## 7. Future implementationで許可すること

```text
existing fixture / projection / production behaviorのread-only利用
cross-check用contract acceptance test追加
既存smoke runnerのread-only実行
結果集約runner追加
machine-readable checkpoint result生成
acceptance evidence document作成
```

Acceptance runnerは、少なくとも次を記録する。

```text
expectedMainSha
observedMainSha
shaMatch
checkpoint id
result
source path / runner
test count
browser smoke result
mutationAttempted
liveWriteAuthorized
residual gap
```

## 8. Explicit OUT / FORBIDDEN

```text
SupportPlan / SupportPlanVersion contract変更
Procedure / ProcedureRecord contract変更
Observation schema / DTO変更
Review semantics変更
D1-D6再決定
approvedBy / approvedAt rename
status enum変更
new-version product behaviorの実装
continue product behaviorの実装
テスト専用能力をproduct能力としてPASS扱い
fixture追加でmissing capabilityを隠すこと
existing smoke harness変更
SharePoint adapter変更
persistence実装
Production Binding
LIVE WRITE
SharePoint / M365 / Entra mutation
App Catalog / Deploy
Issue #445本文更新・close
Ready / Merge
```

## 9. Verification requirements for future acceptance execution

実行時はbaseline SHAとobserved SHAを比較する。

SHAが一致しない場合はacceptanceを継続せず、current-main residual reassessmentへ戻す。

最低限、次を実行対象とする。

```text
root focused contract acceptance test
root existing planning graph contract tests
SPFx Heft tests relevant to D5 / D6 / SupportPlan presentation
planning-pc-demo-1 browser smoke
demo-ux-6 browser smoke
support-plan-review-new-version-demo-1 browser smoke
```

各既存runnerの既存PASSを文書から転記するだけでは不十分である。

Acceptance execution時のcurrent SHAで再実行し、実行結果を記録する。

## 10. Pass criteria

`PASS`にはAC-1からAC-9の全項目が必要である。

特にAC-6またはAC-7が既存behaviorで証明できなければ、他が全てPASSでもoverallは`GAP_FOUND`とする。

`GAP_FOUND`はacceptance失敗を隠す状態ではなく、次に必要なproduct Exact Sliceを決めるための正常な出力である。

## 11. Rollback boundary

Definition publicationのrollbackはこの文書だけを戻す。

Future acceptance implementationのrollbackも、acceptance test、runner、evidenceの3ファイルだけを戻す。

既存product/domain/fixture/smokeを変更しないため、rollbackで業務意味や既存UIを変えない。

## 12. Gate

```text
Definition Start GO: CONSUMED
Definition: COMPLETE / READY FOR INDEPENDENT REVIEW

Implementation Start:
NOT AUTHORIZED

Acceptance execution:
NOT AUTHORIZED

Issue mutation:
NOT AUTHORIZED

Ready / Merge:
NOT AUTHORIZED

Deploy / Production Binding / LIVE WRITE:
FORBIDDEN

NEXT:
Independent Definition Review
```
