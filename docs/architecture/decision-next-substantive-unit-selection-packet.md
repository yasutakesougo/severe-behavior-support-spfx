# Decision Packet — 次 substantive unit 選定

この文書は、DEC-008 正本化が **CONSISTENT** になったあとの
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
Status: CONSUMED（Human Selected Option C after GOV-AUD-03）
Selection record: decision-next-substantive-unit-selection.md
Depends on:
  DEC-008 Accepted / LOCKED
  Issue #8 comment 5229571943
  PR #143 MERGED（713c40a…）
  consistency: CONSISTENT
  GOV-AUD-03 Accepted / Option E（PR #145 / f7448d2…）
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: SELECTED / Decision-OP-3
```



Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-008-canonicalization-consistency-check.md`](./decision-dec-008-canonicalization-consistency-check.md)
- [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current locked state

```text
DEC-008 / Issue #8: POSTED / 5229571943
PR #143: MERGED / 713c40a…
制度上の作成者: 実践研修修了者
独立した最終承認者: NOT ADOPTED
Consistency: CONSISTENT
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
```

問い:

> 次に着手する substantive unit はどれですか？

## 2. 判断単位の分離（混ぜない）

| ID | 扱い |
|---|---|
| DEC-008 current scope | **closed / CONSISTENT** — 再開しない |
| FindingCode 値作成 | **OUT / DO NOT CREATE** |
| A-5 | **OUT / HOLD** |
| Implementation Start | **OUT / HOLD** |
| SharePoint / Deploy / real data | **NO-GO** |
| 次 substantive unit | **本 packet** |

## 3. Options（候補）

### Option A — DEC-009（AssessmentSnapshot 保存タイミング）

```text
Meaning:
  AS-EC-1 unlock 向けに、Snapshot 保存タイミングを Human Decision する
Does NOT start:
  Schema / SharePoint / 保存実装
```

### Option B — GOV-AUD-03（訂正承認境界）または Issue #19 の最小 GOV-AUD 単位

```text
Meaning:
  Snapshot 訂正承認など、GOV-AUD 残件の最小単位を選ぶ
Requires:
  Human が対象 GOV-AUD ID を明示してもよい
```

### Option C — Decision-OP-3（観察期間 Schema / 制度日数 / 開放終端）

```text
Meaning:
  観察期間の Schema / 制度日数 / periodTo 開放終端を決める
Keeps:
  evaluateObservationPeriodMembership UNCHANGED until Decision
```

### Option D — Decision-RD-3（接近窓 / 算出 / 超過後）

```text
Meaning:
  見直し接近窓等を扱う
Boundary:
  GOV-RULE-08 NOT ADOPTED を開始信号にしない
  90日 / overdue を発明しない
```

### Option E — DEC-008 残面（提出・差戻しロール）のみ

```text
Meaning:
  制度上の作成者 / 独立最終承認者は触らず、
  提出・差戻しロールだけを狭域 Decision する
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
FC-7
SEV-2-ASSIGN / FindingSeverity restart
hard due / overdue implementation
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE（自動選定しない）
Note:
  FindingCode 作成線は DEC-019 EMPTY 後も HOLD / DO NOT CREATE。
  旧「A-1〜A-4 bundle が current single gate」推奨は消費済み（DEC-019）。
  安全な候補は A / B / C / E。
  D は GOV-RULE-08 NOT ADOPTED 境界を厳守する場合のみ。
```

## 6. Human Decision

```text
問:
  次に着手する substantive unit はどれですか？

A. DEC-009（AssessmentSnapshot 保存タイミング）
B. GOV-AUD-03 または Issue #19 最小 GOV-AUD 単位
C. Decision-OP-3（観察期間 Schema / 制度日数 / 開放終端）
D. Decision-RD-3（接近窓等）
E. DEC-008 残面（提出・差戻しロール）のみ
F. 別単位（単位名を明示）
G. まだ決めない

答え: C（2026-08-09）— after GOV-AUD-03 Accepted / Option E
Scope: Decision-OP-3 観察期間 Schema（未決定点抽出 → Human Decision）
Selection record: decision-next-substantive-unit-selection.md
Prior B / GOV-AUD-03: CONSUMED
```

## 7. Gate

```text
DEC-008 consistency: CONSISTENT
GOV-AUD-03: Accepted / Option E
NEXT_SUBSTANTIVE_UNIT_SELECTION: CONSUMED / Selected C
Selected unit: Decision-OP-3
OP-3 open-points: decision-op-3-open-points-extraction.md
OP-3 packet: READY_FOR_HUMAN_DECISION
  → decision-op-3-observation-period-schema-decision-packet.md
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
```
