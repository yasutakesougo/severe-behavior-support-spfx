# SBS-MGMT-E — Current-Main Acceptance Rebaseline 1（Evidence-2）

```text
STATUS: HISTORICAL / SUPERSEDED PIN
unit: SBS-MGMT-E-633-EVIDENCE-SALVAGE-1 source packet
source PR: #633 (OPEN / DRAFT / mergeable=CONFLICTING)
Evidence-2 pin: ac6b3d665b0e514852775b5b58f5f9e254d107ae
canonical salvage: docs/architecture/sbs-mgmt-e-633-evidence-salvage-1.md
Do not use this file as current-main gate pin.
Do not merge #633 to land this packet.
```

## Original Evidence-2 (pin ac6b3d66)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E (#556)
kind: current-main Acceptance Rebaseline / Evidence-2
Evidence-1 basis: efb5ef9c5bac2c1ee2778a4eb7bfcf2eac27df80
Evidence-2 / current main: ac6b3d665b0e514852775b5b58f5f9e254d107ae
date: 2026-09-16
Locked Definition: #556 base + Correction-1 (5633610130) + Correction-2 (5633716648) + #606 PASS
Acceptance Execution Start GO: previously CONSUMED (still in-progress acceptance)
Human Apply Staff Path A: HOLD / REQUIRED
CORE LOOP VALUE DISPOSITION: HOLD / NOT DECLARED
Deploy / Production Binding / LIVE WRITE: HOLD
#602 SBS-MGMT-HOME-DEPLOY-V1: separate lane
```

## 0. Why rebaseline

Evidence-1 was pinned to `efb5ef9c`. Current `origin/main` advanced to `ac6b3d66` (CORR-1F/G FIELD_STAFF Task-First IA + STATE-DISTINCTION presentation). Acceptance evidence must be re-pinned; Definition / Scope Lock is unchanged.

## 1. Delta classification（Acceptance lens）

Range: `efb5ef9c5bac2c1ee2778a4eb7bfcf2eac27df80..ac6b3d665b0e514852775b5b58f5f9e254d107ae`

| Bucket | Finding |
|---|---|
| DOMAIN-SEMANTIC | **None.** `tests/domain/support-plan-revision.test.ts`, `tests/domain/support-plan-activation.test.ts`, `src/domain/support-plan-*`, `management-home-read-model` unchanged |
| NAVIGATION-IA | CORR-1F/G FIELD_STAFF Task-First: `AppShellChrome.tsx`, `field-staff-task-navigation.ts`, `ScaffoldShell.tsx`, `TodaySupportDayBoard.tsx`, new `spfx/smoke/sbs-role-task-first-ia-1/` |
| RENDERED-SURFACE | STATE-DISTINCTION: `HumanReviewView.tsx`, `MonitoringView.tsx` (+ tests/scss); `human-review-ui-slice-a/run-smoke.mjs` |
| ACCEPTANCE-NEUTRAL | CORR-1F/1G gate docs + parent disposition docs under `docs/architecture/sbs-role-task-first-ia-v1-*`, `sbs-state-distinction-correction-1-scope-definition.md` |

Non-docs product/smoke paths in range (17 files): navigation IA + monitoring presentation only. No Management Home / Apply domain rewrite.

## 2. Domain / contract semantic invariants（re-verified @ ac6b3d66）

Commands:

```bash
npx tsx --test \
  tests/domain/support-plan-revision.test.ts \
  tests/domain/support-plan-activation.test.ts
# → 23 pass / 0 fail

cd spfx && npm run prepare:b2-build-basis \
  && ./node_modules/.bin/heft test --clean \
       --test-path-pattern "management-home-read-model|ManagementHome|HumanReviewView|MonitoringView"
# → Successes: 468 / Failures: 0
# Key files PASS:
#   management-home-read-model.test.js (12)
#   ManagementHome.test.js (3)
#   HumanReviewView.test.js (9)
#   MonitoringView.test.js (4)
```

Correction-2 semantic checklist 1–15: **PASS** via unchanged domain + read-model surfaces re-run at current main.

`closed-loop-evidence.json`: **not materialized** (Evidence-1 minimality stands; canonical tests suffice).

## 3. Case A–H affected-path matrix

| Case | Path class | Re-verify | Result |
|---|---|---|---|
| A NO_CHANGE | semantic UNCHANGED; chrome hygiene | Loop-B NO_CHANGE smoke + revision domain | PASS |
| B CHANGE_REQUIRED → Draft | semantic UNCHANGED; chrome hygiene | Loop-B happy-path smoke + revision domain | PASS |
| C zero records | rendered LIKELY AFFECTED (STATE-DISTINCTION) | Loop-A zero-record + human-review-ui-slice-a + Monitoring/HumanReview tests | PASS |
| D identity mismatch | UNCHANGED | Home mismatch cases + activation HOLD | PASS |
| E duplicate action | UNCHANGED | revision ALREADY_STARTED + activation ALREADY_APPLIED | PASS |
| F Human Apply → currentVersion → Home | semantic UNCHANGED; staff arrival chrome possible side-effect | activation domain + Loop-B Apply path + Home smoke | PASS (synthetic); **Staff Path A HOLD** |
| G stale Draft | UNCHANGED | activation stale HOLD | PASS |
| H unavailable / UNKNOWN | UNCHANGED | Home unavailable + read-model fail-closed | PASS |

## 4. Rendered Browser Acceptance（1280×900 + 390×844）@ ac6b3d66

| Harness | Command | Result |
|---|---|---|
| Loop-A | `node spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs` | **PASS** (`report.pass=true`, basis `ac6b3d66`) |
| Loop-B | `node spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs` | **PASS** |
| Management Home | `node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs` | **PASS** (`allPass=true`, 13 cases) |
| Case C adjacent | `node spfx/smoke/human-review-ui-slice-a/run-smoke.mjs` | **PASS** (`passed=true`) |

Artifacts (agent run): `/opt/cursor/artifacts/sbs-mgmt-e-rba/{loop-a,loop-b,home,human-review}/`

### Loop-A harness correction included in this PR

Evidence-1 did not re-run Loop-A smoke. At both `efb5ef9c` and `ac6b3d66`, product post-capture UI is **readback without writable controls** (unit tests assert action buttons absent). The Loop-A smoke still asserted `buttonsDisabled` / `reasonDisabled===true` (disabled-form model).

This rebaseline updates `spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs` to assert `captureFormAbsent` + decision readback copy, matching locked product semantics. **No product UI change.**

Salvage note: that harness patch is **not replayed**. It is superseded by #634 (`db0f74ef`), which already asserts `captureFormAbsent` **and** CORR-1A `nextSupportCue`. Replaying #633 would delete CORR-1 assertions.

## 5. 5-persona simulation

Packet: [`sbs-mgmt-e-5-persona-simulation-1.md`](./sbs-mgmt-e-5-persona-simulation-1.md)

```text
verdict = PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
P0 = 0 / P1 = 0 / P2 = 2
!= Actual Staff Human Apply Path A
```

## 6. Evidence pin

```text
Evidence-2 exact main = ac6b3d665b0e514852775b5b58f5f9e254d107ae
Prior Evidence-1 pin   = efb5ef9c5bac2c1ee2778a4eb7bfcf2eac27df80  (superseded for gate pin)
```

Paste-ready #556 comment summary:

```text
# SBS-MGMT-E — Acceptance Execution Evidence-2 (current-main rebaseline)

Basis main = ac6b3d665b0e514852775b5b58f5f9e254d107ae
Prior Evidence-1 = efb5ef9c (STALE; superseded for pin)

Delta: DOMAIN-SEMANTIC none; NAVIGATION-IA CORR-1F/G; RENDERED STATE-DISTINCTION Case C
Semantic invariants re-verified PASS
Case A–H matrix re-verified PASS (synthetic)
RBA 1280/390 Loop-A/B/Home + human-review-ui-slice-a PASS
5-persona simulation = PASS WITH MINOR FRICTION (SIM ONLY)

#556 Human Apply staff Path A T1–T5 = HOLD / REQUIRED
CORE LOOP VALUE DISPOSITION = HOLD
Fresh Independent Acceptance Review = REQUIRED against Evidence-2
Deploy / LIVE WRITE = HOLD
```

Do not post this comment from salvage. The summary is historical. Canonical NEXT is in the salvage packet.

## 7. Current acceptance verdict

```text
Exact-main preflight             = PASS @ ac6b3d66
Semantic closed-loop             = PASS
Case C rendered STATE-DISTINCTION = PASS
RBA 1280/390                     = PASS
5-persona simulation             = PASS WITH MINOR FRICTION (SIM ONLY)
#554 Home staff (prior)          = reusable for Home readability only
#556 Human Apply staff Path A    = HOLD / REQUIRED
CORE LOOP VALUE DISPOSITION      = HOLD
```

Historical only. Salvage overlay is in [`sbs-mgmt-e-633-evidence-salvage-1.md`](./sbs-mgmt-e-633-evidence-salvage-1.md).

## 8. STOP — Human-only NEXT

```text
7. Human Apply Actual Staff Check (Path A T1–T5)
   Arrival (synthetic):
   node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
   http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
   Path B still invalid (#583 staff never PASS)

8. Fresh Independent Acceptance Review against Evidence-2 @ ac6b3d66
   Agent does not declare review PASS / open Human-gated review Issue without GO

9. Human Acceptance disposition on #556
   CORE LOOP VALUE CONFIRMED | PARTIAL / EXACT GAP | NOT PRACTICAL
```

Historical only. Do not treat this STOP as current-main NEXT.

## 9. Boundaries

```text
This packet does NOT authorize:
Ready / Merge / Deploy / LIVE WRITE / Production Binding
Issue close / Ready transition
SharePoint / M365 / Entra mutation
AI substitution for Human Review / revision-start / Human Apply / disposition
Merge of PR #633
```
