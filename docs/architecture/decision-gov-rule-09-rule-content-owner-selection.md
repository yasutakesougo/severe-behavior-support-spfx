# GOV-RULE-09 — ルール内容の責任者 — Human Selection Packet

この文書は、GOV-AUD-01〜10 COMPLETE（PR #266 MERGED）後の
**次 residual Decision** として **GOV-RULE-09** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-09-SELECTION-1
Kind: Human Selection（#19 residual / GOV-RULE-09）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-RULE-09
Date: 2026-08-11
PR: #267（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = a1f1e1da1b35a4ab18d16af4c6fa6ff215037307
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-05 / 06 / 07 / 08 = Accepted（該当分；08 = NOT ADOPTED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §B GOV-RULE-09
  #19 residual inventory row: GOV-RULE-09〜12
  Prior non-binding recommendation: GOV-RULE-09 / Option tip B
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: NOT SELECTED
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-AUD-01〜10 は一巡 COMPLETE。
Human が次残件として GOV-RULE-09 を明示 SELECT した。
GOV-RULE-09 はルール内容の責任者だけの最小単位であり、
GOV-RULE-10（変更承認）/ 11（境界）/ 12（訂正）と分離できる。
GOV-STAFF / GOV-PERF は本 unit OUT。
```

## 2. Selected unit

```text
GOV-RULE-09 — ルール内容の責任者
Question:
  ルール内容の責任者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-RULE-09 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  Accepted GOV-RULE-05〜08 / GOV-AUD-01〜10 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted
  ルール本文・制度値・日数・通知経路の発明
  GOV-RULE-10 / 11 / 12 の自動 SELECT または同時 Accepted
  GOV-STAFF / GOV-PERF の自動 SELECT
  GOV-RULE-05〜08 / GOV-AUD-* の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 | Accepted（該当分） | unrelated / complete cycle |
| GOV-RULE-05〜08 | Accepted（該当分） | review cadence / notice / due；≠ content owner |
| GOV-RULE-10 / 11 / 12 | OPEN | 本 unit OUT |
| GOV-STAFF / GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-RULE-09** | ルール内容の責任者 | **SELECTED** |
| GOV-RULE-10 | ルール変更の承認者 | NOT SELECTED |
| GOV-RULE-11 / 12 | 境界 / 訂正 | NOT SELECTED |
| GOV-STAFF-01〜12 | 職員・利用者所属等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-RULE-09-SELECTION-1 = SELECTED / LOCKED

HOLD:
  concrete Option A–D = NOT SELECTED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: Human SELECT Option A–D or HOLD
3. Option Acceptance / LOCKED for GOV-RULE-09 only
4. Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-rule-09-rule-content-owner-acceptance.md`
- Decision Packet: `decision-gov-rule-09-rule-content-owner-decision-packet.md`
- Independent Review: `decision-gov-rule-09-rule-content-owner-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior cycle tip: `decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
