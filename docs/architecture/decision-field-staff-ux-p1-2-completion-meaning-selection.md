# FIELD-STAFF-COMPLETION-ON-CARDS-1 — completion meaning Selection

この文書は **Decision-FIELD-STAFF-UX-P1-2-COMPLETION-MEANING-1** の
Human Decision 記録である。

Decision packet:
[`decision-field-staff-ux-p1-2-completion-meaning-packet.md`](./decision-field-staff-ux-p1-2-completion-meaning-packet.md)

Slice selection:
[`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md)

POLISH-1 の再オープンではない。Unit 7 ではない。
本文書は meaning Selection の正本である。Implementation Start 記録は
[`field-staff-completion-on-cards-1-implementation-start.md`](./field-staff-completion-on-cards-1-implementation-start.md)。
M3 を ballot に載せない。LIVE WRITE を有効化しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-2-COMPLETION-MEANING-1
Slice identity: FIELD-STAFF-COMPLETION-ON-CARDS-1
Kind: Human Selection（completion meaning / Option M2）
Status: SELECTED / LOCKED
Human Decision: M2 GO — synthetic recorded-for-today
Date: 2026-08-18
Baseline main: 68fcb7fdb845b006be51bb0c3542240445bbcdd1
PR #417: MERGED / CLOSED
Packet HEAD: 8b16ccb8217cd91acfb19de7f014af859cf9576a
Agent auto-select: FORBIDDEN（this Selection is Human）

Implementation Start: AUTHORIZED（Human GO 2026-08-18; M2 only）
Start record: field-staff-completion-on-cards-1-implementation-start.md
flag flip: syntheticRecordedForTodayAuthorized true only
syntheticRecordedForTodayAuthorized: true（this Start）
Unit 7: NOT STARTED / not this slice
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
UX-P1-2 residual classification overall: NOT CLOSED
UX-P1-3 residual classification overall: NOT CLOSED
POLISH-1 historical UX-P1-2: OUT OF SCOPE（unchanged）
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Why this meaning now

```text
FIELD-STAFF-COMPLETION-ON-CARDS-1 は SELECTED / LOCKED である。
カード完了のソースを LIVE WRITE なしで 1 件切る。

M2 は DEMO_UX_USERS_FIXTURE 上の
「本日記録した」presentation をソースにする。
session saved overlay（M1）でも live persist（M3）でもない。
未記録バッジ / Family R KPI / 5-state 意味は切らない。
```

## 2. Selected meaning

```text
M2 / synthetic recorded-for-today
Source: DEMO_UX_USERS_FIXTURE projection
Authorized flag after Implementation Start:
  syntheticRecordedForTodayAuthorized = true
```

## 3. Authorized IN（Selection scope only）

Selection が固定する範囲。コード許可ではない。flag flip ではない。

```text
IN:
  fixture 上の「本日記録した」カード presentation を完了ソースにする
  実データ完了には見えない fail-closed
  session-local / presentation-only
  LIVE WRITE を前提にしない
  Unit 2 overlay（saved を隠す）との分離を維持する
  unit tests / a11y（Implementation Start 後）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Ready / Merge auto-progress
  liveSavedCompletionOnCardsAuthorized = true
  unrecordedBadgeMutationAuthorized
  kpiFamilyRRecountAuthorized
  saveStateSemanticsChangeAuthorized
  persistence-success copy: 保存済み / 記録済み / 完了
  M1 session saved overlay
  M3 live persisted completion / LIVE WRITE
  M4 defer
  Unit 7
  C / D / E
  rewrite PARTIAL / OUT OF SCOPE as PASS / CLOSED
  mark UX-P1-2 or UX-P1-3 residual CLOSED
  SharePoint / Graph / Entra / M365
  Deploy / App Catalog / redeploy
  Issue close / Ready / Merge auto-progress
```

## 5. Options considered

| ID | Meaning | Result |
|---|---|---|
| M1 | session `saved` 表示 | NOT SELECTED |
| **M2** | synthetic recorded-for-today | **SELECTED** |
| M3 | live persisted completion | NOT ON THIS BALLOT |
| M4 | defer meaning | NOT SELECTED |

## 6. Flag boundary

[`users-session-save-overlay.ts`](../../spfx/src/shell/users/users-session-save-overlay.ts)
の選定時点（main `68fcb7f…`）では変更しない。
Implementation Start はこの flag のみ true にする。

Selection-time main `68fcb7f…`:

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
This meaning != live completion
This meaning != session saved overlay
This meaning != badge / KPI mutation
Coverage residual:
  セッション結果を反映しない限り
  静的 user-a / user-e 未記録は残る
```

## 8. Stop condition

```text
Decision-FIELD-STAFF-UX-P1-2-COMPLETION-MEANING-1
= SELECTED / LOCKED / M2

Implementation Start: AUTHORIZED（M2 only）

Still NOT AUTHORIZED:
  remaining-flag flips other than syntheticRecordedForTodayAuthorized
  unrecordedBadgeMutation / kpiFamilyRRecount
  Unit 7
  LIVE WRITE / Deploy
  M1 / M3 / M4 as selected
  rewrite residual CLOSED
  Ready / Merge auto-progress
```

## 9. Next gate

```text
Next Human-only gates: Ready, then Merge
Bound to: M2 synthetic recorded-for-today only
This meaning Selection ≠ Ready
This meaning Selection ≠ Merge
Start record:
  field-staff-completion-on-cards-1-implementation-start.md
```

## Reference

- Packet: [`decision-field-staff-ux-p1-2-completion-meaning-packet.md`](./decision-field-staff-ux-p1-2-completion-meaning-packet.md)
- Slice selection: [`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md)
- Implementation Start: [`field-staff-completion-on-cards-1-implementation-start.md`](./field-staff-completion-on-cards-1-implementation-start.md)
- POLISH-1: [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- Simulation gaps: [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
