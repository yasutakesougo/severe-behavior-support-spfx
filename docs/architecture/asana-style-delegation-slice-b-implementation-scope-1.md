# ASANA-STYLE-DELEGATION-SLICE-B — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: ASANA-STYLE-DELEGATION-SLICE-B-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: REVIEW-CLEARED / AWAITING HUMAN IMPLEMENTATION START GO
parent definition: ASANA-STYLE-DELEGATION-SLICE-B-DEFINITION-1
parent durable path: docs/architecture/asana-style-delegation-slice-b-definition-1.md
Definition Lock PR: #569 MERGED
Definition merge commit / main: 426fddb7914df7d3fbf41739add91e852bf35b02
Definition artifact blob on main: d107e855eccd7ebdf3b7733bd1e6860b9871e1a0
Human Definition Lock GO: CONSUMED
Second Pilot: #548 SELECTED / READ-ONLY
Second Pilot selection record: docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md
Second Pilot selection blob: b489b11ee730bc27507515c4b30224b58feb86bd
Independent Scope Review-1: CORRECTION REQUIRED / CONSUMED
Scope Correction-1: APPLIED
Independent Scope Re-Review-1: PASS / REVIEW-CLEARED / P0=0 / P1=0 / P2=1 / CONSUMED
Human Implementation Start GO: NOT RECEIVED
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Second Pilot mutation authority: NO
```

This document fixes the smallest Implementation Scope that can prove Slice-A Option B
portability to Second Pilot #548 without redesigning the Locked Definition, adding Human
Gates, changing Product behavior, or mutating the Second Pilot itself.

This document does **not** authorize Implementation Start or Second Pilot mutation.

---

## 1. Basis

```text
Parent Definition:
ASANA-STYLE-DELEGATION-SLICE-B-DEFINITION-1

Parent durable path:
docs/architecture/asana-style-delegation-slice-b-definition-1.md

Definition Lock PR:
#569 MERGED

Definition merge commit / main at Scope bind:
426fddb7914df7d3fbf41739add91e852bf35b02

Definition artifact blob on main:
d107e855eccd7ebdf3b7733bd1e6860b9871e1a0

Post-merge readback:
docs/architecture/asana-style-delegation-slice-b-post-merge-readback-569.md

Parent Slice-A (CLOSED):
Option B Structured Gate Packet @ Pilot #552 only on main

Second Pilot selection:
docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md
Second Pilot Issue / PR anchor = #548
Selection = READ-ONLY / mutation authority = NO

Human Definition Lock GO:
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
  → SATISFIED @ main 426fddb / blob d107e855

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

Second Pilot Selectionの記録は、Implementation Start GOを生成しない（Definition §4.1）。

---

## 2. Goal

Second Pilot #548について、Slice-A Option B readerが以下を取得できることを
最小registry / parser変更で実装可能な状態まで定義する。

```text
- Issue / PR anchor (#548)
- authorized paths（exact 7-file surface）
- locked Definition / Scope / implementation identity
- current Human GO states（formal-token only）
- correction generation
- next Human action
- freshness / live provenance
- Pilot #552 regression preserved
- PORTABLE-A / PORTABLE-B / NOT-PORTABLE classification
- SB-11 Short Delegation READ-ONLY Acceptance readiness
```

Human authorityそのものは既存GitHub live evidenceに残す。

実装するものはREAD-ONLY indexであり、authority storeではない。

Slice-B Implementation Start GO ≠ Second Pilot本体へのmutation authority（Definition §4.1）。

---

## 3. Second Pilot bind (#548)

Scope Lock時点でSecond Pilotは **#548** に固定する（selection record準拠）。

| Field | Value |
|---|---|
| Issue anchor | #548 (PR-backed issue resource) |
| PR anchor | #548 |
| Primary evidence | `docs/architecture/review-to-plan-revision-relationship-implementation-evidence.md` |
| Definition lineage | `docs/architecture/review-to-plan-revision-relationship-definition-1.md` |
| Scope lineage | `docs/architecture/review-to-plan-revision-relationship-implementation-scope-1.md` |
| Definition blob (pilot lineage) | `2ec766c97b1e1a09bb7fc4de85118eaf8dd73264` |
| Scope blob (pilot lineage) | `0a863e693a5fc42359200081a1b3659aa2227bce` |
| exact implementation HEAD | `1cf450fb1718ace2b437e8414a481071058abe7e` |
| PR merge commit | `ea0963268c8ba86c546a2c251b4fd81a582c08a3` |

### 3.1 Portability stress (pre-implementation expectation)

#548 differs from Pilot #552 in ways that test minimal generalization:

```text
- authorized path grammar = markdown heading + bounded text fence
  (Pilot #552 uses inline "Authorized diff:" label)
- pilot lineage Definition / Scope blobs differ from Slice-A parent blobs
- selection record carries dual Definition identity (Slice-B parent vs #548 lineage)
- historical Scope header gate text vs later consumed evidence state
- live PR lifecycle MERGED with durable ready/merge formal tokens absent
```

Pre-implementation expectation: **PORTABLE-B** (registry + bounded explicit-source parsers).
Final classification requires Implementation verification (§15).

### 3.2 Portability Minimum Evidence Floor (Definition §9.0)

Selection-time floor readiness = PASS (selection record §Minimum Evidence Floor).

Implementation must preserve:

```text
Issue anchor exact = YES (#548)
PR anchor exact = YES (#548)
authorized_paths exact = YES (7 paths from evidence)
>=1 locked execution identity exact = YES (implementation HEAD)
live source provenance explicit = YES
Human GO inference = NO
```

`authorized_paths = UNKNOWN` は PORTABLE-A/B として扱わない（Definition §9.0）。

---

## 4. Representation Rule

Slice-BはSlice-A Option Bを **reuse** する。Option Cは採用しない。

```text
Slice-A Option B reader
        ↓
Second Pilot #548 registry entry
        ↓
Portability Minimum Evidence Floor satisfied?
  NO → NOT-PORTABLE / STOP / record
  YES
        ↓
PORTABLE-A? (registry-only, #552 unchanged)
  YES → finish

  NO
   ↓
PORTABLE-B? (minimal parser normalization)
  YES → verify → finish

  NO
   ↓
NOT-PORTABLE → STOP / architecture decision
```

Option C / docs/gates/issue-*.yaml へ進まない。

---

## 5. Permitted Implementation Changes

Human Implementation Start GO成立後のみ、以下の最小変更を許可する。

### 5.1 Registry

`scripts/lib/gate-packet/pilots.mjs` に Second Pilot #548 エントリを追加する。

想定フィールド（exact valuesはStart GO bind時に再確認）:

```text
issue: 548
pr: 548
evidencePaths:
  - docs/architecture/review-to-plan-revision-relationship-implementation-evidence.md
sliceBindPaths:
  - docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md
supplementaryPr: 548
```

Pilot #552 registry entry は変更しない（regression baseline）。

`sliceBindPaths` は上記 selection record に固定する。Start GO readback で
equivalent bind artifact へ差し替える場合は Scope Correction が必要。

### 5.2 Parser contracts (PORTABLE-B candidate)

**Correction-1 (C1 / C2):** explicit source grammar generalization ≠ generic parser。

#### 5.2.1 Pilot #552 — authorized paths (unchanged)

既存 `parseAuthorizedPaths` の `"Authorized diff:"` literal parser を **変更しない**。

#### 5.2.2 Pilot #548 — authorized paths (bounded grammar)

新関数 `parseAuthorizedSurfaceDelivered(markdown)` を追加する（または pilot-specific
dispatch のみ）。#548 canonical evidence grammar を **exact** に固定する:

```text
exact heading:
  ## 1. Authorized surface delivered

within heading section only:
  line containing "Exact diff from scope start HEAD"
  → immediately following first ```text fence = sole path source
```

Expected paths（V-B5）:

```text
src/domain/index.ts
src/domain/monitoring-period-review-outcome.ts
src/domain/support-plan-version-monitoring-period-review-binding.ts
tests/domain/monitoring-period-review-outcome.test.ts
tests/domain/support-plan-version-monitoring-period-review-binding.test.ts
tests/contracts/monitoring-period-review-outcome-contract.test.ts
tests/contracts/support-plan-version-monitoring-period-review-binding-contract.test.ts
```

禁止:

```text
arbitrary heading scan
generic markdown path harvesting
PR body path inference
repo-wide path discovery
colon label "Authorized surface delivered:" （canonical evidence に存在しない）
```

#### 5.2.3 Second Pilot locked identity (bounded section)

新関数 `parseSecondPilotLockedHeads(markdown)` を追加する。

`parseSliceABindLockedHeads` の意味は **変更しない**（Pilot #552 bind 専用のまま）。

Source:

```text
docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md
```

Bounded section **のみ**:

```text
## Available locked identity
```

Section 内の `Definition blob =` / `Scope blob =` /
`exact implementation HEAD =` のみを読む。

Expected（V-B6）:

```text
locked_heads.definition = 2ec766c97b1e1a09bb7fc4de85118eaf8dd73264
locked_heads.scope      = 0a863e693a5fc42359200081a1b3659aa2227bce
locked_heads.implementation = 1cf450fb1718ace2b437e8414a481071058abe7e
```

禁止:

```text
selection record 全体からの汎用 regex
header の Slice-B parent Definition blob (d107e855...) を locked_heads.definition に返す
`:` → `[:=]` の無条件一般化
```

Alternative（Scope Correction 不要で許可）: Start GO readback artifact で
pilot lineage identity を専用 label へ再固定し、その artifact のみ bind する。
いずれの場合も Slice-B parent blob を pilot lineage definition として返してはならない。

### 5.3 Tests

```text
- Pilot #552 regression（V-B2）
- Pilot #548 structured read（V-B1）
- formal-token fail-closed（V-B3）
- live lifecycle / Human GO separation（V-B4）
- authorized_paths exact 7 paths（V-B5）
- locked identity from bounded section only（V-B6）
- PORTABLE classification fixture（V-B13）
- #548 expected gate behavior（§5.6 / P2-1）
```

### 5.6 #548 expected gate behavior (Correction-1 C4 / P2-1)

#548 durable evidence には formal ready/merge token が残っていない。
live PR lifecycle は MERGED である。これは fail-closed の **期待動作** であり失敗ではない。

Implementation / SB-11 test plan で固定する expected output:

```text
live.pr_state = MERGED

gates.definition_lock = CONSUMED
gates.implementation_start = CONSUMED

gates.ready = UNKNOWN
gates.merge = UNKNOWN

next_human_action = UNKNOWN
```

```text
PR MERGED ≠ Human Merge GO inference
durable exact formal token unavailable → UNKNOWN → STOP
```

「UNKNOWN だから parser 不足」と Implementation Review で誤判定してはならない。

### 5.4 CLI / npm script

既存 `npm run gate-packet:read -- <issue>` が #548 を受け付けること。
新CLI surfaceの追加は不要（registry追加のみで足りる想定）。

### 5.5 SB-11 Short Delegation READ-ONLY Acceptance

Implementation完了後、別phaseで評価する（Definition SB-11）。

Scope時点では **test plan のみ** 固定する:

```text
Input (example):
  Issue #548 の現在状態を確認し、
  現在authorizedな次作業を特定する。
  gate-packet readerを使用する。
  mutationは行わず、次のHuman Gateで停止する。

Acceptance:
  - 正しい Issue / PR へ到達
  - gate / authorized_paths / locked HEAD を取得
  - live MERGED でも ready/merge を推測しない（§5.6）
  - next_human_action = UNKNOWN でも STOP できる
  - unauthorized mutation なし
  - next Human Gate で STOP
  - Second Pilot本体へのmutationを開始しない
```

SB-11 PASS ≠ Second Pilot work authorization（Definition §4.1）。

---

## 6. IN Scope

```text
- Second Pilot #548 registry entry
- 必要な場合のみ小さなparser normalization（§5.2）
- Pilot #552 regression preservation
- structured current-state read for #548
- authorized paths / locked HEAD / Gate state / generation / next_human_action
- minimum freshness / live provenance signal
- PORTABLE-A / PORTABLE-B / NOT-PORTABLE classification recording
- focused automated tests（§5.3）
- SB-11 READ-ONLY test plan（§5.5）
- fail-closed mismatch tests
```

---

## 7. OUT of Scope

```text
- 3件以上のPilot / 全Issue対応
- Option C / docs/gates/issue-*.yaml
- verify:slice
- GitHub Issue Template changes
- AI Development Control Center / dashboard
- background sync / webhook / daemon / database
- approval engine / state orchestration service
- Human Gate新設・自動消費
- Ready / Merge自動化
- Deploy / Production Write
- SharePoint / M365 / Entra mutation
- Product / SPFx / domain behavior changes
- Second Pilot #548 本体への新規mutation
- repository-wide scanner / automatic pilot discovery
- generic PR body grammar
- new generic state engine
```

---

## 8. Authorized Mutation Surface

Human Implementation Start GO成立後も、mutationは **exact file allowlist** に限定する
（Correction-1 C3）。

```text
scripts/lib/gate-packet/pilots.mjs

scripts/lib/gate-packet/parse-markdown-evidence.mjs
  only if PORTABLE-A fails (expected: required for #548 bounded parsers)

tests/governance/gate-packet-read.test.ts

docs/architecture/asana-style-delegation-slice-b-implementation-*.md
```

現時点で **除外**（必要が判明した場合は STOP → Scope Correction）:

```text
package.json
.agents/skills/project-status/**
scripts/lib/gate-packet/read-gate-packet.mjs
scripts/** （上記以外）
tests/** （上記以外）
generic docs/architecture/**
Second Pilot lineage artifact の semantics 変更
```

`read-gate-packet.mjs` 等別 file 変更が実際に必要と判明した場合:

```text
STOP → Scope Correction → Re-Review
```

Human Implementation Start GO + 確定allowlistが揃うまで変更してはならない。

Implementation PRは allowlist 内の Slice-B portability evidence / classification
記録を含めてよい。

---

## 9. Forbidden Mutation Surface

```text
spfx/src/**
src/domain/**
production application behavior
SharePoint / M365 / Entra configuration
deployment manifests / release artifacts / business data
Second Pilot #548 implementation files（authorized 7-file surface）
verify:slice / Issue Template / docs/gates/**
```

---

## 10. Required Verification

| ID | Check |
|---|---|
| V-B1 | Second Pilot #548 structured read PASS |
| V-B2 | Pilot #552 regression PASS |
| V-B3 | formal-token fail-closed PASS |
| V-B4 | live lifecycle / Human GO separation PASS（#548: MERGED ≠ merge GO; §5.6） |
| V-B5 | authorized_paths exact（7 paths via §5.2.2; UNKNOWN = floor fail） |
| V-B6 | locked identity from §5.2.3 bounded section（≥1 execution identity exact） |
| V-B7 | correction generation exact or UNKNOWN |
| V-B8 | next_human_action exact or UNKNOWN（#548: UNKNOWN expected; §5.6） |
| V-B9 | live unavailable provenance PASS |
| V-B10 | npm run verify:ci PASS |
| V-B11 | Product / SPFx / domain delta = 0 |
| V-B12 | SB-11 Short Delegation READ-ONLY Acceptance PASS / FAIL fixed |
| V-B13 | Portability Minimum Evidence Floor evaluated before PORTABLE-A/B |

Definition §12 Verification Requirements と一致する。

---

## 11. Implementation Stop Conditions

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
- Portability Minimum Evidence Floor未達でPORTABLE-A/Bと判定する
- Second Pilot本体へのmutationが必要
- locked Definition identityをexact bindできない
```

---

## 12. Scope Acceptance Criteria

```text
SC-B1  Second Pilot = exactly #548
SC-B2  Parent Definition exact bind @ 426fddb / d107e855
SC-B3  Option B reuse; Option C OUT
SC-B4  Pilot #552 regression required
SC-B5  READ-ONLY index only
SC-B6  Human Gate不変更
SC-B7  mutation前live re-check維持
SC-B8  Product / SPFx / domain delta = 0
SC-B9  verify:slice / Issue Template含めない
SC-B10 Human Implementation Start GO前に実装しない
SC-B11 PORTABLE-A/B/NOT-PORTABLE + Minimum Evidence Floor
SC-B12 SB-11 READ-ONLY Primary Acceptance plan fixed
SC-B13 Slice-B GO ≠ Second Pilot mutation（Definition §4.1）
SC-B14 Selection record bind preserved（blob b489b11; §5.2.3 bounded section）
SC-B15 Parser = bounded explicit-source grammar（§5.2; not generic scan）
SC-B16 Authorized mutation = exact file allowlist only（§8）
```

---

## 13. Human Gate Alignment

新しいHuman Gateは作らない。既存フロー:

```text
Implementation Scope Definition（this document）
        ↓
Independent Scope Review-1
        ↓
（必要なら Scope Correction）
        ↓
exact Scope readback on Scope PR
        ↓
Human Implementation Start GO / HOLD
        ↓
（別Gate）Implementation
        ↓
Focused Verification（V-B1–V-B13）
        ↓
SB-11 Short Delegation READ-ONLY Acceptance
        ↓
Independent Implementation Review
        ↓
Human Ready GO
        ↓
separate Human Merge GO
```

---

## 14. Current Gate

```text
ASANA-STYLE-DELEGATION-SLICE-A
= CLOSED（Option B @ Pilot #552）

ASANA-STYLE-DELEGATION-SLICE-B

Locked Definition on main @ 426fddb / blob d107e855
Human Definition Lock GO = CONSUMED
Second Pilot #548 = SELECTED / READ-ONLY
Second Pilot mutation authority = NO

Implementation Scope Definition = RECORDED (this document)
Independent Scope Review-1 = CORRECTION REQUIRED / CONSUMED
Scope Correction-1 = APPLIED
Independent Scope Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED
Exact Scope re-readback on Scope PR = COMPLETE
Human Implementation Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
PORTABLE-A / PORTABLE-B = NOT YET CLASSIFIED
Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## 15. Next

```text
Independent Scope Re-Review-1 = PASS / REVIEW-CLEARED / CONSUMED
        ↓
Human Implementation Start GO / HOLD
        ↓
（GO後のみ）
Locked Definition exact bind reconfirm @ 426fddb / d107e855
Second Pilot #548 registry + bounded parsers（§5.2）
Pilot #552 regression + #548 structured read
PORTABLE classification + SB-11 READ-ONLY Acceptance
```

Implementation Start GOはSlice-B portability **実装**のみを認可する。

Second Pilot #548 mutation / Ready / Merge / Deploy / Production Write /
SharePoint mutationは認可しない。
