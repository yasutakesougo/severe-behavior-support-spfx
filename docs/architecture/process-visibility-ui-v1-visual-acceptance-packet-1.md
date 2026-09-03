# PROCESS-VISIBILITY-UI-V1 — Visual Acceptance Packet 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: Human Visual Acceptance packet
prototype: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.md
correction: docs/architecture/process-visibility-ui-v1-presentation-prototype-correction-1.md
html: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
persona: docs/architecture/process-visibility-ui-v1-5-persona-simulation-1.md
date: 2026-09-03
basis: Prototype Correction-1
Human Visual Acceptance: NOT RECEIVED
Implementation Start: NOT AUTHORIZED
mutation: 0
```

## 1. Ask（Human）

Confirm Desktop + **real** Mobile（390 viewport）prototype as the visual IA for PLANNER V1.

Accept if:

```text
1. 支援サイクル ①〜⑥が情報の所属先として読める（Desktop + Mobile 本文とも全工程）
2. 進捗 Stepper / 完了状態に見えない（選択 = ページ内位置のみ）
3. ③記録と④モニタリングが別工程に見える
4. ⑤見直しと⑥次版準備が分離している
5. #576 lifecycle 文言が⑥に残っている
6. 履歴・詳細が下位階層
7. FIELD_STAFF / ADMIN_AUDIT を変えない意図が明確
8. 390×844: horizontal overflow = 0 / Mobile structure only / nav = 2×3 / truncation = 0
```

Reject / HOLD if any of 1–8 fail.

## 2. Correction-1 summary

```text
P1-1 Mobile ②⑤ missing = CLOSED in Correction-1
P1-2 390 Desktop overflow = CLOSED in Correction-1（responsive single shell）
P2-1 Stepper risk = MITIGATED（aria-current + hint）
5 Persona prior = PASS WITH MINOR FRICTION（SIMULATION ONLY; re-check optional）
```

## 3. Status

```text
Human Visual Acceptance = NOT RECEIVED
Agent does not grant Visual Acceptance
Definition Lock = ELIGIBLE（separate Human gate; not blocked by Mobile correction）
Implementation Start remains blocked without:
  Visual Acceptance
  + Definition Lock
  + #576 Merged
  + Implementation Start GO
```
