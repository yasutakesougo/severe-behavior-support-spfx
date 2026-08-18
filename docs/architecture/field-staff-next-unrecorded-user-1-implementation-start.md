# FIELD-STAFF-NEXT-UNRECORDED-USER-1 — Implementation Start

この文書は **FIELD-STAFF-NEXT-UNRECORDED-USER-1** の Implementation Start 記録である。
POLISH-1 の再オープンではない。Unit 7 ではない。LIVE WRITE GO ではない。

Selection:
[`decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: FIELD-STAFF-NEXT-UNRECORDED-USER-1
Gap: UX-P1-3 next unrecorded user
Kind: FIELD_STAFF presentation navigation assist
Status: IMPLEMENTATION START AUTHORIZED
Human Implementation Start: GO 2026-08-18
Authority: Decision-FIELD-STAFF-UX-P1-3-NEXT-UNRECORDED-USER-1
Base SHA: d154fe7d1317efcbed180c96affa23611c810c18
Selection HEAD: 8c9493d5ce39975c1ef080214066fa2842525eab
PR #413: MERGED / CLOSED（selection-only ancestor）
PR #414: MERGED / CLOSED
Implementation HEAD: 35445aa4e5dea17f578f26289672d901843e8b3a
authoritative main: 5b5496c9e31cd0c57ca12c5b0464b315e7f7f62b
Closeout SSOT: field-staff-next-unrecorded-user-1.md
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
Human Implementation Start GO authorizes this unit only.
#413 / #414 Ready / Merge were separate Human-only gates.
Closeout SSOT:
  field-staff-next-unrecorded-user-1.md
```

## Authorized IN

```text
既存 DEMO_UX_USERS_FIXTURE の unrecorded 行への navigation assist
visible order: user-a → user-e
no wrap
origin 欠落 / フィルタ除外 / 次行なし: fail-closed
session-local / presentation-only
Unit 3 same-user next-occurrence との分離
Users list CTA
list focus when next user has no detail fixture
unit tests / a11y
nextUnrecordedUserAuthorized = true
```

## Explicit OUT

```text
listToRecordFastPathAuthorized
liveSavedCompletionOnCardsAuthorized
unrecordedBadgeMutationAuthorized
kpiFamilyRRecountAuthorized
eightUserDetailCatalogAuthorized
procedureFixtureExpansionAuthorized
savingPauseRemovalAuthorized
saveStateSemanticsChangeAuthorized
UX-P1-2 / UX-P2-5 expansion / UX-P2-7
Unit 7 of POLISH-1
LIVE WRITE / SharePoint / Graph / Entra / M365
Deploy / App Catalog / redeploy
Issue close / Ready / Merge auto-progress
production-host 4 / 6 / 18 PASS/FAIL
```

## Allowed paths

```text
spfx/src/shell/users/next-unrecorded-user.ts
spfx/src/shell/users/next-unrecorded-user.test.ts
spfx/src/shell/users/users-session-save-overlay.ts
spfx/src/shell/users/UsersList.tsx
spfx/src/shell/users/UsersUx.module.scss
spfx/src/shell/users/index.ts
docs/architecture/field-staff-next-unrecorded-user-1-implementation-start.md
plus flag-expectation updates in existing unit tests
```

AppShellChrome は未変更。list-to-detail は既存 `onUserDetailRequest` を使う。
saving pause は chrome inert のまま。本 slice はポーズを外さない。

## Tests

```text
user-a → user-e; no wrap
fail-closed: missing origin / unknown origin / filtered-out next
do not mutate badges or Family R KPI
save 5-state overlay unchanged
Unit 3 same-user occurrence unchanged
remaining flags except nextUnrecordedUserAuthorized stay false
CTA copy does not claim 保存済み / 記録済み / 完了
```

## Stop gate

```text
Do not open ProcedureRecord from this CTA.
Do not enable LIVE WRITE.
Do not Deploy.
Do not close Issues.
Do not mark UX-P1-3 residual CLOSED.
Closeout SSOT: field-staff-next-unrecorded-user-1.md
Browser smoke: ENVIRONMENT LIMITATION is an inherited P2.
```
