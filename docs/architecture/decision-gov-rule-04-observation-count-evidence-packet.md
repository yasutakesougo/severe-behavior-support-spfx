# GOV-RULE-04 — 必要観察件数 — Evidence Packet

この文書は、**GOV-RULE-04**（必要観察件数）の
**Evidence Packet / Decision Packet** である。

**GOV-RULE-04 = HOLD / UNCHANGED。**
件数・期間・数え方を発明しない。

Parent Selection:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-04
Kind: Evidence Packet + Decision Packet（HOLD materials）
Status: HOLD / UNCHANGED
Classification: ORG_POLICY
Prior status: SELECTED / LOCKED / HOLD（PR #282）
Owner: Issue #19
Agent recommendation: NONE
Count invention: FORBIDDEN
PR: pending
```

## 1. Evidence conclusion（Human Direction）

```text
今回確認した厚生労働省一次資料では、次を確認できない:
  - 必要観察件数
  - 一定期間内の最低記録件数
  - 同日に複数記録がある場合の全国共通集計方法

強度行動障害支援に共通する固定値は導出できない。

制度資料ではアセスメント、支援計画シート等、支援手順書による
継続的・一貫した支援の必要性は確認できるが、
固定観察件数を Agent が導出してはならない。
```

## 2. Classification

```text
GOV-RULE-04 = ORG_POLICY
Reason:
  全国共通の固定観察件数・集計方法が MHLW 一次資料から確定できない
  法人運用 Decision が必要
```

## 3. Decision Packet（HOLD / UNCHANGED）

| Field | Status |
|---|---|
| 必要件数 | **VALUE NOT DETERMINED / 法人運用Decision** |
| 対象期間 | **VALUE NOT DETERMINED / 法人運用Decision** |
| 数え方 | **VALUE NOT DETERMINED / 法人運用Decision** |
| 同日に複数記録がある場合 | **VALUE NOT DETERMINED / 法人運用Decision** |

```text
GOV-RULE-04 = HOLD / UNCHANGED
```

## 4. Explicit FORBIDDEN

```text
1日1件 / 週○件 / 月○件 等の発明
全国共通固定値の Agent 導出
HOLD解除 Acceptance（本 Packet では行わない）
支援計画・観察記録実装変更
Implementation Start
```

## 5. After this Packet

```text
GOV-RULE-04: HOLD / UNCHANGED
Next: corporate ORG_POLICY Human Decision（separate）
```
