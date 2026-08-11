# GOV-RULE-10 — ルール変更の承認者 — Human Selection Packet

この文書は、GOV-RULE-09 COMPLETE（PR #268 MERGED）後の
**次 residual Decision** として **GOV-RULE-10** を固定する docs-only Selection Packet である。

本 PR では unit Selection と Option C Acceptance を同一 Draft に記録する
（Human TASK 明示。GOV-RULE-11 / 12 は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-10-SELECTION-1
Kind: Human Selection（#19 residual / GOV-RULE-10）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-RULE-10
Date: 2026-08-11
PR: pending（Selection / Packet / SELECT Acceptance / Option C Acceptance / IR）

Baseline:
  main tip = 81d2995c245dc3c23fd388e9995e0045be5456bc
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-09 = Accepted / LOCKED / Option B（#268 MERGED）
  GOV-RULE-05 / 06 / 07 / 08 = Accepted（該当分；08 = NOT ADOPTED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §B GOV-RULE-10
  #19 residual inventory row: GOV-RULE-10〜12
  Prior non-binding recommendation: Option tip C
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option C
  （decision-gov-rule-10-change-approver-option-c-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A/B/D: FORBIDDEN
GOV-RULE-11 / 12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-RULE-09（内容責任者）は COMPLETE。
Human が次残件として GOV-RULE-10 を明示 SELECT し、
同一 Decision で Option C を Accepted した。
GOV-RULE-10 はルール変更の承認者だけの最小単位であり、
GOV-RULE-11（境界）/ 12（訂正）と分離できる。
GOV-STAFF / GOV-PERF は本 unit OUT。
```

## 2. Selected unit

```text
GOV-RULE-10 — ルール変更の承認者
Question:
  ルール変更の承認者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-RULE-10 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option C Acceptance の docs 固定（本 PR）
  Accepted GOV-RULE-05〜09 / GOV-AUD-01〜10 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A / B / D の Agent 自動 Accepted
  ルール本文・制度値・日数・承認フロー画面の発明
  業務責任者・法人管理者の個人名確定
  GOV-RULE-11 / 12 の自動 SELECT または同時 Accepted
  GOV-STAFF / GOV-PERF の自動 SELECT
  GOV-RULE-05〜09 / GOV-AUD-* の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 | Accepted（該当分） | unrelated / complete cycle |
| GOV-RULE-05〜08 | Accepted（該当分） | review cadence / notice / due |
| GOV-RULE-09 | Accepted / Option B | content owner ≠ change approver |
| GOV-RULE-11 / 12 | OPEN | 本 unit OUT |
| GOV-STAFF / GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-RULE-10** | ルール変更の承認者 | **SELECTED** |
| GOV-RULE-11 | 制度値と法人運用値の境界 | NOT SELECTED |
| GOV-RULE-12 | 過去ルール版の訂正 | NOT SELECTED |
| GOV-STAFF-01〜12 | 職員・利用者所属等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-RULE-10-SELECTION-1 = SELECTED / LOCKED
Option C = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  GOV-RULE-11 / 12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-rule-10-change-approver-acceptance.md`
- Decision Packet: `decision-gov-rule-10-change-approver-decision-packet.md`
- Option C Acceptance: `decision-gov-rule-10-change-approver-option-c-acceptance.md`
- Independent Review: `decision-gov-rule-10-change-approver-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-rule-09-rule-content-owner-option-b-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
