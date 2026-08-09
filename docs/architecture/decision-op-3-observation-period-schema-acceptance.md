# Decision-OP-3 — 観察期間論理 Schema Human Acceptance

この文書は、**Decision-OP-3**（観察期間を SupportPlan 論理 Schema としてどう表現するか）についての
**Human Acceptance evidence** である。

Decision packet: [`decision-op-3-observation-period-schema-decision-packet.md`](./decision-op-3-observation-period-schema-decision-packet.md)

Open-points: [`decision-op-3-open-points-extraction.md`](./decision-op-3-open-points-extraction.md)

論理契約: [`observation-period-schema-contract.md`](./observation-period-schema-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-OP-3
Status: Accepted
Human Acceptance: Explicit Human Option A on 2026-08-09
Selected Option: A
Logical Schema:
  SupportPlan に観察期間を持つ
  periodFrom: ISO DateTime（必須）
  periodTo: ISO DateTime（必須）
Open-ended periodTo: NOT ADOPTED
Institutional day count in domain: NOT ADOPTED
evaluateObservationPeriodMembership: UNCHANGED
SharePoint columns / DEC-6: OUT（別 Decision）
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
Decision-OP-3: Accepted
Selected Option: A
観察期間論理 Schema:
  periodFrom / periodTo（両端必須）
制度日数の domain 埋め込み: NOT ADOPTED
```

```text
Agent recommendation（Option A）: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-OP-3: Accepted
Selected: Option A

SupportPlan logical observation period:
  periodFrom: required ISO DateTime
  periodTo: required ISO DateTime

Open-ended periodTo: NOT ADOPTED
Institutional day count / default window in domain: NOT ADOPTED
Period derivation (e.g. Active.effectiveFrom + N): OUT
SharePoint physical columns: OUT / separate Decision
```

日本語正本:

```text
観察期間（SupportPlan 論理 Schema）:
  periodFrom（必須）
  periodTo（必須）
開放終端: 採択しない
制度日数の domain 埋め込み: 採択しない
```

意味:

- 観察期間を **データとして SupportPlan 論理 Schema に持つ**。
- 現行メンバシップ契約（`periodTo` 必須・caller-supplied 入力形）と整合する。
- 日数・期限を AI / Agent が発明しない。制度日数は domain に埋め込まない。
- `evaluateObservationPeriodMembership` は **変更しない**。
- SharePoint 列実装・Schema code 実装は本 Acceptance だけでは開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  duration_days / 30日 / 90日 / 3ヶ月 等の日数発明
  periodTo 開放終端の採択
  evaluateObservationPeriodMembership の破壊的変更
  SharePoint / DEC-6 列実装
  FindingCode 作成
  A-5
  Implementation Start
  Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| `observation-period.md` メンバシップ | **UNCHANGED** |
| OP-1 / OP-2 | Accepted / 維持（caller-supplied・日数非埋め込み） |
| 観察期間論理 Schema | **Accepted / Option A** |
| GOV-RULE-06（3ヶ月に1回程度） | 別 track / 混ぜない |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
Decision-OP-3: Accepted / Option A
Logical contract: observation-period-schema-contract.md
Next:
  Schema / code Implementation は別 Human GO
  SharePoint 列は別 Decision
FindingCode / A-5 / Implementation: HOLD
次 substantive unit: NOT SELECTED
```

Agent は本 Acceptance を理由に Implementation や日数埋め込みへ自動進行しない。
