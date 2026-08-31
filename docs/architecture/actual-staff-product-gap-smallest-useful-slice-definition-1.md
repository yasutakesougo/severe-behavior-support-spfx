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
definition status: CANDIDATE / CORRECTION-1 APPLIED / NOT LOCKED
independent definition review-1: CORRECTION REQUIRED / P0=0 / P1=2 / P2=1 / CONSUMED
definition correction-1: APPLIED
independent definition re-review-1: NOT STARTED
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
| Q5 | 概要から見直し資料への理解 | PARTIAL | `UI_FRICTION` / `IA_ROLE_CLARITY` | MINOR_FRICTION |
| Q6 | 分かりにくい／不要／足りない | UNRESOLVED | `DOMAIN_UNCERTAINTY` | — |

Staff quotes retained as evidence language (not as Implementation GO):

```text
Q1: 「わかるが、誰かをもうちょっとわかりやすく視認できるとよい」
Q2: 「一目でわかりづらい」
Q5: 「概要と見直しの役割がわかりづらい」
Q6: 「モニタリング記録も版管理？」
```

### Correction-1 — Q5 evidence bound (P1-1)

Staff 1 Q5 establishes only that overview vs review-materials **role separation is
hard to understand at a glance**.

```text
Q5 Actual Staff classification:
  UI_FRICTION / IA_ROLE_CLARITY

Actual Staff WORKFLOW_GAP:
  NOT ESTABLISHED by Staff 1

Actual Staff INFORMATION_GAP (as a separate established class for Q5):
  NOT ESTABLISHED by Staff 1
```

Do not widen Q5 into journey discontinuity (“画面遷移できない” /
“業務フローが途切れている”) from this answer alone.

Persona G `Daily → Monitoring → Review` WORKFLOW_GAP remains **Simulation
Evidence Only** and is managed outside this Actual Staff freeze
(`docs/architecture/demo-ux-5-role-persona-task-simulation-1.md` when present on
its own PR). It must not be mixed into Staff 1 Actual Staff Evidence.

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
    Classification bound to Actual Staff:
      UI_FRICTION / INFORMATION_ARCHITECTURE_CANDIDATE / IA_ROLE_CLARITY
    Surface: same composition (MonitoringView → HumanReviewView)
    Nature: role separation exists in copy/structure, but is not at-a-glance
    Note: treat as IA / presentation hierarchy first.
          Do not invent new domain meaning here.
          Do not import Simulation-only Daily→Monitoring WORKFLOW_GAP into
          this Actual Staff Track A scope.
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

Track B remains outside Definition Correction-1 and stays a separate Domain
Relationship Definition path.

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
   - 期間モニタリング（概要） = period summary / count / no system judgment
   - 見直し資料 = per-record fact materials for human decision ownership
   using existing meaning already stated in fact-only notes.
   Prefer hierarchy / labeling / section role framing over long new essays.
   Preserve human decision ownership statements such as:
     「評価・承認・変更要否の判断は人が行います。」

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

#### Product change surface

```text
spfx/src/shell/monitoring/MonitoringView.tsx
spfx/src/shell/monitoring/HumanReviewView.tsx
spfx/src/shell/monitoring/MonitoringViewUx.module.scss
```

Both views currently share `MonitoringViewUx.module.scss` on main. Style changes
remain presentation-only and must not invent new domain meaning.

#### Verification surface

```text
focused tests under spfx/src/shell/monitoring/**
smoke assertions where required for identity + role cues
  (e.g. human-review / planning-pc harnesses)
```

Verification surface may change to prove AC-2 / AC-3 / AC-4. It is not a Product
behavior expansion surface.

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
removal of human decision ownership statements
```

### 5.6 Acceptance criteria (for a later Implementation Start)

### AC-1 — exact scope

Only the **Product change surface** in §5.4 may change Product UI.

The **Verification surface** in §5.4 may change only to verify those Product
presentation corrections. Verification changes do not expand Product scope.

### AC-2 — identity visibility

Rendered synthetic evidence shows person identity as a primary signal on both
Monitoring overview and Human Review materials, without requiring the reader to
parse a mixed `person · plan · period` line as the only who-signal.

### AC-3 — role clarity at a glance

A staff-facing reader can distinguish, without reading long body copy first:

```text
概要 = 期間の件数確認（システムは良否・効果・計画変更要否を判定しない）
見直し資料 = 個別事実資料（評価・承認・変更要否の判断は人が行う）
```

Existing fail-closed / fact-only meaning must remain.

Human decision ownership statements are **allowed and expected** to remain.

### AC-4 — Slice B invariants preserved

```text
summary-only Monitoring
detail ownership on Human Review
exact sceneLabel fail-closed
0件 non-equivalence
human decision ownership statement: PRESERVED
```

Forbidden language / behavior (must not be introduced):

```text
system-generated judgment
effectiveness judgment
automated plan-change recommendation
```

Clarification (Correction-1 / P1-2):

```text
“judgment” in AC-4 forbids system judgment only.
It does NOT forbid stating that humans own evaluation / approval /
plan-change necessity decisions.
Do not delete existing copy such as:
  ここに表示する内容は見直しのための事実資料です。
  評価・承認・変更要否の判断は人が行います。
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
This Definition: CANDIDATE / CORRECTION-1 APPLIED
Human Definition Lock: NOT RECEIVED
Independent Definition Review-1: CORRECTION REQUIRED / CONSUMED
Independent Definition Re-Review-1: NOT STARTED
Implementation Start: NOT AUTHORIZED
#539 Ready / Merge: NOT AUTHORIZED by this document
Deploy / LIVE WRITE: NOT AUTHORIZED
```

Stop / do not proceed to implementation if any of the following occur:

- Track B wording is smuggled into Track A scope
- slice expands into Daily Records or journey redesign
- Simulation-only WORKFLOW_GAP is treated as Actual Staff Evidence
- human decision ownership statements are removed to “satisfy” AC-4
- “Slice C” is treated as automatically authorized
- Actual Staff PARTIAL is rewritten as Actual Staff Value PASS
- Ready / Merge / Deploy are treated as implied

## 8. Recommended next gates

```text
1) Exact Definition re-read after Correction-1
2) Independent Definition Re-Review-1 (P0/P1/P2)
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
Actual Staff WORKFLOW_GAP ≠ established by Staff 1 Q5
This Definition ≠ Ready / Merge / Deploy authority
```

## 10. Correction-1 change log

```text
P1-1 CONSUMED:
  Q5 classification narrowed to UI_FRICTION / IA_ROLE_CLARITY
  Actual Staff WORKFLOW_GAP = NOT ESTABLISHED by Staff 1
  Persona G journey gap kept as Simulation Evidence only

P1-2 CONSUMED:
  AC-3 / AC-4 distinguish human decision ownership vs system judgment
  existing HumanReviewView ownership copy is explicitly preservable

P2-1 CONSUMED:
  §5.4 / AC-1 split Product change surface vs Verification surface

Track B:
  unchanged / still OUT of this Correction
```
