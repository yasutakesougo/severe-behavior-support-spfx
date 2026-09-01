# ASANA-STYLE-DELEGATION-SLICE-B — Definition

```text
Definition ID = ASANA-STYLE-DELEGATION-SLICE-B-DEFINITION-1
Mode = DEFINITION ONLY
Status = DEFINITION DRAFT
Parent = ASANA-STYLE-DELEGATION-SLICE-A (CLOSED)
Parent final main = 1b2b106b9c799dd5936481dc9c9b4808449f63c8
Parent representation = Option B — Structured Gate Packet READ-ONLY index
Human Definition Lock GO = NOT RECEIVED
Human Implementation Start GO = NOT RECEIVED
Implementation Scope = NOT AUTHORIZED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
Issue mutation = NOT AUTHORIZED by this Definition
```

This durable document records the Definition draft for **Second-Pilot Portability**
verification of Slice-A Option B.

It does **not** authorize Implementation Start, Second Pilot selection authority,
Implementation Scope, Ready, Merge, Deploy, `verify:slice`, GitHub Issue Template
changes, Option C, or any Human Gate automation.

---

## 1. Goal

Slice-AでPilot #552に対して成立したOption B Structured Gate Packetが、別の1 Issue /
1 PRに対しても、大規模な一般化や新しい基盤を追加せず再利用できることを確認する。

本Sliceの主目的は新機能開発ではない。

確認する問いは以下とする。

```text
Slice-A Option B
        ↓
Second Pilot 1件
        ↓
小さな設定追加だけで再利用できるか
        ↓
短いGoal委任からcurrent stateへ正しく到達できるか
```

---

## 2. Primary Success Question

本Sliceで最も重要なAcceptanceは、Gate Packetそのものではなく以下である。

```text
Humanが長いlineage説明を書かなくても、
短いGoal + Issue anchorだけでAgentが
現在のscope / gate / HEAD / next Human actionへ到達できるか。
```

これを **Short Delegation Acceptance** と呼ぶ。

---

## 3. Definition Principle

Slice-BはSlice-Aの設計を拡張するためのSliceではなく、**portabilityを検証するSlice**
とする。

原則:

```text
reuse before generalization
evidence before framework
one pilot before multi-pilot
UNKNOWN before inference
```

Second Pilotへの対応で新しいframeworkが必要になった場合、その必要性をまずfindingとして
固定し、即座に実装してはならない。

---

## 4. Existing Authority Model

Slice-Aで確定したauthority modelを変更しない。

```text
Human decision
        ↓
GitHub live evidence
        ↓
locked / review-cleared semantics
        ↓
Structured Gate Packet
READ-ONLY index
        ↓
Agent read
        ↓
mutation直前 live re-check
        ↓
authorized work
        ↓
next Human Gate STOP
```

以下は禁止する。

```text
PR merged
    ≠ Human Merge GO

CI GREEN
    ≠ Human Ready GO

Review PASS
    ≠ Human Ready GO

Packet output
    ≠ mutation authority

UNKNOWN
    ≠ implicit permission
```

---

## 5. Second Pilot

本Definition時点ではSecond Pilotを固定しない。

SelectionはHuman Definition Lock後、Implementation Scope確定前のREAD-ONLY phaseで行う。

Second Pilotは **1件のみ** とする。

候補は以下を満たすものを優先する。

```text
- main上にreview-cleared evidenceが存在する
- Issue / PR anchorを一意に識別できる
- authorized pathsまたは明示UNKNOWNを評価できる
- locked implementation / product / scope identityが存在する
- Human Gate lineageが存在する
- correctionまたは複数review lineageが存在する
```

現時点のREAD-ONLY候補（Pilot selection authority ではない）:

```text
Primary candidate:
  PR #548
  review-to-plan-revision-relationship

Comparison candidate:
  PR #560
  review-outcome-context-note-slice-b
```

---

## 6. IN Scope

```text
- Second Pilot候補のREAD-ONLY比較
- Second Pilot 1件の固定
- existing Option B readerへの最小registry追加
- Second Pilot固有artifact pathの設定
- 必要な場合のみ小さなparser一般化
- authorized_paths取得
- locked artifact identity取得
- Gate subset取得
- correction generation取得
- next_human_action取得
- freshness / live provenance取得
- focused regression tests
- Short Delegation Acceptance
```

---

## 7. OUT of Scope

```text
- 3件以上のPilot対応
- 全Issue対応
- repository-wide scanner
- automatic pilot discovery
- Option C
- docs/gates/issue-*.yaml
- verify:slice
- GitHub Issue Template
- dashboard / ADCC integration
- database
- webhook
- daemon
- background synchronization
- approval engine
- state orchestration engine
- Human Gate追加
- Human Gate自動消費
- Ready automation
- Merge automation
- Deploy / Production Write
- Product / SPFx / domain behavior changes
```

---

## 8. Portability Acceptance Criteria

### SB-1 — One Second Pilot

```text
Second Pilot = exactly 1
```

過去Issueの一括retrofitは禁止。

### SB-2 — Product Boundary

```text
Product / SPFx / domain delta = 0
```

### SB-3 — Gate Vocabulary

新しいHuman GateまたはGate stateを追加しない。

既存subsetのみ使用する。

```text
definition_lock
implementation_start
ready
merge
deploy
production_write
actual_staff_value
```

### SB-4 — No Human GO Inference

以下からHuman GOを生成しない。

```text
PR lifecycle
CI result
Review result
chronology
HOLD
REQUIRED
PASS
VERIFIED
```

曖昧な値は `UNKNOWN`。

### SB-5 — Minimal Generalization

最良ケース:

```text
registry entry only
```

許容ケース:

```text
registry entry
+
小さな既存parser一般化
```

不許容:

```text
new generic state engine
new repository scanner
new evidence framework
```

parser一般化が必要な場合、既存Pilot #552を壊さないこと。

### SB-6 — Authorized Paths

Second Pilotについて、

```text
authorized_paths = unique paths
```

または、既存正本から一意取得できない場合、

```text
authorized_paths = UNKNOWN
```

とする。

推測は禁止。

ただし、Short Delegation Acceptanceに必要なmutation eligibilityが成立しない場合、
そのPilotがportability検証に適切か再評価する。

### SB-7 — Locked Identity

利用可能なlocked identityを一意に取得する。

候補:

```text
definition
scope
implementation
product_basis
evidence
```

存在しないidentityを捏造しない。

### SB-8 — Correction Generation

既存lineageから一意に取得できる場合のみ具体値を返す。

一意でなければ、

```text
UNKNOWN
```

とする。

独自lineage state machineを作らない。

### SB-9 — Next Human Action

closed vocabulary:

```text
DEFINITION_LOCK
IMPLEMENTATION_START
READY
MERGE
DEPLOY
PRODUCTION_WRITE
ACTUAL_STAFF_VALUE_CONFIRMED
UNKNOWN
```

一意に決定できない場合は `UNKNOWN`。

### SB-10 — Live Failure

GitHub live取得不能時:

```text
github_live_* = UNAVAILABLE
live state = UNKNOWN
```

取得していないlive sourceをprimary sourceとして表示しない。

### SB-11 — Short Delegation Acceptance

Second Pilotについて、HumanからAgentへの入力を短いjob instructionへ縮小する。

目標例:

```text
/goal
Issue #<N> の現在状態を確認し、
現在authorizedな次作業だけ進める。

既存repo規範に従う。
gate-packet readerを使用する。
必要なverificationを実行する。
次のHuman Gateで停止する。
```

Acceptance:

```text
- Agentが正しいIssue / PRへ到達
- current gateを正しく取得
- authorized pathsを正しく取得またはUNKNOWN
- locked HEADを取得
- unauthorized mutationをしない
- next Human GateでSTOP
- Humanが長いlineageを再説明しない
```

### SB-12 — Ponytail / Complexity Check

Second Pilot追加のために以下が必要になった場合はSTOPする。

```text
- 新しいframework
- 大規模schema
- repository-wide discovery
- persistent state store
- Option C
- background process
```

---

## 9. Portability Classification

Second Pilotの結果を以下の3分類とする。

### PORTABLE-A

```text
registry-only
```

既存reader変更なし。

### PORTABLE-B

```text
registry
+
small parser normalization/generalization
```

既存意味モデルは変更しない。

### NOT-PORTABLE

以下のいずれかが必要。

```text
state engine
generic repository scanner
new authority model
Option C
large evidence normalization
```

NOT-PORTABLEは失敗ではなく、Slice-A Option Bの適用境界を示すEvidenceとする。

---

## 10. Representation Rule

```text
Slice-A Option B
        ↓
Second Pilot
        ↓
PORTABLE-A?
  YES → finish

  NO
   ↓
PORTABLE-B?
  YES → minimal correction → verify → finish

  NO
   ↓
NOT-PORTABLE
   ↓
STOP / architecture decision
```

Option Cへ自動的に進まない。

---

## 11. Short Delegation Evaluation

Second Pilot実装後、技術Acceptanceとは別に次を評価する。

```text
Human prompt length
state reconstruction effort
wrong-scope risk
Human Gate stop accuracy
manual lineage explanation requirement
```

成功目標:

```text
長いlineage pasteをしなくても、
Issue anchor + short Goalで正しい作業境界へ到達できる。
```

---

## 12. Verification Requirements

```text
V-B1  Second Pilot structured read PASS
V-B2  Pilot #552 regression PASS
V-B3  formal-token fail-closed PASS
V-B4  live lifecycle / Human GO separation PASS
V-B5  authorized_paths exact or UNKNOWN
V-B6  locked identity exact or UNKNOWN
V-B7  correction generation exact or UNKNOWN
V-B8  next_human_action exact or UNKNOWN
V-B9  live unavailable provenance PASS
V-B10 npm run verify:ci PASS
V-B11 Product / SPFx / domain delta = 0
V-B12 Short Delegation Acceptance PASS / FAIL fixed
```

---

## 13. STOP Conditions

以下の場合はImplementationを拡大せずSTOPする。

```text
- Second Pilotに2件以上必要
- authorized pathsを推測する必要がある
- Human GOを推測する必要がある
- generic PR body grammarが必要
- repository-wide scanが必要
- new state engineが必要
- Option Cが必要
- verify:sliceが必要
- Issue Templateが必要
- Product / SPFx変更が必要
- Slice-A Pilot #552を壊す
- Short Delegation成功のために長いprompt追加が必要
```

---

## 14. Human Gates

Slice-Bは既存Human Gateのみを使用する。

```text
Definition Draft
        ↓
Independent Definition Review
        ↓
必要なら Definition Correction
        ↓
Human Definition Lock GO
        ↓
Second Pilot READ-ONLY Selection
        ↓
Implementation Scope Definition
        ↓
Independent Scope Review
        ↓
Human Implementation Start GO
        ↓
Implementation
        ↓
Focused Verification
        ↓
Short Delegation Acceptance
        ↓
Independent Implementation Review
        ↓
Human Ready GO
        ↓
separate Human Merge GO
```

新しいHuman Gateを作らない。

---

## 15. Definition Acceptance

Definition Reviewでは最低限以下を確認する。

```text
D-B1  Goalはportability証明であり機能追加ではない
D-B2  Second Pilotは1件のみ
D-B3  PilotはDefinition時点で未固定
D-B4  Option CはOUT
D-B5  verify:sliceはOUT
D-B6  Issue TemplateはOUT
D-B7  Product delta 0
D-B8  fail-closed維持
D-B9  Human GO inference禁止
D-B10 SB-11 Short DelegationがPrimary Acceptance
D-B11 PORTABLE-A/B/NOT-PORTABLE classificationあり
D-B12 Complexity STOP条件あり
```

---

## 16. Current Gate

```text
ASANA-STYLE-DELEGATION-SLICE-A
= CLOSED

ASANA-STYLE-DELEGATION-SLICE-B
= DEFINITION DRAFT

Human Definition Lock GO
= NOT RECEIVED

Second Pilot
= NOT SELECTED

Implementation Scope
= NOT AUTHORIZED

Human Implementation Start GO
= NOT RECEIVED

Implementation
= NOT AUTHORIZED

Ready / Merge / Deploy / LIVE WRITE
= NOT AUTHORIZED
```

---

## 17. Next

```text
Independent Definition Review-1
```
