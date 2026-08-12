# GOV-STAFF-04 — 利用者異動台帳の保存先 — Human Selection Packet

この文書は、GOV-STAFF-03 COMPLETE（PR #277 MERGED）後の
**次 residual Decision** として **GOV-STAFF-04** を固定する docs-only Selection Packet である。

本 PR では unit Selection と Option C Acceptance を同一 Draft に記録する
（Human Decision 明示。GOV-STAFF-05+ は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-04-SELECTION-1
Kind: Human Selection（#19 residual / GOV-STAFF-04）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-STAFF-04
Date: 2026-08-12
PR: #278（Selection / Packet / SELECT Acceptance / Option C Acceptance / IR）

Baseline:
  main tip = 46160fc524d9b13eb37a680d29017545b81cfeea
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 / GOV-RULE-05〜12 = Accepted（該当分）
  GOV-STAFF-01 = Accepted / LOCKED / Option C（#274 MERGED）
  GOV-STAFF-02 = Accepted / LOCKED / Option B（#275 MERGED）
  GOV-STAFF-03 = Accepted / LOCKED / Option A（#277 MERGED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-04
  #19 residual inventory row: GOV-STAFF-04〜12
  Prior non-binding recommendation: Option tip C
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option C
  （decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A/B/D: FORBIDDEN
SharePoint / M365 mutation: FORBIDDEN
GOV-STAFF-05〜12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-STAFF-03（権限停止期限）は COMPLETE。
Human が次残件として GOV-STAFF-04 を明示 SELECT し、
同一 Decision で Option C を Accepted した。
GOV-STAFF-04 は利用者異動台帳の保存先だけの最小単位であり、
確定者（01）・Entra 削除（02）・権限停止期限（03）・閲覧範囲（05）と分離できる。
```

## 2. Selected unit

```text
GOV-STAFF-04 — 利用者異動台帳の保存先
Question:
  利用者異動台帳の保存先はどこか？
```

## 3. Authorized IN

```text
IN:
  GOV-STAFF-04 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option C Acceptance の docs 固定（本 PR）
  Accepted GOV-STAFF-01〜03 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A / B / D の Agent 自動 Accepted
  台帳スキーマ・SharePoint リスト・サイト作成の発明
  支援記録の保存先変更・実データ移行
  GOV-STAFF-05〜12 の自動 SELECT または同時 Accepted
  GOV-STAFF-01〜03 の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | Accepted（該当分） | unrelated |
| GOV-STAFF-01 | Accepted / Option C | confirmer ≠ ledger storage |
| GOV-STAFF-02 | Accepted / Option B | Entra operator ≠ ledger storage |
| GOV-STAFF-03 | Accepted / Option A | suspension deadline ≠ ledger storage |
| GOV-STAFF-05〜12 | OPEN | 本 unit OUT |
| GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-STAFF-04** | 利用者異動台帳の保存先 | **SELECTED** |
| GOV-STAFF-05〜12 | 閲覧範囲 / 資格 等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-STAFF-04-SELECTION-1 = SELECTED / LOCKED
Option C = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  GOV-STAFF-05〜12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-04-user-transfer-ledger-storage-acceptance.md`
- Decision Packet: `decision-gov-staff-04-user-transfer-ledger-storage-decision-packet.md`
- Option C Acceptance: `decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md`
- Independent Review: `decision-gov-staff-04-user-transfer-ledger-storage-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
