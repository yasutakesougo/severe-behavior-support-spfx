# SHELL-UX-7 — Safe Navigation Destination Placeholders — Human Acceptance（SELECT）

この文書は、**SHELL-UX-7 — Safe Navigation Destination Placeholders** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-shell-ux-7-navigation-destination-placeholders-selection.md`](./decision-shell-ux-7-navigation-destination-placeholders-selection.md)

Depends on（再 Decision しない）:
[`decision-shell-ux-6-unauthenticated-panel-acceptance.md`](./decision-shell-ux-6-unauthenticated-panel-acceptance.md)
[`shell-ux-6-implementation-start.md`](./shell-ux-6-implementation-start.md)
既存 `SHELL_PRIMARY_NAV_ITEMS`（`overview` / `users` / `records`）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-7-NAVIGATION-DESTINATION-PLACEHOLDERS-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT SHELL-UX-7
Human Acceptance date: 2026-08-12
Issue: #28
PR: #290（Selection / Acceptance / Independence Review only）
Baseline tip: bd5a6ae214c18137d095310106857fe298a448ef

Selected:
  Safe Navigation Destination Placeholders
  vocabulary LOCKED to existing primary navigation only

Destination vocabulary（LOCKED）:
  overview → 概要
  users    → 利用者
  records  → 記録

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT SHELL-UX-7
Decision-SHELL-UX-7-NAVIGATION-DESTINATION-PLACEHOLDERS-1: Accepted / LOCKED

Meaning:
  authorize the next #28 shell UX slice boundary now
  lock destination vocabulary to existing SHELL_PRIMARY_NAV_ITEMS
  reject Packet draft labels Dashboard / Plans / Administration
  keep Implementation Start as a later separate Human GO
```

## Accepted Scope

```text
IN:
  presentation-only
  existing primary navigation vocabulary only
  selected destination state
  destination heading
  未接続であることの明示
  current site / demo state の維持
  focus management / accessibility
  fixture tests / browser smoke
```

## Boundary

```text
SELECT SHELL-UX-7 ≠ Implementation Start
SELECT SHELL-UX-7 ≠ #28 Close
SELECT SHELL-UX-7 ≠ Plans / Administration primary-nav expansion
SELECT SHELL-UX-7 ≠ #70 / #71 future contract 確定
SELECT SHELL-UX-7 ≠ #68〜#71 business UI implementation
SELECT SHELL-UX-7 ≠ #21 auth judgment / Entra / token / role resolution
SELECT SHELL-UX-7 ≠ #22 adapter / REST / binder / live I/O
SELECT SHELL-UX-7 ≠ SharePoint / M365 / Entra mutation / Deploy

未接続 destination = presentation-only placeholder
  must not appear usable as live business UI
current site / demo indicators = must remain visible
selected destination = visual + accessibility indication required
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Selection docs PR = #290（draft；Ready / Merge = HUMAN-ONLY）
Independence Review = PASS（recorded；≠ Implementation Start）
Implementation Start = NOT AUTHORIZED
#28 = OPEN / KEEP OPEN
Issue #28 SoT tip for this Decision = bd5a6ae214c18137d095310106857fe298a448ef
Packet draft Dashboard / Plans / Administration = NOT ADOPTED
```

## Next

```text
1. Independence Review（docs-only；this Decision materials）
2. await separate Human Implementation Start Decision
3. only after Implementation Start GO: code + tests + browser smoke
4. #28 Close remains later / separate
5. Selection / Acceptance merge ≠ Implementation Start
```

## Reference

- Selection: `decision-shell-ux-7-navigation-destination-placeholders-selection.md`
- Independence Review: `decision-shell-ux-7-navigation-destination-placeholders-independent-review.md`
- Vocabulary source: `spfx/src/shell/ux/primary-navigation.ts`
- Prior: `decision-shell-ux-6-unauthenticated-panel-acceptance.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
