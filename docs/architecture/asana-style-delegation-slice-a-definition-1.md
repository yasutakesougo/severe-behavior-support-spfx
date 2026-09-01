# ASANA-STYLE-DELEGATION-SLICE-A — Definition

```text
Definition ID = ASANA-STYLE-DELEGATION-SLICE-A-DEFINITION-1
Correction = 1
Mode = DEFINITION ONLY
Status = HUMAN DEFINITION LOCKED
Human Definition Lock GO = CONSUMED
Independent Definition Review-1 = CORRECTION REQUIRED / CONSUMED
Definition Correction-1 = APPLIED / CONSUMED
Independent Definition Re-Review-1 = PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=1 / CONSUMED
basis main at Lock = 2c99d0c6d4dd8a4691ed64386650808d07525f38
Implementation Scope = NOT AUTHORIZED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
Issue mutation = NOT AUTHORIZED by this Definition
```

This durable document records the Human-locked Definition (Correction-1).

It defines **Structured Gate Packet** as a machine-readable state index for Issue-scoped
current gate / scope / HEAD visibility.

It does **not** authorize Implementation Start, Packet representation LOCK, `verify:slice`,
GitHub Issue Template changes, or any Human Gate automation.

---

## 1. Goal

Human Gateを弱めず、Issue単位の現在状態をCodexが低コストで機械的に読み取れるようにする。

対象となる状態は、主に以下とする。

```text
- Issue / PR anchor
- authorized paths
- locked HEADs
- Human GO states
- correction generation
- next required Human action
```

本Sliceでは、これらを既存の証跡・意味定義から参照するための **Structured Gate Packet** を定義する。

Structured Gate Packetは新しいControl Planeではない。

Structured Gate Packetは新しいHuman Gateを定義しない。

Structured Gate Packetは既存の意味・権限・証跡を置き換えない。

---

## 2. Problem

現在のリポジトリでは、コード規範、権限境界、検証基盤の多くは既に環境側に存在する。

一方、現在の作業状態はIssueコメント、PR本文、Review文書、architecture文書などに分散している。

そのためCodexは、短いGoalから作業を開始する前に、次の状態を長いlineageから再構成する必要がある。

```text
- 現在有効なDefinitionはどれか
- 現在有効なScopeはどれか
- Implementation Start GOは未受領・適格・消費済みのどれか
- 変更してよいpathはどこか
- correctionの現在世代はいくつか
- どのHuman Gateで停止すべきか
```

この再構成コストが、Asana型の短いGoal委任を妨げている。

本Sliceでは、Codexの推論能力を補うための長いプロンプトを追加するのではなく、**現在状態への薄い機械可読索引**を定義する。

---

## 3. Definition Principle

Structured Gate Packetは **state index** とする。

意味・semanticsの正本ではない。

Human authorityの正本でもない。

証跡そのものでもない。

正本関係は以下とする。

```text
GitHub live state
Issue / PR / comment
    =
証跡・Human authority・現在のGitHub状態

docs/architecture/*
review-cleared definition / scope documents
    =
意味・semantics・locked scopeの正本

Structured Gate Packet
    =
上記正本を参照する現在状態の機械可読索引
```

Packetと正本が矛盾した場合、Packetを優先してはならない。

矛盾時はfail-closedとし、人間または既存project-status系プロセスへ戻す。

Evidence priority において Structured Gate Packet は、GitHub live state および locked
Definition / Scope などの意味正本より **下位の索引** とする。数値 priority の具体配置は
Implementation Scope で `project-status/evidence.md` と整合させる。

### 3.1 Packet Read / Write Authority

Structured Gate Packetは、Agentにとって原則 **READ-ONLYの状態索引** とする。

Agentの通常のDefinition、Implementation、Review作業は、Packetを更新するauthorityを自動的に含まない。

Packetの作成または更新が必要な場合、その操作は以下のいずれかに限定する。

```text
1. Humanによる直接更新
2. Implementation ScopeでPacket maintenanceが明示的にINとなり、
   必要なHuman GOが成立している限定操作
```

Packetの編集によってHuman GOの発行、消費、昇格、無効化を成立させてはならない。

特に、次のような状態変更をPacket編集だけで成立させてはならない。

```text
NOT_RECEIVED → ELIGIBLE
ELIGIBLE → CONSUMED
CONSUMED → INVALIDATED
FORBIDDEN → ELIGIBLE
UNKNOWN → CONSUMED
```

これらの状態変化は、既存のHuman authorityおよびGitHub live evidenceによって成立する。

Packet更新は、その成立済み状態を索引へ反映する行為に限定する。

### 3.2 Corrected Authority Model

Correction-1適用後の関係は以下とする。

```text
Human decision
        ↓
GitHub live evidence
Issue / PR / comment
        ↓
authority / evidence成立
        ↓
locked Definition / Scope
semantics成立
        ↓
Structured Gate Packet
machine-readable indexへ反映
        ↓
Agent reads
        ↓
mutation直前にlive evidence再確認
        ↓
authorized work
        ↓
next Human GateでSTOP
```

逆方向は禁止する。

```text
Packet edit        ✕  Human GO成立
Packet says CONSUMED   ✕  GO consumption evidence
CI GREEN           ✕  Ready authority
Review PASS        ✕  Human Ready GO
```

---

## 4. IN Scope

Structured Gate Packetは、Issue単位で次の問いに答えられるものとする。

### 4.1 Issue / PR Anchor

対象Issueを識別できる。

必要な場合は対応するPRを参照できる。

例:

```yaml
issue: 552
pr: 563
```

PRが存在しない状態を表現できること。

### 4.2 Authorized Paths

現在のHuman authorityおよびlocked scopeに基づき、変更可能なpathを索引できる。

例:

```yaml
authorized_paths:
  - spfx/src/shell/monitoring/**
```

authorized pathsは新しい権限を発生させない。

Packetへpathを記録したこと自体をImplementation Start GOとして扱ってはならない。

### 4.3 Locked HEADs

現在有効なDefinitionおよびScopeを識別するための固定点を参照できる。

例:

```yaml
locked_heads:
  definition: abc123
  scope: def456
```

必要に応じて、対象文書への参照を保持できる。

Packet内へDefinition本文やScope本文を複製しない。

### 4.4 Human GO States

既存Human Gateの現在状態を索引できる。

最低限、以下を区別できること。

```text
NOT_RECEIVED
ELIGIBLE
CONSUMED
INVALIDATED
FORBIDDEN
UNKNOWN
```

対象となるGateは既存定義に従う。

例:

```yaml
gates:
  definition_lock: CONSUMED
  implementation_start: CONSUMED
  ready: ELIGIBLE
  merge: NOT_RECEIVED
```

PacketはGOを発行しない。

PacketはGOを消費しない。

Packet更新そのものをGOとみなしてはならない。

Packetに保持するGate keyは、新しいGate catalogを定義しない。

Gate keyは既存の `gate-definitions`、permission rules、および review-cleared process
で既に定義されたGateの **subset** とする。

PacketはIssueに関係するGateのみを保持できる。

すべてのGateを毎Packetへ列挙する必要はない。

例として、対象になり得る既存Gateには以下がある。

```text
definition_lock
implementation_start
ready
merge
deploy
production_write
actual_staff_value
```

Scope ReviewやIndependent ReviewなどをGate keyとして保持する必要があるかは、
既存プロセス上の意味に基づきImplementation Scopeで決定する。

Packet都合で新しいGate名を作らない。

### 4.5 Next Human Action

現在の状態から、次に必要なHuman decision pointを索引できる。

`next_human_action` は free text ではなく、既存のHuman action / Gate vocabularyに対応する
機械可読値を使用することを原則とする。

具体的なclosed vocabularyおよび名前の写像方法はImplementation Scopeで定義する。

本Definitionでは新しいHuman action vocabularyを作成しない。

既存プロセスから一意に対応付けできない場合は、値を推測せず `UNKNOWN` とする。

例:

```yaml
next_human_action: ACTUAL_STAFF_VALUE_CONFIRMED
```

この値はHuman actionを実行したことを意味しない。

次に必要なHuman decision pointを索引しているだけである。

複数候補を勝手に順序付けしない。

既存プロセス上で一意に決定できない場合はUNKNOWNとする。

### 4.6 Correction Generation

DefinitionまたはScopeにcorrection / amendment lineageが存在する場合、現在有効な世代を識別できる。

例:

```yaml
definition_generation: 3
```

必要であれば直前世代への参照を保持できる。

例:

```yaml
definition_generation: 3
supersedes: abc123
```

これを新しいstate machineとして実装しない。

Correction generationは既存lineageの索引に限定する。

---

## 5. OUT of Scope

本Sliceでは以下を行わない。

### 5.1 Human Gate変更

以下を含むHuman Gateの新設、削除、自動承認、自動実行を行わない。

```text
Human Definition Lock GO
Human Implementation Start GO
Human Ready GO
Human Merge GO
Deploy GO
Production Write GO
Actual Staff Value CONFIRMED
SharePoint / M365 / Entra mutation authority
```

### 5.2 GitHub Source of Truthの置換

Structured Gate PacketをGitHub live stateの代替としない。

IssueコメントやPR stateに存在するHuman authorityをPacketだけで上書きしない。

Packetは証跡への索引であり、証跡そのものではない。

### 5.3 Architecture / Review文書の複製

以下をPacketへコピーしない。

```text
- Definition本文
- Scope本文
- Review findings全文
- Acceptance evidence全文
- Decision rationale全文
- Human feedback全文
```

必要な場合は参照のみ保持する。

### 5.4 新しいControl Plane

以下を新設しない。

```text
- workflow engine
- approval engine
- state orchestration service
- background executor
- gate automation service
- new authority hierarchy
```

### 5.5 5文プロンプト達成

「5文プロンプトで全作業を完了できること」を本SliceのAcceptance Criterionとしない。

短い委任は結果として可能になる可能性があるが、本Sliceの目的は現在状態の安価な取得である。

### 5.6 verify:slice

Slice-specific verification routerは本Sliceでは実装・定義しない。

Structured Gate Packetのフィールドと利用形態が確定した後の別Sliceとする。

### 5.7 GitHub Issue Template

Issue template変更は本Sliceに含めない。

Packetの必要入力が確定した後の別Sliceとする。

---

## 6. Proposed Minimal Representation

実装形式はDefinition段階ではLOCKしない。

候補として以下を比較対象に含める。

```text
A. 既存PR gate blockを機械的にparseする
B. 既存project-status出力を機械可読化する
C. 最小YAMLを1 Issueにつき1ファイル置く
```

新しいファイル種別を追加する前に、AまたはBで要求を満たせないか確認する。

新規Packetファイルが必要な場合でも、最小構造を優先する。

仮形式:

```yaml
issue: 552
pr: 563

authorized_paths:
  - spfx/src/shell/monitoring/**

locked_heads:
  definition: abc123
  scope: def456

definition_generation: 3
supersedes: abc123

gates:
  definition_lock: CONSUMED
  implementation_start: CONSUMED
  ready: ELIGIBLE
  merge: NOT_RECEIVED

next_human_action: ACTUAL_STAFF_VALUE_CONFIRMED
```

この形式は例示であり、Definition Lock時点で必須schemaとして確定しない。

Packet freshness / staleness signal（`updated_at`、`packet_basis_sha` 等）は
Implementation Scope で決定する。

---

## 7. Existing Capability Reuse

新規機構を追加する前に、以下の既存能力を再利用できるか確認する。

```text
project-status skill
CURRENT / GATE / ALLOWED / FORBIDDEN / NEXT

permission-matrix

gate-definitions

existing PR gate blocks

existing architecture / review artifacts

GitHub live Issue / PR state
```

特に、`project-status` が既に答えられる情報をStructured Gate Packetへ重複保存しない。

Structured Gate Packetが必要になる理由は、既存情報の意味不足ではなく、**Issue単位の現在状態を低コストで再利用可能な形で取得できないこと**に限定する。

---

## 8. Consistency Rules

### 8.1 Fail Closed

PacketとGitHub live evidenceが一致しない場合、mutationを進めない。

Packetとlocked Definition / Scopeが一致しない場合、mutationを進めない。

Packetが古い可能性を排除できない場合、現在状態をUNKNOWNとして扱えること。

### 8.2 No Authority Escalation

以下を禁止する。

```text
ELIGIBLE → CONSUMED の推測
NOT_RECEIVED → ELIGIBLE の推測
CI GREEN → Ready authority
Review PASS → Human Ready GO
Human Ready GO → Human Merge GO
Packet存在 → Implementation authorization
Packet編集 → Human GO state 変化
```

### 8.3 Exact Reference

locked HEADを記録する場合、可能な範囲で曖昧なbranch名だけではなくSHA等の固定識別子を使用する。

ただし、GitHub live current HEADそのものをPacketへ恒久的に固定する必要があるとは限らない。

何を固定し、何をlive readするかはImplementation Scopeで決定する。

### 8.4 Minimal Duplication

Packetへ保持する値は、Codexが現在状態を判断するために必要な索引情報に限定する。

人間が読む説明文を大量にPacketへ追加しない。

---

## 9. Primary Consumer

Primary consumerはCodex / repository agentとする。

人間向けダッシュボードを本Sliceの目的にしない。

AI Development Control Center連携も本Sliceでは行わない。

将来のconsumerとして利用可能な構造を妨げないことは望ましいが、そのための抽象化を先行実装しない。

---

## 10. Required Agent Behavior

Structured Gate PacketはEvidence sourceではなく、Evidenceへ到達するための索引として扱う。

Packetは、GitHub live stateおよびlocked Definition / Scopeなどの意味正本より上位のauthorityを持たない。

Agentは以下の順序で利用する。

```text
1. GoalからIssue / PR anchorを特定する
2. Packetを現在状態探索の入口として読む
3. Packetが参照するGitHub live evidenceおよびlocked semanticsを確認する
4. authorized scopeと現在のHuman GO状態を確認する
5. mutationを伴う場合は、mutation直前にGitHub live stateを再確認する
6. required verificationを実施する
7. next Human Gateの前で停止する
```

Packet単独をmutation authorizationの根拠としてはならない。

PacketとGitHub live stateが一致していても、Human GOを必要とするmutationではGitHub live evidenceを再確認する。

PacketとGitHub live stateまたはlocked semanticsが矛盾する場合は、既存のEvidence priorityに従ってPacketを採用せず、fail-closedとする。

PacketからHuman authorityを推測または生成してはならない。

---

## 11. Acceptance Criteria for This Slice

本SliceのDefinition / 将来のImplementationは、少なくとも以下を満たす必要がある。

```text
AC-1
AgentがIssue単位のCurrent Gateを一箇所から取得できる。

AC-2
Agentがauthorized pathsを一箇所から識別できる。

AC-3
Agentが現在有効なDefinition / Scope固定点を識別できる。

AC-4
Agentがcorrection generationを識別できる。

AC-5
Agentが次のHuman actionを識別できる。

AC-6
Packet単独ではHuman GOを発行・消費・昇格できない。

AC-7
GitHub live evidence / locked semanticsとの矛盾はfail-closedになる。

AC-8
既存Definition / Scope / Review本文をPacketへ複製しない。

AC-9
新しいControl Plane / Gate / executorを追加しない。

AC-10
既存project-status等で十分な場合、新しいPacket file formatを追加しない選択肢を保持する。

AC-11
Agentの通常作業authorityだけではPacketを更新できない。

AC-12
Packet更新によってHuman GO stateを成立・消費・昇格・無効化できない。

AC-13
mutation前にはPacketだけでなくGitHub live evidenceで必要なHuman GOを再確認する。

AC-14
Gate keyおよびnext_human_actionは既存プロセスの語彙を参照し、
Packet独自のauthority vocabularyを新設しない。
```

---

## 12. Non-Goals / Success Misinterpretations

以下を成功条件として扱わない。

```text
- 全PRを5文だけで処理できる
- Human reviewが不要になる
- Codexが自由にImplementationを開始できる
- CI GREENだけでReadyになる
- Packetが常にGitHubより正しい
- すべての過去IssueへPacketをretrofitする
- 全Skillを整理・統合する
- governance文書を一括削除する
- Packetを更新すればGate状態が変わる
- PacketをGitHub live evidenceのキャッシュ正本として扱う
- Agentが通常Implementationの一部として自由にPacketを更新する
- Packet独自のGate / Human action vocabularyを作る
```

---

## 13. Migration Boundary

初期Implementationを行う場合でも、全Issueへの一括導入を前提としない。

最小1 Issueまたは1代表Sliceで検証可能であることを優先する。

既存Issue / PR lineageを大量に書き換えない。

既存GitHub commentsをmigration目的で編集しない。

---

## 14. Ponytail Review Questions

Independent Definition Reviewとは別に、過剰設計防止として次の3点を確認する。

### P-1 Existing Capability

```text
project-status skill + existing gate block
```

だけで必要な状態を十分に取得できないか。

できる場合、新ファイルを追加しない。

**Re-Review conclusion:** 低コスト索引層は依然必要。Packet は Control Plane ではない。

### P-2 Minimal Storage

既存PR gate blockをparse可能にするだけで要求を満たせないか。

満たせない場合のみ、Issue単位の最小Packetを検討する。

**Re-Review conclusion:** parse-only は fragile。Implementation Scope で A/B/C 評価。

### P-3 Correction Representation

Correction lineageに新しいstate machineが本当に必要か。

原則として、

```yaml
definition_generation: 3
supersedes: abc123
```

程度の索引で足りるかを先に確認する。

**Re-Review conclusion:** state machine 不要。

---

## 15. Independent Definition Review Focus

Independent Definition Reviewでは、最低限次を確認する。

```text
- Packetが新しいsource of truthになっていないか
- Human authorityを暗黙に拡張していないか
- GitHub live evidenceとの競合処理がfail-closedか
- authorized pathsが新しいauthorizationになっていないか
- correction generationが不要なstate machineになっていないか
- project-statusとの重複が過剰でないか
- verify:slice / Issue Templateを先取りしていないか
- 5文プロンプト達成を目的化していないか
```

Review-1 / Re-Review-1 結果:

```text
Independent Definition Review-1     = CORRECTION REQUIRED / CONSUMED
Definition Correction-1             = APPLIED
Independent Definition Re-Review-1  = PASS / REVIEW-CLEARED
  P0=0 / P1=0 / P2=1 (packet freshness deferred to Implementation Scope)
```

---

## 16. Current Gate

```text
ASANA-STYLE-DELEGATION-SLICE-A

Definition ID = ASANA-STYLE-DELEGATION-SLICE-A-DEFINITION-1
Correction = 1
Status = HUMAN DEFINITION LOCKED

Human Definition Lock GO = CONSUMED
Independent Definition Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED

Implementation Scope = NOT AUTHORIZED
Implementation = NOT AUTHORIZED
Packet representation LOCK (A/B/C) = NOT AUTHORIZED
verify:slice = NOT AUTHORIZED
GitHub Issue Template = NOT AUTHORIZED
PR creation for Implementation = NOT AUTHORIZED
Ready = NOT AUTHORIZED
Merge = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
Production Write = NOT AUTHORIZED
```

---

## 17. Next

```text
Implementation Scope Definition（別 Gate）
        ↓
A/B/C representation evaluation
Pilot Issue 1件
Packet freshness fields
next_human_action closed enum
        ↓
Human Implementation Scope GO / HOLD
        ↓
（別 Gate）Implementation
```

Human Definition Lock GO は Structured Gate Packet Definition のロックのみを認可する。

Implementation Start、Ready、Merge、Deploy、Production Write、SharePoint / M365 / Entra
mutation は認可しない。
