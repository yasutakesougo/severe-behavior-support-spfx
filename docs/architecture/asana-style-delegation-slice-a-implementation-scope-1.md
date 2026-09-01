# ASANA-STYLE-DELEGATION-SLICE-A — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: ASANA-STYLE-DELEGATION-SLICE-A-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: SCOPE CORRECTION-1 APPLIED / AWAITING EXACT SCOPE READBACK ON PR
parent definition: ASANA-STYLE-DELEGATION-SLICE-A-DEFINITION-1
parent durable path: docs/architecture/asana-style-delegation-slice-a-definition-1.md
Definition Lock PR: #566 MERGED
Definition merge commit / main: 12fc780017244bc4cb7ef8e96f18ce35e40b3bfb
Definition artifact blob on main: 25443455fad9d0ccb76a84a4ebdc94c4ac242442
Human Definition Lock GO: CONSUMED
Independent Definition Re-Review-1: PASS / REVIEW-CLEARED / CONSUMED
Independent Scope Review-1: CORRECTION REQUIRED / CONSUMED
Scope Correction-1: APPLIED
Independent Scope Re-Review-1: PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=1 / CONSUMED
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

This document fixes the smallest Implementation Scope that can realize the Locked
Definition’s Structured Gate Packet index without redesigning the Definition, adding
Human Gates, or changing Product behavior.

This document does **not** authorize Implementation Start.

---

## 1. Basis

```text
Parent Definition:
ASANA-STYLE-DELEGATION-SLICE-A-DEFINITION-1

Parent durable path:
docs/architecture/asana-style-delegation-slice-a-definition-1.md

Definition Lock PR:
#566 MERGED

Definition merge commit / main at Scope bind:
12fc780017244bc4cb7ef8e96f18ce35e40b3bfb

Definition artifact blob on main:
25443455fad9d0ccb76a84a4ebdc94c4ac242442

Post-merge readback:
docs/architecture/asana-style-delegation-slice-a-post-merge-readback-566.md

Human Definition Lock GO:
CONSUMED

Human Ready GO (#566):
CONSUMED

Human Merge GO (#566):
CONSUMED

Human Implementation Start GO:
NOT RECEIVED

Implementation:
NOT AUTHORIZED
```

Implementation Start時には、親Definitionのexact artifact identityを再固定する。

最低限、以下が必要である。

```text
A.
Locked Definitionがmainへmerge済みであり、
そのdurable pathとexact merged commit / artifact identityを確認できる。
  → SATISFIED @ main 12fc780 / blob 25443455

OR

B.
未mergeの場合、
review-cleared Locked Definition artifactのexact HEAD / blob identityへ
明示的にbindされている。
```

branch名またはPR番号だけをImplementation authorityの固定点として使用しない。

Implementation Start bind時点でexact artifact identityを一意に確認できない場合は
`UNKNOWN`としてSTOPする。

Definition Lock / Ready / Merge GOの消費は、Implementation Start GOを生成しない。

---

## 2. Goal

以下の状態を、Codexが長いPR本文やIssueコメントを毎回再構成せずに取得できる
最小経路を実装可能な状態まで定義する。

```text
- Issue / PR anchor
- authorized paths
- locked Definition / Scope HEAD
- current Human GO states
- correction generation
- next Human action
- freshness / staleness判断材料
```

Human authorityそのものは既存GitHub live evidenceに残す。

実装するものはREAD-ONLY indexであり、authority storeではない。

---

## 3. Representation Evaluation

Locked Definitionで保留したA/B/Cを、このScopeで比較する。

### Option A — Existing PR Gate Block Parsing

```text
既存Markdown → parser → structured current state
```

**Scope Verdict: A = REJECT AS PRIMARY IMPLEMENTATION**

本Sliceでは、既存PR本文全体を安定APIとして扱わない。

PR本文を補助Evidenceとして読むことは禁止しない。

---

## 4. Option B — `project-status` Structured Output Extension

既存`project-status`能力から、機械可読なcurrent-state indexを生成できるかを
最初に確認する。

概念例:

```json
{
  "issue": 552,
  "pr": 563,
  "authorized_paths": [],
  "locked_heads": {},
  "gates": {},
  "definition_generation": 3,
  "next_human_action": "UNKNOWN"
}
```

### Required Conditions

Option Bを採用できるのは、B-1〜B-8をすべて満たす場合に限る。

```text
B-1  既存project-statusのauthority modelを変更しない
B-2  GitHub live evidence priorityを変更しない
B-3  Agentがstructured outputを書き換えてGOを成立させられない
B-4  Issue単位でauthorized pathsを取得できる
B-5  locked Definition / Scope HEADを一意に取得できる
B-6  correction generationを一意に取得できる
B-7  next Human actionを一意またはUNKNOWNとして取得できる
B-8  既存project-statusに大規模なstate engineを追加しない
```

**Preferred Verdict: B = FIRST IMPLEMENTATION CANDIDATE**

既存能力の小さな拡張だけでAcceptance Criteriaを満たせるなら、Option Cを追加しない。

### 4.1 Option B Permitted Read Sources

Option Bは、新しいrepository-wide state engineを構築してはならない。

Option Bが使用できるPrimary Read Sources:

**Allowed Primary Sources**

```text
1. GitHub live state
   Issue / PR / review-cleared Human GO comments / PR state / HEAD / SHA

2. Locked architecture artifacts
   docs/architecture/*-definition-*.md
   docs/architecture/*-implementation-scope-*.md
   review-cleared durable path固定文書

3. Pilotに紐づくreview-cleared scope artifact
   authorized paths / IN / OUT / locked identity / correction generation
```

**Allowed Derived Values**（Primaryから一意に決定できる場合のみ）:

```text
issue / pr anchor
authorized_paths
locked_heads
definition_generation
gate subset
next_human_action
freshness / staleness signal
```

一意に決定できない値は`UNKNOWN`とする。

**Forbidden Primary Sources / Behaviors**

```text
- 自由記述PR本文全体をPrimary parser inputにする
- 過去PRの非統一gate blockを汎用grammarとして仮定する
- comment chronologyからHuman GOを推測する
- CI GREENからReady eligibilityまたはGOを生成する
- Review PASSからHuman Ready GOを生成する
- branch名だけからlocked artifactを推測する
- repository全体を走査して独自state machineを再構築する
```

PR本文や過去commentは補助Evidenceとして読めるが、mutation authorizationの単独根拠にしてはならない。

---

## 5. Option C — Minimal Persistent Gate Packet

Option Bだけでは必要状態を安定取得できない場合に限り、Issue単位の最小indexを許可する。

候補path:

```text
docs/gates/issue-<N>.yaml
```

pathおよびYAML形式はImplementation開始前のFocused Design Checkで最終確認する。

概念上の最大surface:

```yaml
issue: 552
pr: 563
authorized_paths:
  - example/path/**
locked_heads:
  definition: abc123
  scope: def456
definition_generation: 3
supersedes: abc123
gates:
  definition_lock: CONSUMED
  implementation_start: CONSUMED
  ready: NOT_RECEIVED
  merge: NOT_RECEIVED
next_human_action: ACTUAL_STAFF_VALUE_CONFIRMED
freshness:
  evidence_checked_at: "..."
  evidence_basis_sha: "..."
```

Option Cを採用した場合のpersistent Packet作成・更新authorityは、Locked Definition
§3.1 `Packet Read / Write Authority` に従う。

Agentの通常Implementation authorityだけではPacket更新authorityを得ない。

Packet編集だけで GO state を変更してはならない（Definition §3.1）。

Option C採用時に別のapproval engineまたはPacket-specific Human Gateを新設しない。

---

## 6. Representation Decision Rule

```text
Option B feasibility check
        ↓
ACを満たす
        ├─ YES → Bを採用
        └─ NO → failure reason固定 → Option C eligibility
```

Option Aへfallbackしない。BとCを同時実装しない。

Option BがB-1〜B-8を満たさない場合、Option Cへ進む前にfailure reasonを固定する。

```text
OPTION B FEASIBILITY

Pilot:
Exact basis:
Result: PASS / FAIL

Failed requirements:
- B-<N>: <reason>

Unavailable or unstable fields:
- <field>: <reason>

Why UNKNOWN is insufficient:
- <reason or NONE>

Option C required:
YES / NO
```

`Option C required = YES` は「Cの方が便利」だけを理由にしてはならない。

Option Bが`UNKNOWN`を安全に返してAcceptanceを満たせる場合、不必要にCへ進まない。

---

## 7. Freshness / Staleness

Freshness signalはEvidence priorityを変更しない。

```text
GitHub live evidence
        >
locked / review-cleared semantics
        >
Structured Gate Packet or structured index
        >
historical / stale reference
```

`evidence_checked_at` **または** `evidence_basis_sha` のいずれかで足りる（両方必須ではない）。

freshnessがfreshでも、Human GOを必要とするmutationの直前live re-checkは省略できない。

Evidence priorityに独自数値順位を新設しない。`project-status/evidence.md` との意味整合を維持する。

---

## 8. Gate Vocabulary

Packetまたはstructured outputは既存Gateのsubsetのみ。

```text
definition_lock
implementation_start
ready
merge
deploy
production_write
actual_staff_value
```

Gate state語彙（Locked Definition準拠）:

```text
NOT_RECEIVED | ELIGIBLE | CONSUMED | INVALIDATED | FORBIDDEN | UNKNOWN
```

---

## 9. `next_human_action`

free text禁止。既存Human Gate vocabularyへの写像。

Implementation Scopeでclosed enumを定義する。本Scopeでの例:

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

複数候補から一意に決められない場合は`UNKNOWN`。

---

## 10. Pilot

Scope Lock時点ではPilot Issueを固定しない。

PilotはHuman Implementation Start GO判断前に、GitHub live stateをREAD-ONLYで1件選定する。

Pilot選定はImplementation / Packet creation / Issue mutation / Ready / Merge等を認可しない。

Pilot条件:

```text
- DefinitionまたはScope lineageがある
- Human GO stateが存在する
- authorized pathsが存在する
- locked HEADが存在する
- correction generationまたは複数review lineageがある
```

lineage-heavyな既存sliceを優先。複数Pilot禁止。過去Issue一括retrofit禁止。

---

## 11. IN Scope

```text
- Option B feasibility check
- 必要ならOption C最小実装
- 1 Pilot Issueのみ
- structured current-state read
- authorized paths / locked HEAD / Gate state / generation / next_human_action index
- 最小freshness signal
- focused automated tests
- fail-closed mismatch tests
```

---

## 12. OUT of Scope

```text
- Option B + C同時実装
- 全Issue Packet作成 / 過去migration
- PR本文grammar全面標準化
- verify:slice / GitHub Issue Template
- AI Development Control Center / dashboard
- background sync / webhook / daemon / database
- approval engine / state orchestration service
- Human Gate新設・自動消費
- Ready / Merge自動化
- Deploy / Production Write
- SharePoint / M365 / Entra mutation
- Product / SPFx / domain behavior changes
```

---

## 13. Authorized Mutation Surface

Human Implementation Start GO成立後も、mutationは最小ファイルに限定する。

最終path allowlistはImplementation開始時にexact HEADとOption B/C決定後に固定する。

想定候補（authorizationではない）:

```text
.agents/skills/project-status/**
scripts/**
tests/**
docs/gates/**
docs/architecture/**
package.json
```

Human Implementation Start GO + 確定allowlistが揃うまで変更してはならない。

---

## 14. Forbidden Mutation Surface

```text
spfx/src/**
src/domain/**
production application behavior
SharePoint / M365 / Entra configuration
deployment manifests / release artifacts / business data
```

---

## 15. Required Verification

| ID | Check |
|---|---|
| V-1 | Pilot Issueで必要フィールドを機械取得 |
| V-2 | index編集だけではGOを成立させない |
| V-3 | 矛盾時mutation eligibilityを成立させない |
| V-4 | 推測せずUNKNOWNを返せる |
| V-5 | authorized pathsを一意取得 |
| V-6 | locked HEADを取得 |
| V-7 | correction generationを取得 |
| V-8 | next Human actionを取得 |
| V-9 | 既存fast verification PASS |
| V-10 | Product / SPFx / domain delta = 0 |
| V-11 | Option B feasibility結果をImplementation選択前に固定 |

---

## 16. Implementation Stop Conditions

```text
- Option Bがstate machineを必要とする
- Option Cが大量semantics複製を必要とする
- Packetをauthority storeとして扱う必要が出る
- GitHub live evidence置換が必要
- Human GO自動消費が必要
- Pilot以外migrationが必要
- verify:sliceが必要
- Product / SPFx変更が必要
- Allowed Primary Sources以外の汎用parserが必要
- locked Definition identityをexact bindできない
- authorized_paths取得に推測が必要
- correction generationに独自lineage state machineが必要
- Option B FAIL理由未固定でOption Cへ進む
- Option C maintenanceに新Human Gateが必要
```

---

## 17. Scope Acceptance Criteria

```text
SC-1  B → 必要ならC の一方向
SC-2  AをPrimaryにしない
SC-3  BとC非同時
SC-4  Pilot 1 Issue
SC-5  READ-ONLY index
SC-6  Human Gate不変更
SC-7  mutation前live re-check維持
SC-8  freshness ≠ authority
SC-9  semantics本文複製禁止
SC-10 Product / SPFx / domain mutation禁止
SC-11 verify:slice / Issue Template含めない
SC-12 Human Implementation Start GO前に実装しない
SC-13 Option B Primary Read Sources限定
SC-14 B→C前にfailure reason固定
SC-15 Implementation Start時Definition exact bind
SC-16 branch/PR番号だけをDefinition固定点にしない
SC-17 PilotはScope Lock時未固定
SC-18 Option C maintenance = Definition §3.1
SC-19 freshnessはEvidence priorityを変更しない
```

---

## 18. Human Gate Alignment

新しい`Human Implementation Scope GO`は作らない。既存フロー:

```text
Implementation Scope Definition（this document）
        ↓
Independent Scope Review-1 = CORRECTION REQUIRED / CONSUMED
        ↓
Scope Correction-1 = APPLIED
        ↓
Independent Scope Re-Review-1 = PASS / REVIEW-CLEARED
        ↓
exact Scope readback on Scope PR
        ↓
Human Implementation Start GO / HOLD
        ↓
（別Gate）Implementation
```

---

## 19. Current Gate

```text
ASANA-STYLE-DELEGATION-SLICE-A

Locked Definition on main @ 12fc780 / blob 25443455
Human Definition Lock GO = CONSUMED
Human Ready / Merge (#566) = CONSUMED

Implementation Scope Definition = RECORDED (this document)
Scope Correction-1 = APPLIED
Independent Scope Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED

Exact Scope readback on Scope PR = PENDING
Human Implementation Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Option B / C = NOT SELECTED
Pilot = NOT YET SELECTED
Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## 20. Next

```text
Exact Scope readback on Scope PR
        ↓
Human Implementation Start GO / HOLD
        ↓
（GO後のみ）
Locked Definition exact bind reconfirm
Pilot 1件 live READ-ONLY選定
Option B feasibility（V-11）
B採用 or 最小C
```

Implementation Start GOはStructured Gate Packetの**実装**のみを認可する。

Ready / Merge / Deploy / Production Write / SharePoint mutationは認可しない。
