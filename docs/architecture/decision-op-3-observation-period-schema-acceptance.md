# Decision-OP-3 — 観察期間論理 Schema Human Acceptance

この文書は、**Decision-OP-3**（観察期間を SupportPlan 論理 Schema としてどう表現するか）についての
**Human Acceptance 正本（LOCKED）** である。

Decision packet: [`decision-op-3-observation-period-schema-decision-packet.md`](./decision-op-3-observation-period-schema-decision-packet.md)

Open-points: [`decision-op-3-open-points-extraction.md`](./decision-op-3-open-points-extraction.md)

論理契約: [`observation-period-schema-contract.md`](./observation-period-schema-contract.md)

整合確認: [`decision-op-3-canonicalization-consistency-check.md`](./decision-op-3-canonicalization-consistency-check.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-OP-3
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option A on 2026-08-09
  + Explicit Human freeze on 2026-08-09

LOCKED:

Decision-OP-3: Accepted
SupportPlan observation period:
  periodFrom: REQUIRED
  periodTo: REQUIRED
Open-ended periodTo:
  NOT ADOPTED
制度日数・既定観察窓の domain 埋め込み:
  NOT ADOPTED
evaluateObservationPeriodMembership:
  UNCHANGED
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD
Next substantive unit:
  NOT SELECTED

SharePoint columns / DEC-6: OUT（別 Decision）
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Option A + freeze on 2026-08-09
Decision-OP-3: Accepted / LOCKED
Selected Option: A

SupportPlan observation period:
  periodFrom: REQUIRED
  periodTo: REQUIRED
Open-ended periodTo: NOT ADOPTED
制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
evaluateObservationPeriodMembership: UNCHANGED
```

```text
Agent recommendation（Option A）: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-OP-3: Accepted / LOCKED
Selected: Option A

SupportPlan logical observation period:
  periodFrom: REQUIRED
  periodTo: REQUIRED

Open-ended periodTo: NOT ADOPTED
制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
Period derivation (e.g. Active.effectiveFrom + N): OUT
SharePoint physical columns: OUT / separate Decision
evaluateObservationPeriodMembership: UNCHANGED
```

日本語正本:

```text
観察期間（SupportPlan 論理 Schema）:
  periodFrom: REQUIRED
  periodTo: REQUIRED
開放終端: NOT ADOPTED
制度日数・既定観察窓の domain 埋め込み: NOT ADOPTED
メンバシップ純関数: UNCHANGED
```

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
  次 substantive unit の自動選定
  Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| `observation-period.md` メンバシップ | **UNCHANGED** |
| 観察期間論理 Schema | **Accepted / LOCKED / Option A** |
| GOV-RULE-06（3ヶ月に1回程度） | 別 track / 混ぜない |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
PR #146: MERGED（42b251b… / head 974d083…）
Consistency: FINAL CONSISTENT
Next substantive unit: SELECTED / E
  — DEC-008 提出・差戻しロール
  → decision-dec-008-submit-return-roles-decision-packet.md
FindingCode / A-5 / Implementation: HOLD
```
