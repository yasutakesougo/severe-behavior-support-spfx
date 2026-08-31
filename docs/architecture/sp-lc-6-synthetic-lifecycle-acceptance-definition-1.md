# SP-LC-6 SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Issue: #445
Unit: SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1
Kind: acceptance exact-slice definition only
Definition baseline main: 4dd41c4ff27265dba09b6872727cc782244715b6
Definition baseline role: HISTORICAL PROVENANCE ONLY
Definition Start GO: RECEIVED
Definition Review-1: CORRECTION REQUIRED / P1=2
Definition Correction-1: APPLIED
Independent Definition Re-Review-2: CORRECTION REQUIRED / P1=1 / P2=1
Definition Correction-2: APPLIED / PUBLISHED (PR #509 MERGED)
Implementation publication: MERGED / CONSUMED (PR #510)
PR #511 Independent Correction Review: CORRECTION REQUIRED / P1=1
Definition Correction-3 Start GO: RECEIVED
Definition Correction-3: APPLIED / PUBLISHED (PR #512 MERGED)
Independent Correction Re-Review: PASS / LOCKABLE
PR #511 execution-authority correction: MERGED / CONSUMED
Acceptance Execution GO: CONSUMED
Full acceptance execution: EXECUTED / overallResult = GAP_FOUND
DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1: RECORDED
AC-3 / AC-5 / AC-8 execution result: GAP_FOUND / STALE SMOKE EXPECTATION
AC-4 / AC-7 / AC-9 execution result: GAP_FOUND / separate residuals
Acceptance evidence recording: MERGED / CONSUMED (PR #513)
PR #515 stale-smoke Exact Slice: MERGED / CONSUMED
AC-3 / AC-5 / AC-8 stale-smoke remediation: COMPLETE / CONSUMED
DEMO-UX-6 smoke: PASS / 9 of 9
DEFINITION-STATUS-SYNC-2 Parent Definition Status Synchronization GO: RECEIVED / CONSUMED
mutation-time current main: 66219ae16c3f2ca1ebee7bbe5b479c8286ac79e8
Acceptance re-execution: NOT AUTHORIZED
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
continue invariant
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

## 4. Execution base authority / Preflight / Acceptance result model

### 4.1 Definition baselineとexecution baseを分離する

`Definition baseline main`は、このDefinitionを作成した時点のmainを示すhistorical provenanceである。

`Definition baseline main`をfuture acceptance executionの`expectedMainSha`として自動使用してはならない。

PR #509がmainへmergeされたため、Definition publicationだけでもmain SHAは`4dd41c4ff27265dba09b6872727cc782244715b6`から進んだ。

したがってfuture Implementation Start / acceptance executionでは、Definition publication baselineとは別にexecution base authorityを取得する。

`expectedMainSha`のauthority sourceは工程によって異なる。Implementation Start GOとAcceptance Execution GOは別のHuman GOである。

#### 4.1.1 Implementation Start GO

Human `Implementation Start GO`は、acceptance layerのimplementation publication専用である。

このGOは最低限、次をbindする。

```text
Unit:
SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-IMPLEMENTATION-1

Definition:
SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1

expectedMainSha:
<GO時点でHumanが承認したpost-merge current-main SHA>

changed-area:
tests/contracts/sp-lc-6-synthetic-lifecycle-acceptance.test.ts
scripts/acceptance/run-sp-lc-6-synthetic-lifecycle-acceptance.mjs
docs/architecture/sp-lc-6-synthetic-lifecycle-acceptance-evidence.md
```

この`expectedMainSha`はimplementation publication preflight専用である。

PR #510 merge後、このImplementation Start GOはCONSUMEDである。CONSUMEDなImplementation Start GOは、future acceptance executionの`expectedMainSha` authorityではない。

#### 4.1.2 Acceptance Execution GO

AC-1からAC-9を開始するfuture acceptance executionでは、`expectedMainSha`は別Human `Acceptance Execution GO`で明示的に承認されたcurrent-main SHAとする。

Human `Acceptance Execution GO`は最低限、次をbindする。

```text
Unit:
SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-IMPLEMENTATION-1

Definition:
SP-LC-6-SYNTHETIC-LIFECYCLE-ACCEPTANCE-DEFINITION-1

expectedMainSha:
<GO時点でHumanが承認したpost-merge current-main SHA>

acceptanceExecutionAuthority:
<non-empty Human Acceptance Execution GO reference>
```

Implementation Start以降にmainが進んでいる場合は、Acceptance Execution GO前にcurrent-main residual reassessmentを行い、その結果に基づくSHAを承認する。

post-merge Acceptance Execution GOは、Implementation Start GOのconsumed SHAとは異なるcurrent-main SHAをbindしてよい。

`expectedMainSha`も`acceptanceExecutionAuthority`も、次から推定してはならない。

```text
Definition baseline main
consumed Implementation Start GO
implementation-time SHA constant
observed current main
repository state
```

Definition publication baseline、implementation-time SHA、execution-authorized SHAが偶然同じである必要はない。

### 4.2 Preflight state

Acceptance resultを計算する前にexecution base preflightを必須とする。

```text
PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED
PRECHECK_BASE_MATCH
PRECHECK_BASE_MISMATCH_NOT_STARTED
```

Human `Acceptance Execution GO`に`expectedMainSha`または`acceptanceExecutionAuthority`が明示されていない場合は`PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED`とし、acceptance checkpointを開始しない。

CONSUMEDなImplementation Start GOだけでは、このpreflightを進めてはならない。

Execution base authorityが存在する場合だけ、`expectedMainSha`と`observedMainSha`を比較する。

両者が一致する場合だけ`PRECHECK_BASE_MATCH`とし、AC-1からAC-9を実行する。

両者が一致しない場合は`PRECHECK_BASE_MISMATCH_NOT_STARTED`とし、acceptance checkpointを開始しない。

`PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED`と`PRECHECK_BASE_MISMATCH_NOT_STARTED`はacceptance resultではない。

どちらの場合もoverall resultを設定せず、Human authorityまたはcurrent-main residual reassessmentへ戻る。

Definition baseline mainとの不一致だけを理由にpreflightを失敗させてはならない。

### 4.3 Checkpoint result model

Base match後のcheckpoint resultは次の3状態だけとする。

```text
PASS
GAP_FOUND
ENVIRONMENT_BLOCKED
```

`PASS`は、checkpointを既存production/pure-domain behaviorまたは既存presentation projectionを通して確認でき、要求されたinvariantまたはcapabilityが成立した場合に使用する。

`GAP_FOUND`は、必要なproduct/domain behaviorが存在しない、またはidentity chainやrequired invariantを既存behaviorだけで証明できない場合に使用する。

`ENVIRONMENT_BLOCKED`は、必要なローカルtest/browser実行環境が利用できず、checkpoint自体を観測できない場合に使用する。

Skipped、未実行、fixture-onlyの作り込みをPASSへ変換しない。

### 4.4 Overall resultの決定規則

Base match後は、全必須checkpointに必ず1つのresultを付与する。

Overall resultは次の順序で一意に決定する。

```text
1. required checkpointにENVIRONMENT_BLOCKEDが1件以上ある
   -> overall = ENVIRONMENT_BLOCKED

2. ENVIRONMENT_BLOCKEDが0件で、GAP_FOUNDが1件以上ある
   -> overall = GAP_FOUND

3. AC-1からAC-9がすべてPASS
   -> overall = PASS
```

`ENVIRONMENT_BLOCKED`と`GAP_FOUND`が混在する場合、overallは`ENVIRONMENT_BLOCKED`とする。

ただし既に確認できた`GAP_FOUND` checkpointは`knownGaps`として保持し、環境復旧後の再実行で失われないようにする。

Acceptance開始後のrequired checkpointに`SKIPPED`や`NOT_RUN`を残してoverallを計算してはならない。

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

### AC-6 Continue invariant

AC-6は、専用の「継続」command、button、persisted outcomeを要求するcapability checkpointではない。

Review後に変更を発生させない場合のobservable invariantとして判定する。

次を確認する。

```text
same Active SupportPlanVersion identity remains in effect
historical SupportPlanVersion is not overwritten
historical Procedure / ProcedureRecord binding remains unchanged
no new SupportPlanVersion is fabricated merely to express continuation
no existing record is rebound to a later version
```

専用の「継続」操作が存在しないことだけを理由に`GAP_FOUND`としてはならない。

既存behaviorが上記invariantに反する場合は`GAP_FOUND`とする。

必要な状態を実行環境上で観測できない場合は`ENVIRONMENT_BLOCKED`とする。

Acceptance用fixtureだけで「継続」機能を発明してはならない。

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

PR #510はそのImplementation Start GOをCONSUMEDした。後続のexecution-authority correctionおよびevidence更新も、同じ3ファイル境界に限定する。

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

ただしAC-6は専用continue commandの存在を要求しないため、専用continue implementationがないこと自体をgapにしてはならない。

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
definitionBaselineMainSha
expectedMainSha
observedMainSha
shaMatch
preflightState
implementationStartAuthority
acceptanceExecutionAuthority
checkpoint id
checkpoint result
source path / runner
test count
browser smoke result
mutationAttempted
liveWriteAuthorized
knownGaps
overallResult
```

`definitionBaselineMainSha`はprovenanceとして記録するだけで、`shaMatch`判定には使用しない。

`implementationStartAuthority`はhistorical implementation provenanceとして記録するだけで、future `shaMatch`判定には使用しない。

`shaMatch`は`expectedMainSha === observedMainSha`だけを表す。

`expectedMainSha`と`acceptanceExecutionAuthority`はHuman `Acceptance Execution GO`のauthorityから取得する。

runnerはこれらの値を明示的なHuman-authorized execution inputとして受け取る。repository constant、Definition baseline、consumed Implementation Start GO、observed mainから推定してはならない。

`overallResult`は`PRECHECK_BASE_MATCH`後だけ設定する。

`PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED`または`PRECHECK_BASE_MISMATCH_NOT_STARTED`の場合、`overallResult`は未設定とする。

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
専用continue commandを新しいacceptance requirementとして追加すること
テスト専用能力をproduct能力としてPASS扱い
fixture追加でmissing capabilityを隠すこと
existing smoke harness変更
SharePoint adapter変更
persistence実装
Definition baseline mainをexecution authorityとして自動再利用すること
consumed Implementation Start GOをfuture acceptance execution authorityとして再利用すること
expectedMainShaまたはacceptanceExecutionAuthorityを推定すること
Human Acceptance Execution GOなしにacceptance checkpointを開始すること
Production Binding
LIVE WRITE
SharePoint / M365 / Entra mutation
App Catalog / Deploy
Issue #445本文更新・close
Ready / Merge
```

## 9. Verification requirements for future acceptance execution

Acceptance execution前に、Human `Acceptance Execution GO`から`expectedMainSha`と`acceptanceExecutionAuthority`を取得する。

`Definition baseline main`とconsumed Implementation Start GOはhistorical provenanceとしてのみ保持し、execution preflightの比較対象にはしない。

`expectedMainSha`または`acceptanceExecutionAuthority`が未承認なら`PRECHECK_EXECUTION_BASE_NOT_AUTHORIZED_NOT_STARTED`としてacceptanceを開始しない。

`expectedMainSha`と`acceptanceExecutionAuthority`の両方が承認済みの場合だけ、`expectedMainSha`と`observedMainSha`を比較する。

SHAが一致しない場合は`PRECHECK_BASE_MISMATCH_NOT_STARTED`としてacceptanceを開始せず、current-main residual reassessmentへ戻す。

SHAが一致した場合だけAC-1からAC-9を開始する。

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

Acceptance execution時のexecution-authorized current SHAで再実行し、実行結果を記録する。

## 10. Pass criteria

`PASS`にはAC-1からAC-9の全項目が必要である。

AC-6は専用continue capabilityの存在ではなく、continuation invariantが成立することを要求する。

AC-7は実行可能なnew-version behaviorを要求する。

したがってAC-7を既存behaviorで証明できなければ、他が全て観測可能でもoverallは`GAP_FOUND`とする。

一方、専用continue commandが存在しないことだけではAC-6を`GAP_FOUND`にしない。

`GAP_FOUND`はacceptance失敗を隠す状態ではなく、次に必要なproduct Exact Sliceを決めるための正常な出力である。

Overall resultは§4.4の決定規則だけで算出する。

## 11. Correction-1 traceability

Definition Review-1の指摘を次のように閉じる。

```text
P1-1:
AC-6をdedicated continue capability requirementからobservable invariantへ補正。
専用continue actionがないことだけではGAP_FOUNDにしない。

P1-2:
SHA mismatchをPRECHECK_BASE_MISMATCH_NOT_STARTEDとしてacceptance resultから分離。
ENVIRONMENT_BLOCKED > GAP_FOUND > PASSのoverall precedenceを固定。
混在時のknownGaps保持を固定。
```

このCorrectionはD1-D6の意味を変更しない。

## 12. Correction-2 traceability

Independent Definition Re-Review-2の指摘を次のように閉じる。

```text
P1-3:
Definition baseline mainをhistorical provenanceに限定。
future expectedMainShaを別Human Implementation Start GOで承認されたpost-merge current-main SHAへ分離。
preflightはexpectedMainShaとobservedMainShaだけを比較。
Implementation Start authorityがない場合のNOT_STARTED stateを追加。

P2-1:
PR #509本文をCorrection-2後のcontinuation invariant / execution base authority / preflight stateへ同期する。
```

Correction-2はD1-D6の意味、AC-1からAC-9の業務意味、future changed-areaを変更しない。

## 13. Correction-3 traceability

PR #511 Independent Correction ReviewのP1-1を次のように閉じる。

```text
P1-1:
Locked DefinitionはexpectedMainShaのauthority sourceを
Human Implementation Start GOへ固定していた。

PR #511はfuture execution authorityを
Human Acceptance Execution GOへ移した。

これはhard-coded SHAの移動ではなくauthority contractの変更である。

Correction-3は、post-merge Acceptance Execution GOが
future expectedMainShaとacceptanceExecutionAuthorityをbindできることを
Definitionへ正式追加する。

Implementation Start GOはimplementation publication専用のままCONSUMEDとする。
```

このCorrectionはD1-D6の意味、AC-1からAC-9の業務意味、3ファイルchanged-areaを変更しない。

このCorrectionはPR #511のReady / Merge、full acceptance execution、Issue #445 mutationを許可しない。

## 14. Execution status provenance (DEFINITION-STATUS-SYNC-1 / DEFINITION-STATUS-SYNC-2)

この節はDefinition semanticsを変更せず、current mainのstatus provenanceのみをこの文書へ同期する。

同期根拠となるcurrent mainの事実は次のとおりである。

```text
Definition Correction-3: PUBLISHED (PR #512 MERGED)
Independent Correction Re-Review: PASS / LOCKABLE
PR #511 execution-authority correction: MERGED / CONSUMED
Acceptance Execution GO: CONSUMED
Full acceptance execution: EXECUTED / overallResult = GAP_FOUND
Acceptance evidence recording: MERGED / CONSUMED (PR #513)
```

Full acceptance executionのcheckpoint resultは次のとおりである。

```text
AC-1: PASS
AC-2: PASS
AC-3: GAP_FOUND
AC-4: GAP_FOUND
AC-5: GAP_FOUND
AC-6: PASS
AC-7: GAP_FOUND
AC-8: GAP_FOUND
AC-9: GAP_FOUND

overallResult: GAP_FOUND
```

AC-3 / AC-5 / AC-8の`GAP_FOUND`は、lifecycle identity chainの欠陥ではなく、DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1で`STALE SMOKE EXPECTATION`（PR #493 / VP-1 demo banner copy変更に由来するdemo-ux-6 smoke runnerのstale期待）として分類済みである。

AC-4 / AC-7 / AC-9はこの分類の対象外であり、separate residualsとして`GAP_FOUND`のまま保持する。これらは個別Exact Slice候補への分離候補である。

記録済みのacceptance resultは遡って変更しない。smoke runner、acceptance runner、contract test、product / domain / fixture / schemaはすべて変更しない。acceptance再実行はこの同期では許可しない。

実行詳細の正本は`sp-lc-6-synthetic-lifecycle-acceptance-evidence.md`のFull acceptance execution result節およびDEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1節である。

この同期はD1-D6、AC-1からAC-9の業務意味、result precedence（`ENVIRONMENT_BLOCKED > GAP_FOUND > PASS`）、execution authority modelを変更しない。

### DEFINITION-STATUS-SYNC-2 (post-PR #515)

この追記はDefinition semanticsを変更せず、PR #515 merge後のstatus provenanceのみを同期する。

historical acceptance execution result と post-execution remediation status は別物である。SYNC-2は後者だけを記録し、前者を再計算しない。

```text
Human authorization:
SP-LC-6 DEFINITION-STATUS-SYNC-2 Parent Definition Status Synchronization GO

Exact scope definition:
SP-LC-6-DEFINITION-STATUS-SYNC-2 (PR #516; docs-only exact scope)

mutation-time preflight:
observed current main: 66219ae16c3f2ca1ebee7bbe5b479c8286ac79e8
review-observed current main: 3bf96a732e7a6a211d441b56b490508459922419
evidence basis main: 0346d0a1c73f524e3a993401d57b38ac1c33b1af
relevant SP-LC-6 overlap since review-observed: NONE
non-overlapping drift: UI-RENDERED-REVIEW-V1 / UI External Intelligence only
preflight: PASS / CONTINUE
```

同期するcurrent-main事実は次のとおりである。

```text
PR #515:
MERGED / CONSUMED

AC-3 / AC-5 / AC-8 stale-smoke remediation:
COMPLETE / CONSUMED

DEMO-UX-6 browser smoke:
PASS / 9 of 9

Recorded Full Acceptance execution:
EXECUTED / overallResult = GAP_FOUND
(historical checkpoint results unchanged)

AC-4 / AC-7 / AC-9:
OPEN / separate residuals

Acceptance re-execution:
NOT AUTHORIZED
```

PR #515はAC-3 / AC-5 / AC-8のstale smoke expectationを後続で修正した。これはhistorical Full Acceptance resultの再計算ではない。したがって次を保持する。

```text
historical execution result:
AC-1: PASS
AC-2: PASS
AC-3: GAP_FOUND
AC-4: GAP_FOUND
AC-5: GAP_FOUND
AC-6: PASS
AC-7: GAP_FOUND
AC-8: GAP_FOUND
AC-9: GAP_FOUND
overallResult: GAP_FOUND
```

AC-3 / AC-5 / AC-8のhistorical `GAP_FOUND` はPASSへ書き換えない。stale-smoke remediationはpost-execution statusとしてCOMPLETE / CONSUMEDと記録するだけである。

AC-4 / AC-7 / AC-9は未解消のseparate residualsとしてOPENを維持する。Gate NEXTは `AC-4 successful-empty Observation association Exact Slice` とする。

この同期はD1-D6、AC-1からAC-9の業務意味、result precedence、execution authority / preflight modelを変更しない。smoke runner、acceptance runner、contract test、product / domain / fixture / schema、Issue #445、acceptance-reportは変更しない。

## 15. Rollback boundary

Definition publicationのrollbackはこの文書だけを戻す。

Future acceptance implementationのrollbackも、acceptance test、runner、evidenceの3ファイルだけを戻す。

既存product/domain/fixture/smokeを変更しないため、rollbackで業務意味や既存UIを変えない。

## 16. Gate

```text
Definition Start GO: CONSUMED
Definition Correction-1: COMPLETE
Definition Correction-2: COMPLETE / PUBLISHED
Definition Correction-3 Start GO: CONSUMED
Definition Correction-3: COMPLETE / PUBLISHED (PR #512 MERGED)
Definition: LOCKED / PUBLISHED / CONSUMED

PR #510 implementation publication:
MERGED / CONSUMED

PR #511 execution-authority correction:
MERGED / CONSUMED

Independent Correction Re-Review:
PASS / LOCKABLE

Acceptance Execution GO:
CONSUMED

Full acceptance execution:
EXECUTED / overallResult = GAP_FOUND

DEMO-UX-6 REVIEW-DUE GAP CLASSIFICATION-1:
RECORDED (AC-3 / AC-5 / AC-8 = STALE SMOKE EXPECTATION)

AC-4 / AC-7 / AC-9:
GAP_FOUND / separate residuals (not reclassified)

PR #513 acceptance evidence recording:
MERGED / CONSUMED

PR #515 stale-smoke Exact Slice:
MERGED / CONSUMED

AC-3 / AC-5 / AC-8 stale-smoke remediation:
COMPLETE / CONSUMED

DEMO-UX-6 smoke:
PASS / 9 of 9

DEFINITION-STATUS-SYNC-1:
COMPLETE / CONSUMED (PR #514)

DEFINITION-STATUS-SYNC-2:
APPLIED (parent Definition status provenance only)

Acceptance re-execution:
NOT AUTHORIZED

Issue mutation:
NOT AUTHORIZED

Ready / Merge:
NOT AUTHORIZED

Deploy / Production Binding / LIVE WRITE:
FORBIDDEN

NEXT:
AC-4 successful-empty Observation association Exact Slice
```
