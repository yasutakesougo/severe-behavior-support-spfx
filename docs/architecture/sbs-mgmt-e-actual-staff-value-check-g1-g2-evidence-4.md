# SBS-MGMT-E — Actual Staff Value Check G1+G2 Evidence 4 (Apply-Transition Continuation)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
kind: Apply-transition continuation procedure + empty score lane
date: 2026-09-17
status: READY FOR HUMAN EXECUTION / SCORES EMPTY

HEAD
= 8708271e6c227e4a1ed6c5762a6823401016b0c6
= REVIEW-CLEARED

Companion (do not overwrite):
  Evidence-3 = docs/architecture/sbs-mgmt-e-actual-staff-value-check-g1-g2-evidence-3.md
  pre-Apply PASS / HOLD INCOMPLETE preserved

Purpose:
  Capture ONLY the missing Apply click → post-Apply recognition
  + T4 / T5 observed answers
  + T-apply-transition timing

G3 / CORE LOOP VALUE / Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Product mutation = NONE
Observer Coaching = FORBIDDEN
Agent-invented T4/T5 = FORBIDDEN
```

This document is the continuation lane. Scores below stay empty until Human Apply is actually observed.

---

## 1. Why Evidence-4 exists

Evidence-3 already holds strong pre-Apply evidence:

```text
Time to Apply CTA = 12 sec
Wrong Turns = 0
Backtracks = 0
Hesitation = 0
T1–T3 = PASS / OBSERVED
T4–T5 = NOT SCORED
T-apply-transition = NOT MEASURED
Session Verdict = HOLD / INCOMPLETE
  (environment prevented Apply transition; participant/UI failure NOT ESTABLISHED)
```

Fresh Independent Value Review waits for observed Apply-transition + T4/T5.

---

## 2. Harness (same HEAD)

```bash
# from detached checkout at 8708271e (or equivalent CORR-1 product tree)
node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

Staff before-Apply URL:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

Arrival gate (reconfirm before click):

```text
[ ] Green banner / staff-check=ready
[ ] 見直し結果 = 変更が必要
[ ] 「版 4 を適用開始する」 visible and ENABLED / clickable
[ ] CORR-1B note visible
[ ] LIVE WRITE false cues present
```

If Apply is not clickable → STOP / record environment blocker in §6; do not invent post-Apply answers.

### Environment capability check (agent harness probe — NOT Staff scoring)

Re-checked at Evidence-4 authoring time on the same HEAD / serve-smoke:

```text
Apply button visible = YES（版 4 を適用開始する）
Apply button enabled = YES (disabled=false)
Click succeeded (synthetic probe) = YES
Post-Apply v4 current visible = YES
Post-Apply v3 prior visible = YES
Environment blocker for Apply transition = NONE (at probe time)

Harness ready for Human Evidence-4 = YES
This probe ≠ Staff G1/G2 PASS
This probe ≠ T4/T5 observed answers
Log: /opt/cursor/artifacts/sbs-mgmt-e-g1-g2-apply-env-check.log
```

Evidence-3 HOLD reason (“environment prevented Apply transition”) is treated as **session-context / prior-run blocker**, not as a standing UI defect on HEAD `8708271e`. Human must still perform the observed click + T4/T5 for Evidence-4 scores.

---

## 3. Neutral instruction (Apply continuation only)

If participant is already oriented from Evidence-3, do not re-explain versions. Minimal prompt only if needed:

```text
続きとして、次に必要だと思う操作を実行してください。
```

No hints that the button is Apply. No expected post-Apply wording.

---

## 4. Required recovery captures

| # | Capture | Field |
|---|---|---|
| 1 | Human clicks 「版 4 を適用開始する」 | observed YES/NO |
| 2 | Click timestamp | S5 |
| 3 | Post-Apply screen arrival timestamp | S6 |
| 4 | T4 asked after Apply (no leading) | verbatim answer |
| 5 | T5 asked after Apply (no leading) | verbatim answer |
| 6 | On-screen confirm v4 current / v3 prior | YES/NO + quote |
| 7 | T-apply-transition = S6 − S5 | duration |

### Post-Apply T4 / T5 questions (verbatim)

```text
T4 「現在使われている版は何版になりましたか？」
T5 「以前の版はどうなっていますか？」
```

### Post-Apply expected semantics (scoring only AFTER capture)

```text
T4 → 版4（現在の適用版）
T5 → 版3は直前の過去版（履歴として残る）;
     版2 / 版1はそれ以前の過去版
     ≠ 「版3は現行」
```

Pre-Apply T5 contamination from Evidence-3 must not be copied forward as PASS.

---

## 5. Score lane (fill only after observation)

```text
Apply clicked independently = 
S5 click timestamp =
S6 post-Apply arrival timestamp =
T-apply-transition =

On-screen v4 current = 
On-screen v3 prior = 

T4 answer (verbatim) =
T4 score = PASS / FAIL / NOT SCORED

T5 answer (verbatim) =
T5 score = PASS / FAIL / NOT SCORED

Wrong turns (Apply phase) =
Backtracks (Apply phase) =
Hesitation (Apply phase) =
Help Requested =
Observer Coaching = NONE / OCCURRED

Evidence-4 Verdict = PASS / ACCEPTABLE / HOLD
```

### Combined session roll-up (after Evidence-4 filled)

```text
Evidence-3 pre-Apply + Evidence-4 Apply-transition
→ Session Verdict = PASS / ACCEPTABLE / HOLD
→ ONLY THEN Fresh Independent Value Review eligibility
```

Use Exact Scope PASS / ACCEPTABLE / HOLD rules. Do not convert Evidence-3 alone into full PASS.

---

## 6. Environment blocker log (if Apply still cannot run)

```text
Apply button visible =
Apply button enabled =
Click attempted =
Click effect =
Error / overlay / harness message =
LIVE WRITE still false =
Participant failure = NOT ESTABLISHED unless proven otherwise
UI / harness failure = 
```

---

## 7. Boundaries

```text
Evidence-3 remains immutable historical pre-Apply record
Evidence-4 does not rewrite T1–T3 or 12-sec CTA timing
No product / copy / CSS mutation
No Deploy / LIVE WRITE
No CORE LOOP VALUE declaration here
```

---

## NEXT

```text
Human executes §2–§4 on clickable browser @ 8708271e
→ fill §5
→ STOP
→ Fresh Independent Value Review (only if T4/T5/T-apply-transition OBSERVED)
```
