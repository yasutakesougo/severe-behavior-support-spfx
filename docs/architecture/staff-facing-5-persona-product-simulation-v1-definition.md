# STAFF-FACING-5-PERSONA-PRODUCT-SIMULATION-V1 — Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
parent: Issue #542
kind: process definition
basis main: 72f2bb1dd0cfde2301b01cbad0c2fce7bfe266e0
status: DEFINITION DRAFT / CORRECTION-1 APPLIED
independent definition review-1: CORRECTION REQUIRED / P0=0 / P1=2 / P2=1
implementation / enforcement: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

## 1. Purpose

職員向けUIまたは業務フロー変更に対して、Rendered Browser Acceptance後に5つの異なる職員視点からTask-based Product Simulationを行う軽量なProduct Value Precheckを定義する。

この工程の目的は、実職員確認前に役割・経験・利用頻度の違いによる摩擦候補を発見し、Actual Staff Value Checkで観察すべき箇所を絞ることである。

このSimulationは実職員価値確認を代替しない。

```text
Simulation Evidence Only
!=
Actual Staff Value Evidence
```

## 2. Process position and exact-head invariant

標準位置は次とする。

```text
Definition
↓
Independent Definition Review
↓
Human Definition Lock
↓
Implementation
↓
Focused Verification
↓
Rendered Browser Acceptance
↓
Exact Implementation HEAD Fixation
↓
Independent Implementation Review
↓
5-Persona Product Simulation on the same review-cleared HEAD
↓
Human Ready GO
↓
separate Human Merge GO
↓
Actual Staff Value Check
↓
Product Value Decision
```

5-Persona Product SimulationはIndependent Implementation ReviewでREVIEW-CLEAREDとなったexact HEADだけを入力とする。

Simulation中またはSimulation後に対象実装HEADが変わった場合、古いSimulation結果を新HEADへ自動継承しない。

新HEADについて必要なVerification、Rendered Browser Acceptance、Independent Implementation Reviewを再評価した後にSimulationを再実施する。

5-Persona Product Simulationは既存のVerification、Independent Review、Human Authorityを置換しない。

## 3. Applicability decision

次のいずれかに該当する職員向け変更では、原則として適用候補とする。

- 新規職員向け画面
- 情報階層変更
- Navigation変更
- Monitoring / Review等の業務意味に関わる表示変更
- Label / terminology変更
- 複数画面をまたぐworkflow変更

次の変更には原則として要求しない。

- docs only
- test only
- repository hygiene
- CI修正
- dependency maintenance
- 表示・操作が不変の内部refactor

各対象SliceまたはPRで、次をdurable Evidenceとして記録する。

```text
Applicability Decision: APPLICABLE | NOT_APPLICABLE | UNKNOWN
Applicability Reason:
Decision Target SHA / PR HEAD:
```

`NOT_APPLICABLE`はSimulation COMPLETEを意味しない。

`UNKNOWN`の場合は自動的にSimulationを省略せず、Human Ready判断前にApplicabilityを解消する。

Simulationを実施しない場合でも、`NOT_APPLICABLE`と理由を記録する。

## 4. Personas

### Persona D — 新人支援員

主な観察対象は、操作開始点、業務意味の理解、何を確認しどこへ記録するかである。

例:

```text
対象利用者について今日確認すべきことを探し、
記録するとしたらどこを使うか説明する。
```

### Persona E — ベテラン支援員

主な観察対象は、情報探索速度、紙・口頭運用との比較、説明過多、不要な視線移動である。

例:

```text
今日の対象利用者について確認事項が残っているか、
できるだけ早く確認する。
```

### Persona F — 引継ぎ職員

主な観察対象は、対象利用者をよく知らない状態での理解、最近の支援内容の把握、情報不足の発見である。

例:

```text
初めて担当すると仮定し、
最近どのような支援が行われたか説明する。
```

### Persona G — 計画・見直し担当

主な観察対象は、Daily Record → Monitoring → Reviewの情報循環、日々の事実と期間評価の役割分離、見直し判断材料への到達である。

例:

```text
最近の記録を確認し、期間モニタリングを経て、
見直し資料として何を確認すべきか説明する。
```

### Persona H — 低頻度利用職員

主な観察対象は、操作記憶に依存しない再開性、Navigation、画面内の次行動理解である。

例:

```text
久しぶりに画面を開いた前提で、
対象利用者の最近の状況を確認する。
```

## 5. Task construction

各Personaには評価対象Sliceに対応する具体的なTaskを与える。

「分かりやすいですか」のような抽象的な好感度質問だけで判定しない。

Taskは、開始状態、達成すべき業務目的、観察対象を記録できる粒度にする。

Persona間でTaskを同一にする必要はない。

役割の違いを観察するために必要であれば、同じ画面へ異なる目的を与える。

## 6. Evidence input boundary

Simulationに使用する画面、fixture、状態、exact implementation HEADをEvidenceへ記録する。

Rendered Browser Acceptanceで確認し、Independent Implementation ReviewでREVIEW-CLEAREDとなった同一surface / HEADを使用する。

Synthetic画面を使用した場合はSyntheticであることを明記する。

Simulation Evidenceから未観測のLIVE挙動を推定してPASSへ昇格させない。

個人情報をSimulation Evidenceへ持ち込まない。

## 7. Result classification

### Severity

```text
RESOLVED
MINOR_FRICTION
BLOCKING_FRICTION
```

`RESOLVED`は、与えたTaskについて実用上の妨げとなる摩擦をSimulation上で再現しなかった状態を表す。

`MINOR_FRICTION`は、Taskを完了できるが、一時的な迷い、余分な探索、理解負荷を観測した状態を表す。

`BLOCKING_FRICTION`は、誤解、必要情報の未発見、または業務目的への到達不能を観測した状態を表す。

### Gap Class

```text
UI_FRICTION
INFORMATION_GAP
WORKFLOW_GAP
DOMAIN_UNCERTAINTY
```

`UI_FRICTION`は、表示階層、名称、配置、Navigation等の提示上の問題候補を表す。

`INFORMATION_GAP`は、Taskに必要な情報が不足している問題候補を表す。

`WORKFLOW_GAP`は、画面間または業務工程間の接続が不足している問題候補を表す。

`DOMAIN_UNCERTAINTY`は、UI修正の前に業務上の意味・正本・判断基準の確認が必要な状態を表す。

SeverityとGap Classは別々に記録する。

## 8. Minimum evidence record

各Personaについて最低限次を記録する。

```text
Persona:
Target exact implementation HEAD:
Rendered surface / state:
Task:
Observed path:
Severity:
Gap Class:
Observation:
Candidate next action:
```

全体について次を記録する。

```text
Applicability Decision:
Applicability Reason:
Persona Evidence Complete: YES | NO
Simulation Outcome: REVIEW_CLEARED | HOLD
Actual Staff Evidence: UNKNOWN | separately-established value
```

観測していない心理状態や実職員の反応を事実として記録しない。

## 9. Deterministic routing

5人中のPASS数を合格率として扱わない。

多数決でProduct Valueを決定しない。

次のいずれかの場合、Simulation Outcomeは`HOLD`とする。

```text
Persona Evidence Complete = NO
Applicability Decision = UNKNOWN
any BLOCKING_FRICTION without explicit disposition
any DOMAIN_UNCERTAINTY without authoritative resolution or explicit HOLD disposition
target implementation HEAD changed after review/simulation fixation
required rendered surface or state unavailable
```

`BLOCKING_FRICTION`がある場合はObservationとGap Classを個別評価し、解消、別Slice候補、業務確認待ち、または明示HOLDのdispositionを記録する。

`DOMAIN_UNCERTAINTY`はUI修正で自動解消しない。

全5PersonaのEvidenceが揃い、未dispositionの`BLOCKING_FRICTION`または`DOMAIN_UNCERTAINTY`がなく、exact HEADが維持されている場合は`REVIEW_CLEARED`とできる。

`MINOR_FRICTION`は、Candidate next actionまたは明示的なdefer理由を記録したうえで`REVIEW_CLEARED`を妨げない。

全Personaが`RESOLVED`でもActual Staff ValueはUNKNOWNのままとする。

`REVIEW_CLEARED`はHuman Ready GOではない。

## 10. Smallest useful slice routing

Simulationで問題候補が見つかっても新Sliceを自動開始しない。

`UI_FRICTION`の場合は、実際に観測された摩擦だけを対象にSmallest useful slice候補を作る。

`INFORMATION_GAP`の場合は、必要情報の正本と表示責務を確認してからSlice候補を判断する。

`WORKFLOW_GAP`の場合は、画面間・業務工程間の責務境界を確認してからSlice候補を判断する。

`DOMAIN_UNCERTAINTY`の場合は、業務上の意味または正本が確定するまでProduct UI変更を開始しない。

全面redesignはSimulation結果だけでは認可しない。

## 11. Authority invariants

次を常に維持する。

1. Simulation Evidence Only。
2. Actual Staff Evidenceは別途取得されるまでUNKNOWN。
3. Simulation REVIEW_CLEARED != Actual Staff Value PASS。
4. Simulation REVIEW_CLEARED != Human Ready GO。
5. Human Ready GO != Human Merge GO。
6. Human Merge GO != Deploy GO。
7. Deploy GO != LIVE WRITE。
8. Simulationだけで新Sliceまたはredesignを自動開始しない。
9. SimulationだけでIssueを自動Closeしない。
10. Simulation結果はProduction Binding、SharePoint WRITE、M365 / Entra mutation authorityを作らない。

## 12. Pilot

最初のpilotはHuman Review / Monitoring系のstaff-facing UIを対象とする。

Pilotでは新しい評価システム、アンケート基盤、runtime serviceを実装しない。

Markdown Evidenceで十分とする。

2〜3個の適用Sliceを観測した後、次を再評価する。

```text
ADOPT
ADJUST
RETIRE
```

継続採用は自動としない。

## 13. Acceptance criteria

- 5ペルソナの役割と観察対象が定義されている。
- PersonaごとのTaskを対象Sliceに合わせて具体化できる。
- SeverityとGap Classが分離されている。
- Applicability Decisionと理由をdurable記録する。
- Minimum Evidence Recordが定義されている。
- Simulation OutcomeのREVIEW_CLEARED / HOLD routingが決定的である。
- SimulationはIndependent Implementation ReviewでREVIEW-CLEAREDとなったexact HEADを使用する。
- Simulation Evidence Only境界が明記されている。
- Actual Staff Evidenceを代替しない。
- Ready / Merge / Deploy / LIVE WRITE Authorityを変更しない。
- 5ペルソナ結果を多数決または合格率として扱わない。
- BLOCKING_FRICTIONから自動的に全面redesignへ進まない。
- Gap ClassからSmallest useful slice候補へ接続できる。
- 2〜3 Sliceのpilot後にADOPT / ADJUST / RETIREを再評価する。

## 14. OUT

```text
Product code change
SPFx runtime change
new dependency
new automated evaluator
new survey system
new persistence
production data use
personal data collection
Actual Staff Value automation
Human Authority automation
auto Ready
auto Merge
Deploy
Production Binding
LIVE WRITE
SharePoint / M365 / Entra mutation
all UI changesへの無条件強制
statistical validity claim
```

## 15. Next gate

```text
Definition Correction-1
↓
exact Definition re-read
↓
Independent Definition Re-Review-1
↓
Human Definition Lock GO
```

Definition Lockはprocess enforcementまたはProduct implementation authorityを意味しない。
