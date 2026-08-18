# FIELD-STAFF-NEXT-UNRECORDED-USER-1 — Human Selection

この文書は、FIELD-STAFF-MULTI-USER-UX-POLISH-1 **ACCEPTED / CLOSED**
（PR #412 MERGED）後の **次 exact-slice** 選定の Human Decision 記録である。

Decision packet:
[`decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md)

POLISH-1 の再オープンではない。Unit 7 ではない。
Implementation Start ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-3-NEXT-UNRECORDED-USER-1
Slice identity: FIELD-STAFF-NEXT-UNRECORDED-USER-1
Kind: Human Selection（next exact-slice / Option B / UX-P1-3）
Status: SELECTED / LOCKED
Human Decision: B GO — UX-P1-3 次の未記録利用者
Date: 2026-08-18
Baseline main: d154fe7d1317efcbed180c96affa23611c810c18
PR #412: MERGED / CLOSED
Acceptance HEAD: bffe65ff1f4179d64faa5fef18d151e53c294d35
Prior A recommendation: NOT A SELECTION
Agent auto-select: FORBIDDEN（this Selection is Human）

Implementation Start: NOT AUTHORIZED（separate Human GO）
Unit 7: NOT STARTED / not this slice
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Why this slice now

```text
POLISH-1 Units 1–6 は ACCEPT / PASS で閉じた。
残ギャップは Human が 1 件だけ exact-slice にする。

UX-P1-3（次の未記録利用者）は、
Unit 3 の同一利用者 next-occurrence とは別の presentation assist である。
fixture の未記録行へ進む範囲に閉じれば、
未記録バッジ・Family R KPI・LIVE WRITE を動かさない。
```

## 2. Selected unit

```text
B / UX-P1-3
FIELD-STAFF-NEXT-UNRECORDED-USER-1
次の未記録利用者へ進む presentation
```

## 3. Authorized IN（Selection scope only）

Selection が固定する範囲。コード許可ではない。

```text
IN:
  既存 DEMO_UX_USERS_FIXTURE の unrecorded 行への navigation assist
  現在の合成未記録: user-a / user-e
  session-local / presentation-only
  Unit 3 same-user next-occurrence との分離維持
  次未記録利用者が無い / フィルタ除外 / origin 欠落時の fail-closed
  将来の unit tests / a11y（Implementation Start 後）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Implementation Start（this Selection alone）
  nextUnrecordedUserAuthorized = true（flag flip は Start 後）
  listToRecordFastPathAuthorized
  liveSavedCompletionOnCardsAuthorized
  syntheticRecordedForTodayAuthorized
  unrecordedBadgeMutationAuthorized
  kpiFamilyRRecountAuthorized
  eightUserDetailCatalogAuthorized
  procedureFixtureExpansionAuthorized
  savingPauseRemovalAuthorized
  saveStateSemanticsChangeAuthorized
  UX-P1-2 / UX-P2-5 expansion / UX-P2-7 の同時選定
  Unit 7 of POLISH-1
  POLISH-1 reopen
  rewrite PARTIAL / OUT OF SCOPE as PASS / CLOSED
  LIVE WRITE / SharePoint / Graph / Entra / M365
  Deploy / App Catalog / redeploy
  production-host 4 / 6 / 18 user PASS/FAIL
  Issue close / Ready / Merge auto-progress
```

## 5. Options considered

| ID | Gap | Result |
|---|---|---|
| A | UX-P1-2 User card record completion | NOT SELECTED |
| **B** | UX-P1-3 Next unrecorded user | **SELECTED** |
| C | UX-P2-5 18-user layout expansion | NOT SELECTED |
| D | UX-P2-7 Saving pause removal | NOT SELECTED |
| E | Defer all | NOT SELECTED |

C1 / C2 は C 未選定のため切らない。

## 6. Flag boundary（unchanged until Implementation Start）

[`users-session-save-overlay.ts`](../../spfx/src/shell/users/users-session-save-overlay.ts)
の `FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE` は本選定では変更しない。

```text
nextUnrecordedUserAuthorized: false
liveSavedCompletionOnCardsAuthorized: false
syntheticRecordedForTodayAuthorized: false
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

## 7. Fixture / coverage limit（do not hide）

```text
Users list: 8 synthetic users
unrecorded badges (static): user-a / user-e
ProcedureRecord reachable: user-a only
This selection != live completion
This selection != 18-user catalog
```

## 8. Stop condition

```text
Decision-FIELD-STAFF-UX-P1-3-NEXT-UNRECORDED-USER-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO
  exact unit + base SHA d154fe7d… + allowed paths + tests + stop gate

Still NOT AUTHORIZED:
  code implementation
  remaining-flag flip
  Unit 7
  LIVE WRITE / Deploy
  A / C / D / E as selected
```

## Reference

- Packet: [`decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md)
- Predecessor closeout: [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- Simulation gaps: [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
- Next gate after Selection: Human GO for Implementation Start（separate）
