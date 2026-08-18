# FIELD-STAFF-COMPLETION-ON-CARDS-1 — Implementation Start

この文書は **FIELD-STAFF-COMPLETION-ON-CARDS-1** の Implementation Start 記録である。
POLISH-1 の再オープンではない。Unit 7 ではない。LIVE WRITE GO ではない。
UX-P1-2 residual CLOSED ではない。M2 presentation のみを拘束する。

Meaning selection:
[`decision-field-staff-ux-p1-2-completion-meaning-selection.md`](./decision-field-staff-ux-p1-2-completion-meaning-selection.md)

Slice selection:
[`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-COMPLETION-ON-CARDS-1
Gap: UX-P1-2 card completion
Kind: FIELD_STAFF presentation-only M2 synthetic recorded-for-today
Status: IMPLEMENTATION START AUTHORIZED
Human Implementation Start: GO 2026-08-18
Authority: Decision-FIELD-STAFF-UX-P1-2-COMPLETION-MEANING-1 / M2
Base SHA: 97aba7a031fa7b38395dd719bb87923de65cfaed
Meaning selection: SELECTED / LOCKED / M2
UX-P1-2 residual classification overall: NOT CLOSED
UX-P1-3 residual classification overall: NOT CLOSED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Authority

```text
Selection SELECTED / LOCKED ≠ Implementation Start
Human Implementation Start GO authorizes M2 only.
Ready / Merge remain separate Human-only GO.
This Start ≠ UX-P1-2 residual CLOSED
This Start ≠ Full Application Acceptance
This Start ≠ LIVE WRITE GO
This Start ≠ Deploy GO
```

## Authorized IN

```text
M2 synthetic recorded-for-today presentation
Source: DEMO_UX_USERS_FIXTURE projection only
user-a / user-e: static unrecorded; M2 = false
other current fixture rows: M2 = true
synthetic recorded-for-today copy with 合成 disclosure
session overlay remains a separate channel
unit tests / a11y name
syntheticRecordedForTodayAuthorized = true
```

## Explicit OUT

```text
Unit 7
M1 / M3 / M4 implementation
LIVE WRITE / SharePoint / Graph / Entra / M365
Deploy / App Catalog / redeploy
unrecordedBadgeMutationAuthorized
kpiFamilyRRecountAuthorized
saveStateSemanticsChangeAuthorized
savingPauseRemovalAuthorized
liveSavedCompletionOnCardsAuthorized
listToRecordFastPathAuthorized
eightUserDetailCatalogAuthorized
procedureFixtureExpansionAuthorized
session saved → M2 conversion
dynamic M2 update after save
persistence-success copy: 保存済み / 記録済み / 完了
UX-P1-2 residual CLOSED
UX-P1-3 residual CLOSED
Issue close / Ready / Merge auto-progress
```

## Flag boundary

Authorized flip (this Start only):

```text
FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE
  syntheticRecordedForTodayAuthorized: false → true
```

Remain unchanged:

```text
nextUnrecordedUserAuthorized: true
liveSavedCompletionOnCardsAuthorized: false
unrecordedBadgeMutationAuthorized: false
kpiFamilyRRecountAuthorized: false
eightUserDetailCatalogAuthorized: false
procedureFixtureExpansionAuthorized: false
listToRecordFastPathAuthorized: false
saveStateSemanticsChangeAuthorized: false
savingPauseRemovalAuthorized: false
liveTenantIoAuthorized: false
sharePointWriteAuthorized: false
deployAuthorized: false
```

`FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE.syntheticRecordedForTodayAuthorized`
stays false. That slice is not this Start.

## Allowed paths

```text
spfx/src/shell/users/UsersList.tsx
spfx/src/shell/users/UsersUx.module.scss
spfx/src/shell/users/users-session-save-overlay.ts
spfx/src/shell/users/users-session-save-overlay.test.ts
spfx/src/shell/users/synthetic-recorded-for-today.ts
spfx/src/shell/users/synthetic-recorded-for-today.test.ts
spfx/src/shell/users/index.ts
docs/architecture/field-staff-completion-on-cards-1-implementation-start.md
docs/architecture/decision-field-staff-ux-p1-2-completion-meaning-selection.md
docs/architecture/decision-field-staff-ux-p1-2-completion-on-cards-selection.md
plus flag-expectation updates in existing unit tests under spfx/src/shell/users/
```

## Tests

```text
syntheticRecordedForTodayAuthorized = true
user-a = false
user-e = false
recorded fixture row (user-b and peers) = true
unrecorded badges unchanged
Family R KPI unchanged (3 / 2 / 3)
session save-state does not affect M2
copy uses 本日記録した + 合成データ
copy avoids 保存済み / 記録済み / 完了
accessible name present
remaining flags except this flip stay unchanged
```

## Stop gate

```text
Do not treat M2 as live completion.
Do not enable LIVE WRITE.
Do not Deploy.
Do not close Issues.
Do not mark UX-P1-2 residual CLOSED.
Browser smoke: ENVIRONMENT LIMITATION is recorded if not executed.
```
