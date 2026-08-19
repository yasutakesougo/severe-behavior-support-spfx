# FIELD-STAFF-PHASE8-ROSTER-CONTEXT-PRESERVING-DISCLOSURE-1

```text
Parent: #392
Owner: #448
Baseline main: 11494b95f37e49388c531337e0dcdf440eb032ad
Mode: tablet presentation / synthetic evidence
Implementation Start: Human GO received
Fresh Review: NEXT GATE / NOT RUN
LIVE WRITE / SharePoint / M365 / Entra / Deploy: NOT AUTHORIZED
```

## Delivered

- Secondary plan and last-record metadata is collapsed on tablet rows.
- Disclosure state is held in a userId-keyed session-local map.
- `aria-expanded` and `aria-controls` identify each user's metadata region.
- Person label, status, attention, and detail action remain available in the row.
- Desktop keeps the disclosure control hidden and metadata visible.
- Existing filter, detail-return, focus restore, draft isolation, and save-state
  semantics are unchanged.

## Verification

```text
SPFx Heft test --clean:
  44 suites
  306 passed
  0 failed

Focused browser smoke:
  FIELD-STAFF-PHASE8-ROSTER-CONTEXT-PRESERVING-DISCLOSURE-1
  2 / 2 PASS
  tablet 768 x 1024: PASS
  desktop 1440 x 900 unchanged: PASS
  keyboard/focus: PASS
  page errors: 0
  horizontal overflow: false
  SharePoint / Graph requests: none
```

Measured interaction burden:

```text
Previous 18-user evidence: 4276px document scroll height
Collapsed disclosure: 3527px document scroll height
Reduction: 749px / approximately 17.5%
Expanded one row: 3565px
```

Context assertions:

- 18 unique user IDs and labels remain present.
- 18 disclosure controls and 18 metadata regions are rendered.
- Keyboard focus reaches the disclosure control visibly.
- Enter expands the matching `user-a` region.
- `aria-controls` points to `users-roster-secondary-user-a`.
- Aさん detail context remains Aさん.
- Filter returns 7 rows and restore returns to 18 rows.
- Desktop disclosure control is `display: none`; metadata remains visible.

## Boundary

```text
domain / schema / DTO: unchanged
save 5-state: unchanged
correction / cancellation / ABC: unchanged
LIVE WRITE: none
Deploy: none
```

```text
P0: 0
P1: 0
P2: 0 for this slice
UI correction: delivered
CURRENT ACTION: STOP at Fresh Review gate
```
