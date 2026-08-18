# Decision Packet — FIELD-STAFF remaining-gap exact-slice 選定（A / UX-P1-2）

この文書は、FIELD-STAFF-NEXT-UNRECORDED-USER-1 が
**IMPLEMENTED / MERGED**（PR #414 / #415 MERGED）になったあとの
**次の remaining-gap exact-slice** を選ぶための Human Decision Packet である。

先行 B 投票
（[`decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md`](./decision-field-staff-ux-p1-3-next-unrecorded-user-selection-packet.md)）
は歴史的 CONSUMED のまま残す。本 packet はその投票を書き換えない。

POLISH-1 の再 Acceptance ではない。
Unit 7 開始ではない。
remaining-gap の一括実装ではない。
Implementation Start ではない。
完了意味の新 Decision を本 packet では Accepted にしない。
Agent が A / C / D / E を自動選定しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-2-COMPLETION-ON-CARDS-1
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option A — UX-P1-2）
Selection record:
  decision-field-staff-ux-p1-2-completion-on-cards-selection.md
Depends on:
  FIELD-STAFF-NEXT-UNRECORDED-USER-1 IMPLEMENTATION COMPLETE / MERGED
  PR #414 MERGED
  PR #415 MERGED
  authoritative main: 73ab70e2f292ca584699b2310ffa376c4d82cd27
Predecessor B ballot: HISTORICAL / CONSUMED
Implementation Start: NOT AUTHORIZED
Completion-meaning Decision: NOT ACCEPTED HERE
Unit 7: NOT STARTED
LIVE WRITE: HOLD
Selected exact-slice: SELECTED / A — UX-P1-2
UX-P1-3 residual classification overall: NOT CLOSED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`field-staff-next-unrecorded-user-1.md`](./field-staff-next-unrecorded-user-1.md)
- [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
- [`production-field-staff-acceptance-1.md`](./production-field-staff-acceptance-1.md)

## 1. Current locked state

```text
FIELD-STAFF-MULTI-USER-UX-POLISH-1: ACCEPTED / CLOSED
FIELD-STAFF-NEXT-UNRECORDED-USER-1: IMPLEMENTATION COMPLETE / MERGED
UX-P1-3 residual classification overall: NOT CLOSED
POLISH-1 historical UX-P1-2 / UX-P1-3: OUT OF SCOPE（unchanged）
UX-P2-5 expansion / UX-P2-7: still OUT OF SCOPE or PARTIAL
Unit 7: NOT STARTED
LIVE WRITE: HOLD
Deploy: HOLD
```

問い:

> NEXT-UNRECORDED-USER-1 を閉じたあと、残ギャップ
> UX-P1-2 / UX-P2-5 / UX-P2-7 のどれを
> **次の exact-slice** として 1 件選ぶか。
> または全件 defer（E）するか。

B / UX-P1-3 は先行 ballot で SELECTED 済みであり、本 ballot の選択肢ではない。

## 2. Options

### Option A — UX-P1-2 User card record completion — SELECTED

```text
Candidate flags (not flipped by this packet):
  liveSavedCompletionOnCardsAuthorized
  syntheticRecordedForTodayAuthorized
  unrecordedBadgeMutationAuthorized
  adjacent (not auto-in-scope): kpiFamilyRRecountAuthorized
Note: 完了の意味を LIVE WRITE なしで定義する必要あり。
新 Decision 先行の可能性が高い。
This packet does not Accept that meaning Decision.
```

### Option C — UX-P2-5 18-user layout expansion — NOT SELECTED

```text
Flags:
  eightUserDetailCatalogAuthorized
  procedureFixtureExpansionAuthorized
Note: 採択するなら C1（合成18人リスト）または
C2（8人 detail/procedure catalog）をさらに切る。
本番 4 / 6 / 18 PASS にはしない。
```

### Option D — UX-P2-7 Saving pause removal — NOT SELECTED

```text
Flag:
  savingPauseRemovalAuthorized
  adjacent: saveStateSemanticsChangeAuthorized
Note: DEMO-UX-14 の意味変更。新 Decision がほぼ必須。
```

### Option E — Defer all — NOT SELECTED

```text
Note: 次 slice なし。STOP 維持。
```

## 3. Human Selection

```text
Selected: A
UX-P1-2 カード完了状態
Slice identity: FIELD-STAFF-COMPLETION-ON-CARDS-1
Human Decision: A GO 2026-08-18
Implementation Start: NOT AUTHORIZED
Completion-meaning Decision: NOT ACCEPTED HERE
```

## 4. Stop condition

```text
This packet is CONSUMED by the selection record.
Do not auto-select C / D / E.
Do not start Unit 7.
Do not enable LIVE WRITE.
Do not flip remaining flags.
Do not Accept completion meaning here.
Do not mark UX-P1-2 or UX-P1-3 residual CLOSED.
Implementation Start is a separate Human GO.
```
