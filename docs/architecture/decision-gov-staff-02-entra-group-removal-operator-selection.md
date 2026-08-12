# GOV-STAFF-02 — Entra IDグループから削除する実施者 — Human Selection Packet

この文書は、GOV-STAFF-01 COMPLETE（PR #274 MERGED）後の
**次 residual Decision** として **GOV-STAFF-02** を固定する docs-only Selection Packet である。

本 PR では unit Selection と Option B Acceptance を同一 Draft に記録する
（Human Decision 明示。GOV-STAFF-03+ は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-02-SELECTION-1
Kind: Human Selection（#19 residual / GOV-STAFF-02）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-STAFF-02
Date: 2026-08-12
PR: pending（Selection / Packet / SELECT Acceptance / Option B Acceptance / IR）

Baseline:
  main tip = 76563ce303c5ed4bd985c96d36d457257c18223f
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-09〜12 = Accepted（該当分）
  GOV-STAFF-01 = Accepted / LOCKED / Option C（#274 MERGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-02
  #19 residual inventory row: GOV-STAFF-02〜12
  Prior non-binding recommendation: Option tip B
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option B
  （decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A/C/D: FORBIDDEN
GOV-STAFF-03〜12 auto-SELECT: FORBIDDEN
Entra / M365 mutation: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-STAFF-01（異動・退職情報の確定者）は COMPLETE。
Human が次残件として GOV-STAFF-02 を明示 SELECT し、
同一 Decision で Option B を Accepted した。
GOV-STAFF-02 は Entra ID グループ削除実施者だけの最小単位であり、
確定者（01）・権限停止期限（03）と分離できる。
```

## 2. Selected unit

```text
GOV-STAFF-02 — Entra IDグループから削除する実施者
Question:
  Entra IDグループから削除する実施者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-STAFF-02 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option B Acceptance の docs 固定（本 PR）
  Accepted GOV-STAFF-01 / GOV-RULE-* / GOV-AUD-* との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A / C / D の Agent 自動 Accepted
  Entra ID / Microsoft 365 / SharePoint mutation の実行または発明手順
  Microsoft 365管理者の個人名確定
  GOV-STAFF-03〜12 の自動 SELECT または同時 Accepted
  GOV-STAFF-01 の再 Decision
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | Accepted（該当分） | unrelated |
| GOV-STAFF-01 | Accepted / Option C | confirmer ≠ Entra removal operator |
| GOV-STAFF-03〜12 | OPEN | 本 unit OUT |
| GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-STAFF-02** | Entra IDグループから削除する実施者 | **SELECTED** |
| GOV-STAFF-03〜12 | 権限停止 / 異動台帳 / 資格 等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-STAFF-02-SELECTION-1 = SELECTED / LOCKED
Option B = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Entra / M365 mutation = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  GOV-STAFF-03〜12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-02-entra-group-removal-operator-acceptance.md`
- Decision Packet: `decision-gov-staff-02-entra-group-removal-operator-decision-packet.md`
- Option B Acceptance: `decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md`
- Independent Review: `decision-gov-staff-02-entra-group-removal-operator-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
