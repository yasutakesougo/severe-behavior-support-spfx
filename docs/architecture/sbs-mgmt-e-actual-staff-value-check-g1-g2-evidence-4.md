# SBS-MGMT-E — Actual Staff Value Check G1+G2 Evidence 4 (Human Apply Transition Observed Fill)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
kind: Apply-transition Human observation — score lane fill
date: 2026-09-17
status: OBSERVED FILL / SCORES FILLED

HEAD
= 8708271e6c227e4a1ed6c5762a6823401016b0c6
= REVIEW-CLEARED

Companion (do not overwrite):
  Evidence-3 = docs/architecture/sbs-mgmt-e-actual-staff-value-check-g1-g2-evidence-3.md
  pre-Apply PASS / HOLD INCOMPLETE preserved as historical pre-Apply record

Evidence-5
= NOT CREATED
  Fresh Independent Value Review-1 P1 was empty Evidence-4 score lane.
  Fill existing Evidence-4; do not open a new packet.

G3 / CORE LOOP VALUE / Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Product mutation = NONE
Human session re-execution = NOT REQUIRED FOR THIS FILL
Observer Coaching = NONE
Agent-invented T4/T5 = NONE
Agent-invented S5/S6 absolute timestamps = NONE
```

This document was opened as an empty continuation lane. Section 5 is now filled from Human-observed Apply-transition facts. It does **not** rewrite Evidence-3. It does **not** invent S5/S6 clock times from System AppliedAt.

---

## 1. Why Evidence-4 exists (historical)

Evidence-3 already holds strong pre-Apply evidence:

```text
Time to Apply CTA = 12 sec
Wrong Turns = 0
Backtracks = 0
Hesitation = 0
T1–T3 = PASS / OBSERVED
T4–T5 = NOT SCORED   ← filled in this packet, not in Evidence-3
T-apply-transition = NOT MEASURED   ← filled in this packet as duration only
Session Verdict (Evidence-3 time)
= HOLD / INCOMPLETE
  (environment prevented Apply transition; participant/UI failure NOT ESTABLISHED)
```

Fresh Independent Value Review-1 HOLD cause:

```text
P1 = Evidence-4 Staff score lane EMPTY
     + no repository-backed post-Apply T4/T5/T-apply-transition
UI failure = NOT ESTABLISHED
Human comprehension failure = NOT ESTABLISHED
```

---

## 2. Harness (same HEAD) — unchanged

```bash
# from detached checkout at 8708271e (or equivalent CORR-1 product tree)
node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

Staff before-Apply URL:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

### Environment capability check (agent harness probe — NOT this Staff fill)

Recorded at empty-lane authoring time. Kept for distinction only:

```text
Apply button visible = YES（版 4 を適用開始する）
Apply button enabled = YES (disabled=false)
Click succeeded (synthetic probe) = YES
Post-Apply v4 current visible = YES
Post-Apply v3 prior visible = YES
This probe ≠ Staff G1/G2 PASS
This probe ≠ T4/T5 observed answers
This probe ≠ T-apply-transition = 1.7 sec
```

---

## 3. Observed fill (Human Apply transition)

```text
SBS-MGMT-E
Actual Staff Value Check G1+G2
Evidence-4 — Human Apply Transition Observed Fill

Product HEAD
= 8708271e6c227e4a1ed6c5762a6823401016b0c6

Human Apply click
= EXECUTED / OBSERVED

S5 exact click timestamp
= NOT RECORDED

S6 exact recognition timestamp
= NOT RECORDED

T-apply-transition
= 1.7 sec
= HUMAN OBSERVED / MEASURED
= no normative threshold defined
= NOT classified as fast / good / PASS-because-under-threshold

Rendered post-Apply state
= CONFIRMED

Rendered current version
= 現行版 4

Rendered Apply information
= planning-pc-synthetic-staff
= 2026-09-17T00:40:27.771Z

Important
= above timestamp is System AppliedAt
= NOT substituted for S5 or S6
= NOT used to back-calculate S5 or S6

T4
Question
= 今、現在使われている計画は何版ですか？

Human Answer
= 現行版 4

Score
= PASS / OBSERVED

T5
Question
= さっきまで使われていた版3は、今どうなっていますか？

Human Answer
= 過去版

Score
= PASS / OBSERVED

Prior-version rendered-row capture
= NOT SEPARATELY RECORDED
= Human semantic recognition only

Observer coaching
= NONE

Wrong turns (Apply phase)
= NOT RECORDED
  (do not invent 0)

Backtracks (Apply phase)
= NOT RECORDED

Hesitation (Apply phase)
= NOT RECORDED

Help Requested
= NOT RECORDED FOR APPLY PHASE
  Evidence-3 pre-Apply Help Requested = NO remains in Evidence-3

Production evidence
= NONE

G3
= NOT TESTED / HOLD

CORE LOOP VALUE
= NOT DECLARED

Ready / Merge / Deploy / LIVE WRITE
= NOT AUTHORIZED
```

Exact Scope T4/T5 wording in the original empty lane differed slightly. This fill records the questions actually used in the observed Human continuation. Semantic target remains: after Apply, current = 版4; 版3 is prior / historical, not still 現行.

Pre-Apply T5 contamination from Evidence-3 (`「版3は現行、版2・版1は過去版」`) is **not** copied forward. Post-Apply T5 answer recorded here is `過去版` about 版3 after Apply.

---

## 4. Score lane (filled)

```text
Apply clicked independently = YES / EXECUTED / OBSERVED
S5 click timestamp = NOT RECORDED
S6 post-Apply arrival timestamp = NOT RECORDED
T-apply-transition = 1.7 sec (HUMAN OBSERVED / MEASURED; threshold NONE DEFINED)

On-screen v4 current = YES / 現行版 4
On-screen v3 prior = NOT SEPARATELY RECORDED (Human semantic recognition only)

T4 answer (verbatim) = 現行版 4
T4 score = PASS / OBSERVED

T5 answer (verbatim) = 過去版
T5 score = PASS / OBSERVED

Wrong turns (Apply phase) = NOT RECORDED
Backtracks (Apply phase) = NOT RECORDED
Hesitation (Apply phase) = NOT RECORDED
Help Requested (Apply phase) = NOT RECORDED
Observer Coaching = NONE

System AppliedAt (rendered)
= planning-pc-synthetic-staff
= 2026-09-17T00:40:27.771Z
= NOT S5
= NOT S6

Evidence-4 Verdict
= OBSERVED FILL COMPLETE
  T4 / T5 / T-apply-transition duration = OBSERVED
  S5 / S6 absolute timestamps = NOT RECORDED (not invented)
  Prior-version rendered-row = NOT SEPARATELY RECORDED
```

### Combined session roll-up

```text
Evidence-3 pre-Apply
  T1–T3 PASS / OBSERVED
  Time to Apply CTA = 12 sec
  friction counts recorded
  Session at Evidence-3 time = HOLD / INCOMPLETE (Apply not then observed)

Evidence-4 Apply-transition
  Human Apply click = EXECUTED / OBSERVED
  T4 PASS / OBSERVED
  T5 PASS / OBSERVED
  T-apply-transition = 1.7 sec MEASURED
  S5/S6 absolute = NOT RECORDED

P2 from Value Review-1 (scan notes / S1–S4 segmentation)
= remain P2
= do not force full session re-run
= do not invent missing absolute clocks

This fill
≠ CORE LOOP VALUE CONFIRMED
≠ Human Acceptance Disposition chosen
≠ Ready / Merge / Deploy / LIVE WRITE

Fresh Independent Value Review-2
= ELIGIBLE TO START against this filled Evidence-4 + unchanged Evidence-3
≠ auto PASS of that review
```

---

## 5. Environment blocker log

```text
Apply button visible = YES (Human observed click)
Apply button enabled = YES (click executed)
Click attempted = YES / HUMAN
Click effect = post-Apply rendered 現行版 4 + System AppliedAt shown
Error / overlay / harness message = NONE RECORDED
LIVE WRITE still false = YES (synthetic harness; production evidence NONE)
Participant failure = NOT ESTABLISHED
UI / harness failure = NOT ESTABLISHED
```

---

## 6. Boundaries

```text
Evidence-3 remains immutable historical pre-Apply record
Evidence-4 does not rewrite T1–T3 or 12-sec CTA timing
Evidence-5 not created
No product / copy / CSS mutation
No Human full-session re-execution
No Deploy / LIVE WRITE
No CORE LOOP VALUE declaration here
S5/S6 not invented from System AppliedAt
1.7 sec not converted to a UX score or threshold PASS
```

---

## NEXT

```text
Evidence-4 observed fill = THIS COMMIT
↓
PR #635 exact new HEAD pin
↓
repository readback
↓
Fresh Independent Value Review-2
↓
P0=0 / P1=0 ?
    ├─ YES → Human Acceptance Disposition re-evaluation ELIGIBLE
    └─ NO  → exact finding only Correction

STOP here for this packet
≠ Human Acceptance Disposition
≠ CORE LOOP VALUE CONFIRMED
≠ Ready / Merge / Deploy / LIVE WRITE
```
