# 観察期間論理 Schema 契約（Decision-OP-3 Accepted / LOCKED）

この文書は、**Decision-OP-3 Option A** に基づく
SupportPlan 上の観察期間 **論理 Schema** 契約である。

メンバシップ純関数の再定義ではない。
SharePoint 物理列の定義ではない。
Implementation Start ではない。

Acceptance: [`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md)

Membership: [`observation-period.md`](./observation-period.md)

Consistency: [`decision-op-3-canonicalization-consistency-check.md`](./decision-op-3-canonicalization-consistency-check.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract: ObservationPeriodLogicalSchema
Status: Accepted logical / LOCKED（Option A）
Decision-OP-3: Accepted / LOCKED

SupportPlan observation period:
  periodFrom: REQUIRED
  periodTo: REQUIRED
Open-ended periodTo: NOT ADOPTED
制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
evaluateObservationPeriodMembership: UNCHANGED
SharePoint / DEC-6: OUT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
```

## Logical fields

```text
SupportPlan（logical）:
  observationPeriodFrom  ↔ periodFrom（REQUIRED）
  observationPeriodTo    ↔ periodTo（REQUIRED）
```

意味:

- 両端必須の観察期間を SupportPlan 論理データとして保持する。
- 判定時は既存の `evaluateObservationPeriodMembership(periodFrom, periodTo, asOf)` に渡せる形とする。
- フィールドの物理名 / SharePoint 列名は本契約では決めない。

## Constraints

```text
1. periodFrom / periodTo は REQUIRED（欠落不可）
2. 開放終端（periodTo absent）は NOT ADOPTED
3. 制度日数・既定観察窓を domain Schema に埋め込まない（NOT ADOPTED）
4. Active.effectiveFrom + N 等の導出規則は本契約に含めない
5. GOV-RULE-06「3ヶ月に1回程度」を観察期間日数へ変換しない
```

## Relation to membership function

```text
UNCHANGED:
  evaluateObservationPeriodMembership
  Asia/Tokyo 暦日閉区間
  IN_PERIOD | OUTSIDE_PERIOD | MALFORMED_INPUT
```

本 Schema は、その関数へ渡す値の **保持場所（論理）** を固定するだけである。

## OUT

```text
TypeScript / validator / fixture 実装
SharePoint List / 列
DEC-6 mapping
UI
Authorization
duration_days invention
Implementation Start
次 substantive unit の自動選定
```

## Gate

```text
Decision-OP-3: Accepted / LOCKED / Option A
Logical Schema contract: FIXED
Membership pure function: UNCHANGED
Consistency: see decision-op-3-canonicalization-consistency-check.md
Implementation Start: HOLD
SharePoint / Deploy: NO-GO
```
