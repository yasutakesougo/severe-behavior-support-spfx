# 観察期間論理 Schema 契約（Decision-OP-3 Accepted）

この文書は、**Decision-OP-3 Option A** に基づく
SupportPlan 上の観察期間 **論理 Schema** 契約である。

メンバシップ純関数の再定義ではない。
SharePoint 物理列の定義ではない。
Implementation Start ではない。

Acceptance: [`decision-op-3-observation-period-schema-acceptance.md`](./decision-op-3-observation-period-schema-acceptance.md)

Membership: [`observation-period.md`](./observation-period.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract: ObservationPeriodLogicalSchema
Status: Accepted logical（Option A）
Decision-OP-3: Accepted
periodFrom: required ISO DateTime
periodTo: required ISO DateTime
Open-ended periodTo: NOT ADOPTED
Institutional day count in domain: NOT ADOPTED
evaluateObservationPeriodMembership: UNCHANGED
SharePoint / DEC-6: OUT
Implementation Start: HOLD
```

## Logical fields

```text
SupportPlan（logical）:
  observationPeriodFrom  ↔ periodFrom（ISO DateTime, required）
  observationPeriodTo    ↔ periodTo（ISO DateTime, required）
```

意味:

- 両端必須の観察期間を SupportPlan 論理データとして保持する。
- 判定時は既存の `evaluateObservationPeriodMembership(periodFrom, periodTo, asOf)` に渡せる形とする。
- フィールドの物理名 / SharePoint 列名は本契約では決めない。

## Constraints

```text
1. periodFrom / periodTo は欠落不可
2. 開放終端（periodTo absent）は NOT ADOPTED
3. 制度日数定数を domain Schema に埋め込まない
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
```

## Gate

```text
Decision-OP-3: Accepted / Option A
Logical Schema contract: FIXED in docs
Membership pure function: UNCHANGED
Implementation Start: HOLD
SharePoint / Deploy: NO-GO
```
