# GOV-STAFF-06 — 資格・研修マスターの正本管理者 — Human Selection Packet

この文書は、GOV-STAFF-05 COMPLETE（PR #279 MERGED）後の
**次 residual Decision** として **GOV-STAFF-06** を固定する docs-only Selection Packet である。

本 PR では unit Selection と Option B Acceptance を同一 Draft に記録する
（Human Decision 明示。GOV-STAFF-07+ は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-06-SELECTION-1
Kind: Human Selection（#19 residual / GOV-STAFF-06）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-STAFF-06
Date: 2026-08-12
PR: #280（Selection / Packet / SELECT Acceptance / Option B Acceptance / IR）

Baseline:
  main tip = 28ab6c089c2e6383014c788f63c19601c14dcf9a
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 / GOV-RULE-05〜12 = Accepted（該当分）
  GOV-STAFF-01〜05 = Accepted（該当 Option；#279 MERGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-06
  #19 residual inventory row: GOV-STAFF-06〜12
  Prior non-binding recommendation: Option tip B
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option B
  （decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A/C/D: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
GOV-STAFF-07〜12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-STAFF-05（異動後の過去記録の閲覧範囲）は COMPLETE。
Human が次残件として GOV-STAFF-06 を明示 SELECT し、
同一 Decision で Option B を Accepted した。
GOV-STAFF-06 は資格・研修マスターの正本管理者だけの最小単位であり、
確認者（07）・研修割合分母（08）と分離できる。
```

## 2. Selected unit

```text
GOV-STAFF-06 — 資格・研修マスターの正本管理者
Question:
  資格・研修マスターの正本管理者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-STAFF-06 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option B Acceptance の docs 固定（本 PR）
  Accepted GOV-STAFF-01〜05 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A / C / D の Agent 自動 Accepted
  マスター UI・名簿・個人名の発明
  GOV-STAFF-07〜12 の自動 SELECT または同時 Accepted
  GOV-STAFF-01〜05 の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | Accepted（該当分） | unrelated |
| GOV-STAFF-01〜05 | Accepted | transfer / ledger / access ≠ master owner |
| GOV-STAFF-07〜12 | OPEN | 本 unit OUT |
| GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-STAFF-06** | 資格・研修マスターの正本管理者 | **SELECTED** |
| GOV-STAFF-07〜12 | 確認者 / 分母 / 資格扱い 等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-STAFF-06-SELECTION-1 = SELECTED / LOCKED
Option B = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  GOV-STAFF-07〜12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-06-qualification-training-master-owner-acceptance.md`
- Decision Packet: `decision-gov-staff-06-qualification-training-master-owner-decision-packet.md`
- Option B Acceptance: `decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md`
- Independent Review: `decision-gov-staff-06-qualification-training-master-owner-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
