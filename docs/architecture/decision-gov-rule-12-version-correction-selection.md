# GOV-RULE-12 — 過去ルール版の訂正 — Human Selection Packet

この文書は、GOV-RULE-11 COMPLETE（PR #271 MERGED）後の
**次 residual Decision** として **GOV-RULE-12** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-12-SELECTION-1
Kind: Human Selection（#19 residual / GOV-RULE-12）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-RULE-12
Date: 2026-08-12
PR: #272（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = fb71d4cec05f7d1edfb27c3aacb8a894b1dc5fc8
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-09 = Accepted / LOCKED / Option B（#268 MERGED）
  GOV-RULE-10 = Accepted / LOCKED / Option C（#269 MERGED）
  GOV-RULE-11 = Accepted / LOCKED（fill-in；#271 MERGED）
  GOV-RULE-05 / 06 / 07 / 08 = Accepted（該当分；08 = NOT ADOPTED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §B GOV-RULE-12
  #19 residual inventory row: GOV-RULE-12
  Prior non-binding recommendation: Option tip B
    （訂正版を新規作成し、旧版を保持）
  Binding before this Decision: NONE → unit now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option B
  （decision-gov-rule-12-version-correction-option-b-acceptance.md）
Option B status: Accepted / LOCKED（prior tip was NON-BINDING）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-RULE-11（制度値/運用境界）は COMPLETE。
Human が次残件として GOV-RULE-12 を明示 SELECT した。
GOV-RULE-12 は過去ルール版の訂正だけの最小単位であり、
GOV-RULE-09 / 10 / 11 と分離できる。
Option B は設計推奨として指定されているが、まだ NON-BINDING。
```

## 2. Selected unit

```text
GOV-RULE-12 — 過去ルール版の訂正
Question:
  過去ルール版の訂正をどう扱うか？
```

## 3. Authorized IN

```text
IN:
  GOV-RULE-12 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  Option B tip を NON-BINDING として明示（Accepted しない）
  Accepted GOV-RULE-05〜11 / GOV-AUD-01〜10 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted（Option B tip 含む）
  訂正 UI・版管理実装・ルール本文の発明
  GOV-RULE-09 / 10 / 11 の再 Decision
  GOV-STAFF / GOV-PERF の自動 SELECT
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
| GOV-RULE-09 | Accepted / Option B | content owner ≠ version correction |
| GOV-RULE-10 | Accepted / Option C | change approver ≠ version correction |
| GOV-RULE-11 | Accepted（fill-in） | value boundary ≠ version correction |
| GOV-STAFF / GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-RULE-12** | 過去ルール版の訂正 | **SELECTED** |
| GOV-STAFF-01〜12 | 職員・利用者所属等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-RULE-12-SELECTION-1 = SELECTED / LOCKED
Option B = Accepted / LOCKED（別 Acceptance）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
```

## 8. Next（Human only）

```text
Consumed:
  Unit Selection PR #272 = MERGED
  Human Option = B

Current Option Acceptance PR:
  1. Independent Review → Human Ready → Human Merge
  2. After Merge: Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-rule-12-version-correction-acceptance.md`
- Decision Packet: `decision-gov-rule-12-version-correction-decision-packet.md`
- Option B Acceptance: `decision-gov-rule-12-version-correction-option-b-acceptance.md`
- Independent Review（Selection）: `decision-gov-rule-12-version-correction-independent-review.md`
- Independent Review（Option B）: `decision-gov-rule-12-version-correction-option-b-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-rule-11-value-boundary-fill-in-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
