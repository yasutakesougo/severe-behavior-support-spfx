# Decision Packet — Decision-ILB-1 後の第11残存 Decision 選定

この文書は、PR-J domain 完全契約（PR #168 MERGED）のあとの
**次に一件判定する残存 Decision** を選ぶための Human Decision Packet である。

FindingCode / A-5 ではない。
Schema ID / SharePoint / post-retention を本選定で同時に閉じない。
Agent が次 Decision を自動選定・自動 Accepted / 自動実装しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_ELEVENTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet
Status: CONSUMED / SELECTED
Selection record: decision-ilb-1-eleventh-residual-decision-selection.md
Depends on:
  Decision-AS-EC-1 overall MET / Accepted
  PR-J domain complete contract MERGED（PR #168 / 08a6bde…）
  DEC-009 Accepted / LOCKED（save-timing meaning）
FindingCode: HOLD
A-5: HOLD
Schema ID / SharePoint / DTO: DO NOT START
application save Implementation Start: HOLD（本選定 ≠ 実装 GO）
Eleventh residual Decision: SELECTED / B — application save
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Current locked state

```text
AS-EC-1 overall: MET / Accepted
PR-J domain: IMPLEMENTED / ON MAIN（type / validator / fixtures / contract tests）
findingIds: OPTIONAL
DEC-009 meaning: Accepted / LOCKED
GOV-AUD-03: Accepted / Option E（application 対象外）
FindingCode / A-5: HOLD
post-retention deletion: OPEN（別）
Schema ID: 未採番
SharePoint / adapter: NO-GO
```

問い:

> PR-J domain 完了後、**次に一件ずつ判定する残存 Decision** はどれですか？

## 2. Options（候補）

### Option A — post-retention deletion

```text
Meaning:
  保存期間経過後の完全削除・物理削除可否（GOV-AUD-05 / DEC-012 残 OPEN）
Does NOT close: application save / Schema ID / SharePoint
Note: 制度根拠不足のリスク。自動開始禁止
```

### Option B — application save（SELECTED）

```text
Selected: B
Meaning:
  AssessmentSnapshot の application 層 保存・確定フロー（DEC-009 準拠）を
  次の残存 Decision 単位とする
Closes only（本選定）:
  「次 residual = application save」の選定
Does NOT close / DOES NOT authorize:
  application save Implementation Start GO
  Schema ID 採番
  SharePoint / DTO / adapter
  FindingCode / A-5
  post-retention deletion
Depends on keep:
  DEC-009 Accepted meaning
  PR-J domain validateAssessmentSnapshot
  GOV-AUD-03 Option E（承認ロール Binding しない）
```

### Option C — Schema ID

```text
Meaning:
  AssessmentSnapshot 固有 Schema ID / 初回 schemaVersion 採番（Entry #7 MAY）
Does NOT close: application save / SharePoint / FindingCode
Note: DEC-1 準拠。仮値発明禁止。自動開始禁止
```

### Option D — SharePoint / adapter

```text
Meaning:
  SharePoint / DTO / provider / DEC-6 列写像
Does NOT close: application save 意味境界 / Schema ID 未採番のまま物理化しない
Note: NO-GO 維持が既定。Adapter Entry + Human GO が別途必要
```

### Option E — まだ決めない

## 3. Human Decision

```text
答え: B
Selected: B — application save
Recommended remaining order（Human guidance；自動開始しない）:
  C — Schema ID
  → D — SharePoint / adapter
  → A — post-retention deletion
Selection record: decision-ilb-1-eleventh-residual-decision-selection.md
```

```text
Agent auto-select: FORBIDDEN
Implementation auto-start: FORBIDDEN
Schema ID / SharePoint / FindingCode / A-5 / post-retention: NOT STARTED from this selection
```

## 4. Gate

```text
ILB1_ELEVENTH_RESIDUAL_DECISION_SELECTION: CONSUMED / Selected B
Selected residual Decision: application save（DEC-009 application 層）
Next after selection（別工程）:
  assessment-snapshot-application-save-entry-criteria.md（read-only；Entry NOT MET）
  → persistence port / tests plan → Implementation Start（各別 Human）
Remaining queue（not selected）: C → D → A
FindingCode: HOLD
A-5: HOLD
```
