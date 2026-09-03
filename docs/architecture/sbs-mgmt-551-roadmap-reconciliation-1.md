# #551 Roadmap Reconciliation 1 — insert SBS-MGMT-PLAN-ACTIVATION-C

```text
repository: yasutakesougo/severe-behavior-support-spfx
kind: roadmap reconciliation（docs SoT）
date: 2026-09-03
basis main: 4d01890c7ad3723439495110f44005e30499303b
prerequisite: #581 MERGED / FIXED ON MAIN
status: RECONCILIATION RECORDED（repo docs）
Issue #551 live body: UNKNOWN to this agent token（Issues API 403）
  → Human should mirror this packet into #551 when writable
Activation Issue: NOT CREATED
Definition Lock: NOT STARTED
```

## 1. Why

Existing `#551` core path was:

```text
#553 → #554 SBS-MGMT-HOME-C → #556
```

Human-corrected order requires Human Plan Activation **before** Management Home, so Home can read real lifecycle state (current / history / draft / last activation provenance). Name `SBS-MGMT-PLAN-ACTIVATION-C` avoids collision with `#554 SBS-MGMT-HOME-C`.

## 2. Reconciled core path

```text
#553 SBS-MGMT-LOOP-B
  = revision start（Draft N+1 exists; currentVersion stays N）
↓
SBS-MGMT-PLAN-ACTIVATION-C          ← NEW（before Home）
  = Human Plan Activation / Version Transition
↓
#554 SBS-MGMT-HOME-C
  = Management Home（read-only lifecycle display）
↓
#556 Closed-loop Acceptance
↓
SYNTHETIC MANAGEMENT LOOP CLOSED
↓
Production Binding Definition
```

## 3. Naming

```text
USE:     SBS-MGMT-PLAN-ACTIVATION-C
DO NOT:  SBS-MGMT-LOOP-C（ambiguous）
DO NOT:  collide with SBS-MGMT-HOME-C (#554)
```

## 4. Contract to freeze later in Definition（preview only）

```text
Draft exists                 != Applied
Human Apply action           = REQUIRED
currentVersion               = N
Draft version                = N+1
successful Human Apply
  → currentVersion = N+1
  → N remains immutable history
  → exactly one current applied version
stale Draft                  → HOLD / FAIL-CLOSED
  Draft 作成時の基準 current plan/version と
  Apply 直前 current state が一致すること。
  版番号が N+1 なだけでは適用可にしない。
already applied              → duplicate-safe / no second transition
AI suggestion                != Human Apply Decision
synthetic/session-only
LIVE WRITE                   = false
```

## 5. Implementation scope sketch（post-Definition only）

```text
Existing Planning-PC
↓ ⑥ 次版準備
現在適用中: 版3
次版: 版4 / Draft / 未適用
[版4の内容を確認]
[この版を適用開始する]  ← Human-only
↓ successful transition
版3 = 過去版 / immutable
版4 = 現在適用中
```

Out of Activation slice:

```text
new management screen
approval workflow / state-machine productization
Production persistence / LIVE WRITE
```

## 6. Verification add-ons（A–F plus）

```text
G  Draft v4 作成後に current が別経路で v4/v5 へ進んだ
   → stale Draft → activation 禁止
H  Apply 途中失敗
   → v3過去版 / v4current の片側だけ成立しない → atomic transition
```

## 7. Full roadmap（locked order）

```text
#581 POST-MERGE FIXATION                 = DONE @ 4d01890
↓
#576 / #580 invariants freeze + UI STOP  = RECORDED（companion）
↓
#551 ROADMAP RECONCILIATION              = THIS PACKET
↓
SBS-MGMT-PLAN-ACTIVATION-C Definition
↓
Independent Definition Review
↓
Human Definition Lock GO
↓
Implementation Scope
↓
Ponytail / Independent Scope Review
↓
Human Implementation Start GO
↓
Minimal activation implementation
↓
Focused Verification（A–F + G + H）
↓
Exact-head CI
↓
RBA 1280 / 390
↓
Minimality Review
↓
Exact HEAD Fixation
↓
Independent Implementation Review
↓
Actual Staff Plan-Transition Check
↓
Human Ready GO
↓
Human Merge GO
↓
Post-Merge Fixation
↓
#554 Management Home
↓
#556 Closed-loop Acceptance
↓
SYNTHETIC MANAGEMENT LOOP CLOSED
↓
Production Binding Definition
```

## 8. Authority

```text
Implementation GO ≠ Ready GO ≠ Merge GO ≠ Deploy GO ≠ LIVE WRITE
```

## 9. Explicit non-authorization

```text
THIS PACKET
≠ create Activation Issue
≠ Definition Lock
≠ Implementation Start
≠ product / runtime mutation
≠ Deploy / LIVE WRITE
```

## 10. Human follow-up（Issue SoT）

```text
Mirror §§2–7 into GitHub Issue #551 body / comment when Issues write is available.
Do not open Activation Issue until that mirror is visible as SoT（or this docs packet is Accepted as interim SoT by Human）.
```
