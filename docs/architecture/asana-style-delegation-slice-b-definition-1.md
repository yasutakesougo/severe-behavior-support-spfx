# ASANA-STYLE-DELEGATION-SLICE-B — Definition

```text
Definition ID = ASANA-STYLE-DELEGATION-SLICE-B-DEFINITION-1
Correction = 1
Mode = DEFINITION ONLY
Status = REVIEW-CLEARED / AWAITING HUMAN DEFINITION LOCK GO
Parent = ASANA-STYLE-DELEGATION-SLICE-A (CLOSED)
Parent final main = 1b2b106b9c799dd5936481dc9c9b4808449f63c8
Parent representation = Option B — Structured Gate Packet READ-ONLY index
Independent Definition Review-1 = CORRECTION REQUIRED / CONSUMED
Definition Correction-1 = APPLIED / CONSUMED
Independent Definition Re-Review-1 = PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=0 / CONSUMED
Definition Correction-2 = NOT REQUIRED
Human Definition Lock GO = ELIGIBLE / NOT RECEIVED
Human Implementation Start GO = NOT RECEIVED
Implementation Scope = NOT AUTHORIZED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
Issue mutation = NOT AUTHORIZED by this Definition
```

This durable document records the Definition for **Second-Pilot Portability**
verification of Slice-A Option B (Correction-1 applied; Re-Review-1 cleared).

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

### 4.1 Slice-B Implementation Authority Boundary (Correction-1)

Slice-B Human Implementation Start GOが認可するのは **Slice-B portability implementation**
（registry / 最小 parser 一般化 / focused tests / Short Delegation READ-ONLY
Acceptance）に限定する。

以下を明示的に禁止する。

```text
Slice-B Implementation Start GO
    ≠ Second Pilot本体（例: #548 / #560）への新規mutation authority

Second Pilot Gate Packet output
    ≠ Second Pilot work authorization

Short Delegation Acceptance（SB-11）
    = READ-ONLY by default
```

Second Pilot本体へのmutationは、当該Pilotの **separate explicit Human authority**
が必要である。Packetが返すstateだけで実作業を再開してはならない。

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

### 5.1 Second Pilot Selection Record (Correction-1)

Second Pilot選定時（READ-ONLY phase）に、Selection recordで最低限以下を固定する。
新しいHuman Gateは追加しない。

```text
Second Pilot Issue
Second Pilot PR
selection basis
evidence path(s)
available locked identity（取得可能なもの）
authorized_paths source
rejected comparison candidate + short reason
Selection = READ-ONLY
Selection grants mutation authority = NO
```

Selection recordはPilot selection authorityを生成しない。

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

**Correction-1:** `authorized_paths = UNKNOWN` は fail-closed として安全だが、
**Portability Minimum Evidence Floor**（§9.0）を満たさない。PORTABLE-A / PORTABLE-B
のportability証明としては扱わない。その場合は **pilot unsuitable** または
**NOT-PORTABLE** として固定する。

```text
safe fail-closed ≠ portability success
```

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

### SB-11 — Short Delegation Acceptance (READ-ONLY)

Second Pilotについて、HumanからAgentへの入力を短いjob instructionへ縮小する。

**Correction-1:** Short Delegation Acceptanceは **READ-ONLY by default** とする。
SB-11は state reconstruction / wrong-scope prevention / Human Gate stop accuracy
を純粋にテストする。mutation authority を含まない。

目標例:

```text
/goal
Issue #<N> の現在状態を確認し、
現在authorizedな次作業を特定する。

既存repo規範に従う。
gate-packet readerを使用する。
必要なREAD-ONLY verificationを実行する。
mutationは行わず、次のHuman Gateで停止する。
```

Acceptance:

```text
- Agentが正しいIssue / PRへ到達
- current gateを正しく取得
- authorized pathsを正しく取得（portability floor満たす場合）
- locked HEADを取得（portability floor満たす場合）
- unauthorized mutationをしない
- next Human GateでSTOP
- Humanが長いlineageを再説明しない
- Second Pilot本体へのmutationを開始しない
```

SB-11 PASSは、Second Pilot本体への作業再開を認可しない（§4.1）。

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

### 9.0 Portability Minimum Evidence Floor (Correction-1)

PORTABLE-A / PORTABLE-B を成立させる **最低条件**:

```text
1. Issue anchor = exact
2. PR anchor = exact
3. authorized_paths = exact（UNKNOWN は floor 未達）
4. locked execution identity =
   少なくとも1つ exact
   （implementation / relevant locked artifact 等）
5. live source availability / provenance = explicit
6. Human GOは推測しない
7. gate / next_human_action が UNKNOWN の場合、
   UNKNOWNのまま STOP できる
```

以下は明確に区別する。

```text
fail-closed UNKNOWN返却
    = 安全性 PASS の可能性あり

Portability Minimum Evidence Floor 満たす
    = PORTABLE-A / PORTABLE-B 判定可能

authorized_paths = UNKNOWN
    → pilot unsuitable または NOT-PORTABLE
    → PORTABLE-A / PORTABLE-B として扱わない
```

gate / next_human_action / correction generation が UNKNOWN でも floor 未達には
ならないが、Short Delegation で意味のある state reconstruction ができない場合は
portability 証明として不十分と記録する。

### PORTABLE-A

```text
registry-only
AND Portability Minimum Evidence Floor satisfied
```

既存reader変更なし。

### PORTABLE-B

```text
registry
+
small parser normalization/generalization
AND Portability Minimum Evidence Floor satisfied
```

既存意味モデルは変更しない。

### NOT-PORTABLE

以下のいずれかが必要、または Portability Minimum Evidence Floor 未達。

```text
state engine
generic repository scanner
new authority model
Option C
large evidence normalization
authorized_paths = UNKNOWN（floor 未達）
pilot unsuitable for portability proof
```

NOT-PORTABLEは失敗ではなく、Slice-A Option Bの適用境界を示すEvidenceとする。

---

## 10. Representation Rule

```text
Slice-A Option B
        ↓
Second Pilot
        ↓
Portability Minimum Evidence Floor satisfied?
  NO → pilot unsuitable / NOT-PORTABLE → STOP / record
  YES
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
V-B5  authorized_paths exact（UNKNOWN = floor fail / not PORTABLE-A/B）
V-B6  locked identity exact or UNKNOWN（floor: ≥1 execution identity exact）
V-B7  correction generation exact or UNKNOWN
V-B8  next_human_action exact or UNKNOWN
V-B9  live unavailable provenance PASS
V-B10 npm run verify:ci PASS
V-B11 Product / SPFx / domain delta = 0
V-B12 Short Delegation READ-ONLY Acceptance PASS / FAIL fixed
V-B13 Portability Minimum Evidence Floor evaluated before PORTABLE-A/B
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
- Portability Minimum Evidence Floor未達でPORTABLE-A/Bと判定する
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
D-B10 SB-11 Short Delegation READ-ONLY Primary Acceptance
D-B11 PORTABLE-A/B/NOT-PORTABLE + Minimum Evidence Floor
D-B12 Complexity STOP条件あり
D-B13 Slice-B GO ≠ Second Pilot mutation（§4.1）
D-B14 Selection record minimum fields（§5.1）
```

---

## 16. Current Gate

```text
ASANA-STYLE-DELEGATION-SLICE-A
= CLOSED

ASANA-STYLE-DELEGATION-SLICE-B
= REVIEW-CLEARED

Independent Definition Review-1
= CORRECTION REQUIRED / CONSUMED

Definition Correction-1
= APPLIED / CONSUMED

Independent Definition Re-Review-1
= PASS / REVIEW-CLEARED / CONSUMED

Definition Correction-2
= NOT REQUIRED

Human Definition Lock GO
= ELIGIBLE / NOT RECEIVED

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
Human Definition Lock GO / HOLD
        ↓
（GO後のみ）
Second Pilot READ-ONLY Selection
        ↓
Implementation Scope Definition
```

Definition Lock alone does not authorize Implementation Start or Second Pilot mutation.
