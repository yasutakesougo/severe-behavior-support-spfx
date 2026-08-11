# GOV-RULE-11 — 制度値と法人運用値の境界 — Human Selection Packet

この文書は、GOV-RULE-10 COMPLETE（PR #269 MERGED）後の
**次 residual Decision** として **GOV-RULE-11** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-11-SELECTION-1
Kind: Human Selection（#19 residual / GOV-RULE-11）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-RULE-11
Date: 2026-08-11
PR: pending（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = f8718d8a057c8b1799a66512d1455a26140463f9
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01〜10 = Accepted / LOCKED（#266 MERGED）
  GOV-RULE-09 = Accepted / LOCKED / Option B（#268 MERGED）
  GOV-RULE-10 = Accepted / LOCKED / Option C（#269 MERGED）
  GOV-RULE-05 / 06 / 07 / 08 = Accepted（該当分；08 = NOT ADOPTED）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §B GOV-RULE-11
  #19 residual inventory row: GOV-RULE-11〜12
  Binding before this Decision: NONE → unit now SELECTED by Human

Fill-in Acceptance: NOT FILLED / NOT ACCEPTED
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent invent boundary classifications: FORBIDDEN
GOV-RULE-12 auto-SELECT: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-RULE-10（変更承認）は COMPLETE。
Human が次残件として GOV-RULE-11 を明示 SELECT した。
GOV-RULE-11 は制度値と法人運用値の境界だけの最小単位であり、
GOV-RULE-12（過去版訂正）と分離できる。
Issue #19 原文は A–D 択一ではなく、3 分類の fill-in である。
```

## 2. Selected unit

```text
GOV-RULE-11 — 制度値と法人運用値の境界
Question:
  制度上固定 / 法人運用変更可 / 事業所設定変更可 の境界は何か？
```

## 3. Authorized IN

```text
IN:
  GOV-RULE-11 を current residual unit とする
  Decision Packet（Issue #19 原文 3 分類 fill-in + HOLD）の docs 固定
  具体分類値は未記入のまま Human fill-in Acceptance 待ち
  Accepted GOV-RULE-05〜10 / GOV-AUD-01〜10 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  制度値・法人運用値・事業所設定値の Agent 発明 / 自動分類
  fill-in 3 分類の Agent 自動 Accepted
  ルール本文・日数・具体制度値の発明
  GOV-RULE-12 の自動 SELECT または同時 Accepted
  GOV-STAFF / GOV-PERF の自動 SELECT
  GOV-RULE-05〜10 / GOV-AUD-* の再 Decision
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
| GOV-RULE-09 | Accepted / Option B | content owner ≠ boundary |
| GOV-RULE-10 | Accepted / Option C | change approver ≠ boundary |
| GOV-RULE-12 | OPEN | 本 unit OUT |
| GOV-STAFF / GOV-PERF | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-RULE-11** | 制度値と法人運用値の境界 | **SELECTED** |
| GOV-RULE-12 | 過去ルール版の訂正 | NOT SELECTED |
| GOV-STAFF-01〜12 | 職員・利用者所属等 | NOT SELECTED |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-RULE-11-SELECTION-1 = SELECTED / LOCKED

HOLD:
  fill-in 3 分類 = NOT FILLED / NOT ACCEPTED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  GOV-RULE-12 = NOT SELECTED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: Human fill-in 3 分類 or HOLD
3. Fill-in Acceptance / LOCKED for GOV-RULE-11 only
4. Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-rule-11-value-boundary-acceptance.md`
- Decision Packet: `decision-gov-rule-11-value-boundary-decision-packet.md`
- Independent Review: `decision-gov-rule-11-value-boundary-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-rule-10-change-approver-option-c-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
