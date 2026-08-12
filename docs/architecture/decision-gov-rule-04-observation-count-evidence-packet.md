# GOV-RULE-04 — 必要観察件数 — Evidence Packet

この文書は、**GOV-RULE-04**（必要観察件数）の
**Evidence Packet / Decision Packet** である。

**Human Acceptance 済み（別文書）。** 本 Evidence Packet は根拠正本として維持する。
Acceptance: [`decision-gov-rule-04-observation-count-acceptance.md`](./decision-gov-rule-04-observation-count-acceptance.md)

Parent Selection:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-04
Kind: Evidence Packet + Decision Packet（HOLD materials）
Status: Evidence COMPLETE → Acceptance = Accepted / LOCKED（separate doc）
Classification: ORG_POLICY（Accepted；最低件数 NOT FIXED）
Prior status: SELECTED / LOCKED / HOLD（PR #282）
Owner: Issue #19
Agent recommendation: NONE
Count invention: FORBIDDEN
PR: #287
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

## 3. Decision Packet（Accepted via separate Acceptance）

| Field | Accepted meaning（要約） |
|---|---|
| 必要件数 | **minimumObservationCount = NOT FIXED** |
| 対象期間 | 前回見直し〜今回見直し（初回は RULE-02 と整合） |
| 数え方 | 独立した事象・ケースを1件（行数/送信数/追記回数ではない） |
| 同日に複数記録がある場合 | 別ケース=別件；同一事象追記/分割/重複=1件 |

```text
GOV-RULE-04 = Accepted / LOCKED（Acceptance document）
```

## 4. Explicit FORBIDDEN

```text
1日1件 / 週○件 / 月○件 等の発明
全国共通固定値の Agent 導出
支援計画・観察記録実装変更
Implementation Start
```

## 5. After this Packet

```text
GOV-RULE-04: Accepted / LOCKED（Acceptance document）
HOLD: LIFTED
```
