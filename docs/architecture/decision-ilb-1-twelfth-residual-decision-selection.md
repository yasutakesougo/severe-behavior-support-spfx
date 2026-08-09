# Decision-ILB-1 後の第12残存 Decision 選定 — Human Selection

Decision packet: [`decision-ilb-1-twelfth-residual-decision-selection-packet.md`](./decision-ilb-1-twelfth-residual-decision-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWELFTH_RESIDUAL_DECISION_SELECTION
Status: SELECTED / CONSUMED
Human Selection: Explicit Human Option C on 2026-08-09
Selected residual Decision:
  C — Schema ID（AssessmentSnapshot 固有 Schema ID / schemaVersion）
Selected meaning:
  次の残存 Decision 単位を Schema ID 採番とする
  本選定は具体文字列の採択・実装 GO ではない
Prior CONSUMED:
  … ninth overall / tenth PR-J domain / eleventh application save（SELECTED）
Application save（B）:
  SELECTED 維持 / Entry NOT MET / Implementation Start HOLD
Recommended remaining after C（not auto-started）:
  D — SharePoint / adapter
  → A — post-retention deletion
FindingCode: HOLD
A-5: HOLD
SharePoint / DTO: DO NOT START
Schema ID concrete value: NOT ASSIGNED
```

## Human Selection

```text
Selected: C
Schema ID
この判断で開かないもの:
  Agent による Schema ID 文字列発明
  schemaVersion 仮値の自動採択
  SharePoint / DTO / adapter 実装
  application save Implementation Start
  FindingCode / A-5
  post-retention deletion
```

## Boundary

```text
SELECTED unit:
  AssessmentSnapshot 固有 Schema ID / 初回 schemaVersion の Human Decision

MUST keep:
  DEC-1 / AS-EC-1 Entry #7 versioning 方針
  Schema ID ≠ SharePoint List名 ≠ TypeScript 型名
  SupportPlan 既存 Schema ID UNCHANGED

MUST NOT start from this selection alone:
  具体 Schema ID 文字列の採番（要別 Acceptance）
  DTO / SharePoint 実装
  application save コード
  Deploy / real data
```

## Next

```text
Twelfth residual: CONSUMED / C
Next engineering step（別 Human）:
  Schema ID Assignment Decision packet（候補提示は Human 承認前提；Agent 単独採番禁止）
  または Schema ID Entry / 境界の read-only 整理
Application save: HOLD（Entry NOT MET）
Remaining: D → A
```
