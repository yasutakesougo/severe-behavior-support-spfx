# SHELL-UX-4 — Partial-Retrieval Presentation Boundary — Human Acceptance（SELECT）

この文書は、**C-D / SHELL-UX-4 — Partial-Retrieval Presentation Boundary** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-shell-ux-4-partial-retrieval-selection.md`](./decision-shell-ux-4-partial-retrieval-selection.md)

Depends on（再 Decision しない）:
[`issue-28-close-criteria-reassessment.md`](./issue-28-close-criteria-reassessment.md)（PR #242）
[`shell-ux-3-implementation-start.md`](./shell-ux-3-implementation-start.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-4-PARTIAL-RETRIEVAL-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT C-D / SHELL-UX-4
Human Acceptance date: 2026-08-11
Issue: #28
Candidate: C-D
Baseline tip: be2af7c22ceb3b28a6631196d69d3b5ba29214c7

Selected:
  Partial-retrieval presentation boundary

Implementation Start: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT C-D / SHELL-UX-4
Decision-SHELL-UX-4-PARTIAL-RETRIEVAL-1: Accepted / LOCKED

Meaning:
  authorize the next #28 shell UX slice boundary now
  keep Implementation Start as a later separate Human GO
```

## Boundary

```text
SELECT C-D ≠ Implementation Start
SELECT C-D ≠ #28 Close
SELECT C-D ≠ #22 adapter GO / 実取得 / 成否判定 / 件数集計
SELECT C-D ≠ #21 authorization truth
SELECT C-D ≠ REST / binder / live I/O / retry
一部取得失敗 = independent presentation state
  must not be collapsed into 全件正常 or 全件取得失敗
正常取得分と失敗分 = visually separated（presentation only）
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Implementation Start = NOT AUTHORIZED / HOLD
code mutation for SHELL-UX-4 = 0
other residual candidates C-A / C-E / C-F′ / C-G / C-H = NOT SELECTED
C-B / C-C = CONSUMED（SHELL-UX-3）
```

## Next

```text
1. stop（Selection only）
2. separate Human GO for Implementation Start（exact IN/OUT）
3. only after Implementation Start GO: code + tests + browser smoke
4. #28 Close remains later / separate
```

## Reference

- Selection: `decision-shell-ux-4-partial-retrieval-selection.md`
- Prior reassessment FAIL: `issue-28-close-criteria-reassessment.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
