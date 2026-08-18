# Decision Packet — FIELD-STAFF UX-P1-2 completion meaning

この文書は **FIELD-STAFF-COMPLETION-ON-CARDS-1**（SELECTED / LOCKED）の
**完了意味** を切るための Human Decision Packet である。

Slice selection:
[`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md)

POLISH-1 の再 Acceptance ではない。
Unit 7 開始ではない。
Implementation Start ではない。
flag flip ではない。
Agent が M1 / M2 / M4 を自動選定しない。
M3（live persisted completion）は本 ballot に載せない。
Human が M2 を選んだあとも、本 packet は歴史的 ballot として残す。

判断単位は 1 件だけである:

> LIVE WRITE なしで、Users カードの「記録完了」は何をソースにするか。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-2-COMPLETION-MEANING-1
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option M2 — synthetic recorded-for-today）
Slice identity: FIELD-STAFF-COMPLETION-ON-CARDS-1
Depends on:
  FIELD-STAFF-COMPLETION-ON-CARDS-1 SELECTED / LOCKED
  PR #416 MERGED
  PR #417 MERGED
  authoritative main: 68fcb7fdb845b006be51bb0c3542240445bbcdd1
Human meaning Decision: SELECTED / M2
Selection record:
  decision-field-staff-ux-p1-2-completion-meaning-selection.md
Implementation Start: NOT AUTHORIZED
flag flip: NOT AUTHORIZED
Unit 7: NOT STARTED
LIVE WRITE: HOLD
UX-P1-2 residual classification overall: NOT CLOSED
UX-P1-3 residual classification overall: NOT CLOSED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-field-staff-ux-p1-2-completion-meaning-selection.md`](./decision-field-staff-ux-p1-2-completion-meaning-selection.md)
- [`decision-field-staff-ux-p1-2-completion-on-cards-selection.md`](./decision-field-staff-ux-p1-2-completion-on-cards-selection.md)
- [`field-staff-next-unrecorded-user-1.md`](./field-staff-next-unrecorded-user-1.md)
- [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)

## 1. Current locked state

```text
FIELD-STAFF-COMPLETION-ON-CARDS-1: SELECTED / LOCKED
Completion-meaning Decision: SELECTED / M2
Implementation Start: NOT AUTHORIZED
Unit 2 overlay: saved hides; 保存済み / 記録済み / 完了 は visible overlay 禁止
unrecorded badges (static): user-a / user-e
ProcedureRecord reachable: user-a only
Family R KPI: static correspondence note
LIVE WRITE: HOLD
Production-host save under HOLD: 未保存 → 保存中 → 保存失敗
```

問い:

> LIVE WRITE なしで、Users カードの「記録完了」は
> 何をソースにするか。

## 2. Options

いずれも未選定だった ballot を、Human M2 GO が CONSUME する。

### Option M1 — session `saved` 表示 — NOT SELECTED

```text
Source: existing per-user ShellSaveState
Candidate flag (not flipped here):
  liveSavedCompletionOnCardsAuthorized
Note: flag 名の live を LIVE WRITE 成功と同一視しない。
IN if later selected:
  session-local card indicator for saved
  未記録バッジ / Family R / next-unrecorded は変えない
  persistence 文言（保存済み / 記録済み / 完了）は使わない
OUT unless later GO:
  unrecordedBadgeMutationAuthorized
  kpiFamilyRRecountAuthorized
  saveStateSemanticsChangeAuthorized
Coverage residual:
  LIVE WRITE HOLD 下では session saved が出ないことがある
Conflict if copy uses 保存済み:
  Unit 2 overlay tests forbid persistence-success wording
```

### Option M2 — synthetic recorded-for-today — SELECTED

```text
Source: DEMO_UX_USERS_FIXTURE projection
Candidate flag (not flipped here):
  syntheticRecordedForTodayAuthorized
IN if later selected:
  fixture 上の「本日記録した」presentation
  実データ完了には見えない fail-closed
OUT unless later GO:
  unrecordedBadgeMutationAuthorized
  kpiFamilyRRecountAuthorized
Coverage residual:
  セッション結果を反映しない限り
  静的 user-a / user-e 未記録は残る
```

### Option M3 — live persisted completion — NOT ON THIS BALLOT

```text
Blocked: requires liveTenantIoAuthorized / LIVE WRITE
LIVE WRITE: HOLD
Do not treat liveSavedCompletionOnCardsAuthorized as this option.
This packet does not ask Human to enable LIVE WRITE.
```

### Option M4 — defer meaning — NOT SELECTED

```text
Meaning stays uncut.
FIELD-STAFF-COMPLETION-ON-CARDS-1 stays SELECTED / LOCKED.
Implementation Start stays NOT AUTHORIZED.
```

## 3. Adjacent axes（this DEC では切らない）

採択しない限り OUT。本 packet の判断単位に混ぜない。

```text
unrecordedBadgeMutationAuthorized
kpiFamilyRRecountAuthorized
saveStateSemanticsChangeAuthorized
persistence-success copy: 保存済み / 記録済み / 完了
Unit 7
C / D / E
LIVE WRITE / Deploy / Issue close
```

未記録バッジを mutation すると Users filter と
next-unrecorded CTA が動く。それは別 Human GO である。

## 4. Human Selection

```text
Selected: M2
synthetic recorded-for-today
Human Decision: M2 GO 2026-08-18
Selection record: decision-field-staff-ux-p1-2-completion-meaning-selection.md
Implementation Start: NOT AUTHORIZED
Agent auto-select: FORBIDDEN
```

## 5. Stop condition

```text
This packet is CONSUMED by the meaning selection record.
Do not auto-select M1 / M4.
Do not put M3 on this ballot.
Do not start Implementation.
Do not flip remaining flags.
Do not mark UX-P1-2 or UX-P1-3 residual CLOSED.
Do not enable LIVE WRITE.
Do not rewrite POLISH-1 / Simulation historical observations.
Implementation Start is a separate Human GO bound to M2 only.
```
