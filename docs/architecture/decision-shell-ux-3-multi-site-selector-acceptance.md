# SHELL-UX-3 — Display-only Multi-Site Selector — Human Acceptance（SELECT）

この文書は、**C-B / SHELL-UX-3 — Display-only Multi-Site Selector** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-shell-ux-3-multi-site-selector-selection.md`](./decision-shell-ux-3-multi-site-selector-selection.md)

Depends on（再 Decision しない）:
[`issue-28-close-criteria-assessment.md`](./issue-28-close-criteria-assessment.md)（PR #239）
[`shell-ux-2-implementation-start.md`](./shell-ux-2-implementation-start.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-3-MULTI-SITE-SELECTOR-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT C-B / SHELL-UX-3
Human Acceptance date: 2026-08-11
Issue: #28
Candidate: C-B
PR: #240（Selection / Acceptance only）
Baseline tip: 61a212a409b4134c802435226998753d1903ee1f

Selected:
  Display-only multi-site selector + site-unselected stop chrome

Implementation Start: GO（separate；shell-ux-3-implementation-start.md）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT C-B / SHELL-UX-3
Decision-SHELL-UX-3-MULTI-SITE-SELECTOR-1: Accepted / LOCKED

Meaning:
  authorize the next #28 shell UX slice boundary now
  keep Implementation Start as a later separate Human GO
```

## Boundary

```text
SELECT C-B ≠ Implementation Start
SELECT C-B ≠ #28 Close
SELECT C-B ≠ #21 membership / authorization truth
SELECT C-B ≠ #22 adapter GO
SELECT C-B ≠ Entra / SharePoint membership lookup
SELECT C-B ≠ live I/O / REST / binder wiring
未選択 = independent presentation state（must drive stop chrome）
SITE-ISG / SITE-HOM = display choices only
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Selection merge = 205954111bf37c19e178bb2042864b86c176c270（PR #240）
Implementation Start = GO（separate；shell-ux-3-implementation-start.md）
#28 Close = NOT AUTHORIZED
other residual candidates C-A / C-C〜C-H = NOT SELECTED
```

## Next

```text
1. Implementation Start GO recorded（shell-ux-3-implementation-start.md）
2. deliver code + tests + browser smoke under exact IN/OUT
3. #28 Close remains later / separate
4. #240 merge ≠ Implementation Start（already separated）
```

## Reference

- Selection: `decision-shell-ux-3-multi-site-selector-selection.md`
- Prior assessment FAIL: `issue-28-close-criteria-assessment.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
