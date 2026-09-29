# SBS — Cleanup Close Candidates Final Check (READ ONLY)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-CLEANUP-CLOSE-CANDIDATES-FINAL-1
kind: final READ ONLY check before Human Close-without-merge batch
date: 2026-09-17
mode: READ ONLY / live GitHub + origin/main

Agent Close / Ready / Merge / Issue mutation: NOT PERFORMED / PROHIBITED
Human Close decision: REQUIRED (this packet does not execute Closes)
Deploy / LIVE WRITE / G3: NOT AUTHORIZED / NOT CLAIMED
Product / SPFx / domain mutation: 0
```

Parent packets:

- `docs/architecture/sbs-post-635-repository-state-convergence-1.md`
- `docs/architecture/sbs-corr-1g-632-ready-materials-1.md`

---

## 0. Re-pin (STATE_DRIFT from prior packets)

```text
origin/main
= 2bfc10fa192c39cf737816bcf2f0a8ccfe09a14f
subject
= Merge pull request #632 from yasutakesougo/cursor/corr-1g-product-merge-complete-fe8f

#632
= MERGED / CLOSED @ 2026-09-17T05:00:15Z
= head e165c37e… / merge commit 2bfc10fa…
= CORR-1G COMPLETE/ARCHIVED docs now ON MAIN

Prior residual R1 (#632 archive land) = CLOSED by Human Merge
This unit does not re-open CORR-1G
```

Additional live drift vs older convergence snapshot:

| Object | Prior packet | Live now |
|---|---|---|
| #448 | OPEN (KEEP OPEN) | **CLOSED** |
| #392 | OPEN | OPEN |
| #556 / #554 / #583 / #553 | CLOSED | CLOSED |

```text
#448 CLOSED does not authorize Deploy / G3 / reopening CORR-1G
#392 remains OPEN (delivery sequencing owner)
```

---

## 1. Authority / non-actions

```text
Agent Close of any PR            = PROHIBITED
Agent Ready / Merge              = PROHIBITED
Issue body / state mutation      = PROHIBITED
This packet                      = READ ONLY materials for Human Close decision
Close-without-merge              = Human-only when GO is given
Merge of superseded Draft tips   = FORBIDDEN (especially diverged product tips)
```

---

## 2. Target set (final)

Primary (Human-named):

```text
#639  #640
```

Superseded CORR / closed-Issue Drafts (convergence §6):

```text
#628 #627 #617 #614 #613 #612 #611
#608 #607 #604
#590 #587 #586 #585 #579
```

```text
#632 = NOT a cleanup target (MERGED)
```

All 17 targets re-checked live: **still OPEN / DRAFT** at observation time.

---

## 3. Per-PR final matrix

Legend:

| Tag | Meaning |
|---|---|
| **SAFE_CLOSE** | Close-without-merge recommended; no unique residual needed on main |
| **ACK_DISCARD** | Close-without-merge discards ONLY_ON_PR docs; Human must acknowledge discard (optional land first) |
| **MUST_NOT_MERGE** | Diverged / conflicting / superseded tip — Merge forbidden |

| PR | vs main | Parent / successor | Close recommendation | MUST_NOT_MERGE |
|---|---|---|---|---|
| **#639** | 1 ONLY_ON_PR docs | #635 MERGED; Ready-materials role ended | **ACK_DISCARD** (default Close) | yes (do not merge as “current”) |
| **#640** | 1 ONLY_ON_PR docs | #635 MERGED; Fresh Review role ended | **ACK_DISCARD** (default Close) | yes |
| **#628** | kickoff SAME; packet DIVERGED | #630/#632 landed Lock+archive | **SAFE_CLOSE** | **YES** (DIRTY/stale packet) |
| **#627** | 1 ONLY_ON_PR provisional Exact Scope | superseded by locked Scope on main | **ACK_DISCARD** (provisional; do not land) | **YES** |
| **#617** | 1 ONLY_ON_PR FAIL review | #618 Review-2 on main; CORR-1F ARCHIVED | **ACK_DISCARD** (historical FAIL) | yes |
| **#614** | 7 DIVERGED product/smoke | #616/#631 on main | **SAFE_CLOSE** | **YES** |
| **#613** | same head as #614 | same | **SAFE_CLOSE** | **YES** |
| **#612** | **SAME_ON_MAIN** (2) | already on main | **SAFE_CLOSE** (zero loss) | n/a |
| **#611** | **SAME_ON_MAIN** (1) | already on main | **SAFE_CLOSE** (zero loss) | n/a |
| **#608** | 43 files; product DIVERGED | **#554 CLOSED**; Home on main via #599/#601 | **SAFE_CLOSE** | **YES** |
| **#607** | same tip family as #608 | #554 CLOSED | **SAFE_CLOSE** | **YES** |
| **#604** | large docs/product stack DIVERGED | #554 CLOSED | **SAFE_CLOSE** | **YES** |
| **#590** | docs ADD+MODIFY | **#583 CLOSED** | **ACK_DISCARD** / SAFE if discard accepted | yes |
| **#587** | 6 ONLY_ON_PR docs | #583 CLOSED | **ACK_DISCARD** | yes |
| **#586** | product DIVERGED | #583 CLOSED | **SAFE_CLOSE** | **YES** |
| **#585** | 1 ONLY_ON_PR docs | #583 CLOSED | **ACK_DISCARD** | yes |
| **#579** | docs ADD+MODIFY | **#553 CLOSED**; G1+G2 on main via #635 | **ACK_DISCARD** / SAFE if discard accepted | yes |

---

## 4. Unique docs that Close-without-merge would discard

Human should treat these as **explicit discard acknowledgements** (or land first under a separate GO). Default recommendation from convergence: **discard is acceptable** for post-#635 knot cleanup.

### 4.1 Primary (#639 / #640)

| PR | Path discarded if Close-without-merge |
|---|---|
| #639 | `docs/architecture/sbs-mgmt-e-635-post-salvage-readiness-1.md` |
| #640 | `docs/architecture/sbs-mgmt-e-635-human-acceptance-disposition-fresh-review-1.md` |

```text
Both are gate/observation records for already-MERGED #635.
Landing them is optional archaeology, not a Merge Gate residual.
Default Human Close = OK with ACK_DISCARD.
```

### 4.2 CORR provisional / FAIL review

| PR | Path(s) |
|---|---|
| #627 | `…/sbs-role-task-first-ia-v1-exact-scope-p2-1-corr-1g.md` (provisional; **do not land over locked Scope**) |
| #617 | `…/sbs-role-task-first-ia-v1-corr-1f-independent-implementation-review-1.md` (FAIL; Review-2 already on main) |

### 4.3 Closed-Issue historical (#583 / #553)

| PR | Path(s) |
|---|---|
| #585 | `…/sbs-mgmt-plan-activation-c-actual-staff-apply-path-diagnosis-1.md` |
| #587 | six Staff Arrival / head-freeze docs under `sbs-mgmt-plan-activation-c-*` |
| #590 | arrival 2/5 HOLD doc (+ modify procedure doc — diverged; do not merge) |
| #579 | LOOP-B Staff Fix Scope / ponytail docs (+ modifies existing Loop-B docs — do not merge) |

---

## 5. Human Close decision packet (paste-ready)

```text
SBS Cleanup Close Batch
basis main = 2bfc10fa (#632 MERGED)
Agent Close = PROHIBITED
Human Close-without-merge GO = <YES / NO>

SAFE_CLOSE (recommended; Merge FORBIDDEN where noted):
  #611 #612
  #628 #614 #613
  #608 #607 #604
  #586

ACK_DISCARD (recommended Close; unique docs discarded unless landed first):
  #639 #640
  #627 #617
  #590 #587 #585 #579

NOT IN BATCH:
  #632 = already MERGED
  G3 / Deploy = untouched HOLD
  #392 = KEEP OPEN
  #605 / #606 Issue close = separate Human decision (out of this PR-Close batch)
```

```text
If Human GO = YES for the lists above:
  close each listed PR without merge
  do not merge diverged product tips
  do not reopen CORR-1G / #554 / #583 / #553 / #556

If Human GO = NO:
  STOP — leave Drafts open; no Agent action
```

---

## 6. Findings

```text
P0 = 0
P1 = 0
P2-1 = Close-without-merge of #639/#640 discards observation/Fresh Review docs
       = ACK_DISCARD / NON_BLOCKING for knot cleanup
P2-2 = #448 now CLOSED (prior KEEP OPEN framing) — note only; not a Close blocker
P2-3 = several candidates report mergeStateStatus UNKNOWN in API at check time
       = does not authorize Merge; Close-without-merge still valid
```

---

## 7. Explicit non-actions (this unit)

```text
Close #639 / #640 / any listed PR     = NOT PERFORMED
Ready / Merge any PR                    = NOT PERFORMED
Land discarded docs onto main           = NOT PERFORMED
Issue close (#605/#606/#392/…)          = NOT PERFORMED
Deploy / LIVE WRITE / G3                = NOT PERFORMED
CORR-1G / closed-Issue lane reopen      = NOT PERFORMED
```

---

## 8. project-status snapshot

```text
CURRENT
main: 2bfc10fa (#632 MERGED; archive ON MAIN)
Cleanup targets: 17 OPEN DRAFTs re-confirmed
#632 residual: DONE

GATE
HumanAction: Close-without-merge batch (Human-only GO required)
Agent: STOP — Close PROHIBITED

ALLOWED
- read-only final check (this packet)
- Human Close-without-merge after explicit GO
- optional separate land GO for ACK_DISCARD docs before Close

FORBIDDEN
- Agent Close / Ready / Merge
- Merge of SUPERSEDED_DIVERGED_PRODUCT tips
- G3 / Deploy claims

NEXT
Human:
  1. Decide Close-without-merge GO using §5 paste block
  2. Optionally land #639/#640 docs first (not required)
  3. Keep G3 / Deploy HOLD
  4. Separately judge #605/#606 Issue close
  5. #392 remains OPEN

Agent:
  STOP
  do not Close / Ready / Merge / mutate Issues
```

## 9. STOP

```text
SBS-CLEANUP-CLOSE-CANDIDATES-FINAL-1 = COMPLETE (READ ONLY)

Human Close decision = REQUIRED / NOT EXECUTED
Agent Close = PROHIBITED
#632 = MERGED (removed from residual)
Primary targets #639/#640 = still OPEN DRAFT / ACK_DISCARD OK
```
