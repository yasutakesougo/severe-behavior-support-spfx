# SBS-MGMT-E — Cognitive Closed-Loop Correction-1 Implementation Evidence 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-COGNITIVE-CLOSED-LOOP-CORRECTION-1
kind: Implementation Evidence Packet
date: 2026-09-16
product HEAD: 8708271e6c227e4a1ed6c5762a6823401016b0c6
Human Implementation Start GO: RECEIVED / CONSUMED
  record: docs/architecture/sbs-mgmt-e-cognitive-closed-loop-correction-1-human-implementation-start-go.md
Independent Definition/Scope Review-1: PASS WITH NON-BLOCKING FINDINGS
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Actual Staff Path A / CORE LOOP VALUE: NOT AUTHORIZED
Fresh Independent Implementation Review: PASS WITH NON-BLOCKING FINDINGS
  record: docs/architecture/sbs-mgmt-e-cognitive-closed-loop-correction-1-independent-implementation-review-1.md
  product HEAD 8708271e = REVIEW-CLEARED (P0=0 / P1=0)
```

## 1. Authorized mutation delivered

| ID | Change | Surface |
|---|---|---|
| CORR-1A | CHANGE_REQUIRED cue → `支援内容の見直しを始める（次版の下書き）`; helper resolves `planVersion+1` and states Apply not yet | `ReviewOutcomeCaptureView.tsx` + `review-outcome-capture-copy.ts` |
| CORR-1B | ADD first-scan `版 {N} は下書きです。使い始めるには「版 {N} を適用開始する」が必要です。`; Apply CTA label KEEP | `SupportPlan.tsx` + `support-plan-copy.ts` |
| CORR-1C | Replace「適用可否」with Apply-bound wording; post-apply clarifies `v{currentVersion}` | `management-home-read-model.ts` |

Domain / activation CAS / `currentVersion` authority / persistence / schema / approval workflow: **unchanged**.

## 2. Verification commands

Domain byte-stable:

```bash
npx tsx --test \
  tests/domain/support-plan-revision.test.ts \
  tests/domain/support-plan-activation.test.ts
# → 23 pass / 0 fail
```

Presentation / read-model:

```bash
cd spfx && npm run prepare:b2-build-basis \
  && ./node_modules/.bin/heft test --clean \
       --test-path-pattern "management-home-read-model|ManagementHome|ReviewOutcomeCaptureView|support-plan\\.test"
# → Successes: 468 / Failures: 0
```

RBA 1280×900 + 390×844:

```bash
node spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs
# → pass=true (CORR-1A cue + helper asserted)

node spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
# → pass=true; draftRequiresApplyClear=true @ 1280 and 390

node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs
# → allPass=true (13 cases)
```

Artifacts: `/opt/cursor/artifacts/sbs-mgmt-e-corr-1-rba/{loop-a,loop-b,home}/`

## 3. Observed locked copy (synthetic)

```text
CORR-1A cue   = 支援内容の見直しを始める（次版の下書き）
CORR-1A helper= 次は計画画面で、版 4 の下書き作成を始めます。適用はまだしません。
CORR-1B line  = 版 4 は下書きです。使い始めるには「版 4 を適用開始する」が必要です。
CORR-1B Apply = 版 4 を適用開始する  (KEEP)
CORR-1C Home  = 次に必要な人の行動: 次版 v4 を適用開始する前に内容を確認してください
```

## 4. Boundaries

```text
This packet does NOT:
  declare Independent Implementation Review PASS
  authorize Ready / Merge / Deploy / LIVE WRITE
  substitute Actual Staff Path A
  declare CORE LOOP VALUE disposition
```

## 5. NEXT

```text
Independent Implementation Review = PASS WITH NON-BLOCKING FINDINGS
product HEAD 8708271e = REVIEW-CLEARED
→ STOP (Ready / Merge require separate Human GOs)
→ SBS-MGMT-E G1+G2 Arrival Gate may proceed with review-cleared HEAD
```
