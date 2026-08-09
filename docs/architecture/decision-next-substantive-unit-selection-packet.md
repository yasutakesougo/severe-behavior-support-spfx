# Decision Packet — 次 substantive unit 選定（post DEC-008 submit/return）

この文書は、DEC-008 提出・差戻しロールが **FINAL CONSISTENT**（PR #147 MERGED）になったあとの
**次 substantive unit 選定** のための Human Decision Packet である。

FindingCode 値作成ではない。
A-5 ではない。
Implementation Start ではない。
Agent が次 unit を自動選定しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Kind: Human Decision packet
Status: CONSUMED（Human Selected Option B — GOV-AUD-04）
Selection record: decision-next-substantive-unit-selection.md
Depends on:
  DEC-008 submit/return Accepted / LOCKED / Option C
  Consistency: FINAL CONSISTENT
  PR #147 MERGED（ce05cd0… / head 31e1df0…）
Prior CONSUMED:
  prior-B — GOV-AUD-03 Accepted / Option E
  C — Decision-OP-3 Accepted / LOCKED / Option A
  E — DEC-008 提出・差戻し Accepted / LOCKED / Option C
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: SELECTED / B — GOV-AUD-04
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-008-submit-return-roles-canonicalization-consistency-check.md`](./decision-dec-008-submit-return-roles-canonicalization-consistency-check.md)
- [`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
DEC-008:
  制度上の作成者: ACCEPTED = 実践研修修了者
  独立した最終承認者: NOT ADOPTED
  提出・差戻しロール: NOT ADOPTED（application 非埋め込み / Option C）
  Consistency: FINAL CONSISTENT（PR #147）
Decision-OP-3: FINAL CONSISTENT
GOV-AUD-03: Accepted / Option E
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

問い:

> 次に着手する substantive unit はどれですか？

## 2. 判断単位の分離（混ぜない）

| ID | 扱い |
|---|---|
| DEC-008 submit/return | **closed / Option C** — 再開しない |
| Decision-OP-3 | **closed / LOCKED** — 再開しない |
| GOV-AUD-03 | **closed / Option E** — 再開しない |
| DEC-009 | **再 Decision しない**（Human: already Accepted） |
| GOV-AUD-05 | **OUT**（本選定では選ばない） |
| FindingCode 値作成 | **OUT / HOLD** |
| A-5 | **OUT / HOLD** |
| Implementation Start | **OUT / HOLD** |
| SharePoint / Deploy / real data | **NO-GO** |
| 次 substantive unit | **本 packet** |

## 3. Options（候補）

### Option A — DEC-009 — OUT for re-decision

```text
Status: OUT for re-decision
Do not re-open as next unit
```

### Option B — Issue #19 最小 GOV-AUD 残件（GOV-AUD-04）

```text
Meaning:
  GOV-AUD-03 は CONSUMED。
  次は GOV-AUD-04「論理削除を許可するロール」を最小単位として選ぶ
OUT:
  GOV-AUD-05 物理削除方針
```

### Option C — Decision-OP-3 — CONSUMED

```text
Status: CONSUMED / FINAL CONSISTENT
Do not re-select
```

### Option D — Decision-RD-3（接近窓 / 算出 / 超過後）

```text
Boundary:
  GOV-RULE-08 NOT ADOPTED を開始信号にしない
  90日 / overdue を発明しない
```

### Option E — DEC-008 提出・差戻しロール — CONSUMED

```text
Status: CONSUMED / Accepted / LOCKED / Option C
Do not re-select
```

### Option F — 別単位（Human が明示）

```text
Requires: 単位名を Human が記入
Agent MUST NOT invent the unit name
```

### Option G — まだ決めない

```text
Meaning: Next substantive unit は NOT SELECTED のまま
```

## 4. Explicit non-options（選ばない）

```text
FindingCode values invention / catalog fill
A-5 UUID/hash/semver invention
Implementation Start
DEC-009 re-decision
GOV-AUD-05 as this selection
Decision-OP-3 / GOV-AUD-03 / DEC-008 submit-return re-open
hard due / overdue implementation
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE（自動選定しない）
Note（historical Human preference for this round）:
  B — GOV-AUD-04 を推奨（物理削除より論理削除ロールを先に分離）
```

## 6. Human Decision

```text
問:
  次に着手する substantive unit はどれですか？

答え: B（2026-08-09）
Scope: GOV-AUD-04 論理削除を許可するロール
OUT: GOV-AUD-05 / FindingCode / A-5 / Implementation Start / SharePoint・Deploy・real data
Selection record: decision-next-substantive-unit-selection.md
```

## 7. Gate

```text
DEC-008 submit/return: FINAL CONSISTENT
NEXT_SUBSTANTIVE_UNIT_SELECTION: CONSUMED / Selected B
Selected unit: GOV-AUD-04
Open-points: decision-gov-aud-04-logical-delete-role-open-points.md
Decision packet: decision-gov-aud-04-logical-delete-role-decision-packet.md
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
