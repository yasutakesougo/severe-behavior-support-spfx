# SHELL-UX-5 — Error-code + correlationId User-Facing Display — Human Acceptance（SELECT）

この文書は、**C-E / SHELL-UX-5 — Error-code + correlationId User-Facing Display** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-shell-ux-5-error-code-correlation-selection.md`](./decision-shell-ux-5-error-code-correlation-selection.md)

Depends on（再 Decision しない）:
[`shell-ux-4-implementation-start.md`](./shell-ux-4-implementation-start.md)
[`decision-shell-ux-4-partial-retrieval-acceptance.md`](./decision-shell-ux-4-partial-retrieval-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-5-ERROR-CODE-CORRELATION-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT C-E / SHELL-UX-5
Human Acceptance date: 2026-08-11
Issue: #28
Candidate: C-E
PR: （Selection / Acceptance only；number at create）
Baseline tip: cc37cf0d7b71f9f5a8db57720e93f88a62050cad

Selected:
  Error-code + correlationId user-facing display
  （copy-friendly inquiry presentation）

Implementation Start: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT C-E / SHELL-UX-5
Decision-SHELL-UX-5-ERROR-CODE-CORRELATION-1: Accepted / LOCKED

Meaning:
  authorize the next #28 shell UX slice boundary now
  keep Implementation Start as a later separate Human GO
```

## Boundary

```text
SELECT C-E ≠ Implementation Start
SELECT C-E ≠ #28 Close
SELECT C-E ≠ #22 adapter GO / error-code generation / failure classification
SELECT C-E ≠ #21 authorization truth
SELECT C-E ≠ REST / binder / live I/O / retry / telemetry backend
error code + correlationId = presentation props only
  must not invent generation or classification semantics
問い合わせ情報 = copy-friendly display（presentation only）
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Implementation Start = NOT AUTHORIZED / HOLD
code mutation for SHELL-UX-5 = 0
other residual candidates C-A / C-F′ / C-G / C-H = NOT SELECTED
C-B / C-C = CONSUMED（SHELL-UX-3）
C-D = CONSUMED（SHELL-UX-4）
```

## Next

```text
1. stop（Selection only）
2. separate Human GO for Implementation Start（exact IN/OUT）
3. only after Implementation Start GO: code + tests + browser smoke
4. #28 Close remains later / separate
```

## Reference

- Selection: `decision-shell-ux-5-error-code-correlation-selection.md`
- Prior: `shell-ux-4-implementation-start.md`, `shell-ux-4-browser-smoke.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
