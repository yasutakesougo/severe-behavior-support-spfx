# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1F Human Task Acceptance Decision Frame

Human-only Task Acceptance gate for Correction-1F after Independent Implementation Review-2 PASS.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1F
kind: Human Task Acceptance decision frame
Implementation PR: #616
branch: cursor/corr-1f-product-implementation-c608
exact HEAD: 3e1eac933abfd9330604330f9074290f48bef674
Prettier-only Correction: COMPLETE / 4 files / behavior change NONE
Exact-head CI: GREEN
  Contracts SUCCESS
  SPFx build SUCCESS
  field-staff-task-navigation 7 PASS
  role-task smoke SUCCESS / 7 of 7
  B12 smoke SUCCESS
Independent Implementation Review-2: PASS / REVIEW-CLEARED
  review doc: docs/architecture/sbs-role-task-first-ia-v1-corr-1f-independent-implementation-review-2.md
  review PR: #618
P1-1: CLOSED
P2-1 / P2-2 / P2-3: OPEN / NON-BLOCKING
Human Task Acceptance: AWAITING HUMAN DECISION / NOT PASS / NOT CLAIMED
Human Ready / Merge GO: NOT AUTHORIZED
Deploy / LIVE WRITE: NOT AUTHORIZED
Product mutation by this document: 0
```

This document does **not** record Human Task Acceptance PASS. It fixes the decision frame so a Human can confirm staff tasks on a real usable screen, separately from CI and from Ready / Merge.

Independent Implementation Review PASS ≠ Human Task Acceptance PASS ≠ Human Ready / Merge GO.

---

## Verdict (current)

```text
RESULT: AWAITING HUMAN DECISION
Human Task Acceptance: NOT PASS / NOT CLAIMED / NOT EXECUTED
Human Ready / Merge GO: NOT AUTHORIZED
Deploy / LIVE WRITE: NOT AUTHORIZED
```

CI re-check is **not** the HTA gate. Exact-head CI GREEN and Review-2 PASS are already recorded. HTA is a Human usable-session judgment.

---

## What screenshots already support (non-HTA)

Synthetic smoke screens at Review-2 evidence show that the Task-First IA **structure** is present for FIELD_STAFF:

```text
Globals visible: 今日 · 手順 · 記録する · 未記録 · 探す
D-TODAY composition present:
  今日の予定 → 支援状況 → 今日やること → 最近の記録
procedure / find / unrecorded / today-return paths exercised in smoke 7/7
```

Structure presence in smoke screens is useful orientation. It is **not** Human Task Acceptance PASS.

---

## Separate concern: Japanese label tofu / missing glyphs

Smoke / CI screenshots may show tofu (□) or missing Japanese glyphs in some labels.

```text
Disposition: SEPARATE FROM HTA PRODUCT JUDGMENT
Hypothesis A: screenshot / CI font environment only
Hypothesis B: same defect appears on real staff usable session
```

HTA must not fail or pass solely on CI screenshot font rendering. Human confirms on a real usable session (or equivalent staff-facing runtime) whether labels are readable. If Hypothesis B is observed, record it as a Product finding outside “CI green” and do not collapse it into format-only history.

---

## Human confirmation checklist (FIELD_STAFF / CORR-1F)

Human confirms each item on a real usable session against Product PR #616 @ exact HEAD `3e1eac93`. Dev selectors must not be required.

| ID | Human question | Pass when |
|---|---|---|
| HTA-1F-1 | 今日、自分が誰に何をすればよいか分かる | First paint / 今日 makes today’s targets and next work readable without developer knowledge |
| HTA-1F-2 | 記録が必要な人を見つけられる | 未記録 or equivalent path surfaces people needing record without collapsing to 0件 / 実施できなかった |
| HTA-1F-3 | 記録後に次に何をすればよいか分かる | After a record-oriented action, orientation to next staff work remains clear |
| HTA-1F-4 | 特定の利用者を探せる | 探す reaches person find (D-FIND-PERSON meaning); not record-search Global |
| HTA-1F-5 | 手順を見たあと今日の仕事へ戻れる | From 手順 (including fallback to D-TODAY when object missing), return to today’s work without losing place |

```text
CORR-1F HTA scope = FIELD_STAFF only
PL-HTA / AA-HTA = OUT of this gate
FS-HTA-2 full state-meaning depth may exceed CORR-1F UI (P2-1 sessionContext frozen);
  do not over-claim beyond what the real screen actually shows
```

---

## Pass recording rule

Only a Human may set:

```text
SBS-ROLE-TASK-FIRST-IA-V1
Correction-1F
Human Task Acceptance
= PASS / HUMAN CONFIRMED
```

Recommended recording conditions:

```text
1. All of HTA-1F-1..5 confirmed on real usable session @ exact HEAD 3e1eac93
2. Font/tofu classified (env-only vs Product) without blocking HTA if env-only
3. This frame updated (or a sibling Human Confirmed record added) with confirmer + date
4. Explicit statement: Human Ready / Merge GO remains NOT AUTHORIZED until a separate Human Ready decision
```

Agent / Review / CI must not auto-promote HTA to PASS.

---

## Gate sequence (fixed)

```text
Prettier-only fix          COMPLETE
exact HEAD + CI GREEN      COMPLETE @ 3e1eac93
Independent Review-2       PASS / REVIEW-CLEARED
Human Task Acceptance      ← CURRENT GATE (Human-only; this frame)
Human Ready decision       NEXT independent gate AFTER HTA PASS
Human Merge GO             AFTER Ready; still Human-only
Deploy / LIVE WRITE        NOT AUTHORIZED without explicit Human GO
```

```text
STOP = no HTA PASS claim from Agent
     = no Human Ready / Merge GO from this document
     = no Deploy / LIVE WRITE
     = no PLANNER / ADMIN_AUDIT HTA claim
```
