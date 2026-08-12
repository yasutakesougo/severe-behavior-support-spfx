# GOV-STAFF-01 — 異動・退職情報の確定者 — Human Selection Packet

この文書は、GOV-RULE-12 COMPLETE（PR #273 MERGED）後の
**次 residual Decision** として **GOV-STAFF-01** を固定する docs-only Selection Packet である。

本 PR では unit Selection と Option C Acceptance を同一 Draft に記録する
（Human Decision 明示。GOV-STAFF-02+ は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-01-SELECTION-1
Kind: Human Selection（#19 residual / GOV-STAFF-01）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-STAFF-01
Date: 2026-08-12
PR: pending（Selection / Packet / SELECT Acceptance / Option C Acceptance / IR）

Baseline:
  main tip = befd8460d03e2085583a328882d60f045916ea8f
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-09〜12 = Accepted（該当分；#273 MERGED）
  GOV-RULE-05 / 06 / 07 / 08 = Accepted（該当分；08 = NOT ADOPTED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §A GOV-STAFF-01
  #19 residual inventory row: GOV-STAFF-01〜12
  Prior non-binding recommendation: Option tip C
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option C
  （decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A/B/D: FORBIDDEN
GOV-STAFF-02〜12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-RULE-09〜12 は COMPLETE。
Human が次残件として GOV-STAFF-01 を明示 SELECT し、
同一 Decision で Option C を Accepted した。
GOV-STAFF-01 は異動・退職情報の確定者だけの最小単位であり、
GOV-STAFF-02（Entra 削除実施者）以降と分離できる。
GOV-PERF は本 unit OUT。
```

## 2. Selected unit

```text
GOV-STAFF-01 — 異動・退職情報の確定者
Question:
  異動・退職情報の確定者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-STAFF-01 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option C Acceptance の docs 固定（本 PR）
  Accepted GOV-RULE-* / GOV-AUD-* との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A / B / D の Agent 自動 Accepted
  異動・退職ワークフロー画面・Entra mutation の発明
  事業所管理者・法人担当の個人名確定
  GOV-STAFF-02〜12 の自動 SELECT または同時 Accepted
  GOV-PERF の自動 SELECT
  GOV-RULE-* / GOV-AUD-* の再 Decision
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜10 | Accepted（該当分） | unrelated / complete cycle |
| GOV-RULE-05〜12 | Accepted（該当分） | rule governance ≠ staff transfer confirmer |
| GOV-STAFF-02〜12 | OPEN | 本 unit OUT |
| GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-STAFF-01** | 異動・退職情報の確定者 | **SELECTED** |
| GOV-STAFF-02〜12 | Entra削除 / 権限停止 / 異動台帳 等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-STAFF-01-SELECTION-1 = SELECTED / LOCKED
Option C = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  GOV-STAFF-02〜12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-staff-01-transfer-retirement-confirmer-acceptance.md`
- Decision Packet: `decision-gov-staff-01-transfer-retirement-confirmer-decision-packet.md`
- Option C Acceptance: `decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md`
- Independent Review: `decision-gov-staff-01-transfer-retirement-confirmer-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-rule-12-version-correction-option-b-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
