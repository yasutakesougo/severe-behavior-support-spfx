# FIELD-STAFF-COMPLETION-ON-CARDS-1 — Human Selection

この文書は、FIELD-STAFF-NEXT-UNRECORDED-USER-1 **IMPLEMENTED / MERGED**
（PR #414 / #415 MERGED）後の **次 remaining-gap exact-slice** 選定の
Human Decision 記録である。

Decision packet:
[`decision-field-staff-ux-p1-2-completion-on-cards-selection-packet.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection-packet.md)

POLISH-1 の再オープンではない。Unit 7 ではない。
本文書は slice Selection の正本である。Implementation Start 記録は
[`field-staff-completion-on-cards-1-implementation-start.md`](./field-staff-completion-on-cards-1-implementation-start.md)。
完了意味は Human M2 GO で SELECTED / LOCKED である。

先行 B 投票
（[`decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md)）
は歴史的 SELECTED / LOCKED のまま残す。本記録はその投票を A に書き換えない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-2-COMPLETION-ON-CARDS-1
Slice identity: FIELD-STAFF-COMPLETION-ON-CARDS-1
Kind: Human Selection（remaining-gap exact-slice / Option A / UX-P1-2）
Status: SELECTED / LOCKED
Human Decision: A GO — UX-P1-2 カード完了状態
Date: 2026-08-18
Baseline main: 73ab70e2f292ca584699b2310ffa376c4d82cd27
PR #414: MERGED / CLOSED
PR #415: MERGED / CLOSED
Closeout HEAD: c993f5da117e44cf12b530dc5572ca71a6aaac90
Predecessor B ballot: HISTORICAL / CONSUMED
Agent auto-select: FORBIDDEN（this Selection is Human）

Implementation Start: AUTHORIZED（Human GO 2026-08-18; M2 only）
Start record: field-staff-completion-on-cards-1-implementation-start.md
Completion-meaning Decision: SELECTED / LOCKED / M2
Meaning packet:
  decision-field-staff-ux-p1-2-completion-meaning-packet.md
Meaning packet status: CONSUMED
Meaning selection SSOT:
  decision-field-staff-ux-p1-2-completion-meaning-selection.md
Unit 7: NOT STARTED / not this slice
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
UX-P1-3 residual classification overall: NOT CLOSED
POLISH-1 historical UX-P1-2: OUT OF SCOPE（unchanged）
UX-P1-2 residual classification overall: NOT CLOSED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Why this slice now

```text
POLISH-1 Units 1–6 は ACCEPT / PASS で閉じた。
FIELD-STAFF-NEXT-UNRECORDED-USER-1 は IMPLEMENTED / MERGED である。
残ギャップは Human が 1 件だけ exact-slice にする。

UX-P1-2（カード完了状態）は、
Unit 2 の session save-state overlay とは別である。
Unit 2 は saved を overlay から隠す（保存済み / 記録済みを出さない）。
本 slice は「カードが記録完了を反映しない」観測への successor である。
LIVE WRITE なしで完了の意味を定義する必要があり、
その意味 Decision は本 Selection では Accepted にしない。
```

## 2. Selected unit

```text
A / UX-P1-2
FIELD-STAFF-COMPLETION-ON-CARDS-1
Users カードへ記録完了状態を載せる presentation
```

## 3. Authorized IN（Selection scope only）

Selection が固定する範囲。コード許可ではない。flag flip ではない。

```text
IN:
  既存 DEMO_UX_USERS_FIXTURE（8 synthetic users）上の
  Users カード完了状態の presentation 範囲を次 exact-slice にする
  session-local / presentation-only
  LIVE WRITE を前提にしない
  Unit 2 overlay（saved を隠す）との分離を維持する
  完了意味の定義は Implementation Start 前の別 Human GO（SELECTED / LOCKED / M2）
  unit tests / a11y（Implementation Start 後）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Ready / Merge auto-progress
  completion-meaning Decision reopen
  liveSavedCompletionOnCardsAuthorized = true
  unrecordedBadgeMutationAuthorized = true
  kpiFamilyRRecountAuthorized = true
  saveStateSemanticsChangeAuthorized
  nextUnrecordedUserAuthorized の再定義
  listToRecordFastPathAuthorized
  eightUserDetailCatalogAuthorized
  procedureFixtureExpansionAuthorized
  savingPauseRemovalAuthorized
  UX-P2-5 expansion / UX-P2-7 の同時選定
  Unit 7 of POLISH-1
  POLISH-1 reopen
  rewrite PARTIAL / OUT OF SCOPE as PASS / CLOSED
  mark UX-P1-2 or UX-P1-3 residual CLOSED
  LIVE WRITE / SharePoint / Graph / Entra / M365
  Deploy / App Catalog / redeploy
  production-host 4 / 6 / 18 user PASS/FAIL
  Issue close / Ready / Merge auto-progress
```

本 Selection は次の意味を切らない（meaning Selection が M2 を切った）:

```text
NOT PICKED HERE:
  live saved completion vs synthetic recorded-for-today
    vs session saved overlay のどれを「完了」とみなすか
    → meaning Selection が M2 を SELECTED にした
  unrecorded バッジを mutation するか
  Family R KPI を recount するか
  保存済み / 記録済み / 完了 のどの文言を使うか（persistence 主張は禁止）
```

## 5. Options considered

| ID | Gap | Result |
|---|---|---|
| **A** | UX-P1-2 User card record completion | **SELECTED** |
| B | UX-P1-3 Next unrecorded user | HISTORICAL — prior ballot SELECTED / now IMPLEMENTED / MERGED |
| C | UX-P2-5 18-user layout expansion | NOT SELECTED |
| D | UX-P2-7 Saving pause removal | NOT SELECTED |
| E | Defer all | NOT SELECTED |

C1 / C2 は C 未選定のため切らない。

## 6. Flag boundary

[`users-session-save-overlay.ts`](../../spfx/src/shell/users/users-session-save-overlay.ts)
の `FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE` は選定時点では変更しない。
Implementation Start は `syntheticRecordedForTodayAuthorized` のみ true にする。

Selection-time main `73ab70e…`:

```text
nextUnrecordedUserAuthorized: true（already merged; not this slice）
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

After this Implementation Start:

```text
syntheticRecordedForTodayAuthorized: true
all other remaining flags above: unchanged
```

## 7. Fixture / coverage limit（do not hide）

```text
Users list: 8 synthetic users
unrecorded badges (static): user-a / user-e
ProcedureRecord reachable: user-a only
Unit 2: session overlay hides saved
This selection != live completion
This selection != LIVE WRITE success
This selection != 18-user catalog
This selection != badge / KPI mutation
```

## 8. Stop condition

```text
Decision-FIELD-STAFF-UX-P1-2-COMPLETION-ON-CARDS-1
= SELECTED / LOCKED

Implementation Start: AUTHORIZED（M2 only）
Completion-meaning Decision: SELECTED / LOCKED / M2

Still NOT AUTHORIZED:
  remaining-flag flips other than syntheticRecordedForTodayAuthorized
  unrecordedBadgeMutation / kpiFamilyRRecount
  Unit 7
  LIVE WRITE / Deploy
  C / D / E as selected
  rewrite residual CLOSED
  Ready / Merge auto-progress
```

## 9. Next gate

```text
Next Human-only gates: Ready, then Merge
Bound to: M2 synthetic recorded-for-today
Meaning selection SSOT:
  decision-field-staff-ux-p1-2-completion-meaning-selection.md
Start record:
  field-staff-completion-on-cards-1-implementation-start.md
This Selection ≠ Ready
This Selection ≠ Merge
```

## Reference

- Packet: [`decision-field-staff-ux-p1-2-completion-on-cards-selection-packet.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection-packet.md)
- Completion-meaning packet: [`decision-field-staff-ux-p1-2-completion-meaning-packet.md`](./decision-field-staff-ux-p1-2-completion-meaning-packet.md)
- Completion-meaning selection: [`decision-field-staff-ux-p1-2-completion-meaning-selection.md`](./decision-field-staff-ux-p1-2-completion-meaning-selection.md)
- Implementation Start: [`field-staff-completion-on-cards-1-implementation-start.md`](./field-staff-completion-on-cards-1-implementation-start.md)
- Predecessor B selection: [`decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md)
- Predecessor closeout: [`field-staff-next-unrecorded-user-1.md`](./field-staff-next-unrecorded-user-1.md)
- POLISH-1: [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- Simulation gaps: [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
