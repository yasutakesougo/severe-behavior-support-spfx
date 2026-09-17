# SBS-PLANNER-TOP-LEVEL-IA-V1 — Exact Slice Definition Candidate-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
parent workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: SBS-PLANNER-TOP-LEVEL-IA-V1
record type: Exact Slice Definition Candidate-1
normative surface: THIS BODY ONLY
date: 2026-09-18

basis main:
  59b56411f93677826c74c62666a31912ea563d1f

locked parent packet:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  blob: 5eeb8140772ebfefe050cff93361a6d81c470f81

parent Human Definition Lock record:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a

Human Kickoff GO:
  RECEIVED / CONSUMED

Definition status:
  CANDIDATE / AWAITING INDEPENDENT DEFINITION REVIEW

Human Definition Lock:
  NOT CONSUMED

Exact Scope:
  NOT AUTHORIZED

Implementation Start:
  NOT AUTHORIZED

Product / SPFx mutation:
  NONE
```

This Candidate defines only the PLANNER Top-Level Role/Task entry and distinct
D-HOME orientation slice. It preserves already-consumed Planning-PC list/detail
and PROCESS-VISIBILITY work. It does not redesign lifecycle semantics.

---

## 1. Problem

Current main already contains PLANNER in-flow SupportPlan process visibility, but
the Product shell Top-Level navigation remains the legacy shell vocabulary:

```text
概要 · 利用者 · 記録
```

The locked parent Definition requires:

```text
PLANNER Global
= 今の工程 · 探す

first paint
= D-HOME (Distinct)

D-HOME
= cycle orientation
= current cycle position + next action
```

Therefore the remaining product gap is Top-Level Role/Task entry and orientation,
not the SupportPlan detail process-navigation itself.

---

## 2. Goals

```text
G1
A PLANNER usable session starts from a stable Top-Level orientation place.

G2
Top-Level Global vocabulary is task-first:
  今の工程 · 探す

G3
今の工程 always resolves to D-HOME.

G4
探す always resolves to D-FIND-PERSON.

G5
D-HOME is distinct from all cycle Task Destinations.

G6
D-HOME communicates:
  current cycle place
  next action
  next Destination when uniquely known

G7
Existing PROCESS-VISIBILITY ①–⑥ remains in-flow navigation inside SupportPlan.
It is not promoted to six Top-Level Global items.

G8
Existing lifecycle state meaning stays unchanged:
  Current ≠ Draft ≠ Next
  0件 ≠ 実施できなかった
```

---

## 3. Exact Top-Level Global

Ordered PLANNER Global items:

```text
1. 今の工程
2. 探す
```

No additional Global item is created by this unit.

```text
今の工程
→ D-HOME

探す
→ D-FIND-PERSON
```

Rejected:

```text
概要 / 利用者 / 記録 as concurrent PLANNER Product Global rows
six cycle steps as Top-Level Global rows
Global 探す → record search
new Search Hub Destination
```

Legacy shell destinations may remain implementation transport only if Exact Scope
later proves that is necessary. They must not remain the PLANNER Product Global
meaning.

---

## 4. PLANNER D-HOME identity

```text
D-HOME
= PLANNER-only distinct orientation Destination
≠ D-ASSESS
≠ D-PLAN
≠ D-FIND-RECORD
≠ D-MONITOR
≠ D-REVIEW
≠ D-NEXT
```

Purpose:

```text
今の工程の所在と次の一手を示す。
Task実行画面そのものではない。
```

Primary information:

```text
current cycle position
next action
person / plan identity required to avoid context loss
```

Completion:

```text
利用者が
  今どの工程にいるか
  次に何をするか
  どこへ進むか
を誤認せず説明できる。
```

---

## 5. First paint

Given:

```text
usable session
presentationRole = PLANNER
site selection valid
```

Then:

```text
Product first paint = D-HOME
Top-Level Global = 今の工程 · 探す
current cycle orientation is visible
```

This is presentation-role behavior only.
It does not mint authorization or edit authority.

---

## 6. D-HOME Primary Action mapping

The locked parent Definition already fixes the following mappings:

| Current cycle | D-HOME Primary Action destination | Status |
|---|---|---|
| ① | D-ASSESS | FIXED by parent |
| ② | D-PLAN | FIXED by parent |
| ③ | **UNRESOLVED** | Human P2-3 disposition required |
| ④ | D-MONITOR | FIXED by parent |
| ⑤ | D-REVIEW | FIXED by parent |
| ⑥ | D-NEXT | FIXED by parent |
| unknown | STAY D-HOME / fail-closed orientation | FIXED by parent |

The parent also fixes:

```text
PROCESS-VISIBILITY ③ 記録
= PLANNER read/search
= D-FIND-RECORD / D-RECORD-READ
≠ D-RECORD-WRITE
```

However, the exact **D-HOME Primary Action for current cycle = ③** remains an
explicit parent Open Question. This Candidate does not choose among possible
actions on behalf of Human.

```text
HOLD-P2-3
= Human disposition required before Definition Lock
= no implicit choice
= no implementation may infer a destination/action
```

---

## 7. Existing PROCESS-VISIBILITY preservation

Existing PLANNER in-page process navigation remains:

```text
① 計画
② 支援
③ 記録
④ モニタリング
⑤ 見直し
⑥ 次版準備
```

Preserved meaning:

```text
selected / aria-current
= current in-page viewing position
≠ cycle completion
≠ workflow progress
≠ current lifecycle state
```

This unit must not re-implement or visually redesign that navigation merely to
satisfy Top-Level D-HOME.

---

## 8. Existing Planning-PC surfaces preserved

Already-consumed surfaces stay unchanged in meaning:

```text
SupportPlan management list
compact KPI
action queue
SupportPlan detail hierarchy
section navigation
PROCESS-VISIBILITY ①–⑥
Current / Draft / Next presentation
Monitoring / Human Review state distinction
```

This unit may later need an adapter/link from D-HOME into those surfaces, but
that implementation mechanism belongs to Exact Scope Scout, not this Definition.

---

## 9. Search semantics

```text
Global 探す
= D-FIND-PERSON only
```

Record search remains in-flow:

```text
D-FIND-RECORD
= not a second Global meaning
```

No Search Hub is introduced.

---

## 10. State meaning preserved

Do not collapse:

```text
Current
Draft
Next version

0件
実施できなかった

page position
cycle position
cycle completion
```

Browser Smoke PASS remains verification evidence only and must not be presented
as business completion.

---

## 11. Human Task Acceptance target

### PL-HTA-1

```text
Given
  PLANNERが適用中の計画を確認する

When
  Product Top-Level entryから今の工程を開く

Then
  Currentがどれか分かり
  Draft / 次版を適用中と誤認しない

And
  次の工程へ辿れる

And
  Globalが今の工程 / 探すのみでも
  サイクル内の現在位置が分かる
```

### PL-HTA-2

```text
Given
  PLANNERが期間の記録を見る

When
  モニタリング / 記録材料を見る

Then
  0件 と 実施できなかった を別意味として読める

And
  Browser Smoke PASSを業務完了と取り違えない
```

This Definition does not claim Human Task Acceptance PASS.

---

## 12. Acceptance conditions for later implementation

```text
AC-PL-1
PLANNER Top-Level Global exact labels/order
= 今の工程 · 探す

AC-PL-2
PLANNER first paint
= D-HOME

AC-PL-3
Global 今の工程
= D-HOME only

AC-PL-4
Global 探す
= D-FIND-PERSON only

AC-PL-5
D-HOME identity is distinct from cycle Task Destinations.

AC-PL-6
Known-cycle Primary Action mapping is unique for every implemented cycle value.

AC-PL-7
Unknown cycle stays D-HOME and fails closed.

AC-PL-8
Legacy 概要 / 利用者 / 記録 are not concurrent PLANNER Product Global rows.

AC-PL-9
Existing PROCESS-VISIBILITY ①–⑥ remains in-flow and its selected state keeps
page-position meaning only.

AC-PL-10
No FIELD_STAFF or ADMIN_AUDIT Product semantics are changed.

AC-PL-11
No authorization role / Entra / edit authority is created by presentationRole.

AC-PL-12
PL-HTA-1 / PL-HTA-2 remain Human acceptance, not substituted by smoke.

AC-PL-13
Current cycle = ③ is NOT implementation-eligible until Human disposition closes
HOLD-P2-3.
```

---

## 13. OUT

```text
FIELD_STAFF CORR-1F / CORR-1G reopen
ADMIN_AUDIT Global
AA-T1 cadence
quiet 合成 badge
smoke .gitignore hygiene
smoke github.sha verification hygiene
SupportPlan list redesign
SupportPlan detail hierarchy redesign
PROCESS-VISIBILITY redesign
lifecycle semantic re-decision
new lifecycle state
schema / persistence
SharePoint / M365 / Entra
Production Binding
Deploy
LIVE WRITE
Issue close
```

---

## 14. Review questions

1. Is PLANNER Global uniquely `今の工程 · 探す`?
2. Is `今の工程` uniquely D-HOME?
3. Is D-HOME distinct from all Task Destinations?
4. Does the Definition preserve PROCESS-VISIBILITY as in-flow only?
5. Does the Definition avoid duplicating consumed Planning-PC UI?
6. Are Current/Draft/Next and 0件/実施できなかった semantics preserved?
7. Is presentationRole kept separate from authorization?
8. Are FIELD_STAFF / ADMIN_AUDIT out of scope?
9. Is unknown cycle fail-closed?
10. Is current cycle = ③ explicitly unresolved rather than guessed?
11. Is the unresolved ③ mapping a blocker for Human Definition Lock of this unit?
12. Does any acceptance condition accidentally self-PASS PL-HTA?

---

## 15. Candidate status

```text
Definition Candidate-1
= AUTHORED

Independent Definition Review
= NEXT

Human Definition Lock
= NOT CONSUMED

HOLD-P2-3
= OPEN
= Human disposition not received

Exact Scope Scout
= NOT AUTHORIZED

Implementation Start
= NOT AUTHORIZED

Product mutation
= NONE
```
