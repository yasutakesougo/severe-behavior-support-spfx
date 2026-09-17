# SBS-MGMT-E — PR #633 Evidence Salvage 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-633-EVIDENCE-SALVAGE-1
kind: Evidence salvage / current-main re-pin
date: 2026-09-17
Human Salvage Start GO: RECEIVED / CONSUMED
source PR: #633 CLOSED without merge (Human Close-as-Superseded GO; see sbs-mgmt-e-633-human-close-as-superseded-1.md)
  (historical salvage snapshot below still describes OPEN/CONFLICTING at salvage time)
source branch: cursor/sbs-mgmt-e-acceptance-rebaseline-6665
source HEAD: 3f41fbf7f7def40c8a132bb56d5caf119e6b2288
source Evidence-2 pin: ac6b3d665b0e514852775b5b58f5f9e254d107ae  (STALE vs current main)
salvage basis / current origin/main: db0f74ef8b357868a1811a7face871777895f4f4
related Issue: #556 (OPEN; this salvage does not close it)
related draft PR (separate lane): #635 Human Acceptance Disposition
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Issue mutation / GitHub comment post: NOT AUTHORIZED
Merge of #633: FORBIDDEN (conflict + stale pin + superseded smoke)
```

## 0. Why salvage (not merge)

Live GitHub state for #633:

| Field | Value |
|---|---|
| state | OPEN / DRAFT |
| mergeable | CONFLICTING vs current `main` |
| Evidence pin in PR body | `ac6b3d66` |
| current `origin/main` | `db0f74ef` (`#634` CORR-1 + `#636` OSS) |
| unique docs | Evidence-2 rebaseline + 5-persona SIM (never landed on `main`) |
| unique code | Loop-A smoke `captureFormAbsent` patch |

Merging #633 would:

1. replay a **stale** Loop-A harness that **removes** CORR-1A `nextSupportCue` assertions already on `main` via #634
2. land Evidence-2 as if current main were still `ac6b3d66`
3. keep CORE LOOP VALUE DISPOSITION = HOLD as if #635 did not exist (STATE_DRIFT vs a separate unmerged lane)

Salvage Start GO authorizes **docs-only salvage + re-verify at current main**. It does not authorize merging #633 or Ready/Merge of this salvage PR.

## 1. File disposition from #633

| Path | Salvage action | Reason |
|---|---|---|
| `docs/architecture/sbs-mgmt-e-current-main-acceptance-rebaseline-1.md` | **PRESERVE as HISTORICAL** | Evidence-2 facts @ `ac6b3d66` are still the prior pin; banner forbids using it as current gate |
| `docs/architecture/sbs-mgmt-e-5-persona-simulation-1.md` | **PRESERVE as HISTORICAL SIM** | SIM ONLY @ `ac6b3d66`; not Actual Staff |
| `spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs` | **DISCARD / DO NOT REPLAY** | #634 already has `captureFormAbsent` **and** CORR-1A cue/helper. #633 patch is a subset that conflicts |

## 2. Delta classification (`ac6b3d66` → `db0f74ef`)

Range: `ac6b3d665b0e514852775b5b58f5f9e254d107ae..db0f74ef8b357868a1811a7face871777895f4f4`

| Bucket | Finding |
|---|---|
| DOMAIN-SEMANTIC | **None.** `src/domain/support-plan-*` and revision/activation tests unchanged in this range |
| RENDERED-SURFACE | CORR-1A/1B/1C presentation copy (#634): ReviewOutcomeCapture cue/helper, SupportPlan first-scan Draft≠Apply line, Management Home Apply-bound wording |
| HARNESS | Loop-A/B smoke assertions for CORR-1 copy; Loop-A format commit `1f7b1859` |
| ACCEPTANCE-NEUTRAL | OSS README + Apache-2.0 LICENSE (#636); CORR-1 Definition / Scope / Implementation Evidence / Independent Reviews |

CORR-1 is **presentation copy only**. Domain Apply / `currentVersion` / CAS / persistence remain unchanged. Case A–H semantic matrix from Evidence-2 remains the salvage baseline; Case B/F **rendered** copy must be re-read against CORR-1, not against the `ac6b3d66` SIM wording.

## 3. Re-verify @ salvage basis `db0f74ef`

Commands (executed on this salvage branch; HEAD may equal `db0f74ef` plus docs-only commits):

```bash
git rev-parse origin/main
# expected: db0f74ef8b357868a1811a7face871777895f4f4

npx tsx --test \
  tests/domain/support-plan-revision.test.ts \
  tests/domain/support-plan-activation.test.ts

cd spfx && npm run prepare:b2-build-basis \
  && ./node_modules/.bin/heft test --clean \
       --test-path-pattern "management-home-read-model|ManagementHome|HumanReviewView|MonitoringView|ReviewOutcomeCaptureView|support-plan\\.test"

node spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs
node spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs
node spfx/smoke/human-review-ui-slice-a/run-smoke.mjs
```

Results: **PASS** (see §8). Product/SPFx tree matches `origin/main` `db0f74ef`; salvage HEAD is docs-only.

## 4. Case A–H salvage overlay

| Case | Evidence-2 @ ac6b3d66 | Salvage overlay @ db0f74ef |
|---|---|---|
| A NO_CHANGE | PASS (synthetic) | Re-run Loop-B NO_CHANGE; domain unchanged |
| B CHANGE_REQUIRED → Draft | PASS (synthetic) | Re-run Loop-B; CORR-1A cue now required copy |
| C zero records | PASS (STATE-DISTINCTION) | Re-run Loop-A ZERO + human-review-ui-slice-a |
| D identity mismatch | PASS | Home mismatch; domain unchanged |
| E duplicate action | PASS | revision/activation tests unchanged |
| F Human Apply → currentVersion → Home | PASS synthetic; Staff Path A HOLD | Same; CORR-1B/1C copy is presentation-only. Staff T1–T5 remain Human |
| G stale Draft | PASS | activation stale HOLD unchanged |
| H unavailable / UNKNOWN | PASS | Home fail-closed unchanged |

## 5. 5-persona salvage overlay (SIM ONLY)

Historical SIM @ `ac6b3d66`: P0=0 / P1=0 / P2=2 (CTA scan cost; Draft≠Applied skim).

CORR-1 locked copy now on `main` (implementation evidence @ `8708271e`, merged via #634):

```text
CORR-1A cue   = 支援内容の見直しを始める（次版の下書き）
CORR-1A helper= 次は計画画面で、版 4 の下書き作成を始めます。適用はまだしません。
CORR-1B line  = 版 4 は下書きです。使い始めるには「版 4 を適用開始する」が必要です。
CORR-1C Home  = 次に必要な人の行動: 次版 v4 を適用開始する前に内容を確認してください
```

Salvage SIM overlay (read-only against locked copy + harness assertions; **not** a new Actual Staff session):

```text
P2-1 CTA scan cost: REDUCED IN COPY (CORR-1A/1B) / still SIM ONLY / not zeroed without staff
P2-2 Draft≠Applied skim: ADDRESSED IN COPY (CORR-1B first-scan + CORR-1C Home) / still SIM ONLY
P0 = 0 / P1 = 0
Historical P2 findings are NOT promoted to P1 and NOT declared resolved by staff
```

```text
Simulation PASS != Actual Staff Value Check PASS
This overlay does not score G1/G2/T1–T5
```

## 6. Disposition / #635 boundary

```text
Evidence-2 historical DISPOSITION = HOLD / NOT DECLARED  (true at ac6b3d66)
#635 draft records Human speech-act CORE LOOP VALUE CONFIRMED  (UNMERGED; not current main)
This salvage does NOT consume, confirm, or supersede #635
This salvage does NOT declare CORE LOOP VALUE
This salvage does NOT close #556
```

Live-state note only: #635 exists and is OPEN/DRAFT. Salvage must not overwrite that lane or treat unmerged docs as `main`.

## 7. Boundaries

```text
This salvage does NOT authorize:
  Merge of #633
  Ready / Merge of this PR or #635
  Deploy / LIVE WRITE / Production Binding / SharePoint / M365 / Entra
  Issue close / Issue comment post
  Product / domain / schema mutation
  Replaying #633 smoke (would regress CORR-1 harness)
  Treating SIM overlay as Actual Staff PASS
  Treating this packet as Human Acceptance Disposition
```

## 8. Execution evidence (this salvage run)

```text
salvage branch: cursor/sbs-mgmt-e-633-evidence-salvage-14fe
origin/main product pin: db0f74ef8b357868a1811a7face871777895f4f4
salvage HEAD (docs-only on that pin): 3e18e994ed8e0e8c08f04c67f5fe1da9b918b304
  (Loop-A report.productBasisHead = salvage HEAD; product/SPFx tree == origin/main)
domain revision/activation: 23 pass / 0 fail
heft targeted (prepare:b2-build-basis + pattern): Successes 468 / Failures 0
  key PASS: management-home-read-model.test.js (12), ManagementHome.test.js (3),
            HumanReviewView.test.js (9), MonitoringView.test.js (4),
            ReviewOutcomeCaptureView.test.js (7), support-plan.test.js (16)
Loop-A RBA: PASS (report.pass=true; 22/22; CORR-1A cue+helper asserted;
            captureFormAbsent=true on post-capture; Case C zero-record factual)
Loop-B RBA: PASS (report.pass=true; 6/6; draftRequiresApplyClear=true @ 1280 and 390)
Management Home smoke: PASS (allPass=true; 13 checks)
human-review-ui-slice-a: PASS (passed=true; pc+narrow × v2/v1/v3/mismatch/malformed)
artifacts: /opt/cursor/artifacts/sbs-mgmt-e-633-evidence-salvage-1/
#633 smoke patch: NOT REPLAYED (confirmed current main already has captureFormAbsent + nextSupportCue)
```

## 9. STOP — NEXT

Historical salvage NEXT (at packet write). Post-landing overlay:

```text
Salvage #637 = MERGED @ 736fc89c
Human Close-as-Superseded GO = CONSUMED
#633 = CLOSED without merge
record: docs/architecture/sbs-mgmt-e-633-human-close-as-superseded-1.md
```

Remaining Human-only (not authorized by salvage or this close GO):

```text
Ready / Merge of the close-consumption docs PR
Ready / Merge of #635
#556 close
Deploy / LIVE WRITE
```
