# Actual Staff Product Gap — Smallest Useful Slice Definition-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: ACTUAL-STAFF-PRODUCT-GAP-SMALLEST-USEFUL-SLICE-DEFINITION-1
kind: candidate exact-slice definition + observed product-gap freeze
date: 2026-08-31
basis main: 72f2bb1dd0cfde2301b01cbad0c2fce7bfe266e0
evidence PR: #539
evidence HEAD (unchanged): 87090a7aa9f6f611e1f1f3a4c33a5397cba28b26
evidence location: PR comment (Staff 1 Actual Staff Value Check)
definition status: CANDIDATE / NOT LOCKED
implementation: NOT AUTHORIZED
implementation start: NOT AUTHORIZED
ready / merge / deploy / production binding / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
automatic HUMAN-REVIEW-UI-FRICTION-SLICE-C: NO
further AI persona evaluation: STOP
```

## 1. Purpose

Freeze the Observed Product Gaps from the completed Actual Staff Value Check
(PARTIAL / 1 staff), then define the **smallest useful presentation slice** that
may address only the small UI / IA friction — without deciding Monitoring
versioning, and without authorizing implementation.

This document is boundary work only. It does not change Product UI or Domain.

## 2. Actual Staff Evidence freeze

```text
Actual Staff Value Check: COMPLETE
Staff count: 1
Actual Staff Evidence: ESTABLISHED
Overall: PARTIAL
Major operation failure: NO
Actual Staff Value PASS: NOT ESTABLISHED
Source: https://github.com/yasutakesougo/severe-behavior-support-spfx/pull/539#issuecomment-5478130217
#539 HEAD at evidence time: 87090a7aa9f6f611e1f1f3a4c33a5397cba28b26
Durable docs on that HEAD: not mutated (comment-only record)
```

### Staff 1 question matrix (frozen)

| Q | Focus | Result | Classification | Severity |
|---|---|---|---|---|
| Q1 | 誰の・どの計画版・どの期間か | PARTIAL | `UI_FRICTION` | MINOR_FRICTION |
| Q2 | 期間モニタリング（概要）と見直し資料の違い | PARTIAL | `UI_FRICTION` / `INFORMATION_ARCHITECTURE_CANDIDATE` | MINOR_FRICTION |
| Q3 | 場面転換の意味 | PASS / RESOLVED | — | — |
| Q4 | 0件の理解 | PASS / RESOLVED | — | — |
| Q5 | 概要から見直し資料への理解 | PARTIAL | `INFORMATION_GAP` / `WORKFLOW_GAP` candidate | MINOR_FRICTION |
| Q6 | 分かりにくい／不要／足りない | UNRESOLVED | `DOMAIN_UNCERTAINTY` | — |

Staff quotes retained as evidence language (not as Implementation GO):

```text
Q1: 「わかるが、誰かをもうちょっとわかりやすく視認できるとよい」
Q2: 「一目でわかりづらい」
Q5: 「概要と見直しの役割がわかりづらい」
Q6: 「モニタリング記録も版管理？」
```

## 3. Observed Product Gap Freeze

Two tracks only. Do not merge them into one redesign.

### Track A — Small UI / IA friction (in-scope for this Definition)

```text
A1. Identity visibility (“誰か”)
    Evidence: Q1 PARTIAL / UI_FRICTION / MINOR
    Surface: Monitoring summary + Human Review materials
    Nature: person identity is present but not visually primary enough

A2. Monitoring overview vs Review materials role clarity
    Evidence: Q2 PARTIAL + Q5 PARTIAL
    Surface: same composition (MonitoringView → HumanReviewView)
    Nature: role separation exists in copy/structure, but is not at-a-glance
    Note: treat as IA / presentation hierarchy first.
          Do not invent new domain meaning or Daily→Monitoring routing here.
```

### Track B — Domain Question (OUT of this slice; separate gate)

```text
B1. “Monitoring記録も版管理？”
    Evidence: Q6 UNRESOLVED / DOMAIN_UNCERTAINTY
    Decision now: FORBIDDEN
    Required before any UI reflection:
      define relationships among:
        - 計画版 (Support Plan version)
        - Monitoring期間 (periodStart / periodEnd bound to a plan context)
        - Monitoring結果 / 件数 (period-matched record aggregate)
        - 見直し後計画 (post-review plan outcome / next version — if any)
    This Definition does NOT choose:
        Monitoring is version-managed
        Monitoring is not version-managed
        MonitoringResult has its own version identifier
```

## 4. Local problem being solved (Track A only)

Current rendered composition already carries:

```text
期間モニタリング（概要）
  personLabel · 計画版 N · period
  count
  fact-only note + jump to #human-review-materials

見直し資料
  personLabel (when provided)
  計画版 N · 対象期間
  詳細: UserId · planId
  fact materials + optional sceneLabel
```

Staff evidence shows the information is largely recoverable, but:

1. **Who** does not read as the primary visual signal.
2. **Overview vs materials** does not read as two roles at a glance.

This is a presentation hierarchy / IA clarity problem on an already-separated
summary-only Monitoring + detail-owning Human Review composition (Slice B).

It does not require:

```text
new domain state
Monitoring versioning rule
schema / DTO change
persistence / review outcome write
Daily Records ↔ Monitoring journey redesign
automatic Slice C umbrella
```

## 5. Smallest Useful Slice — Candidate Definition

### 5.1 Unit name

```text
HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1
```

Do **not** rename or auto-promote this to `HUMAN-REVIEW-UI-FRICTION-SLICE-C`.
Slice C remains unauthorized unless a later Human gate explicitly creates it.

### 5.2 Objective (one sentence)

Make person identity and the overview/materials role split visually primary on
the existing synthetic Monitoring + Human Review composition, without changing
domain meaning, versioning rules, or persistence.

### 5.3 Authorized presentation-only corrections (candidate)

If later Human Definition Lock + Implementation Start GO are granted, only the
following presentation corrections are candidates:

```text
1. Elevate person identity (“誰か”) to a primary visual signal on both:
   - 期間モニタリング（概要）
   - 見直し資料
   while keeping 計画版 / 期間 secondary and technical ids tertiary.

2. Strengthen at-a-glance role cues between:
   - 期間モニタリング（概要） = period summary / count / no judgment
   - 見直し資料 = per-record fact materials / human judgment
   using existing meaning already stated in fact-only notes.
   Prefer hierarchy / labeling / section role framing over long new essays.

3. Preserve Slice B invariants:
   - Monitoring remains summary-only
   - Human Review owns RecordId-bound detail
   - no RecordId full-detail duplication into Monitoring
   - sceneLabel remains exact-match fail-closed
   - 0件 ≠ 実施できなかった
```

Exact visual treatment is not locked here. Any later implementation must stay
inside these meaning bounds and pass the Acceptance Criteria below.

### 5.4 Expected change surface (candidate)

```text
spfx/src/shell/monitoring/MonitoringView.tsx
spfx/src/shell/monitoring/HumanReviewView.tsx
spfx/src/shell/monitoring/MonitoringViewUx.module.scss
focused tests under spfx/src/shell/monitoring/**
optional: human-review / planning-pc smoke assertions for identity + role cues
```

### 5.5 Explicit OUT

```text
Track B / Q6 Monitoring versioning decision
Support Plan version lifecycle change
MonitoringResult schema / version identifier
post-review plan mutation / revision UI
Daily Records surface changes
Daily → Monitoring → Review journey redesign
domain contract changes under src/domain/**
HumanReviewMaterialRecord schema expansion
persistence / review outcome writes
AI labels / scoring / recommendations
SharePoint / M365 / Entra mutation
Deploy / LIVE WRITE / Production Binding
Ready / Merge without separate Human GO
automatic Slice C creation
broad redesign / new card family / new route
```

### 5.6 Acceptance criteria (for a later Implementation Start)

### AC-1 — exact scope

Only authorized presentation paths in §5.4 change.

### AC-2 — identity visibility

Rendered synthetic evidence shows person identity as a primary signal on both
Monitoring overview and Human Review materials, without requiring the reader to
parse a mixed `person · plan · period` line as the only who-signal.

### AC-3 — role clarity at a glance

A staff-facing reader can distinguish, without reading long body copy first:

```text
概要 = 期間の件数確認（判定しない）
見直し資料 = 個別事実資料（人が判断する）
```

Existing fail-closed / fact-only meaning must remain.

### AC-4 — Slice B invariants preserved

```text
summary-only Monitoring
detail ownership on Human Review
exact sceneLabel fail-closed
0件 non-equivalence
no judgment / effectiveness / plan-change recommendation language
```

### AC-5 — Track B untouched

No copy, control, or schema that asserts Monitoring records are (or are not)
version-managed.

### AC-6 — verification

At minimum for a later implementation PR:

```text
focused monitoring / human-review tests: PASS
synthetic rendered smoke or equivalent presentation evidence: PASS
typecheck / lint / format: PASS where applicable
```

### AC-7 — non-claims

Implementation PASS ≠ Actual Staff Value PASS re-established.
A follow-up staff spot-check may be requested by Human, but is not auto-opened here.

## 6. Track B — Domain Question parking lot

Q6 remains open as Domain uncertainty.

Safe next Domain gate (separate document / Decision path; not this slice):

```text
Define relationships first:
  計画版
    ↔ Monitoring期間（どの計画文脈の期間か）
    ↔ Monitoring結果（期間一致記録の集計／資料集合）
    ↔ 見直し後計画（見直し判断の結果としての次計画状態）

Only after that relationship set is Accepted / LOCKED
may UI ask whether any Monitoring artifact needs its own version identifier.
```

Until then:

```text
“Monitoringも版管理する” = NOT DECIDED
UI must not imply a versioned Monitoring record object
UI must not remove existing 計画版 context from Monitoring/Review headers
```

## 7. Authority and stop conditions

```text
This Definition: CANDIDATE
Human Definition Lock: NOT RECEIVED
Independent Definition Review: NOT STARTED
Implementation Start: NOT AUTHORIZED
#539 Ready / Merge: NOT AUTHORIZED by this document
Deploy / LIVE WRITE: NOT AUTHORIZED
```

Stop / do not proceed to implementation if any of the following occur:

- Track B wording is smuggled into Track A scope
- slice expands into Daily Records or journey redesign
- “Slice C” is treated as automatically authorized
- Actual Staff PARTIAL is rewritten as Actual Staff Value PASS
- Ready / Merge / Deploy are treated as implied

## 8. Recommended next gates

```text
1) Human review of this Candidate Definition
2) Independent Definition Review (P0/P1/P2)
3) Human Definition Lock GO   → then only Track A may be implemented
4) Separate Domain relationship Definition for Track B / Q6
5) #539 Ready / Merge remain independent Human gates for the docs PR itself
```

## 9. Non-claims

```text
PARTIAL staff check ≠ PASS
MINOR_FRICTION ≠ Implementation Start
INFORMATION_ARCHITECTURE_CANDIDATE ≠ redesign mandate
DOMAIN_UNCERTAINTY ≠ Monitoring versioning Decision
Simulation Evidence ≠ Actual Staff Evidence
This Definition ≠ Ready / Merge / Deploy authority
```
