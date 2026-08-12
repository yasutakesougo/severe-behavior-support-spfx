# GOV-STAFF-03 — 権限停止期限 — Human Selection Packet

この文書は、GOV-STAFF-02 COMPLETE（PR #275 MERGED）後の
**次 residual Decision** として **GOV-STAFF-03** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-03-SELECTION-1
Kind: Human Selection（#19 residual / GOV-STAFF-03）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-STAFF-03
Date: 2026-08-12
PR: #276（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = 5e246cd34a89c84ccf63d1f6917c66b69c2cd681
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 / GOV-RULE-05〜12 = Accepted（該当分）
  GOV-STAFF-01 = Accepted / LOCKED / Option C（#274 MERGED）
  GOV-STAFF-02 = Accepted / LOCKED / Option B（#275 MERGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-03
  #19 residual inventory row: GOV-STAFF-03〜12
  Prior non-binding recommendation: Option tip A
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option A
  （decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md）
Option A status: Accepted / LOCKED（prior tip was NON-BINDING）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
Entra / M365 mutation: FORBIDDEN
GOV-STAFF-04〜12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-STAFF-02（Entra 削除実施者）は COMPLETE。
Human が次残件として GOV-STAFF-03 を明示 SELECT した。
GOV-STAFF-03 は権限停止期限だけの最小単位であり、
確定者（01）・Entra 削除実施者（02）・異動台帳（04）と分離できる。
Option は未採択のまま Human Acceptance 待ち。
```

## 2. Selected unit

```text
GOV-STAFF-03 — 権限停止期限
Question:
  権限停止期限はいつまでか？
```

## 3. Authorized IN

```text
IN:
  GOV-STAFF-03 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  Accepted GOV-STAFF-01 / 02 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted（設計 tip A 含む）
  権限停止自動化・Entra mutation・日数の発明
  GOV-STAFF-04〜12 の自動 SELECT または同時 Accepted
  GOV-STAFF-01 / 02 の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | Accepted（該当分） | unrelated |
| GOV-STAFF-01 | Accepted / Option C | confirmer ≠ suspension deadline |
| GOV-STAFF-02 | Accepted / Option B | Entra operator ≠ suspension deadline |
| GOV-STAFF-04〜12 | OPEN | 本 unit OUT |
| GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-STAFF-03** | 権限停止期限 | **SELECTED** |
| GOV-STAFF-04〜12 | 異動台帳 / 閲覧 / 資格 等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-STAFF-03-SELECTION-1 = SELECTED / LOCKED
Option A = Accepted / LOCKED（別 Acceptance）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Entra / M365 mutation = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  GOV-STAFF-04〜12 = NOT SELECTED
  next residual = NOT SELECTED
```

## 8. Next（Human only）

```text
Consumed:
  Unit Selection PR #276 = MERGED
  Human Option = A

Current Option Acceptance PR:
  1. Independent Review → Human Ready → Human Merge
  2. After Merge: Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-03-access-suspension-deadline-acceptance.md`
- Decision Packet: `decision-gov-staff-03-access-suspension-deadline-decision-packet.md`
- Option A Acceptance: `decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md`
- Independent Review（Selection）: `decision-gov-staff-03-access-suspension-deadline-independent-review.md`
- Independent Review（Option A）: `decision-gov-staff-03-access-suspension-deadline-option-a-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
