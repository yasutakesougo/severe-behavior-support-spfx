# Decision Packet — FIELD-STAFF remaining-gap exact-slice 選定

この文書は、FIELD-STAFF-MULTI-USER-UX-POLISH-1 が
**ACCEPTED / CLOSED**（PR #412 MERGED）になったあとの
**次の exact-slice** を選ぶための Human Decision Packet である。

POLISH-1 の再 Acceptance ではない。
Unit 7 開始ではない。
remaining-gap の一括実装ではない。
Implementation Start ではない。
Agent が A / B / C / D / E を自動選定しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-STAFF-UX-P1-3-NEXT-UNRECORDED-USER-1
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option B — UX-P1-3）
Selection record:
  decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md
Depends on:
  FIELD-STAFF-MULTI-USER-UX-POLISH-1 ACCEPT / PASS
  PR #412 MERGED
  authoritative main: d154fe7d1317efcbed180c96affa23611c810c18
Prior A recommendation: NOT A SELECTION
Implementation Start: AUTHORIZED
Start SSOT: field-staff-next-unrecorded-user-1-implementation-start.md
Implementation: MERGED（PR #414）
Closeout SSOT: field-staff-next-unrecorded-user-1.md
UX-P1-3 residual classification overall: NOT CLOSED
Unit 7: NOT STARTED
LIVE WRITE: HOLD
Selected exact-slice: SELECTED / B — UX-P1-3
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`field-staff-multi-user-ux-polish-1.md`](./field-staff-multi-user-ux-polish-1.md)
- [`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
- [`production-field-staff-acceptance-1.md`](./production-field-staff-acceptance-1.md)

## 1. Current locked state

```text
FIELD-STAFF-MULTI-USER-UX-POLISH-1: ACCEPTED / CLOSED
Units 1–6: COMPLETE / MERGED
Gap classification: UNCHANGED
UX-P1-2 / UX-P2-5 expansion / UX-P2-7: still OUT OF SCOPE or PARTIAL
Unit 7: NOT STARTED
LIVE WRITE: HOLD
Deploy: HOLD
```

問い:

> POLISH-1 を閉じたあと、残ギャップ
> UX-P1-2 / UX-P1-3 / UX-P2-5 / UX-P2-7 のどれを
> **次の exact-slice** として 1 件選ぶか。
> または全件 defer（E）するか。

## 2. Options

### Option A — UX-P1-2 User card record completion — NOT SELECTED

```text
Flags:
  liveSavedCompletionOnCardsAuthorized
  syntheticRecordedForTodayAuthorized
  unrecordedBadgeMutationAuthorized
  adjacent: kpiFamilyRRecountAuthorized
Note: 完了の意味を LIVE WRITE なしで定義する必要あり。
新 Decision 先行の可能性が高い。
```

### Option B — UX-P1-3 Next unrecorded user — SELECTED

```text
Flag:
  nextUnrecordedUserAuthorized
  adjacent (not in this ballot): listToRecordFastPathAuthorized
Note: fixture の未記録行（user-a / user-e）へ進む
presentation に閉じられる。バッジ / KPI は変えない。
ProcedureRecord 到達は A のみ。
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
Selected: B
UX-P1-3 次の未記録利用者
Slice identity: FIELD-STAFF-NEXT-UNRECORDED-USER-1
Human Decision: B GO 2026-08-18
Implementation Start: recorded in field-staff-next-unrecorded-user-1-implementation-start.md
Closeout SSOT: field-staff-next-unrecorded-user-1.md
PR #414: MERGED / CLOSED
UX-P1-3 residual classification overall: NOT CLOSED
```

## 4. Stop condition

```text
This packet is CONSUMED by the selection record.
Do not auto-select A / C / D / E.
Do not start Unit 7.
Do not enable LIVE WRITE.
Implementation Start is recorded separately.
Successor closeout is recorded in field-staff-next-unrecorded-user-1.md.
Do not mark UX-P1-3 residual CLOSED.
```
