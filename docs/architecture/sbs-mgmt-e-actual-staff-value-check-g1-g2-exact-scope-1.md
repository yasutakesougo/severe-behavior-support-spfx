# SBS-MGMT-E — Actual Staff Value Check Exact Scope (G1 + G2)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
parent: #556 SBS-MGMT-E
kind: Exact Scope + staff procedure (docs lock)
date: 2026-09-16

Slice GO:
  docs/architecture/sbs-mgmt-e-actual-staff-value-check-g1-g2-slice-go-1.md
  RECEIVED / CONSUMED — G1 + G2 only
Parent disposition:
  docs/architecture/sbs-mgmt-e-human-acceptance-disposition-partial-1.md
  PARTIAL / CONSUMED

Product under test (provisional until head fixation):
  CORR-1A/1B/1C presentation on PR #634 product HEAD
  product HEAD candidate = 8708271e6c227e4a1ed6c5762a6823401016b0c6
  branch = origin/cursor/sbs-mgmt-e-cognitive-closed-loop-corr-1-6665
  Evidence-2 main pin (semantic basis) = ac6b3d665b0e514852775b5b58f5f9e254d107ae
  Head fixation required before Staff session scoring

Harness:
  node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
  Staff before-Apply URL (synthetic / LIVE WRITE false):
  http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply

G3 Production / live workplace value: OUT / HOLD
Product / domain mutation: OUT
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Simulation substitute: FORBIDDEN
```

This Exact Scope locks **what** G1 + G2 Staff sessions must observe. It does not itself score Staff PASS. Agent / Simulation / RBA cannot fill G1/G2 results.

---

## 1. IN / OUT

### IN

```text
G1 Observed live navigation
  - staff operates the synthetic Apply-transition path themselves
  - observer records surfaces visited, searches, backtracks, wrong taps
  - Path A snapshot semantic answers alone are insufficient

G2 Timed task evidence
  - wall-clock timing for defined segments
  - hesitation / pause notes (qualitative) bound to moments
  - not a performance SLA invent; evidence only

Staff questions T1–T5 (Correction-2 Apply-transition set)
  after Arrival gate YES

Observer scoring sheet + session record (this doc)

Reuse existing Loop-B serve-smoke harness (synthetic)
CORR-1A/1B/1C copy must be present on product under test
```

### OUT

```text
G3 Production / live workplace value
  real tenant usefulness / adoption / support-quality claims
Deploy / App Catalog / Production Binding / LIVE WRITE
SharePoint / M365 / Entra mutation
src/domain/** / activation CAS / currentVersion authority rewrite
CORR-1 reopen or new presentation redesign
Progressive Disclosure / Causal Linking / Diff viewer / Visual Hierarchy
as acceptance requirements
Cold create-cta redesign
Agent-filled answers / 5-persona simulation as Staff PASS
Path A snapshot-only re-use as G1/G2 PASS
Issue #556 close / CORE LOOP VALUE CONFIRMED auto-upgrade
```

---

## 2. Head fixation (required before scoring)

```text
1. Checkout a tree that contains CORR-1A/1B/1C product files
   (PR #634 product HEAD candidate 8708271e, or successor
    Human-pinned SHA that still contains those strings)
2. Record exact product HEAD SHA in the Staff session record
3. Start serve-smoke from THAT checkout (rebuilds smoke-entry)
4. Confirm CORR-1 first-scan strings before Arrival gate:
   - Review cue family OR Draft block note:
     「版 4 は下書きです。使い始めるには「版 4 を適用開始する」が必要です。」
   - Apply CTA: 「版 4 を適用開始する」
   - Home next-action (if visited): 「適用開始する前に」 wording
     (not legacy 「適用可否」)
5. If CORR-1 strings absent → HOLD / NOT SCORED (wrong HEAD)
```

Head change after fixation invalidates an in-progress session; re-fix and restart Arrival gate.

---

## 3. Arrival gate (score before T1–T5 / G1 / G2)

Same fail-closed rule as PLAN-ACTIVATION-C Staff Arrival: environment failure ≠ staff comprehension failure.

```text
[ ] serve-smoke from fixed HEAD is running on :4194
[ ] Staff URL includes destination=users and staffPlanTransition=beforeApply
[ ] 緑の確認バナー / data-sbs-mgmt-plan-activation-c-staff-check="ready" (if present on HEAD)
[ ] タブまたは到達表示が適用待機系（【適用待機】等）
[ ] 見直し結果 readback = 変更が必要
[ ] 版4 下書き説明が見える
[ ] 「版 4 を適用開始する」が見える
[ ] CORR-1B first-scan note visible (下書きです…適用開始する」が必要です)
```

```text
ALL YES → START G1/G2 + T1–T5
ANY NO  → HOLD → NOT SCORED
```

---

## 4. Task path (synthetic)

Natural one-task path. Do not read the full matrix aloud to staff.

```text
A. Land on before-Apply Support Plan surface (Staff URL)
B. Orient: current applied vs Draft (no Apply yet)
C. Optional: open Management Home next-action, return to plan
D. Answer T1–T3 (pre-Apply)
E. Explicitly press 「版 4 を適用開始する」
F. Observe post-Apply current version / prior version
G. Answer T4–T5 (post-Apply)
```

LIVE WRITE remains false. Synthetic only.

---

## 5. Staff-facing questions (T1–T5)

Correction-2 Apply-transition set (not the earlier snapshot-only Path A paraphrase).

| # | Question | Pre/Post |
|---|---|---|
| T1 | 今使っている計画は何版か分かりますか？ | Pre |
| T2 | 次の版は今どういう状態ですか？ | Pre |
| T3 | 次の版を使い始めるために何が必要ですか？ | Pre |
| T4 | Human Apply のあと、現在版が切り替わったことが分かりますか？ | Post |
| T5 | 旧版はどうなりましたか？ | Post |

Expected semantic targets (synthetic fixture v3→v4):

```text
T1 → 版3 / 適用中
T2 → 版4 / 下書き / 未適用
T3 → explicit Human Apply（「版 4 を適用開始する」）
T4 → YES / 現在版は版4
T5 → 版3は過去版 / 履歴として残る（消えていない）
```

---

## 6. G1 — Observed live navigation (required fields)

Observer records during the task (not after reconstructing from memory alone):

```text
G1-1 surfaces visited (ordered)
G1-2 wrong taps / dead ends / backtracks (count + where)
G1-3 search / scan behavior (e.g. scrolled looking for Apply)
G1-4 whether Apply CTA was found without hint
G1-5 whether staff opened Home (optional path) and returned
G1-6 friction moments (1 sentence each, bound to surface)
```

```text
G1 PASS candidate:
  staff completes A→G without observer steering the clicks
  AND T1–T5 answers match expected targets (YES / ACCEPTABLE)
  AND no P1 semantic error (Draft treated as already applied;
      Apply skipped as unnecessary; currentVersion believed
      advanced before Apply)

G1 HOLD:
  Arrival gate NO
  OR observer had to drive navigation for the staff
  OR T1–T5 cannot be scored
```

Simulation / prior Path A snapshot answers do **not** fill G1-1…G1-6.

---

## 7. G2 — Timed task evidence (required fields)

Wall-clock only; no invented SLA pass/fail thresholds in this Scope.

| Segment | Clock |
|---|---|
| S0 | Arrival gate confirmed → task start |
| S1 | Task start → T3 answered (pre-Apply orientation) |
| S2 | Apply CTA found → Apply pressed |
| S3 | Apply pressed → T4+T5 answered |
| S4 | Total S0→S3 |

Also record:

```text
G2-hesitation: pauses > ~5s bound to moment/surface (qualitative)
G2-backtrack-time: approximate time spent in wrong path (if any)
```

```text
G2 evidence COMPLETE:
  S1–S4 recorded with timestamps or durations
  hesitation notes present or explicitly "none observed"

G2 is evidence, not auto FAIL on slow times.
P1 only if timing correlates with semantic error already scored under G1/T*.
```

---

## 8. Observer scoring sheet

| ID | Probe | Result | Severity | Moment |
|---|---|---|---|---|
| ARRIVAL | Arrival gate all YES | | P0 if NO and still scored | |
| T1 | current applied = v3 | | P1 if wrong active version | |
| T2 | Draft v4 / not applied | | P1 if Draft=applied | |
| T3 | needs explicit Apply | | P1 if auto/no-Apply belief | |
| T4 | after Apply current = v4 | | P1 if unclear/wrong | |
| T5 | prior v3 immutable history | | P1 if believed deleted/overwritten | |
| G1-nav | live navigation fields complete | | P1 if steered / missing | |
| G2-time | S1–S4 recorded | | P2 if incomplete notes | |

Severity reminder:

```text
P0 = safety / wrong active plan belief acted on / LIVE WRITE / gate bypass
P1 = Draft/Applied confusion; Apply ambiguity; currentVersion misunderstood
P2 = slow scan; minor backtrack without semantic error; incomplete optional Home visit
```

---

## 9. Staff session record template

```text
SBS-MGMT-E Actual Staff Value Check — G1+G2
unit = SBS-MGMT-E-ACTUAL-STAFF-VALUE-CHECK-G1-G2
date =
persona = Staff 1
product HEAD =
harness HEAD =
serve-smoke started from fixed HEAD = YES/NO
Arrival gate = YES/NO
LIVE WRITE = false
G3 claimed = NO

Psychological state (1 sentence):

G1-1 surfaces:
G1-2 backtracks:
G1-3 scan/search:
G1-4 Apply found without hint = YES/NO
G1-5 Home visited = YES/NO/NA
G1-6 friction:

G2 S1=
G2 S2=
G2 S3=
G2 S4=
G2 hesitation=
G2 backtrack-time=

T1:
T2:
T3:
T4:
T5:

Observer verdict = PASS / ACCEPTABLE / HOLD
P0=
P1=
P2=
G3 = NOT SCORED / HOLD
CORE LOOP VALUE CONFIRMED = NOT DECLARED HERE
```

---

## 10. Verdict rule (this unit only)

```text
PASS
  Arrival YES
  AND G1 navigation fields complete without observer steering
  AND G2 S1–S4 recorded
  AND T1–T5 match expected targets
  AND P0 = 0 AND P1 = 0

ACCEPTABLE
  PASS conditions with only P2 friction
  (slow scan / minor backtrack / optional Home skip)

HOLD
  Arrival NO
  OR missing G1/G2 required fields
  OR P0/P1 semantic failure
  OR wrong HEAD / CORR-1 strings absent
```

```text
This unit PASS / ACCEPTABLE
  ≠ CORE LOOP VALUE CONFIRMED
  ≠ G3 PASS
  ≠ Ready / Merge / Deploy / LIVE WRITE
  ≠ #556 close

Human may later reopen #556 disposition with G1+G2 evidence bound.
```

---

## 11. Boundaries

```text
Exact Scope authorizes observation procedure only.
Product mutation = OUT
G3 = OUT / HOLD
Deploy / LIVE WRITE = OUT
Simulation substitute = FORBIDDEN
```

---

## NEXT

```text
(optional Independent Definition/Scope Review if Human requires)
↓
Human head fixation confirmation
↓
Arrival gate
↓
Human Staff session G1+G2
↓
record PASS / ACCEPTABLE / HOLD
↓
STOP → Human #556 disposition reconsideration
   (PARTIAL remain | further gap | other)
≠ auto CONFIRMED
```
