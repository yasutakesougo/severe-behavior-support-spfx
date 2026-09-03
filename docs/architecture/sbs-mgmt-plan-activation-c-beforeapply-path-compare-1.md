# SBS-MGMT-PLAN-ACTIVATION-C — beforeApply path compare 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-PLAN-ACTIVATION-C
tracking issue: #583
kind: READ-ONLY manual vs B12 path compare
date: 2026-09-03
product UI mutation by this packet: NONE
path correction: NOT STARTED / NOT AUTHORIZED by this packet
```

## Gate (maintained / corrected)

```text
Actual Staff arrival precondition
= NOT SATISFIED

staffPlanTransition=beforeApply
= URL parameter PRESENT（Human 実ブラウザ）
= intended before-Apply state NOT OBSERVED

Apply CTA
= NOT MOUNTED

Actual Staff Check
= HOLD / ENVIRONMENT-PATH MISMATCH
  （再開しない）

Human Ready GO
= NOT ELIGIBLE

Ready / Merge / Deploy / LIVE WRITE
= NOT AUTHORIZED
```

This packet does not change UI, does not inject state, and does not resume Staff Check.

## Human observation (binding)

⑥ 次版準備 on the manual URL showed only:

```text
現行は版3（適用中）。
次に重ねる概念上の版は4です。
[次の版を作る（表示専用）]
```

Absent:

```text
版4 は下書きです。まだ適用開始されていません。
[版4を適用開始する]
```

Address bar had:

```text
?staffPlanTransition=beforeApply&presentationRole=PLANNER
```

This is empty `revisionSession` ⑥, not discoverability. Apply is not in the DOM on that surface.

## PHASE 1 — manual URL query parsing

| Surface | Reads `staffPlanTransition`? |
|---|---|
| `spfx/smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx` `parseParams()` | YES — `params.get("staffPlanTransition")` |
| `AppShellChrome` | NO — no `location.search` / no this param |
| `SupportPlan.tsx` | NO — does not read the URL. Draft comes only from `initialRevisionSession` or in-session start-revision |
| heft start / workbench | NO — chrome path only |
| #584 `smoke-entry.tsx` @ `cursor/583-plan-activation-c-ff3f` | NO — parseParams has no `staffPlanTransition` field |

Query presence in the address bar does **not** imply session injection. The running JavaScript must be the smoke-entry that branches on the exact string `beforeApply`.

```text
SmokeApp
  if staffPlanTransition === "beforeApply"
    → StaffBeforeApplyApp
  else
    → ChromeSmokeApp → AppShellChrome → SupportPlan(empty session)
```

#584 serve-smoke / heft start always take the else branch, even if the Human types the query.

## PHASE 2 — where `beforeApply` is supposed to go

Only `StaffBeforeApplyApp` calls the initializer:

```text
createBeforeApplyStaffTransitionArrival()
  → startSyntheticPlanningPcRevision (CHANGE_REQUIRED + reason, session-only)
  → SupportPlan
       initialRevisionSession = { drafts: [v4] }
       initialCapturedReview  = captured CHANGE_REQUIRED
```

`SupportPlan` mounts Apply only when `revisionSession.drafts[0]` exists.

`AppShellChrome` never passes `initialRevisionSession`. Default is `EMPTY_SUPPORT_PLAN_REVISION_SESSION`.

Successful injection has extra chrome that empty ⑥ does not:

```text
合成確認画面です。本番には保存されません。…
data-sbs-mgmt-plan-activation-c-staff-check="before-apply"
```

and still shows the disabled create-cta **above** the draft/Apply block. Seeing create-cta alone is the empty path.

## PHASE 3 — how B12 / artifact path makes Apply-before state

Two automated routes, both against a **freshly esbuild’d** `smoke-entry.tsx`:

| Route | How state is created | Needs query? |
|---|---|---|
| B12 happy path (`runHappyPath`) | Puppeteer: reason → CHANGE_REQUIRED → click start-revision | NO |
| B12 landing (`runBeforeApplyStaffLanding`, this branch only) | Query → `StaffBeforeApplyApp` → initializer | YES |

RBA GREEN on #584 used only the happy path. It never proved that a Human typing the query into an arbitrary local server gets Draft v4.

Agent Puppeteer against this branch’s serve-smoke also used a just-built bundle. That does not prove the Human’s browser loaded the same bundle.

## PHASE 4 — manual vs automated difference

```text
CONFIRMED
manual ⑥ copy = empty revision session
  conceptual v3/v4 + disabled create-cta
  no draft node
  Apply not mounted

CONFIRMED
staffPlanTransition in the address bar ≠ initializer invocation

CONFIRMED
initializer is smoke-entry-only
AppShellChrome / SupportPlan / #584 smoke-entry ignore the query

THEREFORE
Human manual path loaded a JS surface that does not run StaffBeforeApplyApp
```

Highest-likelihood environments for that screenshot:

```text
1. #584 serve-smoke / workbench / heft start
   query pasted onto a bundle that never parsed it
2. ChromeSmokeApp on a stale smoke-bundle.js
   (server started from a tree without StaffBeforeApplyApp)
3. PLANNER SupportPlan opened via list click after the ignored query
```

This does **not** retract B12 Apply success. Automated path builds and drives the harness. Manual path showed URL decoration without the same injection.

```text
B12 / artifact path
= can create before-Apply session (clicks or this-branch landing)

manual serve-smoke / workbench URL
= query may be present
= same state injection NOT reached on the observed screen
```

## Classification correction

Previous packet treated “land on beforeApply URL” as sufficient arrival.

Corrected:

```text
PRIMARY
= ENVIRONMENT-PATH MISMATCH
  query present, StaffBeforeApplyApp / initializer not executed
  empty SupportPlan session → Apply not mounted

NOT
= CTA discoverability
= Apply implementation regression
= Staff comprehension failure on this screenshot
```

## Findings

| ID | 重大度 | 状態 | 内容 | 対応 |
|---|---|---|---|---|
| F-001 | P1 | OPEN | Manual Actual Staff URL did not enter `StaffBeforeApplyApp`. Arrival precondition fails. | HOLD. Do not resume Staff Check. Path correction is a separate Human-scoped slice. |
| F-002 | P2 | OPEN | `staffPlanTransition` is not read by product chrome. A query on heft/workbench/#584 is a no-op. | Record. Do not treat as UI copy bug. |

## What this packet does not do

```text
UI change
SupportPlan / create-cta rewrite
silent AppShellChrome query injection
Staff Check resume
Human Ready GO
Ready / Merge / Deploy / LIVE WRITE
```

## NEXT

```text
Human:
  decide whether path correction is a separate scope
  (example: product chrome reads the query, or staff URL is bound to a
   rebuilt smoke-entry SHA and a visible arrival marker)
  do not score T3–T5 on the observed empty ⑥

Agent:
  STOP UI mutation
  STOP Staff Check facilitation until Human scopes path correction
```
