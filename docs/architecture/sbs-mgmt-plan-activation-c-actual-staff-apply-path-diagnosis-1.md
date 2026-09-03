# SBS-MGMT-PLAN-ACTIVATION-C — Actual Staff Apply-path diagnosis 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-PLAN-ACTIVATION-C
tracking issue: #583
product PR: #584
kind: READ-ONLY interaction-path diagnosis
date: 2026-09-03
product exact HEAD (Post-GREEN / Implementation Review-Cleared):
  5437e64703db055eef2bf230f5a682cf0286dc1a
PR HEAD at diagnosis (serve-smoke chore only):
  f2f48587ee1ca92488d08da6c4145e91f5a15af8
basis main: 4d01890c7ad3723439495110f44005e30499303b
product / fixture / UI mutation by this packet: NONE
```

## Gate (unchanged)

```text
Post-GREEN Revalidation
= VALID
  (binds to product HEAD 5437e64703db055eef2bf230f5a682cf0286dc1a)

Implementation Review-Cleared
= YES
  (under confirmed exact-head GREEN on that product HEAD)

Actual Staff Plan-Transition Check
= HOLD / INTERACTION BLOCKED

Human Ready GO
= NOT ELIGIBLE

Ready / Merge / Deploy / Production Binding / LIVE WRITE
= NOT AUTHORIZED
```

This packet does **not** start UI improvement, Scope Correction, Implementation Start, Ready, or Merge.

## Human observation being diagnosed

```text
Actual Staff Plan-Transition Check = HOLD
Reason = Human Apply interaction unavailable in actual staff test path

T2 = PARTIAL PASS
     （現行は版3（適用中）、次に重ねる概念上の版は4）
T3 = FAIL / transition action not understood
     （observed: 次の版をつくる）
T4 = NOT TESTABLE
T5 = NOT TESTABLE
```

Expected staff-visible sequence (Definition / UI contract):

```text
版3 適用中
↓
版4 下書き
↓
Human Apply
↓
版4 適用中
↓
版3 過去版
```

## Candidate classes (pre-declared)

| ID | Candidate | Result |
|---|---|---|
| C1 | Apply 表示条件未成立 | CONFIRMED as the immediate render gate |
| C2 | Draft v4 未生成 | CONFIRMED on staff entry |
| C3 | テスト画面が Apply 前 fixture まで未到達 | CONFIRMED as the primary path failure |
| C4 | CTA が別操作経路に依存 | CONFIRMED (LOOP-B prerequisite) |

These four are the same chain, not four independent defects.

## Confirmed render contract (product HEAD)

Authority: `spfx/src/shell/users/SupportPlan.tsx` @ `5437e64703db055eef2bf230f5a682cf0286dc1a` (unchanged by the later serve-smoke commit).

Apply CTA is rendered only in this branch:

```text
activationReceipt ? applied readback
: revisionDraft     ? [版 {N+1} を適用開始する]
: revisionEligible  ? [支援内容の見直しを始める（版 {N+1} の下書き）]
: (no forward CTA)
```

`revisionDraft` = `revisionSession.drafts[0]`.

Session initial state:

```text
revisionSession    = EMPTY_SUPPORT_PLAN_REVISION_SESSION  // drafts = []
activationSession  = EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION
                     // currentPlan = v3 Active, receipt absent
capturedReview     = null
```

Therefore on first paint of Planning-PC SupportPlan:

```text
revisionDraft      = absent
revisionEligible   = false   // requires CHANGE_REQUIRED + non-empty reason
                                 + same UserId/planId/planVersion
                                 + selectedVersion === liveCurrentVersion
Apply CTA          = NOT IN DOM
```

This is not a broken Apply handler. When `revisionDraft` exists, smoke already proves the button is present, enabled, labelled `版 4 を適用開始する`, and transitions v3 → v4.

## Why T2 can pass while Apply is absent

The T2 copy is **unconditional** in `nextVersionBlock`:

```text
現行は版 {liveCurrentVersion}（適用中）。次に重ねる概念上の版は {conceptualNextVersion} です。
```

On cold load this already reads:

```text
現行は版 3（適用中）。次に重ねる概念上の版は 4 です。
```

That sentence is a **conceptual next-version** note. It does not mean Draft v4 exists. Staff T2 PARTIAL PASS matches this exact string without requiring a draft or Apply control.

## Why T3 lands on 「次の版をつくる」

The same `nextVersionBlock` always renders a disabled predecessor (Scope Correction-1 / #553 retain):

```text
data-review-new-version="create-cta"
disabled / aria-disabled="true"
data-sbs-action="tertiary"
label = SUPPORT_PLAN_NEXT_VERSION_CTA
      = 「次の版を作る（表示専用）」
```

On cold load this is the only version-creation-looking control in ⑥ 次版準備.

Staff T3 observed `次の版をつくる` is that retained disabled `create-cta`, not the Human Apply control. Apply is not a sibling that is merely disabled; it is **not mounted**.

After CHANGE_REQUIRED + reason, the forward CTA is still not Apply. It is:

```text
支援内容の見直しを始める（版 4 の下書き）
data-sbs-mgmt-loop-b-action="start-revision"
```

Apply appears only after that start-revision succeeds and writes `revisionSession.drafts[0]`.

## Actual Staff test path vs RBA path

### Automated RBA / B12 (CONFIRMED GREEN)

`spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs` does **not** open a pre-Apply fixture. Puppeteer drives the full prerequisite:

```text
PLANNER URL
→ 利用者 A の支援計画
→ type reason
→ CHANGE_REQUIRED
→ wait start-revision enabled
→ click start-revision
→ wait [data-sbs-mgmt-loop-b-draft="true"]
→ then click [data-sbs-mgmt-plan-activation-c-action="apply"]
```

Apply is testable here because the harness completes LOOP-B before asserting #583.

### Actual Staff interactive path

`spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs` (PR HEAD `f2f48587`, after product exact HEAD) serves the **same cold harness**:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER
```

Initial SupportPlan state is empty revision session. There is no query flag, snapshot switcher, or deep-link that lands on:

```text
v3 applied + v4 Draft + Apply enabled
```

README/console tell Human to walk `変更が必要 → 下書き開始 → 版4を適用開始する`. That is a **multi-slice prerequisite**, not the Definition Before-Apply screen.

If staff opened ⑥ 次版準備 first (process-visibility navigation), they see:

```text
conceptual v3 / v4 copy     → T2 PARTIAL
disabled 「次の版を作る（表示専用）」 → T3 FAIL
Apply absent                → T4/T5 NOT TESTABLE
```

That is sufficient to explain the HOLD without a product Apply-regression.

## Ruled out (for this HOLD)

| Claim | Status |
|---|---|
| Apply domain/session is missing on product HEAD | REJECTED — domain + session + CTA exist; smoke Apply PASS @ 1280/390 |
| Apply is hidden by ADMIN_AUDIT / FIELD_STAFF role on the published staff URL | REJECTED for the documented URL (`presentationRole=PLANNER`) |
| Draft v4 is preloaded by `support-plan-revision-fixture` into the staff screen | REJECTED — optional fixture expose was not used; UI starts from empty revision session |
| Implementation Review-Cleared is withdrawn by this HOLD | REJECTED — Review-Cleared remains YES for the reviewed product HEAD |
| This diagnosis authorizes UI rewrite | REJECTED |

## Classification

```text
PRIMARY
= C3 TEST PATH / FIXTURE ARRIVAL
  Actual Staff surface opens cold LOOP-B Planning-PC,
  not the Definition Before-Apply fixture (v3 applied + v4 Draft).

IMMEDIATE RENDER GATE
= C1 + C2
  Apply mounts only when in-session Draft v4 exists.
  Cold load has no Draft.

PATH DEPENDENCY
= C4
  Human Apply is downstream of:
    PLANNER
    + ④ monitoring CHANGE_REQUIRED
    + non-empty decisionReason
    + ⑥ start-revision
  Competing visible control in ⑥ = disabled create-cta.

DEFECT TYPE
= staff-check path / arrival precondition
  ≠ Apply implementation regression
  ≠ “staff did not memorize copy”
```

## Findings

| ID | 重大度 | 状態 | 内容 | 対応 |
|---|---|---|---|---|
| F-001 | P1 | OPEN | Actual Staff path cannot reach Human Apply without completing LOOP-B capture + start-revision. T4/T5 remain NOT TESTABLE. | HOLD. Do not treat as Ready. Do not start UI polish before Human chooses the next authorized slice. |
| F-002 | P2 | OPEN | Unconditional conceptual v3/v4 copy plus always-visible disabled `create-cta` explain T2 PARTIAL + T3 FAIL without Draft. | Record only. Copy/CTA change needs a separate Human-authorized correction, not this packet. |
| F-003 | P2 | OPEN | PR #584 HEAD drifted from product exact HEAD `5437e64` to `f2f48587` (serve-smoke chore). Apply render contract is unchanged; Review-Cleared still binds to `5437e64`. | Do not silently rebind Review-Cleared to the later HEAD. |

No P0. Apply is not auto-firing; LIVE WRITE remains false.

## What this does **not** decide

```text
UI copy change
create-cta removal
preloading Draft v4 into SupportPlan
new staff snapshot switcher
Scope Correction
Implementation Start
Human Ready GO
Merge / Deploy / LIVE WRITE
```

A later authorized slice may choose one of:

```text
A. Staff-check arrival: land Human on v3 applied + v4 Draft (Apply visible)
B. Staff briefing: require LOOP-B steps before scoring T3–T5
C. Product change: only after Human GO, if Definition wants Apply visible without LOOP-B
```

A/B/C are Human choices. This packet only isolates the blocked interaction.

## Evidence

```text
Issue #583 Definition UI contract (Before Apply = 版4を適用開始する)
Issue comment Post-GREEN Revalidation = issuecomment-5524264162
Issue comment Staff Check packet = issuecomment-5524264282
PR #584 product HEAD = 5437e64703db055eef2bf230f5a682cf0286dc1a
PR #584 later HEAD = f2f48587ee1ca92488d08da6c4145e91f5a15af8
SupportPlan.tsx Apply / revisionEligible / create-cta
support-plan-copy.ts SUPPORT_PLAN_NEXT_VERSION_CTA
support-plan-activation-session.ts EMPTY session = current v3
run-smoke.mjs Puppeteer prerequisite chain
serve-smoke.mjs cold PLANNER URL
B12 run 33742397232 SUCCESS (Apply reachable under harness, not staff entry)
```

## NEXT

```text
Human:
  confirm this isolation (C3 primary)
  choose A / B / C or HOLD
  do not consume Ready / Merge

Agent:
  STOP product mutation
  STOP UI improvement until Human GO
```
