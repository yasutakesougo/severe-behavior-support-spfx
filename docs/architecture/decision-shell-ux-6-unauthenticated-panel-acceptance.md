# SHELL-UX-6 — Unauthenticated Fail-Closed Presentation Panel — Human Acceptance（SELECT）

この文書は、**C-A / SHELL-UX-6 — Unauthenticated Fail-Closed Presentation Panel** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-shell-ux-6-unauthenticated-panel-selection.md`](./decision-shell-ux-6-unauthenticated-panel-selection.md)

Depends on（再 Decision しない）:
[`issue-28-close-criteria-reassessment-3.md`](./issue-28-close-criteria-reassessment-3.md)（PR #248）
[`shell-ux-5-implementation-start.md`](./shell-ux-5-implementation-start.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-6-UNAUTHENTICATED-PANEL-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT C-A / SHELL-UX-6
Human Acceptance date: 2026-08-11
Issue: #28
Candidate: C-A
PR: #249（Selection / Acceptance only）
Baseline tip: 8fb0ef22c2ba5e5be378410020597657d2af6fca

Selected:
  Unauthenticated fail-closed presentation panel

Implementation Start: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT C-A / SHELL-UX-6
Decision-SHELL-UX-6-UNAUTHENTICATED-PANEL-1: Accepted / LOCKED

Meaning:
  authorize the next #28 shell UX slice boundary now
  keep Implementation Start as a later separate Human GO
```

## Boundary

```text
SELECT C-A ≠ Implementation Start
SELECT C-A ≠ #28 Close
SELECT C-A ≠ #21 auth judgment / Entra / token / role resolution
SELECT C-A ≠ redirect / sign-in orchestration
SELECT C-A ≠ REST / binder / live I/O
未認証 = independent presentation state（props / fixture）
  must not display 個人情報 or 業務データ
fail-closed copy = presentation only
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Implementation Start = NOT AUTHORIZED / HOLD
code mutation for SHELL-UX-6 = 0
other residual candidates C-F′ / C-G / C-H = NOT SELECTED
C-B / C-C = CONSUMED（SHELL-UX-3）
C-D = CONSUMED（SHELL-UX-4）
C-E = CONSUMED（SHELL-UX-5）
```

## Next

```text
1. stop（Selection only）
2. separate Human GO for Implementation Start（exact IN/OUT）
3. only after Implementation Start GO: code + tests + browser smoke
4. #28 Close remains later / separate
```

## Reference

- Selection: `decision-shell-ux-6-unauthenticated-panel-selection.md`
- Prior reassessment FAIL: `issue-28-close-criteria-reassessment-3.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
